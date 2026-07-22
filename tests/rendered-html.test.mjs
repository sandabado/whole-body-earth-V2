import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("ships the complete Studios experience instead of the starter", async () => {
  const [page, home, layout, packageJson] = await Promise.all([
    source("app/page.tsx"),
    source("app/components/HomePage.tsx"),
    source("app/layout.tsx"),
    source("package.json"),
  ]);

  assert.match(layout, /Whole Body Studios/);
  assert.match(home, /INFRASTRUCTURE,/);
  assert.match(home, /NOT A LABEL/);
  assert.match(home, /THE ARTIST EATS FIRST/);
  assert.match(page, /<HomePage \/>/);
  assert.doesNotMatch(page + home + layout + packageJson, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("uses the reusable Water engine with hydration-safe degradation", async () => {
  const [home, engine, canvas, capability, shader, styles] = await Promise.all([
    source("app/components/HomePage.tsx"),
    source("app/components/HeroEngine/HeroEngine.tsx"),
    source("app/components/HeroEngine/WaterCanvas.tsx"),
    source("app/components/HeroEngine/hooks/useDeviceCapability.ts"),
    source("app/components/HeroEngine/shaders/water.frag.ts"),
    source("app/components/HeroEngine/HeroEngine.module.css"),
  ]);

  assert.match(home, /<HeroEngine/);
  assert.match(home, /siteSlug="studios"/);
  assert.match(engine, /lazy\(\(\) => import\("\.\/WaterCanvas"\)\)/);
  assert.match(engine, /CanvasBoundary/);
  assert.match(engine, /capability\.reducedMotion/);
  assert.match(engine, /capability\.reducedData/);
  assert.match(capability, /getContext\("webgl2"/);
  assert.match(capability, /prefers-reduced-motion:\s*reduce/);
  assert.match(canvas, /usePointerInfluence/);
  assert.match(canvas, /useScrollSpeed/);
  assert.match(shader, /uFluidDissipation/);
  assert.match(shader, /uPointerInfluenceStrength/);
  assert.match(shader, /caustic/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test("centralizes live configuration with a protected editor", async () => {
  const [fallback, config, hook, route, page, editor, schema, docs] = await Promise.all([
    source("app/components/HeroEngine/hero-configs.json"),
    source("app/components/HeroEngine/config.ts"),
    source("app/components/HeroEngine/useHeroConfig.ts"),
    source("app/api/hero-config/route.ts"),
    source("app/admin/hero-configs/page.tsx"),
    source("app/admin/hero-configs/HeroConfigAdmin.tsx"),
    source("db/schema.ts"),
    source("docs/HERO_ENGINE.md"),
  ]);

  assert.match(fallback, /"studios"/);
  assert.match(fallback, /"element": "water"/);
  assert.match(config, /normalizeHeroConfig/);
  assert.match(hook, /\/api\/hero-config\?site=/);
  assert.match(route, /CREATE TABLE IF NOT EXISTS hero_configs/);
  assert.match(route, /oai-authenticated-user-email/);
  assert.match(route, /export async function PATCH/);
  assert.match(page, /requireChatGPTUser/);
  assert.match(editor, /SAVE LIVE CONFIG/);
  assert.match(schema, /heroConfigs = sqliteTable\("hero_configs"/);
  assert.match(docs, /without a deployment/);
});

test("preserves the six-site constellation and client-stable studio status", async () => {
  const shell = await source("app/components/SiteExperience.tsx");
  for (const domain of [
    "wholebody.earth",
    "wholebody.foundation",
    "wholebody.studio",
    "wholebody.community",
    "wholebody.press",
    "wholebody.law",
  ]) {
    assert.match(shell, new RegExp(domain.replace(".", "\\.")));
  }
  assert.match(shell, /useState\("SYSTEMS — STANDING BY"\)/);
  assert.doesNotMatch(shell, /const studioStatus = hour/);
});

test("ships every engine source file", async () => {
  await Promise.all([
    "app/components/HeroEngine/HeroEngine.tsx",
    "app/components/HeroEngine/HeroEngine.module.css",
    "app/components/HeroEngine/WaterCanvas.tsx",
    "app/components/HeroEngine/config.ts",
    "app/components/HeroEngine/hero-configs.json",
    "app/components/HeroEngine/hooks/useDeviceCapability.ts",
    "app/components/HeroEngine/hooks/usePointerInfluence.ts",
    "app/components/HeroEngine/hooks/useScrollSpeed.ts",
    "app/components/HeroEngine/shaders/common.vert.ts",
    "app/components/HeroEngine/shaders/water.frag.ts",
    "public/og-water.png",
  ].map((path) => access(new URL(path, root))));
});
