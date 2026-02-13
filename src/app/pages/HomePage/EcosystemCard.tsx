import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Link as RouterLink } from 'react-router'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@oasisprotocol/ui-library/src/components/card'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/skeleton'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Network } from '../../../types/network'
import { RouteUtils } from '../../utils/route-utils'

type EcosystemCardProps = {
  activeNodes?: number
  background: string
  footer?: ReactNode
  isLoading?: boolean
  latestBlock?: number
  layer: 'consensus' | 'sapphire' | 'emerald' | 'pontusxtest'
  outOfDate?: boolean
  title: ReactNode
  description: ReactNode
  legacy?: boolean
  network?: Network
}

export const EcosystemCard: FC<EcosystemCardProps> = ({
  activeNodes,
  background,
  footer,
  isLoading,
  latestBlock,
  layer,
  outOfDate,
  title,
  description,
  legacy,
  network = 'mainnet',
}) => {
  const { t } = useTranslation()

  return (
    <Card
      className="bg-right-bottom bg-no-repeat"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <CardHeader>
        <CardTitle className="mb-2 text-lg items-center gap-2">
          <div className="flex items-center gap-2">
            <RouterLink className="text-lg" to={RouteUtils.getDashboardRoute({ network, layer })}>
              {title}
            </RouterLink>
            {legacy && (
              <Tooltip title={t('home.ecosystem.legacyTooltip')}>
                <div className="-mt-1">
                  <Badge variant="outline" className="rounded-[4px]">
                    {t('common.legacy')}
                  </Badge>
                </div>
              </Tooltip>
            )}
          </div>

          {!outOfDate && !isLoading && (
            <Tooltip title={t('common.online')}>
              <div className="w-[10px] h-[10px] rounded-full bg-success" />
            </Tooltip>
          )}
          {outOfDate && !isLoading && (
            <Tooltip title={t('common.outdated')}>
              <div className="w-[10px] h-[10px] rounded-full bg-destructive" />
            </Tooltip>
          )}
        </CardTitle>
        <Typography textColor="muted" variant="p" className="text-pretty">
          {description}
        </Typography>
      </CardHeader>
      <CardContent className="flex-1 flex items-end">
        {isLoading && <Skeleton className="h-14 w-full" />}
        {!isLoading && (
          <div className="w-full grid grid-cols-2 gap-4 font-medium">
            <div>{t('home.blockNumber')}</div>
            <div className="text-right text-primary">
              {latestBlock !== undefined && latestBlock !== null ? (
                <>
                  <Link asChild className="font-medium">
                    <RouterLink to={RouteUtils.getBlockRoute({ network, layer }, latestBlock)}>
                      {latestBlock.toLocaleString()}
                    </RouterLink>
                  </Link>
                </>
              ) : (
                '-'
              )}
            </div>
            <div>{t('home.activeNodes')}</div>
            <div className="text-right text-primary">
              {activeNodes !== undefined && activeNodes !== null ? (
                <>
                  {layer === 'consensus' ? (
                    <Link asChild className="font-medium">
                      <RouterLink to={RouteUtils.getValidatorsRoute(network)}>
                        {activeNodes.toLocaleString()}
                      </RouterLink>
                    </Link>
                  ) : (
                    // Link to runtime nodes when available
                    activeNodes.toLocaleString()
                  )}
                </>
              ) : (
                '-'
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {footer || (
          <div className="flex w-full lg:flex-col xl:flex-row gap-4">
            <Button variant="outline" size="lg" className="flex-1 py-[10px]" asChild>
              <RouterLink
                to={RouteUtils.getDashboardRoute({ network: 'testnet', layer })}
                className="text-primary"
              >
                {t('common.testnet')}
              </RouterLink>
            </Button>
            <Button size="lg" className="flex-1 py-[10px]" asChild>
              <RouterLink to={RouteUtils.getDashboardRoute({ network: 'mainnet', layer })}>
                {t('common.mainnet')}
                <ArrowRight />
              </RouterLink>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
