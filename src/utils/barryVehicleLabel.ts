export interface BarryVehicleLabelContext {
  model?: string;
  year?: number;
  name?: string;
}

export function formatBarryVehicleLabel(
  vehicle: BarryVehicleLabelContext | undefined,
  fallbackModel?: string | null,
): string {
  const model = vehicle?.model || fallbackModel || '';
  const base = [model, vehicle?.year ? `(${vehicle.year})` : '']
    .filter(Boolean)
    .join(' ');

  if (vehicle?.name) {
    return `${base || 'Your Unimog'} - "${vehicle.name}"`;
  }

  return base || 'Your Unimog';
}
