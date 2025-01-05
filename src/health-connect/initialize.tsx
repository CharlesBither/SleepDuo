import {
    initialize,
    requestPermission,
  } from 'react-native-health-connect';

// initialize the client
const initHealthConnect = async () => {
    const result = await initialize();
    console.log({ result });
};

// request permissions
const requestSamplePermissions = async () => {
    const permissions = await requestPermission([
    {
    accessType: 'read',
    recordType: 'SleepSession',
    },
])
    console.log('Granted permissions on request ', { permissions });
};

export default async function initializeHealthConnect() {
    await initHealthConnect();
    await requestSamplePermissions();
    return;
}