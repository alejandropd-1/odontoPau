import assert from 'node:assert/strict';
import { test } from 'node:test';
import { injectEditorialSupportHtml } from './tina-admin-support-html.mjs';

test('startup support is static, idempotent and keeps the authorized contacts', () => {
  const input = '<!doctype html><html><body><div id="root"></div></body></html>';
  const result = injectEditorialSupportHtml(input);
  assert.match(result, /aria-label="Ayuda del editor"/);
  assert.match(result, /mailto:admin@useodontopro\.com/);
  assert.match(result, /https:\/\/wa\.me\/541160513261/);
  assert.doesNotMatch(result, /<script/i);
  assert.equal(injectEditorialSupportHtml(result), result);
  assert.equal(result.match(/odonto-editorial-support/g)?.length, 1);
});

test('startup support refuses malformed admin HTML', () => {
  assert.throws(() => injectEditorialSupportHtml('<div>missing body</div>'), /EDITORIAL_ADMIN_HTML/);
});
