'use client';

import React from 'react';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { useAppSelector } from '@/store/hooks';
import styles from '../styles/components/Header.module.scss';
import HeaderUserModal from '@/components/HeaderUserModal';

export default function Header() {
  const { user } = useAppSelector((store) => store.auth);

  return (
    <header className={styles.header}>
      <div className={'container ' + styles.wrapper}>
        <h1 className={styles.logoTitle}>
          <Link href="/">NebulaMoon</Link>
        </h1>
        <div className={styles.headerInformation}>
          <ThemeSwitcher />
          {user ? (
            <HeaderUserModal />
          ) : (
            <Link href={'/login'} className="text-white hover:underline">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
