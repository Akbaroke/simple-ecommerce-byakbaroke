'use client';
import { useEffect, useState } from 'react';
import CardProduct from '@/components/molecules/CardProduct';
import { BrandCountModel, ProductModel } from '@/interfaces/product';
import { getBrands, getProducts } from '@/service/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';
import { StoreModel } from '@/interfaces/redux-model';
import Spinner from '@/components/ui/spinner';

export default function Home() {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [brands, setBrands] = useState<BrandCountModel[]>([]);
  const [brandSelected, setBrandSelected] = useState<string>('');
  const search = useSelector((state: StoreModel) => state.search);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productData, brandData] = await Promise.all([
          getProducts(),
          getBrands(),
        ]);

        setProducts(productData ?? []);
        setBrands(brandData ?? []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (search.value) {
      setBrandSelected('');
    }
  }, [search.value]);

  const searchResults = products.filter((product) =>
    product.name.toLowerCase().includes(search.value.toLowerCase())
  );

  const filteredProducts = brandSelected
    ? products.filter((product) => product.brand === brandSelected)
    : products;

  return (
    <div className="max-w-[1500px] mx-auto px-5 relative w-full">
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
      {search.value && (
        <p className="italic text-muted-foreground text-lg mb-5">
          Product search results for: {`"${search.value}"`}
        </p>
      )}
      {brandSelected && (
        <p className="italic text-muted-foreground text-lg mb-5">
          Filter product from brand: {`"${brandSelected}"`}
        </p>
      )}
      {isLoading && (
        <div className="flex items-center justify-center py-40">
          <Spinner />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full place-items-center">
        {(search.value ? searchResults : filteredProducts).map((product) => (
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
