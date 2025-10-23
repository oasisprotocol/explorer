import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { Layer, Runtime } from '../../../oasis-nexus/api'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { isNotInHiddenScope, RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { EnabledRuntimePreview, DisabledRuntimePreview } from './RuntimePreview'
import { Network } from '../../../types/network'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

function shouldIncludeLayer(network: Network, layer: Layer) {
  return layer !== 'consensus' && isNotInHiddenScope({ network, layer })
}

type ParaTimesCardProps = { scope: SearchScope }

export const ParaTimesCard: FC<ParaTimesCardProps> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope
  const { enabled, disabled } = RouteUtils.getAllLayersForNetwork(network)
  const enabledRuntimes = enabled.filter(layer => shouldIncludeLayer(network, layer)) as Runtime[]
  const disabledRuntimes = disabled.filter(layer => shouldIncludeLayer(network, layer)) as Runtime[]
  const runtimesNumber = enabledRuntimes.length + disabledRuntimes.length
  const [firstEnabledRuntime, ...restEnabledRuntimes] = enabledRuntimes
  const spaceForSecondaryParaTimes = enabledRuntimes.length > 2

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3" className="mb-4">
            <CardHeaderWithCounter
              label={t('paratimes.listTitle')}
              totalCount={runtimesNumber}
              isTotalCountClipped={false}
            />
          </Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4">
          <div className={cn('col-span-12', spaceForSecondaryParaTimes ? 'lg:col-span-5' : 'lg:col-span-6')}>
            <EnabledRuntimePreview prominentItem network={scope.network} runtime={firstEnabledRuntime} />
          </div>

          <div
            className={cn(
              'grid col-span-12 grid-cols-12 gap-x-4',
              spaceForSecondaryParaTimes ? 'lg:col-span-7' : 'lg:col-span-6',
            )}
          >
            <div
              className={cn('col-span-12', spaceForSecondaryParaTimes ? 'lg:col-span-9' : 'lg:col-span-6')}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
                {restEnabledRuntimes.map(runtime => (
                  <EnabledRuntimePreview key={runtime} network={scope.network} runtime={runtime} />
                ))}
              </div>
            </div>

            <div
              className={cn('col-span-12', spaceForSecondaryParaTimes ? 'lg:col-span-3' : 'lg:col-span-6')}
            >
              {disabledRuntimes.map(runtime => (
                <DisabledRuntimePreview key={runtime} runtime={runtime} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
