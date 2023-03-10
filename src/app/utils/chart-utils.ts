import isSameMonth from 'date-fns/isSameMonth'
import { GetLayerStatsTxVolumeParams, type TxVolume, type ActiveAccounts } from '../../oasis-indexer/api'

export enum ChartDuration {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  ALL_TIME = 'ALL_TIME',
}

export const durationToQueryParams = {
  [ChartDuration.TODAY]: {
    bucket_size_seconds: 60 * 5,
    limit: (60 / 5) * 24, // full day for 5 minutes buckets
  },
  [ChartDuration.WEEK]: {
    bucket_size_seconds: 24 * 60 * 60,
    limit: 7,
  },
  [ChartDuration.MONTH]: {
    bucket_size_seconds: 24 * 60 * 60,
    limit: 30, // Defined as 30 days, should be more dynamic depending on the month
  },
  [ChartDuration.ALL_TIME]: {
    bucket_size_seconds: 24 * 60 * 60,
    limit: 365, // Defined as a full year
  },
} satisfies { [duration in ChartDuration]: GetLayerStatsTxVolumeParams }

export const chartDurationToDaysMap = {
  [ChartDuration.TODAY]: 1,
  [ChartDuration.WEEK]: 7,
  [ChartDuration.MONTH]: 30,
  [ChartDuration.ALL_TIME]: 365,
}

export const chartUseQueryStaleTimeMs = durationToQueryParams[ChartDuration.TODAY].bucket_size_seconds * 1000

type Buckets = TxVolume[] | undefined
type MonthlyTxVolume = TxVolume & { numberOfItemsInGroup: number }

const groupBucketsByMonth = (buckets: Buckets) => {
  return buckets?.reduce((acc: MonthlyTxVolume[], cur, index, arr) => {
    if (index > 0 && isSameMonth(new Date(cur.bucket_start), new Date(arr[index - 1].bucket_start))) {
      acc[acc.length - 1].tx_volume += cur.tx_volume
      acc[acc.length - 1].numberOfItemsInGroup += 1
      return acc
    }
    acc.push({
      bucket_start: cur.bucket_start,
      tx_volume: cur.tx_volume,
      numberOfItemsInGroup: 1,
    })
    return acc
  }, [])
}

export const getMonthlyBucketsDailyAverage = (buckets: Buckets): Buckets => {
  const monthlyBuckets = groupBucketsByMonth(buckets)

  return monthlyBuckets?.map(item => ({
    ...item,
    tx_volume: Math.round((item.tx_volume / item.numberOfItemsInGroup) * 100) / 100,
  }))
}

export const filterHourlyActiveAccounts = (
  windows: ActiveAccounts[] | undefined,
): ActiveAccounts[] | undefined => {
  return windows?.filter((value, index) => index % 12 === 0)
}
