import fs from 'fs';
import { pipeline } from '@xenova/transformers';

const productsPath = 'src/data/products.json';
const embeddingsPath = 'src/data/embeddings.json';
const foodwordsPath = 'src/data/foodwords.json';

const fruitsToAdd = [
  { name: 'Apple', hi: 'seb' },
  { name: 'Banana', hi: 'kela' },
  { name: 'Mango', hi: 'aam' },
  { name: 'Orange', hi: 'santra' },
  { name: 'Grapes', hi: 'angoor' },
  { name: 'Pineapple', hi: 'ananas' },
  { name: 'Watermelon', hi: 'tarbooz' },
  { name: 'Papaya', hi: 'papita' },
  { name: 'Pomegranate', hi: 'anaar' },
  { name: 'Guava', hi: 'amrood' },
  { name: 'Sweet Lime', hi: 'mosambi' },
  { name: 'Pear', hi: 'nashpati' },
  { name: 'Peach', hi: 'aadoo' },
  { name: 'Plum', hi: 'aaloo bukhara' },
  { name: 'Lychee', hi: 'litchi' },
  { name: 'Cherry', hi: 'cherry' },
  { name: 'Strawberry', hi: 'strawberry' },
  { name: 'Custard Apple', hi: 'sitaphal' },
  { name: 'Fig', hi: 'anjeer' },
  { name: 'Jackfruit', hi: 'kathal' },
  { name: 'Kiwi', hi: 'kiwi' },
  { name: 'Coconut', hi: 'nariyal' },
  { name: 'Dates', hi: 'khajoor' },
];

async function main() {
  let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  let foodwords = JSON.parse(fs.readFileSync(foodwordsPath, 'utf-8'));
  
  let maxId = Math.max(...products.map((p) => parseInt(p.id, 10)));

  // Add fruits to products.json if they don't exist
  for (const fruit of fruitsToAdd) {
    if (!products.some(p => p.name.toLowerCase() === fruit.name.toLowerCase())) {
      maxId++;
      products.push({
        id: maxId.toString(),
        name: fruit.name,
        category: 'produce',
        unit: 'kg',
        price: 100,
        inStock: true
      });
    }
    foodwords[fruit.name.toLowerCase()] = fruit.name.toLowerCase();
    foodwords[fruit.hi.toLowerCase()] = fruit.name.toLowerCase();
  }

  // Also add common plurals/devanagari manually to foodwords to be safe
  foodwords['kele'] = 'banana';
  foodwords['kela'] = 'banana';
  foodwords['केले'] = 'banana';
  foodwords['केला'] = 'banana';
  foodwords['aam'] = 'mango';
  foodwords['आम'] = 'mango';
  foodwords['seb'] = 'apple';
  foodwords['सेब'] = 'apple';

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  fs.writeFileSync(foodwordsPath, JSON.stringify(foodwords, null, 2));

  console.log('Added fruits to products and foodwords.');

  console.log('Loading MiniLM model...');
  const extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2', { quantized: true });
  
  const embeddings = {};

  console.log('Generating embeddings for all products...');
  for (const p of products) {
    const out = await extractor(p.name, { pooling: 'mean', normalize: true });
    embeddings[p.name.toLowerCase()] = Array.from(out.data);
  }

  fs.writeFileSync(embeddingsPath, JSON.stringify(embeddings));
  console.log('Embeddings saved!');
}

main().catch(console.error);
