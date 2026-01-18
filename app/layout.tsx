import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreProvider';

export const metadata: Metadata = {
  title: 'Space Moduler - 2D 평면도를 3D로',
  description: '드래그 앤 드롭 하나로 2D 평면도를 3D 렌더링해주는 웹 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;700;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
