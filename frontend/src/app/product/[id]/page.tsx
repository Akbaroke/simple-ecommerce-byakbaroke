'use client';
import Counting from '@/components/molecules/Counting';
import TooltipFrag from '@/components/molecules/TooltipFrag';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentToken } from '@/hooks/use-current-token';
import { ProductModel } from '@/interfaces/product';
import { StoreModel } from '@/interfaces/redux-model';
import { formatRupiah } from '@/lib/formatCurrency';
import {
  addCart,
  decrementQuantityCart,
  incrementQuantityCart,
} from '@/redux/slices/cartSlice';
import { toggleFavorite } from '@/redux/slices/favoriteSlice';
import { getProductById } from '@/service/product';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState, useTransition } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { LiaCartPlusSolid } from 'react-icons/lia';
import { useDispatch, useSelector } from 'react-redux';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const token = useCurrentToken();
  const encodedCallbackUrl = encodeURIComponent(pathname);
  const favorite = useSelector((state: StoreModel) => state.favorite);

  const [product, setProduct] = useState<ProductModel>();
  const [isPending, startTransition] = useTransition();
  const cart = useSelector((state: StoreModel) => state.cart);

  const fetchProduct = async (id: string) => {
    const response = await getProductById(id);
    setProduct(response);
    if (response === null) {
      router.replace('/');
    }
  };

  useEffect(() => {
    if (params.id) {
      startTransition(() => {
        fetchProduct(params.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDecrementQuantity = () => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    if (product?.id)
      return dispatch(
        decrementQuantityCart({ productId: product?.id, token: token.token })
      );
  };
  const handleIncrementQuantity = async () => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    if (product) {
      if (
        cart.list.find((item) => item.id === product?.id)?.quantity &&
        product?.id
      ) {
        return dispatch(
          incrementQuantityCart({ productId: product?.id, token: token.token })
        );
      }
      dispatch(addCart({ product, token: token.token }));
    }
  };

  const handleClickFavorite = (event: React.MouseEvent) => {
    if (!token) {
      const encodedCallbackUrl = encodeURIComponent(pathname);
      return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    }
    if (product) {
      dispatch(toggleFavorite({ product, token: token.token }));
    }
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
          Product Details
        </h1>
      </div>
      <Card x-chunk="dashboard-07-chunk-0" className="w-full">
        <CardContent className="p-10 grid gap-4 md:grid-cols-[1fr_500px] lg:grid-cols-4 lg:gap-8 w-full">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Image
              className="w-full h-full rounded-xl"
              src={product?.image || 'https://ui.shadcn.com/placeholder.svg'}
              alt="Product picture"
              width={500}
              height={500}
            />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="font-bold text-xl">{product?.name}</h1>
              <p className="text-2xl font-light drop-shadow-2xl">
                Rp {formatRupiah(product?.price ?? 0)}
              </p>
            </div>
            {product?.description && (
              <>
                <Separator className="my-1" />
                <div className="flex flex-col gap-4">
                  <h1 className="font-bold text-xl">Description :</h1>
                  <p className="text-justify">{product?.description}</p>
                  <Badge variant="secondary" className="w-max">
                    {product?.brand}
                  </Badge>
                </div>
              </>
            )}
            <Separator className="my-1" />
            <div className="flex flex-col gap-5">
              {(product?.stock ?? 0) > 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  {product?.stock} items left in stock
                </p>
              ) : (
                <p className="text-sm text-destructive italic">
                  product is out of stock
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                {cart.list.find((item) => item.id === product?.id)?.quantity ? (
                  <Counting
                    minCount={0}
                    maxCount={product?.stock}
                    onDecrement={handleDecrementQuantity}
                    onIncrement={handleIncrementQuantity}
                    disabled={product?.stock === 0}
                    initialCount={
                      cart.list.find((item) => item.id === product?.id)
                        ?.quantity
                    }
                  />
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleIncrementQuantity}
                    disabled={product?.stock === 0}>
                    <LiaCartPlusSolid size={20} className="mr-2" />
                    Add to cart
                  </Button>
                )}
                <TooltipFrag content="Add to favorite">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleClickFavorite}>
                    {favorite.list.some((item) => item.id === params.id) ? (
                      <FaHeart size={20} className="text-red-500" />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                  </Button>
                </TooltipFrag>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
