import { Router } from 'express';
import { param, body } from 'express-validator';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductPrices,
} from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', [param('id').isUUID()], validate, getProductById);
router.get('/:id/prices', [param('id').isUUID()], validate, getProductPrices);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('admin', 'moderator'),
  [
    body('name').notEmpty().trim(),
    body('brandId').optional().isUUID(),
    body('categoryId').optional().isUUID(),
    body('description').optional().trim(),
    body('imageUrl').optional().isURL(),
    body('specs').optional().isObject(),
  ],
  validate,
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'moderator'),
  [param('id').isUUID()],
  validate,
  updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isUUID()],
  validate,
  deleteProduct
);

export default router;
