'use client';

import { SearchBar } from './search-bar';
import { SearchResults } from './search-results';
import { useSearch } from '../hooks/useSearch';

export function SearchSection() {
  const { query, setQuery, search, isLoading, error, results } = useSearch();

  return (
    <div>
      <SearchBar />
      {results.length > 0 && <SearchResults parks={results} />}
    </div>
  );
}
