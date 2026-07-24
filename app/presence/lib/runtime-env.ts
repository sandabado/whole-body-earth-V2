type RuntimeEnvironment = {
  DB?: D1Database;
  [key: string]: unknown;
};

const runtimeGlobal = globalThis as typeof globalThis & {
  env?: RuntimeEnvironment;
};

export const runtimeEnv: RuntimeEnvironment =
  runtimeGlobal.env ?? (process.env as RuntimeEnvironment);
