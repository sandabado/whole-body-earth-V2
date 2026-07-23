import type { Metadata } from "next";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = {
  title: "Partnership Application",
  description: "Apply for an artist-owned partnership with Whole Body Studios.",
};

export default function ApplyPage() {
  return <ApplyForm />;
}
