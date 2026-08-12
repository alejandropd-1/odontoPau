import { runEquivalenceAndCoherenceTest } from './equivalence-test';
import { loadRealJsonDocuments, getSyntheticFixtures } from './fixtures';
import { compareStructuralContracts } from './structural-comparator';
import {
  getSrcDataFilesHashes,
  verifySrcDataNonMutation,
  executeInMemRoundTrip,
} from './roundtrip';
import { runPhase3NegativeTests } from './phase3-negative-tests';
import { generateContractsReport } from './reporter';

export function runFullCmsContractsValidation(): void {
  // 1. Ejecutar prueba de equivalencia, coherencia y casos negativos de Checkpoint 2
  runEquivalenceAndCoherenceTest();

  // 2. Ejecutar suite de 17 casos negativos sintéticos de Fase 3
  const phase3NegativeResult = runPhase3NegativeTests();

  // 3. Registrar estado inicial de hashes en src/data (Guardia de no mutación)
  const beforeHashes = getSrcDataFilesHashes();

  // 4. Cargar documentos reales y fixtures sintéticos no clínicos
  const realDocs = loadRealJsonDocuments();
  const syntheticFixtures = getSyntheticFixtures();
  const allFixtures = [...realDocs, ...syntheticFixtures];

  // 5. Ejecutar comparación estructural recursiva
  const structuralResult = compareStructuralContracts(allFixtures);

  // 6. Ejecutar prueba de round-trip semántico en memoria
  const roundTripResults = executeInMemRoundTrip(allFixtures);

  // 7. Verificar guardia de no mutación sobre src/data
  const nonMutationStatus = verifySrcDataNonMutation(beforeHashes);

  // 8. Generar reporte determinista y evaluar éxito del gate
  const success = generateContractsReport(
    structuralResult,
    roundTripResults,
    nonMutationStatus,
    phase3NegativeResult
  );

  if (!success) {
    process.exit(1);
  }
}

// Ejecución directa por CLI
runFullCmsContractsValidation();
