import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  getTratamientoById,
  loadTreatment,
} from './tratamientos.ts';
import { getTreatmentProfessionalMobileRole } from '../lib/treatment-professionals.ts';

test('usa el rol mobile explicito sin modificar el rol completo', () => {
  const tratamiento = getTratamientoById('estetica-dental');
  const professional = tratamiento?.professionals?.find(({ name }) => name.includes('Roberto'));

  assert.ok(professional);
  assert.equal(getTreatmentProfessionalMobileRole(professional), 'Rehabilitación oral y estética dental');
  assert.equal(
    professional.role,
    'Especialista en Rehabilitación Oral (Implantes y Prótesis) y Estética Dental',
  );
});

test('compacta tambien el segundo hero con dos profesionales', () => {
  const tratamiento = getTratamientoById('pediatria');
  const professional = tratamiento?.professionals?.find(({ name }) => name.includes('María Emilia'));

  assert.ok(professional);
  assert.equal(getTreatmentProfessionalMobileRole(professional), 'Atención infantil');
  assert.equal(professional.role, 'Atención odontológica infantil');
});

test('reutiliza el rol completo cuando mobileRole no esta declarado', () => {
  const tratamiento = getTratamientoById('endodoncia');
  const professional = tratamiento?.professionals?.[0];

  assert.ok(professional);
  assert.equal(getTreatmentProfessionalMobileRole(professional), professional.role);
});

test('rechaza un mobileRole presente pero vacio', (context) => {
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'odonto-pau-treatment-'));
  const treatmentPath = path.join(temporaryDirectory, 'invalid-treatment.json');
  context.after(() => fs.rmSync(temporaryDirectory, { recursive: true, force: true }));

  fs.writeFileSync(treatmentPath, JSON.stringify({
    professionals: [{
      name: 'Profesional de prueba',
      role: 'Rol confirmado',
      mobileRole: '   ',
      image: '/images/profesionales/prueba.webp',
      imageAlt: 'Retrato de profesional de prueba',
    }],
  }));

  assert.throws(
    () => loadTreatment(treatmentPath),
    /professionals\[0\]\.mobileRole debe ser un texto no vacio/,
  );
});
