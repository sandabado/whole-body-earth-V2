"use client";

import { useEffect, useState } from "react";
import type { PressFormat } from "./press-catalog";

export function FormatSelector({ title, formats }: { title: string; formats: PressFormat[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(formats[0]?.id ?? "digital");

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const format = formats.find((item) => item.id === selected) ?? formats[0];
  const orderSubject = encodeURIComponent(`${title} — ${format?.label ?? "edition"} reservation`);

  return (
    <>
      <button className="button gold" onClick={() => setOpen(true)}>CHOOSE AN EDITION →</button>
      {open && (
        <div className="format-modal" role="dialog" aria-modal="true" aria-labelledby="format-title" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setOpen(false);
        }}>
          <div className="format-modal__panel">
            <button className="format-modal__close" onClick={() => setOpen(false)} aria-label="Close format selector">CLOSE ×</button>
            <p className="eyebrow">SELECT FORMAT</p>
            <h2 id="format-title">{title}</h2>
            <div className="format-options">
              {formats.map((item) => (
                <label key={item.id} className={selected === item.id ? "selected" : ""}>
                  <input type="radio" name="format" value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)} />
                  <span><strong>{item.label}</strong><small>{item.detail}</small>{item.availability && <em>{item.availability}</em>}</span>
                  <b>${item.price}</b>
                </label>
              ))}
            </div>
            <p className="format-note">Checkout opens with the first-edition release. Reservations are confirmed personally and do not charge your card.</p>
            <a className="button gold" href={`mailto:orders@wholebody.press?subject=${orderSubject}`}>RESERVE {format?.label.toUpperCase()} →</a>
          </div>
        </div>
      )}
    </>
  );
}
