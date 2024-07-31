import prisma from '../../prisma/client.js';

export const addFavorite = async (req, res) => {
  const { productId } = req.body;

  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        productId,
      },
    });

    res.json(favorite);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to favorites' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.userId },
      include: { product: true },
    });

    res.json(favorites);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch favorites' });
  }
};

export const removeFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.favorite.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove from favorites' });
  }
};
