import Link from "next/link";
import { CloverPortal } from "@/components/shared/CloverPortal";

export function PressFooter() {
  return (
    <footer className="border-t border-press/30 bg-carbon px-6 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-press">
            🜁 Whole Body Press
          </p>
          <p className="mt-3 text-sm text-ghost">
            Air does not own the signal. Air carries it.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-ghost">
          <Link href="/pillars/press/about">About</Link>
          <Link href="/reading">Reading</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/store">Store</Link>
          <Link href="/careers">Careers</Link>
          <a href="mailto:press@wholebody.earth">press@wholebody.earth</a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[1200px] border-t border-mercury pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-ghost">
        © 2026 Whole Body Mastery LLC · So It Is Built. So It Holds. So It Is.
        <CloverPortal />
      </p>
    </footer>
  );
}
