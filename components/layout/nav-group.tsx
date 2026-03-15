"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ChevronRight } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { hasPermission } from "@/lib/utils/permissions"

import { useAuthSession } from "@/features/auth/api"

import type {
  LayoutNavCollapsible,
  LayoutNavGroup as NavGroupProps,
  LayoutNavItem,
  LayoutNavLink,
} from "./types"

function isNavLink(item: LayoutNavItem): item is LayoutNavLink {
  return "url" in item && item.url !== undefined
}

function checkIsActive(
  pathname: string,
  item: LayoutNavItem,
  mainNav = false
): boolean {
  const url = "url" in item ? item.url : undefined
  const items = "items" in item ? item.items : undefined
  return (
    pathname === url ||
    (url && pathname.split("?")[0] === url) ||
    !!items?.some((i) => i.url === pathname) ||
    (mainNav &&
      !!url &&
      pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] === url.split("/")[1])
  )
}

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const pathname = usePathname()
  const { data: session } = useAuthSession()
  const userPermissions =
    (session?.user as { user_permissions?: string[] } | undefined)
      ?.user_permissions ?? []

  const visibleItems = items.filter((item) => {
    if (!hasPermission(userPermissions, item.permissions)) {
      return false
    }
    if (!isNavLink(item) && item.items) {
      const visibleChildren = item.items.filter((child) =>
        hasPermission(userPermissions, child.permissions)
      )
      return visibleChildren.length > 0
    }
    return true
  })

  if (visibleItems.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const key = isNavLink(item)
            ? `${item.title}-${item.url}`
            : `${item.title}-collapsible`

          if (!isNavLink(item) && item.items) {
            const collapsibleItem = item as LayoutNavCollapsible
            const filteredChildren = collapsibleItem.items.filter((child) =>
              hasPermission(userPermissions, child.permissions)
            )
            const itemWithFilteredChildren = {
              ...collapsibleItem,
              items: filteredChildren,
            }
            if (state === "collapsed" && !isMobile) {
              return (
                <SidebarMenuCollapsedDropdown
                  key={key}
                  item={itemWithFilteredChildren}
                  pathname={pathname}
                />
              )
            }
            return (
              <SidebarMenuCollapsible
                key={key}
                item={itemWithFilteredChildren}
                pathname={pathname}
              />
            )
          }

          const linkItem = item as LayoutNavLink
          return (
            <SidebarMenuLink key={key} item={linkItem} pathname={pathname} />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function SidebarMenuLink({
  item,
  pathname,
}: {
  item: LayoutNavLink
  pathname: string
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={checkIsActive(pathname, item)}
        tooltip={item.title}
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  pathname,
}: {
  item: LayoutNavCollapsible
  pathname: string
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(pathname, item, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <HugeiconsIcon
              icon={ChevronRight}
              strokeWidth={2}
              className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(pathname, {
                    ...subItem,
                    url: subItem.url,
                  })}
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  pathname,
}: {
  item: LayoutNavCollapsible
  pathname: string
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(pathname, item)}
          >
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <HugeiconsIcon
              icon={ChevronRight}
              strokeWidth={2}
              className="ms-auto transition-transform duration-200"
            />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link
                href={sub.url}
                className={
                  checkIsActive(pathname, { ...sub, url: sub.url })
                    ? "bg-secondary"
                    : ""
                }
              >
                {sub.icon && <sub.icon />}
                <span className="max-w-52 text-wrap">{sub.title}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
