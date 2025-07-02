'use client';

import { useState, useEffect } from 'react';

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
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleThemeChange('light')}
        className={`px-4 py-2 rounded flex items-center space-x-2 ${
          theme === 'light'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
        }`}
        title="Light Theme">
        <span>Light</span>
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`px-4 py-2 rounded flex items-center space-x-2 ${
          theme === 'dark'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
        }`}
        title="Dark Theme">
        <span>Dark</span>
      </button>
    </div>
  );
}
