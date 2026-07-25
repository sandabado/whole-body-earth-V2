"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./PillarShelf.module.css";
import FoundationShelf from "./shelves/FoundationShelf";
import GuardianShelf from "./shelves/GuardianShelf";
import PresenceShelf from "./shelves/PresenceShelf";
import PressShelf from "./shelves/PressShelf";
import {
  SHELF_ACCENTS,
  type ActivePillar,
  type ShelfId,
} from "./shelves/ShelfContent";
import StudiosShelf from "./shelves/StudiosShelf";
import WholeShelf from "./shelves/WholeShelf";

export type { ActivePillar, ShelfId } from "./shelves/ShelfContent";

type PillarShelfProps = {
  activePillar: ActivePillar | null;
  open: boolean;
  onClose: () => void;
  className?: string;
};

type ShelfProperties = CSSProperties & {
  "--shelf-accent": string;
  "--shelf-drag-y": string;
};

type DragState = {
  pointerId: number;
  startY: number;
};

const CLOSE_DURATION_MS = 500;
const DISMISS_THRESHOLD_PX = 100;

const shelfComponents: Record<ShelfId, () => React.ReactNode> = {
  presence: () => <PresenceShelf />,
  press: () => <PressShelf />,
  studios: () => <StudiosShelf />,
  foundation: () => <FoundationShelf />,
  guardian: () => <GuardianShelf />,
  whole: () => <WholeShelf />,
};

function asShelfId(activePillar: ActivePillar | null): ShelfId | null {
  return activePillar && activePillar !== "none" ? activePillar : null;
}

export function PillarShelf({
  activePillar,
  open,
  onClose,
  className,
}: PillarShelfProps) {
  const requestedPillar = asShelfId(activePillar);
  const [renderedPillar, setRenderedPillar] = useState<ShelfId>(requestedPillar ?? "whole");
  const [mounted, setMounted] = useState(Boolean(open && requestedPillar));
  const [presented, setPresented] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    if (!requestedPillar) return;
    const frame = window.requestAnimationFrame(() => setRenderedPillar(requestedPillar));
    return () => window.cancelAnimationFrame(frame);
  }, [requestedPillar]);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let closeTimer = 0;

    if (open && requestedPillar) {
      firstFrame = window.requestAnimationFrame(() => {
        setMounted(true);
        setDragY(0);
        secondFrame = window.requestAnimationFrame(() => setPresented(true));
      });
    } else {
      firstFrame = window.requestAnimationFrame(() => setPresented(false));
      const closeDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : CLOSE_DURATION_MS;
      closeTimer = window.setTimeout(() => setMounted(false), closeDuration);
    }

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(closeTimer);
    };
  }, [open, requestedPillar]);

  useEffect(() => {
    if (!open || !mounted) return;

    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, onClose, open]);

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
    dragRef.current = { pointerId: event.pointerId, startY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const continueDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    setDragY(Math.max(0, event.clientY - drag.startY));
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const releaseDistance = Math.max(0, event.clientY - drag.startY);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setDragging(false);

    if (releaseDistance >= DISMISS_THRESHOLD_PX) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  const cancelDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setDragY(0);
  };

  if (!mounted) return null;

  const Content = shelfComponents[renderedPillar];
  const shelfStyle = {
    "--shelf-accent": SHELF_ACCENTS[renderedPillar],
    "--shelf-drag-y": `${dragY}px`,
  } as ShelfProperties;

  return (
    <div
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      data-open={presented ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      data-pillar={renderedPillar}
      style={shelfStyle}
      aria-hidden={presented ? undefined : true}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label={`Close ${renderedPillar} shelf`}
        tabIndex={-1}
      />
      <div
        className={styles.sheet}
        role="dialog"
        aria-labelledby="pillar-shelf-heading"
      >
        <div
          className={styles.dragHandle}
          onPointerDown={beginDrag}
          onPointerMove={continueDrag}
          onPointerUp={finishDrag}
          onPointerCancel={cancelDrag}
          aria-hidden="true"
        >
          <i />
        </div>
        <button
          ref={closeRef}
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label={`Close ${renderedPillar} shelf`}
        >
          <span aria-hidden="true">✕</span>
        </button>
        <div className={styles.scrollRegion}>{Content()}</div>
      </div>
    </div>
  );
}

export default PillarShelf;
