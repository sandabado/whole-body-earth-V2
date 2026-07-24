import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const DOMAIN_PILLARS: Record<string, string> = {
  "wholebody.studio": "/pillars/studios",
  "www.wholebody.studio": "/pillars/studios",
  "wholebody.press": "/pillars/press",
  "www.wholebody.press": "/pillars/press",
  "wholebody.foundation": "/pillars/foundation",
  "www.wholebody.foundation": "/pillars/foundation",
  "wholebody.guardian": "/pillars/guardian",
  "www.wholebody.guardian": "/pillars/guardian",
  "wholebody.community": "/pillars/presence",
  "www.wholebody.community": "/pillars/presence",
  "dodeca.life": "/observer",
  "www.dodeca.life": "/observer",
  "studio.localhost": "/pillars/studios",
  "press.localhost": "/pillars/press",
  "foundation.localhost": "/pillars/foundation",
  "community.localhost": "/pillars/presence",
  "guardian.localhost": "/pillars/guardian",
  "odin.localhost": "/observer",
};

const ROUTE_PILLARS: Record<string, string> = {
  "/studio": "/pillars/studios",
  "/studios": "/pillars/studios",
  "/press": "/pillars/press",
  "/foundation": "/pillars/foundation",
  "/community": "/pillars/presence",
  "/presence": "/pillars/presence",
  "/guardian": "/pillars/guardian",
};

function getPillarDestination(request: NextRequest) {
  const hostname = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.json"
  ) {
    return null;
  }

  const domainPillar = DOMAIN_PILLARS[hostname];

  if (domainPillar && !pathname.startsWith(domainPillar)) {
    return `${domainPillar}${pathname === "/" ? "" : pathname}`;
  }

  for (const [alias, pillar] of Object.entries(ROUTE_PILLARS)) {
    if (pathname === alias || pathname.startsWith(`${alias}/`)) {
      return `${pillar}${pathname.slice(alias.length)}`;
    }
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const sessionResponse = await updateSession(request);
  const destination = getPillarDestination(request);

  if (!destination) return sessionResponse;

  const url = request.nextUrl.clone();
  url.pathname = destination;
  const response = NextResponse.rewrite(url);

  for (const cookie of sessionResponse.cookies.getAll()) {
    response.cookies.set(cookie);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
