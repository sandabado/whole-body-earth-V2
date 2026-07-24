import Link from "next/link";
import type { ReactNode } from "react";
import { PresenceProgramCard } from "@/components/presence/PresenceProgramCard";
import { PressBookCard } from "@/components/press/PressBookCard";
import { PressSectionHeading } from "@/components/press/PressSectionHeading";
import { ArtworkTile } from "@/components/home/ArtworkTile";
import { MetricGrid } from "@/components/home/MetricGrid";
import { SectionHeading } from "@/components/home/SectionHeading";
import { FieldFrame, ObjectFrame, SignalFrame } from "@/components/media/MediaFrames";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PillarSectionHeading } from "@/components/ui/PillarSectionHeading";
import { Textarea } from "@/components/ui/Textarea";
import { MEDIA_ATLAS } from "@/lib/media-atlas";
import { PILLAR_LIST } from "@/lib/pillars";
import { PRESENCE_PROGRAMS } from "@/lib/presence-data";
import { pressVolumes } from "@/lib/press-data";

const COMPONENT_GROUPS = [
  {
    name: "Navigation & product switching",
    items: ["AccountMenu", "AnnouncementTicker", "ConstellationStrip", "EventDrawer", "MainNav", "NavStack", "TopNav", "AppLauncherModal", "AppTile", "ProductSwitcher"],
  },
  {
    name: "Core interface",
    items: ["Badge", "Button", "Card", "Input", "PillarSectionHeading", "Textarea"],
  },
  {
    name: "Homepage & system modules",
    items: ["ActivityFeed", "ArtworkTile", "ConstellationNav", "FeaturedStrip", "FinalCta", "HomeAmbientField", "HomePlatonicBackground", "HomePlatonicLayer", "HomepageDock", "LiveCountdown", "MetricGrid", "PillarActivityDialog", "PillarDashboard", "PillarJourneyLinks", "PillarMediaDeck", "PillarPortalSection", "PortalSections", "ProductionTicker", "PulseBar", "SectionHeading", "StarSky"],
  },
  {
    name: "Pillar, media & editorial",
    items: ["FoundationSection", "GuardianSection", "ContainerPage", "PresenceProgramCard", "PresenceSection", "LibraryGrid", "PressBookCard", "PressBookCover", "PressFooter", "PressSectionHeading", "PressSubmissionForm", "FeedFirstBlock", "InfinityLoveRelease", "FieldFrame", "ObjectFrame", "SignalFrame", "PillarJourneyMap"],
  },
  {
    name: "Backgrounds, auth & careers",
    items: ["PillarAtlasLayer", "PlatonicEdges", "LoginForm", "CareerApplicationForm"],
  },
] as const;

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card hud={false} className="h-full p-5 sm:p-6">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ghost">{label}</p>
      {children}
    </Card>
  );
}

