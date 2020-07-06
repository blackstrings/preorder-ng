import {TimerUtils} from "./timer-utils";

describe('TimerUtils', () => {

  beforeEach(() => {

  });

  describe('lessThanOneHourAgo()', () => {
    it('should return true if time is 1 minute ago', () => {
      const oldDate: Date = new Date();
      oldDate.setMinutes(oldDate.getMinutes() - 1);
      const result = TimerUtils.lessThanOneHourAgo(oldDate);
      expect(result).toBeTruthy();
    });
    it('should return true if time is 30 minutes ago', () => {
      const oldDate: Date = new Date();
      oldDate.setMinutes(oldDate.getMinutes() - 30);
      const result = TimerUtils.lessThanOneHourAgo(oldDate);
      expect(result).toBeTruthy();
    });
    it('should return true if time is 59 minutes ago', () => {
      const oldDate: Date = new Date();
      oldDate.setMinutes(oldDate.getMinutes() - 59);
      const result = TimerUtils.lessThanOneHourAgo(oldDate);
      expect(result).toBeTruthy();
    });
    it('should return false if time is exactly 1 hour ago', () => {
      const oldDate: Date = new Date();
      oldDate.setMinutes(oldDate.getMinutes() - 60);
      const result = TimerUtils.lessThanOneHourAgo(oldDate);
      expect(result).toBeFalsy();
    });
    it('should return false if time is more than 1 hour ago', () => {
      const oldDate: Date = new Date();
      oldDate.setMinutes(oldDate.getMinutes() - 120); // 2 hours
      const result = TimerUtils.lessThanOneHourAgo(oldDate);
      expect(result).toBeFalsy();
    });
  });

  describe('isWithinSecondsAgo()', () => {

    it('should return false when date is null', () => {
      expect(TimerUtils.isWithinSecondsAgo(null, 1000)).toBeFalsy();
    });
    it('should return false when milliseconds is null', () => {
      expect(TimerUtils.isWithinSecondsAgo(new Date(), 0)).toBeFalsy();
    });

    describe('when the limit is 5 sec', () => {
      it('should return false when 6 secs has passed', () => {
        const oldDate: Date = new Date();
        spyOn(Date, 'now').and.returnValues(oldDate.getTime());
        const newDate: Date = new Date(oldDate.getTime());  // duplicate current time
        newDate.setSeconds(newDate.getSeconds() - 6);
        const fiveSecondsAgo: number = 5;
        expect(TimerUtils.isWithinSecondsAgo(newDate, fiveSecondsAgo)).toBeFalsy();
      });
      it('should return true when 4 seconds has passed', () => {
          const oldDate: Date = new Date();
          spyOn(Date, 'now').and.returnValues(oldDate.getTime());
          const newDate: Date = new Date(oldDate.getTime());  // duplicate current time
          newDate.setSeconds(newDate.getSeconds() - 4);
          const fiveSecondsAgo: number = 5;
          const result: boolean = TimerUtils.isWithinSecondsAgo(newDate, fiveSecondsAgo);
          expect(result).toBeTruthy();
      });
    });

  });

  describe('isWithinMinutesAgo()', () => {

    it('should return false when date is null', () => {
      expect(TimerUtils.isWithinMinutesAgo(null, 1000)).toBeFalsy();
    });
    it('should return false when milliseconds is null', () => {
      expect(TimerUtils.isWithinMinutesAgo(new Date(), 0)).toBeFalsy();
    });

    describe('when the limit is 5 minutes', () => {
      it('should return false when 6 minutes has passed', () => {
        const oldDate: Date = new Date();
        spyOn(Date, 'now').and.returnValues(oldDate.getTime());
        const newDate: Date = new Date(oldDate.getTime());  // duplicate current time
        newDate.setMinutes(newDate.getMinutes() - 6);
        const fiveMinutes: number = 5;
        expect(TimerUtils.isWithinMinutesAgo(newDate, fiveMinutes)).toBeFalsy();
      });
      it('should return true when 4 minutes has passed', () => {
          const oldDate: Date = new Date();
          spyOn(Date, 'now').and.returnValues(oldDate.getTime());
          const newDate: Date = new Date(oldDate.getTime());  // duplicate current time
          newDate.setMinutes(newDate.getMinutes() - 4);
          const fiveSecondsAgo: number = 5;
          const result: boolean = TimerUtils.isWithinMinutesAgo(newDate, fiveSecondsAgo);
          expect(result).toBeTruthy();
      });
    });

  });

  describe('isWithinHoursAgo()', () => {

    it('should return false when date is null', () => {
      expect(TimerUtils.isWithinHoursAgo(null, 1000)).toBeFalsy();
    });
    it('should return false when milliseconds is null', () => {
      expect(TimerUtils.isWithinHoursAgo(new Date(), 0)).toBeFalsy();
    });

    describe('when the limit is 5 hours', () => {
      it('should return false when 6 hours has passed', () => {
        const oldDate: Date = new Date();
        spyOn(Date, 'now').and.returnValues(oldDate.getTime());
        const newDate: Date = new Date(oldDate.getTime());  // duplicate current time
        newDate.setHours(newDate.getHours() - 6);
        const fiveMinutes: number = 5;
        expect(TimerUtils.isWithinHoursAgo(newDate, fiveMinutes)).toBeFalsy();
      });
      it('should return true when 4 hours has passed', () => {
          const oldDate: Date = new Date();
          spyOn(Date, 'now').and.returnValues(oldDate.getTime());
          const newDate: Date = new Date(oldDate.getTime());  // duplicate current time
          newDate.setHours(newDate.getHours() - 4);
          const fiveSecondsAgo: number = 5;
          const result: boolean = TimerUtils.isWithinHoursAgo(newDate, fiveSecondsAgo);
          expect(result).toBeTruthy();
      });
    });

  });

});
