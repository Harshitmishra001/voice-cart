// Normalize all unit variants to a canonical form

const UNIT_ALIAS_MAP: Record<string, string> = {
  // Weight
  'kg': 'kg', 'kilo': 'kg', 'kilos': 'kg', 'kilogram': 'kg',
  'kilograms': 'kg', 'kgs': 'kg',
  'g': 'g', 'gram': 'g', 'grams': 'g', 'gm': 'g', 'gms': 'g',
  'pao': 'pao', 'pau': 'pao', 'paav': 'pao', // 250g Indian unit

  // Volume
  'l': 'L', 'liter': 'L', 'litre': 'L', 'liters': 'L', 'litres': 'L',
  'ml': 'ml', 'milliliter': 'ml', 'milliliters': 'ml',

  // Count
  'piece': 'pcs', 'pieces': 'pcs', 'pcs': 'pcs', 'pc': 'pcs',
  'number': 'pcs', 'nos': 'pcs',
  'packet': 'packet', 'pack': 'packet', 'packets': 'packet', 'packs': 'packet',
  'bottle': 'bottle', 'bottles': 'bottle',
  'box': 'box', 'boxes': 'box',
  'dozen': 'dozen', 'doz': 'dozen',
  'bunch': 'bunch', 'bunches': 'bunch',
  'bag': 'bag', 'bags': 'bag',
  'can': 'can', 'cans': 'can',
  'carton': 'carton', 'cartons': 'carton',

  // Hindi unit words
  'tel': 'L', // contextual — "tel" means oil but "liter tel" = liter
};

export function parseUnit(token: string): string | null {
  return UNIT_ALIAS_MAP[token.toLowerCase().trim()] ?? null;
}
