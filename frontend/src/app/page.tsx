'use client';
import CardProduct from '@/components/molecules/CardProduct';
import { BrandCountModel, ProductModel } from '@/interfaces/product';
import { getBrands, getProducts } from '@/service/product';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [brands, setBrands] = useState<BrandCountModel[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      setProducts(response ?? []);
    };
    const fetchBrands = async () => {
      const response = await getBrands();
      setBrands(response ?? []);
    };

    fetchProducts();
    fetchBrands();
  }, []);

  return (
    <div className="max-w-[1500px] mx-auto px-5 relative">
      {/* <h1 className="text-5xl text-foreground/70 max-w-2xl leading-snug">
        <b className="font-bold text-foreground">Store.</b> The best way to buy
        the products you love.
      </h1> */}
      <div className="my-10 flex flex-wrap items-center gap-3">
        {brands.map((brand, index) => (
          <Button variant="outline" key={index} className="flex-shrink-0">
            {brand.name}{' '}
            <Badge
              className="px-1.5 py-[0.5px] ml-2 text-[10px]"
              variant="secondary">
              {brand.count}
            </Badge>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {products.map((product) => (
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
