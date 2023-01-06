import { FC, PropsWithChildren } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

type SubPageCardProps = PropsWithChildren & { title: string }

export const SubPageCard: FC<SubPageCardProps> = ({ children, title }) => {
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
        {!isMobile && <CardHeader disableTypography component="h3" title={title} />}
        <CardContent>{children}</CardContent>
      </Card>
    </>
  )
}
