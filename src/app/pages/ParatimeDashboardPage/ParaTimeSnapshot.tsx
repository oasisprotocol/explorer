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
import { SearchScope } from '../../../types/searchScope'
import { Snapshot, StyledGrid } from 'app/components/Snapshots/Snapshot'
import { getFaucetLink } from '../../utils/faucet-links'

export const ParaTimeSnapshot: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const defaultChartDurationValue = useConstant<ChartDuration>(() => ChartDuration.TODAY)
  const [chartDuration, setChartDuration] = useState<ChartDuration>(defaultChartDurationValue)
  const paratime = getLayerLabels(t)[scope.layer]
  const tokens = getTokensForScope(scope)
  const mainToken = tokens[0]
  const mainTicker = mainToken.ticker
  const faucetLink = getFaucetLink(scope.network, scope.layer, mainTicker)
  const handleDurationSelectedChange = (duration: ChartDuration | null) => {
    if (!duration) {
      return
    }

    setChartDuration(duration)
  }

  return (
    <>
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
        <StyledGrid item xs={22} md={6}>
          <TransactionsChartCard scope={scope} chartDuration={chartDuration} />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <ActiveAccounts scope={scope} chartDuration={chartDuration} />
        </StyledGrid>
        <StyledGrid item xs={22} md={6}>
          <Nodes scope={scope} />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          {showFiatValues && !mainToken.free && <TokenPriceCard token={mainToken} />}
          {faucetLink && <TestnetFaucet network={scope.network} layer={scope.layer} ticker={mainTicker} />}
        </StyledGrid>
      </Snapshot>
    </>
  )
}
