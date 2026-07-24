import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdminClient } from "@/lib/supabaseClient";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ADDITIONAL_FILES = 3;
const ACCEPTED_RESUME_TYPES = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
const ACCEPTED_RESUME_EXTENSIONS = new Set(["pdf", "doc", "docx"]);
const ACCEPTED_ADDITIONAL_EXTENSIONS = new Set(["pdf", "doc", "docx", "png", "jpg", "jpeg"]);

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character); }
function text(form: FormData, name: string, maxLength = 5000) { const value = form.get(name); return typeof value === "string" ? value.trim().slice(0, maxLength) : ""; }
function validUrl(value: string) { if (!value) return true; try { const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; } }
function extension(file: File) { return file.name.split(".").pop()?.toLowerCase() ?? ""; }
function validResume(file: File) { return file.size > 0 && file.size <= MAX_FILE_SIZE && (ACCEPTED_RESUME_TYPES.has(file.type) || ACCEPTED_RESUME_EXTENSIONS.has(extension(file))); }
function validAdditionalFile(file: File) { return file.size > 0 && file.size <= MAX_FILE_SIZE && ACCEPTED_ADDITIONAL_EXTENSIONS.has(extension(file)); }

async function uploadFile(file: File, applicationId: string, kind: "resume" | "supporting", index = 0) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) throw new Error("Storage is not configured");
  const path = `careers/${applicationId}/${kind}${index ? `-${index}` : ""}.${extension(file) || "bin"}`;
  const { error } = await supabase.storage.from("applications").upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
  if (error) throw error;
  return path;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    if (text(form, "website")) return NextResponse.json({ error: "Unable to submit application" }, { status: 400 });
    const jobId = text(form, "jobId", 100);
    const fullName = text(form, "fullName", 200);
    const email = text(form, "email", 200).toLowerCase();
    const phone = text(form, "phone", 50);
    const location = text(form, "location", 200);
    const linkedinUrl = text(form, "linkedinUrl", 2000);
    const portfolioUrl = text(form, "portfolioUrl", 2000);
    const websiteUrl = text(form, "websiteUrl", 2000);
    const coverLetter = text(form, "coverLetter", 3000);
    const hasReading = text(form, "hasReading") === "yes";
    const houseNumber = Number(text(form, "houseNumber", 2));
    const element = text(form, "element", 50);
    const pillar = text(form, "pillar", 50);
    const referredBy = text(form, "referredBy", 200);
    const consentReview = text(form, "consentReview") === "on";
    const consentOrganization = text(form, "consentOrganization") === "on";
    const resume = form.get("resume");
    const extraFiles = form.getAll("additionalFiles").filter((value): value is File => value instanceof File && value.size > 0);

    if (!jobId || !fullName || !email || !location || !coverLetter || !consentReview || !consentOrganization || !(resume instanceof File) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || ![linkedinUrl, portfolioUrl, websiteUrl].every(validUrl) || (hasReading && (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 12)) || !validResume(resume) || extraFiles.length > MAX_ADDITIONAL_FILES || extraFiles.some((file) => !validAdditionalFile(file))) return NextResponse.json({ error: "Please complete the required fields and use accepted file formats." }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: "Career applications are temporarily unavailable." }, { status: 503 });
    const { data: job, error: jobError } = await supabase.from("job_postings").select("id,title,department,status").eq("id", jobId).eq("status", "open").maybeSingle();
    if (jobError || !job) return NextResponse.json({ error: "This role is no longer accepting applications." }, { status: 410 });

    const applicationId = crypto.randomUUID();
    const resumePath = await uploadFile(resume, applicationId, "resume");
    let supportingPaths: string[] = [];
    try { supportingPaths = await Promise.all(extraFiles.map((file, index) => uploadFile(file, applicationId, "supporting", index + 1))); } catch (uploadError) { await supabase.storage.from("applications").remove([resumePath]); throw uploadError; }

    const { error: insertError } = await supabase.from("job_applications").insert({ id: applicationId, job_id: job.id, full_name: fullName, email, phone: phone || null, location, linkedin_url: linkedinUrl || null, portfolio_url: portfolioUrl || null, website_url: websiteUrl || null, cover_letter: coverLetter, resume_url: resumePath, additional_files: supportingPaths, has_reading: hasReading, house_number: hasReading ? houseNumber : null, element: hasReading ? element || null : null, pillar: hasReading ? pillar || null : null, referred_by: referredBy || null, status: "submitted" });
    if (insertError) { await supabase.storage.from("applications").remove([resumePath, ...supportingPaths]); console.error("Career application insert error:", insertError); return NextResponse.json({ error: "Unable to save your application." }, { status: 500 }); }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({ from: "Whole Body Earth <onboarding@resend.dev>", to: [email], subject: `Application received — ${job.title}`, html: `<div style="font-family:monospace;background:#050505;color:#EDEDED;padding:2rem;max-width:600px"><h1 style="color:#2BA8A0">Application received</h1><p>Thank you for applying for <strong>${escapeHtml(job.title)}</strong>.</p><p style="color:#8888A0">We review every submission and will respond within 14 days.</p></div>` });
        if (process.env.ADMIN_EMAIL) await resend.emails.send({ from: "Whole Body Earth <onboarding@resend.dev>", to: [process.env.ADMIN_EMAIL], subject: `New career application: ${fullName}`, html: `<div style="font-family:monospace;background:#050505;color:#EDEDED;padding:2rem;max-width:600px"><h1 style="color:#2BA8A0">New career application</h1><p><strong>${escapeHtml(fullName)}</strong> applied for ${escapeHtml(job.title)}.</p><p>${escapeHtml(email)} · ${escapeHtml(location)}</p><p>Review private application record: ${applicationId}</p></div>` });
      } catch (emailError) { console.error("Career application saved but email delivery failed:", emailError); }
    }
    return NextResponse.json({ success: true, applicationId });
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json({ error: "Unable to submit your application." }, { status: 500 });
  }
}

export function GET() { return NextResponse.json({ endpoint: "POST /api/careers/apply", status: "operational" }); }
