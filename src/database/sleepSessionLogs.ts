import { QueryData } from "@supabase/supabase-js";
import { getId, supabase } from "../lib/supabase";
import { Tables } from "./database.types";
import { SleepSessionLog } from "../types/SleepSessionLog";

/** Maps SleepRecord guid to the corresponding SleepSessionLog */
const sleepSessionsLogsMap: Map<string, SleepSessionLog> = new Map();

const fetchQuery = supabase.from("sleep_session_logs").select(`
        id,
        created_at,
        uuid,
        guid,
        alcohol_quantity,
        caffeine_quantity,
        alcohol_time,
        caffeine_time,
        had_nap,
        quality_of_sleep
        `);

export type FetchResponse = QueryData<typeof fetchQuery>;

const fetchResponseToSleepSessionLog = (
  response: FetchResponse
): SleepSessionLog | undefined => {
  if (response.length === 0) return undefined;

  const row = response[0];
  const created = new Date(row.created_at);

  if (
    !row.uuid ||
    !row.alcohol_quantity ||
    !row.caffeine_quantity ||
    !row.guid ||
    !row.created_at ||
    !row.had_nap ||
    !row.quality_of_sleep
  ) {
    throw new Error(
      "FetchResponse contains invalid data: " + row
    );
  }

  return {
    created_at: created,
    uuid: row.uuid,
    guid: row.guid,
    alcohol_quantity: row.alcohol_quantity,
    alcohol_time: row.alcohol_time,
    caffeine_quantity: row.caffeine_quantity,
    caffeine_time: row.caffeine_time,
    had_nap: row.had_nap,
    quality_of_sleep: row.quality_of_sleep
  };
};

/**
 *
 * @param uuid UUID of the user who owns the log
 * @param guid GUID of the sleep session
 * @returns The SleepSessionLog that matches the uuid and guid
 */
export const fetchSleepSessionLog = async (
  uuid: string,
  guid: string
): Promise<SleepSessionLog | undefined> => {
  const query = supabase
    .from("sleep_session_logs")
    .select()
    .eq("uuid", uuid)
    .eq("guid", guid);

  type Response = QueryData<typeof query>;

  const { data, error } = await query;
  if (error?.message)
    console.error("fetchSleepSessionLog threw error " + error.message);
  if (!data) throw new Error("fetchSleepSessionLog returned null data");
  const response: Response = data;

  return fetchResponseToSleepSessionLog(response);
};

/**
 *
 * @param uuid UUID of the user who owns the log
 * @param guid GUID of the sleep session
 * @returns Response data specifying the status of the query
 */
export const deleteSleepSessionLog = async (uuid: string, guid: string) => {
  const res = await supabase
    .from("sleep_session_logs")
    .delete()
    .eq("uuid", uuid)
    .eq("guid", guid);

  sleepSessionsLogsMap.delete(guid);
  return res;
};

/**
 *
 * @param uuid UUID of the user who owns the log
 * @returns Response data specifying the status of the query
 */
export const deleteAllSleepSessionLogsById = async (uuid: string) => {
  const res = await supabase.from("sleep_session_logs").delete().eq("uuid", uuid);
  if (res.error?.message) {
    throw new Error("deleteAllSleepSessionLogsById threw error: " + res.error.message);
  }
  sleepSessionsLogsMap.clear();
  return res;
};

/**
 *
 * @param log The SleepSessionLog to insert into the database
 * @returns The details that were inserted
 */
export const insertSleepSessionLog = async (
  log: SleepSessionLog
): Promise<Tables<"sleep_session_logs">[]> => {
  const fetchLogResponse = await fetchSleepSessionLog(
    log.uuid,
    log.guid
  );
  if (fetchLogResponse) {
    await deleteSleepSessionLog(log.uuid, log.guid);
  }

  const query = supabase.from("sleep_session_logs").insert(log).select();

  type Response = QueryData<typeof query>;

  const { data, error } = await query;
  if (error?.message) {
    throw new Error("insertSleepSessionLog threw error: " + error.message);
  }
  if (!data) throw new Error("insertSleepSessionLog returned null data");
  const response: Response = data;
  sleepSessionsLogsMap.set(log.guid, log);

  return response;
};

const fetchSleepSessionLogsByUuid = async (
  uuid: string
): Promise<FetchResponse> => {
  const query = supabase
    .from("sleep_session_logs")
    .select(
      `
        id,
        created_at,
        uuid,
        guid,
        alcohol_quantity,
        caffeine_quantity,
        alcohol_time,
        caffeine_time,
        had_nap,
        quality_of_sleep
        `
    )
    .eq("uuid", uuid);

  type Response = QueryData<typeof query>;

  const { data, error } = await query;
  if (error?.message)
    console.error("fetchSleepSessionLogsByUuid threw error " + error.message);
  if (!data) throw new Error("fetchSleepSessionLogsByUuid returned null data");
  const response: Response = data;

  return response;
};

/**
 * @param guid the guid of the sleep record
 * @returns SleepSessionLog corresponding to guid
 */
export const getSleepSessionLog = (guid: string): SleepSessionLog | undefined => {
  return sleepSessionsLogsMap.get(guid);
}

export const getSleepSessionLogsMapValues = (): SleepSessionLog[] => {
  return [...sleepSessionsLogsMap.values()];
}

const populateSleepSessionLogsMap = (data: FetchResponse): void => {
  sleepSessionsLogsMap.clear();
  for (const row of data) {
    const created = new Date(row.created_at);
    if (
      !row.uuid ||
      !row.alcohol_quantity ||
      !row.caffeine_quantity ||
      !row.guid ||
      !row.created_at ||
      !row.had_nap ||
      !row.quality_of_sleep
    ) {
      throw new Error(
        "populateSleepSessionLogsMap FetchResponse contains invalid data: " + row
      );
    }

    sleepSessionsLogsMap.set(row.guid, {
      created_at: created,
      uuid: row.uuid,
      guid: row.guid,
      alcohol_quantity: row.alcohol_quantity,
      alcohol_time: row.alcohol_time,
      caffeine_quantity: row.caffeine_quantity,
      caffeine_time: row.caffeine_time,
      had_nap: row.had_nap,
      quality_of_sleep: row.quality_of_sleep
    });
  }
};

export const initSleepSessionLogsMap = async (): Promise<void> => {
  try {
    const uuid = await getId();
    const data = await fetchSleepSessionLogsByUuid(uuid);
    populateSleepSessionLogsMap(data);
  } catch(error) {
    throw new Error("initSleepSessionLogsMap threw error: " + error);
  }
  
};
