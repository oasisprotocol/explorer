import { FC, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const LinkableDiv: FC<JSX.IntrinsicElements['div'] & { id: string }> = props => {
  const { id } = props
  const { hash } = useLocation()
  const divRef = useRef<HTMLDivElement>(null)
  const element = divRef.current

  useEffect(() => {
    if (hash === `#${id}`) {
      if (element) {
        element.scrollIntoView({
          block: 'start',
        })
      } else {
        setTimeout(() => {
          if (divRef.current) {
            divRef.current.scrollIntoView({
              block: 'start',
            })
          }
        })
      }
    }
  }, [id, hash, element])

  return <div {...props} ref={divRef} />
}
