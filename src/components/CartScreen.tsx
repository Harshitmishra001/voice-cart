import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  other: '📦',
  stationary: '✏️',
  household: '🧹'
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
    <div className="cart-screen">
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

      <AnimatePresence>
        {Object.entries(groupedCart).map(([category, items]) => (
          <motion.div 
            key={category} 
            className="cart-category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="category-title">
              {categoryEmoji[category] || '📦'} {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
            </h3>
            
            <AnimatePresence>
              {items.map(item => (
                <motion.div 
                  key={item.id} 
                  className={`cart-item ${item.completed ? 'completed' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="item-details" onClick={() => toggleComplete(item.id)}>
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">
                      {item.price > 0 ? `₹${item.price}` : ''} 
                      {item.price > 0 && item.unit !== 'pcs' ? ` / ${item.unit}` : ''}
                    </div>
                  </div>
                  
                  <div className="qty-stepper">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - (item.unit === 'kg' ? 0.5 : 1))}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                    </button>
                    <span>{item.quantity} {item.unit}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + (item.unit === 'kg' ? 0.5 : 1))}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                    </button>
                  </div>
                  
                  <button className="check-btn" onClick={() => toggleComplete(item.id)}>
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {totalPrice > 0 && (
        <div className="total-floating-card slide-up">
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)' }}>Total Estimated</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--md-sys-color-primary)', letterSpacing: '-0.5px' }}>
            ₹{totalPrice}
          </span>
        </div>
      )}
    </div>
  );
};
