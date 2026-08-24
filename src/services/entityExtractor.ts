// Compose the full entity extraction pipeline:
// 1. Split by conjunctions
// 2. Parse each segment independently
// 3. Fallback to whole text if segmentation produces nothing

import { segmentByConjunction } from './segmenter';
import { parseSegment, type ExtractedEntity } from './segmentParser';

export type { ExtractedEntity } from './segmentParser';

export function extractEntities(text: string): ExtractedEntity[] {
  // Step 1: Split by conjunctions into item segments
  const segments = segmentByConjunction(text);

  // Step 2: Parse each segment independently
  const results: ExtractedEntity[] = [];

  for (const segment of segments) {
    const parsedItems = parseSegment(segment);
    results.push(...parsedItems);
  }

  // Step 3: If segmentation produced nothing, try the whole text as one segment
  if (results.length === 0) {
    const fallback = parseSegment(text);
    results.push(...fallback);
  }

  return results;
}
