

export const stringToDate = (date: string): Date => {
    const parts = date.split("-");
    if (parts.length < 3) throw new Error("stringToDate received invalid date param: " + date);
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

export const dateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    let res = `${year}-`;
    res += (month < 9 ? `0${month+1}-` : `${month+1}-`);
    res += (day <= 9 ? `0${day}` : `${day}`);

    return res;
}