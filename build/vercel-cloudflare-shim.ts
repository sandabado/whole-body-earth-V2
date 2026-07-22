// Vercel does not expose Cloudflare Worker bindings. API routes already
// degrade gracefully when these optional bindings are unavailable.
export const env: Record<string, never> = {};
