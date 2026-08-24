import React, { useState } from 'react';
import { setApiKey } from '../services/llm.service';

export interface ApiKeyPromptProps {
  onSaved: () => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onSaved }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      setApiKey(key);
      onSaved();
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--md-sys-color-surface)',
      border: '1px solid var(--md-sys-color-outline)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Enable AI Suggestions</h3>
      </div>
      <p style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 12 }}>
        Enter an OpenRouter API key to get smart grocery suggestions.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input 
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-or-v1-..."
          style={{ 
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--md-sys-color-outline)',
            outline: 'none',
            fontSize: 14,
            fontFamily: 'inherit'
          }}
        />
        <button 
          className="bg-primary"
          onClick={handleSave}
          style={{ padding: '8px 16px', borderRadius: 8, fontWeight: 500 }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
