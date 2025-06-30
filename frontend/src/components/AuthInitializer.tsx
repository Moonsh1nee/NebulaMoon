'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetProfileQuery } from '@/store/api/authApi';
import { setCredentials, logout } from '@/store/slices/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { data: userData, error, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (userData && !user) {
      dispatch(setCredentials({ user: userData }));
    } else if (error && 'status' in error && error.status === 401) {
      dispatch(logout());
    }
  }, [userData, error, user, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
