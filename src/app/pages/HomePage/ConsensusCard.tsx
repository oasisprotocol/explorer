import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useConsensusFreshness } from 'app/components/OfflineBanner/hook'
import { useGetConsensusValidators, useGetStatus } from 'oasis-nexus/api'
import { Network } from 'types/network'
import { EcosystemCard } from './EcosystemCard'
import consensusBg from './images/consensus-bg.svg'

export const ConsensusCard: FC<{ network: Network }> = ({ network }) => {
  const { t } = useTranslation()
  const consensusStatusQuery = useGetStatus(network)
  const { outOfDate: consensusOutOfDate } = useConsensusFreshness(network)
  const validatorsQuery = useGetConsensusValidators(network, { limit: 1000 })
  const activeValidatorsCount = validatorsQuery.data?.data.validators.filter(v => v.in_validator_set).length

  return (
    <EcosystemCard
      network={network}
      isLoading={consensusStatusQuery.isLoading || validatorsQuery.isLoading}
      description={t('home.ecosystem.consensus')}
      title={t('common.consensus')}
      background={consensusBg}
      layer="consensus"
      outOfDate={consensusOutOfDate}
      latestBlock={consensusStatusQuery?.data?.data?.latest_block}
      activeNodes={activeValidatorsCount}
    />
  )
}

export const ConsensusFallbackCard: FC<{ network: Network }> = ({ network }) => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      network={network}
      description={t('home.ecosystem.consensus')}
      title={t('common.consensus')}
      background={consensusBg}
      layer="consensus"
    />
  )
}
