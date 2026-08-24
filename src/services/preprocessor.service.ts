const FILLERS = ['yaar', 'bhaiya', 'na', 'bhi', 'toh', 'please', 'zara', 'thoda', 'ek'];
const MULTI_ITEM_CONJUNCTIONS = ['aur', 'mattu', 'ani', 'mariyu', 'ebong'];

const NUMBER_WORDS: Record<string, string> = {
  // Hindi
  'do': '2',
  'teen': '3',
  'char': '4',
  'paanch': '5',
  // Kannada
  'eradu': '2',
  'mooru': '3',
  'naalku': '4',
  // Telugu
  'rendu': '2',
  'moodu': '3',
  'naalu': '4',
  // Tamil
  'irandu': '2',
  'moondru': '3',
  'naanku': '4',
  // Bengali / Marathi
  'dui': '2',
  'tin': '3'
};

export const preprocess = (transcript: string): { cleaned: string; isMultiItem: boolean; parts: string[] } => {
  let cleaned = transcript.toLowerCase();

  // Strip fillers
  const fillerRegex = new RegExp(`\\b(${FILLERS.join('|')})\\b`, 'gi');
  cleaned = cleaned.replace(fillerRegex, ' ');

  // Convert number words
  const words = cleaned.split(/\s+/);
  cleaned = words
    .map((word) => NUMBER_WORDS[word] || word)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');

  // Detect multi-item
  const conjunctionRegex = new RegExp(`\\s+(${MULTI_ITEM_CONJUNCTIONS.join('|')})\\s+`, 'gi');
  const isMultiItem = conjunctionRegex.test(cleaned);
  let parts = [cleaned];
  
  if (isMultiItem) {
    parts = cleaned.split(conjunctionRegex).map(p => p.trim()).filter((part) => !MULTI_ITEM_CONJUNCTIONS.includes(part.toLowerCase()));
  }

  return {
    cleaned,
    isMultiItem,
    parts: parts.filter(Boolean)
  };
};
