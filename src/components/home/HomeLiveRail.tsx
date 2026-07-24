import Link from "next/link";

const LIVE_PROJECTS = [
  { label: "Now streaming", title: "Sandābādo", href: "/media", color: "#2ba8a0" },
  { label: "Library release", title: "The Whole Body Series · Q4 2026", href: "/library", color: "#d4af37" },
  { label: "Gather weekly", title: "Presence circles", href: "/pillars/presence/gatherings", color: "#d16b45" },
  { label: "Field work", title: "Tetrahedron Garden", href: "/pillars/foundation/garden", color: "#84a66e" },
  { label: "Watch / listen", title: "Current media", href: "/media", color: "#8f5bff" },
] as const;

export function HomeLiveRail() {
  const items = [...LIVE_PROJECTS, ...LIVE_PROJECTS];

  return (
    <aside className="home-live-rail" aria-label="Live Whole Body projects">
      <div className="home-live-rail__inner">
        <Link href="/calendar" className="home-live-rail__status">
          <span className="home-live-rail__dot" aria-hidden="true" />
          <span>Live field</span>
          <span className="hidden text-bone/55 sm:inline">Calendar ↗</span>
        </Link>
        <div className="home-live-rail__viewport">
          <div className="home-live-rail__track">
            {items.map((project, index) => {
              const duplicate = index >= LIVE_PROJECTS.length;
              return (
                <Link
                  key={`${project.title}-${index}`}
                  href={project.href}
                  tabIndex={duplicate ? -1 : undefined}
                  aria-hidden={duplicate || undefined}
                  className="home-live-rail__project"
                  style={{ "--rail-color": project.color } as React.CSSProperties}
                >
                  <span className="home-live-rail__project-label">{project.label}</span>
                  <span className="home-live-rail__project-title">{project.title}</span>
                  <span className="home-live-rail__arrow" aria-hidden="true">↗</span>
                </Link>
              );
            })}
          </div>
        </div>
        <Link href="/calendar" className="home-live-rail__all">View all <span aria-hidden="true">→</span></Link>
      </div>
    </aside>
  );
}
