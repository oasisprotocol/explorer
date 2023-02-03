import { GetLayerStatsTxVolumeParams } from '../../oasis-indexer/api'

export enum ChartDuration {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  ALL_TIME = 'ALL_TIME',
}

export const durationToQueryParams = {
  [ChartDuration.TODAY]: {
    bucket_size_seconds: 60 * 60,
    limit: 24,
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
