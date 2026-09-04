// Browser viability matrix against the generated admin. All remote traffic is intercepted.
async (page) => {
  const origin = 'http://127.0.0.1:3199';
  const schema = await (await page.request.get(origin + '/lab-schema.json')).json();
  let scenario = 'bootstrap';
  let requests = [];
  let pageErrors = [];

  const refreshedAccessToken = 'fixture.eyJleHAiOjQxMDI0NDQ4MDAsImlzcyI6Imh0dHBzOi8vYXV0aC1maXh0dXJlLmV4YW1wbGUvcmVmcmVzaCIsImNsaWVudF9pZCI6ImZpeHR1cmUifQ==.fixture';

  await page.goto(origin + '/admin/index.html');
  await page.unroute('**/*');
  page.removeAllListeners('pageerror');
  page.on('pageerror', (error) => pageErrors.push(error.message.slice(0, 180)));
  await page.route('**/*', async (route) => {
    const request = route.request();
    const parts = request.url().match(/^(https?:\/\/([^/]+))([^?]*)(.*)$/);
    if (!parts) return route.abort('blockedbyclient');
    const url = { origin: parts[1], host: parts[2], pathname: parts[3], search: parts[4] };
    if (url.origin === origin && url.pathname.startsWith('/admin/')) return route.continue();
    requests.push({ host: url.host, path: url.pathname + url.search, method: request.method() });

    if (url.host === 'auth-fixture.example') {
      if (scenario !== 'refresh-success' || request.method() !== 'POST') {
        return route.fulfill({ status: 401, json: { error: 'fixture' } });
      }
      return route.fulfill({ json: { AuthenticationResult: {
        AccessToken: refreshedAccessToken,
        IdToken: 'refreshed-id-token',
      } } });
    }

    if (url.host === 'identity.tinajs.io') {
      if (scenario === 'identity-timeout') return route.abort('timedout');
      if (url.pathname.endsWith('/currentUser')) {
        if (!request.headers().authorization) return route.fulfill({ status: 401, json: { error: 'fixture' } });
        if (scenario === 'identity-401') return route.fulfill({ status: 401, json: { error: 'fixture' } });
        return route.fulfill({ json: { id: 'fixture-user', name: 'Fixture' } });
      }
      if (scenario === 'expired') return route.fulfill({ status: 401, json: { error: 'fixture' } });
      return route.fulfill({ json: { features: [], billingState: 'current' } });
    }
    if (url.pathname.includes('/events/')) return route.fulfill({ json: { events: [] } });
    if (url.pathname.includes('/content/')) {
      const query = request.postDataJSON()?.query || '';
      if (scenario === 'content-403') {
        return route.fulfill({ status: 403, json: { message: 'EDITORIAL_PERMISSION' } });
      }
      if (scenario === 'schema-failure' && query.includes('__schema')) {
        return route.fulfill({ status: 502, json: { message: 'EDITORIAL_UNAVAILABLE' } });
      }
      if (query.includes('__schema')) return route.fulfill({ json: schema });
      if (query.includes('OdontoPauEditorialDashboard')) return route.fulfill({ json: { data: {
        articuloConnection: { totalCount: 0, edges: [] },
        instruccionConnection: { totalCount: 0, edges: [] },
        tratamientoConnection: { totalCount: 0 }, publicationrequest: null,
      } } });
      if (query.includes('OdontoPauEditorialPublicationHistory')) {
        return route.fulfill({ json: { data: { publicationrequest: null } } });
      }
      return route.fulfill({ json: { errors: [{ message: 'Unsupported fixture query' }] } });
    }
    return route.abort('blockedbyclient');
  });

  async function setSession(kind) {
    await page.evaluate((sessionKind) => {
      localStorage.clear();
      if (sessionKind === 'absent') return;
      const payloads = {
        valid: 'eyJleHAiOjQxMDI0NDQ4MDAsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MzE5OSIsImNsaWVudF9pZCI6ImZpeHR1cmUifQ==',
        expired: 'eyJleHAiOjEsImlzcyI6Imh0dHA6Ly8xMjcuMC4wLjE6MzE5OSIsImNsaWVudF9pZCI6ImZpeHR1cmUifQ==',
        refreshable: 'eyJleHAiOjEsImlzcyI6Imh0dHBzOi8vYXV0aC1maXh0dXJlLmV4YW1wbGUvcmVmcmVzaCIsImNsaWVudF9pZCI6ImZpeHR1cmUifQ==',
      };
      const jwt = 'fixture.' + payloads[sessionKind] + '.fixture';
      localStorage.setItem('tinacms-auth', JSON.stringify({
        access_token: jwt, id_token: 'synthetic-session', refresh_token: 'fixture',
      }));
    }, kind);
  }

  async function supportEvidence() {
    const supportRegion = page.getByRole('complementary', { name: 'Ayuda del editor', exact: true });
    const summary = supportRegion.locator('summary');
    await summary.waitFor({ state: 'visible', timeout: 15000 });
    await summary.focus();
    await page.keyboard.press('Enter');
    const mail = supportRegion.getByRole('link', { name: 'Enviar un correo a Alejandro', exact: true });
    const whatsapp = supportRegion.getByRole('link', { name: 'Escribir por WhatsApp', exact: true });
    await mail.waitFor({ state: 'visible' });
    return {
      mail: await mail.getAttribute('href'), whatsapp: await whatsapp.getAttribute('href'),
      activeElement: await page.evaluate(() => document.activeElement?.tagName),
    };
  }

  async function run(name, sessionKind, expected) {
    scenario = name;
    requests = [];
    pageErrors = [];
    await setSession(sessionKind);
    await page.goto('about:blank');
    await page.goto(origin + '/admin/index.html#/screens/panel_editorial');
    await expected();
    const support = await supportEvidence();
    const result = {
      name, support, requests: [...requests], errors: [...pageErrors],
      dashboard: await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).count(),
      localEdit: await page.getByText('When you save, changes will be saved to the local filesystem.').count(),
    };
    await page.locator('.editorial-support details').evaluate((details) => { details.open = false; });
    return result;
  }

  const report = [];
  report.push(await run('absent', 'absent', async () => {
    await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ timeout: 15000 });
  }));
  report.push(await run('valid', 'valid', async () => {
    await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).waitFor({ timeout: 20000 });
  }));
  report.push(await run('expired', 'expired', async () => {
    await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ timeout: 15000 });
  }));
  report.push(await run('refresh-success', 'refreshable', async () => {
    await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).waitFor({ timeout: 20000 });
  }));
  report.push(await run('identity-401', 'valid', async () => {
    await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ timeout: 15000 });
  }));
  report.push(await run('content-403', 'valid', async () => {
    await page.waitForTimeout(1500);
  }));
  report.push(await run('identity-timeout', 'valid', async () => {
    await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ timeout: 15000 });
  }));
  report.push(await run('schema-failure', 'valid', async () => {
    await page.waitForTimeout(1500);
  }));
  report.push(await run('recovered', 'valid', async () => {
    await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).waitFor({ timeout: 20000 });
  }));
  scenario = 'logout';
  requests = [];
  pageErrors = [];
  await setSession('valid');
  await page.goto('about:blank');
  await page.goto(origin + '/admin/index.html#/screens/panel_editorial');
  await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).waitFor({ timeout: 20000 });
  await page.getByRole('button', { name: 'Open navigation menu', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Log Out', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ timeout: 15000 });
  report.push({
    name: 'logout', support: await supportEvidence(), requests: [...requests], errors: [...pageErrors],
    dashboard: await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).count(),
    localEdit: await page.getByText('When you save, changes will be saved to the local filesystem.').count(),
    storedSession: await page.evaluate(() => localStorage.getItem('tinacms-auth')),
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'output/playwright/tina-base-support-mobile.png' });
  return report;
}
