import { FC, useState } from 'react'
import { Logotype } from '../../components/PageLayout/Logotype'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import background from './images/background.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Search, SearchVariant } from '../../components/Search'
import { ParaTimeSelector } from './Graph/ParaTimeSelector'
import { Footer } from '../../components/PageLayout/Footer'
import { useScreenSize } from '../../hooks/useScreensize'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useTranslation } from 'react-i18next'
import { ParaTimeSelectorStep } from './Graph/types'
import { BuildBanner } from '../../components/BuildBanner'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { ThemeByScope } from '../../components/ThemeByScope'
import { NetworkOfflineBanner } from '../../components/OfflineBanner'
import { useIsApiReachable } from '../../components/OfflineBanner/hook'

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
  maxWidth: '100%',
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

const SearchInputContainer = styled(Box, {
  shouldForwardProp: prop => prop !== 'transparent',
})<{ transparent: boolean }>(({ theme, transparent }) => ({
  position: 'relative',
  zIndex: zIndexHomePage.searchInput,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
    '&:not(:hover)': {
      ...(transparent
        ? {
            opacity: 0.5,
          }
        : {}),
    },
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
  padding: `0 ${theme.spacing(6)}`,
  [theme.breakpoints.up('md')]: {
    // needed to make footer elements clickable
    zIndex: zIndexHomePage.paraTimeSelector,
  },
}))

const InfoScreenBtn = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(6),
  zIndex: zIndexHomePage.paraTimeSelector,
}))

export const HomePage: FC = () => {
  const { t } = useTranslation()
  const infoAriaLabel = t('home.helpScreen.infoIconAria')
  const { isMobile } = useScreenSize()
  const { network } = useSearchQueryNetworkParam()
  const isApiReachable = useIsApiReachable(network).reachable

  const [searchHasFocus, setSearchHasFocus] = useState(false)
  const [isGraphZoomedIn, setIsGraphZoomedIn] = useState(false)
  const [step, setStep] = useState<ParaTimeSelectorStep>(() => {
    if (isMobile) {
      return ParaTimeSelectorStep.EnableExplore
    }

    return ParaTimeSelectorStep.Explore
  })
  const [showInfoScreen, setShowInfoScreen] = useState<boolean>(false)

  const onFocusChange = (hasFocus: boolean) => {
    setSearchHasFocus(hasFocus)
  }

  const onToggleInfoScreenClick = () => {
    setStep(ParaTimeSelectorStep.ShowHelpScreen)
    setShowInfoScreen(true)
  }

  const searchVariant: SearchVariant = isMobile ? 'icon' : 'button'
  const showInfoScreenBtn = isMobile && step !== ParaTimeSelectorStep.ShowHelpScreen

  return (
    <>
      <BuildBanner />
      <NetworkOfflineBanner wantedNetwork={network} />
      <HomepageLayout>
        <Content>
          <LogotypeBox>
            <Logotype showText />
          </LogotypeBox>
          <SearchInputContainer transparent={isGraphZoomedIn && !searchHasFocus}>
            <SearchInputBox>
              <Search disabled={!isApiReachable} variant={searchVariant} onFocusChange={onFocusChange} />
            </SearchInputBox>
            {showInfoScreenBtn && (
              <InfoScreenBtn aria-label={infoAriaLabel} onClick={onToggleInfoScreenClick}>
                <InfoOutlinedIcon fontSize="medium" sx={{ color: 'white' }} />
              </InfoScreenBtn>
            )}
          </SearchInputContainer>
          <ThemeByScope isRootTheme={false} network={network}>
            <Box sx={{ zIndex: zIndexHomePage.paraTimeSelector }}>
              <ParaTimeSelector
                step={step}
                setStep={setStep}
                disabled={searchHasFocus}
                showInfoScreen={showInfoScreen}
                graphZoomedIn={isGraphZoomedIn}
                onGraphZoomedIn={setIsGraphZoomedIn}
              />
            </Box>
          </ThemeByScope>
        </Content>

        <FooterStyled>
          <Footer enableMobileSearch={false} />
        </FooterStyled>
      </HomepageLayout>
    </>
  )
}
