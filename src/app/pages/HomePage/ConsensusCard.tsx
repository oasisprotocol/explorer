import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useConsensusFreshness } from 'app/components/OfflineBanner/hook'
import { useGetConsensusValidators, useGetStatus } from 'oasis-nexus/api'
import { EcosystemCard } from './EcosystemCard'
import consensusBg from './images/consensus-bg.svg'

export const ConsensusCard: FC = () => {
  const { t } = useTranslation()
  const consensusStatusQuery = useGetStatus('mainnet')
  const { outOfDate: consensusOutOfDate } = useConsensusFreshness('mainnet')
  const validatorsQuery = useGetConsensusValidators('mainnet', { limit: 1000 })
  const activeValidatorsCount = validatorsQuery.data?.data.validators.filter(v => v.in_validator_set).length

  return (
    <EcosystemCard
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

export const ConsensusFallbackCard: FC = () => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      description={t('home.ecosystem.consensus')}
      title={t('common.consensus')}
      background={consensusBg}
      layer="consensus"
    />
  )
}
