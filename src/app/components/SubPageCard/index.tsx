import { FC, PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { styled, css } from '@mui/material/styles'

type SubPageCardProps = PropsWithChildren & { leadingHeader?: boolean; title: string }

type StyledBoxProps = {
  leadingHeader?: boolean
}

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'headerShadow',
})<StyledBoxProps>(
  ({ leadingHeader, theme }) => css`
    ${leadingHeader &&
    `
      margin: -${theme.spacing(4)} -${theme.spacing(5)} ${theme.spacing(5)};
      padding: ${theme.spacing(5)} ${theme.spacing(6)} ${theme.spacing(4)};
      border-radius: 12px;
      box-shadow: -20px 4px 40px rgba(34, 47, 63, 0.24);
    `};
  `,
)

export const SubPageCard: FC<SubPageCardProps> = ({ children, leadingHeader, title }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      {isMobile && (
        <Typography variant="h3" component="h3" sx={{ mb: 4, ml: 4 }} color={COLORS.white}>
          {title}
        </Typography>
      )}
      <Card>
        {!isMobile && (
          <StyledBox leadingHeader={leadingHeader}>
            <CardHeader disableTypography component="h3" title={title} />
          </StyledBox>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </>
  )
}
