import { FC, ReactNode } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
    <Card
      sx={{
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTop: 'none',
      }}
    >
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
