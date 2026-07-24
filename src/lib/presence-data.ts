export const PRESENCE_PROGRAMS = [
  { icon: "🜂", title: "The Hearthfire", type: "Weekly Whole Body Circle", detail: "The open door. Show up. Breathe. Listen. No agenda. No hierarchy. Just presence.", meta: "Weekly · 60 min · Virtual · Free", href: "/pillars/presence/gatherings", cta: "Join the next circle →" },
  { icon: "🔺", title: "Whole Body Men", type: "Closed Container", detail: "Weekly deep practice. Same faces. Same room. Real accountability. Not a men's group. A forge.", meta: "Weekly · 90 min · Virtual · $97/mo", href: "/pillars/presence/men", cta: "Learn about the forge →" },
  { icon: "🌹", title: "Whole Body Women", type: "Closed Container", detail: "Weekly deep practice. Same faces. Same room. Real accountability. Not a support group. A hearth.", meta: "Weekly · 90 min · Virtual · $97/mo", href: "/pillars/presence/women", cta: "Learn about the hearth →" },
  { icon: "🏔", title: "Whole Body Retreats", type: "In-person containers", detail: "Reset. Initiation. Return. Presence work with the whole body in the room.", meta: "Seasonal · Morongo Valley, CA", href: "/pillars/presence/retreats", cta: "View retreats →" },
] as const;

export const GATHERINGS = [
  { label: "Ongoing · Weekly", title: "The Hearthfire Session", meta: "Every Tuesday · 7:00 PM PT · Virtual · Free", description: "The open door. No commitment. No hierarchy. This is where everyone starts and where everyone returns. Show up. Breathe. Listen. That's the practice.", cta: "Reserve a place →" },
  { label: "Ongoing · Closed", title: "Whole Body Men", meta: "Every Wednesday · 6:00 PM PT · Virtual · $97/mo", description: "Closed container. Committed members. Weekly deep work. Forge-level practice for men who are done performing.", cta: "Apply →" },
  { label: "Ongoing · Closed", title: "Whole Body Women", meta: "Every Thursday · 6:00 PM PT · Virtual · $97/mo", description: "Closed container. Committed members. Weekly deep work. Hearth-level practice for women who are done shrinking.", cta: "Apply →" },
  { label: "Monthly · In person", title: "Circle in the Stone", meta: "Monthly · Location rotates · Sliding scale $33–$66", description: "In-person deep work. Physical presence changes everything. The body remembers what the screen forgets.", cta: "Request invitation →" },
  { label: "Seasonal · In person", title: "Rite of Passage", meta: "Autumn 2027 · Invitation only", description: "Marked transitions. Birth, death, initiation, completion. The old ceremonies, remembered. Not performed — inhabited.", cta: "Join the waitlist →" },
] as const;
