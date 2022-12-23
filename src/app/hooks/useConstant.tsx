import { useRef } from 'react'

type UseConstantWrapper<T> = { v: T }

export const useConstant = <T extends any>(fn: () => T): T => {
  const ref = useRef<UseConstantWrapper<T>>()

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}
