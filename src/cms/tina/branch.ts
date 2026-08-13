export const PRODUCTION_BRANCHES = new Set(['main', 'master']);

export const TINA_EDITORIAL_BRANCH_ENV = 'NEXT_PUBLIC_TINA_BRANCH';
export const NETLIFY_BRANCH_ENV = 'HEAD';

export interface TinaBranchEnvironment {
  [name: string]: string | undefined;
  NEXT_PUBLIC_TINA_BRANCH?: string;
  HEAD?: string;
  TINA_PUBLIC_IS_LOCAL?: string;
}

export interface TinaBranchResolution {
  branch: string;
  mode: 'local' | 'remote';
  source: typeof TINA_EDITORIAL_BRANCH_ENV | typeof NETLIFY_BRANCH_ENV | 'local-sentinel';
}

function normalizeBranch(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/^refs\/heads\//, '');
  return normalized || undefined;
}

export function assertNonProductionTinaBranch(branch: string): string {
  const normalized = normalizeBranch(branch);

  if (!normalized) {
    throw new Error(
      `Tina remoto requiere una rama explicita en ${TINA_EDITORIAL_BRANCH_ENV} o ${NETLIFY_BRANCH_ENV}.`
    );
  }

  if (PRODUCTION_BRANCHES.has(normalized.toLowerCase())) {
    throw new Error(
      `Tina no puede escribir en la rama productiva '${normalized}'. Configura una rama editorial no productiva.`
    );
  }

  return normalized;
}

export function resolveTinaBranch(
  environment: TinaBranchEnvironment = process.env
): TinaBranchResolution {
  const isLocal = environment.TINA_PUBLIC_IS_LOCAL === 'true';
  const explicitBranch = normalizeBranch(environment.NEXT_PUBLIC_TINA_BRANCH);
  const netlifyBranch = normalizeBranch(environment.HEAD);

  if (isLocal && !explicitBranch && !netlifyBranch) {
    return {
      branch: 'local',
      mode: 'local',
      source: 'local-sentinel',
    };
  }

  const branch = assertNonProductionTinaBranch(explicitBranch ?? netlifyBranch ?? '');

  return {
    branch,
    mode: isLocal ? 'local' : 'remote',
    source: explicitBranch ? TINA_EDITORIAL_BRANCH_ENV : NETLIFY_BRANCH_ENV,
  };
}

export function assertTinaCloudConfiguration(
  environment: TinaBranchEnvironment = process.env
): void {
  const resolution = resolveTinaBranch(environment);

  if (resolution.mode === 'local') {
    return;
  }

  const missing = ['NEXT_PUBLIC_TINA_CLIENT_ID', 'TINA_TOKEN'].filter(
    (name) => !environment[name]?.trim()
  );

  if (missing.length > 0) {
    throw new Error(`Configuracion TinaCloud incompleta: faltan ${missing.join(', ')}.`);
  }
}
