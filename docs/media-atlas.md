# Whole Body Earth Media Atlas

Editorial media is art-directed and static: use `/public/images`, `/public/books`, `/public/music`, `/public/logos`, and `/public/testimonials`. Add each production asset to `src/lib/media-atlas.ts`, then render it through the relevant pillar frame.

- **Presence / Circle** — live practice, gathering, and participation.
- **Foundation / Field** — widescreen land, garden, and built-world imagery.
- **Press / Reader** — books, excerpts, editions, and reading progress.
- **Studios / Release** — square artwork, audio, films, and artist-owned releases.
- **Guardian / Gate** — protected dispatches, eligibility, and video-led briefings.

The five pillar frames are composed from a small set of implementation primitives (`FieldFrame`, `ObjectFrame`, and `SignalFrame`) to avoid five duplicated components. Every frame carries its corresponding Fire, Air, Water, Earth, or Ether color.

All static imagery uses Next.js `Image` for responsive AVIF/WebP delivery. Use `priority` only for an above-the-fold hero asset.

Supabase Storage is only for private or user-generated material. Career resumes and supporting files use the private `applications` bucket and database records retain paths, never public URLs. Do not serve public video from Supabase: use Vimeo, YouTube, or Cloudflare Stream inside `SignalFrame`.

Testimonial portraits launch as approved static `/public/testimonials/*` assets. Until a portrait exists, the UI renders a pillar-color initials mark. External avatar URLs are intentionally ignored.
