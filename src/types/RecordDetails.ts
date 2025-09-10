import { QualityOfSleep } from "./QualityOfSleep";
import { TimeOfDay } from "./TimeOfDay";

export type RecordDetails = {
  created_at: Date;
  uuid: string;
  guid: string;
  alcohol_quantity: string;
  caffiene_quantity: string;
  alcohol_time: TimeOfDay;
  caffiene_time: TimeOfDay;
  had_nap: boolean;
  quality_of_sleep: QualityOfSleep;
}