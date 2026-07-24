# Lumo handoff — Media Atlas and activity system

Whole Body Earth now uses a five-pillar media system:

1. **Presence / Circle** — live practice and gathering activity.
2. **Foundation / Field** — land, garden, and built-world imagery.
3. **Press / Reader** — books, excerpts, editions, and reading progress.
4. **Studios / Release** — album art, audio, film, and artist-owned releases.
5. **Guardian / Gate** — protected briefings, eligibility, and video-led dispatches.

Each homepage pillar has a live activity card that opens an accessible modal with contextual details and a link to that pillar’s deeper journey. The five frames share a small implementation layer (`FieldFrame`, `ObjectFrame`, `SignalFrame`) so visual behavior stays consistent without duplicated components.

Media policy:

- Editorial assets are static `/public` files, registered in `src/lib/media-atlas.ts`, and delivered through Next.js `Image` optimization (AVIF/WebP).
- Testimonial portraits launch only from approved static `/public/testimonials/*` files; otherwise the interface uses a pillar-color initials mark.
- Supabase Storage is only for private/user-generated material. Career resumes and supporting files are server-uploaded to the private `applications` bucket; the database stores paths, not public URLs.
- Public video should be embedded from Vimeo, YouTube, or Cloudflare Stream inside the Guardian/Signal frame—never streamed from Supabase Storage.

The persistent homepage activity shelf remains one quiet pink system, deliberately independent of the five pillar colors. It now has a staggered rise-in and gentle beacon pulse so visitors notice it without it competing with pillar content.
