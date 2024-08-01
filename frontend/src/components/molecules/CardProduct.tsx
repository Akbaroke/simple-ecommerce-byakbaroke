'use client';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { formatRupiah } from '@/lib/formatCurrency';
import { Badge } from '../ui/badge';
import TooltipFrag from './TooltipFrag';
import { Button } from '../ui/button';
import { LiaCartPlusSolid } from 'react-icons/lia';
import { CiHeart } from 'react-icons/ci';
import { useRouter } from 'next-nprogress-bar';
import { cn } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import { ProductModel } from '@/interfaces/product';
import { addCart } from '@/redux/slices/cartSlice';
import { useCurrentToken } from '@/hooks/use-current-token';
import { usePathname } from 'next/navigation';

type Props = {
  data: ProductModel;
  href?: string;
};

export default function CardProduct({ data, href }: Props) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const token = useCurrentToken();

  const { name, price, brand, image } = data;

  const validateImageUrl = (url: string) => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/.test(url);
  };

  const imageValidation = validateImageUrl(image)
    ? image
    : 'https://ui.shadcn.com/placeholder.svg';

  const handleClickFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleClickCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!token) {
      const encodedCallbackUrl = encodeURIComponent(pathname);
      return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    }
    dispatch(addCart({ product: data, token: token.token }));
  };

  const Component = () => (
    <Card
      className={cn('max-w-[350px] h-full', {
        'cursor-pointer hover:shadow-xl transition-all duration-300 ': href,
      })}>
      <CardHeader className="relative">
        <Image
          alt="Product image"
          className="aspect-square w-full h-[280px] rounded-md object-cover"
          src={imageValidation}
          width={400}
          height={400}
        />
        {validateImageUrl(image) && (
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full absolute top-2 right-4"
            onClick={handleClickFavorite}>
            <CiHeart size={25} />
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
            className="rounded-full shadow-xl transition-all duration-300"
            onClick={handleClickCart}>
            <LiaCartPlusSolid size={25} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return href ? (
    <div onClick={() => router.push(href)}>
      <Component />
    </div>
  ) : (
    <Component />
  );
}
