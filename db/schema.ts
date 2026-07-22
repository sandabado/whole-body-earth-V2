import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  artistName: text("artist_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  genre: text("genre").notNull(),
  stage: text("stage").notNull(),
  portfolioPrimary: text("portfolio_primary").notNull(),
  portfolioSecondary: text("portfolio_secondary"),
  servicesNeeded: text("services_needed").notNull(),
  whatTheyBuild: text("what_they_build").notNull(),
  whyStudios: text("why_studios"),
  retainsIp: text("retains_ip").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  status: text("status").notNull().default("NEW"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const heroConfigs = sqliteTable("hero_configs", {
  id: text("id").primaryKey(),
  siteSlug: text("site_slug").notNull().unique(),
  element: text("element").notNull(),
  colorBase: text("color_base").notNull().default("#050505"),
  colorPrimary: text("color_primary").notNull(),
  colorSecondary: text("color_secondary"),
  colorSurface: text("color_surface").notNull().default("#EDEDED"),
  cameraDriftSpeed: real("camera_drift_speed").notNull().default(0.0005),
  cameraRotationDegrees: real("camera_rotation_degrees").notNull().default(0),
  pointerInfluenceStrength: real("pointer_influence_strength").notNull().default(0.02),
  scrollAccelerationMultiplier: real("scroll_acceleration_multiplier").notNull().default(1.5),
  headlineDelayMs: integer("headline_delay_ms").notNull().default(2000),
  introDurationMs: integer("intro_duration_ms").notNull().default(8000),
  ambientFlareIntervalMs: integer("ambient_flare_interval_ms").notNull().default(30000),
  resolutionQuality: text("resolution_quality").notNull().default("high"),
  fluidDissipation: real("fluid_dissipation").notNull().default(0.98),
  flowVelocityScale: real("flow_velocity_scale").notNull().default(0.3),
  curlNoiseAmplitude: real("curl_noise_amplitude").notNull().default(0.45),
  audioEnabledByDefault: integer("audio_enabled_by_default", { mode: "boolean" }).notNull().default(false),
  audioVolume: real("audio_volume").notNull().default(0.3),
  audioUrl: text("audio_url"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: text("updated_by"),
  version: integer("version").notNull().default(1),
});
