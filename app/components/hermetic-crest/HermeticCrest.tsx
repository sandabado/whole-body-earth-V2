"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import styles from "./HermeticCrest.module.css";

type CrestPhase = "locked" | "turning" | "open";

interface HermeticCrestProps {
  size?: number;
  animate?: boolean;
  layerControls?: {
    outerSpeed?: number;
    mandalaSpeed?: number;
    fieldPulseSpeed?: number;
  };
  className?: string;
  onUnlock?: () => void;
}

type CrestStyle = CSSProperties & {
  "--crest-size": string;
  "--outer-speed": string;
  "--calibration-speed": string;
  "--mandala-speed": string;
  "--field-speed": string;
  "--node-speed": string;
  "--tilt-x": string;
  "--tilt-y": string;
};

const ELEMENTS = [
  { id: "air", label: "AIR", symbol: "🜁", x: 250, y: 103, color: "#c9a227" },
  { id: "fire", label: "FIRE", symbol: "🜂", x: 103, y: 250, color: "#e8542a" },
  { id: "water", label: "WATER", symbol: "🜄", x: 397, y: 250, color: "#2ba8a0" },
  { id: "earth", label: "EARTH", symbol: "🜃", x: 250, y: 397, color: "#84a66e" },
  { id: "ether", label: "ETHER", symbol: "⊙", x: 250, y: 250, color: "#8b6fd6" },
] as const;

const DODECAGON = Array.from({ length: 12 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 12 - Math.PI / 2;
  return `${250 + Math.cos(angle) * 142},${250 + Math.sin(angle) * 142}`;
}).join(" ");

const INNER_DODECAGON = Array.from({ length: 12 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 12 - Math.PI / 2 + Math.PI / 12;
  return `${250 + Math.cos(angle) * 119},${250 + Math.sin(angle) * 119}`;
}).join(" ");

const PENTAGON = Array.from({ length: 5 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 5 - Math.PI / 2;
  return `${250 + Math.cos(angle) * 73},${250 + Math.sin(angle) * 73}`;
}).join(" ");

