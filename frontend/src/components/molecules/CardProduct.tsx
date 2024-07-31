import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';

type Props = {
  name: string;
  price: string;
  brand: string;
  image: string;
};

export default function CardProduct({ name, price, brand, image }: Props) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <Image
          alt="Product image"
          className="aspect-square w-full rounded-md object-cover"
          src={image}
          width={20}
          height={20}
        />
      </CardHeader>
      <CardContent>
        <h1>{name}</h1>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
