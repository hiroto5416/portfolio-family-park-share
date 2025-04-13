'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * 認証プロバイダー
 * @param children 子要素
 * @returns 認証プロバイダー
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
