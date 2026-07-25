import type { Metadata } from "next";
import { ConstellationPlaceholder } from "../components/ConstellationPlaceholder";

export const metadata: Metadata = {
  title: "Guardian — The Agreements",
  description: "The Ether pillar of the Whole Body constellation.",
};

export default function GuardianHome() {
  return <ConstellationPlaceholder />;
}
