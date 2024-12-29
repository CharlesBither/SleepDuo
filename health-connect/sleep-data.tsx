import {
    getGrantedPermissions,
    readRecords,
  } from 'react-native-health-connect';

const getBeginningOfLast14Days = () => {
    const date = new Date();
    date.setDate(date.getDate() - 14);
    date.setHours(0, 0, 0, 0);
    return date;
};

const now = () => {
    return new Date();
};

export async function getSleepData() {
    return await readRecords('SleepSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: getBeginningOfLast14Days().toISOString(),
          endTime: now().toISOString(),
        },
    });
}

// export function read() {
//     readRecords('SleepSession', {
//       timeRangeFilter: {
//         operator: 'between',
//         startTime: getBeginningOfLast14Days().toISOString(),
//         endTime: now().toISOString(),
//       },
//     })
//       .then((result) => {
//         console.log('Retrieved records: ', JSON.stringify({ result }, null, 2));
//         return result;
//       })
//       .catch((err) => {
//         console.error('Error reading records ', { err });
//       });
//   };