import React from 'react';
import { Product } from '../types';

export interface VoiceSearchResultsProps {
  results: Product[];
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export const VoiceSearchResults: React.FC<VoiceSearchResultsProps> = ({ results, onAdd, onClose }) => {
  if (results.length === 0) return null;

  return (
    <div className="full-screen-modal">
      <div className="app-header">
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>Search Results</h2>
        <button onClick={onClose} style={{ padding: 8 }}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div style={{ padding: '16px 16px 0', color: 'var(--md-sys-color-on-surface-variant)' }}>
        Found {results.length} items
      </div>

      <div className="main-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {results.map(product => (
            <div 
              key={product.id}
              style={{ 
                border: '1px solid var(--md-sys-color-outline)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                opacity: product.inStock ? 1 : 0.6
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>
                {product.category === 'dairy' ? '🥛' : 
                 product.category === 'produce' ? '🥬' : 
                 product.category === 'bakery' ? '🍞' : '📦'}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>{product.name}</h3>
              <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 12 }}>
                ₹{product.price} / {product.unit}
              </div>
              
              <div style={{ flex: 1 }}></div>
              
              {product.inStock ? (
                <button 
                  className="bg-primary"
                  style={{ width: '100%', padding: '8px 0', borderRadius: 20, fontSize: 14, fontWeight: 600 }}
                  onClick={() => onAdd(product)}
                >
                  Add
                </button>
              ) : (
                <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--md-sys-color-error)', fontWeight: 500, padding: '8px 0' }}>
                  Out of Stock
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
