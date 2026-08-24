import type { ParsedIntent, ParsedMultiIntent } from '../types';
import { INTENT_LABELS, CONFIDENCE_THRESHOLD } from '../constants';
import { extractEntities } from './entityExtractor';
import { extractEntitiesWithLLM } from './llm.service';

let featureExtractor: any = null;
let rawWeights: any = null;
let productEmbeddings: Record<string, number[]> = {};
let modelsLoaded = false;
let modelLoadFailed = false;

// --- Math Utilities for Raw JSON Weights ---
function relu(v: number) {
  return v > 0 ? v : 0;
}

function softmax(arr: number[]) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

function denseLayer(vec: number[], w: number[], b: number[], units: number) {
  const out = new Array(units).fill(0);
  const inputLen = vec.length;
  for (let i = 0; i < units; i++) {
    let sum = b[i];
    for (let j = 0; j < inputLen; j++) {
      sum += vec[j] * w[j * units + i];
    }
    out[i] = sum;
  }
  return out;
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// --- Detect non-Latin scripts (Devanagari, Tamil, Telugu, etc.) ---
function hasNonLatinScript(text: string): boolean {
  // Matches Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati
  return /[\u0900-\u0D7F]/.test(text);
}

// --- Model Loading ---

export async function initModels(): Promise<boolean> {
  try {
    const initPromise = async () => {
      const transformers = await import('@xenova/transformers');
      transformers.env.backends.onnx.wasm.numThreads = 1;
      transformers.env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/';
      
      featureExtractor = await transformers.pipeline(
        'feature-extraction',
        'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
        { quantized: true }
      );

      try {
        const response = await fetch('/model/weights.json');
        rawWeights = await response.json();
      } catch (e) {
        console.warn('Weights not found, using regex fallback:', e);
        rawWeights = null;
      }
      
      try {
        const { default: embeddings } = await import('../data/embeddings.json');
        productEmbeddings = embeddings;
      } catch (e) {
        console.warn('Embeddings not found', e);
      }
      return true;
    };

    // Timeout after 8 seconds
    const timeoutPromise = new Promise<boolean>((_, reject) => 
      setTimeout(() => reject(new Error('Model loading timed out')), 8000)
    );

    await Promise.race([initPromise(), timeoutPromise]);

    modelsLoaded = true;
    return true;
  } catch (e) {
    console.error('Failed to load MiniLM model, falling back to Regex:', e);
    modelLoadFailed = true;
    modelsLoaded = true; // Set to true to unblock UI
    return false;
  }
}

export function isModelLoaded(): boolean {
  return modelsLoaded;
}

export async function findClosestProduct(word: string): Promise<string | null> {
  if (!featureExtractor || Object.keys(productEmbeddings).length === 0) return null;
  try {
    const output = await featureExtractor(word, { pooling: 'mean', normalize: true });
    const vec = Array.from(output.data as Float32Array);
    let bestMatch = null;
    let maxSim = 0.82; // threshold for cosine similarity
    for (const [product, emb] of Object.entries(productEmbeddings)) {
      const sim = dotProduct(vec, emb);
      if (sim > maxSim) {
        maxSim = sim;
        bestMatch = product;
      }
    }
    return bestMatch;
  } catch {
    return null;
  }
}

// --- Intent Classification ---

async function classifyWithModel(text: string): Promise<{ action: string; confidence: number }> {
  if (!featureExtractor || !rawWeights) {
    return classifyWithRegex(text);
  }

  try {
    const output = await featureExtractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    
    let vec = Array.from(output.data as Float32Array).slice(0, 384);
    
    vec = denseLayer(vec, rawWeights.w1, rawWeights.b1, 128);
    vec = vec.map(relu);
    vec = denseLayer(vec, rawWeights.w2, rawWeights.b2, 64);
    vec = vec.map(relu);
    vec = denseLayer(vec, rawWeights.w3, rawWeights.b3, 4);
    const probabilities = softmax(vec);

    const maxIdx = probabilities.indexOf(Math.max(...probabilities));
    const confidence = probabilities[maxIdx];

    if (confidence < CONFIDENCE_THRESHOLD) {
      return classifyWithRegex(text);
    }

    return {
      action: INTENT_LABELS[maxIdx] || 'add',
      confidence,
    };
  } catch (e) {
    console.warn('Model inference failed, using regex:', e);
    return classifyWithRegex(text);
  }
}

function classifyWithRegex(text: string): { action: string; confidence: number } {
  const t = text.toLowerCase();

  const patterns: Record<string, RegExp[]> = {
    remove: [
      /\b(remove|delete|hatao|hata\s*do|nikal|nikaal|cancel|discard)\b/,
      /\b(nahi\s*chahiye|mat\s*rakh|hata|chhod)\b/,
      /\b(theesko|edukkaathe|teeseyandi)\b/,
      // Hindi script
      /हटाओ|निकालो|हटा\s*दो|नहीं\s*चाहिए|मत\s*रखो/,
    ],
    search: [
      /\b(find|search|show|dikhao|dikha\s*do|dhundho|kahan|kidhar)\b/,
      /\b(look\s*for|where|filter|browse)\b/,
      /\b(under\s*\d|below\s*\d|kam\s*\d)/,
      // Hindi script
      /दिखाओ|ढूंढो|कहाँ|खोजो/,
    ],
    update_qty: [
      /\b(change|update|modify|badlo|badal\s*do|set\s*to)\b/,
      /\b(quantity|increase|decrease|zyada|kam\s*kar)\b/,
      /\b(make\s*it|kar\s*do)\b.*\d/,
      // Hindi script
      /बदलो|बढ़ाओ|कम\s*करो|ज़्यादा/,
    ],
    add: [
      /\b(add|buy|get|lao|lana|le\s*aao|chahiye|daalo|daal\s*do)\b/,
      /\b(need|want|bring|lena|le\s*lo|bhi\s*lao|manga|mangao)\b/,
      /\b(put|include|beku|vendum|kaavali|laagte)\b/,
      // Hindi script
      /चाहिए|लाओ|लेना|डालो|ख़रीदो|लेकर\s*आओ/,
    ],
  };

  for (const intent of ['remove', 'search', 'update_qty', 'add']) {
    for (const pattern of patterns[intent]) {
      if (pattern.test(t)) {
        return { action: intent, confidence: 0.75 };
      }
    }
  }

  return { action: 'add', confidence: 0.5 };
}

// --- Main Public API ---

export async function parseIntent(transcript: string): Promise<ParsedMultiIntent> {
  const { action } = await classifyWithModel(transcript);

  // Step 1: Try local entity extraction first
  const entities = extractEntities(transcript);

  // Attempt to resolve unknown entities using Cosine Similarity Embeddings
  for (const e of entities) {
    if (e.confidence < 0.7) {
      const closest = await findClosestProduct(e.rawItem);
      if (closest) {
        e.item = closest;
        e.confidence = 0.9;
        console.log(`Semantic match found: ${e.rawItem} -> ${closest}`);
      }
    }
  }

  // Check if local extraction produced perfectly confident results for ALL items
  const hasGoodResults = entities.length > 0 && entities.every(e => e.confidence >= 0.7);
  const isNonLatin = hasNonLatinScript(transcript);

  // Step 2: If local extraction failed or text is in non-Latin script, use LLM fallback
  if (!hasGoodResults || isNonLatin) {
    console.log('Local NLP insufficient, calling Gemma API fallback...');
    try {
      const llmEntities = await extractEntitiesWithLLM(transcript);
      if (llmEntities.length > 0) {
        return {
          action: action as ParsedMultiIntent['action'],
          items: llmEntities.map(e => ({
            action: action as ParsedIntent['action'],
            item: e.item,
            quantity: e.quantity,
            unit: e.unit,
          })),
        };
      }
    } catch (e) {
      console.warn('LLM fallback failed, using local results:', e);
    }
  }

  // Step 3: Use local results (or raw transcript as last resort)
  if (entities.length === 0) {
    return {
      action: action as ParsedMultiIntent['action'],
      items: [{
        action: action as ParsedIntent['action'],
        item: transcript.trim() || 'Unknown Item',
        quantity: 1,
        unit: 'pcs',
      }],
    };
  }

  return {
    action: action as ParsedMultiIntent['action'],
    items: entities.map(e => ({
      action: action as ParsedIntent['action'],
      item: e.item,
      quantity: e.quantity,
      unit: e.unit,
    })),
  };
}
