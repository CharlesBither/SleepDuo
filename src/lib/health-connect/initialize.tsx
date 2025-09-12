import {
    initialize,
    requestPermission,
    Permission,
    BackgroundAccessPermission,
    WriteExerciseRoutePermission,
} from 'react-native-health-connect';

export const initHealthConnect = async () => {
    const isInitialized = await initialize();
    if (!isInitialized) throw new Error("could not initialize health-connect");
    return isInitialized;
};

export const hasRequiredPermissions = (permissions: (Permission | WriteExerciseRoutePermission | BackgroundAccessPermission)[]): boolean => {
    for (const permission of permissions) {
        if (permission.recordType === "SleepSession" && permission.accessType == "read") return true;
    }
    return false;
}

export const requestSleepPermissions = async () => {
    try {
        const permissions = await requestPermission([
            {
                accessType: 'read',
                recordType: 'SleepSession',
            },
        ])
        console.log('Granted permissions on request ', { permissions });
    } catch {
        console.log("threw exception")
    }
};