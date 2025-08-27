import { QueryData } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { Tables } from "./database.types";
import { RecordDetails } from "../types/RecordDetails";

const fetchQuery = supabase.from("record_details").select(`
        id,
        created_at,
        uuid,
        guid,
        alcohol_quantity,
        caffiene_quantity,
        alcohol_date,
        caffiene_date
        `);

export type FetchResponse = QueryData<typeof fetchQuery>;

const fetchResponseToRecordDetails = (
  response: FetchResponse
): RecordDetails | undefined => {
  if (response.length === 0) return undefined;

  const row = response[0];
  const created = new Date(row.created_at);

  let alcoholDate = undefined;
  if (row.alcohol_date) {
    alcoholDate = new Date(row.alcohol_date);
  }

  let caffiene_date = undefined;
  if (row.caffiene_date) {
    caffiene_date = new Date(row.caffiene_date);
  }

  if (
    !row.uuid ||
    !row.alcohol_quantity ||
    !row.caffiene_quantity ||
    !row.guid ||
    !row.created_at
  ) {
    throw new Error(
      "populateRecordDetailsCache FetchResponse contains invalid data: " + row
    );
  }

  return {
    created_at: created,
    uuid: row.uuid,
    guid: row.guid,
    alcohol_quantity: row.alcohol_quantity,
    alcohol_date: alcoholDate,
    caffiene_quantity: row.caffiene_quantity,
    caffiene_date: caffiene_date,
  };
};

/**
 *
 * @param uuid UUID of the user who owns this record
 * @param guid GUID of the sleep record
 * @returns Array of records that match the uuid and guid
 */
export const fetchRecordDetails = async (
  uuid: string,
  guid: string
): Promise<RecordDetails | undefined> => {
  const query = supabase
    .from("record_details")
    .select()
    .eq("uuid", uuid)
    .eq("guid", guid);

  type Response = QueryData<typeof query>;

  const { data, error } = await query;
  if (error?.message)
    console.error("fetchRecordDetails threw error " + error.message);
  if (!data) throw new Error("fetchJournalRecord returned null data");
  const response: Response = data;

  return fetchResponseToRecordDetails(response);
};

/**
 *
 * @param uuid UUID of the user who owns this record
 * @param guid GUID of the sleep record
 * @returns Response data specifying the status of the query
 */
export const deleteRecordDetails = async (uuid: string, guid: string) => {
  const res =  await supabase
    .from("record_details")
    .delete()
    .eq("uuid", uuid)
    .eq("guid", guid);
  
    recordDetailsMap.delete(guid);
    return res;
};

/**
 *
 * @param uuid UUID of the user who owns this record
 * @returns Response data specifying the status of the query
 */
export const deleteAllRecordDetailsById = async (uuid: string) => {
  const res = await supabase.from("record_details").delete().eq("uuid", uuid);
  if (res.error?.message) {
    throw new Error("deleteAllRecordDetailsById threw error: " + res.error.message);
  }
  recordDetailsMap.clear();
  return res;
};

/**
 *
 * @param details The details to insert into the database
 * @returns The details that were inserted
 */
export const insertRecordDetails = async (
  details: RecordDetails
): Promise<Tables<"record_details">[]> => {
  const getJournalRecordResponse = await fetchRecordDetails(
    details.uuid,
    details.guid
  );
  if (getJournalRecordResponse) {
    await deleteRecordDetails(details.uuid, details.guid);
  }

  const query = supabase.from("record_details").insert(details).select();

  type Response = QueryData<typeof query>;

  const { data, error } = await query;
  if (error?.message) {
    throw new Error("insertRecordDetails threw error: " + error.message);
  }
  if (!data) throw new Error("insertRecordDetails returned null data");
  const response: Response = data;
  recordDetailsMap.set(details.guid, details);

  return response;
};

const fetchRecordDetailsByUuid = async (
  uuid: string
): Promise<FetchResponse> => {
  const query = supabase
    .from("record_details")
    .select(
      `
        id,
        created_at,
        uuid,
        guid,
        alcohol_quantity,
        caffiene_quantity,
        alcohol_date,
        caffiene_date
        `
    )
    .eq("uuid", uuid);

  type Response = QueryData<typeof query>;

  const { data, error } = await query;
  if (error?.message)
    console.error("getJournalRecord threw error " + error.message);
  if (!data) throw new Error("fetchJournalRecord returned null data");
  const response: Response = data;

  return response;
};

/** Maps SleepRecord guid to the corresponding RecordDetails */
const recordDetailsMap: Map<string, RecordDetails> = new Map();

/**
 * @param guid the guid of the sleep record
 * @returns RecordDetails corresponding to guid
 */
export const getRecordDetails = (guid: string): RecordDetails | undefined => {
  return recordDetailsMap.get(guid);
}

const populateRecordDetailsMap = (data: FetchResponse): void => {
  for (const row of data) {
    const created = new Date(row.created_at);

    let alcoholDate = undefined;
    if (row.alcohol_date) {
      alcoholDate = new Date(row.alcohol_date);
    }

    let caffiene_date = undefined;
    if (row.caffiene_date) {
      caffiene_date = new Date(row.caffiene_date);
    }

    if (
      !row.uuid ||
      !row.alcohol_quantity ||
      !row.caffiene_quantity ||
      !row.guid ||
      !row.created_at
    ) {
      throw new Error(
        "populateRecordDetailsMap FetchResponse contains invalid data: " + row
      );
    }

    recordDetailsMap.set(row.guid, {
      created_at: created,
      uuid: row.uuid,
      guid: row.guid,
      alcohol_quantity: row.alcohol_quantity,
      alcohol_date: alcoholDate,
      caffiene_quantity: row.caffiene_quantity,
      caffiene_date: caffiene_date,
    });
  }
};

/**
 * Gets all RecordDetails created by the user who has the given uuid
 * @param uuid The user id
 */
export const initRecordDetailsMap = async (uuid: string): Promise<void> => {
  const data = await fetchRecordDetailsByUuid(uuid);
  populateRecordDetailsMap(data);
};
