export class TimerUtils {

  /** dateTime should be in milliseconds */
  public static lessThanOneHourAgo(oldDate: Date): boolean {
    if(oldDate) {
      return TimerUtils.isWithinHoursAgo(oldDate, 1);
    }
    console.error('<< TimerUtils >> lessThanOneHourAgo failed, dateTime null');
    return false;
  }

  /**
   * Validate time within seconds ago
   * @param oldDate will be converted into milliseconds
   * @param secondsAgo how long ago to check against, cannot be zero
   */
  public static isWithinSecondsAgo(oldDate: Date, secondsAgo: number): boolean {
    if(oldDate && secondsAgo) {
      // convert to milliseconds
      secondsAgo = secondsAgo * 1000;
      const timeAgo: number = Date.now() - secondsAgo;
      return oldDate.getTime() > timeAgo;
    }
    console.error('<< TimerUtils >> isWithinSecondsAgo failed, oldDate or secondsAgo null');
    return false;
  }

  /** validate time within minutes ago */
  public static isWithinMinutesAgo(oldDate: Date, minutesAgo: number): boolean {
    if(oldDate && minutesAgo) {
      return TimerUtils.isWithinSecondsAgo(oldDate, minutesAgo * 60);
    }
    console.error('<< TimerUtils >> isWithinMinutesAgo failed, oldDate or minutesAgo null');
    return false;
  }

  /** validates time within hours ago */
  public static isWithinHoursAgo(oldDate: Date, hoursAgo: number): boolean {
    if(oldDate && hoursAgo) {
      return TimerUtils.isWithinMinutesAgo(oldDate, hoursAgo * 60);
    }
    console.error('<< TimerUtils >> isWithinHoursAgo failed, oldDate or hoursAgo null');
    return false;
  }

}
