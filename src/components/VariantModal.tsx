import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { useShoppingList } from '../hooks/useShoppingList';
import { Product } from '../types';

export const VariantModal: React.FC = () => {
  const isOpen = useStore((s) => s.variantModalOpen);
  const genericName = useStore((s) => s.variantGenericName);
  const options = useStore((s) => s.variantOptions);
  const pendingAdd = useStore((s) => s.pendingVariantAdd);
  const closeModal = useStore((s) => s.closeVariantModal);
  
  const { addItem } = useShoppingList();

  if (!isOpen || options.length === 0) return null;

  const handleSelect = (product: Product) => {
    // Add the specific variant chosen
    const q = pendingAdd?.quantity || 1;
    const u = pendingAdd?.unit || product.unit;
    addItem(product.name, q, u);
    closeModal();
  };

  return (
    <div className="overlay" style={{ zIndex: 110 }} onClick={closeModal}>
      <div style={{ flex: 1 }}></div>
      <motion.div 
        className="bottom-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ textTransform: 'capitalize', fontSize: 20, margin: 0 }}>Which {genericName}?</h3>
            <button className="icon-btn" onClick={closeModal} style={{ background: 'none', border: 'none' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 16, marginTop: 0 }}>
              Multiple brand variants found. Please select one:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {options.map((option, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: 16,
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: '#fff',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f7f3'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500 }}>{option.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--md-sys-color-on-surface-variant)' }}>
                      ₹{option.price} / {option.unit}
                    </span>
                  </div>
                  <button 
                    className="add-sub-btn"
                    style={{
                      background: 'var(--md-sys-color-primary-container)',
                      color: 'var(--md-sys-color-on-primary-container)',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 20,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
  );
};
