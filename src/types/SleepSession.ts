export type SleepSession = {
  guid: string;
  startTime: Date;
  endTime: Date;
  timeInBed: number;
  totalSleepTime: number;
  sleepEfficiency: String;
  timeAwake: number;
  timeAsleepUnknown: number;
  timeLightSleep: number;
  timeDeepSleep: number;
  timeRemSleep: number;
};
