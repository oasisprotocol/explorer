import { FC, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
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
      <div className="grid grid-cols-12 gap-x-4 gap-y-2">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <AppendMobileSearch scope={scope}>
            <div className="flex mb-1 flex-col sm:flex-row sm:items-center">
              <Typography
                variant="h4"
                sx={{ color: theme.palette.layout.main, fontWeight: 700, mr: 3, mb: isMobile ? 4 : 0 }}
              >
                {title}
              </Typography>
              {header}
            </div>
          </AppendMobileSearch>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-4 gap-y-2">{children}</div>
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
