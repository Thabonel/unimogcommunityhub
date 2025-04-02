
import { useVehicles } from "./use-vehicles";
import { useMaintenanceLogs } from "./use-maintenance-logs";
import { useMaintenanceSettings } from "./use-maintenance-settings";

export * from "./types";
export * from "./use-vehicles";
export * from "./use-maintenance-logs";
export * from "./use-maintenance-settings";

// Create a combined hook again for backward compatibility with existing components
export const useVehicleMaintenance = (userId?: string) => {
  const vehiclesHook = useVehicles(userId);
  const logsHook = useMaintenanceLogs();
  const settingsHook = useMaintenanceSettings();

  return {
    ...vehiclesHook,
    ...logsHook,
    ...settingsHook,
  };
};
