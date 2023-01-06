import { FC, useCallback, useState } from 'react'
import { Logotype } from '../../components/PageLayout/Logotype'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import background from './images/background.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Search } from '../../components/Search'
import { ParatimeSelector } from './ParatimeSelector'
import { Footer } from '../../components/PageLayout/Footer'

const HomepageLayout = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: '100vh',
  backgroundColor: COLORS.brandDark,
  '&::before': {
    content: '" "',
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("${background}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
}))

const Content = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flex: '1 1 0',
}))

const FooterStyled = styled(Box)(() => ({
  width: '100%',
  flex: '0 0 0',
}))

export const HomePage: FC = () => {
  const { t } = useTranslation()
  const [searchHasFocus, setSearchHasFocus] = useState(false)

  const onSearchSubmit = useCallback((searchTerm: string) => {}, [])

  const onFocusChange = useCallback((hasFocus: boolean) => {
    setSearchHasFocus(hasFocus)
  }, [])

  return (
    <HomepageLayout>
      <Content>
        <Box sx={{ zIndex: 3, mb: '60px', textAlign: 'center' }}>
          <Logotype>
            <Typography variant="h1" color={COLORS.white}>
              {t('home.header')}
            </Typography>
          </Logotype>
        </Box>
        <Box sx={{ zIndex: 2, width: '50vw' }}>
          <Search onFocusChange={onFocusChange} onSearchSubmit={onSearchSubmit} />
        </Box>
        <Box sx={{ zIndex: 1 }}>
          <ParatimeSelector disabled={searchHasFocus} />
        </Box>
      </Content>
      <FooterStyled>
        <Footer />
      </FooterStyled>
    </HomepageLayout>
  )
}
