import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const VALUES = [
  [
    "Artist-First",
    "Everything we do serves the artist’s vision and ownership.",
  ],
  [
    "Infrastructure Over Ownership",
    "We provide tools and services. Artists keep the rights.",
  ],
  [
    "Revenue Transparency",
    "Feed First algorithm published openly. No hidden cuts.",
  ],
];

export default function StudiosAboutPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-mercury px-6 pt-12 pb-16">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="mb-6 font-display text-4xl font-bold md:text-6xl">
            About
            <br />
            <span className="text-plasma">Whole Body Studios</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ghost">
            Founded by Jesse Gawlik. Legal entity: Whole Body Mastery LLC. An
            artist-owned production infrastructure for work that stays with its
            maker.
          </p>
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto max-w-[800px]">
          <Card hud={false} className="mb-12">
            <h2 className="mb-4 font-display text-2xl font-bold">
              Mission Statement
            </h2>
            <blockquote className="border-l-4 border-plasma pl-6 text-xl leading-relaxed text-ghost italic">
              “We are infrastructure, not a label. Artists retain 100% masters,
              publishing, and IP. We earn on production, distribution, and
              placement — never on ownership. The artist eats first. Always.”
            </blockquote>
          </Card>
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {VALUES.map(([title, description]) => (
              <Card key={title}>
                <h3 className="mb-2 font-display text-lg font-bold text-plasma">
                  {title}
                </h3>
                <p className="text-sm text-ghost">{description}</p>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/apply">Become a Partner →</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
