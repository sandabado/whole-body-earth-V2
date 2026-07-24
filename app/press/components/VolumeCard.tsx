import Link from "next/link";
import type { Volume } from "./press-data";

export function VolumeCard({ volume }: { volume: Volume }) {
  return <Link href={`/press/library/${volume.slug}`} className="volume-card">
    <span className="hud tl"/><span className="hud tr"/><span className="hud bl"/><span className="hud br"/>
    <div className="cover-top"><span>VOL. {volume.num}</span><span>{volume.status}</span></div>
    <div className="cover-glyph" aria-hidden="true">{volume.glyph}</div>
    <div><p>{volume.element} · {volume.solid}</p><h3>{volume.title}</h3><blockquote>{volume.mantra}</blockquote></div>
    <span className="cover-link">OPEN VOLUME →</span>
  </Link>;
}
