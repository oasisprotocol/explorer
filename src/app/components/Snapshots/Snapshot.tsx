import { FC, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTheme } from '@mui/material/styles'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'

type SnapshotProps = {
  children: ReactNode
  header?: ReactNode
  scope: SearchScope
  title: string
}

export const Snapshot: FC<SnapshotProps> = ({ children, header, scope, title }) => {
  const theme = useTheme()
  const { isMobile } = useScreenSize()

  return (
    <>
      <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Grid item xs={12} sx={{ px: isMobile ? 4 : 0 }}>
          <AppendMobileSearch scope={scope}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 2 }}>
              <Typography
                variant="h2"
                sx={{ color: theme.palette.layout.main, fontWeight: 700, mr: 3, mb: isMobile ? 4 : 0 }}
              >
                {title}
              </Typography>
              {header}
            </Box>
          </AppendMobileSearch>
        </Grid>
      </Grid>

      <Grid container rowSpacing={1} columnSpacing={4} columns={22}>
        {children}
      </Grid>
    </>
  )
}

export const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(4),
  },
  [theme.breakpoints.up('sm')]: {
    paddingBottom: theme.spacing(5),
  },
}))
