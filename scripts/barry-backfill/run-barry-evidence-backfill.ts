import { writeFileSync } from 'node:fs';
import pg from 'pg';
import {
  BARRY_SEMANTIC_VERSION,
  PHASE1_SEMANTIC_REGISTRY,
} from '../../supabase/functions/_shared/barry-semantic';
import { adaptEvidenceRow } from './barry-evidence-adapters';
import { classifyDocumentRole } from './barry-evidence-classify';
import {
  DryRunBackfillStore,
  PgBackfillStore,
  type BackfillStore,
} from './barry-evidence-store';
import {
  buildCoverageReport,
  CONFIDENCE_BAND_QUERY,
  COVERAGE_QUERY,
  TOTAL_UNITS_QUERY,
  type CoverageBucket,
} from './barry-evidence-coverage';
import type {
  AdapterContext,
  BackfillFilters,
  BackfillStats,
  BackfillSourceType,
  DocumentRegistration,
  EvidenceSourceRow,
  SourceDocumentRecord,
} from './barry-evidence-types';

interface CliOptions {
  dbUrl: string;
  apply: boolean;
  runKey: string;
  semanticVersion: string;
  filters: BackfillFilters;
  auditOut?: string;
  coverage: boolean;
  rollback?: string;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dbUrl: process.env.BARRY_BACKFILL_DB_URL ?? '',
    apply: false,
    runKey: `phase2-${Date.now()}`,
    semanticVersion: BARRY_SEMANTIC_VERSION,
    filters: { batchSize: 100 },
    coverage: false,
  };

  for (const arg of argv) {
    if (arg === '--apply') options.apply = true;
    else if (arg === '--coverage') options.coverage = true;
    else if (arg.startsWith('--db-url=')) options.dbUrl = arg.slice('--db-url='.length);
    else if (arg.startsWith('--run-key=')) options.runKey = arg.slice('--run-key='.length);
    else if (arg.startsWith('--semantic-version=')) options.semanticVersion = arg.slice('--semantic-version='.length);
    else if (arg.startsWith('--source=')) options.filters.sources = arg.slice('--source='.length).split(',') as BackfillSourceType[];
    else if (arg.startsWith('--document=')) options.filters.documentKey = arg.slice('--document='.length);
    else if (arg.startsWith('--pages=')) {
      const [start, end] = arg.slice('--pages='.length).split('-').map(Number);
      options.filters.pageStart = start;
      options.filters.pageEnd = end ?? start;
    } else if (arg.startsWith('--batch=')) options.filters.batchSize = Number(arg.slice('--batch='.length));
    else if (arg.startsWith('--resume=')) options.filters.resumeCursor = arg.slice('--resume='.length);
    else if (arg.startsWith('--audit-out=')) options.auditOut = arg.slice('--audit-out='.length);
    else if (arg.startsWith('--rollback=')) options.rollback = arg.slice('--rollback='.length);
    else throw new Error(`Unknown argument ${arg}`);
  }
  return options;
}

async function resolveVersionId(client: pg.Client, version: string): Promise<string> {
  const result = await client.query(
    'SELECT id FROM public.barry_semantic_versions WHERE version = $1',
    [version],
  );
  if (!result.rows[0]) throw new Error(`Unknown semantic version ${version}`);
  return result.rows[0].id;
}

