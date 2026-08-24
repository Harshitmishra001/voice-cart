const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemma-4-31b-it:free';

function getApiKey(): string {
  try {
    return (
      localStorage.getItem('openrouter_api_key') ||
      (import.meta as any).env?.VITE_OPENROUTER_API_KEY ||
      ''
    );
  } catch {
    return '';
  }
}

export function hasApiKey(): boolean {
  return true;
}

export function setApiKey(key: string): void {
  localStorage.setItem('openrouter_api_key', key.trim());
}

function stripCodeBlocks(text: string): string {
  return text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

async function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error('No API key');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Voice Cart',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '[]';
}

export async function getSuggestions(cartItems: string[]): Promise<string[]> {
  try {
    const systemPrompt =
      'You are a grocery shopping assistant. Given a shopping cart containing the listed items, suggest 3-5 complementary grocery items the user likely needs. Return ONLY a JSON array of item name strings. No explanation, no markdown, no backticks.';
    const result = await callLLM(systemPrompt, `Cart items: ${cartItems.join(', ')}`);
    const parsed = JSON.parse(stripCodeBlocks(result));
    return Array.isArray(parsed) ? parsed.filter((s: any) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export async function getSubstitutes(item: string): Promise<string[]> {
  try {
    const systemPrompt = `You are a grocery shopping assistant. The item "${item}" is unavailable. Suggest 3 substitute products. Return ONLY a JSON array of substitute name strings. No explanation, no markdown, no backticks.`;
    const result = await callLLM(systemPrompt, `Unavailable item: ${item}`);
    const parsed = JSON.parse(stripCodeBlocks(result));
    return Array.isArray(parsed) ? parsed.filter((s: any) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * LLM fallback for entity extraction.
 * Called when the local NLP pipeline can't parse the transcript (e.g. Devanagari script, unusual phrasing).
 * Always returns results in English.
 */
export async function extractEntitiesWithLLM(
  transcript: string
): Promise<{ item: string; quantity: number; unit: string }[]> {
  try {
    const systemPrompt = `You are a grocery item parser. The user spoke a shopping command (possibly in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Malayalam, or English). Extract ALL grocery items mentioned.

For EACH item, return:
- "item": the English name of the grocery item (always in English, e.g. "onion" not "pyaaz")
- "quantity": the numeric quantity (default 1)
- "unit": the unit (kg, L, g, pcs, packet, bottle, box, dozen, pao, bunch, can). Default "pcs".

Return ONLY a JSON array. No explanation, no markdown, no backticks.

Examples:
Input: "मुझे 2 किलो प्याज़ और आधा पाव पनीर लेना है"
Output: [{"item":"onion","quantity":2,"unit":"kg"},{"item":"paneer","quantity":0.5,"unit":"pao"}]

Input: "add 3 packets of chips and 1 bottle of juice"
Output: [{"item":"chips","quantity":3,"unit":"packet"},{"item":"juice","quantity":1,"unit":"bottle"}]`;

    const result = await callLLM(systemPrompt, transcript);
    const parsed = JSON.parse(stripCodeBlocks(result));
    if (Array.isArray(parsed)) {
      return parsed
        .filter((e: any) => e && typeof e.item === 'string')
        .map((e: any) => ({
          item: String(e.item).toLowerCase(),
          quantity: typeof e.quantity === 'number' ? e.quantity : 1,
          unit: typeof e.unit === 'string' ? e.unit : 'pcs',
        }));
    }
    return [];
  } catch (e) {
    console.warn('LLM entity extraction failed:', e);
    return [];
  }
}

