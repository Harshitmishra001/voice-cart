import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const Toast: React.FC = () => {
  const toastMessage = useStore((s) => s.toastMessage);
  const showToast = useStore((s) => s.showToast);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        showToast('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, showToast]);

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        {toastMessage}
      </div>
    </div>
  );
};
