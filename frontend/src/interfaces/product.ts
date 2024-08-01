export interface ProductModel {
  id?: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  brand: string;
  image: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BrandCountModel {
  name: string;
  count: number;
}
