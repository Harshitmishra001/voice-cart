# 🛒 Voice Cart — Antigravity Source of Truth

> This document is the **single source of truth** for all development work on the `voice-cart` project.
> Read this fully before making any changes. Every decision made is documented here with reasoning.

---

## 1. Project Identity

| Property | Value |
|---|---|
| **Project Name** | Voice Cart |
| **Repo Name** | `voice-cart` |
| **License** | MIT |
| **Status** | Scaffold — ready for implementation |
| **Deadline** | 24th August 2026 |
| **Hosting Target** | Vercel |

---

## 2. What This Project Is

Voice Cart is a **voice-powered shopping list manager** built as a technical assessment submission for a Software Engineer position.

Users speak into their microphone in any of **8 supported Indian languages**. The app:
1. Captures their voice via the browser's Web Speech API
2. Transcribes it to text (in whatever language the user spoke)
3. Passes raw transcript through a **multilingual sentence encoder** (MiniLM-L12-v2 via Transformers.js) — no translation needed
4. A trained **intent classifier** on top of the encoder determines action (add/remove/search/update_qty)
5. A **food word lookup table** + regex extracts item name, quantity, unit from the transcript
6. Cart updates, UI re-renders
7. Uses **OpenRouter LLM** separately and only for smart suggestions and substitute recommendations

This is a **portfolio-quality assessment project**, not a production app. Decisions are optimized for clean code, working functionality, and demonstrable features — not scale or production security.

---

## 3. The Assignment Requirements (Non-Negotiable)

These are the exact features the company is evaluating. Every single one must be present and working:

### 3.1 Voice Input
- **Voice Command Recognition** — "Add milk", "I need apples", "Buy 3 oranges"
- **NLP Intent Parsing** — understand varied phrases for the same intent
- **Multilingual Support** — 8 Indian languages (see Section 6)

### 3.2 Smart Suggestions
- **Product Recommendations** — based on what's already in the cart
- **Seasonal Recommendations** — items in season right now
- **Substitutes** — offer alternatives when an item is unavailable

### 3.3 Shopping List Management
- **Add/Remove Items** — via voice commands
- **Auto-Categorization** — dairy, produce, bakery, snacks, beverages etc.
- **Quantity Management** — "Add 2 bottles of water", "Buy 5 oranges"

### 3.4 Voice-Activated Search
- **Item Search** — "Find me organic apples"
- **Price Range Filtering** — "Find toothpaste under ₹100"

### 3.5 UI/UX
- **Minimalist Interface** — clean, uncluttered
- **Visual Feedback** — real-time transcript display, toast confirmations
- **Mobile-First** — optimized for mobile, voice-only interactions

### 3.6 Technical Requirements
- Clean, production-quality code
- Basic error handling (try/catch in all services, error boundaries in React)
- Loading states for all async operations
- Simple documentation explaining the approach

### 3.7 Deliverables
1. Working hosted URL (Vercel)
2. GitHub repo with source code and README
3. Brief write-up of approach — **200 words max** — saved as `APPROACH.md` in repo root

---

## 4. Tech Stack (Locked — Do Not Change)

| Technology | Role | Notes |
|---|---|---|
| **React 18** | UI framework | Already scaffolded |
| **TypeScript** | Type safety | Strict mode enabled |
| **Zustand** | Global state | Cart, language, listening state |
| **Vite 5** | Build tool | With PWA plugin |
| **vite-plugin-pwa** | PWA support | Installable, offline-capable |
| **Web Speech API** | Speech-to-text | Browser-native, free, zero cost, lang-specific |
| **Transformers.js** | Multilingual sentence encoder | Runs MiniLM-L12-v2 in browser via WebAssembly |
| **MiniLM-L12-v2** | Sentence encoder model | 50+ languages, maps semantically similar phrases to same vector |
| **Custom intent classifier** | Intent classification | Trained on top of MiniLM vectors via Colab |
| **@tensorflow/tfjs** | Classifier training + inference | Lightweight dense layers on top of MiniLM embeddings |
| **foodwords.json** | Multilingual food word lookup | Maps regional words to English item names (pyaaz→onion, kanda→onion) |
| **SmolLM3-3B (LM Studio)** | Dataset + foodwords generation | Local endpoint, no cost, generates multilingual training data |
| **Google Colab** | Classifier training | Free GPU, exports TF.js compatible model |
| **OpenRouter API** | LLM for suggestions only | Free tier, no data retention — NOT used for NLP |
| **Mistral 7B Instruct** | Suggestions LLM model | `mistralai/mistral-7b-instruct:free` |
| **Mock JSON catalogue** | Product data | ~50 items, no real API needed |
| **Vercel** | Hosting | Free tier, one-command deploy |

