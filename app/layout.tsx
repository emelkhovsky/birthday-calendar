import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Календарь дней рождения',
  description: 'Дни рождения подруг, контакты и вишлисты в одном календаре.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
