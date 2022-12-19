
export abstract class DateTimeUtils {
  private static FORMATTER = new Intl.DateTimeFormat();

  static format = (date?: Date | number): string => {
    return DateTimeUtils.FORMATTER.format();
  }
}
