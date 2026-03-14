export const THEMES = [
  { name: "neutral", label: "Neutral" },
  { name: "amber", label: "Amber" },
  { name: "blue", label: "Blue" },
  { name: "cyan", label: "Cyan" },
  { name: "emerald", label: "Emerald" },
  { name: "fuchsia", label: "Fuchsia" },
  { name: "green", label: "Green" },
  { name: "indigo", label: "Indigo" },
  { name: "lime", label: "Lime" },
  { name: "orange", label: "Orange" },
  { name: "pink", label: "Pink" },
  { name: "purple", label: "Purple" },
  { name: "red", label: "Red" },
  { name: "rose", label: "Rose" },
  { name: "sky", label: "Sky" },
  { name: "teal", label: "Teal" },
  { name: "violet", label: "Violet" },
  { name: "yellow", label: "Yellow" },
] as const

export type ThemeName = (typeof THEMES)[number]["name"]
