import { ProductModel } from '@/interfaces/product';
import { FavoriteSliceState, SearchSliceState } from '@/interfaces/redux-model';
import { addSaveFavorite, deleteSaveFavorite } from '@/service/favorite';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: SearchSliceState = {
  value: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchSlice: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchSlice } = searchSlice.actions;

export default searchSlice.reducer;
