import type { Metadata } from "next";
import { EpicHomeExperience } from "@/components/home/EpicHomeExperience";

export const metadata: Metadata = {
  title: "Whole Body Earth — A Seven-Dimensional Operating System",
  description:
    "A seven-dimensional operating system for sovereign creators. Five bodies, five elements, five pillars, one whole system.",
};

export default function WholeBodyEarthHome() {
  return <EpicHomeExperience />;
}
