import Link from "next/link";
import { PILLARS } from "@/lib/pillars";
import { CAREER_DEPARTMENTS, careerAccentForDepartment, careerAccentForJob, formatJobType, getOpenJobs, pillarForJob, type JobDepartment } from "@/lib/careers";

type CareersPageProps = { searchParams: Promise<{ department?: string }> };

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const { department } = await searchParams;
  const selected = CAREER_DEPARTMENTS.includes(department as JobDepartment | "All") ? department : "All";
  const jobs = await getOpenJobs(selected);

  return (
    <main className="relative overflow-hidden px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <section className="max-w-3xl border-b border-mercury pb-14">
          <div className="mb-7 flex h-1 overflow-hidden" aria-hidden="true">
            {Object.values(PILLARS).map((pillar) => <span key={pillar.name} className="flex-1" style={{ backgroundColor: pillar.color }} />)}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-bone/70">Careers · Whole Body Guild</p>
          <h1 className="mt-5 font-display text-5xl font-medium leading-[.94] text-bone sm:text-6xl">Join the Guild.</h1>
          <p className="mt-7 text-base leading-7 text-bone/80 sm:text-lg">The Whole Body Constellation is not a company. It is a living system of creators, builders, and stewards. We welcome operators—people whose architecture matches the work.</p>
          <p className="mt-4 text-sm leading-6 text-ghost">If your reading brought you here, you&apos;re already halfway in.</p>
          <a href="#positions" className="mt-8 inline-block border border-bone/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-bone transition-colors hover:bg-bone hover:text-void">View open positions ↓</a>
        </section>

        <section id="positions" className="pt-14">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ghost">Current openings</p><h2 className="mt-2 font-display text-3xl text-bone sm:text-4xl">Open positions</h2></div>
            <p className="font-mono text-[10px] uppercase tracking-[.12em] text-bone/70">{jobs.length} roles in view</p>
          </div>
          <nav className="mt-7 flex flex-wrap gap-2" aria-label="Filter openings by department">
            {CAREER_DEPARTMENTS.map((item) => {
              const accent = item === "All" ? "#f5f3f0" : careerAccentForDepartment(item);
              return <Link key={item} href={item === "All" ? "/careers" : `/careers?department=${encodeURIComponent(item)}`} style={{ borderColor: selected === item ? accent : undefined, backgroundColor: selected === item ? accent : undefined, color: selected === item ? "#050505" : accent }} className="border border-mercury px-3 py-2 font-mono text-[10px] uppercase tracking-[.11em] transition-colors hover:brightness-125">{item}</Link>;
            })}
          </nav>
          <div className="mt-8 grid gap-4">
            {jobs.map((job) => {
              const pillar = PILLARS[pillarForJob(job)];
              const accent = careerAccentForJob(job);
              return <article key={job.id} className="group border bg-carbon/55 p-5 transition duration-200 hover:bg-carbon sm:p-7" style={{ borderColor: `${accent}80` }}>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: accent }}>{job.department === "Operations" ? "✦" : pillar.symbol} {job.department} · {job.department === "Operations" ? "Constellation" : pillar.elementLabel}</p>
                    <h3 className="mt-3 font-display text-2xl text-bone sm:text-3xl">{job.title}</h3>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[.11em] text-ghost">{job.location}{job.remote ? " · Remote OK" : ""} · {formatJobType(job.type)}</p>
                    <p className="mt-3 font-mono text-sm text-bone/80">{job.compensation ?? "Compensation shared during the conversation"}</p>
                    <p className="mt-5 max-w-2xl text-sm leading-6 text-ghost">{job.description}</p>
                  </div>
                  <div className="flex items-end"><Link href={`/careers/${job.slug}`} className="career-role-action border px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em]" style={{ borderColor: accent, color: accent, ["--career-accent" as string]: accent }}>View &amp; apply →</Link></div>
                </div>
              </article>;
            })}
          </div>
        </section>

        <section className="mt-20 grid gap-6 border-y border-mercury py-12 md:grid-cols-4"><Reason title="No hierarchy" copy="The circle is the org chart. Everyone is seen. No one sits at the head." /><Reason title="Feed First" copy="You eat before the platform. Revenue splits are held in the contract." /><Reason title="Work that matters" copy="Books, music, gardens, circles—things that outlast you." /><Reason title="Architecture matters" copy="Your reading is an onboarding tool, not a personality test." /></section>
        <section className="py-14"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-bone/70">Don&apos;t see your role?</p><h2 className="mt-3 font-display text-3xl text-bone">Tell us what you build.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-ghost">We are always looking for people whose architecture matches the work.</p><Link href="/apply" className="mt-6 inline-block border border-bone/70 px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-bone transition-colors hover:bg-bone hover:text-void">Start a general application →</Link></section>
      </div>
    </main>
  );
}

function Reason({ title, copy }: { title: string; copy: string }) { return <div><h3 className="font-display text-xl text-bone">{title}</h3><p className="mt-3 text-sm leading-6 text-ghost">{copy}</p></div>; }
