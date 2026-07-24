import type { PressTitle } from "./press-catalog";

export function BookCover({
  title,
  compact = false,
}: {
  title: PressTitle;
  compact?: boolean;
}) {
  return (
    <div className={`press-book press-book--${title.cover.tone} ${compact ? "press-book--compact" : ""}`} aria-label={`${title.title} book cover`}>
      <span className="press-book__folio">{title.cover.folio}</span>
      <span className="press-book__glyph" aria-hidden="true">{title.cover.glyph}</span>
      <div>
        <small>{title.imprint}</small>
        <strong>{title.title}</strong>
        {title.subtitle && <em>{title.subtitle}</em>}
      </div>
      <span className="press-book__mark">WHOLE BODY PRESS · 🜁</span>
    </div>
  );
}
