import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { isLocalnetEnabled, RouteUtils } from '../../utils/route-utils'
import { Runtime } from '../../../oasis-nexus/api'
import { ConsensusCard, ConsensusFallbackCard } from './ConsensusCard'
import { SapphireCard, SapphireFallbackCard } from './SapphireCard'
import { EmeraldCard, EmeraldFallbackCard } from './EmeraldCard'
import { PontusXFallbackCard, PontusXCard } from './PontusXCard'

export const Ecosystem: FC = () => {
  const { t } = useTranslation()
  const localnetEnabled = isLocalnetEnabled()
  const network = localnetEnabled ? 'localnet' : 'mainnet'
  const localnetLayers = RouteUtils.getAllLayersForNetwork('localnet').enabled
  const isRuntimeShown = (runtime: Runtime) => !localnetEnabled || localnetLayers.includes(runtime)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Typography variant="h3"> {t('home.ecosystem.title')}</Typography>

      <div
        className={cn(
          'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6',
          !localnetEnabled && 'lg:grid-cols-4',
        )}
      >
        {isRuntimeShown('sapphire') && (
          <ErrorBoundary light fallbackContent={<SapphireFallbackCard network={network} />}>
            <SapphireCard network={network} />
          </ErrorBoundary>
        )}
        <ErrorBoundary light fallbackContent={<ConsensusFallbackCard network={network} />}>
          <ConsensusCard network={network} />
        </ErrorBoundary>
        {!localnetEnabled && (
          <ErrorBoundary light fallbackContent={<PontusXFallbackCard />}>
            <PontusXCard />
          </ErrorBoundary>
        )}
        {isRuntimeShown('emerald') && (
          <ErrorBoundary light fallbackContent={<EmeraldFallbackCard network={network} />}>
            <EmeraldCard network={network} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}
