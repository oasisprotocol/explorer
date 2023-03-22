import { FC, useState } from 'react'
import { Logotype } from '../../components/PageLayout/Logotype'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import background from './images/background.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Search, SearchVariant } from '../../components/Search'
import { ParaTimeSelector } from './Graph/ParaTimeSelector'
import { Footer } from '../../components/PageLayout/Footer'
import useMediaQuery from '@mui/material/useMediaQuery'
import { OfflineIndicator } from './OfflineIndicator'
import { useGetStatus } from '../../../oasis-indexer/api'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import { ParaTimeSelectorStep } from './Graph/types'
import { BuildPreviewBanner } from '../../components/BuildPreviewBanner'

export const zIndexHomePage = {
  paraTimeSelector: 1,
  searchInput: 2,
  logo: 3,
  mobileTooltip: 4,
}

const HomepageLayout = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  height: 'fill-available',
  minHeight: '100vh',
  backgroundColor: COLORS.brandDark,
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    height: '100vh',
    minHeight: '800px',
    '&::before': {
      content: '" "',
      position: 'absolute',
      inset: 0,
      backgroundImage: `url("${background}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
  },
}))

const Content = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: '1 1 0',
  padding: `0 ${theme.spacing(4)}`,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}))

const LogotypeBox = styled(Box)(({ theme }) => ({
  zIndex: zIndexHomePage.logo,
  marginBottom: 40,
  textAlign: 'center',
  marginTop: 60,
  [theme.breakpoints.up('sm')]: {
    marginBottom: 60,
    marginTop: 'unset',
  },
}))

const SearchInputContainer = styled(Box)(({ theme }) => ({
  zIndex: zIndexHomePage.searchInput,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}))

const SearchInputBox = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  [theme.breakpoints.up('sm')]: {
    width: '75vw',
  },
  [theme.breakpoints.up('md')]: {
    width: '50vw',
  },
}))

const FooterStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  flex: '0 0 0',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(2),
  },
}))

export const HomePage: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const infoAriaLabel = t('home.helpScreen.infoIconAria')
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const apiStatusQuery = useGetStatus()
  const isApiOffline = apiStatusQuery.isFetched && !apiStatusQuery.isSuccess

  const [searchHasFocus, setSearchHasFocus] = useState(false)
  const [step, setStep] = useState<ParaTimeSelectorStep>(ParaTimeSelectorStep.EnableExplore)

  const onFocusChange = (hasFocus: boolean) => {
    setSearchHasFocus(hasFocus)
  }

  const onToggleInfoScreenClick = () => {
    setStep(ParaTimeSelectorStep.ShowHelpScreen)
  }

  const searchVariant: SearchVariant = isMobile ? 'icon' : 'button'
  const showInfoScreenBtn = isMobile && step !== ParaTimeSelectorStep.ShowHelpScreen

  return (
    <>
      <BuildPreviewBanner />
      <HomepageLayout>
        <Content>
          <LogotypeBox>
            <Logotype showText />
          </LogotypeBox>
          <SearchInputContainer>
            <SearchInputBox>
              <Search disabled={isApiOffline} variant={searchVariant} onFocusChange={onFocusChange} />
            </SearchInputBox>
            {isApiOffline && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <OfflineIndicator />
              </Box>
            )}
          </SearchInputContainer>
          <Box sx={{ zIndex: zIndexHomePage.paraTimeSelector }}>
            <ParaTimeSelector step={step} setStep={setStep} disabled={searchHasFocus} />
          </Box>
        </Content>

        <FooterStyled>
          {showInfoScreenBtn && (
            <IconButton aria-label={infoAriaLabel} onClick={onToggleInfoScreenClick}>
              <InfoOutlinedIcon fontSize="medium" sx={{ color: 'white' }} />
            </IconButton>
          )}
          {!isMobile && <Footer />}
        </FooterStyled>
      </HomepageLayout>
    </>
  )
}
