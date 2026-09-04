// CLI-only browser fixture, with all external traffic intercepted. No real sessions or writes.
async (page) => {
  await page.goto('about:blank');
  await page.unroute('**/*');
  const origin = 'http://127.0.0.1:3199';
  const schemaResponse = await page.request.get(origin + '/lab-schema.json');
  const schema = await schemaResponse.json();
  const requests = [];
  const failures = [];
  page.removeAllListeners('pageerror');
  page.on('pageerror', (error) => failures.push(error.message.slice(0, 160)));
  let identityStatus = 200;
  await page.route('**/*', async (route) => {
    const req = route.request();
    const parts = req.url().match(/^(https?:\/\/([^/]+))([^?]*)(.*)$/);
    if (!parts) return route.abort('blockedbyclient');
    const url = { origin: parts[1], host: parts[2], pathname: parts[3], search: parts[4] };
    if (url.pathname.includes('/content/') || url.pathname.includes('/events/')) {
      requests.push({ path: url.pathname + url.search, method: req.method(), host: url.host });
      if (url.pathname.includes('/events/')) return route.fulfill({ json: { events: [] } });
      const query = req.postDataJSON()?.query || '';
      if (query.includes('__schema')) return route.fulfill({ json: schema });
      if (query.includes('OdontoPauEditorialDashboard')) return route.fulfill({ json: { data: {
        articuloConnection: { totalCount: 0, edges: [] }, instruccionConnection: { totalCount: 0, edges: [] },
        tratamientoConnection: { totalCount: 0 }, publicationrequest: null,
      } } });
      if (query.includes('OdontoPauEditorialPublicationHistory')) return route.fulfill({ json: { data: { publicationrequest: null } } });
      return route.fulfill({ json: { errors: [{ message: 'Unsupported fixture query' }] } });
    }
    if (url.host === 'identity.tinajs.io') {
      if (url.pathname.endsWith('/currentUser')) return route.fulfill({ status: identityStatus,
        json: identityStatus === 200 ? { id: 'fixture-user', name: 'Fixture' } : { error: 'Unauthorized fixture' } });
      return route.fulfill({ json: { features: [], billingState: 'current' } });
    }
    if (url.origin === origin) return route.continue();
    return route.abort('blockedbyclient');
  });
  await page.addInitScript(() => {
    if (location.hostname !== '127.0.0.1') return;
    const jwt = 'fixture.' + btoa(JSON.stringify({ exp: 4102444800, iss: 'http://127.0.0.1:3199', client_id: 'fixture' })) + '.fixture';
    localStorage.setItem('tinacms-auth', JSON.stringify({ access_token: jwt, id_token: 'synthetic-session', refresh_token: 'fixture' }));
  });
  await page.goto(origin + '/admin/index.html#/screens/panel_editorial');
  await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).waitFor({ timeout: 20000 });
  // SDK synchronization polls every five seconds. Observe its first actual request, not an invented caller.
  await page.waitForTimeout(6000);
  await page.screenshot({ path: 'output/playwright/tina-base-valid.png' });
  const report = [{ phase: 'valid-session', requests: [...requests], failures: [...failures] }];
  identityStatus = 401;
  await page.goto('about:blank');
  await page.goto(origin + '/admin/index.html#/screens/panel_editorial');
  await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ timeout: 15000 });
  report.push({ phase: 'rejected-session', cloudLogin: true,
    localEditText: await page.getByText('When you save, changes will be saved to the local filesystem.').count(),
    dashboardCount: await page.getByRole('heading', { name: 'Dashboard editorial', exact: true }).count() });
  await page.screenshot({ path: 'output/playwright/tina-base-login.png' });
  return report;
}
