import prisma from '../../prisma/client.js';

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch users' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true },
    });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch orders' });
  }
};
