import fs from 'fs';
import { pipeline } from '@xenova/transformers';
import products from './src/data/products.json' assert { type: 'json' };

async function run() {
  console.log('Loading MiniLM feature extractor...');
  const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', {
    quantized: true,
  });

  const embeddings = {};
  const foodWords = new Set(JSON.parse(fs.readFileSync('./src/data/foodWords.json', 'utf8')));

  for (const product of products) {
    const rawName = product.name;
    const lName = rawName.toLowerCase();
    
    // Add to foodWords dictionary for local exact matching
    foodWords.add(lName);
    
    // Generate embedding
    console.log(`Embedding: ${rawName}`);
    const output = await extractor(rawName, { pooling: 'mean', normalize: true });
    embeddings[rawName] = Array.from(output.data);
  }

  fs.writeFileSync('./src/data/embeddings.json', JSON.stringify(embeddings));
  fs.writeFileSync('./src/data/foodWords.json', JSON.stringify(Array.from(foodWords), null, 2));
  console.log('✅ Embeddings and FoodWords generated successfully!');
}

run().catch(console.error);
