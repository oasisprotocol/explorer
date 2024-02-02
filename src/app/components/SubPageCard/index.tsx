import { FC, PropsWithChildren, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled, css, useTheme } from '@mui/material/styles'
import Skeleton from '@mui/material/Skeleton'

type StyledComponentProps = {
  featured?: boolean
  isLoadingTitle?: boolean
  title?: ReactNode
  subheader?: string
  action?: ReactNode
  noPadding?: boolean
}
type SubPageCardProps = PropsWithChildren<StyledComponentProps>

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'featured',
})<StyledComponentProps>(
  ({ featured, theme }) => css`
    ${featured && {
      margin: `-${theme.spacing(5)} -${theme.spacing(6)} ${theme.spacing(5)}`,
      padding: theme.spacing(5, 6, 4),
      borderRadius: '12px',
      boxShadow: '-20px 4px 40px rgba(34, 47, 63, 0.24)',
    }};
  `,
)

const StyledCard = styled(Card, {
  shouldForwardProp: prop => prop !== 'featured' && prop !== 'noPadding',
})<StyledComponentProps>(
  ({ featured, noPadding, theme }) => css`
    ${noPadding && {
      '&&': {
        padding: 0,
      },
    }}
    ${featured && {
      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing(6),
        paddingLeft: theme.spacing(6),
      },
    }};
  `,
)

const StyledCardContent = styled(CardContent, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<Pick<StyledComponentProps, 'noPadding'>>(({ noPadding }) => ({
  '&&': noPadding
    ? {
        padding: 0,
      }
    : {},
}))

const TitleSkeleton: FC = () => <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }} />

export const SubPageCard: FC<SubPageCardProps> = ({
  children,
  featured,
  isLoadingTitle,
  title,
  subheader,
  action,
  noPadding = false,
}) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()

  return (
    <div>
      {isMobile && (title || subheader || action) && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'baseline', mb: 4, mx: 4 }}>
          <Typography
            variant="h3"
            component="h3"
            sx={{ display: 'inline' }}
            color={theme.palette.layout.titleOnBackground}
          >
            {isLoadingTitle ? <TitleSkeleton /> : title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ ml: '1ex', display: 'inline', fontStyle: 'italic' }}
            color={theme.palette.layout.titleOnBackground}
          >
            {subheader}
          </Typography>
          {action && <Box sx={{ marginLeft: 'auto' }}>{action}</Box>}
        </Box>
      )}
      <StyledCard featured={featured} noPadding={noPadding} sx={{ backgroundColor: 'transparent' }}>
        {!isMobile && (
          <StyledBox featured={featured}>
            <CardHeader
              title={isLoadingTitle ? <TitleSkeleton /> : title}
              titleTypographyProps={{
                display: 'inline',
                component: 'h3',
                variant: 'h3',
              }}
              subheader={subheader}
              subheaderTypographyProps={{
                display: 'inline',
                marginLeft: '1ex',
              }}
              action={action}
            />
          </StyledBox>
        )}
        <StyledCardContent noPadding={noPadding}>{children}</StyledCardContent>
      </StyledCard>
    </div>
  )
}
