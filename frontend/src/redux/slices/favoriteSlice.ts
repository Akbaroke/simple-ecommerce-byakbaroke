import { ProductModel } from '@/interfaces/product';
import { FavoriteSliceState } from '@/interfaces/redux-model';
import { addSaveFavorite, deleteSaveFavorite } from '@/service/favorite';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FavoriteSliceState = {
  list: [],
  total_item: 0,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    restoreFavorite: (state, action: PayloadAction<ProductModel[]>) => {
      state.list = action.payload;
      state.total_item = action.payload.length;
    },
    toggleFavorite: (
      state,
      action: PayloadAction<{ product: ProductModel; token: string }>
    ) => {
      const { product, token } = action.payload;
      const existingIndex = state.list.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex !== -1) {
        state.list.splice(existingIndex, 1);
        deleteSaveFavorite(token, product.id as string);
      } else {
        state.list.push(product);
        addSaveFavorite(token, product.id as string);
      }

      state.total_item = state.list.length;
    },
  },
});

export const { restoreFavorite, toggleFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