async function loadSourceDocuments(client: pg.Client): Promise<SourceDocumentRecord[]> {
  const documents: SourceDocumentRecord[] = [];

  const manuals = await client.query(
    `SELECT m.id, m.title, m.filename, m.storage_path, m.total_pages, m.manual_type,
            COALESCE(array_agg(DISTINCT model.name) FILTER (WHERE model.name IS NOT NULL), '{}') AS model_tags
     FROM public.barry_v2_manuals m
     LEFT JOIN public.barry_v2_manual_applicable_models am ON am.manual_id = m.id
     LEFT JOIN public.barry_v2_vehicle_models model ON model.id = am.vehicle_model_id
     GROUP BY m.id`,
  );
  for (const row of manuals.rows) {
    documents.push({
      documentKey: `barry_v2_manual:${row.id}`,
      title: row.title,
      sourceType: 'barry_v2_manual',
      sourceRecordId: row.id,
      storagePath: row.storage_path ?? undefined,
      physicalPageCount: row.total_pages ?? undefined,
      modelTags: row.model_tags ?? [],
      filename: row.filename ?? undefined,
      manualType: row.manual_type ?? undefined,
    });
  }

  const chunkDocuments = await client.query(
    `SELECT manual_id, manual_title, max(page_number) AS max_page
     FROM public.manual_chunks
     GROUP BY manual_id, manual_title`,
  );
  for (const row of chunkDocuments.rows) {
    documents.push({
      documentKey: `manual_chunks_document:${row.manual_id}`,
      title: row.manual_title,
      sourceType: 'manual_chunks_document',
      sourceRecordId: row.manual_id,
      physicalPageCount: row.max_page ?? undefined,
      modelTags: [],
    });
  }

  const rpsCatalogs = await client.query(
    `SELECT DISTINCT rps_number FROM public.rps_parts WHERE rps_number IS NOT NULL
     UNION
     SELECT DISTINCT rps_number FROM public.rps_illustrations WHERE rps_number IS NOT NULL`,
  );
  for (const row of rpsCatalogs.rows) {
    documents.push({
      documentKey: `rps_catalog:${row.rps_number}`,
      title: `RPS ${row.rps_number}`,
      sourceType: 'rps_catalog',
      modelTags: [],
    });
  }

  return documents;
}

function registerDocuments(
  documents: SourceDocumentRecord[],
  filters: BackfillFilters,
): Map<string, DocumentRegistration> {
  const registrations = new Map<string, DocumentRegistration>();
  for (const document of documents) {
    if (filters.documentKey && document.documentKey !== filters.documentKey) continue;
    const classification = classifyDocumentRole(document);
    registrations.set(document.documentKey, {
      documentKey: document.documentKey,
      title: document.title,
      documentRole: classification.documentRole,
      storagePath: document.storagePath,
      physicalPageCount: document.physicalPageCount,
      checksum: document.checksum,
      modelTags: document.modelTags,
      sourceType: document.sourceType,
      sourceRecordId: document.sourceRecordId,
      provenance: {
        source: 'phase2_backfill',
        role_reason: classification.reason,
        role_confidence: classification.confidence,
      },
    });
  }
  return registrations;
}

