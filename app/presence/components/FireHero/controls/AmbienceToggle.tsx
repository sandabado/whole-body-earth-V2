"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const DEFAULT_STORAGE_KEY = "presence:fire-ambience";

type PlaybackState = "idle" | "starting" | "playing" | "error";

interface FireSoundscape {
  destroy: () => void;
  start: (volume: number) => Promise<void>;
  stop: () => void;
}

type WindowWithWebkitAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function createNoiseBuffer(context: AudioContext, duration = 3) {
  const frameCount = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);
  let previous = 0;

  for (let index = 0; index < frameCount; index += 1) {
    // A lightly correlated signal feels more organic than pure white noise.
    const white = Math.random() * 2 - 1;
    previous = previous * 0.82 + white * 0.18;
    channel[index] = previous;
  }

  return buffer;
}

function holdAudioParam(parameter: AudioParam, time: number) {
  if (typeof parameter.cancelAndHoldAtTime === "function") {
    parameter.cancelAndHoldAtTime(time);
    return;
  }

  const currentValue = parameter.value;
  parameter.cancelScheduledValues(time);
  parameter.setValueAtTime(currentValue, time);
}

function createFireSoundscape(): FireSoundscape {
  const AudioContextClass =
    window.AudioContext ??
    (window as WindowWithWebkitAudio).webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("Web Audio is unavailable in this browser.");
  }

  const context = new AudioContextClass();
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const noiseBuffer = createNoiseBuffer(context);
  const fireSource = context.createBufferSource();
  const breathSource = context.createBufferSource();
  const fireBand = context.createBiquadFilter();
  const fireLowPass = context.createBiquadFilter();
  const fireGain = context.createGain();
  const breathLowPass = context.createBiquadFilter();
  const breathGain = context.createGain();
  const breathOscillator = context.createOscillator();
  const breathGainDepth = context.createGain();
  const breathFilterDepth = context.createGain();

  master.gain.value = 0;
  compressor.threshold.value = -22;
  compressor.knee.value = 18;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.02;
  compressor.release.value = 0.4;
  master.connect(compressor);
  compressor.connect(context.destination);

  fireSource.buffer = noiseBuffer;
  fireSource.loop = true;
  fireBand.type = "bandpass";
  fireBand.frequency.value = 430;
  fireBand.Q.value = 0.55;
  fireLowPass.type = "lowpass";
  fireLowPass.frequency.value = 1650;
  fireLowPass.Q.value = 0.4;
  fireGain.gain.value = 0.4;
  fireSource.connect(fireBand);
  fireBand.connect(fireLowPass);
  fireLowPass.connect(fireGain);
  fireGain.connect(master);

  breathSource.buffer = noiseBuffer;
  breathSource.loop = true;
  breathLowPass.type = "lowpass";
  breathLowPass.frequency.value = 190;
  breathLowPass.Q.value = 0.7;
  breathGain.gain.value = 0.1;
  breathSource.connect(breathLowPass);
  breathLowPass.connect(breathGain);
  breathGain.connect(master);

  breathOscillator.type = "sine";
  breathOscillator.frequency.value = 0.105;
  breathGainDepth.gain.value = 0.045;
  breathFilterDepth.gain.value = 55;
  breathOscillator.connect(breathGainDepth);
  breathGainDepth.connect(breathGain.gain);
  breathOscillator.connect(breathFilterDepth);
  breathFilterDepth.connect(breathLowPass.frequency);

  fireSource.start(0, Math.random() * noiseBuffer.duration);
  breathSource.start(0, Math.random() * noiseBuffer.duration);
  breathOscillator.start();

  let active = false;
  let destroyed = false;
  let crackleTimer = 0;
  let suspendTimer = 0;
  let operation = 0;

  const scheduleCrackle = () => {
    if (!active || destroyed) return;

    const delay = 180 + Math.random() * 760;
    crackleTimer = window.setTimeout(() => {
      if (!active || destroyed) return;

      const now = context.currentTime;
      const duration = 0.018 + Math.random() * 0.055;
      const frames = Math.max(2, Math.floor(context.sampleRate * duration));
      const crackleBuffer = context.createBuffer(1, frames, context.sampleRate);
      const values = crackleBuffer.getChannelData(0);

      for (let index = 0; index < frames; index += 1) {
        const envelope = 1 - index / frames;
        values[index] = (Math.random() * 2 - 1) * envelope * envelope;
      }

      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = crackleBuffer;
      filter.type = "highpass";
      filter.frequency.value = 900 + Math.random() * 1800;
      filter.Q.value = 0.6;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(
        0.025 + Math.random() * 0.075,
        now + 0.004,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.addEventListener("ended", () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      });
      source.start(now);
      scheduleCrackle();
    }, delay);
  };

  return {
    async start(volume) {
      if (destroyed) throw new Error("The soundscape has been closed.");
      operation += 1;
      window.clearTimeout(suspendTimer);
      window.clearTimeout(crackleTimer);
      await context.resume();
      active = true;
      const now = context.currentTime;
      holdAudioParam(master.gain, now);
      master.gain.linearRampToValueAtTime(
        Math.min(0.5, Math.max(0.02, volume)),
        now + 1.2,
      );
      scheduleCrackle();
    },
    stop() {
      if (destroyed) return;
      active = false;
      operation += 1;
      const stopOperation = operation;
      window.clearTimeout(crackleTimer);
      window.clearTimeout(suspendTimer);
      const now = context.currentTime;
      holdAudioParam(master.gain, now);
      master.gain.linearRampToValueAtTime(0, now + 0.55);
      suspendTimer = window.setTimeout(() => {
        if (!active && !destroyed && stopOperation === operation) {
          void context.suspend().catch(() => undefined);
        }
      }, 650);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      active = false;
      window.clearTimeout(crackleTimer);
      window.clearTimeout(suspendTimer);
      try {
        fireSource.stop();
        breathSource.stop();
        breathOscillator.stop();
      } catch {
        // A source may already have stopped while the component was unmounting.
      }
      fireSource.disconnect();
      breathSource.disconnect();
      breathOscillator.disconnect();
      master.disconnect();
      compressor.disconnect();
      void context.close().catch(() => undefined);
    },
  };
}

