/**
 * Preview colors for theme selector dropdown. Keys must match THEMES in lib/themes.ts.
 */
export const themeColors: Record<
  string,
  { color: string; description?: string }
> = {
  neutral: { color: "#737373", description: "Default neutral" },
  amber: { color: "#f59e0b" },
  blue: { color: "#3b82f6" },
  cyan: { color: "#06b6d4" },
  emerald: { color: "#059669" },
  fuchsia: { color: "#d946ef" },
  green: { color: "#10b981" },
  indigo: { color: "#6366f1" },
  lime: { color: "#84cc16" },
  orange: { color: "#f97316" },
  pink: { color: "#ec4899" },
  purple: { color: "#a855f7" },
  red: { color: "#ef4444" },
  rose: { color: "#f43f5e" },
  sky: { color: "#0ea5e9" },
  teal: { color: "#14b8a6" },
  violet: { color: "#8b5cf6" },
  yellow: { color: "#eab308" },
}
