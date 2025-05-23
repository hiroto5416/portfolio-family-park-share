import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/providers/auth-provider';
import { SearchProvider } from '@/contexts/SearchContext';
import IntroModalProvider from '@/components/IntroModalProvider';

/**
 * メタデータ
 */
export const metadata: Metadata = {
  title: 'FAMILY PARK SHARE',
  description: '家族で楽しめる公園を見つけよう',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

/**
 * ルートレイアウト
 * @param children 子要素
 * @returns ルートレイアウト
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <SearchProvider>
            <IntroModalProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </IntroModalProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
