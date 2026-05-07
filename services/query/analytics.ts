import { createQueryHookWithoutParams } from "@/lib/utils/services"
import { fetchAnalytics } from "@/services/api/analytics"
import { QUERY_KEYS } from "@/services/query/query-keys"

export const useFetchAnalytics = createQueryHookWithoutParams({
  queryKey: () => [QUERY_KEYS.ANALYTICS, QUERY_KEYS.DEVIATION],
  queryFn: fetchAnalytics,
})
