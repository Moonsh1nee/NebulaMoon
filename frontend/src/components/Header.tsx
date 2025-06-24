'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import Link from 'next/link';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearAuth());
  };

  return (
    <header>
      <nav>
        <Link href="/">Главная</Link>
        {isAuthenticated ? (
          <button onClick={handleLogout}>Выйти</button>
        ) : (
          <>
            <Link href="/login">Вход</Link>
            <Link href="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
