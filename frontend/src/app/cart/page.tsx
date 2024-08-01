'use client';
import Counting from '@/components/molecules/Counting';
import Notify from '@/components/molecules/Notify';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentToken } from '@/hooks/use-current-token';
import { ProductModel } from '@/interfaces/product';
import { StoreModel } from '@/interfaces/redux-model';
import { formatRupiah } from '@/lib/formatCurrency';
import {
  addCart,
  decrementQuantityCart,
  deleteAllCart,
  deleteCart,
  incrementQuantityCart,
  restoreCart,
} from '@/redux/slices/cartSlice';
import { getCart } from '@/service/cart';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

export default function CartPage() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const token = useCurrentToken();
  const encodedCallbackUrl = encodeURIComponent(pathname);
  const { list, total_price, total_item } = useSelector(
    (state: StoreModel) => state.cart
  );

  useEffect(() => {
    if (token) {
      getCart(token.token).then((response) => {
        if (response) {
          dispatch(restoreCart(response));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDecrementQuantity = (id: string) => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    dispatch(decrementQuantityCart({ productId: id, token: token.token }));
  };
  const handleIncrementQuantity = async (product: ProductModel) => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    if (product) {
      if (
        list.find((item) => item.id === product?.id)?.quantity &&
        product?.id
      ) {
        return dispatch(
          incrementQuantityCart({ productId: product?.id, token: token.token })
        );
      }
      dispatch(addCart({ product, token: token.token }));
    }
  };

  const handleDelete = (id: string) => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    dispatch(deleteCart({ productId: id, token: token.token }));
  };

  const fee = {
    service: 2_000,
    application: 1_000,
  };
  const totalPayment = total_price + fee.service + fee.application;

  const handleCheckout = () => {
    if (!token) return router.push('/auth?callbackUrl=' + encodedCallbackUrl);
    dispatch(deleteAllCart({ token: token.token }));
    Notify({
      type: 'success',
      message: 'Checkout success',
    });
    router.replace('/');
  };

  return (
    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Cart
        </h1>
      </div>
      <Card x-chunk="dashboard-07-chunk-0" className="w-full">
        <CardContent className="flex flex-col gap-5 w-full p-3">
          {list?.length === 0 && (
            <p className="text-center text-lg italic text-muted-foreground">
              Cart is empty 🙏
            </p>
          )}
          {list?.map((product, index) => (
            <div
              key={index}
              className="flex gap-8 p-5 w-full items-center hover:bg-muted rounded-lg transition-all duration-300">
              <Image
                src={product.image || 'https://ui.shadcn.com/placeholder.svg'}
                alt={product.name}
                width={100}
                height={100}
                onClick={() => router.push(`/product/${product.id}`)}
                className="w-[150px] h-[150px] rounded-2xl hover:scale-105 transition-all duration-30 cursor-pointer"
              />
              <div className="flex-1 w-full flex flex-col gap-2 h-full">
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="w-max">
                    {product.brand}
                  </Badge>
                  <h1 className="line-clamp-1 text-lg">{product.name}</h1>
                  <p className="text-sm text-muted-foreground font-light">
                    Rp {formatRupiah(product.price)} x {product.quantity}
                  </p>
                </div>
                <p className="text-xl font-semibold my-3">
                  Rp {formatRupiah(product.total_price)}
                </p>
                <div className="flex items-center justify-between">
                  <Counting
                    minCount={0}
                    maxCount={product.stock}
                    onDecrement={() =>
                      product.id ? handleDecrementQuantity(product.id) : null
                    }
                    onIncrement={() => handleIncrementQuantity(product)}
                    disabled={product?.stock === 0}
                    initialCount={
                      list.find((item) => item.id === product?.id)?.quantity
                    }
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      product.id ? handleDelete(product.id) : null
                    }>
                    <IoTrashOutline size={18} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {list?.length !== 0 && (
        <Card x-chunk="dashboard-07-chunk-0" className="w-full">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center font-medium">
                  <p>Price Total</p>
                  <p>Rp {formatRupiah(total_price)}</p>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <p>Service Fee</p>
                  <p>Rp {formatRupiah(2_000)}</p>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <p>Application Fee</p>
                  <p>Rp {formatRupiah(1_000)}</p>
                </div>
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <p>Total Payment</p>
                <p>Rp {formatRupiah(totalPayment)}</p>
              </div>
              <Button onClick={handleCheckout}>Checkout ({total_item})</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
