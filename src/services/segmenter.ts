// Split sentences into item segments by multilingual conjunctions

// Conjunctions across all 8 languages
const CONJUNCTIONS = [
  // Hindi/Urdu (Roman & Devanagari)
  'aur', 'aor', 'tatha', 'evam', 'और', 'तथा', 'एवं',
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
  // Use a capturing group so we can filter out the conjunctions later
  const pattern = new RegExp(
    `(?:^|\\s)(${CONJUNCTIONS.join('|')})(?:\\s|$)`,
    'gi'
  );
  
  const parts = text
    .split(pattern)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !CONJUNCTIONS_SET.has(s.toLowerCase()));

  return parts.length > 0 ? parts : [text.trim()];
}
