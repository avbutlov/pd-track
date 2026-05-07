"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BarChart3,
  BrainCircuit,
  FileText,
  Activity,
} from "lucide-react"
import { ROUTES } from "@/constants"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTranslation } from "react-i18next"

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { open: isSidebarOpen } = useSidebar()

  const navItems = [
    { title: t("nav.dashboard"), url: ROUTES.HOME, icon: LayoutDashboard },
    { title: t("nav.deviations"), url: ROUTES.DEVIATIONS, icon: ClipboardList },
    {
      title: t("nav.newDeviation"),
      url: ROUTES.DEVIATION_NEW,
      icon: PlusCircle,
    },
  ]
  const analyticsItems = [
    { title: t("nav.analytics"), url: ROUTES.ANALYTICS, icon: BarChart3 },
    {
      title: t("nav.aiPatterns"),
      url: ROUTES.ANALYTICS_PATTERNS,
      icon: BrainCircuit,
    },
  ]
  const reportItems = [
    { title: t("nav.reports"), url: ROUTES.REPORTS, icon: FileText },
  ]

  const isActive = (url: string) => {
    return url === "/" ? pathname === "/" : url === pathname
  }

  const tooltipActivityState = isSidebarOpen ? false : undefined

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 px-2 py-3 whitespace-nowrap transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-[width,height] duration-200 ease-linear group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5">
            <Activity className="h-5 w-5 transition-[width,height] duration-200 ease-linear group-data-[collapsible=icon]:w-3" />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight">
              {t("common.appName")}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {t("common.appDescription")}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.main")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <Tooltip open={tooltipActivityState}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="group-data-[state=expanded]:hidden"
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.analyticsAi")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <Tooltip open={tooltipActivityState}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="group-data-[state=expanded]:hidden"
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.reports")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <Tooltip open={tooltipActivityState}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="group-data-[state=expanded]:hidden"
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
