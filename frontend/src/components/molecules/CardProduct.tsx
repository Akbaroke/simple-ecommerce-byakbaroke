'use client';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { formatRupiah } from '@/lib/formatCurrency';
import { Badge } from '../ui/badge';
import TooltipFrag from './TooltipFrag';
import { Button } from '../ui/button';
import { LiaCartPlusSolid } from 'react-icons/lia';
import { useRouter } from 'next-nprogress-bar';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { ProductModel } from '@/interfaces/product';
import { addCart } from '@/redux/slices/cartSlice';
import { useCurrentToken } from '@/hooks/use-current-token';
import { usePathname } from 'next/navigation';
import { StoreModel } from '@/interfaces/redux-model';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toggleFavorite } from '@/redux/slices/favoriteSlice';
import LazyLoad from 'react-lazy-load';

type Props = {
  data: ProductModel;
  href?: string;
};

export default function CardProduct({ data, href }: Props) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const token = useCurrentToken();
  const { list } = useSelector((state: StoreModel) => state.favorite);

  const { name, price, brand, image, stock } = data;

  const validateImageUrl = (url: string) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/.test(url);
  };

  const imageValidation = validateImageUrl(image)
    ? image
    : 'https://ui.shadcn.com/placeholder.svg';

  const handleClickFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!token) {
      const encodedCallbackUrl = encodeURIComponent(pathname);
      return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    }
    dispatch(toggleFavorite({ product: data, token: token.token }));
  };

  const handleClickCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!token) {
      const encodedCallbackUrl = encodeURIComponent(pathname);
      return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    }
    dispatch(addCart({ product: data, token: token.token }));
  };

  return (
    <Card
      data-aos="fade-up"
      onClick={() => (href ? router.push(href) : null)}
      className={cn('sm:max-w-[350px] rounded-xl h-full w-full', {
        'cursor-pointer hover:shadow-xl transition-all duration-300 ': href,
      })}>
      <CardHeader className="relative">
        <LazyLoad>
          <Image
            alt="Product image"
            className="aspect-square w-full h-[280px] rounded-md object-cover bg-muted"
            src={imageValidation || 'https://ui.shadcn.com/placeholder.svg'}
            width={400}
            height={400}
          />
        </LazyLoad>
        {validateImageUrl(image) && (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full absolute top-2 right-4"
            onClick={handleClickFavorite}>
            {list.some((item) => item.id === data.id) ? (
              <FaHeart size={20} className="text-red-500" />
            ) : (
              <FaRegHeart size={20} />
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <TooltipFrag content={name}>
          <h1 className="line-clamp-1 text-xl font-semibold">{name}</h1>
        </TooltipFrag>
        {price > 0 && (
          <p className="text-lg font-light drop-shadow-2xl">
            Rp {formatRupiah(price)}
          </p>
        )}
      </CardContent>
      {brand && (
        <CardFooter className="flex justify-between items-end">
          <Badge variant="secondary">{brand}</Badge>
          <Button
            size="icon"
            variant="default"
            disabled={stock <= 0}
            className="rounded-full shadow-xl transition-all duration-300"
            onClick={handleClickCart}>
            <LiaCartPlusSolid size={25} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
