export type SessionPrice = {
  duration: string;
  minutes: number;
  price: string;
  amount: number;
  description: string;
};

export type Practitioner = {
  slug: string;
  name: string;
  title: string;
  tags: readonly string[];
  bio: string;
  image: string;
  price: string;
  location: string;
  formats: readonly string[];
  pricing: readonly SessionPrice[];
  credentials: readonly string[];
  quote: string;
  gallery: readonly string[];
};

export const practitioners: readonly Practitioner[] = [
  {
    slug: "jesse-gawlik",
    name: "Jesse Gawlik",
    title: "Founder · Somatic Guide",
    tags: ["Somatic", "Ceremony", "Grounding", "Breathwork"],
    bio: "Desert-trained. Ten years of somatic work. Jesse holds space the way fire holds a room — patiently, warmly, without agenda. His work is influenced by decades of martial arts, wilderness survival, and the simple truth that the body keeps the score.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=1100&q=85",
    price: "$150",
    location: "Morongo Valley, CA",
    formats: ["In-person", "Virtual · Proton Meet"],
    pricing: [
      {duration: "30 minutes", minutes: 30, price: "$150", amount: 150, description: "Grounding, check-in, or focused integration."},
      {duration: "60 minutes", minutes: 60, price: "$250", amount: 250, description: "A full somatic or breathwork session."},
      {duration: "90 minutes", minutes: 90, price: "$350", amount: 350, description: "Extended work or ceremonial preparation."},
    ],
    credentials: [
      "Somatic Experiencing Practitioner (SEP)",
      "Wilderness First Responder",
      "10+ years martial arts training",
    ],
    quote: "The body does not lie. It just waits to be heard.",
    gallery: [
      "https://images.unsplash.com/photo-1470165305631-ef56010af4bb?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd82?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1501004318641-b3f7eb0a1bf9?w=1000&h=1000&q=85",
    ],
  },
  {
    slug: "shannon-v",
    name: "Shannon V.",
    title: "Trauma-Informed Practitioner",
    tags: ["Trauma", "Somatic", "Breathwork"],
    bio: "Twelve years in trauma recovery. Shannon brings clinical training and lived experience. She does not rush the nervous system.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=1100&q=85",
    price: "$175",
    location: "Los Angeles, CA",
    formats: ["In-person", "Virtual · Proton Meet"],
    pricing: [
      {duration: "30 minutes", minutes: 30, price: "$175", amount: 175, description: "A focused nervous-system check-in."},
      {duration: "60 minutes", minutes: 60, price: "$275", amount: 275, description: "Trauma-informed somatic support."},
      {duration: "90 minutes", minutes: 90, price: "$375", amount: 375, description: "Unhurried deep work with integration time."},
    ],
    credentials: [
      "Certified Trauma Professional (CTP)",
      "Somatic Experiencing Level 2",
      "Licensed Marriage and Family Therapist (LMFT)",
    ],
    quote: "Healing is not linear. It is recursive, messy, and deeply personal.",
    gallery: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1000&h=1000&q=85",
    ],
  },
  {
    slug: "marcus-reed",
    name: "Marcus Reed",
    title: "Breathwork Facilitator",
    tags: ["Breathwork", "Ceremony", "Integration"],
    bio: "Former firefighter turned breathwork facilitator. Marcus knows what fire does to a body. He also knows what breath can undo.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&h=1100&q=85",
    price: "$125",
    location: "Joshua Tree, CA",
    formats: ["In-person", "Virtual · Proton Meet"],
    pricing: [
      {duration: "30 minutes", minutes: 30, price: "$125", amount: 125, description: "Breath assessment or integration check-in."},
      {duration: "60 minutes", minutes: 60, price: "$200", amount: 200, description: "A complete guided breathwork session."},
    ],
    credentials: [
      "Pranotom Breathwork Facilitator",
      "Wildland Firefighter · 10 years",
      "Crisis Counselor Training",
    ],
    quote: "Breath is the bridge between what happened and what can heal.",
    gallery: [
      "https://images.unsplash.com/photo-1599577721626-c0f7e1cb1d65?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1470165305631-ef56010af4bb?w=1000&h=1000&q=85",
    ],
  },
  {
    slug: "sarah-veya",
    name: "Sarah Veya",
    title: "Integration Coach",
    tags: ["Integration", "Coaching", "Creative"],
    bio: "Musician, mother, guide. Sarah specializes in helping people metabolize big experiences into sustainable change.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&h=1100&q=85",
    price: "$150",
    location: "Remote",
    formats: ["Virtual · Proton Meet"],
    pricing: [
      {duration: "30 minutes", minutes: 30, price: "$150", amount: 150, description: "Focused integration and next steps."},
      {duration: "60 minutes", minutes: 60, price: "$250", amount: 250, description: "A full creative integration session."},
      {duration: "90 minutes", minutes: 90, price: "$350", amount: 350, description: "Extended coaching for complex transitions."},
    ],
    credentials: [
      "Professional musician · Grammy-nominated",
      "Integration Specialist Certification",
      "Mother of two",
    ],
    quote: "Transformation is not the peak experience. It is what you do Tuesday morning.",
    gallery: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1000&h=1000&q=85",
    ],
  },
  {
    slug: "hakon-wolf",
    name: "Hakon Wolf",
    title: "Sound Healer",
    tags: ["Sound", "Energy", "Meditation"],
    bio: "Nordic roots. Desert practice. Hakon uses voice, drum, and crystal bowls to locate where the body is holding what it should not.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&h=1100&q=85",
    price: "$140",
    location: "Morongo Valley, CA",
    formats: ["In-person", "Virtual · Proton Meet"],
    pricing: [
      {duration: "30 minutes", minutes: 30, price: "$140", amount: 140, description: "A focused sound or meditation session."},
      {duration: "60 minutes", minutes: 60, price: "$220", amount: 220, description: "A complete sound-medicine journey."},
    ],
    credentials: [
      "Sound Medicine Practitioner",
      "International drumming facilitator",
      "15 years meditation teaching",
    ],
    quote: "Sound finds what words miss.",
    gallery: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1444464666168-499a3ca1e94c?w=1000&h=1000&q=85",
    ],
  },
  {
    slug: "lena-kim",
    name: "Lena Kim",
    title: "Somatic Therapist",
    tags: ["Trauma", "Somatic", "Bodywork"],
    bio: "Licensed therapist. Dance background. Lena works with the body as the primary text — the mind catches up later.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&h=1100&q=85",
    price: "$185",
    location: "Los Angeles, CA",
    formats: ["In-person", "Virtual · Proton Meet"],
    pricing: [
      {duration: "30 minutes", minutes: 30, price: "$185", amount: 185, description: "A focused somatic check-in."},
      {duration: "60 minutes", minutes: 60, price: "$300", amount: 300, description: "Somatic therapy or bodywork."},
      {duration: "90 minutes", minutes: 90, price: "$400", amount: 400, description: "Extended body-first therapeutic work."},
    ],
    credentials: [
      "Licensed Clinical Social Worker (LCSW)",
      "Somatic Movement Therapist",
      "Dance Therapy Certification",
    ],
    quote: "The body remembers everything the mind tries to forget.",
    gallery: [
      "https://images.unsplash.com/photo-1516062423079-7ca13cdc7fb5?w=1000&h=1000&q=85",
      "https://images.unsplash.com/photo-1470165305631-ef56010af4bb?w=1000&h=1000&q=85",
    ],
  },
];

