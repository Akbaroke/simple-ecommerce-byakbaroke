import Notify from '@/components/molecules/Notify';
import { ProductModel } from '@/interfaces/product';
import { CartSliceState, ProductSliceModel } from '@/interfaces/redux-model';
import {
  getCart,
  saveCart,
  saveDeleteAllCart,
  saveDeleteCart,
} from '@/service/cart';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CartSliceState = {
  list: [],
  total_item: 0,
  total_price: 0,
};

const calculateTotalPrice = (list: ProductSliceModel[]): number => {
  return list.reduce((acc, product) => acc + product.total_price, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (
      state,
      action: PayloadAction<{ product: ProductModel; token: string }>
    ) => {
      const product = action.payload.product;
      const existingProduct = state.list.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.total_price += product.price;
      } else {
        state.list.push({
          ...product,
          quantity: 1,
          total_price: product.price,
        });
      }

      state.total_item = state.list.length;
      state.total_price = calculateTotalPrice(state.list);

      saveCart(action.payload.token, state.list);

      Notify({
        type: 'success',
        message: 'Product added to cart',
      });
    },
    deleteCart: (
      state,
      action: PayloadAction<{ productId: string; token: string }>
    ) => {
      const productId = action.payload.productId;
      state.list = state.list.filter((product) => product.id !== productId);

      state.total_item = state.list.length;
      state.total_price = calculateTotalPrice(state.list);

      saveDeleteCart(action.payload.token, productId);

      Notify({
        type: 'success',
        message: 'Product deleted from cart',
      });
    },
    deleteAllCart: (state, action: PayloadAction<{ token: string }>) => {
      state.list = [];
      state.total_item = 0;
      state.total_price = 0;

      saveDeleteAllCart(action.payload.token);
    },
    incrementQuantityCart: (
      state,
      action: PayloadAction<{ productId: string; token: string }>
    ) => {
      const productId = action.payload.productId;
      const existingProduct = state.list.find(
        (product) => product.id === productId
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.total_price += existingProduct.price;

        state.total_item = state.list.length;
        state.total_price = calculateTotalPrice(state.list);
      }

      saveCart(action.payload.token, state.list);
    },
    decrementQuantityCart: (
      state,
      action: PayloadAction<{ productId: string; token: string }>
    ) => {
      const productId = action.payload.productId;
      const existingProduct = state.list.find(
        (product) => product.id === productId
      );

      if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        existingProduct.total_price -= existingProduct.price;

        state.total_item = state.list.length;
        state.total_price = calculateTotalPrice(state.list);
      } else if (existingProduct && existingProduct.quantity === 1) {
        state.list = state.list.filter((product) => product.id !== productId);

        state.total_item = state.list.length;
        state.total_price = calculateTotalPrice(state.list);
      }

      saveCart(action.payload.token, state.list);
    },
    restoreCart: (state, action: PayloadAction<CartSliceState>) => {
      state.list = action.payload.list;
      state.total_item = action.payload.total_item;
      state.total_price = action.payload.total_price;
    },
  },
});

export const {
  addCart,
  deleteCart,
  deleteAllCart,
  incrementQuantityCart,
  decrementQuantityCart,
  restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;
