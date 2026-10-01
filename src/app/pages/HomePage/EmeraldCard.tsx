import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { Network } from '../../../types/network'
import { EcosystemCard } from './EcosystemCard'
import emeraldBg from './images/emerald-bg.svg'

export const EmeraldCard: FC<{ network: Network }> = ({ network }) => {
  const { t } = useTranslation()
  const emeraldStatusQuery = useGetRuntimeStatus(network, 'emerald')
  const { outOfDate: emeraldOutOfDate } = useRuntimeFreshness({
    network,
    layer: 'emerald',
  })

  return (
    <EcosystemCard
      network={network}
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

export const EmeraldFallbackCard: FC<{ network: Network }> = ({ network }) => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      network={network}
      description={t('home.ecosystem.emerald')}
      title={t('common.emerald')}
      background={emeraldBg}
      layer="emerald"
      legacy
    />
  )
}
