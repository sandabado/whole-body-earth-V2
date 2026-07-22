import { env } from "cloudflare:workers";
import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultHeroConfig,
  normalizeHeroConfig,
  type HeroConfig,
  type HeroConfigResponse,
} from "../../components/HeroEngine/config";

type HeroConfigRow = {
  site_slug: string;
  element: string;
  color_base: string;
  color_primary: string;
  color_secondary: string | null;
  color_surface: string;
  camera_drift_speed: number;
  camera_rotation_degrees: number;
  pointer_influence_strength: number;
  scroll_acceleration_multiplier: number;
  headline_delay_ms: number;
  intro_duration_ms: number;
  ambient_flare_interval_ms: number;
  resolution_quality: string;
  fluid_dissipation: number;
  flow_velocity_scale: number;
  curl_noise_amplitude: number;
  audio_enabled_by_default: number;
  audio_volume: number;
  audio_url: string | null;
  is_active: number;
  updated_at: string | null;
  version: number;
};

const siteSlugPattern = /^[a-z][a-z0-9-]{1,39}$/;

async function ensureHeroConfigTable(db: D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS hero_configs (
    id TEXT PRIMARY KEY NOT NULL,
    site_slug TEXT NOT NULL UNIQUE,
    element TEXT NOT NULL,
    color_base TEXT NOT NULL DEFAULT '#050505',
    color_primary TEXT NOT NULL,
    color_secondary TEXT,
    color_surface TEXT NOT NULL DEFAULT '#EDEDED',
    camera_drift_speed REAL NOT NULL DEFAULT 0.0005,
    camera_rotation_degrees REAL NOT NULL DEFAULT 0,
    pointer_influence_strength REAL NOT NULL DEFAULT 0.02,
    scroll_acceleration_multiplier REAL NOT NULL DEFAULT 1.5,
    headline_delay_ms INTEGER NOT NULL DEFAULT 2000,
    intro_duration_ms INTEGER NOT NULL DEFAULT 8000,
    ambient_flare_interval_ms INTEGER NOT NULL DEFAULT 30000,
    resolution_quality TEXT NOT NULL DEFAULT 'high',
    fluid_dissipation REAL NOT NULL DEFAULT 0.98,
    flow_velocity_scale REAL NOT NULL DEFAULT 0.3,
    curl_noise_amplitude REAL NOT NULL DEFAULT 0.45,
    audio_enabled_by_default INTEGER NOT NULL DEFAULT 0,
    audio_volume REAL NOT NULL DEFAULT 0.3,
    audio_url TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT,
    version INTEGER NOT NULL DEFAULT 1
  )`).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_hero_configs_slug ON hero_configs(site_slug)").run();
}

function rowToConfig(row: HeroConfigRow, fallback: HeroConfig): HeroConfig {
  return normalizeHeroConfig({
    element: row.element,
    colorBase: row.color_base,
    colorPrimary: row.color_primary,
    colorSecondary: row.color_secondary ?? undefined,
    colorSurface: row.color_surface,
    cameraDriftSpeed: row.camera_drift_speed,
    cameraRotationDegrees: row.camera_rotation_degrees,
    pointerInfluenceStrength: row.pointer_influence_strength,
    scrollAccelerationMultiplier: row.scroll_acceleration_multiplier,
    headlineDelayMs: row.headline_delay_ms,
    introDurationMs: row.intro_duration_ms,
    ambientFlareIntervalMs: row.ambient_flare_interval_ms,
    resolutionQuality: row.resolution_quality,
    fluidDissipation: row.fluid_dissipation,
    flowVelocityScale: row.flow_velocity_scale,
    curlNoiseAmplitude: row.curl_noise_amplitude,
    audioEnabledByDefault: row.audio_enabled_by_default === 1,
    audioVolume: row.audio_volume,
    audioUrl: row.audio_url ?? undefined,
    isActive: row.is_active === 1,
  }, fallback);
}

async function writeHeroConfig(
  db: D1Database,
  siteSlug: string,
  config: HeroConfig,
  updatedBy: string,
) {
  await db.prepare(`INSERT INTO hero_configs (
    id, site_slug, element, color_base, color_primary, color_secondary, color_surface,
    camera_drift_speed, camera_rotation_degrees, pointer_influence_strength,
    scroll_acceleration_multiplier, headline_delay_ms, intro_duration_ms,
    ambient_flare_interval_ms, resolution_quality, fluid_dissipation,
    flow_velocity_scale, curl_noise_amplitude, audio_enabled_by_default,
    audio_volume, audio_url, is_active, updated_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(site_slug) DO UPDATE SET
    element = excluded.element,
    color_base = excluded.color_base,
    color_primary = excluded.color_primary,
    color_secondary = excluded.color_secondary,
    color_surface = excluded.color_surface,
    camera_drift_speed = excluded.camera_drift_speed,
    camera_rotation_degrees = excluded.camera_rotation_degrees,
    pointer_influence_strength = excluded.pointer_influence_strength,
    scroll_acceleration_multiplier = excluded.scroll_acceleration_multiplier,
    headline_delay_ms = excluded.headline_delay_ms,
    intro_duration_ms = excluded.intro_duration_ms,
    ambient_flare_interval_ms = excluded.ambient_flare_interval_ms,
    resolution_quality = excluded.resolution_quality,
    fluid_dissipation = excluded.fluid_dissipation,
    flow_velocity_scale = excluded.flow_velocity_scale,
    curl_noise_amplitude = excluded.curl_noise_amplitude,
    audio_enabled_by_default = excluded.audio_enabled_by_default,
    audio_volume = excluded.audio_volume,
    audio_url = excluded.audio_url,
    is_active = excluded.is_active,
    updated_at = CURRENT_TIMESTAMP,
    updated_by = excluded.updated_by,
    version = hero_configs.version + 1`)
    .bind(
      crypto.randomUUID(),
      siteSlug,
      config.element,
      config.colorBase,
      config.colorPrimary,
      config.colorSecondary ?? null,
      config.colorSurface,
      config.cameraDriftSpeed,
      config.cameraRotationDegrees,
      config.pointerInfluenceStrength,
      config.scrollAccelerationMultiplier,
      config.headlineDelayMs,
      config.introDurationMs,
      config.ambientFlareIntervalMs,
      config.resolutionQuality,
      config.fluidDissipation,
      config.flowVelocityScale,
      config.curlNoiseAmplitude,
      config.audioEnabledByDefault ? 1 : 0,
      config.audioVolume,
      config.audioUrl ?? null,
      config.isActive ? 1 : 0,
      updatedBy,
    ).run();
}

async function readHeroConfig(db: D1Database, siteSlug: string) {
  return db.prepare("SELECT * FROM hero_configs WHERE site_slug = ? AND is_active = 1 LIMIT 1")
    .bind(siteSlug)
    .first<HeroConfigRow>();
}

function response(payload: HeroConfigResponse) {
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET(request: NextRequest) {
  const siteSlug = request.nextUrl.searchParams.get("site") ?? "studios";
  if (!siteSlugPattern.test(siteSlug)) {
    return NextResponse.json({ error: "Invalid site slug." }, { status: 400 });
  }

  const fallback = getDefaultHeroConfig(siteSlug);
  const runtime = env as unknown as { DB?: D1Database };
  if (!runtime.DB) {
    return response({ config: fallback, siteSlug, source: "fallback", updatedAt: null, version: 1 });
  }

  try {
    await ensureHeroConfigTable(runtime.DB);
    let row = await readHeroConfig(runtime.DB, siteSlug);
    if (!row) {
      await writeHeroConfig(runtime.DB, siteSlug, fallback, "SYSTEM / FALLBACK SEED");
      row = await readHeroConfig(runtime.DB, siteSlug);
    }
    if (!row) throw new Error("Hero configuration seed failed");
    return response({
      config: rowToConfig(row, fallback),
      siteSlug,
      source: "database",
      updatedAt: row.updated_at,
      version: row.version,
    });
  } catch (error) {
    console.error("Hero config read failed", error);
    return response({ config: fallback, siteSlug, source: "fallback", updatedAt: null, version: 1 });
  }
}

export async function PATCH(request: NextRequest) {
  const localRequest = request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1";
  const editor = request.headers.get("oai-authenticated-user-email");
  if (!editor && !localRequest) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json() as { siteSlug?: unknown; config?: unknown };
    const siteSlug = typeof body.siteSlug === "string" ? body.siteSlug : "";
    if (!siteSlugPattern.test(siteSlug)) {
      return NextResponse.json({ error: "Invalid site slug." }, { status: 400 });
    }
    const config = normalizeHeroConfig(body.config, getDefaultHeroConfig(siteSlug));
    const runtime = env as unknown as { DB?: D1Database };
    if (!runtime.DB) {
      return NextResponse.json({ error: "Database binding unavailable." }, { status: 503 });
    }
    await ensureHeroConfigTable(runtime.DB);
    await writeHeroConfig(runtime.DB, siteSlug, config, editor ?? "LOCAL / GHOSTHAND");
    const row = await readHeroConfig(runtime.DB, siteSlug);
    if (!row) throw new Error("Saved configuration could not be read");
    return response({
      config: rowToConfig(row, config),
      siteSlug,
      source: "database",
      updatedAt: row.updated_at,
      version: row.version,
    });
  } catch (error) {
    console.error("Hero config update failed", error);
    return NextResponse.json({ error: "Configuration could not be saved." }, { status: 500 });
  }
}
