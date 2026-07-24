import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MEDIA_ATLAS } from "@/lib/media-atlas";

type InfinityLoveReleaseProps = {
  variant?: "home" | "studios";
};

const levels = [38, 66, 48, 84, 56, 72, 40, 90, 62, 46, 78, 54];

/** A shared release feature for the Studios pillar and the constellation home. */
export function InfinityLoveRelease({ variant = "home" }: InfinityLoveReleaseProps) {
  const isStudios = variant === "studios";

  return (
    <article className="group relative isolate overflow-hidden border border-water/60 bg-[linear-gradient(140deg,rgba(19,48,55,.72),rgba(8,12,18,.56)_55%,rgba(31,17,53,.64))] shadow-[0_24px_80px_rgba(0,0,0,.32)] backdrop-blur-md">
      <div aria-hidden="true" className="absolute -right-1/4 -top-1/3 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(43,168,160,.32),transparent_65%)] blur-2xl transition duration-700 group-hover:scale-125" />
      <div aria-hidden="true" className="absolute -bottom-1/2 -left-1/4 h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(143,91,255,.28),transparent_65%)] blur-2xl transition duration-700 group-hover:scale-125" />

      <div className={isStudios ? "relative p-4 md:p-6" : "relative grid min-h-[31rem] sm:grid-cols-[.94fr_1.06fr]"}>
        <div className={isStudios ? "relative aspect-square overflow-hidden bg-void" : "relative min-h-[18rem] overflow-hidden bg-void sm:min-h-full"}>
          <Image
            src={MEDIA_ATLAS.studios.infinityLove}
            alt="Sandābādo — ∞ Love album artwork"
            fill
            priority={!isStudios}
            sizes={isStudios ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
            className="object-cover transition duration-700 group-hover:scale-[1.045]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgba(43,168,160,.25),transparent_42%,rgba(143,91,255,.24))] mix-blend-screen" />
          {isStudios ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/55 to-transparent p-6 pt-20">
              <Badge variant="info">Featured release</Badge>
              <p className="mt-3 font-mono text-xs uppercase tracking-[.17em] text-water">Sandābādo</p>
              <h2 className="mt-1 font-display text-4xl font-bold text-bone">∞ Love</h2>
            </div>
          ) : (
            <div className="absolute left-5 top-5"><Badge variant="info">Now playing</Badge></div>
          )}
        </div>

        {!isStudios && <div className="relative flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-water">Whole Body Studios · Featured release</p>
              <h3 className="mt-3 font-display text-5xl leading-none text-bone">∞ Love</h3>
              <p className="mt-2 font-display text-xl italic text-water">Sandābādo</p>
            </div>
            <span aria-hidden="true" className="font-display text-6xl leading-none text-water/80">∞</span>
          </div>

          <p className="mt-6 max-w-sm text-base leading-7 text-bone/78">A record from the desert’s emotional body — made independently, held by the artist, and released without extraction.</p>

          <div className="mt-auto pt-9">
            <div aria-label="Album signal visualizer" className="flex h-12 items-end gap-1 border-y border-water/25 py-2">
              {levels.map((level, index) => (
                <span
                  key={index}
                  aria-hidden="true"
                  className="w-full origin-bottom bg-gradient-to-t from-water/45 to-water animate-[pulse_1.45s_ease-in-out_infinite]"
                  style={{ height: `${level}%`, animationDelay: `${index * 110}ms` }}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-bone/55">Album · Artist-owned · 2026</p>
              <Link href="/pillars/studios" className="shrink-0 font-mono text-xs uppercase tracking-[.11em] text-water transition hover:text-bone">Enter the release →</Link>
            </div>
          </div>
        </div>}
      </div>
    </article>
  );
}
