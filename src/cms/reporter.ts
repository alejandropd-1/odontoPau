import { StructuralComparisonResult } from './structural-comparator';
import { RoundTripResult, NonMutationStatus } from './roundtrip';
import { Phase3NegativeTestResult } from './phase3-negative-tests';
import { CONTRACT_BASELINE_FIELDS } from './baseline';

/**
 * Genera el reporte determinista de contratos CMS.
 * Separa hallazgos conocidos del baseline de nuevas violaciones estructurales.
 */
export function generateContractsReport(
  structuralResult: StructuralComparisonResult,
  roundTripResults: RoundTripResult[],
  nonMutationStatus: NonMutationStatus,
  phase3NegativeResult: Phase3NegativeTestResult
): boolean {
  console.log('=== CMS CONTRACTS PARITY & ROUND-TRIP GATE ===\n');

  // Calcular dinámicamente las expectativas desde baseline
  let expectedTotalRoutes = 0;
  let expectedSafe = 0;
  let expectedBlocked = 0;
  let expectedPending = 0;

  for (const baselineField of Object.values(CONTRACT_BASELINE_FIELDS)) {
    expectedTotalRoutes++;
    if (baselineField.state === 'safe') expectedSafe++;
    if (baselineField.state === 'blocked') expectedBlocked++;
    if (baselineField.state === 'pending') expectedPending++;
  }

  // 1. Resumen Global
  console.log('--- 1. SUMMARY OF CONTRACTUAL FIELD ROUTES ---');
  console.log(`Total Contractual Routes: ${structuralResult.totalRoutes} (${expectedTotalRoutes} expected dynamically from baseline)`);
  console.log(`- Safe Routes:            ${structuralResult.safeCount} (${expectedSafe} expected)`);
  console.log(`- Blocked Routes:         ${structuralResult.blockedCount} (${expectedBlocked} expected)`);
  console.log(`- Pending Routes:         ${structuralResult.pendingCount} (${expectedPending} expected)`);
  const baselineBlockedCount = Object.values(CONTRACT_BASELINE_FIELDS).filter((b) => b.state === 'blocked').length;
  const baselinePendingCount = Object.values(CONTRACT_BASELINE_FIELDS).filter((b) => b.state === 'pending').length;
  console.log(`- Known Baseline Findings: ${structuralResult.knownFindings.length} documented (${baselineBlockedCount} blocked, ${baselinePendingCount} pending)`);
  console.log(`- New Violations:          ${structuralResult.violations.length} observed\n`);

  if (structuralResult.violations.length > 0) {
    console.error(`FAIL: ${structuralResult.violations.length} NEW VIOLATIONS OBSERVED:`);
    for (const v of structuralResult.violations) {
      console.error(`  - [${v.layer}] ${v.documentId ? v.documentId + ': ' : ''}${v.reason}`);
    }
    console.log('');
  }

  // 2. Cobertura de Documentos y Fixtures
  console.log('--- 2. DOCUMENT & FIXTURE COVERAGE ---');
  console.log(`- Real Documents Evaluated:     ${structuralResult.realDocsCount}`);
  console.log(`- Synthetic Fixtures Evaluated: ${structuralResult.syntheticFixturesCount}`);
  console.log(`- Routes Observed in Real JSON: ${structuralResult.realCoverageCount}`);
  console.log(`- Routes Observed in Synthetic: ${structuralResult.syntheticCoverageCount}`);
  console.log(`- Contractual Routes Uncovered: ${structuralResult.uncoveredCount}\n`);

  // 3. Desglose por Familia Editorial
  console.log('--- 3. BREAKDOWN BY EDITORIAL FAMILY & SLICE ASSIGNMENT ---');

  const familyGroups = [
    {
      name: '3.1 HomePage & GlobalSettings (Slice D)',
      models: ['HomePage', 'GlobalSettings'],
    },
    {
      name: '3.2 Tratamiento & TreatmentProfessional (Slice C)',
      models: ['Tratamiento', 'TreatmentProfessional'],
    },
    {
      name: '3.3 CasoClinico (Slice C)',
      models: ['CasoClinico'],
    },
    {
      name: '3.4 Articulo & Nested Objects (Slice B)',
      models: [
        'Articulo',
        'ArticleImage',
        'ArticleSource',
        'ArticleDownload',
        'ArticleCaseSummarySection',
        'ArticleCaseFact',
        'ArticleCaseApproach',
        'ArticleTextSection',
        'ArticleListSection',
        'ArticleComparisonSection',
        'ArticleComparisonRow',
        'ArticleStatsSection',
        'ArticleStat',
        'ArticleGallerySection',
        'ArticleFaqSection',
        'ArticleFaqItem',
        'ArticleQuoteSection',
        'ArticleCtaSection',
      ],
    },
    {
      name: '3.5 Instruccion & Nested Objects (Slice B)',
      models: [
        'Instruccion',
        'InstructionImage',
        'InstructionResourceGallery',
        'InstructionStepsSection',
        'InstructionMatrixSection',
        'InstructionMatrixGroup',
        'InstructionNoticeSection',
        'InstructionTextSection',
      ],
    },
  ];

  for (const group of familyGroups) {
    let safe = 0;
    let blocked = 0;
    let pending = 0;

    for (const modelName of group.models) {
      const counts = structuralResult.modelClassifications[modelName];
      if (counts) {
        safe += counts.safe;
        blocked += counts.blocked;
        pending += counts.pending;
      }
    }
    console.log(`* ${group.name}: ${safe} safe, ${blocked} blocked, ${pending} pending`);
  }
  console.log('');

  // 4. Casos Negativos de Fase 3
  console.log('--- 4. PHASE 3 NEGATIVE TESTS SUITE ---');
  if (phase3NegativeResult.success) {
    console.log(`- Phase 3 Negative Tests: PASSED (${phase3NegativeResult.passedCases}/${phase3NegativeResult.totalCases} negative cases correctly caught)\n`);
  } else {
    console.error(`FAIL: Phase 3 Negative Tests FAILED (${phase3NegativeResult.passedCases}/${phase3NegativeResult.totalCases} passed):`);
    for (const err of phase3NegativeResult.errors) {
      console.error(`  - ${err}`);
    }
    console.log('');
  }

  // 5. In-Memory Semantic Round-Trip
  console.log('--- 5. IN-MEMORY SEMANTIC ROUND-TRIP ---');
  let roundTripSuccessCount = 0;
  let totalPreservedFields = 0;

  for (const rt of roundTripResults) {
    if (rt.success) {
      roundTripSuccessCount++;
      totalPreservedFields += rt.preservedFields;
    } else {
      console.error(`FAIL: Round-trip failed for fixture '${rt.fixtureId}' (${rt.model}):`);
      for (const diff of rt.differences) {
        console.error(`  - ${diff}`);
      }
    }
  }

  console.log(`- Round-Trip Status: ${roundTripSuccessCount}/${roundTripResults.length} fixtures passed cleanly`);
  console.log(`- Total Preserved Fields: ${totalPreservedFields} fields preserved without loss\n`);

  // 6. Guardia de No Mutación sobre src/data
  console.log('--- 6. SRC/DATA NON-MUTATION GUARD ---');
  if (nonMutationStatus.success) {
    console.log(`- Non-Mutation Status: PASSED (${nonMutationStatus.checkedFilesCount} files verified intact in src/data)\n`);
  } else {
    console.error(`FAIL: Non-Mutation Guard FAILED! Files were mutated in src/data:`);
    for (const file of nonMutationStatus.mutatedFiles) {
      console.error(`  - ${file}`);
    }
    console.log('');
  }

  // Evaluar éxito total del gate
  const isDocumentsPresent = structuralResult.realDocsCount > 0 && structuralResult.syntheticFixturesCount > 0;
  const isParityExact =
    structuralResult.totalRoutes === expectedTotalRoutes &&
    structuralResult.safeCount === expectedSafe &&
    structuralResult.blockedCount === expectedBlocked &&
    structuralResult.pendingCount === expectedPending &&
    structuralResult.uncoveredCount === 0 &&
    structuralResult.violations.length === 0;

  const isRoundTripClean = roundTripSuccessCount === roundTripResults.length;
  const isNonMutationClean = nonMutationStatus.success;
  const isPhase3NegativesClean = phase3NegativeResult.success;

  if (isDocumentsPresent && isParityExact && isRoundTripClean && isNonMutationClean && isPhase3NegativesClean) {
    console.log('=====================================================');
    console.log('SUCCESS: CMS Contracts Gate PASSED cleanly.');
    console.log(`Dynamic baseline match: ${structuralResult.totalRoutes} routes (${structuralResult.safeCount} safe, ${structuralResult.blockedCount} blocked, ${structuralResult.pendingCount} pending).`);
    console.log('0 violations, full coverage, round-trip, negative cases, and non-mutation verified.');
    console.log('=====================================================');
    return true;
  } else {
    console.error('=====================================================');
    console.error('FAIL: CMS Contracts Gate FAILED.');
    if (!isDocumentsPresent) {
      console.error('- Missing evaluation documents.');
    }
    if (structuralResult.violations.length > 0) {
      console.error(`- ${structuralResult.violations.length} new structural violations detected.`);
    }
    if (!isParityExact) {
      console.error(
        `- Parity or coverage mismatch: expected ${expectedTotalRoutes} routes (${expectedSafe} safe, ${expectedBlocked} blocked, ${expectedPending} pending), got ${structuralResult.totalRoutes} (${structuralResult.safeCount} safe, ${structuralResult.blockedCount} blocked, ${structuralResult.pendingCount} pending, ${structuralResult.uncoveredCount} uncovered)`
      );
    }
    if (!isRoundTripClean) {
      console.error('- Round-trip errors detected.');
    }
    if (!isNonMutationClean) {
      console.error('- src/data mutation detected.');
    }
    if (!isPhase3NegativesClean) {
      console.error('- Phase 3 negative test cases failed.');
    }
    console.error('=====================================================');
    return false;
  }
}
