import type { Metadata } from "next";
import { QuincunxDisplay } from "@/components/quincunx/QuincunxDisplay";

export const metadata: Metadata = {
  title: "Quincunx Observer Seat — Whole Body Guardian",
  description:
    "Position 9 and the Observer seat at the center of the Whole Body OS.",
};

export default function GuardianQuincunxPage() {
  return (
    <main className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <QuincunxDisplay />
      </div>
    </main>
  );
}
