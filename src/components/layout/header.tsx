'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
// import { SearchBar } from '@/components/search-bar';
import { Trees, LogIn, UserPlus } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { cn } from '@/lib/utils';

export function Header() {
  const isVisible = useScrollDirection();

  return (
    <header
      className={cn(
        'border-b bg-white sticky top-0 z-50 transition-transform duration-300',
        !isVisible && 'md:transform-none -translate-y-full'
      )}
    >
      <div className="max-w-container mx-auto px-4 h-16 flex items-center justify-between md:justify-start md:gap-8">
        {/* ロゴ */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity md:flex-none mx-auto md:mx-0"
        >
          <Trees className="h-7 w-7 text-primary" aria-hidden="true" />
          <span className="text-2xl font-bold text-primary">FAMILY PARK SHARE</span>
        </Link>

        {/* デスクトップメニュー */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <Button variant="ghost" className="text-primary hover:text-primary/90">
            <LogIn className="mr-1 h-4 w-4" />
            ログイン
          </Button>
          <Button variant="default">
            <UserPlus className="mr-1 h-4 w-4" />
            新規登録
          </Button>
        </div>
      </div>

      {/* モバイル用ボタン */}
      <div className="md:hidden flex justify-end gap-3 p-2">
        <Button variant="ghost" className="text-xs h-7 px-2 text-primary hover:text-primary/90">
          <LogIn className="mr-1 h-3 w-3" />
          ログイン
        </Button>
        <Button variant="default" className="text-xs h-7 px-2">
          <UserPlus className="mr-1 h-3 w-3" />
          新規登録
        </Button>
      </div>
    </header>
  );
}
