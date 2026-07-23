import { redirect } from "next/navigation";

export default function LegacyVolumeRedirect() {
  redirect("/press/catalog");
}
