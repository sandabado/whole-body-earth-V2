import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("ships the fullscreen Whole Body Earth ritual portal", async () => {
  const [page, home, nav, transition, layout, studiosLayout, packageJson] = await Promise.all([
    source("app/page.tsx"),
    source("app/components/home/EpicHomeExperience.tsx"),
    source("app/components/home/TopNav.tsx"),
    source("app/components/home/PillarTransition.tsx"),
    source("app/layout.tsx"),
    source("app/studios/layout.tsx"),
    source("package.json"),
  ]);

  assert.match(layout, /Whole Body Earth/);
  assert.doesNotMatch(layout, /SiteExperience|Whole Body Studios/);
  assert.match(studiosLayout, /<SiteExperience>\{children\}<\/SiteExperience>/);
  assert.match(studiosLayout, /Whole Body Studios/);
  assert.match(page, /<EpicHomeExperience \/>/);
  assert.match(home, /<HeroQuincunx[\s\S]*activePillar=\{visualPillar\}/);
  assert.match(home, /<HermeticCrest/);
  assert.match(home, /onPillarActivate=\{beginNamedTransition\}/);
  assert.match(home, /<TopNav activePillar=\{activePillar\}/);
  assert.match(home, /<PillarTransition/);
  assert.doesNotMatch(home, /PillarShelf|shelfOpen|data-shelf-open/);
  assert.match(home, /Five pillars\. One whole body\./);
  assert.match(home, /href="\/reading"/);
  assert.doesNotMatch(home, /WholeBodyFooter|ElementZones|HomeContinuum/);
  for (const command of ["presence", "press", "studios", "foundation", "guardian", "whole"])
    assert.match(nav, new RegExp(`id: "${command}"`));
  assert.match(nav, /symbol: "⊙"/);
  assert.match(nav, /symbol: "⏺/);
  assert.match(nav, /styles\.label/);
  assert.match(nav, /navLabel: "Foundation"/);
  assert.match(nav, /navLabel: "NØW"/);
  assert.match(nav, /aria-label="Enter a Whole Body pillar"/);
  assert.match(transition, /TRANSITION_DURATION_MS = 1200/);
  assert.match(transition, /presence: "\/presence"/);
  assert.match(transition, /press: "\/press"/);
  assert.match(transition, /studios: "\/studios"/);
  assert.match(transition, /foundation: "\/foundation"/);
  assert.match(transition, /guardian: "\/guardian"/);
  assert.doesNotMatch(transition, /whole: "\/calendar"/);
  assert.match(home, /pillar === "whole"/);
  assert.match(home, /router\.push\("\/calendar"\)/);
  assert.match(transition, /event\.key === "Escape"/);
  assert.match(transition, /event\.key === "Tab"/);
  assert.match(transition, /SWIPE_CANCEL_THRESHOLD_PX = 72/);
  assert.match(transition, /prefers-reduced-motion: reduce/);
  assert.match(transition, /role="dialog"/);
  assert.match(transition, /aria-modal="true"/);
  assert.doesNotMatch(page + home + layout + packageJson, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("ships five pillar-specific entrances and a direct NØW route", async () => {
  const [fire, air, water, earth, ether, styles] = await Promise.all([
    source("app/components/transitions/FireTransition.tsx"),
    source("app/components/transitions/AirTransition.tsx"),
    source("app/components/transitions/WaterTransition.tsx"),
    source("app/components/transitions/EarthTransition.tsx"),
    source("app/components/transitions/EtherTransition.tsx"),
    source("app/components/home/TransitionOverlay.module.css"),
  ]);

  assert.match(fire, /Entering the Fire Pillar/);
  assert.match(air, /Entering the Air Pillar/);
  assert.match(water, /Entering the Water Pillar/);
  assert.match(water, /lazy\(\(\) => import\("\.\.\/HeroEngine\/WaterCanvas"\)\)/);
  assert.match(earth, /Entering the Earth Pillar/);
  assert.match(ether, /Entering the Ether Pillar/);
  assert.match(styles, /--ease-epic:\s*cubic-bezier\(\.65,\s*0,\s*\.35,\s*1\)/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(
    fire + air + water + earth + ether,
    /PillarShelf|whole-body-command-shelf/,
  );
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
  assert.match(home, /activePillar=\{visualPillar\}/);
  assert.match(home, /transitioning=\{transitioning\}/);
  assert.match(engine, /lazy\(\(\) => import\("\.\/WaterCanvas"\)\)/);
  assert.match(engine, /data-transitioning=\{transitioning \? "true" : "false"\}/);
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

test("isolates the Studios shell while preserving shared-route footer behavior", async () => {
  const [rootLayout, studiosLayout, sharedLayout, shell] = await Promise.all([
    source("app/layout.tsx"),
    source("app/studios/layout.tsx"),
    source("app/(shared)/layout.tsx"),
    source("app/components/SiteExperience.tsx"),
  ]);

  assert.doesNotMatch(rootLayout, /SiteExperience/);
  assert.match(studiosLayout, /<SiteExperience>\{children\}<\/SiteExperience>/);
  assert.match(sharedLayout, /<WholeBodyFooter \/>/);
  for (const route of ["/studios", "/studios/catalog", "/studios/about", "/studios/contact"]) {
    assert.match(shell, new RegExp(route));
  }
  assert.doesNotMatch(shell, /pathname\.startsWith\("\/(foundation|presence|press)"\)/);
  assert.doesNotMatch(shell, /current !== "studios"/);
  assert.match(shell, /<WholeBodyFooter \/>/);
  assert.match(shell, /useState\("SYSTEMS — STANDING BY"\)/);
  assert.match(shell, /accent: "#2E86AB"/);
  assert.match(shell, /rgb: "46,134,171"/);
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
