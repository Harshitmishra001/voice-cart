import { useCallback } from 'react';
import { useStore } from '../store/useStore';
import { startListening, stopListening, isSupported } from '../services/stt.service';
import { parseIntent } from '../services/nlp.service';
import { useShoppingList } from './useShoppingList';
import { searchProducts, extractPriceFilter } from '../services/search.service';

export function useVoiceInput() {
  const language = useStore((s) => s.language);
  const listeningState = useStore((s) => s.listeningState);
  const transcript = useStore((s) => s.transcript);
  const setListeningState = useStore((s) => s.setListeningState);
  const setTranscript = useStore((s) => s.setTranscript);
  const setSearchResults = useStore((s) => s.setSearchResults);
  const showToast = useStore((s) => s.showToast);
  const { addItem, removeItem, updateQuantity } = useShoppingList();

  const processTranscript = useCallback(async (text: string) => {
    setListeningState('processing');
    setTranscript(text);

    try {
      const result = await parseIntent(text);
      const { action, items } = result;

      switch (action) {
        case 'add':
          for (const item of items) {
            addItem(item.item, item.quantity, item.unit);
          }
          if (items.length > 1) {
            showToast(`Added ${items.length} items to cart`);
          }
          break;

        case 'remove':
          for (const item of items) {
            removeItem(item.item);
          }
          break;

        case 'update_qty':
          for (const item of items) {
            updateQuantity(item.item, item.quantity, item.unit);
          }
          break;

        case 'search': {
          // For search, use the first item
          const firstItem = items[0];
          if (firstItem) {
            const maxPrice = extractPriceFilter(text);
            const results = searchProducts(firstItem.item, maxPrice ?? undefined);
            setSearchResults(results);
          }
          break;
        }
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      showToast('Could not understand. Please try again.');
    } finally {
      setListeningState('idle');
    }
  }, [language, addItem, removeItem, updateQuantity, setListeningState, setTranscript, setSearchResults, showToast]);

  const toggleListening = useCallback(() => {
    if (!isSupported()) {
      showToast('Voice input is not supported in this browser');
      return;
    }

    if (listeningState === 'listening') {
      stopListening();
      setListeningState('idle');
    } else {
      setListeningState('listening');
      setTranscript('');
      startListening(
        language,
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            processTranscript(text);
          }
        },
        () => {
          // onEnd — only reset if not processing
          const state = useStore.getState().listeningState;
          if (state === 'listening') {
            setListeningState('idle');
          }
        },
        (error) => {
          showToast(error);
          setListeningState('idle');
        }
      );
    }
  }, [listeningState, language, processTranscript, setListeningState, setTranscript, showToast]);

  return {
    isListening: listeningState === 'listening',
    isProcessing: listeningState === 'processing',
    transcript,
    toggleListening,
    isSupported: isSupported(),
  };
}
