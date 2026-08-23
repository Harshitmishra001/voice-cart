export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' }
];

export const CATEGORIES = [
  'Produce',
  'Dairy',
  'Bakery',
  'Pantry',
  'Frozen',
  'Meat & Seafood'
];

export const SEASONAL_ITEMS: Record<string, string[]> = {
  '01': ['Citrus', 'Kale', 'Winter Squash'],
  '06': ['Watermelon', 'Berries', 'Peaches'],
  '10': ['Pumpkins', 'Apples', 'Sweet Potatoes']
};
