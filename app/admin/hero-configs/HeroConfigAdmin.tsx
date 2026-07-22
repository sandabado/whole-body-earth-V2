"use client";

import { useCallback, useEffect, useState } from "react";
import type { HeroConfig, HeroConfigResponse } from "../../components/HeroEngine/config";

const colorFields = [
  ["colorBase", "Base / Void"],
  ["colorPrimary", "Primary / Water"],
  ["colorSecondary", "Secondary / Depth"],
  ["colorSurface", "Surface / Bone"],
] as const;

const motionFields = [
  ["cameraDriftSpeed", "Camera drift", 0.0001],
  ["cameraRotationDegrees", "Camera rotation", 0.1],
  ["pointerInfluenceStrength", "Pointer influence", 0.01],
  ["scrollAccelerationMultiplier", "Scroll weight", 0.1],
  ["fluidDissipation", "Fluid dissipation", 0.01],
  ["flowVelocityScale", "Flow velocity", 0.01],
  ["curlNoiseAmplitude", "Curl amplitude", 0.01],
] as const;

const timingFields = [
  ["headlineDelayMs", "Headline delay / ms", 100],
  ["introDurationMs", "Intro duration / ms", 500],
  ["ambientFlareIntervalMs", "Ambient flare / ms", 1000],
] as const;

type NumberKey = typeof motionFields[number][0] | typeof timingFields[number][0] | "audioVolume";
type ColorKey = typeof colorFields[number][0];

export function HeroConfigAdmin({ editorName }: { editorName: string }) {
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [version, setVersion] = useState(0);
  const [source, setSource] = useState("SYNCING");
  const [message, setMessage] = useState("READING LIVE CONFIGURATION");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/hero-config?site=studios", { cache: "no-store" });
      if (!response.ok) throw new Error("Configuration read failed");
      const result = await response.json() as HeroConfigResponse;
      setConfig(result.config);
      setVersion(result.version);
      setSource(result.source.toUpperCase());
      setMessage(`VERSION ${result.version} / READY`);
    } catch {
      setMessage("CONFIGURATION CHANNEL UNAVAILABLE");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/hero-config?site=studios", { cache: "no-store", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Configuration read failed");
        return response.json() as Promise<HeroConfigResponse>;
      })
      .then((result) => {
        setConfig(result.config);
        setVersion(result.version);
        setSource(result.source.toUpperCase());
        setMessage(`VERSION ${result.version} / READY`);
      })
      .catch(() => {
        if (!controller.signal.aborted) setMessage("CONFIGURATION CHANNEL UNAVAILABLE");
      });
    return () => controller.abort();
  }, []);

  const setNumber = (key: NumberKey, value: string) => {
    setConfig((current) => current ? { ...current, [key]: Number(value) } : current);
  };
  const setColor = (key: ColorKey, value: string) => {
    setConfig((current) => current ? { ...current, [key]: value } : current);
  };

  const save = async () => {
    if (!config) return;
    setSaving(true);
    setMessage("WRITING CONFIGURATION");
    try {
      const response = await fetch("/api/hero-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteSlug: "studios", config }),
      });
      const result = await response.json() as HeroConfigResponse & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Save failed");
      setConfig(result.config);
      setVersion(result.version);
      setSource(result.source.toUpperCase());
      setMessage(`VERSION ${result.version} / TRANSMITTED`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message.toUpperCase() : "SAVE FAILED");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell hero-admin-page">
      <header className="hero-admin-head">
        <div>
          <p className="eyebrow">GHOSTHAND / WATER ENGINE</p>
          <h1>Hero configuration.</h1>
          <p>Change the live Studios field without changing the deployed code.</p>
        </div>
        <dl>
          <div><dt>EDITOR</dt><dd>{editorName}</dd></div>
          <div><dt>SOURCE</dt><dd>{source}</dd></div>
          <div><dt>VERSION</dt><dd>{version || "—"}</dd></div>
        </dl>
      </header>

      {!config ? (
        <div className="hero-admin-loading" role="status">{message}</div>
      ) : (
        <form className="hero-admin-grid" onSubmit={(event) => { event.preventDefault(); save(); }}>
          <section className="hero-admin-panel">
            <p className="eyebrow">COLOR FIELD</p>
            {colorFields.map(([key, label]) => (
              <label className="hero-admin-color" key={key}>
                <span>{label}</span>
                <input type="color" value={config[key] ?? config.colorBase} onChange={(event) => setColor(key, event.target.value)} />
                <input value={config[key] ?? ""} onChange={(event) => setColor(key, event.target.value)} pattern="#[0-9A-Fa-f]{6}" />
              </label>
            ))}
          </section>

          <section className="hero-admin-panel">
            <p className="eyebrow">MOTION FIELD</p>
            {motionFields.map(([key, label, step]) => (
              <label className="hero-admin-number" key={key}>
                <span>{label}</span>
                <input type="number" value={config[key]} step={step} onChange={(event) => setNumber(key, event.target.value)} />
              </label>
            ))}
          </section>

          <section className="hero-admin-panel">
            <p className="eyebrow">TIMING / QUALITY</p>
            {timingFields.map(([key, label, step]) => (
              <label className="hero-admin-number" key={key}>
                <span>{label}</span>
                <input type="number" value={config[key]} step={step} onChange={(event) => setNumber(key, event.target.value)} />
              </label>
            ))}
            <label className="hero-admin-number">
              <span>Resolution quality</span>
              <select value={config.resolutionQuality} onChange={(event) => setConfig({ ...config, resolutionQuality: event.target.value as HeroConfig["resolutionQuality"] })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="hero-admin-check">
              <input type="checkbox" checked={config.isActive} onChange={(event) => setConfig({ ...config, isActive: event.target.checked })} />
              <span>Water field active</span>
            </label>
          </section>

          <footer className="hero-admin-actions">
            <span aria-live="polite">{message}</span>
            <div>
              <button type="button" onClick={load}>RELOAD</button>
              <button type="submit" disabled={saving}>{saving ? "TRANSMITTING" : "SAVE LIVE CONFIG"}</button>
            </div>
          </footer>
        </form>
      )}
    </div>
  );
}
