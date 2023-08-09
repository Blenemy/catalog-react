import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import productsSlice from '../features/productsSlice';
import productInfoSlice from '../features/productInfoSlice';
import userSlice from '../features/userSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    productInfo: productInfoSlice,
    user: userSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

/* eslint-disable @typescript-eslint/indent */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
/* eslint-enable @typescript-eslint/indent */
