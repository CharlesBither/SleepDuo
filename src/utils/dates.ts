import { getCalendars } from 'expo-localization';

export const stringToDate = (date: string): Date => {
  const parts = date.split('-');
  if (parts.length < 3)
    throw new Error('stringToDate received invalid date param: ' + date);
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
};

export const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let res = `${year}-`;
  res += month < 9 ? `0${month + 1}-` : `${month + 1}-`;
  res += day <= 9 ? `0${day}` : `${day}`;

  return res;
};

/** @returns the number of hours given milliseconds */
export const getHours = (milliseconds: number): number => {
  return Math.floor(milliseconds / 1000 / 60 / 60);
};

/** @returns the number of minutes given milliseconds */
export const getMinutes = (milliseconds: number): number => {
  return Math.floor(milliseconds / 1000 / 60) % 60;
};

/** @returns new Date 7 days ago */
export const getBeginningOfLast7Days = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  date.setHours(0, 0, 0, 0);
  return date;
};

/** @returns new Date 14 days ago */
export const getBeginningOfLast14Days = () => {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  date.setHours(0, 0, 0, 0);
  return date;
};

/** @returns new Date 30 days ago */
export const getBeginningOfLast30Days = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getTimeZone = (): string => {
  const timeZone = getCalendars()[0].timeZone;
  return timeZone ? timeZone : 'UTC';
};

export const getFormattedDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleString('en-US', options);
};

export const getFormattedTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: getTimeZone(),
    timeZoneName: 'short',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleString('en-US', options);
};

export const getFormattedDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: getTimeZone(),
    timeZoneName: 'short',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleString('en-US', options);
};
