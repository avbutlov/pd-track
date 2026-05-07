import { createMutationHook } from "@/lib/utils/services"
import { createCapa, suggestCapa, updateCapaStatus } from "@/services/api/capa"

export const useSuggestCapa = createMutationHook({
  mutationFn: (data: {
    description: string
    category: string
    severity: string | null
    locale: string
  }) => suggestCapa(data),
})

export const useCreateCapa = createMutationHook({
  mutationFn: (data: {
    deviationId: number
    description: string
    assignedTo: string
    dueDate: string
  }) => createCapa(data),
})

export const useUpdateCapaStatus = createMutationHook({
  mutationFn: (data: { capaId: number; status: string }) =>
    updateCapaStatus(data.capaId, data.status),
})
