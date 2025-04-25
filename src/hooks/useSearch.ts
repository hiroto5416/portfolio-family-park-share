'use client';

import { useState, useCallback } from 'react';
import { parkSearchService } from '../services/parkSearchService';
import { Park, SearchParams } from '../types/park';

/**
 * 検索状態
 */
interface SearchState {
  query: string; // 検索クエリ
  isLoading: boolean; // 検索中状態
  results: Park[]; // 検索結果
  error: string | null; // エラーメッセージ
  total: number;
  hasSearched: boolean; // 検索実行済みフラグ
}

/**
 * 検索フック
 * @returns 検索フック
 */
export function useSearch() {
  const [state, setState] = useState<SearchState>({
    query: '',
    isLoading: false,
    results: [],
    error: null,
    total: 0,
    hasSearched: false,
  });

  // 検索実行
  const search = useCallback(async (params: SearchParams) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await parkSearchService.searchByText(params);

      setState((prev) => ({
        ...prev,
        results: result.parks,
        total: result.total,
        isLoading: false,
        hasSearched: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : '検索に失敗しました',
        isLoading: false,
        hasSearched: true,
      }));
    }
  }, []);

  // 位置情報による検索
  const searchByLocation = useCallback(async (lat: number, lng: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await parkSearchService.searchByLocation(lat, lng);
      setState((prev) => ({
        ...prev,
        results: result.parks,
        total: result.total,
        isLoading: false,
        hasSearched: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : '検索に失敗しました',
        isLoading: false,
        hasSearched: true,
      }));
    }
  }, []);

  // クエリの更新
  const setQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, query }));
  }, []);

  // 検索状態のリセット
  const reset = useCallback(() => {
    setState({
      query: '',
      isLoading: false,
      results: [],
      error: null,
      total: 0,
      hasSearched: false,
    });
  }, []);

  return {
    ...state,
    search,
    searchByLocation,
    setQuery,
    reset,
  };
}
