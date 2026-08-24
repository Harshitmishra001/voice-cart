import fs from 'fs';

const foodwords = JSON.parse(fs.readFileSync('src/data/foodwords.json', 'utf-8'));

foodwords['pani'] = 'water';
foodwords['paani'] = 'water';

fs.writeFileSync('src/data/foodwords.json', JSON.stringify(foodwords, null, 2));
