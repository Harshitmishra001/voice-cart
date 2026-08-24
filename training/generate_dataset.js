import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INTENT_LABELS = ['add', 'remove', 'search', 'update_qty'];

const ITEMS = [
  'milk', 'bread', 'eggs', 'rice', 'chicken', 'apples', 'bananas', 'potatoes', 'tomatoes', 'onions', 
  'sugar', 'salt', 'oil', 'butter', 'cheese', 'yogurt', 'water', 'juice', 'coffee', 'tea',
  'doodh', 'paneer', 'atta', 'dal', 'chawal', 'sabzi', 'fruit', 'masala', 'biscuit', 'chips',
  'pepsi', 'coke', 'shampoo', 'soap', 'surf', 'detergent', 'toothpaste', 'brush', 'maggi', 'noodles',
  'chocolate', 'ice cream', 'curd', 'ghee', 'spices', 'garlic', 'ginger', 'coriander', 'mint', 'lemon',
  'apples', 'oranges', 'grapes', 'mangoes', 'watermelon', 'papaya', 'pineapple', 'kiwi', 'strawberry', 'blueberry'
];

const QTY = ['1', '2', '3', '4', '5', '10', '1.5', '0.5', '2.5', 'one', 'two', 'three', 'four', 'five', 'ten', 'half', 'some', 'a packet of', 'a bottle of', 'a box of', 'a few', 'a dozen'];
const UNIT = ['kg', 'liters', 'grams', 'kilos', 'packets', 'bottles', 'pieces', 'boxes', 'dozen', 'g', 'ml', 'l', ''];
const FILLERS = ['please', 'can you', 'i want to', 'let me', 'hey', 'voice cart', 'cart', 'just', 'quickly', 'also', 'and', 'uh', 'um', 'ah', 'like', 'i mean', 'basically', 'so', 'then', 'now', 'right', 'ok', 'okay', 'alright', 'yeah', 'yes', 'no', 'wait', 'hold on', 'nevermind', 'actually', 'instead', 'rather', 'preferably', 'ideally', 'maybe', 'probably', 'perhaps', 'possibly', 'kind of', 'sort of', 'a little bit', 'a bit', 'slightly', 'very', 'really', 'extremely', 'super', 'mega', 'ultra', 'hyper', 'much', 'many', 'lots of', 'a lot of', 'plenty of', 'tons of', 'heaps of', 'loads of', 'buckets of'];

const templates = {
  add: [
    "{filler} add {qty} {unit} {item} to my cart {filler}",
    "buy {qty} {item} {filler}",
    "{filler} get me {item}",
    "add {item} {filler}",
    "i need {qty} {unit} of {item}",
    "put {item} in the basket",
    "{qty} {item} daal do",
    "mujhe {qty} {item} chahiye",
    "{item} lana",
    "{item} le aao",
    "{filler} {item} add karo",
    "include {item}",
    "bring {item}",
    "{item} kaavali",
    "{item} beku",
    "{item} vendum",
    "{qty} {item} add maadi",
    "{item} podu",
    "{filler} please add {item}",
    "add {qty} {item}",
    "i want {item}",
    "throw some {item} in the cart",
    "can i get {item}?",
    "{item} order karo",
    "buy some {item}",
    "purchase {item}",
    "{filler} add {item}",
    "{item} {filler} add karo"
  ],
  remove: [
    "{filler} remove {item} from cart",
    "delete {item} {filler}",
    "i don't need {item} anymore",
    "take out {item}",
    "cancel {item}",
    "{item} hatao {filler}",
    "{filler} {item} hata do",
    "{item} nikal do",
    "{item} mat rakh",
    "{item} nahi chahiye",
    "{item} theesko",
    "{item} teeseyandi",
    "{item} ಬೇಡ",
    "discard {item}",
    "remove the {item}",
    "drop {item}",
    "clear {item}",
    "erase {item}",
    "don't add {item}",
    "no {item}",
    "remove {qty} {item}",
    "take {item} away",
    "{filler} delete {item}",
    "{item} delete karo"
  ],
  search: [
    "{filler} search for {item}",
    "find {item}",
    "show me {item} {filler}",
    "do you have {item}",
    "where is {item}",
    "look for {item}",
    "{item} dhundho",
    "{item} dikhao",
    "{item} kahan hai",
    "show {item} under 500",
    "filter {item} below 100",
    "saste {item} dikhao",
    "find cheap {item}",
    "browse {item}",
    "search {item}",
    "locate {item}",
    "what about {item}?",
    "is {item} available?",
    "check if you have {item}",
    "do you sell {item}?",
    "{filler} show {item}",
    "{item} search karo"
  ],
  update_qty: [
    "{filler} change {item} quantity to {qty}",
    "update {item} to {qty} {filler}",
    "make {item} {qty} {unit}",
    "increase {item} to {qty}",
    "set {item} to {qty}",
    "{item} ki quantity {qty} kar do",
    "{item} {qty} kar do",
    "{item} badha do",
    "{item} kam kar do",
    "modify {item} count",
    "{item} zyada karo",
    "change number of {item} to {qty}",
    "update qty of {item}",
    "decrease {item} to {qty}",
    "make {item} count {qty}",
    "set quantity of {item} to {qty}",
    "{filler} change {item} to {qty}",
    "{item} quantity update karo"
  ]
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const dataset = [];

// Generate 12000 varied permutations
for (let i = 0; i < 12000; i++) {
  const intent = INTENT_LABELS[Math.floor(Math.random() * INTENT_LABELS.length)];
  let template = getRandom(templates[intent]);
  
  const item = getRandom(ITEMS);
  const qty = getRandom(QTY);
  const unit = getRandom(UNIT);
  const filler = Math.random() > 0.5 ? getRandom(FILLERS) : '';
  
  let text = template
    .replace('{item}', item)
    .replace('{qty}', qty)
    .replace('{unit}', unit)
    .replace('{filler}', filler)
    .replace(/\s+/g, ' ')
    .trim();
    
  dataset.push({ text, label: intent });
}

const outPath = path.join(__dirname, 'dataset.json');
fs.writeFileSync(outPath, JSON.stringify(dataset, null, 2));

console.log(`Generated ${dataset.length} high-quality, varied samples in dataset.json!`);
