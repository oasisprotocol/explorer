import { FC, ReactNode } from 'react'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type LinkableCardLayoutProps = {
  children: ReactNode
  containerId: string
  title: ReactNode
  action?: ReactNode | undefined
}
export const LinkableCardLayout: FC<LinkableCardLayoutProps> = ({ children, containerId, title, action }) => {
  return (
    <Card variant="layout" className="rounded-t-none border-t-0">
      <LinkableDiv id={containerId}>
        <div className="flex items-center justify-between p-4">
          <Typography variant="h3">{title}</Typography>
          {action ? <div className="self-start -mt-2 -mr-2">{action}</div> : null}
        </div>
      </LinkableDiv>
      <CardContent>
        <ErrorBoundary light={true}>{children}</ErrorBoundary>
      </CardContent>
    </Card>
  )
}
