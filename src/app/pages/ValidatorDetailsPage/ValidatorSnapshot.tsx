import { FC } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { ExternalLinkCard } from './ExternalLinkCard'
import { SearchScope } from '../../../types/searchScope'
import { UptimeCard } from './UptimeCard'
import { VotingPowerCard } from './VotingPowerCard'
import { EscrowDistributionCard } from './EscrowDistributionCard'
import { Validator, ValidatorAggStats } from '../../../oasis-nexus/api'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type ValidatorSnapshotProps = {
  scope: SearchScope
  validator: Validator | undefined
  stats: ValidatorAggStats | undefined
}

export const ValidatorSnapshot: FC<ValidatorSnapshotProps> = ({ scope, validator, stats }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <div className={cn('flex mb-2', isMobile ? 'flex-col' : 'flex-row')}>
          <AppendMobileSearch scope={scope}>
            <div className={isMobile ? 'flex flex-col mb-2' : 'flex flex-row mb-2'}>
              <Typography variant="h3">{t('validator.snapshot')}</Typography>
            </div>
          </AppendMobileSearch>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 w-full pb-8">
        <div className="col-span-12 lg:col-span-3">
          <EscrowDistributionCard validator={validator} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <VotingPowerCard validator={validator} stats={stats} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <UptimeCard uptime={validator?.uptime} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ExternalLinkCard link={validator?.media?.url} />
        </div>
      </div>
    </>
  )
}
