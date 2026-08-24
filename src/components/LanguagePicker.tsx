import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SUPPORTED_LANGUAGES } from '../constants';

export interface LanguagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (langCode: string) => void;
  currentLanguage: string;
  canClose?: boolean;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({ isOpen, onClose, onSelect, currentLanguage, canClose = true }) => {
  const [search, setSearch] = useState('');
  
  if (!isOpen) return null;
  
  const filtered = SUPPORTED_LANGUAGES.filter(
    l => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="full-screen-modal">
      <div className="app-header" style={{ borderBottom: 'none' }}>
        {canClose ? (
          <button onClick={onClose} style={{ padding: 8 }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        ) : (
          <div style={{ width: 40 }}></div>
        )}
        <h2 style={{ fontSize: 18, fontWeight: 500 }}>Select Language</h2>
        <div style={{ width: 40 }}></div>
      </div>
      
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'var(--md-sys-color-surface-variant)', 
          borderRadius: 24,
          padding: '8px 16px'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>search</span>
          <input 
            type="text" 
            placeholder="Search language..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              outline: 'none', 
              marginLeft: 8, 
              width: '100%',
              fontSize: 16,
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map(lang => (
          <div 
            key={lang.code}
            onClick={() => {
              onSelect(lang.code);
              onClose();
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '16px 24px',
              borderBottom: '1px solid var(--md-sys-color-outline)',
              cursor: 'pointer',
              backgroundColor: currentLanguage === lang.code ? 'var(--md-sys-color-primary-container)' : 'transparent'
            }}
          >
            <div style={{ 
              width: 40, height: 40, 
              borderRadius: '50%', 
              backgroundColor: 'var(--md-sys-color-surface-variant)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 14
            }}>
              {lang.code.split('-')[0].toUpperCase()}
            </div>
            <div style={{ marginLeft: 16, flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{lang.name}</div>
              <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)' }}>{lang.script}</div>
            </div>
            {currentLanguage === lang.code && (
              <span className="material-symbols-outlined text-primary">check</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
