import Link from "next/link";
import {
  ArtworkTile,
  ConstellationNav,
  FinalCta,
  MetricGrid,
  ProductionTicker,
  SectionHeading,
} from "@/components/home";
import { FeedFirstBlock } from "@/components/sections/FeedFirstBlock";
import { PillarJourneyMap } from "@/components/layout/PillarJourneyMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PillarHeroMedia } from "@/components/home/PillarHeroMedia";
import { MEDIA_ATLAS } from "@/lib/media-atlas";
import { STUDIO_MUSIC_CATALOG } from "@/lib/music-catalog";

const metrics = [
  {
    value: "100%",
    label: "Artist-owned",
    detail: "Masters, publishing, and IP stay with the artist.",
  },
  {
    value: "12%",
    label: "Distribution fee",
    detail: "A transparent service fee — never a rights grab.",
  },
  {
    value: "0",
    label: "Recoupment traps",
    detail: "No hidden debt tied to the work you make.",
  },
  {
    value: "∞",
    label: "Creative control",
    detail: "The artist remains the final voice.",
  },
];
const roster = [
  {
    title: "Sandābādo",
    subtitle: "Featured artist · ∞ Love",
    image: MEDIA_ATLAS.studios.infinityLove,
    label: "Featured release",
  },
  {
    title: "Sarah Veya",
    subtitle: "New work in development",
    label: "In development",
  },
  {
    title: "Marcus Reed",
    subtitle: "Writing & pre-production",
    label: "In production",
  },
  {
    title: "Living Earth",
    subtitle: "A collaborative compilation",
    label: "Project file",
  },
];
const releases = STUDIO_MUSIC_CATALOG.slice(0, 6).map((release) => ({
  title: release.title,
  subtitle: `${release.artist} · ${release.format}`,
  image: release.image,
  label: release.status,
}));
const spaces = [
  {
    title: "Desert Studio",
    subtitle: "Tracking · Morongo Valley, CA",
    image: MEDIA_ATLAS.studios.desertSession,
    label: "Field recording",
  },
  {
    title: "Mix & Master",
    subtitle: "Stereo, spatial, and vinyl-ready masters",
    image: MEDIA_ATLAS.studios.objectsSession,
    label: "Post-production",
  },
  {
    title: "Film Unit",
    subtitle: "Music films, fieldwork, and visual direction",
    label: "Moving image",
  },
];
const elements = [
  { symbol: "🜂", label: "Presence", href: "/pillars/presence" },
  { symbol: "🜁", label: "Press", href: "/pillars/press" },
  { symbol: "🜄", label: "Studios", href: "/pillars/studios", active: true },
  { symbol: "🜃", label: "Foundation", href: "/pillars/foundation" },
  { symbol: "☉", label: "Guardian", href: "/pillars/guardian" },
];

export default function StudiosPage() {
  return (
      <main className="relative z-10 overflow-hidden">
        <section id="pillar-hero" className="pillar-hero border-b border-mercury px-6">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Badge variant="success" pulse>
                Artist-owned production infrastructure
              </Badge>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-plasma">
                Whole Body Studios
              </p>
              <h1 className="mt-5 font-display text-5xl leading-[0.98] font-bold md:text-7xl">
                Build the work.
                <br />
                <span className="text-plasma">Keep the rights.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ghost">
                A production house for artists making music, film, and culture
                outside the extraction model. We supply the rooms, tools, and
                release support. You retain the work.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/apply">Apply for partnership →</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/pillars/studios/catalog">View projects</Link>
                </Button>
              </div>
            </div>
            <PillarHeroMedia pillarId="studios" />
          </div>
        </section>
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading
              eyebrow="The operating model"
              title={
                <>
                  Proof in the <span className="text-plasma">structure.</span>
                </>
              }
              description="The terms are simple by design: clear service fees, transparent splits, and no ownership transfer."
              className="mb-10"
            />
            <MetricGrid items={metrics} />
          </div>
        </section>
        <section className="border-y border-mercury bg-carbon/35 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading
              eyebrow="Artist roster"
              title={
                <>
                  Artists with{" "}
                  <span className="text-plasma">the final say.</span>
                </>
              }
              align="center"
              className="mb-12"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {roster.map((artist) => (
                <ArtworkTile key={artist.title} {...artist} />
              ))}
            </div>
            <div className="mt-9 text-center">
              <Button asChild variant="outline">
                <Link href="/pillars/studios/catalog">See the project catalog →</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-12 flex items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Selected releases"
                title={
                  <>
                    The catalog is{" "}
                    <span className="text-plasma">the receipt.</span>
                  </>
                }
              />
              <Link
                href="/pillars/studios/catalog"
                className="font-mono text-xs uppercase tracking-[0.14em] text-plasma"
              >
                Full catalog →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {releases.map((release) => (
                <ArtworkTile key={release.title} {...release} />
              ))}
            </div>
          </div>
        </section>
        <section className="border-y border-mercury bg-carbon/35 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <SectionHeading
              eyebrow="Facilities & fieldwork"
              title={
                <>
                  Rooms, tools, and the{" "}
                  <span className="text-plasma">space between them.</span>
                </>
              }
              className="mb-12"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {spaces.map((space) => (
                <ArtworkTile key={space.title} {...space} />
              ))}
            </div>
            <div className="mt-9">
              <Button asChild variant="outline">
                <Link href="/pillars/studios/services">View studio services →</Link>
              </Button>
            </div>
          </div>
        </section>
        <ProductionTicker
          items={[
            "Now in production",
            "Sandābādo · vinyl masters",
            "Living Earth Vol. 1 · mixing",
            "Sarah Veya · tracking",
            "Film unit · field sessions",
          ]}
        />
        <FeedFirstBlock />
        <section className="border-y border-mercury bg-carbon/35 px-6 py-20">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Whole Body Press · now open"
              title={
                <>
                  The library is <span className="text-plasma">now live.</span>
                </>
              }
              description="The Whole Body Series and the Press library now have a home."
            />
            <Card hud={false} className="border-dashed bg-void/40 p-8">
              <p className="font-mono text-xs uppercase tracking-[0.17em] text-plasma">
                Whole Body Press
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold">
                Enter the Whole Body Series.
              </h3>
              <p className="mt-3 leading-relaxed text-ghost">
                A quiet, permanent library for the Series and aligned work.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/pillars/press">Visit Whole Body Press →</Link>
              </Button>
            </Card>
          </div>
        </section>
        <ConstellationNav elements={elements} />
        <div className="mx-auto max-w-[1200px] px-6 pb-20"><PillarJourneyMap pillar="studios" /></div>
        <FinalCta />
      </main>
  );
}
