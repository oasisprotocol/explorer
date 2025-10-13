import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Ticker } from '../../../types/ticker'
import { RoundedBalance } from '../../components/RoundedBalance'
import { SnapshotTextCard } from '../../components/Snapshots/SnapshotCard'

type SnapshotStakedProps = {
  ticker: Ticker | undefined
  totalStaked: string | undefined
}

export const SnapshotStaked: FC<SnapshotStakedProps> = ({ totalStaked, ticker }) => {
  const { t } = useTranslation()

  return (
    <SnapshotTextCard title={t('common.staked')} alignWithCardsWithActions>
      {totalStaked && (
        <div className="break-all leading-none">
          <RoundedBalance value={totalStaked} ticker={ticker} compactLargeNumbers />
        </div>
      )}
    </SnapshotTextCard>
  )
}
