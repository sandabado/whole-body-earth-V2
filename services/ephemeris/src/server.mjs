import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { calculateNatalChart, InputError, parseNatalRequest } from "./chart.mjs";

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.EPHEMERIS_API_KEY || "";
const allowedOrigins = new Set((process.env.ALLOWED_ORIGINS || "http://localhost:3001,https://wholebody.earth,https://www.wholebody.earth").split(",").map((origin) => origin.trim()).filter(Boolean));
const rateWindows = new Map();
const RATE_LIMIT = 120;
const RATE_WINDOW_MS = 10 * 60_000;

if (process.env.NODE_ENV === "production" && !apiKey) {
  throw new Error("EPHEMERIS_API_KEY is required in production.");
}

function responseHeaders(request) {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
  };
  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  return headers;
}

function send(response, request, status, body) {
  response.writeHead(status, responseHeaders(request));
  response.end(JSON.stringify(body));
}

function clientIp(request) {
  return request.headers["x-forwarded-for"]?.toString().split(",")[0].trim() || request.socket.remoteAddress || "unknown";
}

function underRateLimit(request) {
  const now = Date.now();
  const key = clientIp(request);
  const window = rateWindows.get(key) || { startedAt: now, count: 0 };
  if (now - window.startedAt > RATE_WINDOW_MS) {
    window.startedAt = now;
    window.count = 0;
  }
  window.count += 1;
  rateWindows.set(key, window);
  return window.count <= RATE_LIMIT;
}

function authorized(request) {
  if (!apiKey) return true;
  const supplied = request.headers["x-api-key"];
  if (typeof supplied !== "string") return false;
  const expectedBuffer = Buffer.from(apiKey);
  const suppliedBuffer = Buffer.from(supplied);
  return expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, { ...responseHeaders(request), "Access-Control-Allow-Headers": "Content-Type, X-API-Key", "Access-Control-Allow-Methods": "GET, OPTIONS" });
    response.end();
    return;
  }

  if (request.method !== "GET") {
    send(response, request, 405, { error: "Method not allowed." });
    return;
  }

  if (url.pathname === "/health") {
    send(response, request, 200, { status: "ok", service: "wholebody-ephemeris", engine: "swisseph-1.2.2" });
    return;
  }

  if (url.pathname !== "/natal") {
    send(response, request, 404, { error: "Not found." });
    return;
  }

  if (!underRateLimit(request)) {
    send(response, request, 429, { error: "Too many requests. Please try again shortly." });
    return;
  }

  if (!authorized(request)) {
    send(response, request, 401, { error: "Unauthorized." });
    return;
  }

  try {
    send(response, request, 200, calculateNatalChart(parseNatalRequest(url.searchParams)));
  } catch (error) {
    const status = error instanceof InputError ? 400 : 500;
    if (status === 500) console.error("Natal calculation failed.", error);
    send(response, request, status, { error: error instanceof Error ? error.message : "Unable to calculate chart." });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Whole Body Ephemeris listening on ${port}`);
});
