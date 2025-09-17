import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { Link as RouterLink } from 'react-router-dom'
import { OasisIcon } from '../CustomIcons/OasisIcon'
import { ExplorerIcon } from '../CustomIcons/ExplorerIcon'

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
  const logoSize = !showText ? { height: oasisLogoSize, width: oasisLogoSize } : { height: 40, width: 214 }

  return (
    <div className="flex items-center text-primary">
      {!showText ? <OasisIcon sx={logoSize} /> : <ExplorerIcon sx={logoSize} />}
    </div>
  )
}
