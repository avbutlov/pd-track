import { createMutationHook, createQueryHookWithoutParams } from "@/lib/utils/services"
import { analyzePatterns, fetchPatternResults } from "@/services/api/pattern"
import { QUERY_KEYS } from "@/services/query/query-keys"

export const useAnalyzePatterns = createMutationHook({
  mutationFn: (locale: string) => analyzePatterns(locale),
})

export const useFetchPatternResults = createQueryHookWithoutParams({
  queryKey: () => [QUERY_KEYS.PATTERN],
  queryFn: fetchPatternResults,
})