---

## 5. UI Reference (Stitch-Generated Screens)

The UI was designed in **Stitch** using **Material Design 3** tokens with a green-primary color system and **Material Symbols Outlined** icons. The Stitch HTML files are the direct UI reference — copy Tailwind classes from them into components.

### Design System Tokens
- **Primary**: `#0d631b` (green)
- **Font**: Inter
- **Icons**: Material Symbols Outlined
- **Border radius**: `rounded-xl` for cards, `rounded-full` for buttons and chips
- **Spacing**: `md=16px`, `lg=24px`, `xl=32px`, `sm=8px`

### Screens Built (6 total)

| Screen | Component | State it covers |
|---|---|---|
| Main Cart | `CartScreen.tsx` | Default view, categorized list, suggestion chips |
| Empty Cart | `EmptyCart.tsx` | No items in cart yet |
| Listening State | `ListeningOverlay.tsx` | Mic active, pulsing rings, transcript bubble, dimmed bg |
| Substitute Modal | `SubstituteModal.tsx` | Out of stock → swap flow, Ignore/Swap actions |
| Voice Search Results | `VoiceSearchResults.tsx` | Product grid with price + add button |
| Language Picker | `LanguagePicker.tsx` | Searchable overlay with locale codes (EN, HI, TA etc.) |

### Key UI Rules from Stitch
- Mic button is always `rounded-full` — never `rounded-2xl`
- Check buttons on items are `rounded-full`
- Completed items hide the quantity stepper entirely — do not show disabled steppers
- Seasonal suggestion chips use amber/secondary tones, distinct from regular chips
- Toast/snackbar confirms every voice action — "Milk added ✓"
- Bottom nav stays visible at all times except during listening state (opacity-30)
- Transcript appears inside the listening footer, not as a floating bubble above it
- Language picker has a search input at the top and shows locale code badges (EN, HI, FR etc.)

---

## 6. Supported Languages

These are the 8 Indian languages scaffolded in `src/constants/index.ts`:

| Code | Language | Script |
|---|---|---|
| `en-IN` | English | Latin |
| `hi-IN` | Hindi | हिन्दी |
| `ta-IN` | Tamil | தமிழ் |
| `te-IN` | Telugu | తెలుగు |
| `kn-IN` | Kannada | ಕನ್ನಡ |
| `ml-IN` | Malayalam | മലയാളം |
| `bn-IN` | Bengali | বাংলা |
| `mr-IN` | Marathi | मराठी |

**Default language**: `hi-IN` (Hindi)

Language switching is:
- **Free** — Web Speech API runs entirely in the browser, zero API cost
- **Already wired** — `LanguagePicker` writes to Zustand, `stt.service.ts` reads from it
- **Required by the assignment** — listed explicitly as a mandatory feature

---

## 7. Multilingual NLP — How Indian Language Phrases Are Handled

This is the most critical architectural decision. We use a **multilingual sentence encoder** so no translation is needed — the model understands all 8 languages natively.

### Why no translation layer
Translation APIs (MyMemory, Google Translate) fail on:
- Hinglish (mixed Hindi-English): "2 kg onion bhi lena hai"
- Casual regional speech: "kanda beku" (Kannada), "vengayam add pannu" (Tamil colloquial)
- Number words: "do kilo" (Hindi), "eradu kilo" (Kannada), "rendu kilo" (Telugu)
- Filler words: "bhaiya", "yaar", "na", "bhi", "toh"

Instead we use `paraphrase-multilingual-MiniLM-L12-v2` — a transformer that maps semantically equivalent phrases across 50+ languages to the **same vector space**.

"Add onions" → vector [0.23, -0.41, ...]
"pyaaz daalo" → vector [0.24, -0.40, ...]  ← nearly identical
"kanda beku" → vector [0.22, -0.42, ...]   ← nearly identical

### Full Pipeline — Example: "2 kilo pyaaz lene hai"

