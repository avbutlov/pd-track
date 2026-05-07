"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle, Search, X } from "lucide-react"
import { ROUTES, PAGINATION_DEFAULT_LIMIT } from "@/constants"
import {
  CATEGORY_KEYS,
  STATUS_KEYS,
  getCategoryLabel,
  getStatusLabel,
  getSeverityVariant,
  getSeverityLabel,
} from "@/lib/utils/deviation"
import { useTranslation } from "react-i18next"
import { useFetchDeviations } from "@/services/query/deviation"
import { useFetchSites } from "@/services/query/site"

const INITIAL_PAGE = 1

export function DeviationsTable() {
  const { t } = useTranslation()
  const [page, setPage] = useState(INITIAL_PAGE)
  const [filters, setFilters] = useState({
    siteId: "",
    category: "",
    severity: "",
    status: "",
    search: "",
  })

  const getDeviationsSearchParams = () => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(PAGINATION_DEFAULT_LIMIT),
    }

    if (filters.siteId) params.siteId = filters.siteId
    if (filters.category) params.category = filters.category
    if (filters.severity) params.severity = filters.severity
    if (filters.status) params.status = filters.status
    if (filters.search) params.search = filters.search

    return params
  }

  const { data: deviationsData, isLoading: isLoadingDeviationsData } =
    useFetchDeviations(getDeviationsSearchParams())

  const deviations = deviationsData?.deviations ?? []
  const totalPages = deviationsData?.pagination.totalPages ?? INITIAL_PAGE

  const { data: sites = [] } = useFetchSites()

  const clearFilters = () => {
    setFilters({
      siteId: "",
      category: "",
      severity: "",
      status: "",
      search: "",
    })
    setPage(INITIAL_PAGE)
  }
  const hasFilters = Object.values(filters).some(Boolean)
  const categoryKeys = CATEGORY_KEYS
  const statusKeys = STATUS_KEYS

  console.log(deviations, sites)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("deviations.title")}
          </h1>
          <p className="text-muted-foreground">{t("deviations.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DEVIATION_NEW}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("deviations.newDeviation")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {t("deviations.filters")}
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-3 w-3" />
                {t("deviations.clear")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-5">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("deviations.search")}
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value })
                  setPage(INITIAL_PAGE)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.siteId}
              onValueChange={(v) => {
                setFilters({ ...filters, siteId: v === "all" ? "" : v })
                setPage(INITIAL_PAGE)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("deviations.allSites")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("deviations.allSites")}</SelectItem>
                {sites.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.code} — {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={(v) => {
                setFilters({ ...filters, category: v === "all" ? "" : v })
                setPage(INITIAL_PAGE)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("deviations.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("deviations.allCategories")}
                </SelectItem>
                {categoryKeys.map((k) => (
                  <SelectItem key={k} value={k}>
                    {t(`categories.${k}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.severity}
              onValueChange={(v) => {
                setFilters({ ...filters, severity: v === "all" ? "" : v })
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("deviations.allSeverity")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("deviations.allSeverity")}
                </SelectItem>
                <SelectItem value="major">{t("severities.major")}</SelectItem>
                <SelectItem value="minor">{t("severities.minor")}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(v) => {
                setFilters({ ...filters, status: v === "all" ? "" : v })
                setPage(INITIAL_PAGE)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("deviations.allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("deviations.allStatus")}</SelectItem>
                {statusKeys.map((k) => (
                  <SelectItem key={k} value={k}>
                    {t(`statuses.${k}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoadingDeviationsData ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("deviations.number")}</TableHead>
                    <TableHead>{t("deviations.site")}</TableHead>
                    <TableHead>{t("deviations.patient")}</TableHead>
                    <TableHead>{t("deviations.category")}</TableHead>
                    <TableHead>{t("deviations.severity")}</TableHead>
                    <TableHead>{t("deviations.status")}</TableHead>
                    <TableHead>{t("deviations.date")}</TableHead>
                    <TableHead>{t("deviations.capas")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deviations.map((dev) => (
                    <TableRow
                      key={dev.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <Link
                          href={ROUTES.DEVIATION_DETAIL(dev.id)}
                          className="font-mono text-sm font-medium text-primary hover:underline"
                        >
                          {dev.deviationNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{dev.site.code}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {dev.patientId}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getCategoryLabel(dev.category, t)}
                      </TableCell>
                      <TableCell>
                        {dev.severity ? (
                          <Badge variant={getSeverityVariant(dev.severity)}>
                            {getSeverityLabel(dev.severity, t)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">—</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getStatusLabel(dev.status, t)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(dev.deviationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {dev._count?.capas ? (
                          <Badge variant="secondary">{dev._count.capas}</Badge>
                        ) : (
                          <span className="ml-1.5">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {deviations.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {t("deviations.noDeviations")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  {t("common.page")} {totalPages && page} {t("common.of")}{" "}
                  {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    {t("common.previous")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
