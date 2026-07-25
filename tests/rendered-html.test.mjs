import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("ships the fullscreen Whole Body Earth command deck", async () => {
  const [page, home, nav, shelf, layout, packageJson] = await Promise.all([
    source("app/page.tsx"),
    source("app/components/home/EpicHomeExperience.tsx"),
    source("app/components/home/TopNav.tsx"),
    source("app/components/home/PillarShelf.tsx"),
    source("app/layout.tsx"),
    source("package.json"),
  ]);

  assert.match(layout, /Whole Body Studios/);
  assert.match(page, /<EpicHomeExperience \/>/);
  assert.match(home, /<HeroQuincunx activePillar=\{activePillar\}/);
  assert.match(home, /<HermeticCrest/);
  assert.match(home, /<TopNav activePillar=\{activePillar\}/);
  assert.match(home, /<PillarShelf/);
  assert.match(home, /Five pillars\. One whole body\./);
  assert.match(home, /href="\/reading"/);
  assert.doesNotMatch(home, /WholeBodyFooter|ElementZones|HomeContinuum/);
  for (const symbol of ["🜂", "🜁", "🜄", "🜃", "⊙", "⏺"])
    assert.match(nav, new RegExp(symbol));
  assert.match(nav, /styles\.label/);
  assert.match(nav, /navLabel: "Foundation"/);
  assert.match(nav, /navLabel: "NØW"/);
  assert.match(shelf, /DISMISS_THRESHOLD_PX = 100/);
  assert.doesNotMatch(page + home + layout + packageJson, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("uses the reusable Water engine with active-pillar focus and hydration-safe degradation", async () => {
  const [home, engine, canvas, capability, shader, styles] = await Promise.all([
    source("app/components/home/EpicHomeExperience.tsx"),
    source("app/components/HeroEngine/HeroEngine.tsx"),
    source("app/components/HeroEngine/WaterCanvas.tsx"),
    source("app/components/HeroEngine/hooks/useDeviceCapability.ts"),
    source("app/components/HeroEngine/shaders/water.frag.ts"),
    source("app/components/HeroEngine/HeroEngine.module.css"),
  ]);

  assert.match(home, /<HeroEngine/);
  assert.match(home, /siteSlug="studios"/);
  assert.match(home, /activePillar=\{activePillar\}/);
  assert.match(engine, /lazy\(\(\) => import\("\.\/WaterCanvas"\)\)/);
  assert.match(engine, /CanvasBoundary/);
  assert.match(engine, /capability\.reducedMotion/);
  assert.match(engine, /capability\.reducedData/);
  assert.match(capability, /getContext\("webgl2"/);
  assert.match(capability, /prefers-reduced-motion:\s*reduce/);
  assert.match(canvas, /usePointerInfluence/);
  assert.match(canvas, /useScrollSpeed/);
  assert.match(canvas, /activePillar/);
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

test("preserves the pillar route spine and client-stable studio status", async () => {
  const shell = await source("app/components/SiteExperience.tsx");
  for (const route of ["/studios", "/foundation", "/presence", "/press"]) {
    assert.match(shell, new RegExp(route));
  }
  assert.match(shell, /current !== "studios"/);
  assert.match(shell, /pathname !== "\/"/);
  assert.match(shell, /<WholeBodyFooter \/>/);
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