```
Step 1 — STT
Web Speech API set to lang="hi-IN"
Output: "2 kilo pyaaz lene hai"

Step 2 — Preprocessor (preprocessor.service.ts)
- Strip fillers: "bhaiya", "yaar", "na", "bhi", "toh", "please"
- Convert number words → digits:
    do→2, teen→3, char→4 (Hindi)
    eradu→2, mooru→3 (Kannada)
    rendu→2, moodu→3 (Telugu)
    irandu→2, moondru→3 (Tamil)
- Detect "aur"/"ani"/"mattu" (= "and") → flag for multi-item split
Output: "2 kilo pyaaz lene hai" (cleaned)

Step 3 — MiniLM Encoder (Transformers.js, runs in browser)
Input: "2 kilo pyaaz lene hai"
Output: 384-dimensional semantic vector
No translation. Works directly on raw Indian language text.

Step 4 — Intent Classifier (custom TF.js model)
Input: 384-dim vector
Output: intent = "add" (confidence 0.91)
Model trained on multilingual vectors from all 8 languages

Step 5 — Entity Extraction (foodwords.json + regex)
foodwords.json lookup: "pyaaz" → "onion"
regex: quantity = 2, unit = "kilo" → normalized to "kg"
Output: { item: "onion", qty: 2, unit: "kg" }

Step 6 — products.json match
"onion" matched → { name: "Onion", category: "produce", price: 30 }

Step 7 — Zustand update
addItem({ id: uuid(), name: "Onion", qty: 2, unit: "kg", category: "produce", price: 30 })

Step 8 — UI
CartScreen re-renders, Toast: "Onion (2 kg) added ✓"
Item appears under Produce category
```

### Same example in Kannada: "2 kilo kanda beku"
- Preprocessor: no number words, no fillers → passes through clean
- MiniLM: "kanda beku" maps to nearly the same vector as "add onions"
- Intent classifier: "add"
- foodwords.json: "kanda" → "onion"
- Regex: qty=2, unit="kilo"→"kg"
- Result: identical cart update ✓

### foodwords.json — Structure
```json
{
  "pyaaz": "onion",
  "kanda": "onion",
  "vengayam": "onion",
  "eerulli": "onion",
  "ulli": "onion",
  "piyaj": "onion",
  "doodh": "milk",
  "paal": "milk",
  "halu": "milk",
  "tamatar": "tomato",
  "thakkali": "tomato",
  "roti": "bread"
}
```
Generate this with SmolLM3-3B: cover all 50 product catalogue items across all 8 languages. Target ~400 entries.

### New files required
| File | Purpose |
|---|---|
| `src/services/preprocessor.service.ts` | Strip fillers, convert number words, detect multi-item |
| `src/data/foodwords.json` | Multilingual food word → English item name lookup |
| `training/dataset.json` | Multilingual labelled phrases (SmolLM3-3B generated) |
| `training/train.ipynb` | Colab notebook — encodes phrases with MiniLM, trains classifier |
| `public/model/model.json` | Exported trained classifier |
| `public/model/*.bin` | Classifier weight shards |

### What NOT to create
- ~~`translate.service.ts`~~ — removed entirely, MiniLM handles all languages natively

---

## 8. NLP Layer — Custom Trained Intent Classifier

**This is a fully custom-trained NLP model, not a third-party API or pretrained LLM.**
The assignment explicitly requires NLP as its own feature. We train a real text classification model and run it in the browser via TensorFlow.js.

---

### Architecture Overview

```
STT transcript (raw, any Indian language)
    ↓
preprocessor.service.ts (filler removal, number word conversion)
    ↓
nlp.service.ts
    ├── Transformers.js MiniLM encoder → 384-dim semantic vector
    ├── TF.js intent classifier → add/remove/search/update_qty
    └── foodwords.json + regex → item name, quantity, unit
    ↓
ParsedIntent { action, item, quantity, unit }
    ↓
useShoppingList hook
```

---

### Step 1 — Dataset Generation (SmolLM3-3B via LM Studio)

**Do not write phrases manually. Use your local LM Studio endpoint to generate them.**

LM Studio local endpoint: `http://localhost:1234/v1/chat/completions`

