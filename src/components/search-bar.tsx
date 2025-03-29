'use client';

import { Search } from 'lucide-react';
import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSearchContext } from '@/contexts/SearchContext';
import { Loader2 } from 'lucide-react';

interface SearchBarProps {
  size?: 'default' | 'lg';
}

export function SearchBar({ size = 'default' }: SearchBarProps) {
  const inputClass = size === 'lg' ? 'h-12 text-lg' : 'h-9';
  const { query, setQuery, search, isLoading, error } = useSearchContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    await search({ query: query.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className={`${inputClass} pl-10`}
          placeholder="公園名・地域名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>
      <Button type="submit" className="w-full md:w-auto">
        検索
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
