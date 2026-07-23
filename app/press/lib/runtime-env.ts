type RuntimeEnvironment = {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  [key: string]: unknown;
};

const runtimeGlobal = globalThis as typeof globalThis & {
  env?: RuntimeEnvironment;
};

export const runtimeEnv: RuntimeEnvironment =
  runtimeGlobal.env ?? (process.env as RuntimeEnvironment);
