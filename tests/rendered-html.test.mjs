import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const source = (path) => readFile(new URL(path, root), "utf8");

test("ships the fullscreen Whole Body Earth ritual portal", async () => {
  const [page, home, nav, crest, solids, overlay, controller, layout, studiosLayout, packageJson] = await Promise.all([
    source("app/page.tsx"),
    source("app/components/home/EpicHomeExperience.tsx"),
    source("app/components/home/TopNav.tsx"),
    source("app/components/hermetic-crest/HermeticCrest.tsx"),
    source("app/components/home/HeroQuincunx.tsx"),
    source("app/components/TransitionOverlay.tsx"),
    source("app/components/WholeBodyTransition.tsx"),
    source("app/layout.tsx"),
    source("app/studios/layout.tsx"),
    source("package.json"),
  ]);

  assert.match(layout, /Whole Body Earth/);
  assert.match(layout, /<WholeBodyTransitionProvider>\{children\}<\/WholeBodyTransitionProvider>/);
  assert.doesNotMatch(layout, /SiteExperience|Whole Body Studios/);
  assert.match(studiosLayout, /<SiteExperience>\{children\}<\/SiteExperience>/);
  assert.match(studiosLayout, /Whole Body Studios/);
  assert.match(page, /<EpicHomeExperience \/>/);
  assert.match(home, /<HeroQuincunx[\s\S]*activePillar=\{visualPillar\}/);
  assert.match(home, /backgroundVariant="cosmic"/);
  assert.match(home, /<HermeticCrest/);
  assert.match(home, /onPillarActivate=\{beginNamedTransition\}/);
  assert.match(home, /<TopNav activePillar=\{activePillar\}/);
  assert.match(home, /useWholeBodyTransition/);
  assert.doesNotMatch(home, /<PillarTransition/);
  assert.doesNotMatch(home, /PillarShelf|shelfOpen|data-shelf-open/);
  assert.match(home, /Five pillars\. One whole body\./);
  assert.match(home, /href="\/reading"/);
  assert.doesNotMatch(home, /WholeBodyFooter|ElementZones|HomeContinuum/);
  for (const command of ["presence", "press", "studios", "foundation", "guardian", "whole"])
    assert.match(nav, new RegExp(`id: "${command}"`));
  assert.match(nav, /symbol: "⊙"/);
  assert.match(nav, /function GlobeIcon/);
  assert.match(nav, /Whole Body Earth — Live Calendar/);
  assert.doesNotMatch(nav, /⏺|recBlink|record/);
  assert.match(nav, /styles\.label/);
  for (const business of [
    "Whole Body Presence",
    "Whole Body Press",
    "Whole Body Studios",
    "Whole Body Foundation",
    "Guardian — The Agreements",
  ]) assert.match(nav, new RegExp(business));
  assert.match(nav, /navLabel: "NØW"/);
  assert.match(nav, /aria-label="Enter a Whole Body pillar"/);
  for (const business of [
    "Whole Body Presence",
    "Whole Body Press",
    "Whole Body Studios",
    "Whole Body Foundation",
    "Whole Body Guardian",
  ]) assert.match(crest, new RegExp(business));
  assert.doesNotMatch(crest, /keyFollower|keyAssembly|lockMechanism|KEY 05|ancient key/);
  assert.match(crest, /usesTapPreview/);
  assert.match(crest, /dialSelection !== element\.id/);
  assert.match(solids, /DEFAULT_GOLD_COLOR = hexToRgb\("#D4AF37"\)/);
  assert.match(solids, /solid\.pillar === activePillar \? 1 : 0/);
  assert.match(solids, /FOCUS_TRANSITION_SECONDS = 0\.4/);
  assert.match(solids, /easeOutCubic\(\s*focusTransitionElapsed \/ FOCUS_TRANSITION_SECONDS/);
  assert.match(controller, /TRANSITION_DURATION_MS = 1200/);
  assert.match(controller, /DISSOLVE_DURATION_MS = 300/);
  assert.match(controller, /router\.prefetch\(route\)/);
  assert.match(controller, /presence: "\/presence"/);
  assert.match(controller, /press: "\/press"/);
  assert.match(controller, /studios: "\/studios"/);
  assert.match(controller, /foundation: "\/foundation"/);
  assert.match(controller, /guardian: "\/guardian"/);
  assert.match(controller, /whole: "\/calendar"/);
  assert.match(controller, /pathname !== TRANSITION_ROUTES\[pillar\]/);
  assert.match(overlay, /event\.key === "Escape" && cancellableRef\.current/);
  assert.match(overlay, /event\.key === "Tab"/);
  assert.match(overlay, /SWIPE_CANCEL_THRESHOLD_PX = 72/);
  assert.match(controller, /prefers-reduced-motion: reduce/);
  assert.match(overlay, /role="dialog"/);
  assert.match(overlay, /aria-modal=/);
  assert.doesNotMatch(page + home + layout + packageJson, /Your site is taking shape|codex-preview|react-loading-skeleton/i);
});

test("ships six seamless entrances including the Whole Earth observatory", async () => {
  const [fire, air, water, earth, ether, observatory, styles, globe] = await Promise.all([
    source("app/components/transitions/FireTransition.tsx"),
    source("app/components/transitions/AirTransition.tsx"),
    source("app/components/transitions/WaterTransition.tsx"),
    source("app/components/transitions/EarthTransition.tsx"),
    source("app/components/transitions/EtherTransition.tsx"),
    source("app/components/transitions/ObservatoryTransition.tsx"),
    source("app/components/TransitionOverlay.module.css"),
    source("app/components/WholeEarthGlobe.tsx"),
  ]);

  assert.match(fire, /Entering the Fire Pillar/);
  assert.match(air, /Entering the Air Pillar/);
  assert.match(water, /Entering the Water Pillar/);
  assert.match(water, /lazy\(\(\) => import\("\.\.\/HeroEngine\/WaterCanvas"\)\)/);
  assert.match(earth, /Entering the Earth Pillar/);
  assert.match(ether, /Entering the Ether Pillar/);
  assert.match(observatory, /Entering the Constellation/);
  assert.match(observatory, /length: 48/);
  assert.match(globe, /TAU \/ 60/);
  assert.match(globe, /TAU \/ 2/);
  assert.match(globe, /whole-body-earth-globe-hit-target/);
  assert.match(styles, /--ease-epic:\s*cubic-bezier\(\.65,\s*0,\s*\.35,\s*1\)/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(
    fire + air + water + earth + ether + observatory,
    /PillarShelf|whole-body-command-shelf/,
  );
});

test("uses distinct cosmic and Water engines with hydration-safe degradation", async () => {
  const [home, engine, canvas, cosmic, capability, shader, cosmicShader, styles] = await Promise.all([
    source("app/components/home/EpicHomeExperience.tsx"),
    source("app/components/HeroEngine/HeroEngine.tsx"),
    source("app/components/HeroEngine/WaterCanvas.tsx"),
    source("app/components/HeroEngine/CosmicCanvas.tsx"),
    source("app/components/HeroEngine/hooks/useDeviceCapability.ts"),
    source("app/components/HeroEngine/shaders/water.frag.ts"),
    source("app/components/HeroEngine/shaders/cosmic.frag.ts"),
    source("app/components/HeroEngine/HeroEngine.module.css"),
  ]);

  assert.match(home, /<HeroEngine/);
  assert.match(home, /siteSlug="studios"/);
  assert.match(home, /activePillar=\{visualPillar\}/);
  assert.match(home, /transitioning=\{transitioning\}/);
  assert.match(home, /showWholeEarthGlobe/);
  assert.match(home, /onWholeActivate=/);
  assert.match(engine, /lazy\(\(\) => import\("\.\/WaterCanvas"\)\)/);
  assert.match(engine, /lazy\(\(\) => import\("\.\/CosmicCanvas"\)\)/);
  assert.match(engine, /backgroundVariant === "cosmic"/);
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
  assert.match(cosmic, /staticStarCount/);
  assert.match(cosmic, /Math\.PI \* 2 \/ 300/);
  assert.match(cosmicShader, /vec3 navy/);
  assert.match(cosmicShader, /vec3 violet/);
  assert.match(cosmicShader, /vec3 teal/);
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
    "app/components/HeroEngine/CosmicCanvas.tsx",
    "app/components/HeroEngine/config.ts",
    "app/components/HeroEngine/hero-configs.json",
    "app/components/HeroEngine/hooks/useDeviceCapability.ts",
    "app/components/HeroEngine/hooks/usePointerInfluence.ts",
    "app/components/HeroEngine/hooks/useScrollSpeed.ts",
    "app/components/HeroEngine/shaders/common.vert.ts",
    "app/components/HeroEngine/shaders/water.frag.ts",
    "app/components/HeroEngine/shaders/cosmic.vert.ts",
    "app/components/HeroEngine/shaders/cosmic.frag.ts",
    "public/og-water.png",
  ].map((path) => access(new URL(path, root))));
});
