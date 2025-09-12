import { FC, PropsWithChildren, ReactNode } from 'react'
import Card from '@mui/material/Card'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { styled } from '@mui/material/styles'

export const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&': {
    padding: 0,
    margin: 0,
  },
  height: 186,
}))

const StyledCardContent = styled(CardContent, {
  shouldForwardProp: prop => prop !== 'withContentPadding',
})<{ withContentPadding: boolean }>(({ theme, withContentPadding }) => ({
  position: 'relative',
  paddingTop: theme.spacing(withContentPadding ? 4 : 0),
  height: '100%',
}))

type SnapshotCardProps = PropsWithChildren & {
  badge?: ReactNode
  label?: ReactNode
  title: ReactNode
  withContentPadding?: boolean
  alignWithCardsWithActions?: boolean
}

export const SnapshotCard: FC<SnapshotCardProps> = ({
  badge,
  children,
  title,
  label,
  withContentPadding = true,
  alignWithCardsWithActions = false,
}) => {
  return (
    <StyledCard>
      <Typography variant="h4" className="pl-4 pt-4">
        {title}
      </Typography>
      <StyledCardContent withContentPadding={withContentPadding}>{children}</StyledCardContent>
      {(badge || label || alignWithCardsWithActions) && (
        <CardActions sx={{ minHeight: 60 }}>
          <div className="flex justify-between items-center w-full px-4 pb-4">
            <div>{badge}</div>
            <Typography textColor="muted" className="flex-1">
              {label}
            </Typography>
          </div>
        </CardActions>
      )}
    </StyledCard>
  )
}

type SnapshotTextCardProps = {
  children: ReactNode
  label?: ReactNode
  title: ReactNode
  withContentPadding?: boolean
  alignWithCardsWithActions?: boolean
}

export const SnapshotTextCard: FC<SnapshotTextCardProps> = ({
  children,
  label,
  title,
  withContentPadding,
  alignWithCardsWithActions,
}) => {
  return (
    <SnapshotCard
      title={title}
      label={label}
      withContentPadding={withContentPadding}
      alignWithCardsWithActions={alignWithCardsWithActions}
    >
      <div className="h-full flex items-center justify-center">
        <span className="text-2xl font-semibold text-primary flex-1 text-center px-4">{children}</span>
      </div>
    </SnapshotCard>
  )
}
