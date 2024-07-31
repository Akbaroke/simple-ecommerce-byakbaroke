import express from 'express';
import {
  register,
  login,
  resetPassword,
  me,
} from '../controllers/authController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, me);

export default router;
