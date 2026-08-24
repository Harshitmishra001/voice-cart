import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { SUPPORTED_LANGUAGES } from './constants';
import { initModels } from './services/nlp.service';
import { hasApiKey } from './services/llm.service';
import { useShoppingList } from './hooks/useShoppingList';
import { useVoiceInput } from './hooks/useVoiceInput';
import { useSuggestions } from './hooks/useSuggestions';
import { useVoiceSearch } from './hooks/useVoiceSearch';

// Components
import { CartScreen } from './components/CartScreen';
import { EmptyCart } from './components/EmptyCart';
import { LanguagePicker } from './components/LanguagePicker';
import { ListeningOverlay } from './components/ListeningOverlay';
import { SubstituteModal } from './components/SubstituteModal';
import { VoiceSearchResults } from './components/VoiceSearchResults';
import { ApiKeyPrompt } from './components/ApiKeyPrompt';
import { Toast } from './components/Toast';
import { getSubstitutes } from './services/llm.service';

function App() {
  const language = useStore((s) => s.language);
  const hasSelectedLanguage = useStore((s) => s.hasSelectedLanguage);
  const setLanguage = useStore((s) => s.setLanguage);
  const isLanguagePickerOpen = useStore((s) => s.isLanguagePickerOpen);
  const setLanguagePickerOpen = useStore((s) => s.setLanguagePickerOpen);
  const modelLoaded = useStore((s) => s.modelLoaded);
  const setModelLoaded = useStore((s) => s.setModelLoaded);
  const outOfStockItem = useStore((s) => s.outOfStockItem);
  const substitutes = useStore((s) => s.substitutes);
  const setSubstituteModal = useStore((s) => s.setSubstituteModal);
  
  const { cartCount, addItem } = useShoppingList();
  const { toggleListening, isSupported, isListening, isProcessing } = useVoiceInput();
  const { suggestions, refresh: refreshSuggestions } = useSuggestions();
  const { searchResults, hasResults, clearResults } = useVoiceSearch();

  useEffect(() => {
    initModels().then(() => {
      setModelLoaded(true);
    });
  }, [setModelLoaded]);

  // Handle substitute fetch
  useEffect(() => {
    if (outOfStockItem && substitutes.length === 0) {
      getSubstitutes(outOfStockItem).then(subs => {
        setSubstituteModal(outOfStockItem, subs);
      });
    }
  }, [outOfStockItem, substitutes.length, setSubstituteModal]);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  if (!modelLoaded) {
    return (
      <div className="empty-state">
        <div className="shimmer" style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 16 }}></div>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>Initializing AI Models...</h2>
        <p style={{ color: 'var(--md-sys-color-on-surface-variant)', marginTop: 8 }}>This only happens once.</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Left Panel: Header, Mic, and Empty State on Desktop */}
      <div className="left-panel">
        <div className="app-header">
          <div className="app-title">
            <span className="material-symbols-outlined text-primary">shopping_basket</span>
            Voice Cart
          </div>
          <button 
            className="lang-btn"
            onClick={() => setLanguagePickerOpen(true)}
          >
            {currentLangObj.code.split('-')[0].toUpperCase()}
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_drop_down</span>
          </button>
        </div>

        {cartCount === 0 && (
          <EmptyCart onStartShopping={toggleListening} />
        )}

        {isSupported && !isListening && !isProcessing && !isLanguagePickerOpen && (
          <div className="fab-container">
            <button className="fab" onClick={toggleListening}>
              <span className="material-symbols-outlined">mic</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Panel: Cart Content */}
      <div className="right-panel">
        <div className="main-content" style={{ display: cartCount === 0 ? 'none' : 'block' }}>
          <CartScreen />
        </div>
      </div>

      {/* Overlays & Modals */}
      <LanguagePicker 
        isOpen={isLanguagePickerOpen} 
        onClose={() => setLanguagePickerOpen(false)} 
        onSelect={setLanguage} 
        currentLanguage={language} 
        canClose={hasSelectedLanguage}
      />
      
      <ListeningOverlay onStop={toggleListening} />
      
      <SubstituteModal 
        outOfStockItem={outOfStockItem} 
        suggestedSubstitutes={substitutes} 
        onSwap={(sub) => {
          addItem(sub, 1, 'pcs');
          setSubstituteModal(null, []);
        }} 
        onIgnore={() => setSubstituteModal(null, [])} 
      />
      
      {hasResults && (
        <VoiceSearchResults 
          results={searchResults} 
          onAdd={(product) => {
            addItem(product.name, 1, product.unit);
            clearResults();
          }} 
          onClose={clearResults} 
        />
      )}
      
      <Toast />
    </div>
  );
}

export default App;
