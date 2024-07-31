import prisma from '../../prisma/client.js';

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error fetching profile' });
  }
};

export const updateProfile = async (req, res) => {
  const { name, imgUrl, address, contact } = req.body;

  try {
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { name, imgUrl, address, contact },
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error updating profile' });
  }
};
