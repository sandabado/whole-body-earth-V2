import Link from "next/link";

type PortalLayoutProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  domain: string;
  accentColor?: string;
};

export function PortalLayout({
  children,
  title,
  description,
  domain,
  accentColor = "border-purple-500/20",
}: PortalLayoutProps) {
  return (
    <div className="observer-portal-shell">
      <header className={`observer-portal-nav ${accentColor}`}>
        <Link href="/observer" className="observer-portal-brand">
          <span aria-hidden="true">Ø</span>
          <strong>{title}</strong>
        </Link>
        <p>{description}</p>
        <nav aria-label={`${title} portal`}>
          <Link href="/observer">Overview</Link>
          <Link href="/observer/reading">Reading</Link>
          <Link href="/observer/quincunx">Quincunx</Link>
          <Link href="/">Whole Body Earth</Link>
        </nav>
        <small>{domain}</small>
      </header>
      <div className="observer-portal-content">{children}</div>
    </div>
  );
}
