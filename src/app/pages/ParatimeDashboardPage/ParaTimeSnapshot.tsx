import { FC, useState } from 'react'
import { DurationSelect } from '../../components/Snapshots/DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { TokenPriceCard } from './TokenPriceCard'
import { Nodes } from './Nodes'
import { ActiveAccounts } from './ActiveAccounts'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'
import { useConstant } from '../../hooks/useConstant'
import { getTokensForScope, showFiatValues } from '../../../config'
import { getLayerLabels } from '../../utils/content'
import { TestnetFaucet } from './TestnetFaucet'
import { RuntimeScope } from '../../../types/searchScope'
import { Snapshot } from 'app/components/Snapshots/Snapshot'
import { getFaucetInfo } from '../../utils/faucet-links'
import { ErrorBoundary } from '../../components/ErrorBoundary'

export const ParaTimeSnapshot: FC<{ scope: RuntimeScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const defaultChartDurationValue = useConstant<ChartDuration>(() => ChartDuration.TODAY)
  const [chartDuration, setChartDuration] = useState<ChartDuration>(defaultChartDurationValue)
  const paratime = getLayerLabels(t)[scope.layer]
  const tokens = getTokensForScope(scope)
  const mainToken = tokens[0]
  const mainTicker = mainToken.ticker
  const faucetInfo = getFaucetInfo(t, scope.network, scope.layer, mainTicker)
  const handleDurationSelectedChange = (duration: ChartDuration | null) => {
    if (!duration) {
      return
    }

    setChartDuration(duration)
  }

  return (
    <ErrorBoundary>
      <Snapshot
        header={
          <DurationSelect
            defaultValue={defaultChartDurationValue}
            handleChange={handleDurationSelectedChange}
          />
        }
        title={t('paraTimeSnapshot.header', { paratime })}
        scope={scope}
      >
        <div className="col-span-12 lg:col-span-3">
          <TransactionsChartCard scope={scope} chartDuration={chartDuration} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ActiveAccounts scope={scope} chartDuration={chartDuration} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <Nodes scope={scope} />
        </div>
        <div className="col-span-12 lg:col-span-3">
          {showFiatValues && !mainToken.free && <TokenPriceCard token={mainToken} />}
          {faucetInfo && <TestnetFaucet network={scope.network} layer={scope.layer} ticker={mainTicker} />}
        </div>
      </Snapshot>
    </ErrorBoundary>
  )
}
