import fs from 'fs';
import { pipeline } from '@xenova/transformers';

const productsPath = 'src/data/products.json';
const embeddingsPath = 'src/data/embeddings.json';
const foodwordsPath = 'src/data/foodwords.json';

const itemsToAdd = [
  // Fruits
  { name: 'Apple', hi: 'seb', category: 'produce' },
  { name: 'Banana', hi: 'kela', category: 'produce' },
  { name: 'Mango', hi: 'aam', category: 'produce' },
  { name: 'Orange', hi: 'santra', category: 'produce' },
  { name: 'Grapes', hi: 'angoor', category: 'produce' },
  { name: 'Pineapple', hi: 'ananas', category: 'produce' },
  { name: 'Watermelon', hi: 'tarbooz', category: 'produce' },
  { name: 'Papaya', hi: 'papita', category: 'produce' },
  { name: 'Pomegranate', hi: 'anaar', category: 'produce' },
  { name: 'Guava', hi: 'amrood', category: 'produce' },
  { name: 'Sweet Lime', hi: 'mosambi', category: 'produce' },
  { name: 'Pear', hi: 'nashpati', category: 'produce' },
  { name: 'Peach', hi: 'aadoo', category: 'produce' },
  { name: 'Plum', hi: 'aaloo bukhara', category: 'produce' },
  { name: 'Lychee', hi: 'litchi', category: 'produce' },
  { name: 'Cherry', hi: 'cherry', category: 'produce' },
  { name: 'Strawberry', hi: 'strawberry', category: 'produce' },
  { name: 'Custard Apple', hi: 'sitaphal', category: 'produce' },
  { name: 'Fig', hi: 'anjeer', category: 'produce' },
  { name: 'Jackfruit', hi: 'kathal', category: 'produce' },
  { name: 'Kiwi', hi: 'kiwi', category: 'produce' },
  { name: 'Coconut', hi: 'nariyal', category: 'produce' },
  { name: 'Dates', hi: 'khajoor', category: 'produce' },
  
  // Vegetables
  { name: 'Potato', hi: 'aloo', category: 'produce' },
  { name: 'Onion', hi: 'pyaaz', category: 'produce' },
  { name: 'Tomato', hi: 'tamatar', category: 'produce' },
  { name: 'Garlic', hi: 'lahsun', category: 'produce' },
  { name: 'Ginger', hi: 'adrak', category: 'produce' },
  { name: 'Cabbage', hi: 'patta gobhi', category: 'produce' },
  { name: 'Cauliflower', hi: 'phool gobhi', category: 'produce' },
  { name: 'Spinach', hi: 'palak', category: 'produce' },
  { name: 'Coriander', hi: 'dhaniya', category: 'produce' },
  { name: 'Mint', hi: 'pudina', category: 'produce' },
  { name: 'Green Chili', hi: 'hari mirch', category: 'produce' },
  { name: 'Capsicum', hi: 'shimla mirch', category: 'produce' },
  { name: 'Carrot', hi: 'gajar', category: 'produce' },
  { name: 'Radish', hi: 'mooli', category: 'produce' },
  { name: 'Beetroot', hi: 'chukandar', category: 'produce' },
  { name: 'Turnip', hi: 'shalgam', category: 'produce' },
  { name: 'Eggplant', hi: 'baingan', category: 'produce' },
  { name: 'Brinjal', hi: 'baingan', category: 'produce' },
  { name: 'Okra', hi: 'bhindi', category: 'produce' },
  { name: 'Lady Finger', hi: 'bhindi', category: 'produce' },
  { name: 'Bitter Gourd', hi: 'karela', category: 'produce' },
  { name: 'Bottle Gourd', hi: 'lauki', category: 'produce' },
  { name: 'Ridge Gourd', hi: 'turai', category: 'produce' },
  { name: 'Pumpkin', hi: 'kaddu', category: 'produce' },
  { name: 'Peas', hi: 'matar', category: 'produce' },
  { name: 'French Beans', hi: 'beans', category: 'produce' },
  { name: 'Lemon', hi: 'nimbu', category: 'produce' },
  { name: 'Cucumber', hi: 'kheera', category: 'produce' },
  { name: 'Sweet Potato', hi: 'shakarkandi', category: 'produce' },
  { name: 'Mushroom', hi: 'mushroom', category: 'produce' },
  
  // Dairy & Eggs
  { name: 'Milk', hi: 'doodh', category: 'dairy' },
  { name: 'Curd', hi: 'dahi', category: 'dairy' },
  { name: 'Yogurt', hi: 'dahi', category: 'dairy' },
  { name: 'Butter', hi: 'makhan', category: 'dairy' },
  { name: 'Cheese', hi: 'cheese', category: 'dairy' },
  { name: 'Paneer', hi: 'paneer', category: 'dairy' },
  { name: 'Ghee', hi: 'ghee', category: 'dairy' },
  { name: 'Cream', hi: 'malai', category: 'dairy' },
  { name: 'Buttermilk', hi: 'chaach', category: 'dairy' },
  { name: 'Lassi', hi: 'lassi', category: 'dairy' },
  { name: 'Eggs', hi: 'ande', category: 'dairy' },
  { name: 'Egg', hi: 'anda', category: 'dairy' },

  // Stationary
  { name: 'Pen', hi: 'pen', category: 'stationary' },
  { name: 'Pencil', hi: 'pencil', category: 'stationary' },
  { name: 'Notebook', hi: 'copy', category: 'stationary' },
  { name: 'Eraser', hi: 'rubber', category: 'stationary' },
  { name: 'Sharpener', hi: 'sharpener', category: 'stationary' },
  { name: 'Ruler', hi: 'scale', category: 'stationary' },
  { name: 'Marker', hi: 'marker', category: 'stationary' },
  { name: 'Highlighter', hi: 'highlighter', category: 'stationary' },
  { name: 'Crayons', hi: 'crayons', category: 'stationary' },
  { name: 'Glue', hi: 'gond', category: 'stationary' },
  { name: 'Tape', hi: 'tape', category: 'stationary' },
  { name: 'Scissors', hi: 'kainchi', category: 'stationary' },
  { name: 'Stapler', hi: 'stapler', category: 'stationary' },
  { name: 'Paper', hi: 'kagaz', category: 'stationary' },
  { name: 'Files', hi: 'file', category: 'stationary' },
  { name: 'Folder', hi: 'folder', category: 'stationary' },
  { name: 'Calculator', hi: 'calculator', category: 'stationary' },
  { name: 'Diary', hi: 'diary', category: 'stationary' },

  // Grains & Pulses (Pantry)
  { name: 'Rice', hi: 'chawal', category: 'pantry' },
  { name: 'Wheat', hi: 'gehu', category: 'pantry' },
  { name: 'Flour', hi: 'aata', category: 'pantry' },
  { name: 'Maida', hi: 'maida', category: 'pantry' },
  { name: 'Semolina', hi: 'suji', category: 'pantry' },
  { name: 'Besan', hi: 'besan', category: 'pantry' },
  { name: 'Lentils', hi: 'dal', category: 'pantry' },
  { name: 'Moong Dal', hi: 'moong dal', category: 'pantry' },
  { name: 'Toor Dal', hi: 'toor dal', category: 'pantry' },
  { name: 'Chana Dal', hi: 'chana dal', category: 'pantry' },
  { name: 'Urad Dal', hi: 'urad dal', category: 'pantry' },
  { name: 'Masoor Dal', hi: 'masoor dal', category: 'pantry' },
  { name: 'Kidney Beans', hi: 'rajma', category: 'pantry' },
  { name: 'Chickpeas', hi: 'chole', category: 'pantry' },
  { name: 'Poha', hi: 'poha', category: 'pantry' },
  { name: 'Oats', hi: 'oats', category: 'pantry' },
  { name: 'Sugar', hi: 'cheeni', category: 'pantry' },
  { name: 'Jaggery', hi: 'gud', category: 'pantry' },
  { name: 'Salt', hi: 'namak', category: 'pantry' },

  // Spices & Condiments
  { name: 'Turmeric', hi: 'haldi', category: 'pantry' },
  { name: 'Cumin', hi: 'jeera', category: 'pantry' },
  { name: 'Mustard Seeds', hi: 'sarson', category: 'pantry' },
  { name: 'Coriander Powder', hi: 'dhaniya powder', category: 'pantry' },
  { name: 'Red Chili Powder', hi: 'laal mirch', category: 'pantry' },
  { name: 'Garam Masala', hi: 'garam masala', category: 'pantry' },
  { name: 'Black Pepper', hi: 'kali mirch', category: 'pantry' },
  { name: 'Cardamom', hi: 'elaichi', category: 'pantry' },
  { name: 'Cloves', hi: 'laung', category: 'pantry' },
  { name: 'Cinnamon', hi: 'dalchini', category: 'pantry' },
  { name: 'Asafoetida', hi: 'heeng', category: 'pantry' },
  { name: 'Fenugreek', hi: 'methi', category: 'pantry' },
  { name: 'Fennel', hi: 'saunf', category: 'pantry' },
  { name: 'Sesame', hi: 'til', category: 'pantry' },
  { name: 'Tamarind', hi: 'imli', category: 'pantry' },
  { name: 'Vinegar', hi: 'sirka', category: 'pantry' },
  { name: 'Soy Sauce', hi: 'soy sauce', category: 'pantry' },
  { name: 'Ketchup', hi: 'ketchup', category: 'pantry' },
  { name: 'Jam', hi: 'jam', category: 'pantry' },

  // Household & Cleaning
  { name: 'Soap', hi: 'sabun', category: 'household' },
  { name: 'Detergent', hi: 'surf', category: 'household' },
  { name: 'Washing Powder', hi: 'washing powder', category: 'household' },
  { name: 'Dish Soap', hi: 'vim bar', category: 'household' },
  { name: 'Floor Cleaner', hi: 'phenyl', category: 'household' },
  { name: 'Toilet Cleaner', hi: 'harpic', category: 'household' },
  { name: 'Sponge', hi: 'sponge', category: 'household' },
  { name: 'Broom', hi: 'jhaadu', category: 'household' },
  { name: 'Mop', hi: 'pocha', category: 'household' },
  { name: 'Garbage Bags', hi: 'kachra panni', category: 'household' },
  { name: 'Tissue Paper', hi: 'tissue', category: 'household' },
  { name: 'Toilet Paper', hi: 'toilet paper', category: 'household' },
  { name: 'Matchbox', hi: 'machis', category: 'household' },
  { name: 'Candles', hi: 'mombatti', category: 'household' },
  { name: 'Mosquito Repellent', hi: 'all out', category: 'household' },
  { name: 'Room Freshener', hi: 'room freshener', category: 'household' },
];

async function main() {
  let products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  let foodwords = JSON.parse(fs.readFileSync(foodwordsPath, 'utf-8'));
  
  let maxId = Math.max(...products.map((p) => parseInt(p.id, 10)));

  // Add items to products.json if they don't exist
  for (const item of itemsToAdd) {
    if (!products.some(p => p.name.toLowerCase() === item.name.toLowerCase())) {
      maxId++;
      products.push({
        id: maxId.toString(),
        name: item.name,
        category: item.category || 'produce',
        unit: 'kg', // Defaulting to kg for bulk generation
        price: 50,
        inStock: true
      });
    }
    foodwords[item.name.toLowerCase()] = item.name.toLowerCase();
    foodwords[item.hi.toLowerCase()] = item.name.toLowerCase();
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
