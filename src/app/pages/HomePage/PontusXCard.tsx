import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetRuntimeStatus } from 'oasis-nexus/api'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { pontusx } from '../../utils/externalLinks'
import { EcosystemCard } from './EcosystemCard'
import pontusxBg from './images/pontusx-bg.svg'
import { ArrowRight } from 'lucide-react'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { RouteUtils } from 'app/utils/route-utils'

export const PontusXCard: FC = () => {
  const { t } = useTranslation()
  const pontusxStatusQuery = useGetRuntimeStatus('testnet', 'pontusxtest')
  const { outOfDate: pontusxOutOfDate } = useRuntimeFreshness({
    network: 'testnet',
    layer: 'pontusxtest',
  })

  return (
    <EcosystemCard
      isLoading={pontusxStatusQuery.isLoading}
      description={
        <>
          {t('home.ecosystem.pontusx')} <span className="italic">{t('home.ecosystem.comingSoon')}</span>
        </>
      }
      title={
        <span>
          {t('common.pontusx')}{' '}
          <span className="text-sm text-muted-foreground font-normal">
            by
            <Tooltip
              title={
                <>
                  DeltaDAO forms the foundation for the AI & Data economy of tomorrow.{' '}
                  <Link
                    textColor="inherit"
                    variant="underline"
                    href={pontusx.homepage}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Visit their site for more info
                  </Link>
                </>
              }
            >
              <span className="italic underline">deltaDAO</span>
            </Tooltip>
          </span>
        </span>
      }
      background={pontusxBg}
      layer="pontusxtest"
      outOfDate={pontusxOutOfDate}
      latestBlock={pontusxStatusQuery?.data?.data?.latest_block}
      activeNodes={pontusxStatusQuery?.data?.data?.active_nodes}
      footer={
        <>
          <Button variant="secondary" size="lg" className="flex-1">
            <RouterLink to={RouteUtils.getDashboardRoute({ network: 'testnet', layer: 'pontusxtest' })}>
              {t('common.testnet')}
            </RouterLink>
            <ArrowRight />
          </Button>
          <Button variant="link" size="lg" className="flex-1">
            <RouterLink to={RouteUtils.getDashboardRoute({ network: 'testnet', layer: 'pontusxdev' })}>
              {t('common.devnet')}
            </RouterLink>
          </Button>
        </>
      }
    />
  )
}

export const PontusXFallbackCard: FC = () => {
  const { t } = useTranslation()

  return (
    <EcosystemCard
      description={t('home.ecosystem.pontusx')}
      title={t('common.pontusx')}
      background={pontusxBg}
      layer="pontusxtest"
    />
  )
}
