import { createMutationHook, createQueryHook, createQueryHookWithoutParams } from "@/lib/utils/services"
import { fetchReports, generateReport } from "@/services/api/report"
import { QUERY_KEYS } from "@/services/query/query-keys"

export const useGenerateReport = createMutationHook({
  mutationFn: (data: {
    startDate: string
    endDate: string
    locale: string
  }) => generateReport(data),
})

export const useFetchReports = createQueryHookWithoutParams({
  queryKey: () => [QUERY_KEYS.REPORT],
  queryFn: fetchReports,
})