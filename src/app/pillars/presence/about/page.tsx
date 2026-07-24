import { PresenceSection } from "@/components/presence/PresenceSection";
export default function PresenceAboutPage() {
  return (
    <main className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[820px]">
        <PresenceSection
          eyebrow="About Whole Body Presence"
          title="The return to the circle."
        >
          <p>
            Whole Body Presence is the fire pillar of the Whole Body Guild — a
            network of creators, builders, and practitioners operating across
            five pillars.
          </p>
          <p>
            We believe the circle is the most advanced technology we have. Not a
            group. Not a network. Not an audience. A circle — where everyone can
            be seen and no one sits at the head.
          </p>
          <p>
            Founded by Jesse Gawlik after years of building alone. The solo
            grind didn&apos;t fail because it was hard. It failed because it was
            isolated.
          </p>
        </PresenceSection>
        <blockquote className="mt-16 border-l-2 border-fire pl-6 font-display text-2xl leading-relaxed text-bone">
          🜂 Fire · Tetrahedron · Four faces
        </blockquote>
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.14em] text-ghost">
          Whole Body Mastery LLC · Morongo Valley, California ·
          presence@wholebody.earth
        </p>
      </div>
    </main>
  );
}
