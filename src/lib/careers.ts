import { PILLARS, PILLAR_IDS, type PillarId } from "@/lib/pillars";
import { getSupabaseAdminClient } from "@/lib/supabaseClient";

export type JobDepartment = "Studios" | "Press" | "Presence" | "Foundation" | "Guardian" | "Operations";

export type JobPosting = {
  id: string;
  title: string;
  slug: string;
  department: JobDepartment;
  pillar: string | null;
  type: string;
  location: string;
  remote: boolean;
  compensation: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  status: "open" | "paused";
  posted_date: string | null;
  closing_date: string | null;
};

export const CAREER_DEPARTMENTS: Array<JobDepartment | "All"> = ["All", "Presence", "Press", "Guardian", "Operations", "Foundation", "Studios"];

const DEPARTMENT_PILLARS: Record<JobDepartment, PillarId> = {
  Studios: "studios",
  Press: "press",
  Presence: "presence",
  Foundation: "foundation",
  Guardian: "guardian",
  Operations: "guardian",
};

export const OPERATIONS_COLOR = "#ff78c4";

export function pillarForJob(job: Pick<JobPosting, "department" | "pillar">): PillarId {
  return job.pillar && (PILLAR_IDS as readonly string[]).includes(job.pillar)
    ? job.pillar as PillarId
    : DEPARTMENT_PILLARS[job.department];
}

export function careerAccentForDepartment(department: JobDepartment) {
  return department === "Operations" ? OPERATIONS_COLOR : PILLARS[DEPARTMENT_PILLARS[department]].color;
}

export function careerAccentForJob(job: Pick<JobPosting, "department" | "pillar">) {
  return job.department === "Operations" ? OPERATIONS_COLOR : PILLARS[pillarForJob(job)].color;
}

