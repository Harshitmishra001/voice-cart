import { SEASONAL_ITEMS } from '../constants';

/**
 * Handles smart and seasonal suggestions logic.
 */
export const fetchSuggestions = async (cartHistory: any[]) => {
  // Stub: Fetch suggestions based on past lists or current month
  const currentMonth = new Date().getMonth() + 1;
  const monthKey = currentMonth.toString().padStart(2, '0');
  
  return [
    { type: 'history', item: 'Eggs' },
    { type: 'seasonal', item: SEASONAL_ITEMS[monthKey]?.[0] || 'Apples' }
  ];
};
