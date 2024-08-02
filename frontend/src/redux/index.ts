import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './slices/cartSlice';
import favoriteSlice from './slices/favoriteSlice';
import searchSlice from './slices/searchSlice';
import { StoreModel } from '@/interfaces/redux-model';

export const store = configureStore<StoreModel>({
  reducer: {
    cart: cartSlice,
    favorite: favoriteSlice,
    search: searchSlice,
  },
});

store.subscribe(() => {
  console.log('store change:', store.getState());
});
