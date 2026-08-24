import { getSuggestions, hasApiKey } from './llm.service';
import { SEASONAL_ITEMS } from '../constants';

export async function fetchSuggestions(
  cartItems: string[]
): Promise<{ ai: string[]; seasonal: string[] }> {
  const currentMonth = new Date().getMonth();
  const seasonal = SEASONAL_ITEMS[currentMonth] || [];

  if (hasApiKey() && cartItems.length > 0) {
    try {
      const ai = await getSuggestions(cartItems);
      return { ai, seasonal };
    } catch {
      return { ai: [], seasonal };
    }
  }

  return { ai: [], seasonal };
}
