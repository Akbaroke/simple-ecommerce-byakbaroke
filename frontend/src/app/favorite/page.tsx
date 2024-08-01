'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrentToken } from '@/hooks/use-current-token';
import { ProductModel } from '@/interfaces/product';
import { StoreModel } from '@/interfaces/redux-model';
import { formatRupiah } from '@/lib/formatCurrency';
import { restoreFavorite, toggleFavorite } from '@/redux/slices/favoriteSlice';
import { getFavorite } from '@/service/favorite';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import LazyLoad from 'react-lazy-load';

export default function FavoritePage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const token = useCurrentToken();
  const encodedCallbackUrl = encodeURIComponent(pathname);
  const { list, total_item } = useSelector(
    (state: StoreModel) => state.favorite
  );

  useEffect(() => {
    if (token) {
      getFavorite(token.token).then((response) => {
        if (response) {
          dispatch(restoreFavorite(response));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = (data: ProductModel) => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    dispatch(toggleFavorite({ product: data, token: token.token }));
  };

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.replace('/')}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Favorite
        </h1>
      </div>
      <Card x-chunk="dashboard-07-chunk-0" className="w-full">
        <CardContent className="flex flex-col gap-5 w-full p-3">
          {list?.length === 0 && (
            <p className="text-center text-lg italic text-muted-foreground">
              Favorite is empty 🙏
            </p>
          )}
          {list?.map((product, index) => (
            <div
              data-aos="fade-up"
              key={index}
              className="flex gap-8 p-5 w-full items-center hover:bg-muted rounded-lg transition-all duration-300">
              <LazyLoad className="w-full">
                <Image
                  src={product.image || 'https://ui.shadcn.com/placeholder.svg'}
                  alt={product.name}
                  width={100}
                  height={100}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="w-[150px] h-[150px] rounded-2xl hover:scale-105 transition-all duration-30 cursor-pointer"
                />
              </LazyLoad>
              <div className="flex-1 w-full h-full relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full absolute top-0 right-2"
                  onClick={() => (product.id ? handleDelete(product) : null)}>
                  {list.some((item) => item.id === product.id) ? (
                    <FaHeart size={25} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={25} />
                  )}
                </Button>
                <div className="flex flex-col gap-5">
                  <Badge variant="secondary" className="w-max">
                    {product.brand}
                  </Badge>
                  <h1 className="line-clamp-1 text-lg">{product.name}</h1>
                  <p className="text-sm text-muted-foreground font-light">
                    Rp {formatRupiah(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
