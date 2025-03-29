import { useState, useEffect } from 'react';
import { SearchResult, SearchParams } from '../types/park';
import { parkSearchService } from '../services/parkSearchService';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const searchCache = new Map<string, SearchResult>();

export const searchWithCache = async (params: SearchParams) => {
  const cacheKey = JSON.stringify(params);
  const cachedResult = searchCache.get(cacheKey);

  if (cachedResult) {
    return cachedResult;
  }

  const result = await parkSearchService.searchByText(params);
  searchCache.set(cacheKey, result);
  return result;
};
