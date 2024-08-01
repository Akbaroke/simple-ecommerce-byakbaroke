import { ProductModel } from './product';

export interface StoreModel {
  cart: CartSliceState;
  favorite: FavoriteSliceState;
}

export interface CartSliceState {
  list: ProductSliceModel[];
  total_item: number;
  total_price: number;
}

export interface ProductSliceModel extends ProductModel {
  quantity: number;
  total_price: number;
}

export interface FavoriteSliceState {
  list: ProductModel[];
  total_item: number;
}