export default function ComponentsPage() {
  return (
    <main className="pb-32">
      <section className="border-b border-mercury px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-water">Whole Body Earth · design system</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.94] font-bold text-bone md:text-7xl">
            Every building block, <span className="text-plasma">in the open.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ghost">
            A living reference of the shared visual language. These are the same components and tokens used across the constellation—not one-off mockups.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="sm"><Link href="#primitives">View primitives ↓</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href="#registry">Full registry ↓</Link></Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            eyebrow="01 · Foundations"
            title={<>Type, space, and <span className="text-plasma">color meaning.</span></>}
            description="Display type carries the myth. Body text carries the information. Mono text carries metadata and state. Pillar color always signals the part of the constellation a user is entering."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Specimen label="Display · Cinzel"><p className="font-display text-4xl leading-[1.02] text-bone">The work becomes structure.</p></Specimen>
            <Specimen label="Body · Inter"><p className="leading-7 text-ghost">Clear, measured language for the parts that need to be understood without becoming a wall of text.</p></Specimen>
            <Specimen label="Metadata · DM Mono"><p className="font-mono text-xs uppercase tracking-[0.17em] text-water">Presence · Fire · Tetrahedron</p></Specimen>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PILLAR_LIST.map((pillar) => (
              <div key={pillar.id} className="border border-mercury bg-carbon/60 p-5" style={{ borderTopColor: pillar.color, borderTopWidth: "3px" }}>
                <span className="alchemical-glyph text-3xl" style={{ color: pillar.color }}>{pillar.symbol}</span>
                <p className="mt-5 font-display text-xl text-bone">{pillar.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.13em] text-ghost">{pillar.elementLabel} · {pillar.solid}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="primitives" className="border-y border-mercury bg-carbon/30 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="02 · Primitives" title={<>The repeatable <span className="text-plasma">interface language.</span></>} />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Specimen label="Button · primary, secondary, outline">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Primary action</Button>
                <Button size="sm" variant="secondary">Secondary action</Button>
                <Button size="sm" variant="outline">Outline action</Button>
              </div>
            </Specimen>
            <Specimen label="Badge · semantic state">
              <div className="flex flex-wrap gap-3">
                <Badge variant="success" pulse>Active</Badge>
                <Badge variant="info">In production</Badge>
                <Badge variant="warning">Upcoming</Badge>
                <Badge variant="neutral">Archive</Badge>
              </div>
            </Specimen>
            <Specimen label="Input · labeled field"><Input name="component-email" label="Email address" placeholder="you@example.com" /></Specimen>
            <Specimen label="Textarea · long-form field"><Textarea name="component-message" label="Message" placeholder="A measured place for longer context." /></Specimen>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="03 · Content compositions" title={<>Editorial hierarchy, <span className="text-plasma">held consistently.</span></>} />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Specimen label="SectionHeading"><SectionHeading eyebrow="An eyebrow" title={<>One focused <span className="text-water">idea.</span></>} description="A reusable heading keeps page rhythm and reading hierarchy consistent." /></Specimen>
            <Specimen label="PillarSectionHeading"><PillarSectionHeading eyebrow="Whole Body Press" color="#d4af37" title={<>The signal needs <span className="text-press">structure.</span></>}>Use this where a pillar needs its own clear tonal identity.</PillarSectionHeading></Specimen>
            <Specimen label="PressSectionHeading"><PressSectionHeading eyebrow="Volume I" title="The whole body series.">A Press-specific heading inherits the shared primitive while carrying the Air / gold identity.</PressSectionHeading></Specimen>
            <Specimen label="MetricGrid"><MetricGrid items={[{ value: "100%", label: "Artist-owned", detail: "Rights remain with the maker." }, { value: "∞", label: "Creative control", detail: "The final voice stays human." }]} /></Specimen>
          </div>
        </div>
      </section>

      <section className="border-y border-mercury bg-carbon/30 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="04 · Media modules" title={<>Images, objects, and <span className="text-plasma">signal.</span></>} />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Specimen label="ArtworkTile"><ArtworkTile title="∞ Love" subtitle="Sandābādo · Album" image={MEDIA_ATLAS.studios.infinityLove} label="New release" /></Specimen>
            <Specimen label="ObjectFrame"><ObjectFrame src={MEDIA_ATLAS.studios.infinityLove} alt="Sandābādo infinity love album artwork"><p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.14em] text-water">Album object</p></ObjectFrame></Specimen>
            <Specimen label="SignalFrame"><SignalFrame className="flex aspect-square items-center justify-center border border-guardian/40"><div className="text-center"><span className="alchemical-glyph text-5xl text-guardian">☉</span><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-guardian">Film / audio / live data</p></div></SignalFrame></Specimen>
          </div>
          <div className="mt-6 max-w-2xl">
            <Specimen label="FieldFrame"><FieldFrame src={MEDIA_ATLAS.foundation.gardenSun} alt="Tetrahedron Garden in the desert"><p className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.14em] text-earth">Fieldwork frame</p></FieldFrame></Specimen>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="05 · Pillar modules" title={<>The system changes color, <span className="text-plasma">not its rules.</span></>} />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <Specimen label="PresenceProgramCard"><PresenceProgramCard program={PRESENCE_PROGRAMS[0]} /></Specimen>
            <Specimen label="PressBookCard"><div className="mx-auto max-w-xs"><PressBookCard volume={pressVolumes[0]} /></div></Specimen>
          </div>
        </div>
      </section>

      <section id="registry" className="border-y border-mercury bg-carbon/30 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow="06 · Complete registry" title={<>Every component, <span className="text-plasma">accounted for.</span></>} description="The live navigation and event shelf are visible on this page through the app layout. The registry below names every shared component family currently in the codebase." />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {COMPONENT_GROUPS.map((group) => (
              <Card key={group.name} hud={false}>
                <p className="font-display text-2xl text-bone">{group.name}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => <span key={item} className="border border-mercury bg-void/70 px-2.5 py-1.5 font-mono text-[10px] text-ghost">{item}</span>)}
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-ghost">When adding a page, start with one of these shared pieces. If a new pattern genuinely belongs in more than one place, add it here before using it in a journey.</p>
        </div>
      </section>
    </main>
  );
}
