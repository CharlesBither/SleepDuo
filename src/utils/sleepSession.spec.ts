import {
  constructSleepSession,
  constructSleepSessionArray,
  getAverageTst,
  getAverageTimeInBed,
  getAverageSleepEfficiency,
  getAverageTimeInStage,
  getSleepSessionFromReadRecord,
  getSleepSessionArraysByFilter,
} from "./sleepSession";
import { readRecord } from "react-native-health-connect";
import { getSleepSessionLogsMapValues } from "../database/sleepSessionLogs";
import { SleepSession } from "../types/SleepSession";

jest.mock("react-native-health-connect", () => ({
  readRecord: jest.fn(),
}));
jest.mock("../database/sleepSessionLogs", () => ({
  getSleepSessionLogsMapValues: jest.fn(),
}));
jest.mock("./dates", () => ({
  dateToString: (d: Date) => d.toISOString().split("T")[0],
}));

describe("constructSleepSession", () => {
  it("should convert raw record into SleepRecord", () => {
    const record: any = {
      metadata: { id: "guid-1" },
      startTime: "2023-01-01T00:00:00Z",
      endTime: "2023-01-01T08:00:00Z",
      stages: [
        { stage: 4, startTime: "2023-01-01T01:00:00Z", endTime: "2023-01-01T02:00:00Z" }, // light
        { stage: 5, startTime: "2023-01-01T02:00:00Z", endTime: "2023-01-01T03:00:00Z" }, // deep
        { stage: 6, startTime: "2023-01-01T03:00:00Z", endTime: "2023-01-01T04:00:00Z" }, // rem
      ],
    };
    const result = constructSleepSession(record);
    expect(result.guid).toBe("guid-1");
    expect(result.timeInBed).toBe(8 * 60 * 60 * 1000);
    expect(result.totalSleepTime).toBe(3 * 60 * 60 * 1000);
    expect(result.sleepEfficiency).toBe("38");
  });

  it("should throw if guid is missing", () => {
    const record: any = { metadata: {}, startTime: "2023", endTime: "2023" };
    expect(() => constructSleepSession(record)).toThrow("record guid is undefined");
  });
});

describe("constructSleepSessionArray", () => {
  it("should convert array of raw records", () => {
    const records: any = {
      records: [
        {
          metadata: { id: "guid-2" },
          startTime: "2023-01-01T00:00:00Z",
          endTime: "2023-01-01T01:00:00Z",
        },
      ],
    };
    const result = constructSleepSessionArray(records);
    expect(result.length).toBe(1);
    expect(result[0].guid).toBe("guid-2");
  });
});

describe("getAverageTst", () => {
  it("should return 0 when no records", () => {
    expect(getAverageTst([])).toBe(0);
  });

  it("should compute average TST per day", () => {
    const records: SleepSession[] = [
      {
        guid: "1",
        startTime: new Date("2023-01-01T00:00:00Z"),
        endTime: new Date("2023-01-01T08:00:00Z"),
        timeInBed: 8,
        totalSleepTime: 6,
        sleepEfficiency: "0",
        timeAwake: 0,
        timeAsleepUnknown: 0,
        timeLightSleep: 0,
        timeDeepSleep: 0,
        timeRemSleep: 0,
      },
      {
        guid: "2",
        startTime: new Date("2023-01-02T00:00:00Z"),
        endTime: new Date("2023-01-02T07:00:00Z"),
        timeInBed: 7,
        totalSleepTime: 5,
        sleepEfficiency: "0",
        timeAwake: 0,
        timeAsleepUnknown: 0,
        timeLightSleep: 0,
        timeDeepSleep: 0,
        timeRemSleep: 0,
      },
    ];
    expect(getAverageTst(records)).toBe((6 + 5) / 2);
  });
});

describe("getAverageTimeInBed", () => {
  it("should return 0 when no records", () => {
    expect(getAverageTimeInBed([])).toBe(0);
  });

  it("should compute average per day", () => {
    const records: any = [
      { endTime: new Date("2023-01-01"), timeInBed: 10 },
      { endTime: new Date("2023-01-02"), timeInBed: 20 },
    ];
    expect(getAverageTimeInBed(records)).toBe(15);
  });
});

describe("getAverageSleepEfficiency", () => {
  it("should return '0' when no records", () => {
    expect(getAverageSleepEfficiency([])).toBe("0");
  });

  it("should compute efficiency correctly", () => {
    const records: any = [
      { totalSleepTime: 50, timeInBed: 100 },
      { totalSleepTime: 30, timeInBed: 100 },
    ];
    expect(getAverageSleepEfficiency(records)).toBe("40");
  });
});

describe("getAverageTimeInStage", () => {
  it("should return average for a given stage", () => {
    const records: any = [
      { timeAwake: 10, timeLightSleep: 20, timeDeepSleep: 0, timeRemSleep: 0 },
      { timeAwake: 30, timeLightSleep: 40, timeDeepSleep: 0, timeRemSleep: 0 },
    ];
    expect(getAverageTimeInStage(records, "light")).toBe(30);
  });

  it("should return 0 when no valid records", () => {
    const records: any = [{ timeAwake: 0, timeLightSleep: 0, timeDeepSleep: 0, timeRemSleep: 0 }];
    expect(getAverageTimeInStage(records, "deep")).toBe(0);
  });
});

describe("getSleepSessionFromReadRecord", () => {
  it("should resolve a SleepRecord", async () => {
    (readRecord as jest.Mock).mockResolvedValue({
      metadata: { id: "guid-3" },
      startTime: "2023-01-01T00:00:00Z",
      endTime: "2023-01-01T01:00:00Z",
    });
    const result = await getSleepSessionFromReadRecord("guid-3");
    expect(result.guid).toBe("guid-3");
  });

  it("should throw if metadata missing", async () => {
    (readRecord as jest.Mock).mockResolvedValue({});
    await expect(getSleepSessionFromReadRecord("bad-guid")).rejects.toThrow(
      "metadata is undefined"
    );
  });
});

describe("getSleepSessionArraysByFilter", () => {
  it("should split records by filter", async () => {
    (getSleepSessionLogsMapValues as jest.Mock).mockReturnValue([
      { guid: "guid-4", alcohol_quantity: "1", caffeine_quantity: "0" },
      { guid: "guid-5", alcohol_quantity: "0", caffeine_quantity: "1" },
    ]);
    (readRecord as jest.Mock).mockImplementation((_, guid) =>
      Promise.resolve({
        metadata: { id: guid },
        startTime: "2023-01-01T00:00:00Z",
        endTime: "2023-01-01T01:00:00Z",
      })
    );
    const [included, excluded] = await getSleepSessionArraysByFilter("alcohol");
    expect(included.length).toBe(1);
    expect(excluded.length).toBe(1);
  });
});
