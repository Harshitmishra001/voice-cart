/**
 * Anthropic Claude API call for NLP intent parsing.
 * Extracts: action (add/remove), item (string), quantity (number), unit (string).
 */
export const parseVoiceIntent = async (transcript: string, language: string) => {
  // Stub: Call Anthropic API (or custom backend) with the transcript.
  // Example expected output format:
  return {
    action: 'add',
    item: 'Apples',
    quantity: 2,
    unit: 'lbs'
  };
};
