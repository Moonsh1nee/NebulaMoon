'use client';

import Header from '../components/Header';
import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-inter bg-light-background dark:bg-dark-background">
      <Header />
      <main className="bg-light-background dark:bg-dark-background"></main>
    </div>
  );
}
