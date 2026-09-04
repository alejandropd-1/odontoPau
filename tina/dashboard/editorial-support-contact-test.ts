import assert from 'node:assert/strict';

import type { EditorialUnavailableReason } from './editorial-dashboard-model';
import {
  buildEditorialDiagnostic,
  editorialSupportContact,
  editorialSupportMailtoHref,
  editorialSupportWhatsappHref,
  type EditorialDiagnosticOperation,
} from './editorial-support-contact';

// El número autorizado se conserva sin agregar dígitos ni prefijos.
assert.equal(editorialSupportContact.email, 'admin@useodontopro.com');
assert.equal(editorialSupportContact.whatsapp, '541160513261');
assert.match(editorialSupportWhatsappHref(), /^https:\/\/wa\.me\/541160513261\?text=/);
assert.match(editorialSupportMailtoHref(), /^mailto:admin@useodontopro\.com\?subject=/);

const diagnostic = buildEditorialDiagnostic({
  siteName: 'OdontoPau',
  incidentId: 'OP-20260904-ABC',
  operation: 'catalogo',
  reason: 'service',
  at: new Date('2026-09-04T15:05:00.000Z'),
});

assert.equal(diagnostic.split('\n').length, 5);
assert.match(diagnostic, /^Sitio: OdontoPau$/m);
assert.match(diagnostic, /04\/09\/2026, 12:05 \(America\/Argentina\/Buenos_Aires\)/);
assert.match(diagnostic, /^Operación: lectura del catálogo editorial$/m);
assert.match(diagnostic, /^Situación: el servicio de edición no respondió$/m);
assert.match(diagnostic, /^Código: OP-20260904-ABC$/m);

// Ningún diagnóstico puede arrastrar secretos, trazas ni identificadores de infraestructura.
const operations: EditorialDiagnosticOperation[] = ['catalogo', 'historial', 'publicacion'];
const reasons: EditorialUnavailableReason[] = ['session', 'permission', 'timeout', 'service'];
for (const operation of operations) {
  for (const reason of reasons) {
    const value = buildEditorialDiagnostic({
      siteName: 'OdontoPau',
      incidentId: 'OP-20260904-ABC',
      operation,
      reason,
      at: new Date('2026-09-04T15:05:00.000Z'),
    });
    assert.doesNotMatch(value, /bearer|token|cookie|authorization|graphql|mutation|query |editorial\/tina|content\.tinajs\.io|github|netlify/i);
    assert.equal(value.split('\n').length, 5);
  }
}

// El borrador viaja en el enlace, pero el envío lo decide la persona al abrirlo.
const mailto = editorialSupportMailtoHref(diagnostic);
assert.ok(mailto.includes(encodeURIComponent('OP-20260904-ABC')));
assert.ok(editorialSupportWhatsappHref(diagnostic).includes(encodeURIComponent('OP-20260904-ABC')));

console.log('--- Tina editorial support contact ---');
console.log('- Destinatarios, borradores y diagnóstico de campos cerrados: válidos.');
