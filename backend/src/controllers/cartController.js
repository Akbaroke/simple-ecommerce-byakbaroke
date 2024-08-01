import prisma from '../../prisma/client.js';

export const addToCart = async (req, res) => {
  const { items } = req.body;

  try {
    await prisma.cart.upsert({
      where: { userId: req.user.userId },
      update: { items },
      create: { userId: req.user.userId, items },
    });

    res.json({ message: 'Item added to cart successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add to cart' });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
    });

    if (!cart) {
      return res.json({ list: [], total_item: 0, total_price: 0 });
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: cart.items.map((item) => item.id),
        },
      },
    });

    const cartDetails = cart.items.map((cartItem) => {
      const product = products.find((product) => product.id === cartItem.id);
      const quantity = cartItem.quantity || 1;
      return {
        ...product,
        quantity,
        total_price: product.price * quantity,
      };
    });

    const total_item = cartDetails.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const total_price = cartDetails.reduce(
      (sum, item) => sum + item.total_price,
      0
    );

    res.json({
      list: cartDetails,
      total_item,
      total_price,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch cart details' });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.userId },
    });

    const updatedItems = cart.items.filter((item) => item.id !== itemId);

    if (updatedItems.length === 0) {
      await prisma.cart.delete({
        where: { userId: req.user.userId },
      });
    } else {
      await prisma.cart.update({
        where: { userId: req.user.userId },
        data: { items: updatedItems },
      });
    }

    res.json({ message: 'Item removed from cart successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove item from cart' });
  }
};

export const removeAllCart = async (req, res) => {
  try {
    await prisma.cart.delete({
      where: { userId: req.user.userId },
    });

    res.json({ message: 'All items removed from cart successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove all items from cart' });
  }
};
