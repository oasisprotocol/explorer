import { FC, PropsWithChildren, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { styled, css } from '@mui/material/styles'

type StyledComponentProps = {
  featured?: boolean
}
type SubPageCardProps = PropsWithChildren & StyledComponentProps & { title: ReactNode }

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

export const SubPageCard: FC<SubPageCardProps> = ({ children, featured, title }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      {isMobile && (
        <Typography variant="h3" component="h3" sx={{ mb: 4, ml: 4 }} color={COLORS.white}>
          {title}
        </Typography>
      )}
      <StyledCard featured={featured}>
        {!isMobile && (
          <StyledBox featured={featured}>
            <CardHeader disableTypography component="h3" title={title} />
          </StyledBox>
        )}
        <CardContent>{children}</CardContent>
      </StyledCard>
    </>
  )
}
