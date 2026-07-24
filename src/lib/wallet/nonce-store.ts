type NonceRecord = { expiresAt: number; used: boolean };

const NONCE_TTL_MS = 5 * 60 * 1000;

function nonceStore() {
  const scope = globalThis as typeof globalThis & {
    __wholeBodyReadingNonces?: Map<string, NonceRecord>;
  };
  scope.__wholeBodyReadingNonces ??= new Map();
  return scope.__wholeBodyReadingNonces;
}

export function issueReadingNonce() {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const store = nonceStore();
  const now = Date.now();
  for (const [key, value] of store) {
    if (value.expiresAt < now || value.used) store.delete(key);
  }
  store.set(nonce, { expiresAt: now + NONCE_TTL_MS, used: false });
  return { nonce, expiresAt: new Date(now + NONCE_TTL_MS).toISOString() };
}

export function consumeReadingNonce(nonce: string) {
  const record = nonceStore().get(nonce);
  if (!record || record.used || record.expiresAt < Date.now()) return false;
  record.used = true;
  return true;
}