export default function HermeticCrest({
  size = 320,
  animate = true,
  layerControls = {},
  className,
  onUnlock,
}: HermeticCrestProps) {
  const [phase, setPhase] = useState<CrestPhase>("locked");
  const [entered, setEntered] = useState(false);
  const [running, setRunning] = useState(true);
  const crestRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);
  const instanceId = useId().replaceAll(":", "");
  const metalId = `${instanceId}-metal`;
  const patinaId = `${instanceId}-patina`;
  const glowId = `${instanceId}-glow`;
  const textureId = `${instanceId}-texture`;
  const mottoPathId = `${instanceId}-motto`;
  const {
    outerSpeed = 150,
    mandalaSpeed = 110,
    fieldPulseSpeed = 6,
  } = layerControls;
  const crestStyle: CrestStyle = {
    "--crest-size": `${size}px`,
    "--outer-speed": `${outerSpeed}s`,
    "--calibration-speed": `${outerSpeed * .68}s`,
    "--mandala-speed": `${mandalaSpeed}s`,
    "--field-speed": `${fieldPulseSpeed}s`,
    "--node-speed": `${fieldPulseSpeed * 3}s`,
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    return () => {
      window.cancelAnimationFrame(frame);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const crest = crestRef.current;
    if (!crest || !animate) return;
    let inView = true;
    const update = () => setRunning(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { threshold: .06 });
    observer.observe(crest);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [animate]);

  const turnKey = () => {
    if (phase === "turning") return;
    if (phase === "open") {
      setPhase("locked");
      return;
    }
    setPhase("turning");
    timerRef.current = window.setTimeout(() => {
      setPhase("open");
      onUnlock?.();
    }, 2_650);
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    if (!animate || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${(-vertical * 3).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(horizontal * 3).toFixed(2)}deg`);
  };

  const reset = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  const status = phase === "open" ? "Field open" : phase === "turning" ? "Key turning" : "Turn the key";

  return (
    <button
      ref={crestRef}
      type="button"
      className={`${styles.crest} ${entered ? styles.entered : ""} ${className ?? ""}`}
      style={crestStyle}
      data-phase={phase}
      data-animate={animate ? "true" : "false"}
      data-running={animate && running ? "true" : "false"}
      aria-label={phase === "open" ? "Close the Whole Body field" : "Turn the ancient key and open the Whole Body field"}
      aria-pressed={phase === "open"}
      onClick={turnKey}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <span className={styles.interfaceLabel} aria-hidden="true">WB.E / HERMETIC INTERFACE</span>
      <span className={styles.coordinate} aria-hidden="true">05-FIELD / QX-01</span>
      <span className={styles.svgShell}>
        <svg viewBox="0 0 500 500" role="img" aria-labelledby={`${instanceId}-title ${instanceId}-description`}>
          <title id={`${instanceId}-title`}>The Whole Body ancient key</title>
          <desc id={`${instanceId}-description`}>An aged metal key and lock organized as a Guardian-centered Quincunx, with Fire, Air, Water, and Earth around Ether.</desc>
          <defs>
            <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6f5d32" />
              <stop offset=".22" stopColor="#e0c866" />
              <stop offset=".48" stopColor="#8b6e2c" />
              <stop offset=".72" stopColor="#d4af37" />
              <stop offset="1" stopColor="#4e4025" />
            </linearGradient>
            <linearGradient id={patinaId} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#162d28" />
              <stop offset=".35" stopColor="#b87333" />
              <stop offset=".65" stopColor="#d4af37" />
              <stop offset="1" stopColor="#213e36" />
            </linearGradient>
            <radialGradient id={glowId}>
              <stop offset="0" stopColor="#9b7fff" stopOpacity=".9" />
              <stop offset=".35" stopColor="#6d4aff" stopOpacity=".38" />
              <stop offset="1" stopColor="#6d4aff" stopOpacity="0" />
            </radialGradient>
            <filter id={textureId} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="2" seed="17" result="noise" />
              <feColorMatrix in="noise" type="matrix" values=".7 0 0 0 .1  0 .52 0 0 .08  0 0 .34 0 .03  0 0 0 .24 0" result="grain" />
              <feBlend in="SourceGraphic" in2="grain" mode="soft-light" />
            </filter>
            <path id={mottoPathId} d="M 110 388 Q 250 472 390 388" fill="none" />
          </defs>

          <g className={styles.instrument}>
            <circle className={styles.fieldGlow} cx="250" cy="250" r="190" fill={`url(#${glowId})`} />

            <g className={styles.outerMechanism} filter={`url(#${textureId})`}>
              <path className={styles.serpentBody} d="M 218 26 C 107 42 24 135 24 250 C 24 375 125 476 250 476 C 375 476 476 375 476 250 C 476 129 381 30 261 24" fill="none" stroke={`url(#${metalId})`} strokeWidth="8" strokeLinecap="round" />
              <path className={styles.serpentHead} d="M 215 25 L 239 14 L 232 34 L 244 48 L 219 43 L 203 51 L 207 34 Z" fill={`url(#${metalId})`} stroke="#4a3d23" strokeWidth="1" />
              <circle cx="225" cy="29" r="2.4" fill="#8b6fd6" />
              <circle cx="250" cy="250" r="214" fill="none" stroke={`url(#${patinaId})`} strokeWidth="1" opacity=".5" />
            </g>

            <g className={styles.calibrationRing}>
              {Array.from({ length: 60 }, (_, index) => (
                <line
                  key={index}
                  x1="250"
                  y1={index % 5 === 0 ? 45 : 49}
                  x2="250"
                  y2="57"
                  transform={`rotate(${index * 6} 250 250)`}
                  stroke={index % 5 === 0 ? "#d4af37" : "#7b6b3e"}
                  strokeWidth={index % 5 === 0 ? "1.2" : ".55"}
                  opacity={index % 5 === 0 ? ".7" : ".38"}
                />
              ))}
            </g>

            <g className={styles.mandala}>
              <polygon points={DODECAGON} fill="none" stroke="#c9a227" strokeWidth="1" opacity=".38" />
              <polygon points={INNER_DODECAGON} fill="none" stroke="#c9a227" strokeWidth=".7" strokeDasharray="3 7" opacity=".34" />
              {Array.from({ length: 12 }, (_, index) => (
                <line key={index} x1="250" y1="250" x2="250" y2="108" transform={`rotate(${index * 30} 250 250)`} stroke="#c9a227" strokeWidth=".45" opacity=".18" />
              ))}
            </g>

            <g className={styles.quincunxGeometry}>
              <polygon points="250,103 397,250 250,397 103,250" fill="none" stroke="#ededed" strokeWidth=".7" opacity=".2" />
              <line x1="250" y1="250" x2="250" y2="103" />
              <line x1="250" y1="250" x2="103" y2="250" />
              <line x1="250" y1="250" x2="397" y2="250" />
              <line x1="250" y1="250" x2="250" y2="397" />
              <polygon points={PENTAGON} fill="none" stroke="#8b6fd6" strokeWidth=".8" opacity=".28" />
            </g>

            <g className={styles.elementNodes}>
              {ELEMENTS.map((element, index) => (
                <g
                  key={element.id}
                  className={`${styles.elementNode} ${element.id === "ether" ? styles.observerNode : ""}`}
                  transform={`translate(${element.x} ${element.y})`}
                  style={{
                    "--node-color": element.color,
                    "--node-delay": `${index * 80}ms`,
                    "--node-unlock-delay": `${700 + index * 140}ms`,
                  } as CSSProperties}
                >
                  <circle r={element.id === "ether" ? 46 : 25} />
                  <circle className={styles.nodeOrbit} r={element.id === "ether" ? 36 : 18} />
                  <text y="1" dominantBaseline="middle" textAnchor="middle">{element.symbol}</text>
                  {element.id !== "ether" && <text className={styles.nodeLabel} y="39" dominantBaseline="middle" textAnchor="middle">{element.label}</text>}
                </g>
              ))}
            </g>

            <g className={styles.lockMechanism}>
              <circle cx="250" cy="250" r="60" fill="#070708" stroke={`url(#${metalId})`} strokeWidth="5" filter={`url(#${textureId})`} />
              <circle cx="250" cy="250" r="51" fill="none" stroke="#6f5d32" strokeWidth="1" strokeDasharray="2 5" />
              {Array.from({ length: 5 }, (_, index) => (
                <g key={index} transform={`rotate(${index * 72} 250 250)`}>
                  <rect
                    className={styles.lockPin}
                    x="246"
                    y="174"
                    width="8"
                    height="23"
                    rx="2"
                    fill={`url(#${metalId})`}
                    style={{ "--pin-delay": `${420 + index * 80}ms` } as CSSProperties}
                  />
                </g>
              ))}
              <g className={styles.aperture}>
                {Array.from({ length: 5 }, (_, index) => (
                  <path key={index} d="M250 207 L271 235 L258 253 L232 236 Z" transform={`rotate(${index * 72} 250 250)`} fill="#17131f" stroke="#8b6fd6" strokeWidth=".7" opacity=".96" />
                ))}
              </g>
              <circle className={styles.observerCore} cx="250" cy="250" r="13" fill="#6d4aff" />
            </g>

            <g className={styles.keyAssembly} filter={`url(#${textureId})`}>
              <circle cx="250" cy="250" r="29" fill="none" stroke={`url(#${metalId})`} strokeWidth="9" />
              <circle cx="250" cy="250" r="12" fill="#050505" stroke="#8b6fd6" strokeWidth="1" />
              <path d="M244 278 L256 278 L256 337 L273 337 L273 327 L286 327 L286 351 L264 351 L264 362 L244 362 Z" fill={`url(#${metalId})`} stroke="#4d4025" strokeWidth="1" />
              <path d="M250 286 L250 350" stroke="#f0d774" strokeWidth="1" opacity=".48" />
            </g>

            <g className={styles.inscriptions}>
              <text x="250" y="71" textAnchor="middle">OBSERVER-CENTERED / KEY 05</text>
              <text x="250" y="442" textAnchor="middle">
                <textPath href={`#${mottoPathId}`} startOffset="50%" textAnchor="middle">GEOMETRIA TENET · FIVE FIELDS / ONE BODY</textPath>
              </text>
            </g>
          </g>
        </svg>
      </span>
      <span className={styles.status} aria-live="polite"><i aria-hidden="true" />{status}</span>
    </button>
  );
}
