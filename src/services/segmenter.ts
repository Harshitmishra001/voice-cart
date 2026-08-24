// Split sentences into item segments by multilingual conjunctions

// Conjunctions across all 8 languages
const CONJUNCTIONS = [
  // Hindi/Urdu
  'aur', 'aor', 'tatha', 'evam',
  // English
  'and', 'also', 'plus',
  // Tamil
  'matrum', 'matum',
  // Kannada
  'mattu', 'haagu',
  // Telugu
  'mariyu', 'inka',
  // Bengali
  'ebong', 'ar',
  // Marathi
  'ani', 'aani', 'va',
  // Malayalam
  'koodathe',
];

const CONJUNCTIONS_SET = new Set(CONJUNCTIONS.map(c => c.toLowerCase()));

export function segmentByConjunction(text: string): string[] {
  // Build regex dynamically from conjunction list
  const pattern = new RegExp(
    `\\b(${CONJUNCTIONS.join('|')})\\b`,
    'gi'
  );
  const parts = text
    .split(pattern)
    .map(s => s.trim())
    .filter(s => s.length > 1 && !CONJUNCTIONS_SET.has(s.toLowerCase()));

  return parts.length > 0 ? parts : [text.trim()];
}
