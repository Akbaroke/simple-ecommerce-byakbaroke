import express from 'express';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../controllers/favoriteController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, addFavorite);
router.get('/', authenticateToken, getFavorites);
router.delete('/:productId', authenticateToken, removeFavorite);

export default router;
