import { spawnSync } from 'node:child_process';

const mode = process.argv[2];
const packageManager = 'pnpm';
const environment = { ...process.env };
const localAdminPort = environment.TINA_CLI_PORT || '4101';
const isolatedDatalayerPort = environment.TINA_DATALAYER_PORT || '9011';
let tinaArguments;

if (mode === 'dev') {
  environment.TINA_PUBLIC_IS_LOCAL = 'true';
  tinaArguments = [
    'exec',
    'tinacms',
    'dev',
    '--noTelemetry',
    '--port',
    localAdminPort,
    '-c',
    process.platform === 'win32' ? '"next dev"' : 'next dev',
  ];
} else if (mode === 'schema') {
  environment.TINA_PUBLIC_IS_LOCAL = 'true';
  environment.NEXT_PUBLIC_TINA_CLIENT_ID =
    environment.NEXT_PUBLIC_TINA_CLIENT_ID || 'local-schema-only';
  environment.TINA_TOKEN = environment.TINA_TOKEN || 'local-schema-only';
  tinaArguments = [
    'exec',
    'tinacms',
    'build',
    '--skip-indexing',
    '--skip-cloud-checks',
    '--noTelemetry',
    '--datalayer-port',
    isolatedDatalayerPort,
  ];
} else if (mode === 'audit') {
  environment.TINA_PUBLIC_IS_LOCAL = 'true';
  tinaArguments = [
    'exec',
    'tinacms',
    'audit',
    '--noTelemetry',
    '--datalayer-port',
    isolatedDatalayerPort,
  ];
} else if (mode === 'lock') {
  environment.TINA_PUBLIC_IS_LOCAL = 'true';
  environment.NEXT_PUBLIC_TINA_CLIENT_ID =
    environment.NEXT_PUBLIC_TINA_CLIENT_ID || 'local-schema-only';
  environment.TINA_TOKEN = environment.TINA_TOKEN || 'local-schema-only';
  tinaArguments = [
    'exec',
    'tinacms',
    'dev',
    '--no-server',
    '--noWatch',
    '--noTelemetry',
    '--port',
    localAdminPort,
    '--datalayer-port',
    isolatedDatalayerPort,
  ];
} else if (mode === 'cloud-build') {
  tinaArguments = ['exec', 'tinacms', 'build', '--noTelemetry'];
} else {
  console.error('Uso: node scripts/run-tina.mjs <dev|schema|audit|lock|cloud-build>');
  process.exit(2);
}

const result = spawnSync(packageManager, tinaArguments, {
  cwd: process.cwd(),
  env: environment,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
