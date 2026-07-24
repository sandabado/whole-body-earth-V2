/**
 * Shared route boundary for every pillar and subpage.
 *
 * The visual container contract lives in globals.css so legacy pillar pages
 * and newly added routes share the same outer measure without duplicating a
 * width utility in each page component.
 */
export default function PillarsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="pillar-route-shell">{children}</div>;
}
