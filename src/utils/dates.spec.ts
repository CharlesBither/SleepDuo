import { dateToString, stringToDate } from "./dates";

var assert = require('assert');

describe("dates", function() {

    const d1 = new Date(1980, 0, 1);
    const d2 = new Date(2000, 8, 7);
    const d3 = new Date(2000, 11, 31);

    it("stringToDate", function() {
        assert.deepStrictEqual(stringToDate("1980-01-01"), d1);
        assert.deepStrictEqual(stringToDate("2000-09-07"), d2);
        assert.deepStrictEqual(stringToDate("2000-12-31"), d3);
    });

    it("dateToString", function() {
        assert.deepStrictEqual(dateToString(d1), "1980-01-01");
        assert.deepStrictEqual(dateToString(d2), "2000-09-07");
        assert.deepStrictEqual(dateToString(d3), "2000-12-31");
    });
});