async function loadSourceRows(
  client: pg.Client,
  filters: BackfillFilters,
  registrations: Map<string, DocumentRegistration>,
): Promise<EvidenceSourceRow[]> {
  const rows: EvidenceSourceRow[] = [];
  const wanted = new Set(filters.sources ?? [
    'manual_chunk',
    'barry_v2_content_block',
    'rps_part',
    'rps_illustration',
    'barry_v2_specification',
  ] as BackfillSourceType[]);
  const scopedPageClause = filters.pageStart != null ? 'AND page_number BETWEEN $2 AND $3' : '';
  const rpsPageClause = filters.pageStart != null ? 'AND page_number BETWEEN $1 AND $2' : '';
  const pageParams = filters.pageStart != null ? [filters.pageStart, filters.pageEnd ?? filters.pageStart] : [];

  const documentIds = [...registrations.values()]
    .filter((registration) => registration.sourceRecordId)
    .map((registration) => registration.sourceRecordId as string);

  if (wanted.has('manual_chunk')) {
    const result = await client.query(
      `SELECT id, manual_id, section_title, page_number, content, has_visual_elements, extraction_quality
       FROM public.manual_chunks
       WHERE manual_id = ANY($1) ${scopedPageClause}
       ORDER BY id`,
      [documentIds, ...pageParams],
    );
    for (const row of result.rows) {
      rows.push({
        sourceType: 'manual_chunk',
        sourceRecordId: row.id,
        documentKey: `manual_chunks_document:${row.manual_id}`,
        physicalPdfPage: row.page_number ?? undefined,
        title: row.section_title ?? undefined,
        contentText: row.content ?? undefined,
        hasVisualElements: row.has_visual_elements ?? false,
        systemTags: [],
        modelTags: [],
        extractionQuality: row.extraction_quality ?? undefined,
      });
    }
  }

  if (wanted.has('barry_v2_content_block')) {
    const result = await client.query(
      `SELECT block.id, manual.id AS manual_id, block.title, block.page_number, block.content_text,
              block.system_tags, block.model_tags, block.extraction_quality
       FROM public.barry_v2_content_blocks block
       JOIN public.barry_v2_manual_chapters chapter ON chapter.id = block.chapter_id
       JOIN public.barry_v2_manuals manual ON manual.id = chapter.manual_id
       WHERE manual.id = ANY($1) ${scopedPageClause}
       ORDER BY block.id`,
      [documentIds, ...pageParams],
    );
    for (const row of result.rows) {
      rows.push({
        sourceType: 'barry_v2_content_block',
        sourceRecordId: row.id,
        documentKey: `barry_v2_manual:${row.manual_id}`,
        physicalPdfPage: row.page_number ?? undefined,
        title: row.title ?? undefined,
        contentText: row.content_text ?? undefined,
        systemTags: row.system_tags ?? [],
        modelTags: row.model_tags ?? [],
        extractionQuality: row.extraction_quality ?? undefined,
      });
    }
  }

  if (wanted.has('rps_part')) {
    const result = await client.query(
      `SELECT part.id, part.rps_number, part.group_code, part.description, part.page_number, part.vehicle_model,
              rps_group.group_name
       FROM public.rps_parts part
       LEFT JOIN public.rps_groups rps_group ON rps_group.group_code = part.group_code
       WHERE part.rps_number IS NOT NULL ${rpsPageClause}
       ORDER BY part.id`,
      pageParams,
    );
    for (const row of result.rows) {
      if (!registrations.has(`rps_catalog:${row.rps_number}`)) continue;
      rows.push({
        sourceType: 'rps_part',
        sourceRecordId: row.id,
        documentKey: `rps_catalog:${row.rps_number}`,
        physicalPdfPage: row.page_number ?? undefined,
        title: row.description ?? undefined,
        systemTags: [],
        modelTags: [],
        groupCode: row.group_code ?? undefined,
        groupName: row.group_name ?? undefined,
        vehicleModel: row.vehicle_model ?? undefined,
      });
    }
  }

  if (wanted.has('rps_illustration')) {
    const result = await client.query(
      `SELECT illustration.id, illustration.rps_number, illustration.group_code, illustration.description,
              illustration.page_number, rps_group.group_name
       FROM public.rps_illustrations illustration
       LEFT JOIN public.rps_groups rps_group ON rps_group.group_code = illustration.group_code
       WHERE illustration.rps_number IS NOT NULL ${rpsPageClause}
       ORDER BY illustration.id`,
      pageParams,
    );
    for (const row of result.rows) {
      if (!registrations.has(`rps_catalog:${row.rps_number}`)) continue;
      rows.push({
        sourceType: 'rps_illustration',
        sourceRecordId: row.id,
        documentKey: `rps_catalog:${row.rps_number}`,
        physicalPdfPage: row.page_number ?? undefined,
        title: row.description ?? undefined,
        systemTags: [],
        modelTags: [],
        groupCode: row.group_code ?? undefined,
        groupName: row.group_name ?? undefined,
      });
    }
  }

  if (wanted.has('barry_v2_specification')) {
    const result = await client.query(
      `SELECT spec.id, manual.id AS manual_id, spec.category, spec.name, spec.source_page, spec.model_tags, spec.system_tag
       FROM public.barry_v2_specifications spec
       JOIN public.barry_v2_content_blocks block ON block.id = spec.block_id
       JOIN public.barry_v2_manual_chapters chapter ON chapter.id = block.chapter_id
       JOIN public.barry_v2_manuals manual ON manual.id = chapter.manual_id
       WHERE manual.id = ANY($1)
       ORDER BY spec.id`,
      [documentIds],
    );
    for (const row of result.rows) {
      rows.push({
        sourceType: 'barry_v2_specification',
        sourceRecordId: row.id,
        documentKey: `barry_v2_manual:${row.manual_id}`,
        physicalPdfPage: row.source_page ?? undefined,
        systemTags: row.system_tag ? [row.system_tag] : [],
        modelTags: row.model_tags ?? [],
        specCategory: row.category ?? undefined,
        specName: row.name ?? undefined,
      });
    }
  }

  return rows;
}

