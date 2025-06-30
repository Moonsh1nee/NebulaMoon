import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { LogoutResponse, User } from '@/types/auth';
import { setCredentials, logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001',
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      const profileResult = await baseQuery(
        { url: '/auth/profile', method: 'GET' },
        api,
        extraOptions,
      );
      if (profileResult.data) {
        api.dispatch(setCredentials({ user: profileResult.data as User }));
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<any, { email: string; password: string; name?: string }>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    refresh: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;
