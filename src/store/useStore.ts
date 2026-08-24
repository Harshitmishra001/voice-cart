import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface StoreState {
  cart: CartItem[];
  language: string;
  hasSelectedLanguage: boolean;
  listeningState: 'idle' | 'listening' | 'processing';
  transcript: string;
  suggestions: string[];
  searchResults: Product[];
  isLanguagePickerOpen: boolean;
  isSubstituteModalOpen: boolean;
  outOfStockItem: string | null;
  substitutes: string[];
  modelLoaded: boolean;
  toastMessage: string | null;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleComplete: (id: string) => void;
  clearCart: () => void;
  setLanguage: (code: string) => void;
  setListeningState: (state: 'idle' | 'listening' | 'processing') => void;
  setTranscript: (text: string) => void;
  setSuggestions: (items: string[]) => void;
  setSearchResults: (results: Product[]) => void;
  setLanguagePickerOpen: (open: boolean) => void;
  setSubstituteModal: (item: string | null, substitutes: string[]) => void;
  setModelLoaded: (loaded: boolean) => void;
  showToast: (message: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  language: localStorage.getItem('language') || 'en-IN',
  hasSelectedLanguage: localStorage.getItem('hasSelectedLanguage') === 'true',
  listeningState: 'idle',
  transcript: '',
  suggestions: [],
  searchResults: [],
  isLanguagePickerOpen: localStorage.getItem('hasSelectedLanguage') !== 'true', // Open by default if not selected
  isSubstituteModalOpen: false,
  outOfStockItem: null,
  substitutes: [],
  modelLoaded: false,
  toastMessage: null,

  addItem: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),

  removeItem: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  toggleComplete: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  setLanguage: (code) => {
    localStorage.setItem('language', code);
    localStorage.setItem('hasSelectedLanguage', 'true');
    set({ language: code, hasSelectedLanguage: true });
  },

  setListeningState: (state) => set({ listeningState: state }),

  setTranscript: (text) => set({ transcript: text }),

  setSuggestions: (items) => set({ suggestions: items }),

  setSearchResults: (results) => set({ searchResults: results }),

  setLanguagePickerOpen: (open) => set({ isLanguagePickerOpen: open }),

  setSubstituteModal: (item, substitutes) =>
    set({
      isSubstituteModalOpen: !!item,
      outOfStockItem: item,
      substitutes,
    }),

  setModelLoaded: (loaded) => set({ modelLoaded: loaded }),

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => {
      set((state) => (state.toastMessage === message ? { toastMessage: null } : state));
    }, 3000);
  },
}));
