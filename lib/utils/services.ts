import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query"

export type QueryHookOptions<
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>

export const createQueryHook = <
  TQueryFnData,
  TParams,
  TError = Error,
  TData = TQueryFnData,
>(config: {
  queryKey: (params: TParams) => readonly unknown[]
  queryFn: (params: TParams) => Promise<TQueryFnData>
  mapper?: (data: TQueryFnData) => TData
}) => {
  return (
    params: TParams,
    options?: QueryHookOptions<TQueryFnData, TError, TData>
  ) => {
    return useQuery({
      queryKey: config.queryKey(params),
      queryFn: () => config.queryFn(params),
      select: options?.select || config.mapper,
      ...options,
    })
  }
}

export const createQueryHookWithoutParams = <
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
>(config: {
  queryKey: () => readonly unknown[]
  queryFn: () => Promise<TQueryFnData>
  mapper?: (data: TQueryFnData) => TData
}) => {
  return (options?: QueryHookOptions<TQueryFnData, TError, TData>) => {
    return useQuery({
      queryKey: config.queryKey(),
      queryFn: () => config.queryFn(),
      select: options?.select || config.mapper,
      refetchOnWindowFocus: false,
      ...options,
    })
  }
}

export const createMutationHook = <
  TData,
  TVariables,
  TError = Error,
  TContext = unknown,
>(config: {
  mutationFn: (variables: TVariables) => Promise<TData>
}) => {
  return (
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
  ) => {
    return useMutation({
      mutationFn: config.mutationFn,
      ...options,
    })
  }
}