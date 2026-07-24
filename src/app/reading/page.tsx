import { ReadingHero } from "@/components/reading/ReadingHero";

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;

  return (
    <main className="relative overflow-hidden bg-[#120710] px-5 py-7 sm:px-6 md:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[48rem] bg-[radial-gradient(ellipse_at_52%_0%,rgba(255,121,191,.24),transparent_42%),radial-gradient(ellipse_at_0%_32%,rgba(255,73,164,.12),transparent_29%),radial-gradient(ellipse_at_100%_35%,rgba(255,184,220,.1),transparent_30%)]"
      />
      <div className="relative mx-auto max-w-[1200px]">
        <ReadingHero checkout={checkout} />

        <section className="mt-16 border-t border-mercury/85 pt-10 sm:mt-20 sm:pt-14">
          <div className="grid gap-8 lg:grid-cols-[.76fr_1.24fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-press">
                The output
              </p>
              <h2 className="mt-3 max-w-md font-display text-3xl leading-tight text-bone sm:text-4xl">
                A passport for the work in front of you.
              </h2>
            </div>
            <blockquote className="border-l-2 border-press pl-5 font-display text-xl leading-8 text-bone/90 sm:text-2xl">
              “This is different because it doesn&apos;t stop at diagnosis. It
              sends you to work.”
              <footer className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-ghost">
                Alana B. · Whole Body member
              </footer>
            </blockquote>
          </div>
          <div className="mt-9 grid gap-px border border-mercury bg-mercury md:grid-cols-3">
            <Outcome number="01" title="Your lead body" text="The dominant pattern in your chart and the quality it asks you to steward." />
            <Outcome number="02" title="A five-body matrix" text="A clear visual of your mental, physical, emotional, spiritual, and ethereal field." />
            <Outcome number="03" title="One next practice" text="A focused way to return to yourself and make the pattern useful in daily life." />
          </div>
        </section>
      </div>
    </main>
  );
}

function Outcome({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="bg-carbon p-6 sm:p-7">
      <p className="font-mono text-[10px] tracking-[.17em] text-press">{number}</p>
      <h3 className="mt-5 font-display text-2xl text-bone">{title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-ghost">{text}</p>
    </article>
  );
}
