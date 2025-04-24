'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
import { Trees, LogIn, UserPlus, User, LogOut, HelpCircle } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useIntroModal } from '../IntroModalProvider';

/**
 * ヘッダー
 * @returns ヘッダー
 */
export function Header() {
  const isVisible = useScrollDirection();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { openIntroModal } = useIntroModal();

  // ログインページと新規登録ページではボタンを非表示
  const shouldShowAuthButtons = !['/login', '/signin'].includes(pathname);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // ユーザーのアバター画像URL - セッションから取得
  const avatarUrl = session?.user?.avatarUrl || session?.user?.image;

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
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {/* 使い方ボタン */}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/90"
            onClick={openIntroModal}
          >
            <HelpCircle className="mr-1 h-4 w-4" />
            使い方
          </Button>

          {shouldShowAuthButtons && (
            <>
              {session ? (
                <>
                  <Link href="/mypage">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90"
                    >
                      {avatarUrl ? (
                        <div className="mr-1 h-7 w-7 relative overflow-hidden rounded-full border-2 border-gray-300">
                          <Image src={avatarUrl} alt="プロフィール" fill className="object-cover" />
                        </div>
                      ) : (
                        <User className="mr-1 h-6 w-6" />
                      )}
                      <span className="font-bold">マイページ</span>
                    </Button>
                  </Link>
                  <Button variant="default" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-1 h-5 w-5" />
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/90"
                    >
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
            </>
          )}
        </div>
      </div>

      {/* モバイル用ボタン */}
      <div className="md:hidden flex justify-end gap-2 px-2 py-1.5">
        {/* モバイル用使い方ボタン */}
        <Button
          variant="ghost"
          className="text-xs h-6 px-2 text-primary hover:text-primary/90"
          onClick={openIntroModal}
        >
          <HelpCircle className="mr-1 h-3 w-3" />
          使い方
        </Button>

        {shouldShowAuthButtons && (
          <>
            {session ? (
              <>
                <Link href="/mypage">
                  <Button
                    variant="ghost"
                    className="text-xs h-6 px-2 text-primary hover:text-primary/90"
                  >
                    {avatarUrl ? (
                      <div className="mr-1 h-5 w-5 relative overflow-hidden rounded-full border border-gray-300">
                        <Image src={avatarUrl} alt="プロフィール" fill className="object-cover" />
                      </div>
                    ) : (
                      <User className="mr-1 h-4 w-4" />
                    )}
                    <span className="font-bold">マイページ</span>
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
          </>
        )}
      </div>
    </header>
  );
}
