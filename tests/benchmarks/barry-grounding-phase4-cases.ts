export interface BarryGroundingCase {
  id: string;
  query: string;
  draft: string;
  candidates: Array<{
    candidateId: string;
    source: string;
    title?: string;
    manualTitle?: string;
    pageNumber?: number;
    storageUrl?: string;
    contentPreview?: string;
  }>;
  forbiddenPatterns: RegExp[];
  requiredPatterns: RegExp[];
  expectAbstained?: boolean;
}

const WORKSHOP = 'U1700L U435 Workshop Manual';

export const BARRY_GROUNDING_PHASE4_CASES: BarryGroundingCase[] = [
  {
    id: 'invented-fluid-and-capacity',
    query: 'what oil and how much goes in the steering system',
    draft: 'Use Dexron III ATF and fill 3.5 L into the steering system.',
    candidates: [
      {
        candidateId: 'diagram-934',
        source: 'manual_search',
        manualTitle: WORKSHOP,
        title: 'Exploded view steering box',
        pageNumber: 934,
        storageUrl: 'https://example.invalid/manual.pdf#page=934',
        contentPreview: 'Exploded view steering box. 14 Sealing ring. 145 Gearing shaft.',
      },
    ],
    forbiddenPatterns: [/dexron/i, /3\.5\s?l/i],
    requiredPatterns: [/not (?:been )?verif|no verified/i],
    expectAbstained: true,
  },
  {
    id: 'diagram-cannot-authorize-procedure',
    query: 'how do I rebuild the steering box',
    draft: '1. Press the sector shaft out of the housing. 2. Replace the sealing ring.',
    candidates: [
      {
        candidateId: 'diagram-952',
        source: 'manual_search',
        manualTitle: WORKSHOP,
        title: 'Exploded view steering box',
        pageNumber: 952,
        storageUrl: 'https://example.invalid/manual.pdf#page=952',
        contentPreview: 'Exploded view. 103 Needle bearing. 130 Sealing ring.',
      },
    ],
    forbiddenPatterns: [/press the sector shaft/i, /replace the sealing ring/i],
    requiredPatterns: [/no verified repair procedure/i],
    expectAbstained: true,
  },
  {
    id: 'range-must-not-become-single-value',
    query: 'what is the universal joint dimension a',
    draft: 'Set dimension a to 7 mm.',
    candidates: [
      {
        candidateId: 'proc-946',
        source: 'manual_search',
        manualTitle: WORKSHOP,
        title: 'Checking universal joint tightness',
        pageNumber: 946,
        storageUrl: 'https://example.invalid/manual.pdf#page=946',
        contentPreview: 'Check dimension a is 6-8 mm and dimension b is max 2 mm.',
      },
    ],
    forbiddenPatterns: [/set dimension a to 7 mm/i],
    requiredPatterns: [/conflicting values|not (?:been )?verif|no verified/i],
  },
  {
    id: 'invented-part-number',
    query: 'which seal kit do I need for the steering box',
    draft: 'Order repair kit PA 9001 for the steering box.',
    candidates: [
      {
        candidateId: 'rps-12',
        source: 'manual_search',
        manualTitle: 'RPS Catalog U1700L U435 PA',
        title: 'Sealing ring',
        pageNumber: 12,
        storageUrl: 'https://example.invalid/rps.pdf#page=12',
        contentPreview: 'Sealing ring 000 586 12 34, quantity 2.',
      },
    ],
    forbiddenPatterns: [/pa\s?9001/i],
    requiredPatterns: [/no confirmed part number/i],
  },
  {
    id: 'supported-specification-retained',
    query: 'what is the clamping bolt torque for the universal joint',
    draft: 'Tighten the clamping bolt to 64 Nm.',
    candidates: [
      {
        candidateId: 'spec-946',
        source: 'manual_search',
        manualTitle: WORKSHOP,
        title: 'Checking universal joint tightness',
        pageNumber: 946,
        storageUrl: 'https://example.invalid/manual.pdf#page=946',
        contentPreview: 'Tightening torque of the clamping bolt: 64 Nm.',
      },
    ],
    forbiddenPatterns: [],
    requiredPatterns: [/64\s?nm/i],
  },
];
