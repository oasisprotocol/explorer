import { FC, PropsWithChildren, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Search } from '../Search'
import { useScreenSize } from '../../hooks/useScreensize'
import { SearchScopeCandidate } from '../../../types/searchScope'

interface AppendMobileSearchProps {
  action?: ReactNode
}

interface AppendMobileSearchLayoutProps {
  action?: ReactNode
  isMobile: boolean
}

const Layout = styled(Box, {
  shouldForwardProp: prop => prop !== 'action' && prop !== 'isMobile',
})<AppendMobileSearchLayoutProps>(({ action, isMobile }) => ({
  position: 'relative',
  alignItems: isMobile ? 'center' : 'flex-start',
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

export const AppendMobileSearch: FC<
  PropsWithChildren<AppendMobileSearchProps> & { scope?: SearchScopeCandidate }
> = ({ scope, children, action }) => {
  const { isMobile } = useScreenSize()

  return (
    <Layout action={action} isMobile={isMobile}>
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
