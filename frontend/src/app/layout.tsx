import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { AuthInitializer } from '@/components/AuthInitializer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NebulaMoon',
  description: 'NebulaMoon - Your Personal Task Manager',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en, ru">
      <head></head>
      <body className={`${poppins.variable} ${inter.variable}`}>
        <Providers>
          <AuthInitializer>{children}</AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
