import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import aiInsightReducer from './slices/aiInsightSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    aiInsights: aiInsightReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For handling dates/complex objects
    }),
});