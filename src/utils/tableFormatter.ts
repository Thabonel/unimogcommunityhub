/**
 * Table Detection and HTML Conversion Utility
 * Converts plain text tables to styled HTML tables for better rendering
 */

interface ParsedTable {
  headers: string[];
  rows: string[][];
  startIndex: number;
  endIndex: number;
  originalText: string;
}

/**
 * Detect if a line looks like a table header separator (e.g., |---|---|)
 */
function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?[\s-:|]+\|?$/.test(trimmed) && trimmed.includes('-');
}

/**
 * Detect if a line contains pipe-separated columns
 */
function isPipeTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes('|') && trimmed.split('|').filter(s => s.trim()).length >= 2;
}

/**
 * Detect if a line contains whitespace-separated columns (specification tables)
 */
function isWhitespaceTableRow(line: string): boolean {
  const parts = line.split(/\s{2,}/).filter(s => s.trim());
  return parts.length >= 2 && parts.length <= 6;
}

/**
 * Parse a markdown-style pipe table
 */
function parsePipeTable(lines: string[], startIndex: number): ParsedTable | null {
  const tableLines: string[] = [];
  let endIndex = startIndex;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (isPipeTableRow(line) || isTableSeparator(line)) {
      tableLines.push(line);
      endIndex = i;
    } else if (tableLines.length > 0) {
      break;
    }
  }

  if (tableLines.length < 2) return null;

  const dataLines = tableLines.filter(l => !isTableSeparator(l));
  if (dataLines.length < 1) return null;

  const parseRow = (line: string): string[] => {
    return line
      .split('|')
      .map(cell => cell.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1 || !line.trim().startsWith('|'));
  };

  const headers = parseRow(dataLines[0]);
  const rows = dataLines.slice(1).map(parseRow);

  return {
    headers,
    rows,
    startIndex,
    endIndex,
    originalText: tableLines.join('\n')
  };
}

/**
 * Parse a whitespace-aligned table (common in specs)
 */
function parseWhitespaceTable(lines: string[], startIndex: number): ParsedTable | null {
  const tableLines: string[] = [];
  let endIndex = startIndex;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (isWhitespaceTableRow(line)) {
      tableLines.push(line);
      endIndex = i;
    } else if (tableLines.length > 0 && line.trim() === '') {
      break;
    } else if (tableLines.length > 0) {
      break;
    }
  }

  if (tableLines.length < 2) return null;

  const parseRow = (line: string): string[] => {
    return line.split(/\s{2,}/).map(cell => cell.trim()).filter(Boolean);
  };

  const firstRow = parseRow(tableLines[0]);
  const isHeaderRow = firstRow.every(cell =>
    cell === cell.toUpperCase() ||
    cell.toLowerCase().includes('specification') ||
    cell.toLowerCase().includes('value') ||
    cell.toLowerCase().includes('unit')
  );

  const headers = isHeaderRow ? firstRow : [];
  const rows = isHeaderRow
    ? tableLines.slice(1).map(parseRow)
    : tableLines.map(parseRow);

  return {
    headers,
    rows,
    startIndex,
    endIndex,
    originalText: tableLines.join('\n')
  };
}

/**
 * Convert a parsed table to HTML
 */
function tableToHtml(table: ParsedTable): string {
  const headerRow = table.headers.length > 0
    ? `<thead><tr>${table.headers.map(h => `<th class="border border-gray-300 px-3 py-2 bg-gray-100 font-semibold text-left">${escapeHtml(h)}</th>`).join('')}</tr></thead>`
    : '';

  const bodyRows = table.rows.map(row =>
    `<tr>${row.map(cell => `<td class="border border-gray-300 px-3 py-2">${escapeHtml(cell)}</td>`).join('')}</tr>`
  ).join('');

  return `<table class="w-full border-collapse my-3 text-sm">${headerRow}<tbody>${bodyRows}</tbody></table>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Detect common specification patterns and format them
 */
function formatSpecificationLine(line: string): string | null {
  const specPattern = /^([A-Za-z][A-Za-z\s]+):\s*(.+)$/;
  const match = line.match(specPattern);

  if (match && match[2].match(/[\d.]+\s*(mm|in|kg|lb|Nm|ft-lb|bar|psi|L|gal|km\/h|mph|rpm|V|A|W|kW|hp)/i)) {
    return `<div class="grid grid-cols-2 gap-2 py-1"><span class="font-medium">${escapeHtml(match[1])}</span><span>${escapeHtml(match[2])}</span></div>`;
  }

  return null;
}

/**
 * Main function: Convert text content with tables to HTML
 */
export function formatTablesAsHtml(text: string): { html: string; hasTables: boolean } {
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;
  let hasTables = false;
  let inSpecBlock = false;
  const specLines: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (isPipeTableRow(line)) {
      const table = parsePipeTable(lines, i);
      if (table && table.rows.length > 0) {
        if (specLines.length > 0) {
          result.push(`<div class="spec-block my-2">${specLines.join('')}</div>`);
          specLines.length = 0;
        }
        result.push(tableToHtml(table));
        hasTables = true;
        i = table.endIndex + 1;
        continue;
      }
    }

    if (isWhitespaceTableRow(line) && !line.includes(':')) {
      const table = parseWhitespaceTable(lines, i);
      if (table && table.rows.length >= 2) {
        if (specLines.length > 0) {
          result.push(`<div class="spec-block my-2">${specLines.join('')}</div>`);
          specLines.length = 0;
        }
        result.push(tableToHtml(table));
        hasTables = true;
        i = table.endIndex + 1;
        continue;
      }
    }

    const specFormatted = formatSpecificationLine(line);
    if (specFormatted) {
      specLines.push(specFormatted);
      inSpecBlock = true;
      i++;
      continue;
    }

    if (inSpecBlock && specLines.length > 0) {
      result.push(`<div class="spec-block my-2">${specLines.join('')}</div>`);
      specLines.length = 0;
      inSpecBlock = false;
      hasTables = true;
    }

    result.push(`<p class="my-1">${escapeHtml(line)}</p>`);
    i++;
  }

  if (specLines.length > 0) {
    result.push(`<div class="spec-block my-2">${specLines.join('')}</div>`);
    hasTables = true;
  }

  return {
    html: result.join(''),
    hasTables
  };
}

/**
 * Check if content likely contains table data
 */
export function hasTableContent(text: string): boolean {
  const lines = text.split('\n');

  let consecutiveTableRows = 0;
  for (const line of lines) {
    if (isPipeTableRow(line) || isWhitespaceTableRow(line) || isTableSeparator(line)) {
      consecutiveTableRows++;
      if (consecutiveTableRows >= 2) return true;
    } else {
      consecutiveTableRows = 0;
    }
  }

  const specPattern = /^[A-Za-z][A-Za-z\s]+:\s*[\d.]+\s*(mm|in|kg|lb|Nm|ft-lb|bar|psi)/im;
  return specPattern.test(text);
}
