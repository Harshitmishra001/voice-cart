import React from 'react';
import { useShoppingList } from '../hooks/useShoppingList';
import { useStore } from '../store/useStore';

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
  const showToast = useStore(s => s.showToast);

  if (cartCount === 0) return null;

  const handleShare = async () => {
    let text = '🛒 *My Voice Cart List*\n\n';
    
    Object.entries(groupedCart).forEach(([category, items]) => {
      const icon = categoryEmoji[category] || '📦';
      const title = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
      text += `${icon} *${title}*\n`;
      items.forEach(item => {
        const checkbox = item.completed ? '✅' : '⬜';
        const qtyString = item.quantity === 1 && item.unit === 'pcs' ? '' : ` (${item.quantity} ${item.unit})`;
        text += `${checkbox} ${item.name}${qtyString}\n`;
      });
      text += '\n';
    });

    if (totalPrice > 0) {
      text += `*Total Estimated:* ₹${totalPrice}`;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Shopping List',
          text: text,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          showToast('Failed to share list');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast('List copied to clipboard!');
      } catch {
        showToast('Failed to copy list');
      }
    }
  };

  return (
    <div className="cart-screen" style={{ paddingBottom: 64 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Your List ({cartCount})</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          <button 
            onClick={handleShare}
            className="text-primary"
            style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>share</span>
            Share
          </button>
          <button 
            onClick={clearCart}
            className="text-primary"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            Clear all
          </button>
        </div>
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
                  <span style={{ fontSize: 14, fontWeight: 500, minWidth: 40, textAlign: 'center', padding: '0 4px' }}>
                    {item.quantity} {item.unit}
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
      
      {totalPrice > 0 && (
        <div 
          className="slide-up"
          style={{ 
            position: 'fixed',
            bottom: 104,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: 440,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            padding: '16px 24px',
            borderRadius: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.4)',
            zIndex: 30
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)' }}>Total Estimated</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--md-sys-color-primary)', letterSpacing: '-0.5px' }}>
            ₹{totalPrice}
          </span>
        </div>
      )}
    </div>
  );
};
