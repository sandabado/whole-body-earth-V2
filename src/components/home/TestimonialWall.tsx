"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { PILLARS, type PillarId } from "@/lib/pillars";
import { isStaticMediaPath } from "@/lib/media-atlas";
import { FALLBACK_TESTIMONIALS, type Testimonial } from "@/lib/testimonials";
import { createClient } from "@/utils/supabase/client";

const pillarIds = new Set<PillarId>(["presence", "press", "studios", "foundation", "guardian"]);

function isTestimonial(value: unknown): value is Testimonial {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<Testimonial>;
  return typeof item.id === "string" && typeof item.quote === "string" && typeof item.author_name === "string" && typeof item.pillar === "string" && pillarIds.has(item.pillar as PillarId);
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function TestimonialWall() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    try {
      const supabase = createClient();
      const load = async () => {
        const { data, error } = await supabase.from("testimonials").select("id,quote,author_name,house_number,pillar,avatar_url,role").eq("status", "active").order("display_order", { ascending: true }).order("created_at", { ascending: false }).limit(20);
        if (!error && data && data.length > 0 && active) setTestimonials(data.filter(isTestimonial));
      };
      void load();
      const channel = supabase.channel("testimonial-wall").on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, () => void load()).subscribe();
      unsubscribe = () => void supabase.removeChannel(channel);
    } catch {
      // The visible fallback keeps the invitation alive until Supabase is configured.
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const loopedTestimonials = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

  return <aside className="living-wall" aria-label="Voices from the constellation">
    <div className="mb-5 text-center"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-ghost">Voices in the room</p></div>
    <div className="living-wall-viewport"><div className="living-wall-track">{loopedTestimonials.map((testimonial, index) => <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} hiddenFromAssistiveTech={index >= testimonials.length} />)}</div></div>
  </aside>;
}

function TestimonialCard({ testimonial, hiddenFromAssistiveTech = false }: { testimonial: Testimonial; hiddenFromAssistiveTech?: boolean }) {
  const pillar = PILLARS[testimonial.pillar];
  const avatarUrl = isStaticMediaPath(testimonial.avatar_url) && testimonial.avatar_url.startsWith("/testimonials/") ? testimonial.avatar_url : null;
  const avatarStyle: CSSProperties = avatarUrl ? { backgroundImage: `linear-gradient(135deg, ${pillar.color}99, rgba(5, 5, 5, 0.45)), url(${avatarUrl})` } : { background: `linear-gradient(135deg, ${pillar.color}, #050505)` };
  return <article aria-hidden={hiddenFromAssistiveTech || undefined} className="living-wall-card" style={{ "--testimonial-color": pillar.color } as CSSProperties}>
    <div className="flex items-start gap-3"><div className="living-wall-avatar" aria-hidden="true" style={avatarStyle}>{avatarUrl ? null : initials(testimonial.author_name)}</div><div className="min-w-0"><p className="text-sm leading-6 text-bone/85">“{testimonial.quote}”</p><p className="mt-3 font-mono text-[10px] leading-5 text-ghost">— {testimonial.author_name}{testimonial.house_number ? `, House ${testimonial.house_number}` : ""}{testimonial.role ? ` · ${testimonial.role}` : ""}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[.12em]" style={{ color: pillar.color }}>{pillar.symbol} {pillar.name}</p></div></div>
  </article>;
}
