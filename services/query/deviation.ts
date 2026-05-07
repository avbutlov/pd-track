import { createMutationHook, createQueryHook } from "@/lib/utils/services"
import {
  classifyDeviation,
  createDeviation,
  fetchDeviation,
  fetchDeviations,
  updateDeviation,
} from "@/services/api/deviation"
import { QUERY_KEYS } from "@/services/query/query-keys"

export const useFetchDeviations = createQueryHook({
  queryKey: (params: Record<string, string>) => [QUERY_KEYS.DEVIATION, params],
  queryFn: (params: Record<string, string>) => fetchDeviations(params),
})

export const useFetchDeviation = createQueryHook({
  queryKey: (id: string) => [QUERY_KEYS.DEVIATION, id],
  queryFn: (id: string) => fetchDeviation(id),
})

export const useCreateDeviation = createMutationHook({
  mutationFn: (data: {
    siteId: string
    patientId: string
    deviationDate: string
    description: string
    category: string
  }) => createDeviation(data),
})

export const useClassifyDeviation = createMutationHook({
  mutationFn: (data: { deviationId: number; locale: string }) =>
    classifyDeviation(data.deviationId, data.locale),
})

export const useUpdateDeviation = createMutationHook({
  mutationFn: (data: {
    id: number
    severity?: string | null
    severityRationale?: string | null
    status?: string
    description?: string
    category?: string
  }) => {
    const { id, ...rest } = data
    return updateDeviation(id, rest)
  },
})
