
import { useEffect, useState } from 'react';
import { ManualSection } from '@/components/profile/vehicle/ManualSection';

interface OwnerManualSectionProps {
  unimogModel?: string;
  hideWhenShownInVehiclesTab?: boolean;
}

export default function OwnerManualSection({ 
  unimogModel, 
  hideWhenShownInVehiclesTab = false 
}: OwnerManualSectionProps) {
  const [isShownInParent, setIsShownInParent] = useState(false);
  
  // Check if this component is being shown in VehiclesTab
  useEffect(() => {
    if (hideWhenShownInVehiclesTab) {
      // Check if we're inside the vehicles tab by looking for parent elements
      const vehiclesTabElement = document.querySelector('[data-showing-manual="true"]');
      setIsShownInParent(!!vehiclesTabElement);
    }
  }, [hideWhenShownInVehiclesTab]);
  
  // Skip rendering if we're being hidden because the parent is already showing the manual
  if (isShownInParent) {
    return null;
  }
  
  return (
    <ManualSection 
      modelCode={unimogModel || ''} 
      variant="card"
      className="mt-4"
    />
  );
}
