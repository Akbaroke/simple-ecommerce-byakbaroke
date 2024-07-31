import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client.js';
import { generateToken } from '../utils/tokenUtils.js';
import generateImageUrl from '../utils/generateImageUrl.js';

const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        imgUrl: generateImageUrl(name),
      },
    });

    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      imgUrl: user.imgUrl,
    };

    const backendTokens = {
      token: generateToken(payload),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };

    res.json({
      message: 'Login successful',
      user: payload,
      backendTokens,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ error: 'Error resetting password' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      imgUrl: user.imgUrl,
    };

    const backendTokens = {
      token: generateToken(payload),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };

    res.json({
      message: 'Update token successful',
      user: payload,
      backendTokens,
    });
  } catch (err) {
    res.status(400).json({ error: 'Error fetching profile' });
  }
};
