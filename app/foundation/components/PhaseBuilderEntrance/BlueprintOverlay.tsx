"use client";

import { useEffect, useRef } from "react";

export default function BlueprintOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const context = canvas.getContext("2d");
    if (!parent || !context) return;

    const draw = () => {
      const rect = parent.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const grid = 40;
      for (let x = 0; x <= rect.width; x += grid) {
        context.strokeStyle = x % (grid * 5) === 0 ? "rgba(132,166,110,.1)" : "rgba(132,166,110,.045)";
        context.lineWidth = x % (grid * 5) === 0 ? 1.2 : 0.7;
        context.beginPath();
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, rect.height);
        context.stroke();
      }
      for (let y = 0; y <= rect.height; y += grid) {
        context.strokeStyle = y % (grid * 5) === 0 ? "rgba(132,166,110,.1)" : "rgba(132,166,110,.045)";
        context.lineWidth = y % (grid * 5) === 0 ? 1.2 : 0.7;
        context.beginPath();
        context.moveTo(0, y + 0.5);
        context.lineTo(rect.width, y + 0.5);
        context.stroke();
      }

      context.fillStyle = "rgba(147,153,140,.32)";
      for (let y = 0; y <= rect.height; y += grid) context.fillRect(0, y, y % 200 === 0 ? 12 : 7, 1);
      for (let x = 0; x <= rect.width; x += grid) context.fillRect(x, 0, 1, x % 200 === 0 ? 12 : 7);

      context.font = "8px monospace";
      context.fillStyle = "rgba(147,153,140,.28)";
      for (let y = 200; y < rect.height; y += 200) context.fillText(String(y).padStart(4, "0"), 15, y + 3);
      for (let x = 200; x < rect.width; x += 200) context.fillText(String(x).padStart(4, "0"), x + 5, 18);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  return <canvas ref={canvasRef} className="phase-blueprint" aria-hidden="true" />;
}
