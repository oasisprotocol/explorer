import { QueryObserverOptions as OriginalQueryObserverOptions, QueryKey } from '@tanstack/query-core'

declare module '@tanstack/query-core' {
  export interface QueryObserverOptions<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
  > extends OriginalQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey> {
    // Original type:
    // structuralSharing?: boolean | ((oldData: TData | undefined, newData: TData) => TData);
    structuralSharing?: boolean | ((oldData: undefined | TData, newData: TQueryData) => TData)
  }
}
