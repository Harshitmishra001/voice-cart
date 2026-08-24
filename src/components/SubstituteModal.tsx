import React from 'react';
import { motion } from 'motion/react';

export interface SubstituteModalProps {
  outOfStockItem: string | null;
  suggestedSubstitutes: string[];
  onSwap: (substitute: string) => void;
  onIgnore: () => void;
}

export const SubstituteModal: React.FC<SubstituteModalProps> = ({ 
  outOfStockItem, 
  suggestedSubstitutes, 
  onSwap, 
  onIgnore 
}) => {
  if (!outOfStockItem) return null;

  return (
    <div className="overlay" style={{ zIndex: 110 }}>
      <div style={{ flex: 1 }} onClick={onIgnore}></div>
      <motion.div 
        className="bottom-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 48, marginBottom: 8 }}>production_quantity_limits</span>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>{outOfStockItem} is out of stock</h2>
          <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 8 }}>
            Would you like a substitute instead?
          </p>
        </div>

        {suggestedSubstitutes.length === 0 ? (
          <div className="shimmer" style={{ height: 60, borderRadius: 12, marginBottom: 16 }}></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {suggestedSubstitutes.map(sub => (
              <div 
                key={sub} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 16,
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 12
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 500 }}>{sub}</span>
                <button 
                  className="bg-primary"
                  style={{ padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}
                  onClick={() => onSwap(sub)}
                >
                  Swap
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={onIgnore}
          style={{ 
            width: '100%', 
            padding: 16, 
            borderRadius: 24, 
            backgroundColor: 'var(--md-sys-color-surface-variant)',
            color: 'var(--md-sys-color-on-surface)',
            fontSize: 16,
            fontWeight: 600
          }}
        >
          Ignore
        </button>
      </motion.div>
    </div>
  );
};
