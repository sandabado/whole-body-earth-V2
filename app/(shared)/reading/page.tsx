import type { Metadata } from "next";
import { ReadingExperience } from "./ReadingExperience";

export const metadata: Metadata = {
  title: { absolute: "Your Whole Body Design Reading — Whole Body Earth" },
  description: "The doorway to your Whole Body Design Reading.",
};

export default function ReadingPage() {
  return <ReadingExperience />;
}
