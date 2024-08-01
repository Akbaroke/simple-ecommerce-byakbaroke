import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllBrands,
} from '../controllers/productController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  createProduct
);
router.get('/', getProducts);
router.get('/brands', getAllBrands);
router.get('/:id', getProductById);
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  updateProduct
);
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  deleteProduct
);

export default router;
