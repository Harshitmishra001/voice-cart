import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchSuggestions } from '../services/suggestions.service';

export const useSuggestions = () => {
  const { suggestions } = useStore();

  useEffect(() => {
    // Stub: Call fetchSuggestions on mount or when cart changes
    // setSuggestions(result)
  }, []);

  return { suggestions };
};