const FALLBACK_JOBS: JobPosting[] = [
  {
    id: "master-of-heart", title: "Master of Heart", slug: "master-of-heart", department: "Presence", pillar: "presence", type: "part-time-to-full-time", location: "Morongo Valley, CA · Remote OK", remote: true, compensation: "$25/hr + Circle Access + Guild Membership",
    description: "Presence is the Fire pillar: the circle that holds you. Weekly gatherings. Monthly retreats. Rites of passage. No hierarchy. No guru. Just belonging. The Master of Heart tends the flame—not by leading it, but by keeping it lit.",
    responsibilities: ["Facilitate weekly Whole Body Circles", "Coordinate seasonal retreats and rites of passage ceremonies", "Manage member onboarding and circle integration", "Build ritual and ceremony frameworks for new gatherings", "Support members in conflict resolution and circle health", "Maintain the Presence calendar and event logistics", "Serve as point person for Presence pillar inquiries"],
    requirements: ["3+ years facilitating groups, circles, or communities", "Deep comfort with group dynamics and emotional field work", "Training in nonviolent communication or similar frameworks", "Ability to hold silence as skillfully as speech", "Written and verbal excellence", "Commitment to the Feed First model", "Personal somatic or contemplative practice"],
    nice_to_have: ["Experience with IFS, Shadow Work, or depth psychology", "Familiarity with Human Design, astrology, or related frameworks", "Trauma-informed facilitation training", "Local to Morongo Valley or the high desert", "Intentional-community or retreat-center experience"],
    benefits: ["Free participation in all circles and retreats", "Guild membership included", "Annual retreat at the Tetrahedron Garden", "Flexible hours", "Direct connection to founder and leadership"], status: "open", posted_date: "2026-07-15T00:00:00.000Z", closing_date: null,
  },
  {
    id: "master-of-wisdom", title: "Master of Wisdom", slug: "master-of-wisdom", department: "Press", pillar: "press", type: "part-time-to-full-time", location: "Remote", remote: true, compensation: "$30/hr + Profit Share on Edited Volumes",
    description: "Press is the Air pillar. Books are not commodities; they are technology. The Whole Body Series is five volumes and one operating system. The Master of Wisdom is the gatekeeper of that technology, ensuring every word serves the work.",
    responsibilities: ["Review manuscript submissions through the Press pipeline", "Edit accepted manuscripts: developmental, structural, and line", "Collaborate with authors on revision and refinement", "Maintain the editorial calendar for Press releases", "Uphold the Feed First standard in every publication", "Curate reading paths and collections for the library", "Support launch efforts and commission new aligned work"],
    requirements: ["3+ years professional editorial experience", "Portfolio of published or edited work", "Strong nonfiction, spiritual, or philosophical writing literacy", "Meticulous attention to detail", "Comfort with the Whole Body system or similar frameworks", "Ability to give clear, direct feedback", "Self-directed and deadline-driven"],
    nice_to_have: ["Independent or small-press publishing experience", "Familiarity with sacred geometry, somatics, or sovereignty work", "Copyediting or typesetting background", "Writing credits", "Digital publishing experience: ePub, PDF, or print-on-demand"],
    benefits: ["Flexible remote schedule", "Profit share on edited volumes", "Guild membership included", "Free Whole Body Series volumes", "Access to the full Press backlist"], status: "open", posted_date: "2026-07-15T00:00:00.000Z", closing_date: null,
  },
  {
    id: "master-of-law", title: "Master of Law", slug: "master-of-law", department: "Guardian", pillar: "guardian", type: "contract-to-full-time", location: "Remote", remote: true, compensation: "$80k–$110k + Equity Eligibility",
    description: "Guardian is the Ether pillar: the shape that holds. Sovereign systems. Trust architecture. Asset protection. IP shielding. The Master of Law designs and maintains the structures that ensure what is built outlasts its builder.",
    responsibilities: ["Design and maintain trust structures", "Oversee entity formation and maintenance", "Draft and review Studios, Press, and partnership agreements", "Manage intellectual-property portfolios", "Ensure applicable regulatory compliance", "Advise Guardian partners on legal architecture", "Represent the Constellation in negotiations", "Document systems for succession and transfer"],
    requirements: ["JD or equivalent legal training", "5+ years in trusts, estates, business formation, or IP law", "Experience with Wyoming DAPT and Nevada or Delaware entities", "Fluency in sovereignty-oriented legal frameworks, with a clear distinction from anti-government extremism", "Bar admission in at least one US state", "Excellent written and verbal communication", "Discretion with sensitive matters", "Commitment to the Feed First model"],
    nice_to_have: ["Cryptocurrency or digital-asset structuring experience", "Whole Body system familiarity", "International trust or offshore structuring experience", "Estate-planning or wealth-preservation background", "Creative-enterprise or startup experience"],
    benefits: ["100% IP retention on personal creative work", "Equity eligibility after six months", "Guild membership included", "Annual retreat at the Tetrahedron Garden", "Flexible remote schedule", "Direct advisory role with founder"], status: "open", posted_date: "2026-07-15T00:00:00.000Z", closing_date: null,
  },
  {
    id: "master-of-tribe", title: "Master of Tribe", slug: "master-of-tribe", department: "Operations", pillar: "operations", type: "part-time-to-full-time", location: "Morongo Valley, CA · Remote OK", remote: true, compensation: "$35/hr + Guild Membership + Profit Share",
    description: "The Tribe is the network. The Constellation is a living system of creators, builders, and stewards. The Master of Tribe tends the connections between people—matching talent to opportunity, member to member, pillar to pillar. You are the keeper of the mesh.",
    responsibilities: ["Manage the Living Spiral talent-matching system", "Coordinate introductions between members and partners", "Track member engagement and participation metrics", "Organize quarterly AMAs and virtual gatherings", "Maintain the member directory and profile system", "Process partnership referrals and Guardian applications", "Support onboarding for new Guild members", "Be connective tissue across all five pillars"],
    requirements: ["3+ years in operations, network management, or community administration", "Exceptional organizational and communication skills", "Comfort with spreadsheets, databases, Airtable, or Notion", "Understanding of how networks function", "Warm, welcoming presence with high standards", "Ability to work across multiple projects", "Commitment to the Feed First model"],
    nice_to_have: ["Membership organization or guild experience", "Whole Body system familiarity", "Local to Morongo Valley or Southern California", "HR, recruiting, or talent-management background", "Digital-community platform experience"],
    benefits: ["Free participation in all circles and retreats", "Guild membership included", "Profit share on coordinated releases", "Flexible hours", "Tetrahedron Garden access", "Network access to vetted partners", "Work from anywhere"], status: "open", posted_date: "2026-07-15T00:00:00.000Z", closing_date: null,
  },
  {
    id: "foundation-garden-steward", title: "Foundation Garden Steward", slug: "foundation-garden-steward", department: "Foundation", pillar: "foundation", type: "part-time", location: "Morongo Valley, CA", remote: false, compensation: "Trade + Stipend",
    description: "Maintain and expand the Tetrahedron Garden. Plant, harvest, tend, host visitors, and document growth.",
    responsibilities: ["Daily garden maintenance", "Seasonal planting and harvesting", "Host garden visits", "Document growth and yield"], requirements: ["2+ years gardening experience", "Desert or permaculture practice", "Comfort with manual labor", "Reliable transportation"], nice_to_have: ["Permaculture certification", "Sacred geometry agriculture", "Carpentry or construction skills"], benefits: ["Room and board option", "Garden produce", "Guild membership included", "Flexible hours"], status: "open", posted_date: "2026-07-15T00:00:00.000Z", closing_date: null,
  },
];

