import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogExplorer } from "../components/CatalogExplorer";

export const metadata: Metadata = {
  title: "Catalog",
  description: "First editions from Whole Body Press: author-owned books rooted in practice and made to last.",
};

export default function CatalogPage() {
  return (
    <div className="page press-page">
      <header className="press-page-hero">
        <p className="eyebrow">THE CATALOG / FIRST EDITIONS</p>
        <h1>Books with<br />a long memory.</h1>
        <p>Search by practice, imprint, or title. Every edition is author-owned, DRM-free where digital, and designed to return to.</p>
      </header>
      <section className="press-section press-section--first">
        <Suspense fallback={null}>
          <CatalogExplorer />
        </Suspense>
      </section>
    </div>
  );
}
