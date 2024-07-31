import express from 'express';
import { getUsers, getOrders } from '../controllers/adminController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
  '/users',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  getUsers
);
router.get(
  '/orders',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  getOrders
);

export default router;
