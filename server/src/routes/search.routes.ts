import { Router } from 'express';
import { query } from 'express-validator';
import { searchProducts } from '../controllers/search.controller.js';
import { validate } from '../middleware/validator.js';

const router = Router();

// Search products
router.get(
  '/',
  [
    query('q').optional().trim(),
    query('category').optional().trim(),
    query('brand').optional().trim(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  searchProducts
);

export default router;
