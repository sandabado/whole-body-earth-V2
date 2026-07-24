import Image from "next/image";
import type { ReactNode } from "react";

type FrameProps = { src: string; alt: string; children?: ReactNode; className?: string; priority?: boolean; sizes?: string };

/** Wide, place-led imagery for land, sessions, and gatherings. */
export function FieldFrame({ src, alt, children, className = "", priority = false, sizes = "(min-width: 1024px) 50vw, 100vw" }: FrameProps) {
  return <div className={`group relative aspect-video overflow-hidden bg-void ${className}`}><Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover transition duration-700 group-hover:scale-[1.035]" /><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />{children}</div>;
}

/** Square or portrait artwork for albums, books, editions, and products. */
export function ObjectFrame({ src, alt, children, className = "", priority = false, sizes = "(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw" }: FrameProps) {
  return <div className={`group relative aspect-square overflow-hidden bg-void ${className}`}><Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover transition duration-700 group-hover:scale-[1.045]" /><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />{children}</div>;
}

/** Text, geometry, waveforms, and embedded playback live in this media mode. */
export function SignalFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(143,91,255,.24),transparent_42%),linear-gradient(135deg,#09080d,#171022)] ${className}`}>{children}</div>;
}
