import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { EcosystemCard } from './EcosystemCard'
import sapphireBg from './images/sapphire-bg.svg'

export const SapphireCard: FC = () => {
  const { t } = useTranslation()
  const sapphireStatusQuery = useGetRuntimeStatus('mainnet', 'sapphire')
  const { outOfDate: sapphireOutOfDate } = useRuntimeFreshness({
    network: 'mainnet',
    layer: 'sapphire',
  })

  return (
    <EcosystemCard
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

export const SapphireFallbackCard: FC = () => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      description={t('home.ecosystem.sapphire')}
      title={t('common.sapphire')}
      background={sapphireBg}
      layer="sapphire"
    />
  )
}
