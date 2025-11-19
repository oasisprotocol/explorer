import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { useGetRuntimeStatus } from '../../../oasis-nexus/api'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { RouteUtils } from '../../utils/route-utils'
import { useRuntimeFreshness } from '../../components/OfflineBanner/hook'
import { pontusx } from '../../utils/externalLinks'
import { EcosystemCard } from './EcosystemCard'
import pontusxBg from './images/pontusx-bg.svg'

export const PontusXCard: FC = () => {
  const { t } = useTranslation()
  const pontusxStatusQuery = useGetRuntimeStatus('testnet', 'pontusxtest')
  const { outOfDate: pontusxOutOfDate } = useRuntimeFreshness({
    network: 'testnet',
    layer: 'pontusxtest',
  })

  return (
    <EcosystemCard
      network="testnet"
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
            <span>
              {t('home.ecosystem.by')}{' '}
              <Tooltip
                title={
                  <>
                    {t('home.ecosystem.deltaDAODescription')}{' '}
                    <Link
                      textColor="inherit"
                      variant="underline"
                      href={pontusx.homepage}
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                    >
                      {t('home.ecosystem.visitSite')}
                    </Link>
                  </>
                }
              >
                <span className="underline">{t('home.ecosystem.deltaDAO')}</span>
              </Tooltip>
            </span>
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
          <Button variant="link" size="lg" className="flex-1" asChild>
            <RouterLink to={RouteUtils.getDashboardRoute({ network: 'testnet', layer: 'pontusxdev' })}>
              {t('common.devnet')}
            </RouterLink>
          </Button>
          <Button size="lg" className="flex-1" asChild>
            <RouterLink to={RouteUtils.getDashboardRoute({ network: 'testnet', layer: 'pontusxtest' })}>
              {t('common.testnet')}
              <ArrowRight />
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
