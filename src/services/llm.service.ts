const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-7b-instruct:free';

function getApiKey(): string | null {
  try {
    return (
      localStorage.getItem('openrouter_api_key') ||
      (import.meta as any).env?.VITE_OPENROUTER_API_KEY ||
      null
    );
  } catch {
    return null;
  }
}

export function hasApiKey(): boolean {
  return !!getApiKey();
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
