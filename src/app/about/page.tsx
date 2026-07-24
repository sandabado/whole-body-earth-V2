import { redirect } from "next/navigation";

/** Legacy route retained for existing links and bookmarks. */
export default function AboutPage() {
  redirect("/pillars/studios/about");
}
