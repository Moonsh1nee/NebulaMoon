'use client';

import React from 'react';
import { useLogoutMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Моё приложение</h1>
        <Link href={'/login'} className="text-white hover:underline">
          Войти
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300">
          {isLoading ? 'Выход...' : 'Выйти'}
        </button>
      </div>
    </header>
  );
}
