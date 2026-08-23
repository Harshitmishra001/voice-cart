import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { searchProducts } from '../services/search.service';

export const useVoiceSearch = () => {
  const { searchResults, currentLanguage } = useStore();

  const handleSearch = useCallback(async (query: string) => {
    // Stub: invoke searchProducts service
    // update searchResults in store
  }, [currentLanguage]);

  return { searchResults, handleSearch };
};
