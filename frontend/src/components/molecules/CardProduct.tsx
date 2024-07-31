import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { formatRupiah } from '@/lib/formatCurrency';
import { Badge } from '../ui/badge';

type Props = {
  name: string;
  price: number;
  brand: string;
  image: string;
};

export default function CardProduct({ name, price, brand, image }: Props) {
  return (
    <Card className="max-w-[350px]">
      <CardHeader>
        <Image
          alt="Product image"
          className="aspect-square w-full h-[250px] rounded-md object-cover"
          src={image || 'https://ui.shadcn.com/placeholder.svg'}
          width={400}
          height={400}
        />
      </CardHeader>
      <CardContent>
        <h1>{name}</h1>
        <p>Rp {formatRupiah(price)}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge variant="secondary">{brand}</Badge>
      </CardFooter>
    </Card>
  );
}
