'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../store/api/authApi';
import { setAuth } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      try {
        const data = await login({ email, password }).unwrap();
        dispatch(setAuth(data));
      } catch (err) {}
    }
  };

  if (isAuthenticated) {
    return redirect('/'); // Redirect to home if already authenticated
  }

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={isLoading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Войти
        </button>
        {error && (
          <div>
            Ошибка: {(error as any).data?.message || 'Не удалось войти'}
          </div>
        )}
      </form>
      <Link href="/register">Зарегистрироваться</Link>
    </div>
  );
};

export default Login;