Prompt to send for each intent class:
```
Generate 100 unique natural language phrases a user might say to {action} an item 
from a grocery shopping list. Vary the phrasing significantly. Include phrases with 
quantities (e.g. "2 bottles of", "3 kg of"), brand mentions, and casual speech. 
Return as a JSON array of strings only. No explanation.
```

Run this prompt for each intent × each language = 32 prompts total (4 intents × 8 languages):

```
Generate 50 unique natural language phrases a real Indian person might say 
to [ACTION] a grocery item, spoken in [LANGUAGE]. Include casual speech, 
Hinglish mixing, number words (do/teen/eradu), filler words (yaar/na/bhi), 
varied word order, and quantity mentions. Return as JSON array of strings only.
```

Intents: add, remove, search, update_qty
Languages: English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi

**Target: 50 phrases × 4 intents × 8 languages = 1600 total labelled examples**

This gives the MiniLM encoder + classifier real multilingual variety to train on.

Save output as `training/dataset.json`:
```json
[
  { "text": "Add milk to my list", "label": "add" },
  { "text": "Remove bananas", "label": "remove" },
  { "text": "Find organic apples", "label": "search" },
  { "text": "Change milk to 3 litres", "label": "update_qty" }
]
```

---

### Step 2 — Model Training (Google Colab, free GPU)

Training approach — encode then classify:
1. Load `dataset.json` (1600 multilingual phrases)
2. Run each phrase through `paraphrase-multilingual-MiniLM-L12-v2` → 384-dim vectors
3. Train a lightweight classifier on top of those vectors:
   - Input: 384-dim vector
   - Dense(128, relu) → Dense(64, relu) → Dense(4, softmax)
   - 4 output classes: add, remove, search, update_qty
4. Framework: TensorFlow / Keras
5. Export: `tensorflowjs_converter` → `model.json` + weight shards
6. Training time: ~15-20 minutes on Colab free GPU

**Note:** Only the lightweight classifier is exported to `public/model/`. The MiniLM encoder itself is loaded separately in the browser via `@xenova/transformers` from HuggingFace CDN at runtime.

Save exported classifier to:
```
public/
└── model/
    ├── model.json
    └── group1-shard1of1.bin
```

---

### Step 3 — Browser Inference (Transformers.js + TF.js)

Two-stage inference in `src/services/nlp.service.ts`:

```ts
// Install: npm install @xenova/transformers @tensorflow/tfjs

// Stage 1: MiniLM encoding (Transformers.js)
// Model: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
// Loaded from HuggingFace CDN at runtime (~120MB, cached after first load)
// Input: raw transcript string (any Indian language)
// Output: Float32Array of 384 dimensions

// Stage 2: Intent classification (TF.js)
// Model: loaded from public/model/model.json
// Input: 384-dim vector from Stage 1
// Output: softmax probabilities → argmax → intent class string
// Classes: ['add', 'remove', 'search', 'update_qty']
```

---

### Step 4 — Entity Extraction (foodwords.json + regex)

No compromise.js for entity extraction — use direct lookup + regex instead:

```ts
// foodwords.json lookup: "pyaaz" → "onion", "kanda" → "onion"
// Regex for quantity: /(\d+)\s*(kg|kilo|g|gram|litre|liter|L|pcs|packet|bottle)/i
// If no quantity found → default to 1
// If item not in foodwords → use the raw word as item name (graceful fallback)
```

---

### Output Interface
```ts
interface ParsedIntent {
  action: 'add' | 'remove' | 'search' | 'update_qty';
  item: string;
  quantity: number;
  unit: string;
}
```

---

### Files Involved
| File | Purpose |
|---|---|
| `training/dataset.json` | LLM-generated labelled dataset (400 phrases) |
| `training/train.ipynb` | Google Colab notebook for model training |
| `public/model/model.json` | Exported trained model |
| `public/model/*.bin` | Model weight shards |
| `src/services/nlp.service.ts` | Loads model, runs inference + entity extraction |

---

### Important Notes for Antigravity
- `training/` folder is for reference only — do not bundle it into the Vite build
- Add `training/` to `.gitignore` if dataset is large, but keep `train.ipynb` in repo
- `public/model/` MUST be committed — it is the trained model the app loads at runtime
- Model load is async — show a loading state on app init until model is ready
- If model fails to load → fall back to regex pattern matching for basic intent parsing

---

