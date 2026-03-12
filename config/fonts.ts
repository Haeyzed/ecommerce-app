/**
 * Available font families. Used by FontProvider and font-selector.
 * Add corresponding @theme inline vars and Google Fonts links in globals.css when adding new fonts.
 */
export const FONT_SANS = [
  "geist",
  "inter",
  "noto-sans",
  "nunito-sans",
  "figtree",
  "roboto",
  "raleway",
  "dm-sans",
  "public-sans",
  "outfit",
] as const

export const FONT_MONO = ["geist-mono", "jetbrains-mono"] as const

export const FONT_SERIF = [
  "noto-serif",
  "roboto-slab",
  "merriweather",
  "lora",
  "playfair-display",
] as const

export const fonts = [...FONT_SANS, ...FONT_MONO, ...FONT_SERIF] as const
export type Font = (typeof fonts)[number]

export const fontLabels: Record<Font, string> = {
  geist: "Geist",
  inter: "Inter",
  "noto-sans": "Noto Sans",
  "nunito-sans": "Nunito Sans",
  figtree: "Figtree",
  roboto: "Roboto",
  raleway: "Raleway",
  "dm-sans": "DM Sans",
  "public-sans": "Public Sans",
  outfit: "Outfit",
  "geist-mono": "Geist Mono",
  "jetbrains-mono": "JetBrains Mono",
  "noto-serif": "Noto Serif",
  "roboto-slab": "Roboto Slab",
  merriweather: "Merriweather",
  lora: "Lora",
  "playfair-display": "Playfair Display",
}
