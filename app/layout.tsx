'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { useSelectedLayoutSegment } from 'next/navigation';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const segment = useSelectedLayoutSegment();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        <Navbar selectedItem={segment} />
        {children}
      </body>
    </html>
  );
}
