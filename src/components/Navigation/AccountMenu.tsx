"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AccountUser = { email: string; initials: string } | null;

function initialsFor(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AccountUser>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const supabase = createClient();
      const setSessionUser = (email?: string) => setUser(email ? { email, initials: initialsFor(email) } : null);
      void supabase.auth.getUser().then(({ data }) => setSessionUser(data.user?.email));
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => setSessionUser(session?.user.email));
      return () => subscription.subscription.unsubscribe();
    } catch {
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const signOut = async () => {
    try {
      await createClient().auth.signOut();
    } finally {
      setOpen(false);
    }
  };

  return <div ref={menuRef} className="relative">
    <button type="button" onClick={() => setOpen((current) => !current)} className="account-avatar group flex h-11 w-11 items-center justify-center rounded-full border border-mercury transition-all hover:border-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bone md:h-8 md:w-8" aria-label="Open account menu" aria-haspopup="menu" aria-expanded={open}>
      {user ? <span className="font-mono text-[10px] font-medium text-bone">{user.initials}</span> : <svg viewBox="0 0 24 24" className="h-4 w-4 text-bone" aria-hidden="true"><circle cx="12" cy="8" r="3.25" fill="currentColor" /><path d="M5.5 20c.7-3.65 2.85-5.5 6.5-5.5s5.8 1.85 6.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
    </button>
    {open && <div role="menu" aria-label="Account access" className="absolute top-[calc(100%+0.55rem)] right-0 z-[110] w-72 border border-mercury bg-void/98 p-2 shadow-[0_18px_50px_rgba(0,0,0,.48)] backdrop-blur-md">
      {user ? <>
        <div className="border-b border-mercury px-3 py-3"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ghost">Signed in as</p><p className="mt-1 truncate text-sm text-bone">{user.email}</p></div>
        <MenuLink href="/account" onNavigate={() => setOpen(false)}>Your profile</MenuLink>
        <MenuLink href="/store" onNavigate={() => setOpen(false)}>Your orders</MenuLink>
        <MenuLink href="/apply" onNavigate={() => setOpen(false)}>Applications</MenuLink>
        <button type="button" onClick={signOut} className={menuItemClass}>Sign out</button>
      </> : <>
        <div className="border-b border-mercury px-3 py-3"><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ghost">Account access</p><p className="mt-1 text-sm text-bone">Your orders, library, applications, and constellation.</p></div>
        <MenuLink href="/login" onNavigate={() => setOpen(false)}>Sign in</MenuLink>
        <MenuLink href="/login" onNavigate={() => setOpen(false)}>Create account</MenuLink>
        <MenuLink href="/store" onNavigate={() => setOpen(false)}>Browse the store</MenuLink>
      </>}
    </div>}
  </div>;
}

function MenuLink({ href, children, onNavigate }: { href: string; children: React.ReactNode; onNavigate: () => void }) {
  return <Link href={href} onClick={onNavigate} role="menuitem" className={menuItemClass}>{children}<span aria-hidden="true">→</span></Link>;
}

const menuItemClass = "flex w-full items-center justify-between px-3 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-ghost transition-colors hover:bg-bone/5 hover:text-bone focus-visible:bg-bone/5 focus-visible:text-bone focus-visible:outline-none";
