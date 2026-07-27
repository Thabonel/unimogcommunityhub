import type {
  ClassifiedDocument,
  ClassifiedPage,
  DocumentRole,
  EvidenceSourceRow,
  SourceDocumentRecord,
} from './barry-evidence-types';

const PROCEDURE_HEADING = /^(checking|check|disassembly and assembly|removal and installation|removing|installing|adjusting|refilling|bleeding|replacing|draining|topping up)\b/im;
const SPECIFICATION_HEADING = /\btechnical data\b|\bspecifications?\b|\btightening torques?\b|\bfilling quantities\b|\blubricants?\b/i;
const DIAGRAM_HEADING = /\bexploded\s+v?[1i]?ew\b|\billustration\b|\bassembly drawing\b/i;
const WARNING_HEADING = /\b(warning|caution|danger)\b/i;
const INDEX_HEADING = /^(table of contents|contents|index)\b/im;

export function classifyDocumentRole(document: SourceDocumentRecord): ClassifiedDocument {
  const filename = (document.filename ?? '').toLowerCase();
  const title = document.title.toLowerCase();

  if (document.sourceType === 'rps_catalog') {
    return {
      documentRole: 'parts_catalog',
      confidence: 0.95,
      reason: 'verified RPS catalogue identity',
    };
  }
  if (filename.startsWith('u435-maint-') || /u435[_-]maint[_-]/.test(filename)) {
    return {
      documentRole: 'maintenance_manual',
      confidence: 0.95,
      reason: 'verified u435 maintenance filename convention',
    };
  }
  if (filename.startsWith('rps-') || title.startsWith('rps')) {
    return {
      documentRole: 'parts_catalog',
      confidence: 0.95,
      reason: 'verified RPS parts catalogue identity',
    };
  }
  if (document.manualType === 'workshop') {
    return {
      documentRole: 'workshop_manual',
      confidence: 0.9,
      reason: 'verified barry_v2 manual_type workshop',
    };
  }
  if (title.includes('workshop manual')) {
    return {
      documentRole: 'workshop_manual',
      confidence: 0.9,
      reason: 'verified workshop manual title',
    };
  }
  return {
    documentRole: 'unknown',
    confidence: 0.3,
    reason: 'document role not established by verified identity',
  };
}

export function classifyEvidencePage(
  row: EvidenceSourceRow,
  documentRole: DocumentRole,
): ClassifiedPage {
  if (row.sourceType === 'rps_part') {
    return { pageType: 'parts_list', confidence: 0.95, reason: 'structured RPS parts record' };
  }
  if (row.sourceType === 'rps_illustration') {
    return { pageType: 'diagram', confidence: 0.95, reason: 'structured RPS illustration record' };
  }
  if (row.sourceType === 'barry_v2_specification') {
    return { pageType: 'specification', confidence: 0.9, reason: 'structured specification record' };
  }

  const headingSource = `${row.title ?? ''}\n${(row.contentText ?? '').slice(0, 240)}`;
  const proceduralRole = documentRole === 'workshop_manual' || documentRole === 'maintenance_manual';

  if (DIAGRAM_HEADING.test(headingSource)) {
    return { pageType: 'diagram', confidence: 0.9, reason: 'exploded-view or illustration heading' };
  }
  if (WARNING_HEADING.test(row.title ?? '')) {
    return { pageType: 'warning', confidence: 0.85, reason: 'warning heading' };
  }
  if (SPECIFICATION_HEADING.test(headingSource)) {
    return { pageType: 'specification', confidence: 0.85, reason: 'technical data or specification heading' };
  }
  if (INDEX_HEADING.test(headingSource.trim())) {
    return { pageType: 'index', confidence: 0.85, reason: 'index heading' };
  }
  if (PROCEDURE_HEADING.test(headingSource.trim())) {
    if (!proceduralRole) {
      return {
        pageType: 'unknown',
        confidence: 0.4,
        reason: `procedure-like heading in ${documentRole} cannot authorize a procedure`,
      };
    }
    return { pageType: 'procedure', confidence: 0.85, reason: 'procedure heading in procedural manual' };
  }
  if (row.hasVisualElements && !(row.contentText ?? '').trim()) {
    if (documentRole === 'parts_catalog') {
      return { pageType: 'diagram', confidence: 0.8, reason: 'visual page in parts catalogue' };
    }
    return { pageType: 'unknown', confidence: 0.4, reason: 'visual page without classifiable text' };
  }
  if ((row.contentText ?? '').trim().length > 0) {
    return { pageType: 'explanation', confidence: 0.6, reason: 'text content without a specific structural heading' };
  }
  return { pageType: 'unknown', confidence: 0.3, reason: 'no classification evidence' };
}
