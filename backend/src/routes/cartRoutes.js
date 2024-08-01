import express from 'express';
import {
  addToCart,
  getCart,
  removeAllCart,
  removeFromCart,
} from '../controllers/cartController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, addToCart);
router.get('/', authenticateToken, getCart);
router.delete('/:itemId', authenticateToken, removeFromCart);
router.delete('/', authenticateToken, removeAllCart); 

export default router;
