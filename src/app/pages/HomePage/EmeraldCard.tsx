import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { EcosystemCard } from './EcosystemCard'
import emeraldBg from './images/emerald-bg.svg'

export const EmeraldCard: FC = () => {
  const { t } = useTranslation()
  const emeraldStatusQuery = useGetRuntimeStatus('mainnet', 'emerald')
  const { outOfDate: emeraldOutOfDate } = useRuntimeFreshness({
    network: 'mainnet',
    layer: 'emerald',
  })

  return (
    <EcosystemCard
      isLoading={emeraldStatusQuery.isLoading}
      description={t('home.ecosystem.emerald')}
      title={t('common.emerald')}
      background={emeraldBg}
      layer="emerald"
      outOfDate={emeraldOutOfDate}
      legacy
      latestBlock={emeraldStatusQuery?.data?.data?.latest_block}
      activeNodes={emeraldStatusQuery?.data?.data?.active_nodes}
    />
  )
}

export const EmeraldFallbackCard: FC = () => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      description={t('home.ecosystem.emerald')}
      title={t('common.emerald')}
      background={emeraldBg}
      layer="emerald"
      legacy
    />
  )
}
