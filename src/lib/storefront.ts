import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { MEDIA_ATLAS } from "@/lib/media-atlas";

export type StoreItem = {
  id: string;
  title: string;
  type: string;
  pillar: "press" | "studios" | "presence" | "foundation" | "guardian";
  description: string | null;
  priceCents: number | null;
  imageUrl: string | null;
  availability: "available" | "forthcoming";
};

const fallbackStoreItems: StoreItem[] = [
  { id: "infinity-love-vinyl", title: "∞ Love — Vinyl", type: "vinyl", pillar: "studios", description: "Sandābādo’s debut, pressed for the first physical run.", priceCents: 3200, imageUrl: MEDIA_ATLAS.studios.infinityLove, availability: "forthcoming" },
  { id: "infinity-love-signed", title: "∞ Love — Signed Vinyl", type: "signed edition", pillar: "studios", description: "Numbered, signed, and held for the first circle.", priceCents: 6400, imageUrl: MEDIA_ATLAS.studios.infinityLove, availability: "forthcoming" },
  { id: "whole-body-series", title: "The Whole Body Series", type: "book set", pillar: "press", description: "Five volumes for the five bodies. Permanent library access included.", priceCents: 18000, imageUrl: null, availability: "forthcoming" },
  { id: "studios-shirt", title: "Whole Body Studios Tee", type: "apparel", pillar: "studios", description: "A soft black field shirt for the work in motion.", priceCents: 4200, imageUrl: MEDIA_ATLAS.studios.objectsSession, availability: "forthcoming" },
  { id: "constellation-stickers", title: "Constellation Sticker Sheet", type: "objects", pillar: "press", description: "Five pillars, the earth mark, and a few signals for your tools.", priceCents: 1200, imageUrl: null, availability: "forthcoming" },
  { id: "desert-session-poster", title: "Desert Session Poster", type: "print", pillar: "studios", description: "A small-run archival print from the first desert session.", priceCents: 2800, imageUrl: MEDIA_ATLAS.studios.desertSession, availability: "forthcoming" },
];

function asPrice(value: number | null) {
  return typeof value === "number" ? value : null;
}

/** One shared commerce read-model for every Whole Body Earth pillar. */
export async function getStoreItems(): Promise<StoreItem[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return fallbackStoreItems;

  try {
    const supabase = createClient(await cookies());
    const [products, books] = await Promise.all([
      supabase.from("products").select("id,title,type,pillar,description,price_cents,image_url,status").eq("status", "active").order("featured", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("books").select("id,title,description,physical_price_cents,image_url,status").in("status", ["available", "forthcoming"]).order("featured", { ascending: false }).order("created_at", { ascending: false }),
    ]);

    if (products.error || books.error) return fallbackStoreItems;

    const productItems: StoreItem[] = (products.data ?? []).map((product) => ({
      id: product.id,
      title: product.title,
      type: product.type,
      pillar: product.pillar as StoreItem["pillar"],
      description: product.description,
      priceCents: asPrice(product.price_cents),
      imageUrl: product.image_url,
      availability: "available",
    }));
    const bookItems: StoreItem[] = (books.data ?? []).map((book) => ({
      id: `book-${book.id}`,
      title: book.title,
      type: "book",
      pillar: "press",
      description: book.description,
      priceCents: asPrice(book.physical_price_cents),
      imageUrl: book.image_url,
      availability: book.status === "available" ? "available" : "forthcoming",
    }));

    return [...productItems, ...bookItems].length > 0 ? [...productItems, ...bookItems] : fallbackStoreItems;
  } catch {
    return fallbackStoreItems;
  }
}

export function formatStorePrice(priceCents: number | null) {
  return priceCents === null ? "Price on release" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(priceCents / 100);
}
