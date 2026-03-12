import type { ElementType } from "react"

export type LayoutUser = {
  name: string
  email: string
  image?: string
}

export type LayoutTeam = {
  name: string
  logo: ElementType<{ className?: string }>
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: ElementType<{ className?: string }>
  permissions?: string[]
}

export type LayoutNavLink = BaseNavItem & {
  url: string
  items?: never
}

export type LayoutNavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

export type LayoutNavItem = LayoutNavCollapsible | LayoutNavLink

export type LayoutNavGroup = {
  title: string
  items: LayoutNavItem[]
}

export type SidebarData = {
  user: LayoutUser
  teams: LayoutTeam[]
  navGroups: LayoutNavGroup[]
}
