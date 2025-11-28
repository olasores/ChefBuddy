import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chef Buddy',
  description: 'Personalized recipes powered by Chef Buddy AI',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
