import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
