'use client';

import React from 'react';
import Link from 'next/link';
import { useRegisterMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password, name }).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Имя (опционально)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
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
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <p className="mt-4 text-center">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
