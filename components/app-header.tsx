"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import type { Locale } from "@/i18n/config"
import { LOCALE_LABELS } from "@/i18n/config"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useTranslation } from "react-i18next"
import Cookies from "js-cookie"

export function AppHeader() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)

    Cookies.set("locale", language)
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(
              ([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
