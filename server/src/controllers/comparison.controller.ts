import { Request, Response } from 'express';
import { Product, Brand, Category, Price } from '../db/models/index.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { generateComparison } from '../services/openai.js';

export const compareProducts = asyncHandler(async (req: Request, res: Response) => {
  const { productIds, attributes } = req.body;

  // Fetch products with their prices
  const products = await Product.findAll({
    where: {
      id: productIds,
      status: 'active',
    },
    include: [
      { model: Brand, as: 'brand' },
      { model: Category, as: 'category' },
      { model: Price, as: 'prices' },
    ],
  });

  if (products.length !== productIds.length) {
    throw new AppError('One or more products not found', 404);
  }

  // Prepare product data for AI
  const productsForComparison = products.map((product: any) => {
    const prices = product.prices || [];
    const minPrice = prices.length > 0
      ? Math.min(...prices.map((p: any) => parseFloat(p.price)))
      : null;

    return {
      id: product.id,
      name: product.name,
      brandName: product.brand?.name,
      categoryName: product.category?.name,
      description: product.description,
      specs: product.specs,
      minPrice,
    };
  });

  // Generate AI comparison
  let aiComparison;
  try {
    const comparisonResult = await generateComparison({
      products: productsForComparison,
      attributes,
    });
    aiComparison = comparisonResult.comparison;
  } catch (error) {
    console.error('AI comparison failed:', error);
    aiComparison = null;
  }

  res.json({
    status: 'success',
    data: {
      products,
      aiComparison,
      comparisonMatrix: buildComparisonMatrix(products, attributes),
    },
  });
});

function buildComparisonMatrix(products: any[], attributes?: string[]) {
  const matrix: any = {
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand?.name,
    })),
    attributes: [],
  };

  // Common attributes
  const commonAttrs = ['name', 'brand', 'price'];

  // If specific attributes requested, use those
  if (attributes && attributes.length > 0) {
    matrix.attributes = attributes.map(attr => ({
      name: attr,
      values: products.map(p => p.specs?.[attr] || 'N/A'),
    }));
  } else {
    // Otherwise, find common spec keys
    const allSpecKeys = new Set<string>();
    products.forEach(p => {
      if (p.specs) {
        Object.keys(p.specs).forEach(key => allSpecKeys.add(key));
      }
    });

    matrix.attributes = Array.from(allSpecKeys).map(key => ({
      name: key,
      values: products.map(p => p.specs?.[key] || 'N/A'),
    }));
  }

  // Add price comparison
  matrix.attributes.unshift({
    name: 'Starting Price',
    values: products.map(p => {
      const prices = p.prices || [];
      if (prices.length === 0) return 'N/A';
      const minPrice = Math.min(...prices.map((price: any) => parseFloat(price.price)));
      return `$${minPrice.toFixed(2)}`;
    }),
  });

  return matrix;
}