const buttonStyle: CSSProperties = {
  alignItems: "center",
  backdropFilter: "blur(14px)",
  background: "rgba(5, 5, 5, 0.56)",
  border: "1px solid rgba(237, 237, 237, 0.2)",
  borderRadius: 2,
  color: "rgba(237, 237, 237, 0.72)",
  cursor: "pointer",
  display: "inline-flex",
  fontFamily: "var(--font-mono), monospace",
  fontSize: 8,
  fontWeight: 500,
  gap: 9,
  letterSpacing: "0.15em",
  minHeight: 44,
  padding: "10px 13px",
  textTransform: "uppercase",
  transition: "border-color 180ms ease, color 180ms ease, opacity 180ms ease",
};

const visuallyHiddenStyle: CSSProperties = {
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
};

export interface AmbienceToggleProps {
  className?: string;
  /** Delay before the optional control is revealed. */
  delayMs?: number;
  /** Device-local preference key. */
  storageKey?: string;
  /** Master output level from 0.02 to 0.5. */
  volume?: number;
}

/**
 * An opt-in, procedural fire-and-breath soundscape. It creates no AudioContext
 * and downloads no media until a user gesture explicitly enables sound.
 */
export function AmbienceToggle({
  className,
  delayMs = 5000,
  storageKey = DEFAULT_STORAGE_KEY,
  volume = 0.18,
}: AmbienceToggleProps) {
  const [revealed, setRevealed] = useState(delayMs <= 0);
  const [enabled, setEnabled] = useState(false);
  const [playback, setPlayback] = useState<PlaybackState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const statusId = useId();
  const soundscapeRef = useRef<FireSoundscape | null>(null);
  const enabledRef = useRef(false);
  const startInFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let storedPreference = false;
    try {
      storedPreference = window.localStorage.getItem(storageKey) === "on";
    } catch {
      // Storage can be unavailable in private or highly restricted contexts.
    }

    enabledRef.current = storedPreference;
    const preferenceTimer = window.setTimeout(
      () => setEnabled(storedPreference),
      0,
    );
    const revealTimer = window.setTimeout(
      () => setRevealed(true),
      Math.max(0, delayMs),
    );

    return () => {
      mountedRef.current = false;
      window.clearTimeout(preferenceTimer);
      window.clearTimeout(revealTimer);
    };
  }, [delayMs, storageKey]);

  useEffect(
    () => () => {
      soundscapeRef.current?.destroy();
      soundscapeRef.current = null;
    },
    [],
  );

  const savePreference = useCallback(
    (nextEnabled: boolean) => {
      try {
        window.localStorage.setItem(storageKey, nextEnabled ? "on" : "off");
      } catch {
        // The current session still works when persistence is unavailable.
      }
    },
    [storageKey],
  );

  const startSoundscape = useCallback(async () => {
    if (!enabledRef.current || startInFlightRef.current) return;
    startInFlightRef.current = true;
    setPlayback("starting");
    setErrorMessage("");

    try {
      soundscapeRef.current ??= createFireSoundscape();
      await soundscapeRef.current.start(volume);
      if (!enabledRef.current) {
        soundscapeRef.current.stop();
        if (mountedRef.current) setPlayback("idle");
        return;
      }
      if (mountedRef.current) setPlayback("playing");
    } catch {
      if (!mountedRef.current) return;
      enabledRef.current = false;
      savePreference(false);
      setEnabled(false);
      setPlayback("error");
      setErrorMessage("Ambient sound is unavailable in this browser.");
    } finally {
      startInFlightRef.current = false;
    }
  }, [savePreference, volume]);

  // A persisted "on" preference is intent, not autoplay permission. The
  // soundscape resumes only after a fresh gesture, and never for a gesture on
  // this button that is trying to turn the preference off.
  useEffect(() => {
    if (!revealed || !enabled || playback !== "idle") return;

    const wakeFromPointer = (event: PointerEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return;
      void startSoundscape();
    };
    const wakeFromKeyboard = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (buttonRef.current?.contains(event.target as Node)) return;
      void startSoundscape();
    };

    window.addEventListener("pointerdown", wakeFromPointer);
    window.addEventListener("keydown", wakeFromKeyboard);
    return () => {
      window.removeEventListener("pointerdown", wakeFromPointer);
      window.removeEventListener("keydown", wakeFromKeyboard);
    };
  }, [enabled, playback, revealed, startSoundscape]);

  const handleToggle = () => {
    if (enabledRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      savePreference(false);
      soundscapeRef.current?.stop();
      setPlayback("idle");
      setErrorMessage("");
      return;
    }

    enabledRef.current = true;
    setEnabled(true);
    savePreference(true);
    void startSoundscape();
  };

  if (!revealed) return null;

  const isPlaying = playback === "playing";
  const visibleLabel = isPlaying
    ? "Sound on"
    : enabled
      ? "Sound ready"
      : "Sound off";
  const statusMessage = errorMessage
    ? errorMessage
    : isPlaying
      ? "Ambient fire and breath is playing."
      : enabled
        ? "Sound is preferred on and will begin after your next gesture."
        : "Ambient fire and breath is off.";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={className}
        aria-describedby={statusId}
        aria-label={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
        aria-pressed={enabled}
        onClick={handleToggle}
        style={{
          ...buttonStyle,
          borderColor: enabled
            ? "rgba(232, 84, 42, 0.72)"
            : buttonStyle.borderColor,
          color: enabled ? "#E8542A" : buttonStyle.color,
          opacity: playback === "starting" ? 0.7 : 1,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            alignItems: "center",
            display: "inline-flex",
            gap: 2,
            height: 14,
            justifyContent: "center",
            width: 14,
          }}
        >
          {[5, 11, 7].map((height, index) => (
            <span
              key={height}
              style={{
                background: "currentColor",
                borderRadius: 1,
                display: "block",
                height: isPlaying ? height : index === 1 ? 3 : 2,
                opacity: enabled ? 1 : 0.62,
                transition: "height 180ms ease",
                width: 2,
              }}
            />
          ))}
        </span>
        <span>{visibleLabel}</span>
      </button>
      <span
        id={statusId}
        role="status"
        aria-live="polite"
        style={visuallyHiddenStyle}
      >
        {statusMessage}
      </span>
    </>
  );
}

export default AmbienceToggle;
