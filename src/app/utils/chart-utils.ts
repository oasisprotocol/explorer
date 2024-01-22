import { startOfHour } from 'date-fns/startOfHour'
import { startOfDay } from 'date-fns/startOfDay'
import { isSameMonth } from 'date-fns/isSameMonth'
import { startOfMonth } from 'date-fns/startOfMonth'
import { GetLayerStatsTxVolumeParams, type TxVolume, type ActiveAccounts } from '../../oasis-nexus/api'

const fiveMinutesWindowSize = 60 * 5
const oneDayWindowSize = 24 * 60 * 60

export enum ChartDuration {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export const dailyLimitWithoutBuffer = (60 / 5) * 24 // full day for 5 minutes windows

/*
  window_size_seconds refers to the number of data points in one chunk
  window_step_seconds is how much you move forward to create next chunk
  both defaults to 86400 (1 day) if not specified
  Example table of query params https://github.com/oasisprotocol/nexus/pull/477
*/
export const durationToQueryParams = {
  [ChartDuration.TODAY]: {
    window_size_seconds: fiveMinutesWindowSize,
    window_step_seconds: fiveMinutesWindowSize,
    limit:
      dailyLimitWithoutBuffer +
      // daily data needs additional 2 windows to make sure we have at least full 24 windows
      (60 / 5) * 2,
  },
  [ChartDuration.WEEK]: {
    window_size_seconds: oneDayWindowSize,
    window_step_seconds: oneDayWindowSize,
    limit: 7,
    offset: 1, // offset to skip the first day
  },
  [ChartDuration.MONTH]: {
    window_size_seconds: oneDayWindowSize,
    window_step_seconds: oneDayWindowSize,
    limit: 30, // Defined as 30 days, should be more dynamic depending on the month
    offset: 1, // offset to skip the first day
  },
  [ChartDuration.YEAR]: {
    window_size_seconds: oneDayWindowSize,
    window_step_seconds: oneDayWindowSize,
    limit: 365, // Defined as a full year
    offset: 1, // offset to skip the first day
  },
} satisfies { [duration in ChartDuration]: GetLayerStatsTxVolumeParams }

export const chartDurationToDaysMap = {
  [ChartDuration.TODAY]: 1,
  [ChartDuration.WEEK]: 7,
  [ChartDuration.MONTH]: 30,
  [ChartDuration.YEAR]: 365,
}

export const chartUseQueryStaleTimeMs = durationToQueryParams[ChartDuration.TODAY].window_size_seconds * 1000

type Windows = TxVolume[] | undefined
type MonthlyTxVolume = TxVolume & { numberOfItemsInGroup: number }

const groupWindowsByMonth = (windows: Windows) => {
  return windows?.reduce((acc: MonthlyTxVolume[], cur, index, arr) => {
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

export const getMonthlyWindowsDailyAverage = (windows: Windows): Windows => {
  const monthlyWindows = groupWindowsByMonth(windows)

  return monthlyWindows?.map(item => ({
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

export const sumWindowsByStartDuration = <
  T extends NumberOnly<any> & StringOnly<any>,
  N extends keyof NumberOnly<T>,
  S extends keyof StringOnly<T>,
>(
  windows: T[] | undefined,
  sumKey: N,
  dateKey: S,
  startDurationFn: typeof startOfHour | typeof startOfDay | typeof startOfMonth,
) => {
  if (!windows) {
    return []
  }

  const durationMap = windows.reduce(
    (accMap, item) => {
      const key = startDurationFn(new Date(item[dateKey])).toISOString()

      return {
        ...accMap,
        [key]: (accMap[key] || 0) + item[sumKey],
      }
    },
    {} as { [key: string]: number },
  )

  // For daily charts we want to skip the first and last windows.
  // They are not full and we want to avoid chart drop.
  const filteredDurationMap =
    startDurationFn === startOfHour
      ? Object.fromEntries(Object.entries(durationMap).slice(1, -1))
      : durationMap

  return Object.keys(filteredDurationMap).map(key => ({
    [dateKey]: key,
    [sumKey]: filteredDurationMap[key],
  })) as T[]
}
