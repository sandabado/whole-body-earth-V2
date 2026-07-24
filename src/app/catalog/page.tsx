import { redirect } from "next/navigation";

/** Legacy route retained for existing links and bookmarks. */
export default function CatalogPage() {
  redirect("/pillars/studios/catalog");
}
