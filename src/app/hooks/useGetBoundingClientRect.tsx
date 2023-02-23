import { RefObject, useCallback, useLayoutEffect, useState } from 'react'

export const useGetBoundingClientRect = <T extends SVGElement>(
  ref: RefObject<T>,
): [DOMRect | null, () => void] => {
  const [rect, setRect] = useState<DOMRect | null>(null)

  const setBoundingRect = useCallback(() => {
    const boundingClientRect = ref.current?.getBoundingClientRect() ?? null
    setRect(boundingClientRect)
  }, [ref])

  useLayoutEffect(() => {
    setBoundingRect()
  }, [setBoundingRect])

  return [rect, setBoundingRect]
}
