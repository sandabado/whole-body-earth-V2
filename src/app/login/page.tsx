import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return <main className="px-6 py-16 md:py-24"><div className="mx-auto max-w-lg text-center"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone">♁ Whole Body Earth</p><h1 className="mt-5 font-display text-4xl font-semibold text-bone sm:text-5xl">Enter your account.</h1><p className="mt-5 leading-7 text-ghost">Access your library, applications, and the parts of the constellation that are yours to keep.</p><LoginForm /></div></main>;
}
