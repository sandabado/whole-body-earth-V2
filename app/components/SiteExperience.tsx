"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const edges: [number, number][] = [];
const phi = (1 + Math.sqrt(5)) / 2;
const vertices: [number, number, number][] = [
  [0, -1, -phi], [0, -1, phi], [0, 1, -phi], [0, 1, phi],
  [-1, -phi, 0], [-1, phi, 0], [1, -phi, 0], [1, phi, 0],
  [-phi, 0, -1], [phi, 0, -1], [-phi, 0, 1], [phi, 0, 1],
];

for (let i = 0; i < vertices.length; i += 1) {
  for (let j = i + 1; j < vertices.length; j += 1) {
    const dx = vertices[i][0] - vertices[j][0];
    const dy = vertices[i][1] - vertices[j][1];
    const dz = vertices[i][2] - vertices[j][2];
    if (Math.hypot(dx, dy, dz) < 2.1) edges.push([i, j]);
  }
}

function GeometryField({ audioOn }: { audioOn: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stormRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particleCount = width < 700 ? 90 : 230;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.1 + 0.2,
      speed: Math.random() * 0.00045 + 0.00012,
      alpha: Math.random() * 0.36 + 0.05,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const storm = () => {
      stormRef.current = 1;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      if (window.location.pathname === "/" && window.scrollY < height * 0.92) {
        raf = requestAnimationFrame(render);
        return;
      }
      frame += reduced ? 0.08 : 1;
      stormRef.current *= 0.982;
      const isNight = new Date().getHours() < 6 || new Date().getHours() >= 19;
      const particleBoost = audioOn ? 2.2 : 1;

      for (const particle of particles) {
        particle.y -= particle.speed * particleBoost * (1 + stormRef.current * 8);
        particle.x += Math.sin(frame * 0.002 + particle.y * 8) * 0.000025;
        if (particle.y < -0.02) {
          particle.y = 1.02;
          particle.x = Math.random();
        }
        context.beginPath();
        context.fillStyle = `rgba(43,168,160,${particle.alpha * (isNight ? 1.25 : 0.8)})`;
        context.arc(particle.x * width, particle.y * height, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      const angleY = frame * 0.0021;
      const angleX = Math.sin(frame * 0.0011) * 0.3;
      const breath = 1 + Math.sin(frame * 0.018) * 0.035;
      const scale = Math.min(width, height) * (0.115 + stormRef.current * 0.025) * breath;
      const cx = width * (width < 720 ? 0.5 : 0.72);
      const cy = height * 0.49;

      const projected = vertices.map(([x0, y0, z0]) => {
        const x1 = x0 * Math.cos(angleY) - z0 * Math.sin(angleY);
        const z1 = x0 * Math.sin(angleY) + z0 * Math.cos(angleY);
        const y1 = y0 * Math.cos(angleX) - z1 * Math.sin(angleX);
        const z2 = y0 * Math.sin(angleX) + z1 * Math.cos(angleX);
        const perspective = 3.8 / (4.8 + z2);
        return [cx + x1 * scale * perspective, cy + y1 * scale * perspective] as const;
      });

      context.save();
      context.shadowColor = "rgba(43,168,160,.75)";
      context.shadowBlur = 18 + stormRef.current * 24;
      context.strokeStyle = `rgba(43,168,160,${0.25 + stormRef.current * 0.45})`;
      context.lineWidth = 0.8;
      for (const [a, b] of edges) {
        context.beginPath();
        context.moveTo(projected[a][0], projected[a][1]);
        context.lineTo(projected[b][0], projected[b][1]);
        context.stroke();
      }
      context.restore();

      const halo = context.createRadialGradient(cx, cy, 0, cx, cy, scale * 2.2);
      halo.addColorStop(0, `rgba(43,168,160,${0.045 + stormRef.current * 0.08})`);
      halo.addColorStop(1, "rgba(43,168,160,0)");
      context.fillStyle = halo;
      context.fillRect(cx - scale * 2.2, cy - scale * 2.2, scale * 4.4, scale * 4.4);
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("wbs-frequency", storm);
    resize();
    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("wbs-frequency", storm);
    };
  }, [audioOn]);

  return <canvas ref={canvasRef} className="geometry-field" aria-hidden="true" />;
}

function Entrance({ onComplete }: { onComplete: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const leave = useCallback(() => {
    setLeaving(true);
    window.setTimeout(onComplete, 850);
  }, [onComplete]);

  useEffect(() => {
    const timer = window.setTimeout(leave, 4300);
    return () => window.clearTimeout(timer);
  }, [leave]);

  return (
    <div className={`entrance ${leaving ? "entrance--leaving" : ""}`}>
      <div className="entrance-sigil" aria-hidden="true">
        <span>🜄</span>
      </div>
      <div className="entrance-line" />
      <p className="entrance-wordmark">WHOLE BODY / STUDIOS</p>
      <button className="entrance-skip" onClick={leave}>ENTER</button>
    </div>
  );
}

const navLinks = [
  ["/", "Manifesto"],
  ["/catalog", "Catalog"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-glyph">🜄</p>
        <p className="footer-oath" aria-label="So It Is Built. So It Holds. So It Is.">
          SO IT <span data-alt="FORGED">BUILT</span>. SO IT <span data-alt="ENDURES">HOLDS</span>. SO IT <span data-alt="REMAINS">IS</span>. 🍀
        </p>
      </div>
      <div className="footer-meta">
        <p>WHOLE BODY GUILD LLC · CALIFORNIA</p>
        <div><Link href="/privacy">PRIVACY</Link><Link href="/terms">TERMS</Link></div>
      </div>
    </footer>
  );
}

export function SiteExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [entrance, setEntrance] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [secret, setSecret] = useState(false);
  const [studioStatus, setStudioStatus] = useState("SYSTEMS — STANDING BY");
  const audioRef = useRef<AudioContext | null>(null);
  const audioNodes = useRef<{ oscillator: OscillatorNode; gain: GainNode } | null>(null);
  const clickTimes = useRef<number[]>([]);

  useEffect(() => {
    const seen = sessionStorage.getItem("wbs-entrance");
    const timer = window.setTimeout(() => setEntrance(!seen), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      const hour = new Date().getHours();
      setStudioStatus(hour >= 10 && hour < 18
        ? "RECORDING — DESERT STUDIO"
        : hour >= 18 && hour < 23
          ? "MIXING — NIGHT ROOM"
          : "SYSTEMS — STANDING BY");
    };
    updateStatus();
    const interval = window.setInterval(updateStatus, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let buffer = "";
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select")) return;
      buffer = `${buffer}${event.key.toUpperCase()}`.slice(-9);
      if (buffer === "FREQUENCY") {
        window.dispatchEvent(new Event("wbs-frequency"));
        setSecret(true);
        window.setTimeout(() => setSecret(false), 5000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const bell = () => {
      if (!audioOn || !audioRef.current) return;
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.055, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    };
    window.addEventListener("wbs-bell", bell);
    return () => window.removeEventListener("wbs-bell", bell);
  }, [audioOn]);

  const toggleAudio = async () => {
    if (audioOn) {
      audioNodes.current?.gain.gain.setTargetAtTime(0.0001, audioRef.current?.currentTime ?? 0, 0.25);
      setAudioOn(false);
      return;
    }
    const context = audioRef.current ?? new AudioContext();
    audioRef.current = context;
    await context.resume();
    if (!audioNodes.current) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 48;
      gain.gain.value = 0.0001;
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      audioNodes.current = { oscillator, gain };
    }
    audioNodes.current.gain.gain.setTargetAtTime(0.018, context.currentTime, 0.7);
    setAudioOn(true);
    window.dispatchEvent(new Event("wbs-frequency"));
  };

  const completeEntrance = () => {
    sessionStorage.setItem("wbs-entrance", "seen");
    setEntrance(false);
  };

  const glyphClick = () => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current.filter((time) => now - time < 700), now];
    if (clickTimes.current.length >= 3) {
      setSecret(true);
      window.dispatchEvent(new Event("wbs-frequency"));
      clickTimes.current = [];
      window.setTimeout(() => setSecret(false), 5500);
    }
  };

  return (
    <>
      <GeometryField audioOn={audioOn} />
      <div className="atmosphere-grain" aria-hidden="true" />
      {entrance && <Entrance onComplete={completeEntrance} />}
      <header className="site-header">
        <button className="brand" onClick={() => setSwitcherOpen(true)} aria-label="Open Whole Body product switcher">
          <span className="brand-mark" onClick={glyphClick}>🜄</span>
          <span>WHOLE BODY<span>/STUDIOS</span></span>
          <span className="brand-grid" aria-hidden="true">••<br />••</span>
        </button>
        <nav className={menuOpen ? "nav-links nav-links--open" : "nav-links"} aria-label="Primary navigation">
          {navLinks.map(([href, label]) => (
            <Link onClick={() => setMenuOpen(false)} className={pathname === href ? "active" : ""} href={href} key={href}>{label}</Link>
          ))}
          <Link className="nav-apply" href="/apply" onClick={() => setMenuOpen(false)}>Apply</Link>
        </nav>
        <div className="header-tools">
          <span className="studio-status"><i />{studioStatus}</span>
          <button className={`sound-toggle ${audioOn ? "sound-toggle--on" : ""}`} onClick={toggleAudio} aria-pressed={audioOn} aria-label="Toggle ambient sound">
            SOUND {audioOn ? "ON" : "OFF"}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>MENU</button>
        </div>
      </header>
      {switcherOpen && (
        <div className="product-switcher" role="dialog" aria-modal="true" aria-label="Whole Body constellation">
          <button className="switcher-close" onClick={() => setSwitcherOpen(false)}>CLOSE ×</button>
          <div className="switcher-inner">
            <p className="eyebrow">THE CONSTELLATION / FIVE RAYS</p>
            <h2>ONE BODY.<br />FIVE SYSTEMS.</h2>
            <div className="ray-list">
              <a href="https://wholebody.earth"><span>00</span><strong>WHOLE</strong><em>All Elements / Root</em></a>
              <a href="https://wholebody.foundation"><span>01</span><strong>EARTH</strong><em>Foundation</em></a>
              <div className="ray-active" data-domain="wholebody.studio"><span>02</span><strong>WATER</strong><em>Studios / You are here</em></div>
              <a href="https://wholebody.community"><span>03</span><strong>FIRE</strong><em>Presence</em></a>
              <a href="https://wholebody.press"><span>04</span><strong>AIR</strong><em>Press</em></a>
              <a href="https://wholebody.law"><span>05</span><strong>ETHER</strong><em>Guardian</em></a>
            </div>
          </div>
        </div>
      )}
      {secret && <div className="secret-marquee">THE FREQUENCY WAS NEVER LOST. IT WAS HELD IN THE BODY.</div>}
      <main>{children}</main>
      <Footer />
    </>
  );
}
