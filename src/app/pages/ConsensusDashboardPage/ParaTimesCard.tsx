import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { Layer, Runtime } from '../../../oasis-nexus/api'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { isNotInHiddenScope, RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { EnabledRuntimePreview } from './RuntimePreview'
import { Network } from '../../../types/network'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

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
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
          <div className="flex-1 min-w-0 lg:w-1/2">
            <EnabledRuntimePreview prominentItem network={scope.network} runtime={firstEnabledRuntime} />
          </div>

          <div className="flex gap-4 flex-1 min-w-0 lg:w-1/2">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-5 w-full">
              {restEnabledRuntimes.map(runtime => (
                <EnabledRuntimePreview
                  key={runtime}
                  network={scope.network}
                  runtime={runtime}
                  lastNoBorder
                  showBothCharts={restEnabledRuntimes.length === 1}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
