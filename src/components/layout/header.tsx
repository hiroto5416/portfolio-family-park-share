import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';
// import { SearchBar } from '@/components/search-bar';
import { Trees } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover: opacity-80 transition-opacity">
          <Trees className='h-7 w-7 text-primary' aria-hidden="true"/>
          <span className='text-2xl font-bold text-primary'>
            FAMILY PARK SHARE
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* <SearchBar /> */}
          <Button variant="outline">ログイン</Button>
        </div>
      </div>
    </header>
  );
}