function isJobPosting(value: unknown): value is JobPosting {
  if (!value || typeof value !== "object") return false;
  const job = value as Partial<JobPosting>;
  return typeof job.id === "string" && typeof job.title === "string" && typeof job.slug === "string" && typeof job.department === "string" && typeof job.description === "string";
}

function normalizeJob(value: JobPosting): JobPosting {
  return { ...value, responsibilities: value.responsibilities ?? [], requirements: value.requirements ?? [], nice_to_have: value.nice_to_have ?? [], benefits: value.benefits ?? [], remote: Boolean(value.remote), compensation: value.compensation ?? null, pillar: value.pillar ?? null, posted_date: value.posted_date ?? null, closing_date: value.closing_date ?? null };
}

/** Public employment read-model; local records keep the page useful before Supabase is configured. */
export async function getOpenJobs(department?: string): Promise<JobPosting[]> {
  const fallback = department && department !== "All" ? FALLBACK_JOBS.filter((job) => job.department === department) : FALLBACK_JOBS;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return fallback;
  try {
    let query = supabase.from("job_postings").select("id,title,slug,department,pillar,type,location,remote,compensation,description,responsibilities,requirements,nice_to_have,benefits,status,posted_date,closing_date").in("status", ["open", "paused"]).order("posted_date", { ascending: false });
    if (department && department !== "All") query = query.eq("department", department);
    const { data, error } = await query;
    if (error || !data || data.length === 0) return fallback;
    return data.filter(isJobPosting).map(normalizeJob);
  } catch {
    return fallback;
  }
}

export async function getJobBySlug(slug: string): Promise<JobPosting | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("job_postings").select("id,title,slug,department,pillar,type,location,remote,compensation,description,responsibilities,requirements,nice_to_have,benefits,status,posted_date,closing_date").eq("slug", slug).in("status", ["open", "paused"]).maybeSingle();
      if (!error && data && isJobPosting(data)) return normalizeJob(data);
    } catch {
      // The local presentation stays usable until Supabase is configured.
    }
  }
  return FALLBACK_JOBS.find((job) => job.slug === slug) ?? null;
}

export function formatJobType(type: string) {
  const labels: Record<string, string> = {
    "part-time-to-full-time": "Part-Time → Full-Time",
    "contract-to-full-time": "Contract → Full-Time",
    "part-time": "Part-Time",
    "full-time": "Full-Time",
  };
  if (labels[type]) return labels[type];
  return type.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

export function formatJobDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "Recently posted";
}
