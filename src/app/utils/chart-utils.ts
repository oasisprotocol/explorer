import endOfHour from 'date-fns/endOfHour'
import endOfDay from 'date-fns/endOfDay'
import isSameMonth from 'date-fns/isSameMonth'
import endOfMonth from 'date-fns/endOfMonth'
import { GetLayerStatsTxVolumeParams, type TxVolume, type ActiveAccounts } from '../../oasis-nexus/api'

export enum ChartDuration {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  ALL_TIME = 'ALL_TIME',
}

export const dailyLimitWithoutBuffer = (60 / 5) * 24 // full day for 5 minutes buckets,

export const durationToQueryParams = {
  [ChartDuration.TODAY]: {
    window_size_seconds: 60 * 5,
    limit:
      dailyLimitWithoutBuffer +
      // daily data needs additional 2 buckets to make sure we have at least full 24 buckets
      (60 / 5) * 2,
  },
  [ChartDuration.WEEK]: {
    window_size_seconds: 24 * 60 * 60,
    limit: 7,
    offset: 1, // offset to skip the first day
  },
  [ChartDuration.MONTH]: {
    window_size_seconds: 24 * 60 * 60,
    limit: 30, // Defined as 30 days, should be more dynamic depending on the month
    offset: 1, // offset to skip the first day
  },
  [ChartDuration.ALL_TIME]: {
    window_size_seconds: 24 * 60 * 60,
    limit: 365, // Defined as a full year
    offset: 1, // offset to skip the first day
  },
} satisfies { [duration in ChartDuration]: GetLayerStatsTxVolumeParams }

export const chartDurationToDaysMap = {
  [ChartDuration.TODAY]: 1,
  [ChartDuration.WEEK]: 7,
  [ChartDuration.MONTH]: 30,
  [ChartDuration.ALL_TIME]: 365,
}

export const chartUseQueryStaleTimeMs = durationToQueryParams[ChartDuration.TODAY].window_size_seconds * 1000

type Buckets = TxVolume[] | undefined
type MonthlyTxVolume = TxVolume & { numberOfItemsInGroup: number }

const groupBucketsByMonth = (buckets: Buckets) => {
  /**
   * TODO: look into this change.
   * We are now grouping buckets / windows based on their end time, instead of the start.
   * Does the end result still make sense, semantically speaking?
   */
  return buckets?.reduce((acc: MonthlyTxVolume[], cur, index, arr) => {
    if (index > 0 && isSameMonth(new Date(cur.window_end), new Date(arr[index - 1].window_end))) {
      acc[acc.length - 1].tx_volume += cur.tx_volume
      acc[acc.length - 1].numberOfItemsInGroup += 1
      return acc
    }
    acc.push({
      window_end: cur.window_end,
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

export function cumulativeSum<T>(
  items: T[],
  accumulateField: { [F in keyof T]: T[F] extends number ? F : never }[keyof T],
): T[] {
  let acc = 0
  return items.map(item => {
    acc += item[accumulateField] as number
    return { ...item, [accumulateField]: acc }
  })
}

export const filterHourlyActiveAccounts = (
  windows: ActiveAccounts[] | undefined,
): ActiveAccounts[] | undefined => {
  return windows?.filter((value, index) => index % 12 === 0)
}

type NumberOnly<T> = {
  [key in keyof T as T[key] extends number | undefined ? key : never]: T[key]
}

type StringOnly<T> = {
  [key in keyof T as T[key] extends string | undefined ? key : never]: T[key]
}

export const sumBucketsByEndDuration = <
  T extends NumberOnly<any> & StringOnly<any>,
  N extends keyof NumberOnly<T>,
  S extends keyof StringOnly<T>,
>(
  buckets: T[] | undefined,
  sumKey: N,
  dateKey: S,
  startDurationFn: typeof endOfHour | typeof endOfDay | typeof endOfMonth,
) => {
  if (!buckets) {
    return []
  }

  const durationMap = buckets.reduce(
    (accMap, item) => {
      const key = startDurationFn(new Date(item[dateKey])).toISOString()

      return {
        ...accMap,
        [key]: (accMap[key] || 0) + item[sumKey],
      }
    },
    {} as { [key: string]: number },
  )

  // For daily charts we want to skip the first and last buckets.
  // They are not full and we want to avoid chart drop.
  const filteredDurationMap =
    startDurationFn === endOfHour ? Object.fromEntries(Object.entries(durationMap).slice(1, -1)) : durationMap

  return Object.keys(filteredDurationMap).map(key => ({
    [dateKey]: key,
    [sumKey]: filteredDurationMap[key],
  })) as T[]
}
