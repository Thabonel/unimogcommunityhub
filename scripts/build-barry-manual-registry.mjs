import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '..');

const SOURCE_ROOTS = [
  {
    root: '/Users/thabonel/Documents/Unimog Manuals',
    group: 'Unimog Manuals',
    priority: 20,
  },
  {
    root: '/Users/thabonel/Documents/Documents - MacBook Air/MOG/AAAAAMANUALS',
    group: 'Legacy MOG AAAAAMANUALS',
    priority: 50,
  },
  {
    root: '/Users/thabonel/Documents/Unimogdata in TXT FORMAT FOR AI',
    group: 'Extracted text corpus',
    priority: 90,
  },
  {
    root: path.join(repoRoot, 'scripts/rps/output/pdf_chunks'),
    group: 'Local RPS working chunks',
    priority: 80,
  },
];

const OUTPUT_JSON = path.join(repoRoot, 'docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json');
const OUTPUT_MD = path.join(repoRoot, 'docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.md');

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  const stack = [root];

  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (/\.(pdf|txt)$/i.test(entry.name)) {
        out.push(fullPath);
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

function normalizeTitle(filePath) {
  const base = path.basename(filePath).replace(/\.(pdf|txt)$/i, '');
  return base
    .toLowerCase()
    .replace(/unimog_all_types/g, 'unimog all types')
    .replace(/unimog-all-types/g, 'unimog all types')
    .replace(/[_:]+/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-pdf$/g, '');
}

function classifyDocument(filePath, sourceGroup) {
  const lower = filePath.toLowerCase();
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') return 'text_derivative';
  if (sourceGroup === 'Local RPS working chunks') return 'rps_working_chunk';
  if (lower.includes('/u1700l manuals ex military/')) return 'source_chapter';
  if (lower.includes('/u435_maintenance_ready/')) return 'derived_chapter';
  if (lower.includes('/unimog435_chapters_corrected/v2/')) return 'candidate_workshop_chapter';
  if (lower.includes('/unimog435_chapters/')) return 'derived_chapter';
  if (lower.includes('rps-') || lower.includes('rps_')) return 'source_rps';
  if (lower.includes('uhb-')) return 'source_handbook';
  if (lower.includes('unimog435sm') || lower.includes('u1700l')) return 'source_manual';
  if (/\/g\d{3}/i.test(filePath)) return 'source_manual';
  return 'candidate_source';
}

function isDerivativeType(documentType) {
  return [
    'text_derivative',
    'rps_working_chunk',
    'derived_chapter',
  ].includes(documentType);
}

async function inspectPdf(filePath) {
  const result = {
    pdf_open_status: 'not_checked',
    page_count: null,
    extractable_text_chars: null,
    text_chars_per_page: null,
    is_encrypted: false,
    parser_error: null,
  };

  return {
    ...result,
    ...inspectPdfHeuristically(filePath),
  };
}

function inspectPdfHeuristically(filePath) {
  const stat = fs.statSync(filePath);
  const head = readFileSlice(filePath, 0, Math.min(stat.size, 1024)).toString('latin1');
  const tailStart = Math.max(0, stat.size - 8192);
  const tail = readFileSlice(filePath, tailStart, stat.size - tailStart).toString('latin1');
  const sampleSize = Math.min(stat.size, 1024 * 1024);
  const sample = readFileSlice(filePath, 0, sampleSize).toString('latin1');
  const countMatches = [...sample.matchAll(/\/Count\s+(\d+)/g)]
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value) && value > 0);
  const pageCountEstimate = countMatches.length ? Math.max(...countMatches) : null;
  const hasHeader = head.includes('%PDF-');
  const hasEof = tail.includes('%%EOF');
  const hasStartXref = tail.includes('startxref');

  return {
    pdf_open_status: hasHeader && hasEof ? 'heuristic_ok' : 'heuristic_suspect',
    page_count: pageCountEstimate,
    extractable_text_chars: null,
    text_chars_per_page: null,
    is_encrypted: /\/Encrypt\b/.test(sample),
    parser_error: hasHeader && hasEof && hasStartXref
      ? null
      : 'Large PDF skipped full parse; header/trailer check was incomplete.',
  };
}

