import { FC, PropsWithChildren, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled, css, useTheme } from '@mui/material/styles'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'

type StyledComponentProps = {
  featured?: boolean
  isLoadingTitle?: boolean
  title?: ReactNode
  subheader?: ReactNode
  action?: ReactNode
  /**
   * An optional second title which will be displayed under title / subheader / action
   */
  title2?: ReactNode
  noPadding?: boolean
  mainTitle?: boolean
}
type SubPageCardProps = PropsWithChildren<StyledComponentProps>

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'featured',
})<StyledComponentProps>(
  ({ featured, theme }) => css`
    ${featured && {
      margin: `-${theme.spacing(5)} -${theme.spacing(6)} ${theme.spacing(5)}`,
      padding: theme.spacing(5, 6, 4),
      borderRadius: '6px',
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

const TitleSkeleton: FC = () => <Skeleton className="h-4" />

export const SubPageCard: FC<SubPageCardProps> = ({
  children,
  featured,
  isLoadingTitle,
  title,
  subheader,
  action,
  title2,
  noPadding = false,
  mainTitle = false,
}) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()

  return (
    <div>
      {isMobile && (title || subheader || action) && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'baseline', mb: 4, mx: 4 }}>
          <Typography
            variant={mainTitle ? 'h2' : 'h3'}
            component={mainTitle ? 'h2' : 'h3'}
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
      {title2 && (
        <Box
          sx={{
            color: theme.palette.layout.titleOnBackground,
            mb: 4,
            mx: 4,
          }}
        >
          {title2}
        </Box>
      )}
      <StyledCard featured={featured} noPadding={noPadding}>
        {!isMobile && (
          <StyledBox featured={featured}>
            <CardHeader
              title={isLoadingTitle ? <TitleSkeleton /> : title}
              titleTypographyProps={{
                display: 'inline',
                component: mainTitle ? 'h2' : 'h3',
                variant: mainTitle ? 'h2' : 'h3',
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
