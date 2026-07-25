# Whole Body Earth — Pillar Design Tokens

This document records the visual language already implemented in the five pillar source files. It is a reference for homepage curation and shared-layer work, not a replacement token system.

## Shared type and structure

- Display: `Cinzel`, exposed as `--font-display`
- Body: `Inter`, exposed as `--font-body`
- Technical labels: `DM Mono`, exposed as `--font-mono`
- Shared dark ground: `#050505` or the pillar-specific near-black equivalent
- Primary content width: `min(76rem, calc(100% - 48px))`
- Technical labels: 7–10px, uppercase, `.10em–.20em` tracking
- Borders: 1px hairlines; 2px reserved for active signals, structural marks, and HUD corners
- Corners: square or 1–2px radius; circular geometry is ceremonial rather than component chrome
- Reduced motion: animation is removed or collapsed to a stable state under `prefers-reduced-motion`

## Presence / Fire

Source: `app/presence/source.css`

| Role | Token |
| --- | --- |
| Void | `#050505` |
| Carbon | `#0a0a0f` |
| Warm field | `#1a120b` |
| Warm steel | `#2a1e15` |
| Hairline | `#2a2a38` |
| Bone | `#ededed` |
| Ghost | `#8888a0` |
| Sand | `#c4a686` |
| Ember | `#e8542a` |
| Ember light | `#ff6b3d` |
| Ember deep | `#b83d1a` |
| Header | `76px` |
| Page inset | `clamp(22px, 5vw, 80px)` |
| Core ease | `cubic-bezier(.4, 0, .2, 1)` |

- Typography: warm, ceremonial Cinzel statements with restrained Inter copy and mono ritual labels.
- Texture: warm radial falloff, ember glow, repeating radial grain, soft-light overlays.
- Composition: intimate asymmetry, portrait/copy splits, ember rules, generous vertical breathing room.
- Motion: `fire-breathe`, `page-in`, `generative-drift`; organic .65–3s cycles.
- Border language: ember or sand hairlines, occasional 2–3px ceremonial frames, almost no rounding.

## Press / Air

Source: `app/press/source.css`

| Role | Token |
| --- | --- |
| Void | `#050505` |
| Steel | `#0a0a0f` |
| Steel II | `#12121a` |
| Hairline | `#2a2a38` |
| Bone | `#ededed` |
| Ghost | `#8888a0` |
| Gold | `#c9a227` |
| Header | `72px` |

- Typography: monumental Cinzel display type, outlined gold headlines, editorial serif/italic reading passages, mono colophons.
- Texture: 54px editorial grid, low-opacity paper grain, gold foil glow, steel-on-void contrast.
- Composition: strong rules, overscale headlines, deliberate indents, column changes, book-object proportions.
- Motion: short .2–.3s editorial reveals, `air-scroll`, gold status pulse, restrained object lift.
- Border language: steel hairlines, square gold HUD corners, 1–2px radius only where function requires it.

## Studios / Water

Source: `app/studios/source.css`, informed by `HudCard.tsx` and the Water canvas.

| Role | Token |
| --- | --- |
| Void | `#050505` |
| Carbon | `#0a0a0f` |
| Steel | `#12121a` |
| Hairline | `#2a2a38` |
| Bone | `#ededed` |
| Ghost | `#8888a0` |
| Water signal | `#2ba8a0` |
| Deep water | `#1a4d4d` |
| Signal RGB | `43, 168, 160` |

- Typography: Inter utility copy, large display statements, mono coordinates and live-state labels.
- Texture: fluid radial fields, particles, scan lines, wave rings, low-opacity HUD gradients.
- Composition: signal overlays, open technical frames, water geometry held in negative space.
- Motion: organic drift, slow waves, particle lift, live-signal pulses; never mechanical dashboard motion.
- Border language: water-tinted hairlines and cropped HUD corners rather than rounded cards.

## Foundation / Earth

Source: `app/foundation/source.css`

| Role | Token |
| --- | --- |
| Void | `#050604` |
| Carbon | `#0b0d09` |
| Steel | `#12160f` |
| Hairline | `#30372b` |
| Bone | `#edede7` |
| Ghost | `#93998c` |
| Earth / water | `#84a66e` |
| Soil | `#6f5d42` |
| Copper detail | `#b87333` |
| Header | `72px` |

- Typography: measured Cinzel structures, Inter explanatory copy, mono dimensions and phase labels.
- Texture: blueprint grids, terrain falloff, drawing axes, grain, copper survey marks.
- Composition: surveyed alignments, construction sequences, measured rails, full-width technical fields.
- Motion: `geometry-draw`, `assemble-line`, `geometry-float`, `node-signal`; long construction reveals with stable end states.
- Border language: olive hairlines, copper nodes, square HUD corners, 2px maximum radius.

## Guardian / Ether

Source: `app/guardian/source.css`

| Role | Token |
| --- | --- |
| Void | `#050505` |
| Obsidian | `#0d0914` |
| Surface | `#15101f` |
| Constellation line | `#292934` |
| Bone | `#ededed` |
| Ghost | `#888894` |
| Violet | `#8b6fd6` |

- Typography: minimal Inter and mono observation labels; Cinzel only for major threshold statements.
- Texture: sparse star map, constellation hairlines, violet radial field, low-opacity screen blend.
- Composition: stillness, protected negative space, center/observer geometry within the Quincunx system.
- Motion: barely perceptible opacity shifts and slow orbit breathing.
- Border language: violet-gray hairlines and concentric circles; no decorative panels.

## Homepage inheritance rules

1. Content uses one common editorial left edge while each pillar retains its own type treatment, texture, color, and motion.
2. Platonic solids occupy the right-side negative space; alchemical glyphs remain compact title or navigation markers.
3. Shared layers use the neutral spine: `#0a0a0a`, Inter, mono annotations, `#1e1e1e` hairlines, square corner ticks.
4. Lime, green, or other live-state colors are not borrowed across pillars unless they already exist in that pillar.
5. Guardian remains the center of every Quincunx. It is never rendered as a fifth perimeter point.
6. Do not normalize the pillar identities into generic cards, rounded panels, or a sixth master brand.
