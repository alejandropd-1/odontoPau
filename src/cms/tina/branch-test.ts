import assert from 'node:assert/strict';

import {
  assertNonProductionTinaBranch,
  assertTinaCloudConfiguration,
  isEditorialPublicationBranch,
  resolveTinaBranch,
} from './branch';

assert.deepEqual(
  resolveTinaBranch({ TINA_PUBLIC_IS_LOCAL: 'true' }),
  { branch: 'local', mode: 'local', source: 'local-sentinel' }
);

assert.deepEqual(
  resolveTinaBranch({
    TINA_PUBLIC_IS_LOCAL: 'false',
    NEXT_PUBLIC_TINA_BRANCH: 'change/editorial-piloto',
    HEAD: 'otra-rama',
  }),
  {
    branch: 'change/editorial-piloto',
    mode: 'remote',
    source: 'NEXT_PUBLIC_TINA_BRANCH',
  }
);

assert.deepEqual(
  resolveTinaBranch({ TINA_PUBLIC_IS_LOCAL: 'false', HEAD: 'deploy-preview-42' }),
  { branch: 'deploy-preview-42', mode: 'remote', source: 'HEAD' }
);

for (const productionBranch of ['main', 'master', ' refs/heads/main ']) {
  assert.throws(
    () => assertNonProductionTinaBranch(productionBranch),
    /rama productiva/,
    `La rama ${productionBranch} debe quedar bloqueada.`
  );
}

assert.throws(
  () => resolveTinaBranch({ TINA_PUBLIC_IS_LOCAL: 'false' }),
  /rama explicita/,
  'El modo remoto no debe inventar una rama por defecto.'
);

assert.equal(isEditorialPublicationBranch('editorial/tina'), true);
assert.equal(isEditorialPublicationBranch(' refs/heads/editorial/tina '), true);
assert.equal(isEditorialPublicationBranch('change/validar-operacion-editorial-tina-en-produccion'), false);
assert.equal(isEditorialPublicationBranch('deploy-preview-14'), false);

assert.doesNotThrow(() =>
  assertTinaCloudConfiguration({
    TINA_PUBLIC_IS_LOCAL: 'false',
    NEXT_PUBLIC_TINA_BRANCH: 'change/editorial-piloto',
    NEXT_PUBLIC_TINA_CLIENT_ID: 'public-client-id-de-prueba',
  })
);

assert.throws(
  () =>
    assertTinaCloudConfiguration({
      TINA_PUBLIC_IS_LOCAL: 'false',
      NEXT_PUBLIC_TINA_BRANCH: 'change/editorial-piloto',
    }),
  /NEXT_PUBLIC_TINA_CLIENT_ID/
);

console.log(
  'Tina branch guard: configuracion publica valida, token server-only, main/master bloqueadas, sin fallback remoto y publicacion limitada a editorial/tina.'
);
