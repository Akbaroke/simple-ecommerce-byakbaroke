'use client';
import { useEffect, useState } from 'react';
import CardProduct from '@/components/molecules/CardProduct';
import { BrandCountModel, ProductModel } from '@/interfaces/product';
import { getBrands, getProducts } from '@/service/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [brands, setBrands] = useState<BrandCountModel[]>([]);
  const [brandSelected, setBrandSelected] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, brandData] = await Promise.all([
          getProducts(),
          getBrands(),
        ]);

        setProducts(productData ?? []);
        setBrands(brandData ?? []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = brandSelected
    ? products.filter((product) => product.brand === brandSelected)
    : products;

  return (
    <div className="max-w-[1500px] mx-auto px-5 relative">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        {brands.map((brand) => (
          <Button
            variant={brandSelected === brand.name ? 'default' : 'outline'}
            key={brand.name}
            className="flex-shrink-0"
            onClick={() =>
              setBrandSelected((prev) =>
                prev === brand.name ? '' : brand.name
              )
            }>
            {brand.name}{' '}
            <Badge
              className="px-1.5 py-[0.5px] ml-2 text-sm"
              variant="secondary">
              {brand.count}
            </Badge>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredProducts.map((product) => (
          <CardProduct
            key={product.id}
            data={product}
            href={`/product/${product.id}`}
          />
        ))}
      </div>
    </div>
  );
}
