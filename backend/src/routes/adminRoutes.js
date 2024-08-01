import express from 'express';
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from '../controllers/adminController.js';
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
  '/users/:id',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  getUserById
);
router.put(
  '/users/:id',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  updateUserById
);

router.delete(
  '/users/:id',
  authenticateToken,
  authorizeRole(UserRole.ADMIN),
  deleteUserById
);

export default router;
