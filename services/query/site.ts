import { createQueryHookWithoutParams } from "@/lib/utils/services"
import { fetchSites } from "@/services/api/site"
import { QUERY_KEYS } from "@/services/query/query-keys"


export const useFetchSites = createQueryHookWithoutParams({
  queryKey: () => [QUERY_KEYS.SITE],
  queryFn: fetchSites,
})