## 8b. LLM Layer — Suggestions & Substitutes Only (OpenRouter)

The LLM is **not** used for intent parsing. It is used only for:
1. Smart product recommendations based on cart contents
2. Seasonal suggestions
3. Substitute recommendations when an item is unavailable

### Model
```
mistralai/mistral-7b-instruct:free
```
- Completely free, no data retention
- Base URL: `https://openrouter.ai/api/v1/chat/completions`
- Auth: `Authorization: Bearer YOUR_OPENROUTER_KEY`
- Env variable: `VITE_OPENROUTER_API_KEY=your_key_here`

### API Key UX Flow
The app core works WITHOUT any API key — NLP, STT, search, cart all work key-free.
The key is only needed for AI suggestions and substitutes:

1. `App.tsx` checks `localStorage` for `openrouter_api_key` on load
2. If not found, checks `import.meta.env.VITE_OPENROUTER_API_KEY`
3. If neither → suggestions fall back to hardcoded seasonal + history logic from `constants/index.ts`
4. A subtle "Enable AI suggestions" prompt appears in the suggestions area — not a blocking screen
5. User enters key → saved to `localStorage` → AI suggestions activate immediately
6. `llm.service.ts` always reads from `localStorage` first, then env

**Note:** `ApiKeyPrompt.tsx` is a non-blocking inline component inside the suggestions area — not a full-screen gate. The app never blocks on missing key.

### What the LLM receives
Current cart items as a comma-separated list — e.g. `"milk, bread, eggs"`

### What the LLM must return
Strict JSON array only:
```json
["butter", "cheese", "yogurt"]
```

### System prompt for suggestions in `suggestions.service.ts`
```
You are a grocery shopping assistant. Given a shopping cart containing: {items}, suggest 3-5 complementary grocery items the user likely needs. Return ONLY a JSON array of item name strings. No explanation, no markdown, no backticks.
```

### System prompt for substitutes in `llm.service.ts`
```
You are a grocery shopping assistant. The item "{item}" is unavailable. Suggest 3 substitute products. Return ONLY a JSON array of substitute name strings. No explanation, no markdown, no backticks.
```

---

## 9. Product Catalogue (Mock JSON)

No real product API. Use a local mock JSON file at `src/data/products.json`.

### Structure
```json
[
  {
    "id": "1",
    "name": "Whole Milk",
    "category": "dairy",
    "unit": "L",
    "price": 60,
    "inStock": true
  }
]
```

### Categories to cover (~50 items total)
- **Dairy** (8 items): milk, yogurt, butter, cheese, paneer, cream, ghee, curd
- **Produce** (12 items): tomato, onion, potato, spinach, banana, apple, mango, lemon, ginger, garlic, carrot, capsicum
- **Bakery** (5 items): bread, sourdough, buns, rusk, cookies
- **Beverages** (6 items): water, orange juice, coconut water, tea, coffee, nimbu pani
- **Snacks** (5 items): chips, biscuits, namkeen, popcorn, chocolate
- **Pantry** (8 items): rice, dal, oil, sugar, salt, flour, turmeric, cumin
- **Personal Care** (4 items): toothpaste, soap, shampoo, hand wash
- **Frozen** (2 items): ice cream, frozen peas

### Search logic in `search.service.ts`
- Filter `products.json` by matching query string against item name (case-insensitive)
- If price filter detected in transcript (e.g. "under ₹100"), filter by `price <= 100`
- Return matching items as `CartItem[]`

---

## 10. Seasonal Suggestions

Hardcode in `src/constants/index.ts` by month index (0=Jan, 11=Dec):

```
Jan-Feb: carrots, peas, cauliflower, strawberries
Mar-Apr: mangoes, watermelon, cucumbers
May-Jun: lychee, jamun, raw mango
Jul-Aug: corn, plums, peaches → current month
Sep-Oct: pomegranate, grapes, sweet potato
Nov-Dec: guava, oranges, dates
```

Current month is August → seasonal suggestions: **corn, plums, peaches**

---

## 11. Current Codebase State

