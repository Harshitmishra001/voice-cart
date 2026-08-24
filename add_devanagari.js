import fs from 'fs';

const foodwords = JSON.parse(fs.readFileSync('src/data/foodwords.json', 'utf-8'));

const hindiMap = {
  "प्याज़": "onion",
  "प्याज": "onion",
  "आलू": "potato",
  "टमाटर": "tomato",
  "दूध": "milk",
  "पनीर": "cheese",
  "अंडे": "eggs",
  "अंडा": "eggs",
  "रोटी": "bread",
  "ब्रेड": "bread",
  "दही": "yogurt",
  "मक्खन": "butter",
  "सेब": "apple",
  "केला": "banana",
  "संतरा": "orange",
  "नींबू": "lemon",
  "निम्बू": "lemon",
  "लहसुन": "garlic",
  "अदरक": "ginger",
  "मिर्च": "chili",
  "नमक": "salt",
  "चीनी": "sugar",
  "शक्कर": "sugar",
  "चावल": "rice",
  "दाल": "lentils",
  "तेल": "oil",
  "पानी": "water",
  "आटा": "flour",
  "चाय": "tea",
  "कॉफी": "coffee",
  "बिस्कुट": "biscuits",
  "साबुन": "soap",
  "शैम्पू": "shampoo",
  "चिप्स": "chips"
};

for (const [hi, en] of Object.entries(hindiMap)) {
  foodwords[hi] = en;
}

fs.writeFileSync('src/data/foodwords.json', JSON.stringify(foodwords, null, 2));
console.log('Added Devanagari to foodwords!');
