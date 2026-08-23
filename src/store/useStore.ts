import { create } from 'zustand';

interface AppState {
  shoppingList: any[];
  listeningState: 'idle' | 'listening' | 'processing';
  transcript: string;
  suggestions: any[];
  searchResults: any[];
  currentLanguage: string;
  setListeningState: (state: 'idle' | 'listening' | 'processing') => void;
  setTranscript: (text: string) => void;
}

export const useStore = create<AppState>((set) => ({
  shoppingList: [],
  listeningState: 'idle',
  transcript: '',
  suggestions: [],
  searchResults: [],
  currentLanguage: 'en',
  setListeningState: (state) => set({ listeningState: state }),
  setTranscript: (text) => set({ transcript: text }),
}));
