"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { pressTitles } from "./press-catalog";
import { TitleCard } from "./TitleCard";

const categories = ["All categories", ...Array.from(new Set(pressTitles.map((title) => title.category)))];
const imprints = ["All imprints", ...Array.from(new Set(pressTitles.map((title) => title.imprint)))];

export function CatalogExplorer() {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    requestedCategory && categories.includes(requestedCategory) ? requestedCategory : "All categories",
  );
  const [imprint, setImprint] = useState("All imprints");
  const [sort, setSort] = useState("release-asc");

  const titles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return pressTitles
      .filter((title) => (
        (!query
          || title.title.toLowerCase().includes(query)
          || title.description.toLowerCase().includes(query)
          || title.category.toLowerCase().includes(query))
        && (category === "All categories" || title.category === category)
        && (imprint === "All imprints" || title.imprint === imprint)
      ))
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        if (sort === "release-desc") return b.publicationDate.localeCompare(a.publicationDate);
        return a.publicationDate.localeCompare(b.publicationDate);
      });
  }, [category, imprint, search, sort]);

  return (
    <>
      <div className="catalog-controls" aria-label="Catalog filters">
        <label>
          <span>SEARCH</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Title, subject, practice…" type="search" />
        </label>
        <label>
          <span>CATEGORY</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>IMPRINT</span>
          <select value={imprint} onChange={(event) => setImprint(event.target.value)}>
            {imprints.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>SORT</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="release-asc">Release date · earliest</option>
            <option value="release-desc">Release date · latest</option>
            <option value="title">Title · A–Z</option>
          </select>
        </label>
      </div>
      <p className="catalog-count">{titles.length} {titles.length === 1 ? "TITLE" : "TITLES"} / FIRST CATALOG</p>
      {titles.length ? (
        <div className="title-grid title-grid--catalog">
          {titles.map((title) => <TitleCard key={title.slug} title={title} />)}
        </div>
      ) : (
        <div className="catalog-empty">
          <span>🜁</span>
          <h2>No title in this current.</h2>
          <p>Clear a filter or search another practice.</p>
          <button className="button" onClick={() => { setSearch(""); setCategory("All categories"); setImprint("All imprints"); }}>RESET FILTERS</button>
        </div>
      )}
    </>
  );
}
