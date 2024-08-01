import prisma from '../../prisma/client.js';

export const addFavorite = async (req, res) => {
  const { productId } = req.body;

  try {
    await prisma.favorite.create({
      data: {
        userId: req.user.userId,
        productId,
      },
    });

    res.json({ message: 'Added to favorites successfully.' });
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

    res.json(
      favorites.map((favorite) => ({
        ...favorite.product,
        id: favorite.product.id,
        favoriteId: favorite.id,
        createdAt: favorite.createdAt,
        updatedAt: favorite.updatedAt,
      }))
    );
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch favorites' });
  }
};

export const removeFavorite = async (req, res) => {
  const { productId } = req.params;

  try {
    await prisma.favorite.deleteMany({
      where: {
        productId: productId,
        userId: req.user.userId,
      },
    });

    res.json({ message: 'Removed from favorites successfully.' });
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Failed to remove from favorites', message: err });
  }
};
