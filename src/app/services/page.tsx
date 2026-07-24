import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const SERVICES = [
  {
    id: "development",
    icon: "🧭",
    title: "Artist Development",
    subtitle: "Creative coaching and directional support",
    description: ["Repertoire curation and setlist strategy", "Brand alignment across all channels", "Career roadmap planning", "Monthly creative coaching sessions"],
    pricing: "Flat fee or included in partnership agreement",
    retain: "100% of all creative IP and decisions",
    cta: "Discuss Development",
    href: "/apply#services-needed",
  },
  {
    id: "production",
    icon: "🎛️",
    title: "Production",
    subtitle: "Full-scale recording and post-production",
    description: ["Desert Studio tracking (Morongo Valley, CA)", "Cloud mixing suite (Pro Tools HD, Universal Audio)", "Mastering lathe (vinyl cutting, direct-to-disc)", "Film Unit (RED Komodo, Ronin, drone, field audio)"],
    pricing: "$400–$800/day or project rate",
    retain: "100% ownership of all recordings",
    cta: "Book Studio Time",
    href: "/apply#services-needed",
  },
  {
    id: "sync",
    icon: "🎬",
    title: "Sync Licensing",
    subtitle: "Placement in films, ads, TV, campaigns",
    description: ["Pitch catalog to licensing agencies", "Negotiate placement deals directly", "Film and TV score composition", "Brand campaign collaborations"],
    pricing: "20% commission of sync fee",
    retain: "100% of composition rights and publishing",
    badge: "Pipeline Building",
    cta: "Submit for Sync",
    href: "/apply#services-needed",
  },
  {
    id: "distribution",
    icon: "📀",
    title: "Distribution",
    subtitle: "Global DSP delivery and physical fulfillment",
    description: ["Spotify, Apple Music, Amazon, YouTube Music", "Vinyl pressing and worldwide fulfillment", "Bandcamp direct-to-fan sales", "No upfront fees — revenue share only"],
    pricing: "12% of distribution revenue",
    retain: "100% ownership of masters",
    cta: "Start Distribution",
    href: "/apply#services-needed",
  },
  {
    id: "booking-events",
    icon: "✦",
    title: "Artist Booking & Events",
    subtitle: "Live opportunities, thoughtful programming, and clear coordination",
    description: ["Strategic booking for shows, tours, and showcases", "Venue, festival, and promoter outreach", "Event programming and artist curation", "Offer coordination, contracts, and show advancing"],
    pricing: "15% of confirmed booking fee",
    retain: "You approve every offer and keep control of your live work",
    cta: "Discuss Booking & Events",
    href: "/apply#services-needed",
  },
];

const FAQS = [
  ["Do I need to sign away my rights?", "No. Ever. Artists retain 100% of masters, publishing, and IP. We earn on services rendered — not ownership."],
  ["What happens if I want to leave?", "You can leave anytime. Your recordings, masters, and IP stay yours. No recoupment clauses. No hidden fees."],
  ["How does the stipend work?", "Active partners receive a guaranteed monthly minimum (20% of revenue) regardless of monthly performance. This ensures stability."],
  ["Is there a commitment period?", "Partnerships are ongoing relationships, not contracts. We renew quarterly based on mutual satisfaction."],
];

export default function ServicesPage() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-mercury px-6 pt-16 pb-16">
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <Badge variant="info" className="mb-6">ALL SERVICES · PRICING TRANSPARENCY · ZERO OWNERSHIP</Badge>
          <h1 className="mb-6 font-display text-4xl font-bold md:text-6xl">Services Built For<br /><span className="text-plasma">Artists Who Own Everything</span></h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ghost">We earn on services rendered — never on ownership. Every service is priced transparently. You retain 100% of your masters, publishing, and intellectual property.</p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-2">
          {SERVICES.map((service) => (
            <Card key={service.id} hoverEffect className="flex flex-col">
              <div className="mb-4 flex items-start justify-between"><div className="text-5xl">{service.icon}</div>{service.badge && <Badge variant="warning" pulse>{service.badge}</Badge>}</div>
              <h2 className="mb-1 font-display text-2xl font-bold text-plasma">{service.title}</h2>
              <p className="mb-4 font-mono text-sm text-ghost">{service.subtitle}</p>
              <ul className="mb-6 flex-1 space-y-2">{service.description.map((item) => <li key={item} className="flex items-start gap-2 text-ghost"><span className="mt-1 text-flux">▸</span><span>{item}</span></li>)}</ul>
              <div className="mb-4 border-t border-mercury pt-4"><p className="mb-1 font-mono text-xs uppercase tracking-wider text-plasma">Pricing</p><p className="font-semibold text-bone">{service.pricing}</p></div>
              <div className="mb-4 rounded-xl bg-carbon/50 p-3"><p className="font-mono text-xs text-flux">✓ {service.retain}</p></div>
              <Button asChild variant="outline" className="w-full"><Link href={service.href}>{service.cta} →</Link></Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-mercury bg-carbon/50 px-6 py-16">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="mb-6 font-display text-3xl font-bold">How Revenue Flows</h2>
          <p className="mb-8 leading-relaxed text-ghost">Every dollar earned through Studios splits according to the Feed First Algorithm. The artist eats first. The stipend is guaranteed regardless of monthly performance. The pool scales with success. The treasury ensures the infrastructure compounds.</p>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">{[["35%", "Artist Royalty Pool", "text-flux"], ["25%", "Guild Treasury", "text-plasma"], ["20%", "Artist Stipend", "text-flux"], ["12%", "Infrastructure", "text-ghost"], ["8%", "Founders", "text-halo"]].map(([pct, label, color]) => <div key={label} className="text-center font-mono"><p className={`text-2xl font-bold ${color}`}>{pct}</p><p className="mt-1 text-xs text-ghost">{label}</p></div>)}</div>
          <Button asChild variant="primary"><Link href="/apply">Apply for Partnership →</Link></Button>
        </div>
      </section>

      <section className="px-6 py-20"><div className="mx-auto max-w-[800px]"><h2 className="mb-10 text-center font-display text-3xl font-bold">Common Questions</h2><div className="space-y-6">{FAQS.map(([question, answer]) => <div key={question} className="rounded-2xl border border-mercury p-6 transition-colors hover:border-plasma"><h3 className="mb-2 font-display text-lg font-bold">{question}</h3><p className="leading-relaxed text-ghost">{answer}</p></div>)}</div></div></section>
    </div>
  );
}
