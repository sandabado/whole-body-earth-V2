import "./source.css";
import { SiteShell } from "./components/SiteShell";

export default function PressLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell>{children}</SiteShell>;
}
