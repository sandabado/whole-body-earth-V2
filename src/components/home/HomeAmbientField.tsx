"use client";

import { useEffect, useState } from "react";

const TOP_FIELD_COLOR = "#635985";

const AMBIENT_SECTIONS = [
  { id: "hero", color: TOP_FIELD_COLOR },
  { id: "five-bodies", color: TOP_FIELD_COLOR },
  { id: "presence", color: "#d16b45" },
  { id: "press", color: "#d4af37" },
  { id: "studios", color: "#2ba8a0" },
  { id: "foundation", color: "#84a66e" },
  { id: "guardian", color: "#8f5bff" },
  { id: "apply", color: "#ff78c4" },
] as const;

/** One continuous radial atmosphere, tuned to the section at the viewport center. */
export function HomeAmbientField() {
  const [color, setColor] = useState<string>(AMBIENT_SECTIONS[0].color);

  useEffect(() => {
    const updateColor = () => {
      const focusLine = window.scrollY + window.innerHeight / 2;
      const next = AMBIENT_SECTIONS.find(({ id }) => {
        const section = document.getElementById(id);
        return section ? focusLine >= section.offsetTop && focusLine < section.offsetTop + section.offsetHeight : false;
      })?.color ?? AMBIENT_SECTIONS[0].color;
      setColor((current) => current === next ? current : next);
    };

    updateColor();
    window.addEventListener("scroll", updateColor, { passive: true });
    window.addEventListener("resize", updateColor);
    return () => {
      window.removeEventListener("scroll", updateColor);
      window.removeEventListener("resize", updateColor);
    };
  }, []);

  return <div aria-hidden="true" className="home-ambient-field" style={{ "--ambient-color": color } as React.CSSProperties} />;
}
