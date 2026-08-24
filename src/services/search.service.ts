import products from '../data/products.json';
import type { Product } from '../types';

const productList = products as Product[];

export function searchProducts(query: string, maxPrice?: number): Product[] {
  if (!query || query.trim().length === 0) return [];
  
  const q = query.toLowerCase().trim();
  
  let results = productList.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(q);
    const categoryMatch = p.category.toLowerCase().includes(q);
    return nameMatch || categoryMatch;
  });

  if (maxPrice !== undefined) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  return results;
}

export function extractPriceFilter(transcript: string): number | null {
  const match = transcript.match(
    /(?:under|below|kam|less|within|upto|under)\s*(?:₹|\$|rs\.?|rupees?|dollars?|bucks?)?\s*(\d+)/i
  );
  if (match) return parseInt(match[1], 10);

  const matchReverse = transcript.match(
    /(\d+)\s*(?:₹|\$|rs\.?|rupees?|dollars?|bucks?)?\s*(?:se\s*kam|ke\s*under|ke\s*niche)/i
  );
  if (matchReverse) return parseInt(matchReverse[1], 10);

  return null;
}

export function getProductByName(name: string): Product | undefined {
  return productList.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
}
