import type { Metadata } from "next";
import { ConstellationPlaceholder } from "./components/ConstellationPlaceholder";

export const metadata: Metadata = {
  title: "The Whole Body Constellation",
  description: "Five pillars. One Whole Body.",
};

export default function WholeHome() {
  return <ConstellationPlaceholder mode="whole" />;
}
