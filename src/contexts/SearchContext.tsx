'use client';

import { createContext, useContext } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { Park, SearchParams } from '@/types/park';

// コンテキストの型定義
interface SearchContextType {
  query: string;
  isLoading: boolean;
  results: Park[];
  error: string | null;
  total: number;
  search: (params: SearchParams) => Promise<void>;
  searchByLocation: (lat: number, lng: number) => Promise<void>;
  setQuery: (query: string) => void;
  reset: () => void;
}

// コンテキストの作成
const SearchContext = createContext<SearchContextType | null>(null);

// プロバイダーコンポーネント
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const searchState = useSearch();

  return <SearchContext.Provider value={searchState}>{children}</SearchContext.Provider>;
}

// カスタムフック
export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
