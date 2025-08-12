'use client';

import MoonIcon from '@/assets/img/icons/moon-icon.svg';
import SunIcon from '@/assets/img/icons/sun-icon.svg';
import { useState, useEffect } from 'react';
import styles from '@/styles/components/ThemeSwitcher.module.scss';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', prefersDark);
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={() => handleThemeChange('light')} className={styles.btn} title="Light Theme">
        <SunIcon
          className={theme === 'light' ? styles.btnIconActive : styles.btnIconInactive}
          width={24}
          height={24}
          aria-label="Light Theme Icon"
        />
      </button>
      <button onClick={() => handleThemeChange('dark')} className={styles.btn} title="Dark Theme">
        <MoonIcon
          className={theme === 'dark' ? styles.btnIconActive : styles.btnIconInactive}
          width={24}
          height={24}
          aria-label="Dark Theme Icon"
        />
      </button>
    </div>
  );
}