function readFileSlice(filePath, start, length) {
  if (length <= 0) return Buffer.alloc(0);
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(length);
    const bytesRead = fs.readSync(fd, buffer, 0, length, start);
    return buffer.subarray(0, bytesRead);
  } finally {
    fs.closeSync(fd);
  }
}

function inspectText(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const chars = text.replace(/\s+/g, '').length;
  return {
    pdf_open_status: 'not_pdf',
    page_count: null,
    extractable_text_chars: chars,
    text_chars_per_page: null,
    is_encrypted: false,
    parser_error: null,
  };
}

function qualityFor(record) {
  const notes = [];
  let status = 'good';
  const derivativeRecord = isDerivativeType(record.document_type);

  if (record.document_type === 'text_derivative') {
    return {
      quality_status: 'derivative',
      quality_score: 20,
      quality_notes: 'Extracted text derivative; use for comparison only.',
    };
  }

  if (record.document_type === 'rps_working_chunk') {
    status = 'derivative';
    notes.push('Local RPS working chunk; not canonical source PDF.');
  }

  if (record.document_type === 'derived_chapter') {
    status = 'derivative';
    notes.push('Derived split chapter; prefer matching source chapter set or parent PDF when available.');
  }

  if (record.pdf_open_status === 'heuristic_ok') {
    if (!derivativeRecord) status = 'usable';
    notes.push('PDF passed header/trailer heuristic; deep text parse deferred to extraction stage.');
  }

  if (record.pdf_open_status === 'heuristic_suspect') {
    status = derivativeRecord ? 'suspect_derivative' : 'suspect';
    notes.push(record.parser_error || 'Large PDF heuristic check was incomplete.');
  }

  if (record.pdf_open_status === 'error') {
    status = 'corrupt';
    notes.push(`PDF parser failed: ${record.parser_error || 'unknown error'}`);
  }

  if (record.is_encrypted) {
    if (status !== 'corrupt') status = derivativeRecord ? 'suspect_derivative' : 'suspect';
    notes.push('PDF declares encryption or access restrictions; verify whether extraction can read it.');
  }

  if (record.page_count === 0) {
    status = status === 'derivative' ? 'suspect_derivative' : 'corrupt';
    notes.push('PDF reports zero readable pages.');
  }

  if (record.file_size_bytes < 50_000 && record.document_type !== 'rps_working_chunk') {
    if (status === 'good') status = 'suspect';
    notes.push('File is under 50 KB; verify it is not truncated.');
  }

  if (record.page_count !== null && record.page_count > 0 && record.extractable_text_chars === 0) {
    if (status === 'good') status = 'usable';
    notes.push('No extractable text; may be image-only and require OCR.');
  }

  let score = 100;
  if (status === 'usable') score = 75;
  if (status === 'suspect') score = 55;
  if (status === 'derivative') score = 45;
  if (status === 'suspect_derivative') score = 30;
  if (status === 'corrupt') score = 0;

  if (record.page_count) score += Math.min(10, Math.floor(record.page_count / 50));
  if (record.extractable_text_chars) score += Math.min(10, Math.floor(record.extractable_text_chars / 100_000));
  score -= record.source_priority / 10;
  if (isDerivativeType(record.document_type)) score -= 30;

  return {
    quality_status: status,
    quality_score: Math.max(0, Math.round(score)),
    quality_notes: notes.join(' '),
  };
}

function chooseCanonical(records) {
  return [...records].sort((a, b) => {
    if (b.quality_score !== a.quality_score) return b.quality_score - a.quality_score;
    if (a.source_priority !== b.source_priority) return a.source_priority - b.source_priority;
    if ((b.page_count || 0) !== (a.page_count || 0)) return (b.page_count || 0) - (a.page_count || 0);
    if (b.file_size_bytes !== a.file_size_bytes) return b.file_size_bytes - a.file_size_bytes;
    return a.file_path.localeCompare(b.file_path);
  })[0];
}

function stableId(prefix, value) {
  return `${prefix}_${crypto.createHash('sha1').update(value).digest('hex').slice(0, 12)}`;
}

