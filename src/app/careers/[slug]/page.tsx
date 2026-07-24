import Link from "next/link";
import { notFound } from "next/navigation";
import { CareerApplicationForm } from "@/components/careers/CareerApplicationForm";
import { PILLARS } from "@/lib/pillars";
import { careerAccentForJob, formatJobDate, formatJobType, getJobBySlug, pillarForJob } from "@/lib/careers";

type JobPageProps = { params: Promise<{ slug: string }> };

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const requiresPortfolio = job.department === "Studios" || job.department === "Press";
  const pillar = PILLARS[pillarForJob(job)];
  const accent = careerAccentForJob(job);

  return <main className="px-6 py-12 sm:py-16"><div className="mx-auto max-w-[1000px]" style={{ ["--career-accent" as string]: accent }}><Link href="/careers" className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: accent }}>← Back to careers</Link><header className="mt-10 border-b border-mercury pb-10"><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: accent }}>{job.department === "Operations" ? "✦" : pillar.symbol} {job.department} · {formatJobType(job.type)}</p><h1 className="mt-4 font-display text-4xl leading-tight text-bone sm:text-6xl">{job.title}</h1><p className="mt-5 font-mono text-[10px] uppercase tracking-[.12em] text-ghost">{job.location}{job.remote ? " · Remote OK" : ""} · Posted {formatJobDate(job.posted_date)} · {job.closing_date ? `Closes ${formatJobDate(job.closing_date)}` : "Open until filled"}</p><div className="mt-8 border-l-2 p-5" style={{ borderColor: accent, backgroundColor: `${accent}12` }}><p className="font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: accent }}>Compensation</p><p className="mt-2 font-display text-xl text-bone">{job.compensation ?? "Shared during the conversation"}</p></div></header><article className="max-w-3xl py-12"><Section title="The role" color={accent}><p>{job.description}</p></Section><ListSection title="What you’ll do" items={job.responsibilities} color={accent} /><ListSection title="What you need" items={job.requirements} color={accent} /><ListSection title="Nice to have" items={job.nice_to_have} color={accent} /><ListSection title="What you get" items={job.benefits} color={accent} /></article><CareerApplicationForm jobId={job.id} jobTitle={job.title} requiresPortfolio={requiresPortfolio} accent={accent} /></div></main>;
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) { return <section className="border-t border-mercury py-8 first:border-t-0 first:pt-0"><h2 className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color }}>{title}</h2><div className="mt-4 leading-7 text-ghost">{children}</div></section>; }
function ListSection({ title, items, color }: { title: string; items: string[]; color: string }) { return items.length ? <Section title={title} color={color}><ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-3"><span style={{ color }}>•</span><span>{item}</span></li>)}</ul></Section> : null; }
