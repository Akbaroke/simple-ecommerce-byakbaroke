import prisma from '../../prisma/client.js';

export const addToCart = async (req, res) => {
  const { items } = req.body;

  try {
    const cart = await prisma.cart.upsert({
      where: { userId: req.user.userId },
      update: { items },
      create: { userId: req.user.userId, items },
    });

    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
    });

    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch cart' });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
    });

    const updatedItems = cart.items.filter((item) => item.id !== itemId);

    const updatedCart = await prisma.cart.update({
      where: { userId: req.user.userId },
      data: { items: updatedItems },
    });

    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove item from cart' });
  }
};
