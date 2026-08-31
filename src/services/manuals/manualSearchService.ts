import { supabase } from '@/lib/supabase-client';
import type { StorageManual } from '@/types/manuals';

const SEARCH_COLUMNS = 'id, manual_title, section_title, content, page_number, pdf_storage_path, metadata, extraction_quality';
const MAX_SEARCH_TERMS = 8;

interface ManualChunkRow {
  id: string;
  manual_title: string | null;
  section_title: string | null;
  content: string | null;
  page_number: number | null;
  pdf_storage_path: string | null;
  metadata: unknown;
  extraction_quality: number | null;
}

export interface ManualLibrarySearchResult {
  id: string;
  chunkId?: string;
  fileName: string;
  manualTitle: string;
  sectionTitle?: string;
  pageNumber: number;
  snippet: string;
  source: 'ocr' | 'title';
  relevance: number;
}

export function normalizeManualSearchQuery(query: string): string {
  const terms = query
    .normalize('NFKC')
    .match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu)
    ?.slice(0, MAX_SEARCH_TERMS) ?? [];

  return terms.join(' ').slice(0, 160);
}

function searchableManualText(manual: StorageManual): string {
  return [manual.name, manual.metadata?.title, manual.metadata?.description]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();
}

function normalizedTitle(value: string): string {
  return value
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLocaleLowerCase();
}

function metadataFilename(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
  const filename = (metadata as Record<string, unknown>).filename;
  return typeof filename === 'string' && filename.trim() ? filename : null;
}

export function resolveManualFileName(
  row: Pick<ManualChunkRow, 'manual_title' | 'pdf_storage_path' | 'metadata'>,
  manuals: StorageManual[],
): string | null {
  if (row.pdf_storage_path && manuals.some((manual) => manual.name === row.pdf_storage_path)) {
    return row.pdf_storage_path;
  }

  const filename = metadataFilename(row.metadata);
  if (filename && manuals.some((manual) => manual.name === filename)) return filename;

  const rowTitle = normalizedTitle(row.manual_title ?? '');
  if (!rowTitle) return null;

  const exactMatch = manuals.find((manual) =>
    normalizedTitle(manual.metadata?.title || manual.name) === rowTitle ||
    normalizedTitle(manual.name) === rowTitle);
  if (exactMatch) return exactMatch.name;

  const partialMatches = manuals.filter((manual) => {
    const manualTitle = normalizedTitle(manual.metadata?.title || manual.name);
    const fileTitle = normalizedTitle(manual.name);
    return manualTitle.includes(rowTitle) || rowTitle.includes(manualTitle) ||
      fileTitle.includes(rowTitle) || rowTitle.includes(fileTitle);
  });

  return partialMatches.length === 1 ? partialMatches[0].name : null;
}

function buildSnippet(content: string, terms: string[]): string {
  const cleanContent = content.replace(/\s+/g, ' ').trim();
  if (!cleanContent) return 'Matching OCR text is available on this page.';

  const lowerContent = cleanContent.toLocaleLowerCase();
  const matchIndex = terms.reduce((bestIndex, term) => {
    const index = lowerContent.indexOf(term.toLocaleLowerCase());
    if (index < 0) return bestIndex;
    return bestIndex < 0 ? index : Math.min(bestIndex, index);
  }, -1);
  const start = Math.max(0, matchIndex < 0 ? 0 : matchIndex - 90);
  const end = Math.min(cleanContent.length, start + 240);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < cleanContent.length ? '…' : '';
  return `${prefix}${cleanContent.slice(start, end).trim()}${suffix}`;
}

function relevanceForRow(row: ManualChunkRow, terms: string[]): number {
  const title = (row.manual_title ?? '').toLocaleLowerCase();
  const section = (row.section_title ?? '').toLocaleLowerCase();
  const content = (row.content ?? '').toLocaleLowerCase();

  return terms.reduce((score, term) => {
    const normalizedTerm = term.toLocaleLowerCase();
    const contentMatches = content.split(normalizedTerm).length - 1;
    return score +
      (title.includes(normalizedTerm) ? 12 : 0) +
      (section.includes(normalizedTerm) ? 8 : 0) +
      Math.min(contentMatches, 8);
  }, 0) + (row.extraction_quality ?? 0);
}

