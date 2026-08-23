import React from 'react';

export interface LanguagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (langCode: string) => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ isOpen, onClose, onSelect }) => {
  // Renders: Blurred overlay, Language selection modal with search,
  // and list of languages with checkmark on the active locale.
  if (!isOpen) return null;
  
  return (
    <div className="language-picker-overlay-placeholder">
      {/* Stitch UI Tailwind classes for language modal will go here */}
    </div>
  );
};
