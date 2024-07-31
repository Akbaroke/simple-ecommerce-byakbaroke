import prisma from '../../prisma/client.js';

export const createProduct = async (req, res) => {
  const { name, price, brand, image } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        brand,
        image,
        userId: req.user.userId,
      },
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, brand, image } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price, brand, image },
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
};
