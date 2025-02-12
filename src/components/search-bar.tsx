import { Search } from 'lucide-react';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchBarProps {
  size?: "default" | "lg";
}

export function SearchBar({size = "default"}: SearchBarProps) {
  const inputClass = size === 'lg' ? 'h-12 text-lg' : 'h-9';

  return (
    <div className='flex gap-2'>
      <div className='relative flex-grow'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
        <Input className={`${inputClass} pl-10`} placeholder='公園名・地域名で検索'/>
      </div>
      <Button>
        現在地から探す
      </Button>
    </div>
  )
}
