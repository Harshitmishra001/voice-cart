import { useCallback } from 'react';
import { useStore } from '../store/useStore';

export const useShoppingList = () => {
  const { shoppingList } = useStore();

  const addItem = useCallback((item: any) => {
    // Stub: handle adding item, resolving category
  }, []);

  const removeItem = useCallback((id: string) => {
    // Stub: handle removal
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    // Stub: update item quantity
  }, []);

  return { shoppingList, addItem, removeItem, updateQuantity };
};
