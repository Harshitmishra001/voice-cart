import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { searchProducts, extractPriceFilter } from '../services/search.service';

export function useVoiceSearch() {
  const searchResults = useStore((s) => s.searchResults);
  const setSearchResults = useStore((s) => s.setSearchResults);

  const handleSearch = useCallback((query: string) => {
    const maxPrice = extractPriceFilter(query);
    const results = searchProducts(query, maxPrice ?? undefined);
    setSearchResults(results);
  }, [setSearchResults]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, [setSearchResults]);

  return {
    searchResults,
    handleSearch,
    clearResults,
    hasResults: searchResults.length > 0,
  };
}