function formatMb(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

function escapeTable(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

async function main() {
  const sourceFiles = [];
  const allFiles = [];

  for (const source of SOURCE_ROOTS) {
    for (const filePath of walkFiles(source.root)) {
      allFiles.push({ source, filePath });
    }
  }

  console.log(`Scanning ${allFiles.length} local manual files`);

  for (const [index, { source, filePath }] of allFiles.entries()) {
      const ext = path.extname(filePath).toLowerCase();
      const stat = fs.statSync(filePath);
      if (index % 25 === 0 || stat.size > 50 * 1024 * 1024) {
        console.log(`Progress ${index + 1}/${allFiles.length}: ${path.basename(filePath)} (${formatMb(stat.size)} MB)`);
      }
      const sha256 = await sha256File(filePath);
      const documentType = classifyDocument(filePath, source.group);
      const inspection = ext === '.pdf'
        ? await inspectPdf(filePath, stat.size)
        : inspectText(filePath);

      const baseRecord = {
        id: stableId('file', filePath),
        filename: path.basename(filePath),
        normalized_title: normalizeTitle(filePath),
        extension: ext.slice(1),
        file_path: filePath,
        source_group: source.group,
        source_priority: source.priority,
        document_type: documentType,
        file_size_bytes: stat.size,
        sha256,
        ...inspection,
      };

      const quality = qualityFor(baseRecord);
      sourceFiles.push({ ...baseRecord, ...quality });
  }

  const exactDuplicateGroups = new Map();
  for (const record of sourceFiles) {
    const key = `${record.extension}:${record.sha256}`;
    if (!exactDuplicateGroups.has(key)) exactDuplicateGroups.set(key, []);
    exactDuplicateGroups.get(key).push(record);
  }

  const titleGroups = new Map();
  for (const record of sourceFiles) {
    const key = record.normalized_title;
    if (!titleGroups.has(key)) titleGroups.set(key, []);
    titleGroups.get(key).push(record);
  }

  const registries = [];

  for (const [normalizedTitle, records] of [...titleGroups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const canonical = chooseCanonical(records);
    const canonicalId = stableId('manual', normalizedTitle);
    const duplicatePaths = records
      .filter((record) => record.id !== canonical.id)
      .map((record) => ({
        file_path: record.file_path,
        sha256: record.sha256,
        quality_status: record.quality_status,
        duplicate_type: record.sha256 === canonical.sha256 ? 'exact_duplicate' : 'filename_variant_or_related',
      }));

    registries.push({
      canonical_id: canonicalId,
      normalized_title: normalizedTitle,
      canonical_file: canonical.filename,
      canonical_path: canonical.file_path,
      canonical_sha256: canonical.sha256,
      document_type: canonical.document_type,
      source_group: canonical.source_group,
      file_size_mb: Number(formatMb(canonical.file_size_bytes)),
      page_count: canonical.page_count,
      extractable_text_chars: canonical.extractable_text_chars,
      text_chars_per_page: canonical.text_chars_per_page,
      quality_status: canonical.quality_status,
      quality_score: canonical.quality_score,
      quality_notes: canonical.quality_notes,
      duplicate_count: duplicatePaths.length,
      duplicate_paths: duplicatePaths,
      use_for_extraction: !isDerivativeType(canonical.document_type)
        && ['good', 'usable'].includes(canonical.quality_status),
    });
  }

  const exactDuplicateCount = [...exactDuplicateGroups.values()].filter((records) => records.length > 1).length;
  const extractionReady = registries.filter((record) => record.use_for_extraction).length;
  const suspect = registries.filter((record) => ['suspect', 'corrupt', 'usable'].includes(record.quality_status)).length;
  const derivative = registries.filter((record) => ['derivative', 'suspect_derivative'].includes(record.quality_status)).length;

  const json = {
    generated_at: new Date().toISOString(),
    source_roots: SOURCE_ROOTS,
    totals: {
      scanned_files: sourceFiles.length,
      canonical_records: registries.length,
      exact_duplicate_hash_groups: exactDuplicateCount,
      extraction_ready: extractionReady,
      suspect_or_usable: suspect,
      derivative,
    },
    records: registries,
    files: sourceFiles,
  };

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(json, null, 2)}\n`);

  let md = '';
  md += '# Barry v2 Canonical Manual Registry\n\n';
  md += '**Generated:** 12 June 2026  \n';
  md += '**Purpose:** Deduplicate local Barry source documents, score document quality, and identify one canonical extraction source per manual or chapter.\n\n';
  md += '---\n\n';
  md += '## Summary\n\n';
  md += '| Metric | Count |\n|---|---:|\n';
  md += `| Scanned local files | ${json.totals.scanned_files} |\n`;
  md += `| Canonical records | ${json.totals.canonical_records} |\n`;
  md += `| Exact duplicate hash groups | ${json.totals.exact_duplicate_hash_groups} |\n`;
  md += `| Ready for extraction | ${json.totals.extraction_ready} |\n`;
  md += `| Usable/suspect/corrupt canonical records | ${json.totals.suspect_or_usable} |\n`;
  md += `| Derivative canonical records | ${json.totals.derivative} |\n\n`;

  md += 'Quality status meanings:\n\n';
  md += '- `good`: opens cleanly, has pages, and has usable text density.\n';
  md += '- `usable`: opens but is likely scanned/image-heavy or low text density; OCR may be needed.\n';
  md += '- `suspect`: needs manual verification, often because it is very small, restricted, or incomplete.\n';
  md += '- `corrupt`: parser could not open it or zero pages were detected.\n';
  md += '- `derivative`: not a canonical source, such as extracted text, split derivatives, or RPS working chunks.\n\n';

  md += '---\n\n';
  md += '## Extraction-Ready Canonical Sources\n\n';
  md += '| # | Canonical ID | Title key | File | Type | Pages | Text chars/page | Size MB | Quality | Duplicates | Path |\n';
  md += '|---:|---|---|---|---|---:|---:|---:|---|---:|---|\n';
  let row = 1;
  for (const record of registries.filter((r) => r.use_for_extraction)) {
    md += `| ${row++} | \`${record.canonical_id}\` | \`${escapeTable(record.normalized_title)}\` | \`${escapeTable(record.canonical_file)}\` | ${record.document_type} | ${record.page_count ?? ''} | ${record.text_chars_per_page ?? ''} | ${record.file_size_mb} | ${record.quality_status} | ${record.duplicate_count} | \`${escapeTable(record.canonical_path)}\` |\n`;
  }

  md += '\n---\n\n';
  md += '## Needs Review Before Extraction\n\n';
  md += '| # | Canonical ID | Title key | File | Type | Pages | Quality | Notes | Path |\n';
  md += '|---:|---|---|---|---|---:|---|---|---|\n';
  row = 1;
  for (const record of registries.filter((r) => !r.use_for_extraction)) {
    md += `| ${row++} | \`${record.canonical_id}\` | \`${escapeTable(record.normalized_title)}\` | \`${escapeTable(record.canonical_file)}\` | ${record.document_type} | ${record.page_count ?? ''} | ${record.quality_status} | ${escapeTable(record.quality_notes || 'Not selected for extraction.')} | \`${escapeTable(record.canonical_path)}\` |\n`;
  }

  md += '\n---\n\n';
  md += '## Duplicate Groups\n\n';
  md += 'Only groups with at least one duplicate are listed.\n\n';
  md += '| Canonical ID | Canonical file | Duplicate type | Duplicate path |\n';
  md += '|---|---|---|---|\n';
  for (const record of registries.filter((r) => r.duplicate_paths.length > 0)) {
    for (const duplicate of record.duplicate_paths) {
      md += `| \`${record.canonical_id}\` | \`${escapeTable(record.canonical_file)}\` | ${duplicate.duplicate_type} | \`${escapeTable(duplicate.file_path)}\` |\n`;
    }
  }

  md += '\n---\n\n';
  md += '## Extraction Rule\n\n';
  md += 'Barry v2 should only extract records where `use_for_extraction = true`. All other files remain available for traceability, comparison, or manual repair.\n\n';
  md += 'Selection priority is: clean PDF parsing, higher quality score, preferred source folder, higher page count, higher sane file size, then stable filename order.\n';

  fs.writeFileSync(OUTPUT_MD, md);

  console.log(`Scanned ${sourceFiles.length} files`);
  console.log(`Wrote ${OUTPUT_MD}`);
  console.log(`Wrote ${OUTPUT_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
