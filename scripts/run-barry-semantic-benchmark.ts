import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  buildSemanticQueryFrame,
  type SemanticQueryFrame,
} from '../supabase/functions/_shared/barry-semantic';
import { classifyQueryV2 } from '../supabase/functions/barry-tools/tools/classify-query-v2';
import {
  BARRY_SEMANTIC_PHASE1_CASES,
  type BarrySemanticBenchmarkCase,
} from '../tests/benchmarks/barry-semantic-phase1-cases';

interface CaseResult {
  id: string;
  passed: boolean;
  conceptRecall: number;
  claimRecall: number;
  ambiguityRecall: number;
  forbiddenConceptViolations: string[];
}

interface BenchmarkResult {
  benchmark: 'barry-semantic-phase1';
  generatedAt: string;
  caseCount: number;
  passedCases: number;
  passRate: number;
  conceptRecall: number;
  claimRecall: number;
  ambiguityRecall: number;
  legacyBaseline: {
    queryTypeCoverage: number;
    systemTagCoverage: number;
    modelTagCoverage: number;
  };
  cases: CaseResult[];
}

function frameConceptKeys(frame: SemanticQueryFrame): string[] {
  return [
    ...(frame.vehicleModelConceptKey ? [frame.vehicleModelConceptKey] : []),
    ...frame.vehicleVariantConceptKeys,
    ...frame.systemConceptKeys,
    ...frame.componentConceptKeys,
    ...frame.symptomConceptKeys,
    ...frame.operationConceptKeys,
    ...frame.propertyConceptKeys,
    ...frame.fluidConceptKeys,
    ...frame.partConceptKeys,
    ...frame.toolConceptKeys,
    ...frame.hazardConceptKeys,
  ];
}

function recall(expected: string[], actual: string[]): number {
  if (!expected.length) return 1;
  const actualValues = new Set(actual);
  return expected.filter((value) => actualValues.has(value)).length / expected.length;
}

function legacyCoverage(testCase: BarrySemanticBenchmarkCase) {
  const legacy = classifyQueryV2(testCase.query);
  const expectedSystems = testCase.expectedConceptKeys
    .filter((key) => key.startsWith('vehicle_system.'))
    .map((key) => key.split('.')[1]);
  const expectedModels = testCase.expectedConceptKeys
    .filter((key) => key.startsWith('vehicle_model.'))
    .map((key) => key.split('.')[1]);

  return {
    queryTypeCovered: legacy.query_type !== 'general',
    systemCoverage: recall(expectedSystems, legacy.system_tags),
    modelCoverage: recall(expectedModels, legacy.model_tags),
  };
}

function evaluateCase(testCase: BarrySemanticBenchmarkCase): CaseResult {
  const frame = buildSemanticQueryFrame(testCase.query, {
    queryId: testCase.id,
    vehicleModelConceptKey: testCase.vehicleModelConceptKey,
  });
  const concepts = frameConceptKeys(frame);
  const expectedAmbiguities = testCase.expectedAmbiguityTerms ?? [];
  const actualAmbiguities = frame.ambiguities.map((ambiguity) => ambiguity.term);
  const forbiddenConceptViolations = (testCase.forbiddenConceptKeys ?? [])
    .filter((key) => concepts.includes(key));
  const conceptRecall = recall(testCase.expectedConceptKeys, concepts);
  const claimRecall = recall(testCase.expectedClaimClasses, frame.requestedClaimClasses);
  const ambiguityRecall = recall(expectedAmbiguities, actualAmbiguities);

  return {
    id: testCase.id,
    passed:
      conceptRecall === 1
      && claimRecall === 1
      && ambiguityRecall === 1
      && forbiddenConceptViolations.length === 0,
    conceptRecall,
    claimRecall,
    ambiguityRecall,
    forbiddenConceptViolations,
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

async function main() {
  const cases = BARRY_SEMANTIC_PHASE1_CASES.map(evaluateCase);
  const legacy = BARRY_SEMANTIC_PHASE1_CASES.map(legacyCoverage);
  const passedCases = cases.filter((result) => result.passed).length;
  const result: BenchmarkResult = {
    benchmark: 'barry-semantic-phase1',
    generatedAt: new Date().toISOString(),
    caseCount: cases.length,
    passedCases,
    passRate: passedCases / cases.length,
    conceptRecall: average(cases.map((item) => item.conceptRecall)),
    claimRecall: average(cases.map((item) => item.claimRecall)),
    ambiguityRecall: average(cases.map((item) => item.ambiguityRecall)),
    legacyBaseline: {
      queryTypeCoverage: average(legacy.map((item) => item.queryTypeCovered ? 1 : 0)),
      systemTagCoverage: average(legacy.map((item) => item.systemCoverage)),
      modelTagCoverage: average(legacy.map((item) => item.modelCoverage)),
    },
    cases,
  };

  const outputPathArg = process.argv.find((argument) => argument.startsWith('--output='));
  if (outputPathArg) {
    const outputPath = resolve(outputPathArg.slice('--output='.length));
    await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (passedCases !== cases.length) process.exitCode = 1;
}

await main();
