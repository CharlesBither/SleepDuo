var assert = require('assert');
import { createClient, QueryData } from '@supabase/supabase-js';
import { Record, constructRecord, constructRecordWithId } from '../types/Record';
import dotenv from 'dotenv';
import { Tables } from './database.types';
import { FetchResponse } from './journal_records';
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * The following functions are copied from journal_records.ts, but with the following differences:
 * 1. The createClient call from supabase does not include Auth options.
 * 2. The database table being accessed is journal_records_test
 */
const fetchJournalRecord = async (journalDate: string, uuid: string): Promise<Tables<'journal_records_test'>[]> => {
    const query = supabase
      .from("journal_records_test")
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

const deleteJournalRecord = async (journalDate: string, uuid: string) => {
    return await supabase
      .from("journal_records_test")
      .delete()
      .eq("uuid", uuid)
      .eq("journal_date", journalDate);
}

export const insertJournalRecord = async (record: Record): Promise<Tables<'journal_records_test'>[]> => {
    const getJournalRecordResponse = await fetchJournalRecord(record.journal_date, record.uuid);
    if (getJournalRecordResponse) {
        await deleteJournalRecord(record.journal_date, record.uuid);
    }

    const query = supabase
      .from("journal_records_test")
      .insert(record)
      .select();

    type Response = QueryData<typeof query>

    const { data, error } = await query;
    if (error?.message) console.error("insertJournalRecord threw error: " + error.message);
    if (!data) throw new Error("insertJournalRecord returned null data")
    const response: Response = data;

    return response;
}

const fetchJournalRecordsByUuid = async (uuid: string): Promise<FetchResponse> => {
  const query = supabase
      .from("journal_records_test")
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

const journalRecordsMap = new Map<string, Record>();

const populateJournalRecordsMap = (data: FetchResponse): void => {
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

const initJournalRecordsMap = async (uuid: string): Promise<void> => {
  const data = await fetchJournalRecordsByUuid(uuid);
  populateJournalRecordsMap(data);
}

/**
 * Tests start here
 */
describe("journal_records_tests", function() {

    const u1 = "43c6816c-b63b-4844-955b-ca82b05a03f1";
    const u2 = "43c6816c-b63b-4844-955b-ca82b05a03f2";
    const u3 = "43c6816c-b63b-4844-955b-ca82b05a03f3";
    const date1 = new Date(1753085294409); //'2025-07-21'
    const date2 = new Date(1753779342786);

    const record1 = constructRecordWithId(111, u1, date1, date1, "0", "0");

    it("insert_journal_records", async function() {
        const { error } = await supabase.auth.signInWithPassword({
            email: process.env.EXPO_PUBLIC_SUPABASE_TEST_USER as string,
            password: process.env.EXPO_PUBLIC_SUPABASE_TEST_PASSWORD as string,
        })
        if (error) console.error("sign in failed: " + error);

        const res = await insertJournalRecord(record1);
        const data = res[0];
        const expectedContent1 = {
            "alcohol_quantity": "0",
            "caffiene_quantity": "0",
            "sleep_date": "2025-07-21T08:08:14.409Z",
            "wake_date": "2025-07-21T08:08:14.409Z"
        }
        assert.deepStrictEqual(data.created_at.substring(0,20), record1.created_at.toISOString().substring(0,20));
        assert.deepStrictEqual(data.id, record1.id);
        assert.deepStrictEqual(data.journal_date, '2025-07-21');
        assert.deepStrictEqual(data.uuid, record1.uuid);
        assert.deepStrictEqual(data.content, expectedContent1);

    })

    it("fetch_journal_records", async function() {
        assert.deepStrictEqual(await fetchJournalRecord(date1.toDateString(), u3), []);
    })

    it("delete_journal_records", async function() {
        const expectedResponse = {
            count: null,
            data: null,
            error: null,
            status: 204,
            statusText: 'No Content'
        }
        assert.deepStrictEqual(await deleteJournalRecord(date1.toDateString(), u1), expectedResponse);
        assert.deepStrictEqual(await deleteJournalRecord(date1.toDateString(), u2), expectedResponse);
        assert.deepStrictEqual(await deleteJournalRecord(date1.toDateString(), u3), expectedResponse);
    })

    let fetchJournalRecordsByUuidResult: FetchResponse;
    it("fetchJournalRecordsByUuid", async function() {
      fetchJournalRecordsByUuidResult = await fetchJournalRecordsByUuid("43c6816c-b63b-4844-955b-ca82b05a03f1");
        assert.deepStrictEqual(fetchJournalRecordsByUuidResult,
        [
            {
                "alcohol_date": null,
                "alcohol_quantity": "0",
                "caffiene_date": null,
                "caffiene_quantity": "0",
                "created_at": '2025-07-29T09:11:15.904+00:00',
                "id": 112,
                "journal_date": '2025-07-29',
                "sleep_date": "2025-07-29T08:55:42.786Z",
                "uuid": '43c6816c-b63b-4844-955b-ca82b05a03f1',
                "wake_date": "2025-07-29T08:55:42.786Z"
            }
        ]);
    })

    it("populateJournalRecordsMap", function() {
      populateJournalRecordsMap(fetchJournalRecordsByUuidResult);
      const record = journalRecordsMap.get("2025-07-29");
      assert.deepStrictEqual(record?.uuid, '43c6816c-b63b-4844-955b-ca82b05a03f1');
      assert.deepStrictEqual(record?.journal_date, date2.toDateString());
      assert.deepStrictEqual(record?.content.wake_date, "2025-07-29T08:55:42.786Z")
      assert.deepStrictEqual(record?.content.alcohol_quantity, "0");
    })
})