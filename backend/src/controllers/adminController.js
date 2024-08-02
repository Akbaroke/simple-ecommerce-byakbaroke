import prisma from '../../prisma/client.js';

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users.map((user) => ({ ...user, password: undefined })));
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Failed to fetch user', message: err.message });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, imgUrl, address, contact, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        imgUrl,
        address,
        contact,
        role,
      },
    });

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id: id },
    });

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Failed to delete user' });
  }
};