import type { Metadata } from "next";
import { GalleryExperience } from "../components/GalleryExperience";

export const metadata: Metadata = { title: "Moments Held", description: "Real photographs from Whole Body Presence retreats, circles, practices, and community." };

export default function GalleryPage() {
  return <div className="page page-gallery">
    <header className="page-hero gallery-hero"><span className="section-index">ARCHIVE / 001—008</span><p className="eyebrow">MOMENTS HELD</p><h1>The fire in<br />photographs.</h1><p>We do not curate perfection. We capture truth: sweat, tears, laughter, stillness. Real people doing real work.</p></header>
    <section className="gallery-browser"><GalleryExperience /></section>
  </div>;
}
