"use client"

import {
  Home01Icon,
  Package02Icon,
  Settings01Icon,
  CommandIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { SidebarData } from "../types"

const DashboardIcon = () => (
  <HugeiconsIcon icon={Home01Icon} className="size-4" />
)
const ProductsIcon = () => (
  <HugeiconsIcon icon={Package02Icon} className="size-4" />
)
const SettingsIcon = () => (
  <HugeiconsIcon icon={Settings01Icon} className="size-4" />
)
const TeamLogo = () => <HugeiconsIcon icon={CommandIcon} className="size-4" />

/**
 * Sidebar navigation and teams. Extend navGroups for your app routes.
 */
export const sidebarData: Omit<SidebarData, "user"> = {
  teams: [
    {
      name: "Ecommerce App",
      logo: TeamLogo,
      plan: "Next.js + Shadcn",
    },
  ],
  navGroups: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: DashboardIcon,
        },
        {
          title: "Products",
          icon: ProductsIcon,
          items: [
            { title: "All products", url: "/dashboard/products" },
            { title: "Brands", url: "/dashboard/products/brands" },
            { title: "Add product", url: "/dashboard/products/new" },
          ],
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: SettingsIcon,
        },
      ],
    },
  ],
}
