import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { instructionImageFields, validatePublicAssetReference } from './fields';

const instructionPath = path.join(
  process.cwd(),
  'src',
  'data',
  'instrucciones',
  'ortodoncia',
  'indicaciones-alineadores-keepsmiling.json'
);
const instruction = JSON.parse(fs.readFileSync(instructionPath, 'utf8')) as {
  resourceGallery?: { images?: Array<{ downloadSrc?: string }> };
};

const downloadField = instructionImageFields.find((field) => field.name === 'downloadSrc');
assert.equal(downloadField?.type, 'string', 'Los MP4 deben ser referencias, no campos image/upload.');

const mp4References =
  instruction.resourceGallery?.images
    ?.map((image) => image.downloadSrc)
    .filter((source): source is string => Boolean(source?.endsWith('.mp4'))) ?? [];

assert.equal(mp4References.length, 2, 'Se esperaban las dos referencias MP4 aprobadas.');

for (const reference of mp4References) {
  assert.equal(validatePublicAssetReference(reference), undefined, reference);
  const absolutePath = path.join(process.cwd(), 'public', reference.replace(/^\//, ''));
  assert.equal(fs.existsSync(absolutePath), true, `No existe ${reference}.`);
  const header = fs.readFileSync(absolutePath).subarray(0, 32).toString('ascii');
  assert.match(header, /ftyp/, `${reference} no presenta cabecera MP4/ISO BMFF.`);
}

for (const unsafeReference of [
  '../secreto.mp4',
  '/videos/../../secreto.mp4',
  'https://ejemplo.com/video.mp4',
  '/videos/programa.exe',
]) {
  assert.notEqual(
    validatePublicAssetReference(unsafeReference),
    undefined,
    `${unsafeReference} debe quedar bloqueada.`
  );
}

console.log('--- Tina media boundary ---');
console.log(`- MP4 Git-backed verificados: ${mp4References.length}`);
console.log('- Carga MP4: deshabilitada en el media manager; ingreso por referencia pública controlada.');
console.log('- Traversal, URL externa y extensión fuera de rutas autorizadas: bloqueadas.');
