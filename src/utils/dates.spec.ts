import {
  stringToDate,
  dateToString,
  getHours,
  getMinutes,
  getBeginningOfLast7Days,
  getFormattedDate,
} from "./dates";

describe("dates.ts", () => {
  describe("stringToDate", () => {
    it("converts valid YYYY-MM-DD string to Date", () => {
      const d = stringToDate("2023-09-14");
      expect(d.getFullYear()).toBe(2023);
      expect(d.getMonth()).toBe(8); // zero-based
      expect(d.getDate()).toBe(14);
    });

    it("throws error for invalid date string", () => {
      expect(() => stringToDate("2023-09")).toThrow();
      expect(() => stringToDate("invalid")).toThrow();
    });
  });

  describe("dateToString", () => {
    it("formats Date to YYYY-MM-DD", () => {
      const d = new Date(2023, 0, 5); // Jan 5, 2023
      expect(dateToString(d)).toBe("2023-01-05");
    });

    it("handles double-digit months and days", () => {
      const d = new Date(2023, 10, 15); // Nov 15, 2023
      expect(dateToString(d)).toBe("2023-11-15");
    });
  });

  describe("getHours", () => {
    it("converts milliseconds to whole hours", () => {
      expect(getHours(3600000)).toBe(1);
      expect(getHours(7200000)).toBe(2);
    });
  });

  describe("getMinutes", () => {
    it("converts milliseconds to minutes within the hour", () => {
      expect(getMinutes(60000)).toBe(1);
      expect(getMinutes(3_600_000)).toBe(0); // exactly 1 hour
      expect(getMinutes(3_900_000)).toBe(5); // 1 hour + 5 minutes
    });
  });

  describe("getDaysAgo", () => {
    it("returns a date 7 days ago", () => {
      const now = new Date();
      const sevenDaysAgo = getBeginningOfLast7Days();
      const diff = Math.floor(
        (now.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diff).toBe(7);
    });
  });

  describe("getFormattedDate", () => {
    it("formats date with weekday, month, and day", () => {
      const d = new Date("2023-09-14T12:00:00Z");
      const formatted = getFormattedDate(d);
      expect(formatted).toEqual("Thu, Sep 14");
    });
  });

  const getFormattedTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Australia/Sydney", 
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric"
  }
  return date.toLocaleString("en-US", options);
};

const getFormattedDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Australia/Sydney", 
    timeZoneName: "short",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  }
  return date.toLocaleString("en-US", options);
};

  describe("getFormattedTime", () => {
    it("formats time with hour, minute, and timezone", () => {
      const d = new Date("2023-09-14T12:34:00Z");
      const formatted = getFormattedTime(d);
      expect(formatted).toEqual("10:34 PM GMT+10");
    });
  });

  describe("getFormattedDateTime", () => {
    it("formats date and time with timezone", () => {
      const d = new Date("2023-09-14T12:34:00Z");
      const formatted = getFormattedDateTime(d);
      expect(formatted).toEqual("Thu, Sep 14, 10:34 PM GMT+10");
    });
  });
});
