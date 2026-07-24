import { PressSectionHeading } from "@/components/press/PressSectionHeading";

export default function PressAboutPage() {
  return (
    <div className="px-6 py-14 md:py-20">
      <div className="mx-auto max-w-[820px]">
        <PressSectionHeading
          eyebrow="About Whole Body Press"
          title="A library for work that carries the signal."
        />
        <div className="mt-12 space-y-6 text-lg leading-relaxed text-ghost">
          <p>
            Whole Body Press is the publishing arm of Whole Body Guild — an
            independent network of creators, builders, and practitioners
            operating across five pillars: Presence, Press, Studios, Foundation,
            and Guardian.
          </p>
          <p>
            We publish the Whole Body Series and aligned works that serve the
            Living Earth. We are not a traditional publisher.
          </p>
          <p>
            The old world turned publishing into extraction. The publisher owns
            the words. The author gets 8%. The platform controls distribution.
            The writer rents their own voice.
          </p>
          <p>
            We invert this. Authors retain 100% copyright, distribution rights,
            and IP. We earn on production, distribution, and placement — never
            on ownership. The Feed First Algorithm ensures the author eats
            before the printer.
          </p>
        </div>
        <blockquote className="mt-14 border-l-2 border-press pl-6 font-display text-2xl leading-relaxed text-bone">
          Air does not own the signal. Air carries it.
        </blockquote>
        <div className="mt-14 border-t border-mercury pt-6 font-mono text-xs uppercase tracking-[0.15em] text-ghost">
          <p>Founded by Jesse Gawlik</p>
          <p className="mt-2">Whole Body Mastery LLC</p>
          <p className="mt-2">Morongo Valley, California</p>
          <a
            className="mt-5 inline-block text-press"
            href="mailto:press@wholebody.earth"
          >
            press@wholebody.earth
          </a>
        </div>
      </div>
    </div>
  );
}
