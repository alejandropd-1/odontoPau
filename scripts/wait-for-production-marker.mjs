const [markerUrl, expectedCommit, requestId = 'editorial'] = process.argv.slice(2);

if (!markerUrl || !expectedCommit) {
  throw new Error('Uso: wait-for-production-marker.mjs <url> <commit> [requestId]');
}

const maxAttempts = Number(process.env.EDITORIAL_DEPLOY_MAX_ATTEMPTS ?? 40);
const intervalMs = Number(process.env.EDITORIAL_DEPLOY_INTERVAL_MS ?? 15000);

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    const url = new URL(markerUrl);
    url.searchParams.set('request', requestId);
    url.searchParams.set('attempt', String(attempt));
    const response = await fetch(url, { cache: 'no-store', headers: { accept: 'application/json' } });
    if (response.ok) {
      const marker = await response.json();
      if (marker?.commit === expectedCommit) {
        console.log(`Producción confirmó el commit ${expectedCommit}.`);
        process.exit(0);
      }
    }
  } catch {
    // La publicación puede seguir propagándose; se reintenta hasta el límite.
  }

  if (attempt < maxAttempts) await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

throw new Error(`Producción no confirmó el commit ${expectedCommit} dentro del tiempo esperado.`);
