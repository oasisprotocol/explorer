import { FC } from 'react'
import { Logotype } from '../../components/PageLayout/Logotype'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import background from './images/background.svg'
import { COLORS } from '../../../styles/theme/colors'
import { Search } from '../../components/Search'
import { ParatimeSelector } from './ParatimeSelector'

const HomepageLayout = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
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

export const HomePage: FC = () => {
  const { t } = useTranslation()

  const onSearchSubmit = (searchTerm: string) => {}

  return (
    <HomepageLayout>
      <Logotype>
        <Typography variant="h1" color={COLORS.white}>
          {t('home.header')}
        </Typography>
      </Logotype>
      <Search onSearchSubmit={onSearchSubmit} />
      <ParatimeSelector />
    </HomepageLayout>
  )
}
