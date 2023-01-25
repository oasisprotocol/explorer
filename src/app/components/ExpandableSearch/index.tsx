import { FC, PropsWithChildren } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Search } from '../Search'
import useMediaQuery from '@mui/material/useMediaQuery'

const ExpandableSearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  '> div:nth-of-type(1)': {
    flex: '0 1 calc(100% - 50px)',
  },
  '> div:nth-of-type(2)': {
    flex: '0 1 50px',
    height: '47px',
  },
  [theme.breakpoints.up('sm')]: {
    '> div:nth-of-type(1)': {
      flex: '0 1 100%',
    },
  },
}))

export const ExpandableSearch: FC<PropsWithChildren<{}>> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <ExpandableSearchBox>
      <Box>{children}</Box>

      {isMobile && (
        <Box>
          <Search variant="expandable" />
        </Box>
      )}
    </ExpandableSearchBox>
  )
}
