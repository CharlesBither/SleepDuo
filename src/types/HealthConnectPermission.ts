import { BackgroundAccessPermission, Permission, WriteExerciseRoutePermission } from "react-native-health-connect";

export type HealthConnectPermission = Permission | WriteExerciseRoutePermission | BackgroundAccessPermission;