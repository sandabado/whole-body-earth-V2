import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { STUDIO_MUSIC_CATALOG } from "@/lib/music-catalog";

export default function StudiosCatalogPage() {
  return (
    <div className="pb-20">
      <section className="border-b border-mercury px-6 pt-12 pb-16">
        <div className="mx-auto max-w-[1200px]">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[.18em] text-water">
            Whole Body Studios
          </p>
          <h1 className="mb-6 font-display text-4xl font-bold md:text-6xl">
            Music <span className="text-plasma">Catalog</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ghost">
            Artist-owned releases from the current Studios work and Jesse Gawlik&apos;s recorded archive.
          </p>
        </div>
      </section>
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIO_MUSIC_CATALOG.map((release) => {
            const content = (
              <Card className="h-full p-0" hoverEffect>
                <div className="relative aspect-square overflow-hidden border-b border-mercury bg-carbon">
                  <Image
                    src={release.image}
                    alt={`${release.title} album artwork`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-transparent" />
                  <Badge
                    variant="neutral"
                    className={
                      release.status === "Featured"
                        ? "absolute top-4 left-4 border-[#ff4fa3] bg-[#ff4fa3]/20 text-[#ff9dcd] shadow-[0_0_22px_rgba(255,79,163,0.28)]"
                        : "absolute top-4 left-4"
                    }
                  >
                    {release.status === "Featured" ? "New release" : release.status}
                  </Badge>
                </div>
                <div className="p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-water">{release.artist}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-bone">{release.title}</h2>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.13em] text-ghost">
                    {release.format} · {release.year}
                  </p>
                  <span className="mt-5 inline-flex font-mono text-xs uppercase tracking-[0.13em] text-flux">
                    {release.sourceHref ? "Open archive entry ↗" : "Featured release"}
                  </span>
                </div>
              </Card>
            );

            return release.sourceHref ? (
              <a
                key={release.slug}
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-plasma"
                href={release.sourceHref}
                target="_blank"
                rel="noreferrer"
              >
                {content}
              </a>
            ) : (
              <Link key={release.slug} className="group block" href="/pillars/studios">
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
