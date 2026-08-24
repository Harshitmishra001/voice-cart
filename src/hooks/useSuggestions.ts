import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { fetchSuggestions } from '../services/suggestions.service';

export function useSuggestions() {
  const cart = useStore((s) => s.cart);
  const suggestions = useStore((s) => s.suggestions);
  const setSuggestions = useStore((s) => s.setSuggestions);

  const refresh = useCallback(async () => {
    const cartItemNames = cart.map((i) => i.name);
    try {
      const { ai, seasonal } = await fetchSuggestions(cartItemNames);
      // Merge and deduplicate, AI suggestions first
      const all = [...new Set([...ai, ...seasonal])];
      // Filter out items already in cart
      const filtered = all.filter(
        (s) => !cart.some((c) => c.name.toLowerCase() === s.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 8));
    } catch {
      setSuggestions([]);
    }
  }, [cart, setSuggestions]);

  useEffect(() => {
    refresh();
  }, [cart.length, refresh]); // Refresh when cart size changes

  return { suggestions, refresh };
}
