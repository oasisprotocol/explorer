import Card from '@mui/material/Card'
import { FC } from 'react'
import { LinkableDiv } from './LinkableDiv'

/**
 * Native scrolling to an anchor name doesn't work if element is not rendered yet (e.g. after reload).
 * This checks if id matches anchor name in URL fragment and scrolls to it when component is mounted.
 */
export const ScrollingCard: FC<Parameters<typeof Card>[0] & { id: string }> = props => {
  const { id, ...rest } = props
  return (
    <LinkableDiv id={id}>
      <Card {...rest} />
    </LinkableDiv>
  )
}
