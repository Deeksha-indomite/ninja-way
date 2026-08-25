// Shared rank ladder + lookup. Used by the main app and the profile screen so
// the XP→rank mapping stays in one place.
export const RANKS = [
  { name: "Academy Student", min: 0,   color: "#9ca3af", badge: "📜", title: "Novice Shinobi" },
  { name: "Genin",           min: 50,  color: "#10b981", badge: "🟢", title: "Rookie Ninja" },
  { name: "Chunin",          min: 100, color: "#3b82f6", badge: "🔵", title: "Mid-Level Ninja" },
  { name: "Jonin",           min: 150, color: "#8b5cf6", badge: "💜", title: "Elite Ninja" },
  { name: "ANBU",            min: 175, color: "#f59e0b", badge: "🟡", title: "Shadow Operative" },
  { name: "Hokage",          min: 220, color: "#ef4444", badge: "🔴", title: "Village Leader" },
];

export function getRank(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) if (xp >= RANKS[i].min) return { ...RANKS[i], index: i };
  return { ...RANKS[0], index: 0 };
}
