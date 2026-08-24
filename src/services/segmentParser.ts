// Parse a single text segment to extract items with quantity and unit

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

export function parseSegment(segment: string): ExtractedEntity[] {
  const tokens = segment.toLowerCase().trim().split(/\s+/);
  
  const items: ExtractedEntity[] = [];
  
  let quantity = 1;
  let unit: string | null = null;
  let itemEn: string | null = null;
  let itemRaw = '';
  let candidateWords: string[] = [];
  let confidence = 0.9;

  const pushCurrentItem = () => {
    if (itemEn || candidateWords.length > 0) {
      let finalItem = itemEn;
      if (!finalItem) {
        finalItem = candidateWords.join(' ');
        confidence = 0.6; // lower confidence for unknown items
      }
      
      items.push({
        item: finalItem,
        rawItem: itemRaw || candidateWords.join(' '),
        quantity: quantity,
        unit: unit || 'pcs',
        confidence
      });
      
      // Reset for next item in the same segment
      quantity = 1;
      unit = null;
      itemEn = null;
      itemRaw = '';
      candidateWords = [];
      confidence = 0.9;
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip fillers
    if (FILLERS.has(token)) continue;

    const u = parseUnit(token);
    const num = parseNumberWord(token);

    // If we hit a new quantity, but we already have one defined for this item, it means we're starting a new item
    if (num !== null && quantity !== 1 && (itemEn || candidateWords.length > 0)) {
      pushCurrentItem();
    }
    // If we hit a new unit, but we already have one defined for this item, start a new item
    if (u !== null && unit !== null && (itemEn || candidateWords.length > 0)) {
      pushCurrentItem();
    }

    if (u !== null) {
      unit = u;
      continue;
    }

    if (num !== null) {
      quantity = num;
      continue;
    }

    // Try multi-word foodwords lookup (up to 3 words)
    let foundMultiWord = false;
    for (let len = 3; len >= 2; len--) {
      if (i + len <= tokens.length) {
        const phrase = tokens.slice(i, i + len).join(' ');
        const looked = foodwordsMap[phrase];
        if (looked) {
          if (itemEn || candidateWords.length > 0) pushCurrentItem();
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
    if (looked) {
      if (itemEn || candidateWords.length > 0) pushCurrentItem();
      itemEn = looked;
      itemRaw = token;
      continue;
    }

    // Collect as candidate word if not recognized
    if (token.length > 1) {
      candidateWords.push(token);
    }
  }

  // Push whatever is left
  pushCurrentItem();

  return items;
}
