import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import fieldsReducer from './slices/fieldsSlice';
import authReducer from './slices/authSlice';
import { tasksApi } from './api/tasksApi';
import { fieldsApi } from './api/fieldsApi';
import { authApi } from './api/authApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    fields: fieldsReducer,
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [fieldsApi.reducerPath]: fieldsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware, fieldsApi.middleware, authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
