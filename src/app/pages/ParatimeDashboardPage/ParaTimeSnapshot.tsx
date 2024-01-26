import { FC, useState } from 'react'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import { DurationSelect } from '../../components/Snapshots/DurationSelect'
import { TransactionsChartCard } from './TransactionsChartCard'
import { RosePriceCard } from './RosePriceCard'
import { Nodes } from './Nodes'
import { ActiveAccounts } from './ActiveAccounts'
import { ChartDuration } from '../../utils/chart-utils'
import { useTranslation } from 'react-i18next'
import { useConstant } from '../../hooks/useConstant'
import { Network } from '../../../types/network'
import { getLayerNames } from '../../../types/layers'
import { TestnetFaucet } from './TestnetFaucet'
import { SearchScope } from '../../../types/searchScope'
import { Snapshot } from 'app/components/Snapshots/Snapshot'

const StyledGrid = styled(Grid)(() => ({
  display: 'flex',
}))

export const ParaTimeSnapshot: FC<{ scope: SearchScope }> = ({ scope }) => {
  const { t } = useTranslation()
  const defaultChartDurationValue = useConstant<ChartDuration>(() => ChartDuration.TODAY)
  const [chartDuration, setChartDuration] = useState<ChartDuration>(defaultChartDurationValue)
  const paratime = getLayerNames(t)[scope.layer]
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
          {scope.network === Network.mainnet && <RosePriceCard />}
          {scope.network === Network.testnet && <TestnetFaucet layer={scope.layer} />}
        </StyledGrid>
      </Snapshot>
    </>
  )
}
