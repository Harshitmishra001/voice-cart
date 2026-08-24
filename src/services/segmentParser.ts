// Parse a single text segment to extract one item with quantity and unit

import { parseNumberWord } from './numberWords';
import { parseUnit } from './unitAliases';
import foodwords from '../data/foodwords.json';

const foodwordsMap = foodwords as Record<string, string>;

// Filler words to strip before parsing
const FILLERS = new Set([
  'mujhe', 'muje', 'chahiye', 'lena', 'hai', 'lene', 'main', 'hain',
  'please', 'na', 'bhi', 'toh', 'yaar', 'bhaiya', 'thoda',
  'zara', 'please', 'add', 'karo', 'daalo', 'dena', 'de', 'do',
  'buy', 'get', 'need', 'want', 'i', 'me', 'my', 'the', 'a', 'an',
  'to', 'from', 'of', 'in', 'on', 'it', 'is', 'some', 'that',
  'lets', 'let', 'us', 'think', 'put', 'into', 'cart', 'basket',
  'list', 'shopping', 'bring', 'lao', 'lana', 'le', 'aao', 'lo',
  'kar', 'karo', 'daal', 'dalo', 'rakh', 'rakho',
  'ajj', 'aaj', 'kal', 'abhi', 'now', 'today',
  'remove', 'delete', 'hatao', 'hata', 'nikal', 'cancel', 'discard',
  'find', 'search', 'show', 'dikhao', 'dhundho', 'kahan', 'kidhar',
  'change', 'update', 'modify', 'badlo', 'badal', 'set',
  'increase', 'decrease', 'zyada', 'kam',
  'quantity', 'count', 'number',
]);

export interface ExtractedEntity {
  item: string;         // English normalized item name
  rawItem: string;      // Original word from transcript
  quantity: number;     // Parsed number (default 1)
  unit: string;         // Canonical unit (default 'pcs')
  confidence: number;   // 0-1, how certain we are
}

export function parseSegment(segment: string): ExtractedEntity | null {
  const tokens = segment.toLowerCase().trim().split(/\s+/);

  let quantity: number | null = null;
  let unit: string | null = null;
  let itemRaw: string | null = null;
  let itemEn: string | null = null;
  const candidateWords: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip fillers
    if (FILLERS.has(token)) continue;

    // Try unit parse first (before number, so "dozen" maps to unit not qty)
    const u = parseUnit(token);
    if (u !== null && unit === null) {
      unit = u;
      continue;
    }

    // Try number parse
    if (quantity === null) {
      const num = parseNumberWord(token);
      if (num !== null) {
        quantity = num;
        continue;
      }
    }

    // Try multi-word foodwords lookup (up to 3 words)
    let foundMultiWord = false;
    for (let len = 3; len >= 2; len--) {
      if (i + len <= tokens.length) {
        const phrase = tokens.slice(i, i + len).join(' ');
        const looked = foodwordsMap[phrase];
        if (looked && !itemEn) {
          itemEn = looked;
          itemRaw = phrase;
          i += len - 1; // skip the remaining tokens of the phrase
          foundMultiWord = true;
          break;
        }
      }
    }
    if (foundMultiWord) continue;

    // Try single-word foodwords lookup
    const looked = foodwordsMap[token];
    if (looked && !itemEn) {
      itemEn = looked;
      itemRaw = token;
      continue;
    }

    // Collect as candidate word if not recognized
    if (token.length > 1) {
      candidateWords.push(token);
    }
  }

  // If no foodwords match, use remaining candidate words as raw item name
  if (!itemEn && candidateWords.length > 0) {
    itemRaw = candidateWords.join(' ');
    itemEn = itemRaw;
  }

  if (!itemRaw) return null; // Nothing useful found in this segment

  return {
    item: itemEn ?? itemRaw,
    rawItem: itemRaw,
    quantity: quantity ?? 1,
    unit: unit ?? 'pcs',
    confidence: (itemEn !== null && itemEn !== itemRaw) ? 0.9 : 0.6,
  };
}
