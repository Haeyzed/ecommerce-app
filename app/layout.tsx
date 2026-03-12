import {
  DM_Sans,
  Figtree,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Lora,
  Merriweather,
  Noto_Sans,
  Noto_Serif,
  Nunito_Sans,
  Outfit,
  Playfair_Display,
  Public_Sans,
  Raleway,
  Roboto,
  Roboto_Slab,
} from "next/font/google"
import { AppProviders } from "@/components/providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const fontGeist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})
const fontGeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})
const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
const fontNotoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
})
const fontNunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})
const fontFigtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})
const fontRoboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
})
const fontRaleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})
const fontDMSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})
const fontPublicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
})
const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})
const fontJetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})
const fontNotoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
})
const fontRobotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
})
const fontMerriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})
const fontLora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})
const fontPlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

const fontVariables = cn(
  fontGeist.variable,
  fontGeistMono.variable,
  fontInter.variable,
  fontNotoSans.variable,
  fontNunitoSans.variable,
  fontFigtree.variable,
  fontRoboto.variable,
  fontRaleway.variable,
  fontDMSans.variable,
  fontPublicSans.variable,
  fontOutfit.variable,
  fontJetbrainsMono.variable,
  fontNotoSerif.variable,
  fontRobotoSlab.variable,
  fontMerriweather.variable,
  fontLora.variable,
  fontPlayfairDisplay.variable
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontVariables, "font-sans")}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
