'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Trees, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const isVisible = useScrollDirection();
  const pathname = usePathname();
  const { data: session } = useSession();

  // ログインページと新規登録ページではボタンを非表示
  const shouldShowAuthButtons = !['/login', '/signin'].includes(pathname);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <header
      className={cn(
        'border-b bg-white sticky top-0 z-50 transition-transform duration-300',
        !isVisible && 'md:transform-none -translate-y-full'
      )}
    >
      <div className="max-w-container mx-auto px-4 h-14 flex items-center justify-between md:justify-start md:gap-6">
        {/* ロゴ */}
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity md:flex-none mx-auto md:mx-0"
        >
          <Trees className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-xl font-bold text-primary">FAMILY PARK SHARE</span>
        </Link>

        {/* デスクトップメニュー */}
        {shouldShowAuthButtons && (
          <div className="hidden md:flex items-center gap-3 ml-auto">
            {session ? (
              <>
                <Link href="/mypage">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                    <User className="mr-1 h-4 w-4" />
                    マイページ
                  </Button>
                </Link>
                <Button variant="default" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-1 h-4 w-4" />
                  ログアウト
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                    <LogIn className="mr-1 h-4 w-4" />
                    ログイン
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button variant="default" size="sm">
                    <UserPlus className="mr-1 h-4 w-4" />
                    新規登録
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* モバイル用ボタン */}
      {shouldShowAuthButtons && (
        <div className="md:hidden flex justify-end gap-2 px-2 py-1.5">
          {session ? (
            <>
              <Link href="/mypage">
                <Button
                  variant="ghost"
                  className="text-xs h-6 px-2 text-primary hover:text-primary/90"
                >
                  <User className="mr-1 h-3 w-3" />
                  マイページ
                </Button>
              </Link>
              <Button variant="default" className="text-xs h-6 px-2" onClick={handleLogout}>
                <LogOut className="mr-1 h-3 w-3" />
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-xs h-6 px-2 text-primary hover:text-primary/90"
                >
                  <LogIn className="mr-1 h-3 w-3" />
                  ログイン
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="default" className="text-xs h-6 px-2">
                  <UserPlus className="mr-1 h-3 w-3" />
                  新規登録
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
