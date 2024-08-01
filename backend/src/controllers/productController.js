import prisma from '../../prisma/client.js';

export const createProduct = async (req, res) => {
  const { name, price, brand, image, stock, description } = req.body;

  try {
    await prisma.product.create({
      data: {
        name,
        price,
        brand,
        image,
        stock, 
        description,
        userId: req.user.userId,
      },
    });

    res.json({ message: 'Product created successfully.' });
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
      where: { id: id },
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, brand, image, stock, description } = req.body;

  try {
    await prisma.product.update({
      where: { id: id },
      data: { name, price, brand, image, stock, description },
    });

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete product' });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await prisma.product.groupBy({
      by: ['brand'],
      _count: { _all: true },
    });
    res.json(
      brands.map((brand) => {
        return { name: brand.brand, count: brand._count._all };
      })
    );
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch brands' });
  }
};