'use client';

import React from 'react';
import Link from 'next/link';
import { authApi, useLoginMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      try {
        await login({ email, password }).unwrap();
        const profileResult = await dispatch(
          authApi.endpoints.getProfile.initiate(undefined),
        ).unwrap();
        dispatch(setCredentials({ user: profileResult }));
        console.log('Login successful:', profileResult);
        router.push('/');
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Вход</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
        <p className="mt-4 text-center">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}
