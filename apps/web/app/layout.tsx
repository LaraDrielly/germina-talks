import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Germina Talks',
  description: 'Comunidade escolar do Instituto J&F',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
