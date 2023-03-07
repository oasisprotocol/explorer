import { FC, PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { styled, css } from '@mui/material/styles'
import Skeleton from '@mui/material/Skeleton'

type StyledComponentProps = {
  featured?: boolean
}
type SubPageCardProps = PropsWithChildren &
  StyledComponentProps & { isLoadingTitle?: boolean; title?: string; subheader?: string }

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'featured',
})<StyledComponentProps>(
  ({ featured, theme }) => css`
    ${featured && {
      margin: `-${theme.spacing(5)} -${theme.spacing(6)} ${theme.spacing(5)}`,
      padding: `${theme.spacing(5)} ${theme.spacing(6)} ${theme.spacing(4)}`,
      borderRadius: '12px',
      boxShadow: '-20px 4px 40px rgba(34, 47, 63, 0.24)',
    }};
  `,
)

const StyledCard = styled(Card, {
  shouldForwardProp: prop => prop !== 'featured',
})<StyledComponentProps>(
  ({ featured, theme }) => css`
    ${featured && {
      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing(6),
        paddingLeft: theme.spacing(6),
      },
    }};
  `,
)

const TitleSkeleton: FC = () => (
  <Skeleton variant="text" sx={{ display: 'inline-block', width: '100%' }}></Skeleton>
)

export const SubPageCard: FC<SubPageCardProps> = ({
  children,
  featured,
  isLoadingTitle,
  title,
  subheader,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div>
      {isMobile && (
        <Box sx={{ mb: 4, mx: 4 }}>
          <Typography variant="h3" component="h3" sx={{ display: 'inline' }} color={COLORS.white}>
            {isLoadingTitle ? <TitleSkeleton /> : title}
          </Typography>
          <Typography variant="subtitle1" sx={{ ml: '1ex', display: 'inline' }} color={COLORS.white}>
            {subheader}
          </Typography>
        </Box>
      )}
      <StyledCard featured={featured}>
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
            />
          </StyledBox>
        )}
        <CardContent>{children}</CardContent>
      </StyledCard>
    </div>
  )
}
