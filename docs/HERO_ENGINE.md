# Whole Body Hero Engine

The Studios homepage uses the shared `HeroEngine` contract with the Water shader. Visual and motion values come from one configuration model.

## Configuration flow

1. `hero-configs.json` is the safe, versioned fallback for every environment.
2. `GET /api/hero-config?site=studios` reads the active record from the `hero_configs` D1 table.
3. When no record exists, the API seeds D1 from the fallback and returns it.
4. The client keeps the fallback visible while it requests the live configuration, so the hero never blocks on the network.
5. `/admin/hero-configs` lets an authenticated Ghosthand editor update D1. The next page load receives the new values without a deployment.

All input passes through `normalizeHeroConfig`, which validates colors, enums, booleans, and numeric ranges before values reach WebGL or storage.

## Engine layout

- `HeroEngine.tsx` owns configuration, capability detection, fallback behavior, introduction timing, and the visual stage.
- `WaterCanvas.tsx` owns the Three.js render loop and shared shader uniforms.
- `hooks/` contains device, pointer, and scroll signals.
- `shaders/` contains the common vertex stage and the Water fragment shader.
- `config.ts` is the typed contract shared by the renderer, API, and admin surface.

The renderer requires WebGL 2. Reduced-motion, reduced-data, low-capability, and failed-renderer states remain on the CSS water field. The HTML headline and calls to action never depend on WebGL.

## Adding another element

Add its defaults to `hero-configs.json`, add a fragment shader that consumes the shared uniform contract, and select that renderer from `HeroEngine`. Do not duplicate device, pointer, scroll, fallback, or configuration logic.

## Live editing

Open `/admin/hero-configs` on the private deployed site. Saving increments the configuration version and records the authenticated editor. The admin endpoint rejects unauthenticated production writes; localhost writes are allowed for development.
