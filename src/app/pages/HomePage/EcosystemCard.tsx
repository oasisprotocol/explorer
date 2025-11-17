import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@oasisprotocol/ui-library/src/components/cards'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
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
          {title}

          {legacy && (
            <Badge variant="warning" className="h-5">
              {t('common.legacy')}
            </Badge>
          )}

          {!outOfDate && !legacy && !isLoading && (
            <Badge variant="success" className="h-5">
              {t('common.online')}
            </Badge>
          )}
          {outOfDate && !legacy && !isLoading && (
            <Badge variant="error" className="h-5">
              {t('common.outdated')}
            </Badge>
          )}
        </CardTitle>
        <Typography textColor="muted" variant="p" className="text-pretty">
          {description}
        </Typography>
      </CardHeader>
      <CardContent className="flex-1 flex items-end">
        {isLoading && <Skeleton className="h-14 w-full" />}
        {!isLoading && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 font-medium">
            <div>{t('home.blockNumber')}</div>
            <div className="text-right text-primary">
              {latestBlock !== undefined && latestBlock !== null ? latestBlock.toLocaleString() : '-'}
            </div>
            <div>{t('home.activeNodes')}</div>
            <div className="text-right text-primary">
              {activeNodes !== undefined && activeNodes !== null ? activeNodes.toLocaleString() : '-'}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {footer || (
          <>
            <Button variant="link" size="lg" className="flex-1">
              <Link to={RouteUtils.getDashboardRoute({ network: 'testnet', layer })}>
                {t('common.testnet')}
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="flex-1">
              <Link to={RouteUtils.getDashboardRoute({ network: 'mainnet', layer })}>
                {t('common.mainnet')}
              </Link>
              <ArrowRight />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
