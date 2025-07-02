'use client';

import React from 'react';
import { useLogoutMutation } from '@/store/api/authApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-light-background-tertiary dark:bg-dark-background-tertiary p-2.5 border-b-1 border-light-border dark:border-dark-border">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold font-geist-sans">
          <Link href="/" className="text-light-text-primary dark:text-dark-text-primary">
            NebulaMoon
          </Link>
        </h1>
        <Link href={'/login'} className="text-white hover:underline">
          Войти
        </Link>
        <ThemeSwitcher />
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
