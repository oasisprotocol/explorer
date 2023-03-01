import { FC, PropsWithChildren } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Search } from '../Search'
import useMediaQuery from '@mui/material/useMediaQuery'

const Layout = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
}))

const SearchWrapper = styled(Box)(() => ({
  width: '50px',
  height: '47px',
}))

export const AppendMobileSearch: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Layout>
      <Box>{children}</Box>

      {isMobile && (
        <SearchWrapper>
          <Search variant="expandable" />
        </SearchWrapper>
      )}
    </Layout>
  )
}
