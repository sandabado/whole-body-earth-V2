import Link from "next/link";
import styles from "./WholeBodyFooter.module.css";

const pillars = [
  { id: "presence", name: "Presence", symbol: "🜂", href: "/presence" },
  { id: "press", name: "Press", symbol: "🜁", href: "/press" },
  { id: "studios", name: "Studios", symbol: "🜄", href: "/studios" },
  { id: "foundation", name: "Foundation", symbol: "🜃", href: "/foundation" },
  { id: "guardian", name: "Guardian", symbol: "⊙", href: "/guardian" },
] as const;

const sharedLinks = [
  { label: "Calendar", href: "/presence/events" },
  { label: "Store", href: "/catalog" },
  { label: "Guild", href: "/apply" },
  { label: "Library", href: "/press/library" },
  { label: "Media", href: "/studios/catalog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function WholeBodyFooter() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>Whole <span>Body</span></h2>
      <nav className={styles.constellation} aria-label="Navigate the Whole Body quincunx">
        {Array.from({ length: 8 }, (_, index) => <i key={index} className={`${styles.edge} ${styles[`edge${index + 1}`]}`} aria-hidden="true" />)}
        {pillars.map((pillar) => (
          <Link key={pillar.id} href={pillar.href} className={`${styles.node} ${styles[pillar.id]}`}>
            <i aria-hidden="true">{pillar.symbol}</i>
            <span>{pillar.name}</span>
          </Link>
        ))}
      </nav>
      <nav className={styles.pillarNav} aria-label="Pillar navigation">
        {pillars.map((pillar) => (
          <Link key={pillar.id} href={pillar.href} className={styles[`${pillar.id}Link`]}>
            <i aria-hidden="true">{pillar.symbol}</i>{pillar.name}
          </Link>
        ))}
      </nav>
      <nav className={styles.sharedNav} aria-label="Whole Body resources">
        {sharedLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <div className={styles.legal}>
        <span>© 2026 Whole Body Ecosystem</span>
        <span><i aria-hidden="true">✦</i> The geometry holds.</span>
      </div>
    </footer>
  );
}
