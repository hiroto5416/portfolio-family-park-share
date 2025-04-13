'use client';

import { createContext, useContext } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { Park, SearchParams } from '@/types/park';

/**
 * 検索コンテキストの型
 */
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

/**
 * 検索プロバイダー
 * @param children 子要素
 * @returns 検索プロバイダー
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const searchState = useSearch();

  return <SearchContext.Provider value={searchState}>{children}</SearchContext.Provider>;
}

/**
 * 検索コンテキストを使用するカスタムフック
 * @returns 検索コンテキスト
 */
export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
