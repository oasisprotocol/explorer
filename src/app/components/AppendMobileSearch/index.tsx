import { FC, PropsWithChildren, ReactNode } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Search } from '../Search'
import useMediaQuery from '@mui/material/useMediaQuery'
import { SearchScope } from '../../../types/searchScope'

interface AppendMobileSearchProps {
  action?: ReactNode
}

const Layout = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['action'] as (keyof AppendMobileSearchProps)[]).includes(prop as keyof AppendMobileSearchProps),
})<AppendMobileSearchProps>(({ action }) => ({
  position: 'relative',
  alignItems: 'flex-start',
  width: '100%',
  ...(action
    ? {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
      }
    : {
        display: 'flex',
        justifyContent: 'space-between',
      }),
}))

const SearchWrapper = styled(Box)(() => ({
  width: '50px',
  height: '47px',
  marginLeft: 'auto',
}))

export const AppendMobileSearch: FC<PropsWithChildren<AppendMobileSearchProps> & { scope?: SearchScope }> = ({
  scope,
  children,
  action,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Layout action={action}>
      <Box>{children}</Box>

      {action}

      {isMobile && (
        <SearchWrapper>
          <Search scope={scope} variant="expandable" />
        </SearchWrapper>
      )}
    </Layout>
  )
}
