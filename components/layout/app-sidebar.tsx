"use client"

import { useLayout } from "@/lib/providers/layout-provider"
import { useSession } from "next-auth/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { sidebarData } from "./data/sidebar-data"
import { NavGroup } from "./nav-group"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { data: session } = useSession()

  const user =
    session?.user
      ? {
          name: session.user.name ?? "User",
          email: session.user.email ?? "No email",
          image:
            (session.user as { image?: string }).image ?? "/avatars/shadcn.png",
        }
      : {
          name: "User",
          email: "No email",
          image: "/avatars/shadcn.png",
        }

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant as "sidebar" | "floating" | "inset"}
    >
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
