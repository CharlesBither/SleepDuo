export class DateFormatter {


    static getHours(milliseconds: number): number {
        return Math.floor(milliseconds / 1000 / 60 / 60);
    }

    static getMinutes(milliseconds: number): number {
        return Math.floor(milliseconds / 1000 / 60) % 60;
    }
}