import React from 'react';
import { useShoppingList } from '../hooks/useShoppingList';

const categoryEmoji: Record<string, string> = {
  dairy: '🥛',
  produce: '🥬',
  bakery: '🍞',
  beverages: '🥤',
  snacks: '🍿',
  pantry: '🫙',
  personal_care: '🧴',
  frozen: '🧊',
  other: '📦'
};

export const CartScreen: React.FC = () => {
  const { groupedCart, updateQuantity, toggleComplete, clearCart, totalPrice, cartCount } = useShoppingList();

  if (cartCount === 0) return null;

  return (
    <div className="cart-screen" style={{ paddingBottom: 64 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Your List ({cartCount})</h2>
        <button 
          onClick={clearCart}
          className="text-primary"
          style={{ fontSize: 14, fontWeight: 500 }}
        >
          Clear all
        </button>
      </div>

      {Object.entries(groupedCart).map(([category, items]) => (
        <div key={category} className="cart-category">
          <h3 className="category-title">
            {categoryEmoji[category] || '📦'} {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
          </h3>
          
          {items.map(item => (
            <div key={item.id} className={`cart-item ${item.completed ? 'completed' : ''}`}>
              <div className="item-details" onClick={() => toggleComplete(item.id)}>
                <div className="item-name">{item.name}</div>
                <div className="item-price">
                  {item.price > 0 ? `₹${item.price}` : ''} 
                  {item.price > 0 && item.unit !== 'pcs' ? ` / ${item.unit}` : ''}
                </div>
              </div>
              
              {!item.completed && (
                <div className="qty-stepper">
                  <button 
                    className="qty-btn"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.name, item.quantity - 1, item.unit);
                      }
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.name, item.quantity + 1, item.unit)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                  </button>
                </div>
              )}
              
              <button 
                className="check-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(item.id);
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check</span>
              </button>
            </div>
          ))}
        </div>
      ))}
      
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--md-sys-color-outline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--md-sys-color-on-surface-variant)' }}>Total Estimated</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>₹{totalPrice}</span>
      </div>
    </div>
  );
};
