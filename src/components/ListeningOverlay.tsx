import React from 'react';
import { useStore } from '../store/useStore';

export interface ListeningOverlayProps {
  onStop: () => void;
}

export const ListeningOverlay: React.FC<ListeningOverlayProps> = ({ onStop }) => {
  // Renders: Dimmed background backdrop, active pulsing mic animation, 
  // and the live transcript bubble overlaying the cart context.
  return (
    <div className="listening-overlay-placeholder">
      {/* Stitch UI Tailwind classes for listening state will go here */}
    </div>
  );
};
