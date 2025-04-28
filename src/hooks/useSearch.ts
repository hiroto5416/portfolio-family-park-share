'use client';

import { useState, useCallback } from 'react';
import { parkSearchService } from '../services/parkSearchService';
import { Park, SearchParams } from '../types/park';
import { ERROR_CODES, handleError } from '../utils/errors';

/**
 * 検索状態
 */
interface SearchState {
  query: string; // 検索クエリ
  isLoading: boolean; // 検索中状態
  results: Park[]; // 検索結果
  error: string | null; // エラーメッセージ
  errorCode: keyof typeof ERROR_CODES | null; // エラーコード
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
    errorCode: null,
    total: 0,
    hasSearched: false,
  });

  // 検索実行
  const search = useCallback(async (params: SearchParams) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, errorCode: null }));

    try {
      const result = await parkSearchService.searchByText(params);

      setState((prev) => ({
        ...prev,
        results: result.parks,
        total: result.total,
        isLoading: false,
        hasSearched: true,
        error: null,
        errorCode: null,
      }));
    } catch (error) {
      // エラー処理
      const { code, message } = handleError(error);
      console.error('検索エラー:', message, code);

      setState((prev) => ({
        ...prev,
        error: message,
        errorCode: code,
        isLoading: false,
        hasSearched: true,
        // NO_RESULTSの場合は空の結果を設定、それ以外は結果をクリア
        results: code === 'NO_RESULTS' ? [] : [],
      }));
    }
  }, []);

  // 位置情報による検索
  const searchByLocation = useCallback(async (lat: number, lng: number) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, errorCode: null }));

    try {
      const result = await parkSearchService.searchByLocation(lat, lng);
      setState((prev) => ({
        ...prev,
        results: result.parks,
        total: result.total,
        isLoading: false,
        hasSearched: true,
        error: null,
        errorCode: null,
      }));
    } catch (error) {
      // エラー処理
      const { code, message } = handleError(error);
      console.error('位置情報検索エラー:', message, code);

      setState((prev) => ({
        ...prev,
        error: message,
        errorCode: code,
        isLoading: false,
        hasSearched: true,
        // NO_RESULTSの場合は空の結果を設定、それ以外は結果をクリア
        results: code === 'NO_RESULTS' ? [] : [],
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
      errorCode: null,
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
