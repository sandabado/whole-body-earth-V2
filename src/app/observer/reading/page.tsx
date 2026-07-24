import Link from "next/link";
import { DodecaReadingForm } from "@/components/reading/DodecaReadingForm";

export default function ObserverReadingPage() {
  return (
    <main className="observer-reading-page">
      <header className="observer-reading-hero">
        <p>DODECANIC APPLICATION / 01</p>
        <h1>Decode your House.</h1>
        <span>The reading is the threshold. Your wallet becomes the proof.</span>
      </header>
      <DodecaReadingForm />
      <Link className="observer-back-link" href="/observer">← Return to ØDIN</Link>
    </main>
  );
}
