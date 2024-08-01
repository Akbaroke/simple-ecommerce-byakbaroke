import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import { StoreModel } from '@/interfaces/redux-model';

export const store = configureStore<StoreModel>({
  reducer: {
    cart: cartSlice,
  },
});

store.subscribe(() => {
  console.log('store change:', store.getState());
});
