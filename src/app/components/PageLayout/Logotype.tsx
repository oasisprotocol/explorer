import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Link as RouterLink } from 'react-router-dom'
import { OasisIcon } from '../CustomIcons/OasisIcon'
import { ExplorerIcon } from '../CustomIcons/ExplorerIcon'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

interface LogotypeProps {
  color?: string
  showText: boolean
}

export const HomePageLink: FC<LogotypeProps> = ({ color, showText }) => {
  const { t } = useTranslation()

  return (
    <Link asChild aria-label={t('home.link')}>
      <RouterLink to="/">
        <Logotype color={color} showText={showText} />
      </RouterLink>
    </Link>
  )
}

export const Logotype: FC<LogotypeProps> = ({ color, showText }) => {
  const { isMobile } = useScreenSize()
  const oasisLogoSize = isMobile ? 32 : 40
  const logoSize = !showText ? { height: oasisLogoSize, width: oasisLogoSize } : { height: 40, width: 214 }

  return (
    <div className={cn('flex items-center', !color && 'text-primary')} style={color ? { color } : undefined}>
      {!showText ? <OasisIcon sx={logoSize} /> : <ExplorerIcon sx={logoSize} />}
    </div>
  )
}
