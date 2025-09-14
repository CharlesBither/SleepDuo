import {
    initialize,
    requestPermission,
    Permission,
    BackgroundAccessPermission,
    WriteExerciseRoutePermission,
} from 'react-native-health-connect';

/**
 * Initializes the Health Connect client
 * @returns Promise indicating whether the client initialized
 */
export const initHealthConnect = async (): Promise<void> => {
    const isInitialized = await initialize();
    if (!isInitialized) throw new Error("could not initialize health-connect");
    return;
};

/**
 * 
 * @param permissions Array of Health Connect permissions that this app has been granted
 * @returns Boolean indicating whether the required permissions have been granted to this app
 */
export const hasRequiredPermissions = (permissions: (Permission | WriteExerciseRoutePermission | BackgroundAccessPermission)[]): boolean => {
    for (const permission of permissions) {
        if (permission.recordType === "SleepSession" && permission.accessType == "read") return true;
    }
    return false;
}

/**
 * Requests required permissions from the Health Connect app.
 */
export const requestSleepPermissions = async (): Promise<void> => {
    try {
        const permissions = await requestPermission([
            {
                accessType: 'read',
                recordType: 'SleepSession',
            },
        ]);
        console.log('Granted permissions on request ', { permissions });
    } catch {
        throw new Error("threw exception");
    }
};