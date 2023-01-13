import { FC, useCallback, useState } from 'react'
import { Logotype } from '../../components/PageLayout/Logotype'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import background from './images/background.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Search } from '../../components/Search'
import { ParaTimeSelector } from './ParaTimeSelector'
import { Footer } from '../../components/PageLayout/Footer'

const HomepageLayout = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  backgroundColor: COLORS.brandDark,
  overflow: 'hidden',
  '&::before': {
    content: '" "',
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("${background}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  [theme.breakpoints.up('sm')]: {
    minHeight: '800px',
    overflow: 'unset',
  },
}))

const Content = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: '1 1 0',
  padding: `0 ${theme.spacing(4)}`,
}))

const LogotypeBox = styled(Box)(({theme}) => ({
  zIndex: 3, marginBottom: 40, textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    marginBottom: 60,
  },
}))

const SearchInputBox = styled(Box)(({ theme }) => ({
  zIndex: 2,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '50vw',
  },
}))

const FooterStyled = styled(Box)(() => ({
  width: '100%',
  flex: '0 0 0',
}))

export const HomePage: FC = () => {
  const [searchHasFocus, setSearchHasFocus] = useState(false)

  const onFocusChange = useCallback(
    (hasFocus: boolean) => {
      setSearchHasFocus(hasFocus)
    },
    [setSearchHasFocus],
  )

  return (
    <HomepageLayout>
      <Content>
        <LogotypeBox>
          <Logotype showText />
        </LogotypeBox>
        <SearchInputBox>
          <Search onFocusChange={onFocusChange} />
        </SearchInputBox>
        <Box sx={{ zIndex: 1 }}>
          <ParaTimeSelector disabled={searchHasFocus} />
        </Box>
      </Content>
      <FooterStyled>
        <Footer />
      </FooterStyled>
    </HomepageLayout>
  )
}
