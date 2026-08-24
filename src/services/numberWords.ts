// Number word map covering English, Hindi/Hinglish, Tamil, Kannada, Telugu, Bengali, Marathi, Malayalam

const NUMBER_WORD_MAP: Record<string, number> = {
  // English
  'zero': 0, 'half': 0.5, 'one': 1, 'two': 2, 'three': 3,
  'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8,
  'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'dozen': 12,

  // Hindi / Hinglish (Roman & Devanagari)
  'ek': 1, 'ak': 1, 'aek': 1, 'एक': 1,
  'do': 2, 'doh': 2, 'दो': 2,
  'teen': 3, 'tin': 3, 'तीन': 3,
  'char': 4, 'chaar': 4, 'चार': 4,
  'paanch': 5, 'panch': 5, 'paach': 5, 'पांच': 5, 'पाँच': 5,
  'chheh': 6, 'che': 6, 'छह': 6, 'छे': 6,
  'saat': 7, 'sat': 7, 'सात': 7,
  'aath': 8, 'ath': 8, 'आठ': 8,
  'nau': 9, 'नौ': 9,
  'das': 10, 'दस': 10,
  'hadha': 0.5, 'aadha': 0.5, 'adha': 0.5, 'aadh': 0.5, 'आधा': 0.5,
  'savaa': 1.25, 'sava': 1.25, 'सवा': 1.25,
  'dedh': 1.5, 'डेढ़': 1.5, 'डेढ': 1.5,
  'dhai': 2.5, 'dhaai': 2.5, 'ढाई': 2.5,

  // Tamil
  'onru': 1, 'rendu': 2, 'moondru': 3, 'naangu': 4,
  'ainjhu': 5, 'arai': 0.5, 'irandu': 2, 'naanku': 4,

  // Kannada
  'ondu': 1, 'eradu': 2, 'mooru': 3, 'naalku': 4,
  'aidu': 5, 'ardha': 0.5,

  // Telugu
  'okati': 1, 'moodu': 3, 'naalugu': 4,
  'ayidu': 5,

  // Bengali
  'dui': 2,

  // Marathi
  'don': 2,

  // Malayalam
  'onnu': 1, 'randu': 2, 'moonnu': 3, 'naalu': 4,
  'anchu': 5, 'pakuthi': 0.5,
};

export function parseNumberWord(token: string): number | null {
  const lower = token.toLowerCase().trim();
  // Direct digit check first
  const numeric = parseFloat(lower);
  if (!isNaN(numeric)) return numeric;
  // Word lookup
  return NUMBER_WORD_MAP[lower] ?? null;
}
