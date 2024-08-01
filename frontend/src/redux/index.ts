import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import favoriteSlice from './slices/favoriteSlice';
import { StoreModel } from '@/interfaces/redux-model';

export const store = configureStore<StoreModel>({
  reducer: {
    cart: cartSlice,
    favorite: favoriteSlice,
  },
});

store.subscribe(() => {
  console.log('store change:', store.getState());
});
