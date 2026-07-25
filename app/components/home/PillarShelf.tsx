"use client";

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ComponentType,
  type LazyExoticComponent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import styles from "./PillarShelf.module.css";
import {
  SHELF_ACCENTS,
  type ActivePillar,
  type ShelfId,
} from "./shelves/ShelfContent";

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
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type LazyShelfComponent = LazyExoticComponent<ComponentType>;

const shelfComponents = {
  presence: lazy(() => import("./shelves/PresenceShelf")),
  press: lazy(() => import("./shelves/PressShelf")),
  studios: lazy(() => import("./shelves/StudiosShelf")),
  foundation: lazy(() => import("./shelves/FoundationShelf")),
  guardian: lazy(() => import("./shelves/GuardianShelf")),
  whole: lazy(() => import("./shelves/WholeShelf")),
} satisfies Record<ShelfId, LazyShelfComponent>;

const shelfNames: Record<ShelfId, string> = {
  presence: "Presence",
  press: "Press",
  studios: "Studios",
  foundation: "Foundation",
  guardian: "Guardian",
  whole: "NØW",
};

function focusableElements(dialog: HTMLDialogElement): HTMLElement[] {
  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element.tabIndex >= 0
      && !element.hidden
      && element.getAttribute("aria-hidden") !== "true"
      && element.getClientRects().length > 0,
  );
}

function ShelfLoading({ pillar }: { pillar: ShelfId }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <h2 id="pillar-shelf-heading">Loading {shelfNames[pillar]} shelf</h2>
      <span aria-hidden="true" />
    </div>
  );
}

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
  const dialogRef = useRef<HTMLDialogElement>(null);
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
    if (!mounted) return;

    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [mounted]);

  useEffect(() => {
    if (!open || !mounted || !presented) return;

    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = focusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (!dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted, open, presented]);

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
    <dialog
      ref={dialogRef}
      id="whole-body-command-shelf"
      className={`${styles.root}${className ? ` ${className}` : ""}`}
      data-open={presented ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      data-pillar={renderedPillar}
      style={shelfStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pillar-shelf-heading"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
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
        <div className={styles.scrollRegion}>
          <Suspense fallback={<ShelfLoading pillar={renderedPillar} />}>
            <Content />
          </Suspense>
        </div>
      </div>
    </dialog>
  );
}

export default PillarShelf;