async function run(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (!options.dbUrl) {
    throw new Error('Provide --db-url or BARRY_BACKFILL_DB_URL');
  }

  const client = new pg.Client({ connectionString: options.dbUrl });
  await client.connect();

  try {
    const versionId = await resolveVersionId(client, options.semanticVersion);

    if (options.rollback) {
      const store: BackfillStore = new PgBackfillStore(client, versionId);
      const result = await store.rollbackRun(options.rollback);
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (options.coverage) {
      const coverageRows = (await client.query(COVERAGE_QUERY, [versionId])).rows;
      const bands = (await client.query(CONFIDENCE_BAND_QUERY, [versionId])).rows as CoverageBucket[];
      const totalUnits = Number((await client.query(TOTAL_UNITS_QUERY, [versionId])).rows[0]?.total_units ?? 0);
      const report = buildCoverageReport(coverageRows, bands, totalUnits);
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    const documents = await loadSourceDocuments(client);
    const registrations = registerDocuments(documents, options.filters);
    const context: AdapterContext = {
      registry: PHASE1_SEMANTIC_REGISTRY,
      semanticVersion: options.semanticVersion,
      documentRoles: registrations,
    };

    const store: BackfillStore = options.apply
      ? new PgBackfillStore(client, versionId)
      : new DryRunBackfillStore(versionId);

    const mode = options.apply ? 'apply' : 'dry_run';
    const runId = await store.ensureRun(options.runKey, mode, {
      sources: options.filters.sources ?? 'all',
      documentKey: options.filters.documentKey ?? null,
      pages: options.filters.pageStart != null ? [options.filters.pageStart, options.filters.pageEnd] : null,
    });

    const stats: BackfillStats = {
      documents: 0,
      evidenceUnits: 0,
      annotationsApproved: 0,
      annotationsProposed: 0,
      reviewItems: 0,
      skipped: 0,
    };

    const documentIds = new Map<string, string>();
    for (const registration of registrations.values()) {
      documentIds.set(registration.documentKey, await store.upsertDocument(registration));
      stats.documents += 1;
    }

    const rows = await loadSourceRows(client, options.filters, registrations);
    const startIndex = options.filters.resumeCursor ? Number(options.filters.resumeCursor) : 0;
    const batchSize = options.filters.batchSize;
    const batch = rows.slice(startIndex, startIndex + batchSize);

    for (const [offset, row] of batch.entries()) {
      const adapted = adaptEvidenceRow(row, context);
      const documentId = documentIds.get(row.documentKey);
      if (!documentId) {
        stats.skipped += 1;
        continue;
      }
      const unitId = await store.upsertEvidenceUnit(adapted.unit, documentId, runId);
      stats.evidenceUnits += 1;
      for (const annotation of adapted.annotations) {
        await store.upsertAnnotation(annotation, unitId, runId);
        if (annotation.reviewStatus === 'approved') stats.annotationsApproved += 1;
        else stats.annotationsProposed += 1;
      }
      for (const item of adapted.reviewItems) {
        await store.insertReviewItem(item);
        stats.reviewItems += 1;
      }
      stats.cursor = String(startIndex + offset + 1);
    }

    await store.completeRun(options.runKey, stats);

    const audit = {
      runKey: options.runKey,
      mode,
      semanticVersion: options.semanticVersion,
      stats,
      totalRowsInScope: rows.length,
      processedRange: [startIndex, startIndex + batch.length],
      ...(store instanceof DryRunBackfillStore ? { planned: store.log } : {}),
    };
    const auditOut = options.auditOut ?? `/tmp/barry-evidence-backfill-${options.runKey}.json`;
    writeFileSync(auditOut, JSON.stringify(audit, null, 2));
    console.log(JSON.stringify({ ...stats, mode, auditOut, totalRowsInScope: rows.length }, null, 2));
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
