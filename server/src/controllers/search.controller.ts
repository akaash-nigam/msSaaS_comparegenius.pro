import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { searchProducts as esSearchProducts } from '../services/elasticsearch.js';

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    q: query,
    category,
    brand,
    minPrice,
    maxPrice,
    page = 1,
    limit = 20,
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const from = (pageNum - 1) * limitNum;

  const filters: any = {
    from,
    size: limitNum,
  };

  if (category) filters.category = category;
  if (brand) filters.brand = brand;
  if (minPrice) filters.minPrice = parseFloat(minPrice as string);
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);

  const results = await esSearchProducts(query as string || '', filters);

  res.json({
    status: 'success',
    data: {
      products: results.products,
      pagination: {
        total: results.total,
        page: pageNum,
        pages: Math.ceil(results.total / limitNum),
        limit: limitNum,
      },
    },
  });
});
