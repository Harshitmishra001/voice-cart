import React from 'react';

export interface EmptyCartProps {
  onStartShopping: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onStartShopping }) => {
  // Renders: Centered illustration/icon, "Your cart is empty" message, 
  // and a prominent "Start Shopping" button or mic prompt.
  return (
    <div className="empty-cart-placeholder">
      {/* Stitch UI Tailwind classes for empty state will go here */}
    </div>
  );
};
