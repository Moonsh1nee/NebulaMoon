'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../store/api/authApi';
import { setAuth } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
import Link from 'next/link';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      try {
        const data = await register({ email, password, name }).unwrap();
        dispatch(setAuth(data));
      } catch (err) {}
    }
  };

  if (isAuthenticated) {
    return <div>Вы зарегистрированы!</div>;
  }

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={isLoading}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
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
          Зарегистрироваться
        </button>
        {error && (
          <div>
            Ошибка: {(error as any).data?.message || 'Не удалось зарегистрироваться'}
          </div>
        )}
      </form>
      <Link href="/login">Войти</Link>
    </div>
  );
};

export default Register;
