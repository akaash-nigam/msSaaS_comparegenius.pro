import { Request, Response } from 'express';
import { Product, Brand, Category, Price, Retailer } from '../db/models/index.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { indexProduct } from '../services/elasticsearch.js';
import { generateProductSummary } from '../services/openai.js';

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const { rows: products, count } = await Product.findAndCountAll({
    where: { status: 'active' },
    include: [
      { model: Brand, as: 'brand' },
      { model: Category, as: 'category' },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  res.json({
    status: 'success',
    data: {
      products,
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit),
        limit,
      },
    },
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id, {
    include: [
      { model: Brand, as: 'brand' },
      { model: Category, as: 'category' },
      {
        model: Price,
        as: 'prices',
        include: [{ model: Retailer, as: 'retailer' }],
      },
    ],
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Generate AI summary if not cached
  let summary;
  try {
    summary = await generateProductSummary({
      id: product.id,
      name: product.name,
      brandName: (product as any).brand?.name,
      categoryName: (product as any).category?.name,
      description: product.description,
      specs: product.specs,
    });
  } catch (error) {
    // If AI fails, continue without summary
    summary = null;
  }

  res.json({
    status: 'success',
    data: {
      product,
      aiSummary: summary,
    },
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const productData = req.body;

  const product = await Product.create(productData);

  // Index in Elasticsearch
  try {
    await indexProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      specs: product.specs,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    // Log but don't fail the request
    console.error('Failed to index product:', error);
  }

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const product = await Product.findByPk(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await product.update(updates);

  // Re-index in Elasticsearch
  try {
    await indexProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      specs: product.specs,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    console.error('Failed to re-index product:', error);
  }

  res.json({
    status: 'success',
    data: { product },
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await product.destroy();

  res.json({
    status: 'success',
    message: 'Product deleted successfully',
  });
});

export const getProductPrices = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const prices = await Price.findAll({
    where: { productId: id },
    include: [{ model: Retailer, as: 'retailer' }],
    order: [['price', 'ASC']],
  });

  res.json({
    status: 'success',
    data: { prices },
  });
});
