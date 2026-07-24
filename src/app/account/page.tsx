import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  let supabase: ReturnType<typeof createClient>;
  try {
    supabase = createClient(await cookies());
  } catch {
    return <main className="px-6 py-16 md:py-24"><div className="mx-auto max-w-lg text-center"><h1 className="font-display text-4xl text-bone">Account access is preparing.</h1><p className="mt-5 text-ghost">Please return once account configuration is complete.</p><Link href="/" className="mt-8 inline-block border border-bone px-5 py-3 font-mono text-xs uppercase tracking-[0.13em] text-bone">Return home →</Link></div></main>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");
  return <main className="px-6 py-16 md:py-24"><div className="mx-auto max-w-[900px]"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone">♁ Account</p><h1 className="mt-4 font-display text-4xl font-semibold text-bone sm:text-5xl">Welcome back.</h1><section className="mt-10 border border-mercury bg-carbon/60 p-6 sm:p-8"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ghost">Signed in as</p><p className="mt-2 text-lg text-bone">{user.email}</p></section><div className="mt-6 grid gap-5 sm:grid-cols-2"><AccountLink href="/pillars/studios/catalog" title="Your library" text="Purchased editions and reading access will appear here as the reader opens." /><AccountLink href="/apply" title="Applications" text="Start or continue a Whole Body Studios partnership application." /></div></div></main>;
}

function AccountLink({ href, title, text }: { href: string; title: string; text: string }) {
  return <Link href={href} className="group border border-mercury bg-carbon/45 p-6 transition hover:border-bone hover:bg-bone/5"><h2 className="font-display text-2xl text-bone">{title}</h2><p className="mt-3 leading-7 text-ghost">{text}</p><span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.13em] text-bone">Open →</span></Link>;
}
