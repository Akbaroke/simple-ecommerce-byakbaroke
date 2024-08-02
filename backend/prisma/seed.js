import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const productsData = JSON.parse(
    fs.readFileSync('./prisma/products.json', 'utf-8')
  );

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '$2a$10$nFbcCJiMg2yN2PSUbWFhmelHkcsBInhQSSjcPj9/l5F2E/NFGmnrm',
      role: 'ADMIN',
    },
  });

  for (const product of productsData) {
    const uid = uuidv4();
    await prisma.product.upsert({
      where: { id: uid },
      update: {},
      create: {
        id: uid,
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description,
        brand: product.brand,
        image: product.image,
      },
    });
  }

  console.log('Seed data completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
