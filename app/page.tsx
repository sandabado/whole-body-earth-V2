import type { Metadata } from "next";
import { HomePage } from "./components/HomePage";

export const metadata: Metadata = {
  title: "Infrastructure, Not a Label",
};

export default function Home() {
  return <HomePage />;
}
