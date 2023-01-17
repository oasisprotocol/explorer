/**
 * Chart durations defined in minutes
 */
export enum ChartDuration {
  TODAY = 24 * 60,
  WEEK = 7 * 24 * 60,
  MONTH = 30 * 24 * 60, // Defined as 30 days, should be more dynamic depending on the month
  ALL_TIME = 365 * 24 * 60, // Defined as a full year
}

export abstract class ChartUtils {
  private static DEFAULT_INTERVAL_MINUTES = 5

  static getLimitByDuration = (
    duration: ChartDuration = ChartDuration.TODAY,
    intervalMinutes = ChartUtils.DEFAULT_INTERVAL_MINUTES,
  ) => {
    if (intervalMinutes <= 0) {
      throw new Error('Invalid parameter [intervalMinutes], should be a positive integer')
    }

    return duration / intervalMinutes
  }
}
