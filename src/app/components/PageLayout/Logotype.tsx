import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { Link as RouterLink } from 'react-router-dom'
import { PontusxIcon } from '../CustomIcons/PontusxIcon'
import pontusxIcon from '../CustomIcons/pontusx_horizontal_white.svg'

interface LogotypeProps {
  showText: boolean
}

export const HomePageLink: FC<LogotypeProps> = ({ showText }) => {
  const { t } = useTranslation()

  return (
    <RouterLink to="/" aria-label={t('home.link')}>
      <Logotype showText={showText} />
    </RouterLink>
  )
}

export const Logotype: FC<LogotypeProps> = ({ showText }) => {
  const { isMobile } = useScreenSize()
  const oasisLogoSize = isMobile ? 32 : 40

  const logoSize = !showText ? { height: oasisLogoSize, width: oasisLogoSize } : { height: 58, width: 228 }
  return (
    <div className="flex items-center text-primary">
      {!showText ? (
        <PontusxIcon sx={logoSize} />
      ) : (
        <img src={pontusxIcon} width={logoSize.width} alt="Pontus-X Logo" />
      )}
    </div>
  )
}
