import { getDb } from "../../../../db";
import { submissions } from "../../../../db/schema";

type Payload = Record<string, string | number | boolean | undefined>;
const acceptedImprints = new Set(["root_editions", "desert_press", "frequency_imprint", "ceremonial_objects"]);
const checked = (value: unknown) => value === true || value === "on" || value === "true";
const textValue = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Payload;
    if (payload._gotcha) return Response.json({ ok: true });
    const authorName = textValue(payload.authorName, 120);
    const email = textValue(payload.email, 254).toLowerCase();
    const proposedImprint = textValue(payload.proposedImprint, 80);
    const category = textValue(payload.category, 120);
    const title = textValue(payload.title, 120);
    const synopsis = textValue(payload.synopsis, 500);
    const shortBio = textValue(payload.shortBio, 300);
    const wordCount = Number(payload.wordCount);
    if (!authorName || !email || !category || !title || !synopsis || !shortBio) {
      return Response.json({ error: "Complete all required fields." }, { status: 400 });
    }
    if (!acceptedImprints.has(proposedImprint)) return Response.json({ error: "Choose a valid imprint." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    if (!Number.isInteger(wordCount) || wordCount < 1 || wordCount > 250000) {
      return Response.json({ error: "Enter a valid word count." }, { status: 400 });
    }
    if (![payload.consentOriginal, payload.consentCopyright, payload.consentNonexclusive, payload.consentFeedFirst].every(checked)) {
      return Response.json({ error: "All four publishing consents are required." }, { status: 400 });
    }
    const [submission] = await getDb().insert(submissions).values({
      authorName, email, phone: textValue(payload.phone, 50) || null, genre: category, title, synopsis,
      whyPress: "Submitted through the Whole Body Press manuscript wizard.",
      portfolioUrl: textValue(payload.portfolio, 500), proposedImprint, wordCount, shortBio,
      previousPublications: textValue(payload.previousPublications, 2000) || null,
      consentOriginal: true, consentCopyright: true, consentNonexclusive: true, consentFeedFirst: true,
    }).returning({ id: submissions.id });
    return Response.json({ ok: true, id: submission.id, responseDays: 90 }, { status: 201 });
  } catch (error) {
    console.error("Press submission failed", error);
    return Response.json({ error: "The manuscript could not be submitted." }, { status: 500 });
  }
}
