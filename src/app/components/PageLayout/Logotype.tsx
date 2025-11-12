import { FC } from 'react'
import { useTranslation } from 'react-i18next'
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
  return <div className="flex items-center text-primary">{showText ? <ExplorerIcon /> : <OasisIcon />}</div>
}
