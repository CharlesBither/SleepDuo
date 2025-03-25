import { getCalendars } from 'expo-localization';

export class DateFormatter {
    private _timezone: string

    constructor() {
        const timezone = getCalendars()[0].timeZone
        this._timezone = timezone ? timezone : "UTC"
    }

    getTimeZone(): string {
        return this._timezone
    }

    static getLocalDate(date: Date, tz: string): string {
        const options:Intl.DateTimeFormatOptions = {
            weekday: "short",
            month: "short",
            day: "numeric",
            timeZone: tz
          };

        return date.toLocaleDateString('en-US', options)
    }

    static getLocalTime() {
        // TODO
    }

    static getHours(milliseconds: number): number {
        return Math.floor(milliseconds / 1000 / 60 / 60);
    }

    static getMinutes(milliseconds: number): number {
        return Math.floor(milliseconds / 1000 / 60) % 60;
    }
}