### ✅ Done — Do Not Rewrite
- Project config (Vite, TypeScript, PWA, package.json)
- Zustand store (`useStore.ts`) — cart, language, listening state
- All 4 hooks with correct logic stubs
- `stt.service.ts` — **fully implemented**, uses Web Speech API
- `LanguagePicker.tsx` — **fully wired** to Zustand store
- `ListeningOverlay.tsx` — **wired** to store, needs CSS only
- `SubstituteModal.tsx` — **props-driven**, needs integration + styling
- `VoiceSearchResults.tsx` — **props-driven**, needs integration + styling
- `EmptyCart.tsx` — presentational, needs styling

### ⚠️ Needs Implementation
- `App.tsx` — placeholder, nothing wired up, needs full composition
- `CartScreen.tsx` — placeholder, needs hooks + Stitch UI
- `llm.service.ts` — stub, needs real OpenRouter API call
- `search.service.ts` — stub, needs mock JSON filtering logic
- `suggestions.service.ts` — partial, depends on LLM stub
- `index.css` — completely empty, needs full styles from Stitch

### 🆕 Needs Creation
- `src/services/preprocessor.service.ts` — filler removal, number word conversion, multi-item split
- `src/services/nlp.service.ts` — MiniLM encoding + TF.js classifier + foodwords entity extraction
- `src/data/foodwords.json` — multilingual food word → English item name lookup (~400 entries)
- `src/components/ApiKeyPrompt.tsx` — inline non-blocking API key input for AI suggestions
- `src/data/products.json` — mock product catalogue (~50 items)
- `training/dataset.json` — SmolLM3-3B generated multilingual dataset (1600 phrases)
- `training/train.ipynb` — Google Colab notebook: MiniLM encode → train classifier → export
- `public/model/model.json` — exported trained intent classifier
- `public/model/*.bin` — classifier weight shards
- `public/icon-192.png` — PWA icon
- `public/icon-512.png` — PWA icon
- `APPROACH.md` — 200-word submission write-up (root of repo)
- `README.md` — replace default with project README

### ❌ Do NOT Create
- ~~`translate.service.ts`~~ — removed. MiniLM handles all languages natively, no translation needed.

---

## 12. Data Flow Architecture

```
User speaks (any of 8 Indian languages)
    ↓
useVoiceInput hook
    ↓
stt.service.ts (Web Speech API, lang set from Zustand)
    ↓
Raw transcript string (Hinglish/regional/mixed — no translation)
    ↓
preprocessor.service.ts
  ├── Strip filler words (yaar, bhaiya, na, bhi, toh)
  ├── Convert number words → digits (do→2, eradu→2, rendu→2)
  └── Detect multi-item "aur/mattu/ani" → split into separate commands
    ↓
nlp.service.ts
  ├── Transformers.js MiniLM-L12-v2 → 384-dim semantic vector
  ├── TF.js intent classifier → add/remove/search/update_qty
  └── foodwords.json lookup + regex → item name, quantity, unit
    ↓
ParsedIntent { action, item, quantity, unit }
    ↓
useShoppingList hook
    ↓
Zustand store (cart array updated)
    ↓
CartScreen re-renders, Toast confirmation shown

Parallel flows:
- cart items → useSuggestions → suggestions.service → llm.service (OpenRouter) → suggestion chips
- "search" action → useVoiceSearch → search.service → products.json → VoiceSearchResults
- "item unavailable" → SubstituteModal → llm.service (OpenRouter) → substitutes
- language change → LanguagePicker → Zustand → stt.service lang code

NLP Training pipeline (runs ONCE before app development, outside the codebase):
SmolLM3-3B (LM Studio local)
  → 1600 multilingual labelled phrases (50 × 4 intents × 8 languages)
  → foodwords.json (~400 entries, all 8 languages × 50 grocery items)
    ↓
Google Colab (train.ipynb)
  → encode all phrases with MiniLM → 384-dim vectors
  → train dense classifier on vectors
  → export → public/model/model.json + *.bin
```

---

## 13. Error Handling Requirements

Every service must have try/catch. Minimum coverage:

| Location | Error to handle |
|---|---|
| `stt.service.ts` | Browser doesn't support Web Speech API |
| `stt.service.ts` | User denies microphone permission |
| `nlp.service.ts` | MiniLM model fails to load from HuggingFace CDN → fallback to regex |
| `nlp.service.ts` | Classifier confidence below threshold → ask user to repeat |
| `preprocessor.service.ts` | Unknown number word → pass through as-is |
| `llm.service.ts` | API key missing → fall back to hardcoded suggestions |
| `llm.service.ts` | OpenRouter API down or rate limited → use seasonal fallback |
| `llm.service.ts` | Response is not valid JSON → use seasonal fallback |
| `search.service.ts` | No products match the query → show "No results" state |
| `App.tsx` | React error boundary for component crashes |