export function buildManualSearchResults(
  rows: ManualChunkRow[],
  manuals: StorageManual[],
  query: string,
  limit = 24,
): ManualLibrarySearchResult[] {
  const normalizedQuery = normalizeManualSearchQuery(query);
  const terms = normalizedQuery.toLocaleLowerCase().split(' ').filter(Boolean);
  if (!terms.length) return [];

  const results: ManualLibrarySearchResult[] = [];
  const resultKeys = new Set<string>();

  for (const row of rows) {
    const fileName = resolveManualFileName(row, manuals);
    if (!fileName) continue;
    const pageNumber = Math.max(1, row.page_number ?? 1);
    const resultKey = `${fileName}:${pageNumber}`;
    if (resultKeys.has(resultKey)) continue;
    resultKeys.add(resultKey);

    const manual = manuals.find((candidate) => candidate.name === fileName);
    results.push({
      id: row.id,
      chunkId: row.id,
      fileName,
      manualTitle: row.manual_title || manual?.metadata?.title || fileName,
      sectionTitle: row.section_title || undefined,
      pageNumber,
      snippet: buildSnippet(row.content ?? '', terms),
      source: 'ocr',
      relevance: relevanceForRow(row, terms),
    });
  }

  for (const manual of manuals) {
    if (!terms.every((term) => searchableManualText(manual).includes(term))) continue;
    const resultKey = `${manual.name}:1`;
    if (resultKeys.has(resultKey)) continue;
    resultKeys.add(resultKey);
    results.push({
      id: `manual:${manual.name}`,
      fileName: manual.name,
      manualTitle: manual.metadata?.title || manual.name,
      pageNumber: 1,
      snippet: manual.metadata?.description || 'Manual title match',
      source: 'title',
      relevance: 20,
    });
  }

  return results
    .sort((left, right) => right.relevance - left.relevance || left.pageNumber - right.pageNumber)
    .slice(0, limit);
}

function titleFilter(terms: string[]): string {
  return terms
    .flatMap((term) => [`manual_title.ilike.%${term}%`, `section_title.ilike.%${term}%`])
    .join(',');
}

export async function searchManualLibrary(
  query: string,
  manuals: StorageManual[],
  limit = 24,
): Promise<ManualLibrarySearchResult[]> {
  const normalizedQuery = normalizeManualSearchQuery(query);
  if (normalizedQuery.length < 2) return [];
  const terms = normalizedQuery.split(' ');

  const contentSearch = supabase
    .from('manual_chunks')
    .select(SEARCH_COLUMNS)
    .textSearch('content_tsv', normalizedQuery, { config: 'english', type: 'plain' })
    .limit(limit * 2);
  const headingSearch = supabase
    .from('manual_chunks')
    .select(SEARCH_COLUMNS)
    .or(titleFilter(terms))
    .limit(limit * 2);

  const settled = await Promise.allSettled([contentSearch, headingSearch]);
  const rows = new Map<string, ManualChunkRow>();
  let successfulQueries = 0;

  for (const result of settled) {
    if (result.status !== 'fulfilled' || result.value.error) continue;
    successfulQueries += 1;
    for (const row of (result.value.data ?? []) as ManualChunkRow[]) {
      rows.set(row.id, row);
    }
  }

  const mappedResults = buildManualSearchResults([...rows.values()], manuals, normalizedQuery, limit);
  if (successfulQueries === 0 && mappedResults.length === 0) {
    throw new Error('Manual search is temporarily unavailable');
  }
  return mappedResults;
}

export async function getManualSearchResultByChunkId(
  chunkId: string,
  manuals: StorageManual[],
): Promise<ManualLibrarySearchResult | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(chunkId)) {
    return null;
  }

  const { data, error } = await supabase
    .from('manual_chunks')
    .select(SEARCH_COLUMNS)
    .eq('id', chunkId)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as ManualChunkRow;
  const fileName = resolveManualFileName(row, manuals);
  if (!fileName) return null;
  return {
    id: row.id,
    chunkId: row.id,
    fileName,
    manualTitle: row.manual_title || fileName,
    sectionTitle: row.section_title || undefined,
    pageNumber: Math.max(1, row.page_number ?? 1),
    snippet: buildSnippet(row.content ?? '', []),
    source: 'ocr',
    relevance: 0,
  };
}