export type EventScheduleItem = {time: string; activity: string};
export type EventScheduleDay = {label: string; items: readonly EventScheduleItem[]};
export type EventFacilitator = {name: string; role: string; slug?: string};

export type PresenceEvent = {
  slug: string;
  kind: string;
  featured?: boolean;
  title: string;
  date: string;
  location: string;
  venue?: string;
  price: string;
  scholarship?: string;
  capacity: string;
  spots: string;
  availability: string;
  facilitators: readonly EventFacilitator[];
  description: string;
  story: readonly string[];
  schedule: readonly EventScheduleDay[];
  included: readonly string[];
  notIncluded: readonly string[];
  scholarshipTerms?: string;
  refundPolicy: string;
  image: string;
  images: readonly string[];
};

const eventMedia = {
  fire: "/presence/events/desert-fire-circle.jpg",
  movement: "/presence/events/somatic-practice-space.jpg",
  room: "/presence/events/evening-circle-room.jpg",
} as const;

export const events: readonly PresenceEvent[] = [
  {
    slug: "desert-fire-retreat",
    kind: "Retreat",
    featured: true,
    title: "Desert Fire Retreat",
    date: "MAR 15–17 · 2027",
    location: "Morongo Valley, CA",
    venue: "Desert Studio",
    price: "$850",
    scholarship: "$425 · 2 places",
    capacity: "12 seats",
    spots: "4 of 12",
    availability: "4 places available",
    facilitators: [
      {name: "Jesse Gawlik", role: "Lead Facilitator", slug: "jesse-gawlik"},
      {name: "Shannon V.", role: "Somatic Support", slug: "shannon-v"},
      {name: "Marcus Reed", role: "Breathwork", slug: "marcus-reed"},
    ],
    description: "Three days in the high desert. Somatic release at dawn. Fire ceremony at dusk. Silence between.",
    story: [
      "Three days in the high desert. Somatic release at dawn. Fire ceremony at dusk. Silence between. Twelve seats. When the desert speaks, you listen.",
      "This is not a vacation. This is not a workshop. This is an initiation — a deliberate step into fire. You will be seen. You will be held. You will be changed.",
      "The retreat takes place at the Desert Studio in Morongo Valley, California. Accommodation is rustic-chic. Meals are plant-forward and locally sourced. Phones are surrendered at arrival.",
    ],
    schedule: [
      {label: "Day 1 · Arrival", items: [
        {time: "3:00 PM", activity: "Arrival, ground, settle"},
        {time: "4:00 PM", activity: "Opening circle + intention setting"},
        {time: "6:00 PM", activity: "Dinner · silent"},
        {time: "8:00 PM", activity: "Fire ceremony + welcome"},
      ]},
      {label: "Day 2 · Immersion", items: [
        {time: "6:00 AM", activity: "Sunrise somatic practice"},
        {time: "8:00 AM", activity: "Breakfast"},
        {time: "9:00 AM", activity: "Breathwork intensive"},
        {time: "12:00 PM", activity: "Lunch + integration rest"},
        {time: "2:00 PM", activity: "Nature walk + solo time"},
        {time: "5:00 PM", activity: "Circle processing"},
        {time: "7:00 PM", activity: "Dinner"},
        {time: "9:00 PM", activity: "Sound bath"},
      ]},
      {label: "Day 3 · Integration", items: [
        {time: "6:30 AM", activity: "Gentle movement"},
        {time: "8:00 AM", activity: "Breakfast"},
        {time: "9:30 AM", activity: "Integration circle"},
        {time: "11:00 AM", activity: "Closing ceremony"},
        {time: "12:30 PM", activity: "Final meal together"},
        {time: "2:00 PM", activity: "Departure"},
      ]},
    ],
    included: ["All meals · plant-forward and locally sourced", "Shared accommodation · 2–3 per room", "All ceremony materials", "Post-retreat virtual integration session", "Recorded sound bath for home practice"],
    notIncluded: ["Transportation to and from Morongo Valley", "Personal items, journals, and ritual objects"],
    scholarshipTerms: "Two places are reserved for financial hardship applicants. If selected, you pay $425. If not selected, you are placed on the regular waitlist. The application is submitted during booking.",
    refundPolicy: "Full refund up to 14 days before the start. 50% refund 7–14 days before. No refund within 7 days.",
    image: eventMedia.fire,
    images: [eventMedia.fire, eventMedia.room, eventMedia.movement],
  },
  {
    slug: "new-moon-circle",
    kind: "Gathering",
    title: "New Moon Circle",
    date: "FEB 18 · 2027 · 6–9 PM PST",
    location: "Los Angeles, CA",
    venue: "Venice Beach Community Center",
    price: "$65",
    scholarship: "$35 · 3 places",
    capacity: "20 seats",
    spots: "14 of 20",
    availability: "14 places available",
    facilitators: [
      {name: "Sarah Veya", role: "Circle Holder", slug: "sarah-veya"},
      {name: "Marcus Reed", role: "Breathwork Lead", slug: "marcus-reed"},
    ],
    description: "Guided breathwork, silent sharing, and fire ceremony under the new moon.",
    story: [
      "Monthly gathering under the new moon. Guided breathwork. Silent sharing. Fire ceremony. A place to reset intentions and connect with others walking the path.",
      "Open to all constellation members. No prior experience necessary. Wear comfortable clothing. Bring water and a journal.",
    ],
    schedule: [{label: "Evening rhythm", items: [
      {time: "6:00 PM", activity: "Arrival + settling"},
      {time: "6:30 PM", activity: "Opening circle"},
      {time: "7:00 PM", activity: "Breathwork session · 30 minutes"},
      {time: "7:45 PM", activity: "Silent integration"},
      {time: "8:00 PM", activity: "Sharing circle · voluntary"},
      {time: "8:45 PM", activity: "Fire ceremony"},
      {time: "9:00 PM", activity: "Closing + departure"},
    ]}],
    included: ["Circle guidance", "Breathwork instruction", "Fire ceremony materials", "Light refreshments"],
    notIncluded: ["Parking · street parking is available", "Travel to and from the location"],
    scholarshipTerms: "Three reduced-fee places are held at $35 for community members experiencing financial hardship. Select scholarship interest when requesting access.",
    refundPolicy: "Full refund up to 48 hours before the gathering. No refund after that point.",
    image: eventMedia.room,
    images: [eventMedia.room],
  },
  {
    slug: "somatic-intensive-weekend",
    kind: "Intensive",
    title: "Somatic Intensive Weekend",
    date: "APR 5–6 · 2027",
    location: "Morongo Valley, CA",
    venue: "Desert Studio",
    price: "$450",
    scholarship: "$225 · 3 places",
    capacity: "10 seats",
    spots: "6 of 10",
    availability: "6 places available",
    facilitators: [
      {name: "Jesse Gawlik", role: "Lead Facilitator", slug: "jesse-gawlik"},
      {name: "Lena Kim", role: "Somatic Support", slug: "lena-kim"},
    ],
    description: "Two days of deep somatic work. No lecture. No theory. Body-first practice.",
    story: [
      "Two days of deep somatic work. No lecture. No theory. Body-first practice. Learn to notice what you carry without realizing it. Release what no longer serves.",
      "For those who have done a retreat already and want to go deeper.",
    ],
    schedule: [
      {label: "Saturday", items: [
        {time: "9:00 AM", activity: "Arrival + ground"},
        {time: "10:00 AM", activity: "Somatic awakening"},
        {time: "12:00 PM", activity: "Lunch"},
        {time: "1:00 PM", activity: "Guided partner work"},
        {time: "3:00 PM", activity: "Solo integration"},
        {time: "4:00 PM", activity: "Group processing"},
        {time: "6:00 PM", activity: "Dinner"},
        {time: "7:00 PM", activity: "Evening circle"},
      ]},
      {label: "Sunday", items: [
        {time: "9:00 AM", activity: "Gentle movement"},
        {time: "10:00 AM", activity: "Deep somatic release"},
        {time: "12:00 PM", activity: "Lunch"},
        {time: "1:00 PM", activity: "Integration practices"},
        {time: "3:00 PM", activity: "Closing ceremony"},
        {time: "4:00 PM", activity: "Departure"},
      ]},
    ],
    included: ["All sessions", "Meals both days", "Shared accommodation", "Integration workbook"],
    notIncluded: ["Transportation", "Personal items"],
    scholarshipTerms: "Three half-fee places are available at $225. Select scholarship interest when requesting access; applications are reviewed privately.",
    refundPolicy: "Full refund up to 14 days before the start. 50% refund 7–14 days before. No refund within 7 days.",
    image: eventMedia.movement,
    images: [eventMedia.movement],
  },
  {
    slug: "breathwork-facilitator-training",
    kind: "Training",
    title: "Breathwork Facilitator Training",
    date: "MAY 10–14 · 2027",
    location: "Morongo Valley, CA",
    venue: "Desert Studio · 5-day immersion",
    price: "$2,200",
    scholarship: "$1,500 · 1 place",
    capacity: "8 students",
    spots: "3 of 8",
    availability: "3 places available · 5 enrolled",
    facilitators: [
      {name: "Marcus Reed", role: "Lead Trainer", slug: "marcus-reed"},
      {name: "Jesse Gawlik", role: "Guest Mentor", slug: "jesse-gawlik"},
    ],
    description: "Five-day professional training in technique, safety, ethics, and container holding.",
    story: [
      "Five-day professional training for aspiring breathwork facilitators. Learn technique, safety, ethics, and container holding. Includes certification upon completion.",
      "Prerequisites: a minimum of 20 completed breathwork sessions. Previous retreat experience is recommended.",
    ],
    schedule: [{label: "Five-day immersion", items: [
      {time: "Day 1", activity: "Foundations, nervous-system literacy, and ethics"},
      {time: "Day 2", activity: "Technique, pacing, and contraindications"},
      {time: "Day 3", activity: "Container holding and supervised practice"},
      {time: "Day 4", activity: "Crisis response, integration, and mentorship"},
      {time: "Day 5", activity: "Assessment, certification exam, and closing"},
    ]}],
    included: ["All training materials", "Shared accommodation", "All meals", "Certification exam", "Lifetime alumni support"],
    notIncluded: ["Transportation", "Professional insurance · required separately", "Continuing education credits"],
    scholarshipTerms: "One reduced-fee place is available at $1,500. Scholarship candidates complete the same prerequisite review before enrollment.",
    refundPolicy: "Full refund up to 30 days before the start. 50% refund 14–30 days before. No refund within 14 days.",
    image: eventMedia.room,
    images: [eventMedia.room],
  },
  {
    slug: "full-moon-celebration",
    kind: "Gathering",
    title: "Full Moon Celebration",
    date: "MAR 14 · 2027 · 7–10 PM PST",
    location: "Joshua Tree, CA",
    venue: "Private property · address shared after booking",
    price: "$45",
    capacity: "30 seats",
    spots: "22 of 30",
    availability: "22 places available",
    facilitators: [
      {name: "Hakon Wolf", role: "Sound Lead", slug: "hakon-wolf"},
      {name: "Sarah Veya", role: "Circle Keeper", slug: "sarah-veya"},
    ],
    description: "Live sound, chanting, dancing, and fire under the full moon.",
    story: [
      "Monthly celebration under the full moon. Live sound bath. Group chanting. Dancing. Fire. Come as you are, leave transformed.",
      "Casual dress. Bring water. Leave no trace.",
    ],
    schedule: [{label: "Evening rhythm", items: [
      {time: "7:00 PM", activity: "Arrival + settling"},
      {time: "7:30 PM", activity: "Circle opening"},
      {time: "8:00 PM", activity: "Sound bath · 45 minutes"},
      {time: "9:00 PM", activity: "Chanting + dance"},
      {time: "9:45 PM", activity: "Fire ceremony"},
      {time: "10:00 PM", activity: "Closing"},
    ]}],
    included: ["Sound instrumentation", "Circle facilitation", "Fire materials"],
    notIncluded: ["Alcohol or substances", "Transportation", "Food"],
    refundPolicy: "Full refund up to 72 hours before the celebration. No refund after that point.",
    image: eventMedia.fire,
    images: [eventMedia.fire],
  },
  {
    slug: "virtual-integration-circle",
    kind: "Virtual",
    title: "Virtual Integration Circle",
    date: "LAST SUNDAY MONTHLY · 2–4 PM PST",
    location: "Proton Meet · Online",
    price: "Free",
    scholarship: "Suggested donation · $20",
    capacity: "Open registration",
    spots: "Unlimited",
    availability: "Average attendance · 45",
    facilitators: [
      {name: "Sarah Veya", role: "Integration Lead", slug: "sarah-veya"},
      {name: "Rotating guest facilitators", role: "Community Support"},
    ],
    description: "A private online circle for processing, questions, and staying connected.",
    story: [
      "Monthly virtual gathering for processing retreat experiences, asking questions, and staying connected with the community. Open to anyone who has participated in a Presence event.",
      "No camera required. Audio only is welcome. Anonymous participation is allowed.",
    ],
    schedule: [{label: "Online circle", items: [
      {time: "2:00 PM", activity: "Welcome + intentions"},
      {time: "2:15 PM", activity: "Sharing round · voluntary"},
      {time: "3:00 PM", activity: "Topic deep dive"},
      {time: "3:30 PM", activity: "Open questions"},
      {time: "3:50 PM", activity: "Closing intentions"},
      {time: "4:00 PM", activity: "Dismissal"},
    ]}],
    included: ["Facilitation", "Proton Meet access", "Integration resources"],
    notIncluded: ["Individual follow-up", "Therapy · this gathering is not clinical care"],
    refundPolicy: "This is a free event. No refund policy applies.",
    image: eventMedia.room,
    images: [eventMedia.room],
  },
];

export const gallery = [
  ["https://images.unsplash.com/photo-1470165305631-ef56010af4bb?w=1000&q=85", "RETREAT", "Fire circle at dusk"],
  ["https://images.unsplash.com/photo-1599577721626-c0f7e1cb1d65?w=1000&q=85", "LANDSCAPE", "Desert morning light"],
  ["https://images.unsplash.com/photo-1516062423079-7ca13cdc7fb5?w=1000&q=85", "CEREMONY", "New moon circle"],
  ["https://images.unsplash.com/photo-1501004318641-b3f7eb0a1bf9?w=1000&q=85", "PRACTICE", "Hands in the earth"],
  ["https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&q=85", "COMMUNITY", "Laughter after ceremony"],
  ["https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1000&q=85", "SPACE", "The practice room"],
  ["https://images.unsplash.com/photo-1510511459019-5dda7724fd82?w=1000&q=85", "LANDSCAPE", "Golden hour over the valley"],
  ["https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1000&q=85", "PRACTICE", "Journaling after breathwork"],
] as const;
