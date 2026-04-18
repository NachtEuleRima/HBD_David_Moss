import Stripe from 'stripe';

async function fetchConnection(hostname: string, token: string, environment: string) {
  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', environment);

  const response = await fetch(url.toString(), {
    headers: { 'Accept': 'application/json', 'X-Replit-Token': token },
  });
  const data = await response.json();
  return data.items?.[0]?.settings;
}

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) throw new Error('X-Replit-Token not found');

  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';

  // Try the environment-matched connection first, fall back to development
  const environments = isProduction ? ['production', 'development'] : ['development'];

  for (const env of environments) {
    const settings = await fetchConnection(hostname!, xReplitToken, env);
    if (settings?.publishable && settings?.secret) {
      const publishableKey = String(settings.publishable).trim().replace(/[^a-zA-Z0-9_]/g, '');
      const secretKey = String(settings.secret).trim().replace(/[^a-zA-Z0-9_]/g, '');
      if (publishableKey && secretKey) {
        return { publishableKey, secretKey };
      }
    }
  }

  throw new Error('Stripe connection not found. Please connect Stripe in the integrations panel.');
}

export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, { apiVersion: '2025-08-27.basil' as any });
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}
