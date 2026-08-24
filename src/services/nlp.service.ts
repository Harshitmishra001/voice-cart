import type { ParsedIntent } from '../types';
import foodwords from '../data/foodwords.json';
import { INTENT_LABELS, CONFIDENCE_THRESHOLD } from '../constants';

let featureExtractor: any = null;
let rawWeights: any = null;
let modelsLoaded = false;
let modelLoadFailed = false;

const foodwordsMap = foodwords as Record<string, string>;

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
      // TensorFlow flattens weights in column-major style for matrix multiplication: [input_dim * output_dim] -> w[j * units + i]
      sum += vec[j] * w[j * units + i];
    }
    out[i] = sum;
  }
  return out;
}

// --- Model Loading ---

export async function initModels(): Promise<boolean> {
  try {
    const { pipeline } = await import('@xenova/transformers');
    featureExtractor = await pipeline(
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

    modelsLoaded = true;
    return true;
  } catch (e) {
    console.error('Failed to load MiniLM model:', e);
    modelLoadFailed = true;
    modelsLoaded = true;
    return false;
  }
}

export function isModelLoaded(): boolean {
  return modelsLoaded;
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
    
    // Layer 1: 128 units, relu
    vec = denseLayer(vec, rawWeights.w1, rawWeights.b1, 128);
    vec = vec.map(relu);

    // Layer 2: 64 units, relu
    vec = denseLayer(vec, rawWeights.w2, rawWeights.b2, 64);
    vec = vec.map(relu);

    // Layer 3: 4 units, softmax
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
    ],
    search: [
      /\b(find|search|show|dikhao|dikha\s*do|dhundho|kahan|kidhar)\b/,
      /\b(look\s*for|where|filter|browse)\b/,
      /\b(under\s*\d|below\s*\d|kam\s*\d)/,
    ],
    update_qty: [
      /\b(change|update|modify|badlo|badal\s*do|set\s*to)\b/,
      /\b(quantity|increase|decrease|zyada|kam\s*kar)\b/,
      /\b(make\s*it|kar\s*do)\b.*\d/,
    ],
    add: [
      /\b(add|buy|get|lao|lana|le\s*aao|chahiye|daalo|daal\s*do)\b/,
      /\b(need|want|bring|lena|le\s*lo|bhi\s*lao|manga|mangao)\b/,
      /\b(put|include|beku|vendum|kaavali|laagte)\b/,
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

// --- Entity Extraction ---

function extractEntities(text: string): { item: string; quantity: number; unit: string } {
  const t = text.toLowerCase().trim();

  const qtyMatch = t.match(
    /(\d+(?:\.\d+)?)\s*(kg|kilo|kilos|g|gram|grams|litre|litres|liter|liters|l|ml|pcs|pieces|packet|packets|bottle|bottles|dozen|box|boxes)/i
  );
  let quantity = 1;
  let unit = 'pcs';

  if (qtyMatch) {
    quantity = parseFloat(qtyMatch[1]);
    const rawUnit = qtyMatch[2].toLowerCase();
    if (['kilo', 'kilos'].includes(rawUnit)) unit = 'kg';
    else if (['gram', 'grams'].includes(rawUnit)) unit = 'g';
    else if (['litre', 'litres', 'liter', 'liters', 'l'].includes(rawUnit)) unit = 'L';
    else if (['piece', 'pieces', 'pcs'].includes(rawUnit)) unit = 'pcs';
    else if (['packet', 'packets'].includes(rawUnit)) unit = 'packet';
    else if (['bottle', 'bottles'].includes(rawUnit)) unit = 'bottle';
    else if (['box', 'boxes'].includes(rawUnit)) unit = 'box';
    else unit = rawUnit;
  } else {
    const numMatch = t.match(/\b(\d+)\b/);
    if (numMatch) {
      quantity = parseInt(numMatch[1], 10);
    }
  }

  const words = t.split(/\s+/);
  let item = '';

  for (let len = 3; len >= 1; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(' ');
      if (foodwordsMap[phrase]) {
        item = foodwordsMap[phrase];
        break;
      }
    }
    if (item) break;
  }

  if (!item) {
    const stopWords = new Set([
      'add', 'buy', 'get', 'remove', 'delete', 'find', 'search', 'show',
      'change', 'update', 'set', 'make', 'i', 'me', 'my', 'the', 'a', 'an',
      'to', 'from', 'of', 'in', 'on', 'it', 'is', 'do', 'some', 'please',
      'want', 'need', 'can', 'list', 'cart', 'shopping', 'daal', 'daalo',
      'hatao', 'dikhao', 'lao', 'lena', 'chahiye', 'bhi', 'aur', 'ko',
      'se', 'hai', 'mein', 'ka', 'ke', 'ki', 'mat', 'nahi', 'karo',
      'quantity', 'bottles', 'bottle', 'kg', 'kilo', 'litre', 'liter',
      'gram', 'packet', 'pcs', 'pieces', 'dozen', 'under', 'below',
    ]);

    const candidates = words.filter(
      (w) => w.length > 1 && !stopWords.has(w) && !/^\d+$/.test(w)
    );

    item = candidates.join(' ') || words[words.length - 1] || 'Unknown Item';
  }

  return { item: item || 'Unknown Item', quantity, unit };
}

export async function parseIntent(transcript: string): Promise<ParsedIntent> {
  const { action } = await classifyWithModel(transcript);
  const { item, quantity, unit } = extractEntities(transcript);

  return {
    action: action as ParsedIntent['action'],
    item,
    quantity,
    unit,
  };
}
