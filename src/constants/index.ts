import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-IN', name: 'English', script: 'Latin' },
  { code: 'hi-IN', name: 'Hindi', script: 'हिन्दी' },
  { code: 'ta-IN', name: 'Tamil', script: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', script: 'తెలుగు' },
  { code: 'kn-IN', name: 'Kannada', script: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', script: 'മലയാളം' },
  { code: 'bn-IN', name: 'Bengali', script: 'বাংলা' },
  { code: 'mr-IN', name: 'Marathi', script: 'मराठी' },
];

export const CATEGORIES = [
  'dairy',
  'produce',
  'bakery',
  'beverages',
  'snacks',
  'pantry',
  'personal care',
  'frozen',
];

export const SEASONAL_ITEMS = [
  ['carrots', 'peas', 'cauliflower', 'strawberries'], // Jan
  ['carrots', 'peas', 'cauliflower', 'strawberries'], // Feb
  ['mangoes', 'watermelon', 'cucumbers'], // Mar
  ['mangoes', 'watermelon', 'cucumbers'], // Apr
  ['lychee', 'jamun', 'raw mango'], // May
  ['lychee', 'jamun', 'raw mango'], // Jun
  ['corn', 'plums', 'peaches'], // Jul
  ['corn', 'plums', 'peaches'], // Aug
  ['pomegranate', 'grapes', 'sweet potato'], // Sep
  ['pomegranate', 'grapes', 'sweet potato'], // Oct
  ['guava', 'oranges', 'dates'], // Nov
  ['guava', 'oranges', 'dates'], // Dec
];

export const CONFIDENCE_THRESHOLD = 0.6;

export const INTENT_LABELS = ['add', 'remove', 'search', 'update_qty'] as const;
