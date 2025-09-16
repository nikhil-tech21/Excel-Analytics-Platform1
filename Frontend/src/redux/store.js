import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chartReducer from './chartSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    chart: chartReducer,
  },
});