import { BooleanFilter } from "../types/BooleanFilter";
import { SleepSessionActivity } from "../types/SleepSessionActivity";
import { TimeOfDay } from "../types/TimeOfDay";

export const renderFilterStatement = (activity: SleepSessionActivity | "", napFilter: BooleanFilter | "", timeOfDayFilter: TimeOfDay[]): string => {
    // base cases:
    if ((activity === "" || timeOfDayFilter.length === 0) || (activity === "nap" && napFilter === "")) return "";

    if (activity === "nap") {
        return napFilter === "yes" ? "On days when I took a nap..." : "On days when I didn't take a nap..."
    }
    if (timeOfDayFilter.length === 4) {
        return "On days when I recorded a log..."
    }
    if (timeOfDayFilter.length === 1 && timeOfDayFilter[0] === "NA") {
      return `On days when I didn't have ${activity}...`
    }

    // recursive case:
    // activity is a consumable. Remove "NA" if exists.
    const set = new Set(timeOfDayFilter);
    if (set.has("NA")) set.delete("NA");
    const currArray = [...set]; // still has at least 1 element
    const statement = renderFilterStatementHelper(currArray);

    return timeOfDayFilter.includes("NA") ? `On days when I had ${activity} ${statement} or when I didn't have ${activity}...` : `On days when I had ${activity} ${statement}...`
}

const renderFilterStatementHelper = (timeOfDayFilter: TimeOfDay[]): string => {
    // base case:
    if (timeOfDayFilter.length === 1) {
        return timeOfDayToStatement(timeOfDayFilter[0]);
    }

    // recursive case:
    const currArray = [...timeOfDayFilter];
    const currFilter = currArray.pop();
    const statement = renderFilterStatementHelper(currArray);
    if (!currFilter) {
        throw new Error("currFilter is undefined");
    }
    return `${statement} or ${timeOfDayToStatement(currFilter)}`;
}

const timeOfDayToStatement = (timeOfDay: TimeOfDay): string => {
    switch (timeOfDay) {
        case ("AM"):
            return "in the morning";
        case ("PM"):
            return "in the afternoon/evening";
        case ("LN"):
            return "late at night";
        case ("NA"):
            return "";
    }
}