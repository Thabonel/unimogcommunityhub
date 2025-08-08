
import { useState } from "react";
import { useFetchVehicles } from "./useFetchVehicles";
import { useVehicleOperations } from "./useVehicleOperations";
import { Vehicle } from "./types";

export const useVehicles = (userId?: string) => {
  // Use the custom hooks
  const { 
    vehicles, 
    isLoading, 
    error, 
    refetchVehicles,
    setVehicles
  } = useFetchVehicles(userId);

  const {
    addVehicle,
    updateVehicle,
    deleteVehicle
  } = useVehicleOperations(userId, setVehicles);

  // Combine and return all the hooks' functionalities
  return {
    vehicles,
    isLoading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetchVehicles
  };
};
