import { memo, useEffect, useRef } from 'react'
import jazzicon from '@metamask/jazzicon'

interface JazzIconProps {
  diameter: number
  seed: number
}

export const JazzIcon = memo(({ diameter, seed }: JazzIconProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref?.current) {
      const icon = jazzicon(diameter, seed)

      ref.current.replaceChildren(icon)
    }
  }, [diameter, ref, seed])

  return <div ref={ref} style={{ height: diameter, width: diameter, display: 'inline-block' }} />
})
