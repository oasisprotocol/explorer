import { RefObject, useLayoutEffect, useState } from 'react'

export const useGetBoundingClientRect = <T extends SVGElement>(ref: RefObject<T>): DOMRect | null => {
  const [rect, setRect] = useState<DOMRect | null>(null)

  // TODO: Add window resize listener
  useLayoutEffect(() => {
    const boundingClientRect = ref.current?.getBoundingClientRect() ?? null
    setRect(boundingClientRect)
  }, [])

  return rect
}
