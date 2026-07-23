export type PlantType = "leafy" | "root" | "fruiting" | "herb" | "flower";
export interface BedData { position: [number, number, number]; rotation: [number, number, number]; plantType: PlantType; label: string; }

const plantTypes: PlantType[] = ["leafy", "root", "fruiting", "herb", "flower"];
const labels = ["KALE", "CARROT", "TOMATO", "BASIL", "MARIGOLD", "SPINACH", "RADISH", "PEPPER", "OREGANO", "ZINNIA", "CHARD", "BEET"];
export const BEDS: BedData[] = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return { position: [Math.cos(angle) * 2, -0.3, Math.sin(angle) * 2], rotation: [0, -angle + Math.PI / 2, 0], plantType: plantTypes[i % plantTypes.length], label: labels[i] };
});
export const COLD_FRAMES = Array.from({ length: 6 }, (_, i) => { const angle = (i / 6) * Math.PI * 2 + Math.PI / 12; return { position: [Math.cos(angle) * 2.8, -0.2, Math.sin(angle) * 2.8] as [number, number, number], rotation: [0, -angle, 0] as [number, number, number] }; });
export const ORCHARD_TREES = Array.from({ length: 10 }, (_, i) => { const angle = (i / 10) * Math.PI * 2; return { position: [Math.cos(angle) * 3.55, 0, Math.sin(angle) * 3.55] as [number, number, number], scale: 0.82 + ((i * 17) % 7) * 0.055 }; });
export const HOUR_LINES = Array.from({ length: 12 }, (_, i) => ({ angle: (i / 12) * Math.PI * 2, index: i }));
export const GNOMON_TILT_RAD = ((90 - 34) * Math.PI) / 180;
export const PLANT_HEIGHTS: Record<PlantType, number> = { leafy: .15, root: .08, fruiting: .2, herb: .12, flower: .18 };
export const PLANT_COLORS: Record<PlantType, string> = { leafy: "#426b3f", root: "#4d653d", fruiting: "#6f5d42", herb: "#557950", flower: "#7a694b" };
