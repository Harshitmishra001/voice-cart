export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  completed: boolean;
}

export interface ParsedIntent {
  action: 'add' | 'remove' | 'search' | 'update_qty';
  item: string;
  quantity: number;
  unit: string;
}

export interface ParsedMultiIntent {
  action: 'add' | 'remove' | 'search' | 'update_qty';
  items: ParsedIntent[];
}

export interface Language {
  code: string;
  name: string;
  script: string;
}
