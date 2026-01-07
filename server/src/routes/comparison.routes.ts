import { Router } from 'express';
import { body } from 'express-validator';
import { compareProducts } from '../controllers/comparison.controller.js';
import { validate } from '../middleware/validator.js';

const router = Router();

// Compare products
router.post(
  '/',
  [
    body('productIds').isArray({ min: 2, max: 5 }).withMessage('Must compare 2-5 products'),
    body('productIds.*').isUUID(),
    body('attributes').optional().isArray(),
  ],
  validate,
  compareProducts
);

export default router;
