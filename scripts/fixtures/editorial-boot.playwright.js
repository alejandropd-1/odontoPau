// Run with playwright-cli run-code --filename; isolated browser context only.
async (page) => {
  await page.goto('about:blank');
  await page.unroute('**/*');
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.endsWith('/api/editorial/content')) return route.abort('failed');
    if (url.startsWith('http://127.0.0.1:3199/')) return route.continue();
    if (url.includes('currentUser')) return route.fulfill({ json: { id: 'fixture-user', name: 'Fixture' } });
    if (url.includes('identity.tinajs.io')) return route.fulfill({ json: { features: [], billingState: 'current' } });
    if (url.includes('/events/')) return route.fulfill({ json: { events: [] } });
    if (url.includes('content.tinajs.io') || url.includes('/graphql')) return route.abort('failed');
    return route.abort('blockedbyclient');
  });
  await page.addInitScript(() => {
    localStorage.setItem('tina.local.isLogedIn', 'true');
    const jwt = 'fixture.' + btoa(JSON.stringify({ exp: 4102444800, iss: 'http://127.0.0.1:3199', client_id: 'fixture' })) + '.fixture';
    localStorage.setItem('tinacms-auth', JSON.stringify({ access_token: jwt, id_token: 'synthetic-session', refresh_token: 'fixture' }));
  });
  await page.goto('http://127.0.0.1:3199/admin/index.html#/screens/panel_editorial');
}
