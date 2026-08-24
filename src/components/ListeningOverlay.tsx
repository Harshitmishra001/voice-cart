import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';

export interface ListeningOverlayProps {
  onStop: () => void;
}

export const ListeningOverlay: React.FC<ListeningOverlayProps> = ({ onStop }) => {
  const transcript = useStore((s) => s.transcript);
  const listeningState = useStore((s) => s.listeningState);
  
  if (listeningState === 'idle') return null;

  return (
    <div className="overlay">
      <div style={{ flex: 1 }} onClick={onStop}></div>
      <motion.div 
        className="bottom-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div style={{ textAlign: 'center', position: 'relative', height: 120 }}>
          {listeningState === 'listening' && (
            <>
              <div className="listening-pulse-ring"></div>
              <div className="listening-pulse-ring"></div>
              <div className="listening-pulse-ring"></div>
            </>
          )}
          
          <button 
            className="fab" 
            onClick={onStop} 
            style={{ 
              position: 'absolute', 
              top: 28, 
              backgroundColor: listeningState === 'processing' ? 'var(--md-sys-color-surface-variant)' : 'var(--md-sys-color-error)',
              color: listeningState === 'processing' ? 'var(--md-sys-color-on-surface-variant)' : 'white'
            }}
          >
            <span className="material-symbols-outlined">
              {listeningState === 'processing' ? 'hourglass_empty' : 'mic_off'}
            </span>
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <h3 className="category-title" style={{ color: 'var(--md-sys-color-on-background)' }}>
            {listeningState === 'processing' ? 'Understanding...' : 'Listening...'}
          </h3>
          <p style={{ 
            fontSize: 18, 
            minHeight: 48,
            color: transcript ? 'var(--md-sys-color-on-background)' : 'var(--md-sys-color-on-surface-variant)',
            fontStyle: transcript ? 'normal' : 'italic'
          }}>
            {transcript || "Speak now..."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
