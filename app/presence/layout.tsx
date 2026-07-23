import "./source.css";
import { SiteShell } from "./components/SiteShell";

export default function PresenceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell>{children}</SiteShell>;
}
