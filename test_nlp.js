import { extractEntities } from './src/services/entityExtractor.js';

const lines = [
  "mujhe 2 kilo pyaaz aur hadha pao panner lena hai",
  "30 kilo pyaz aur ak liter tel lena hai",
  "ajj 1 kg aloo lena hai",
  "I think i need to buy 2 packets of doritos chips",
  "lets buy 1 chocolate",
  "ek dozen eggs aur do bottle paani lao",
  "dhai kilo atta aur dedh liter doodh chahiye",
];

for (const line of lines) {
  const results = extractEntities(line);
  console.log(`\n━━━ Input: "${line}" ━━━`);
  if (results.length === 0) {
    console.log("  ⚠️  No entities found");
  }
  for (const r of results) {
    console.log(`  ✅ Item: ${r.item} (raw: "${r.rawItem}") | Qty: ${r.quantity} ${r.unit} | Confidence: ${r.confidence}`);
  }
}
