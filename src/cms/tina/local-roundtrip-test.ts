import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { validateArticleDocument } from '../../data/articulos';
import { validateInstructionDocument } from '../../data/instrucciones';

const endpoint = process.env.TINA_LOCAL_GRAPHQL_URL || 'http://localhost:4101/graphql';
const auditFolder = '__cms-audit__';
const articleRelativePath = `${auditFolder}/articulo-sintetico-cms.json`;
const instructionRelativePath = `${auditFolder}/instruccion-sintetica-cms.json`;
const articlePath = path.join(process.cwd(), 'src', 'data', 'articulos', articleRelativePath);
const instructionPath = path.join(
  process.cwd(),
  'src',
  'data',
  'instrucciones',
  instructionRelativePath
);

function dataSnapshot(): string {
  const roots = [
    path.join(process.cwd(), 'src', 'data', 'articulos'),
    path.join(process.cwd(), 'src', 'data', 'instrucciones'),
  ];
  const hash = crypto.createHash('sha256');

  function visit(directory: string): void {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      if (entry.isFile()) {
        hash.update(path.relative(process.cwd(), absolutePath).replace(/\\/g, '/'));
        hash.update(fs.readFileSync(absolutePath));
      }
    }
  }

  roots.forEach(visit);
  return hash.digest('hex');
}

async function graphql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  assert.equal(response.ok, true, `Tina local respondió HTTP ${response.status}.`);
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  assert.equal(payload.errors, undefined, payload.errors?.map((error) => error.message).join('\n'));
  assert.ok(payload.data, 'Tina local no devolvió data.');
  return payload.data;
}

const createArticleMutation = `
  mutation CreateSyntheticArticle($relativePath: String!, $params: ArticuloMutation!) {
    createArticulo(relativePath: $relativePath, params: $params) { title status }
  }
`;

const createInstructionMutation = `
  mutation CreateSyntheticInstruction($relativePath: String!, $params: InstruccionMutation!) {
    createInstruccion(relativePath: $relativePath, params: $params) { title status }
  }
`;

const updateArticleMutation = `
  mutation UpdateSyntheticArticle($relativePath: String!, $params: ArticuloMutation!) {
    updateArticulo(relativePath: $relativePath, params: $params) { title excerpt }
  }
`;

const deleteDocumentMutation = `
  mutation DeleteSyntheticDocument($collection: String!, $relativePath: String!) {
    deleteDocument(collection: $collection, relativePath: $relativePath) { __typename }
  }
`;

const now = '2026-08-12T16:00:00.000Z';
const articleParams = {
  type: 'Articulo',
  internalId: 'articulo-sintetico-cms',
  slug: 'articulo-sintetico-cms',
  category: 'endodoncia',
  categoryLabel: 'Endodoncia',
  serviceIds: ['endodoncia'],
  title: 'Artículo sintético de auditoría CMS',
  excerpt: 'Contenido ficticio creado únicamente para verificar el circuito local de Tina.',
  author: 'Auditoría automatizada',
  status: 'draft',
  createdAt: now,
  updatedAt: now,
  readTime: '1 min de lectura',
  tags: ['auditoria-cms'],
  heroImage: {
    src: '/images/hero-bg.png',
    alt: 'Imagen genérica utilizada para una prueba sintética del CMS',
    width: 1600,
    height: 900,
  },
  sections: [
    {
      text: {
        text_title: 'Sección sintética',
        text_paragraphs: ['Este texto no contiene información clínica ni se publica.'],
      },
    },
  ],
};

const instructionParams = {
  type: 'Instruccion',
  internalId: 'instruccion-sintetica-cms',
  slug: 'instruccion-sintetica-cms',
  category: 'endodoncia',
  categoryLabel: 'Endodoncia',
  serviceId: 'endodoncia',
  title: 'Instrucción sintética de auditoría CMS',
  excerpt: 'Contenido ficticio creado únicamente para verificar el circuito local de Tina.',
  status: 'draft',
  createdAt: now,
  updatedAt: now,
  tags: ['auditoria-cms'],
  readTime: '1 min de lectura',
  sections: [
    {
      text: {
        text_title: 'Texto sintético',
        text_paragraphs: ['Esta instrucción es ficticia y se elimina al finalizar la prueba.'],
      },
    },
  ],
};

async function deleteIfPresent(collection: string, relativePath: string, absolutePath: string): Promise<void> {
  if (!fs.existsSync(absolutePath)) return;
  await graphql(deleteDocumentMutation, { collection, relativePath });
}

async function run(): Promise<void> {
  await deleteIfPresent('articulo', articleRelativePath, articlePath);
  await deleteIfPresent('instruccion', instructionRelativePath, instructionPath);
  const before = dataSnapshot();

  try {
    await graphql(createArticleMutation, {
      relativePath: articleRelativePath,
      params: articleParams,
    });
    await graphql(createInstructionMutation, {
      relativePath: instructionRelativePath,
      params: instructionParams,
    });

    const article = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
    const instruction = JSON.parse(fs.readFileSync(instructionPath, 'utf8'));
    validateArticleDocument(article, articleRelativePath);
    validateInstructionDocument(instruction, instructionRelativePath);
    assert.equal(article.sections[0].type, 'text');
    assert.equal(instruction.sections[0].type, 'text');

    const editedExcerpt = 'Edición sintética verificada mediante la API local de Tina.';
    await graphql(updateArticleMutation, {
      relativePath: articleRelativePath,
      params: { ...articleParams, excerpt: editedExcerpt },
    });
    const editedArticle = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
    assert.equal(editedArticle.excerpt, editedExcerpt);
    validateArticleDocument(editedArticle, articleRelativePath);
  } finally {
    await deleteIfPresent('articulo', articleRelativePath, articlePath);
    await deleteIfPresent('instruccion', instructionRelativePath, instructionPath);
    for (const directory of [path.dirname(articlePath), path.dirname(instructionPath)]) {
      if (fs.existsSync(directory) && fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
    }
  }

  assert.equal(dataSnapshot(), before, 'La prueba local dejó mutaciones en src/data.');
  console.log('--- Tina local create/edit/recovery ---');
  console.log('- Artículo sintético: creado, validado, editado y eliminado.');
  console.log('- Instrucción sintética: creada, validada y eliminada.');
  console.log('- src/data antes/después: idéntico (SHA-256).');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
