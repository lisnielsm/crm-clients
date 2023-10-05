import { configureStore } from '@reduxjs/toolkit'
import layoutReducer from './slices/layoutSlice';
import pedidoReducer from './slices/pedidoSlice';

export const store = configureStore({
  reducer: {
    layout: layoutReducer,
    pedido: pedidoReducer,
  },
})