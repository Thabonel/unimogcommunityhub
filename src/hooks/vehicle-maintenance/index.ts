
import { useVehicles } from "./use-vehicles";
import { useMaintenanceLogs } from "./use-maintenance-logs";
import { useMaintenanceSettings } from "./use-maintenance-settings";

export * from "./types";
export * from "./use-vehicles";
export * from "./use-maintenance-logs";
export * from "./use-maintenance-settings";

// Simply exposing the hooks directly instead of combining them
export { useVehicles, useMaintenanceLogs, useMaintenanceSettings };
