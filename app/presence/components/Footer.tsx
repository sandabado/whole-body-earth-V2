import Link from "next/link";
import styles from "./Footer.module.css";

const footerLinks = [
  { href: "/presence/", label: "Home" },
  { href: "/presence/events", label: "Gatherings" },
  { href: "/presence/about", label: "About" },
  { href: "/presence/code", label: "Code" },
  { href: "/presence/contact", label: "Contact" },
  { href: "/presence/legal/privacy", label: "Privacy" },
  { href: "/presence/legal/terms", label: "Terms" },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.flare} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.identity}>
          <Link href="/presence/" className={styles.mark} aria-label="Whole Body Presence home">
            <span aria-hidden="true">🜂</span>
          </Link>
          <p className={styles.wordmark}>
            <span>Whole Body</span>
            <strong>Presence</strong>
          </p>
          <p className={styles.identityLine}>Where the fire meets the body.</p>
        </div>

        <div className={styles.centerpiece}>
          <div className={styles.status}>
            <i aria-hidden="true" />
            <span>System status: Awaiting kindling</span>
          </div>
          <p className={styles.mantra}>
            So It Is Built.<br />
            So It Holds. So It Is. <span aria-hidden="true">🍀</span>
          </p>
          <blockquote>“Fire does not consume. Fire transforms.”</blockquote>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.base}>
          <small>WHOLEBODY.COMMUNITY</small>
          <i aria-hidden="true" />
          <small>COPYRIGHT © 2026 WHOLE BODY GUILD LLC</small>
        </div>
      </div>
    </footer>
  );
}
