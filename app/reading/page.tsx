import type { Metadata } from "next";
import { ReadingExperience } from "./ReadingExperience";

export const metadata: Metadata = {
  title: "Your Whole Body Design Reading",
  description: "The doorway to your Whole Body Design Reading.",
};

export default function ReadingPage() {
  return <ReadingExperience />;
}
