import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import { ConsensusCard, ConsensusFallbackCard } from './ConsensusCard'
import { SapphireCard, SapphireFallbackCard } from './SapphireCard'
import { EmeraldCard, EmeraldFallbackCard } from './EmeraldCard'
import { PontusXFallbackCard, PontusXCard } from './PontusXCard'

export const Ecosystem: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Typography variant="h3"> {t('home.ecosystem.title')}</Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
        <ErrorBoundary light fallbackContent={<SapphireFallbackCard />}>
          <SapphireCard />
        </ErrorBoundary>
        <ErrorBoundary light fallbackContent={<ConsensusFallbackCard />}>
          <ConsensusCard />
        </ErrorBoundary>
        <ErrorBoundary light fallbackContent={<PontusXFallbackCard />}>
          <PontusXCard />
        </ErrorBoundary>
        <ErrorBoundary light fallbackContent={<EmeraldFallbackCard />}>
          <EmeraldCard />
        </ErrorBoundary>
      </div>
    </div>
  )
}
