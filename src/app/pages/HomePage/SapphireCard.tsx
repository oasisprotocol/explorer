import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { Network } from '../../../types/network'
import { EcosystemCard } from './EcosystemCard'
import sapphireBg from './images/sapphire-bg.svg'

export const SapphireCard: FC<{ network: Network }> = ({ network }) => {
  const { t } = useTranslation()
  const sapphireStatusQuery = useGetRuntimeStatus(network, 'sapphire')
  const { outOfDate: sapphireOutOfDate } = useRuntimeFreshness({
    network,
    layer: 'sapphire',
  })

  return (
    <EcosystemCard
      network={network}
      isLoading={sapphireStatusQuery.isLoading}
      description={t('home.ecosystem.sapphire')}
      title={t('common.sapphire')}
      background={sapphireBg}
      layer="sapphire"
      outOfDate={sapphireOutOfDate}
      latestBlock={sapphireStatusQuery?.data?.data?.latest_block}
      activeNodes={sapphireStatusQuery?.data?.data?.active_nodes}
    />
  )
}

export const SapphireFallbackCard: FC<{ network: Network }> = ({ network }) => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      network={network}
      description={t('home.ecosystem.sapphire')}
      title={t('common.sapphire')}
      background={sapphireBg}
      layer="sapphire"
    />
  )
}
