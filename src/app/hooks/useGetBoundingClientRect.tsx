import { RefObject, useLayoutEffect, useState } from 'react'

export const useGetBoundingClientRect = <T extends SVGElement>(
  ref: RefObject<T>,
): [DOMRect | null, () => void] => {
  const [rect, setRect] = useState<DOMRect | null>(null)

  const setBoundingRect = () => {
    const boundingClientRect = ref.current?.getBoundingClientRect() ?? null
    setRect(boundingClientRect)
  }

  // TODO: Add window resize listener
  useLayoutEffect(() => {
    setBoundingRect()
  }, [])

  return [rect, setBoundingRect]
}
