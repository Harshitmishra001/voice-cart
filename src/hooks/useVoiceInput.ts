import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { startListening, stopListening } from '../services/stt.service';

export const useVoiceInput = () => {
  const { setListeningState, setTranscript, currentLanguage } = useStore();

  const toggleListening = useCallback(() => {
    // Stub: toggle listeningState, trigger startListening/stopListening
    // Update transcript in store onResult
  }, [currentLanguage]);

  return {
    toggleListening
  };
};
