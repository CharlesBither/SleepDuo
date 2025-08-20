import { QueryData } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { constructRecord, Record } from "../types/Record";
import { Tables } from "./database.types";

const fetchQuery = supabase
      .from("journal_records")
      .select(`
        id,
        journal_date,
        uuid,
        created_at,
        wake_date:          content->>wake_date,
        sleep_date:         content->>sleep_date,
        alcohol_quantity:   content->>alcohol_quantity,
        caffiene_quantity:  content->>caffiene_quantity,
        alcohol_date:       content->>alcohol_date,
        caffiene_date:      content->>caffiene_date
        `)

export type FetchResponse = QueryData<typeof fetchQuery>

/**
 * 
 * @param journalDate The date of the journal record
 * @param uuid UUID of the user who owns this record
 * @returns Array of records that match the date and uuid
 */
export const fetchJournalRecord = async (journalDate: string, uuid: string): Promise<Tables<'journal_records_test'>[]> => {
    const query = supabase
      .from("journal_records")
      .select()
      .eq("uuid", uuid)
      .eq("journal_date", journalDate);

    type Response = QueryData<typeof query>

    const { data, error } = await query;
    if (error?.message) console.error("getJournalRecord threw error " + error.message);
    if (!data) throw new Error("fetchJournalRecord returned null data")
    const response: Response = data;

    return response;
}

/**
 * 
 * @param journalDate The date of the journal record
 * @param uuid UUID of the user who owns this record
 * @returns Response data specifying the status of the query
 */
export const deleteJournalRecord = async (journalDate: string, uuid: string) => {
    return await supabase
      .from("journal_records")
      .delete()
      .eq("uuid", uuid)
      .eq("journal_date", journalDate);
}

/**
 * 
 * @param uuid UUID of the user who owns this record
 * @returns Response data specifying the status of the query
 */
export const deleteAllJournalRecordsById = async (uuid: string) => {
    return await supabase
      .from("journal_records")
      .delete()
      .eq("uuid", uuid);
}

/**
 * 
 * @param record The record to insert into the database
 * @returns The record that was inserted
 */
export const insertJournalRecord = async (record: Record): Promise<Tables<'journal_records_test'>[]> => {
    const getJournalRecordResponse = await fetchJournalRecord(record.journal_date, record.uuid);
    if (getJournalRecordResponse) {
        await deleteJournalRecord(record.journal_date, record.uuid);
    }

    const query = supabase
      .from("journal_records")
      .insert(record)
      .select();

    type Response = QueryData<typeof query>

    const { data, error } = await query;
    if (error?.message) console.error("insertJournalRecord threw error: " + error.message);
    if (!data) throw new Error("insertJournalRecord returned null data")
    const response: Response = data;

    return response;
}

export const fetchJournalRecordsByUuid = async (uuid: string): Promise<FetchResponse> => {
  const query = supabase
      .from("journal_records")
      .select(`
        id,
        journal_date,
        uuid,
        created_at,
        wake_date:          content->>wake_date,
        sleep_date:         content->>sleep_date,
        alcohol_quantity:   content->>alcohol_quantity,
        caffiene_quantity:  content->>caffiene_quantity,
        alcohol_date:       content->>alcohol_date,
        caffiene_date:      content->>caffiene_date
        `)
      .eq("uuid", uuid)

    type Response = QueryData<typeof query>

    const { data, error } = await query;
    if (error?.message) console.error("getJournalRecord threw error " + error.message);
    if (!data) throw new Error("fetchJournalRecord returned null data")
    const response: Response = data;

    return response;
}

export const journalRecordsMap = new Map<string, Record>();

export const populateJournalRecordsMap = (data: FetchResponse): void => {
  journalRecordsMap.clear();
  for (const row of data) {
    const created = new Date(row.created_at);

    let alcoholDate = undefined
    if (row.alcohol_date) {
      alcoholDate = new Date(row.alcohol_date);
    }

    let caffiene_date = undefined;
    if (row.caffiene_date) {
      caffiene_date = new Date(row.caffiene_date);
    }

    const record = constructRecord(row.uuid, new Date(row.wake_date), new Date(row.sleep_date), row.alcohol_quantity, row.caffiene_quantity, alcoholDate, caffiene_date);
    journalRecordsMap.set(row.journal_date, record);
  }
}

export const initJournalRecordsMap = async (uuid: string): Promise<void> => {
  const data = await fetchJournalRecordsByUuid(uuid);
  populateJournalRecordsMap(data);
}

export const printJournalRecordsMap = (): void => {
  for (const record of journalRecordsMap.values()) {
    console.log(record.content);
  }
}