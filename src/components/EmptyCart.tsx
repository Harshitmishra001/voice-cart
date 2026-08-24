import React from 'react';

export interface EmptyCartProps {
  onStartShopping: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onStartShopping }) => {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined">shopping_cart</span>
      <h2 className="category-title" style={{ color: 'var(--md-sys-color-on-background)' }}>Your cart is empty</h2>
      <p style={{ marginBottom: 24 }}>Tap the mic and start adding items</p>
      <button 
        className="lang-btn bg-primary" 
        onClick={onStartShopping}
        style={{ padding: '12px 24px', borderRadius: 24 }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>mic</span>
        Start Shopping
      </button>
    </div>
  );
};
