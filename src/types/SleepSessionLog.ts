import { BooleanFilter } from "./BooleanFilter";
import { QualityOfSleep } from "./QualityOfSleep";
import { TimeOfDay } from "./TimeOfDay";

export type SleepSessionLog = {
  created_at: Date;
  uuid: string;
  guid: string;
  alcohol_quantity: string;
  caffeine_quantity: string;
  alcohol_time: TimeOfDay;
  caffeine_time: TimeOfDay;
  had_nap: BooleanFilter;
  quality_of_sleep: QualityOfSleep;
}