All errors should show a user-visible message — not just console.log.

---

## 14. Loading States Required

| Trigger | Loading UI |
|---|---|
| App init | MiniLM model loading screen before app renders |
| Mic active | `ListeningOverlay` visible, pulsing rings animation |
| STT processing | Transcript bubble shows "Processing..." |
| NLP processing | "Understanding..." text while MiniLM encodes + classifier runs |
| Search running | Skeleton cards in `VoiceSearchResults` |
| Suggestions loading | Chip placeholders (shimmer effect) |

---

## 15. Implementation Priority Order

Do this in order. Do not skip ahead:

### Phase 1 — NLP Training Pipeline (do this first, outside the app)
1. **Generate `foodwords.json`** — prompt SmolLM3-3B for all grocery item names across 8 languages
2. **Generate `training/dataset.json`** — 32 prompts to SmolLM3-3B (4 intents × 8 languages, 50 phrases each = 1600 total)
3. **Train model in Colab** — run `training/train.ipynb`: MiniLM encode → train dense classifier → export to `public/model/`
4. **Verify model** — test inference on unseen phrases from all 8 languages before wiring into app

### Phase 2 — Core App Implementation
5. **`src/data/products.json`** — create mock catalogue (~50 items)
6. **`src/data/foodwords.json`** — copy generated foodwords into src/data
7. **`src/services/preprocessor.service.ts`** — filler removal, number word → digit, multi-item split
8. **`src/services/nlp.service.ts`** — MiniLM via Transformers.js + TF.js classifier + foodwords entity extraction
9. **`src/services/llm.service.ts`** — OpenRouter call for suggestions/substitutes only
10. **`src/services/search.service.ts`** — mock JSON filtering with price range support
11. **`src/components/ApiKeyPrompt.tsx`** — inline non-blocking API key input
12. **`src/App.tsx`** — wire everything, model load state on init, key check logic

### Phase 3 — UI + Polish
10. **`src/components/CartScreen.tsx`** — implement with hooks + Stitch UI classes
11. **`src/index.css`** — add all styles from Stitch (pulse-ring, overlays, modals)
12. **Error handling** — add try/catch to all services, fallback to regex if model fails
13. **Loading states** — model init loader on app start, async flow loaders
14. **PWA icons** — add `icon-192.png` and `icon-512.png` to `public/`

### Phase 4 — Submission
15. **`README.md`** — replace with project README
16. **`APPROACH.md`** — 200-word write-up for submission
17. **Vercel deploy** — `vercel deploy` from project root
18. **Submit** — via https://forms.gle/oJmfhqwmG7J7HRsJ7

---

## 16. Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel deploy
```

Set environment variable in Vercel dashboard:
```
VITE_OPENROUTER_API_KEY = your_key_here
```

The app also accepts the key from localStorage at runtime — so evaluators without a `.env` can still enter their own key in the UI.

---

## 17. Submission Checklist

Before submitting via the Google Form:

- [ ] All 4 required features working (voice input, suggestions, list management, voice search)
- [ ] Multilingual support working (language picker switches STT locale)
- [ ] App deployed and live URL accessible
- [ ] GitHub repo is public
- [ ] `README.md` explains the project clearly
- [ ] `APPROACH.md` exists in repo root, under 200 words
- [ ] No console errors in production build
- [ ] Mobile layout tested
- [ ] API key prompt works when no key is present
- [ ] Submit via: https://forms.gle/oJmfhqwmG7J7HRsJ7

---

## 18. What NOT to Do

- Do not change the tech stack
- Do not use a different LLM model or provider
- Do not add routing libraries — single page app only
- Do not rewrite files marked ✅ Done in Section 11
- Do not add a backend server — everything runs client-side
- Do not store the API key anywhere except localStorage or .env
- Do not use any paid APIs or services
- Do not exceed the 200-word limit on APPROACH.md
- Do not change the repo name or license

---

*Last updated: August 2026 | Project: voice-cart | For: Technical Assessment Submission*
