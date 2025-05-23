import { createContext, useContext } from 'react'

export type AdjustmentProcess = 'minimize' | 'adjusting'

export interface ControlSignals {
  onMount: (id: string) => void
  onUnmount: (id: string) => void
  shouldMinimize: boolean
  shouldAdjust: boolean
  reportProcessFinish(process: AdjustmentProcess): void
}

export interface AdaptiveTrimmerContextData {
  useController(id: string): ControlSignals
}

export const AdaptiveTrimmerContext = createContext<AdaptiveTrimmerContextData>(
  {} as AdaptiveTrimmerContextData,
)

export const useAdaptiveTrimmerContext = () => {
  const value = useContext(AdaptiveTrimmerContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useAdaptiveTrimmerContext] Component not wrapped within a Provider')
  }

  return value
}
