
import { ManualSection } from '@/components/profile/vehicle/ManualSection';

interface OwnerManualSectionProps {
  unimogModel?: string;
}

export default function OwnerManualSection({ unimogModel }: OwnerManualSectionProps) {
  return (
    <ManualSection 
      modelCode={unimogModel || ''} 
      variant="card"
      className="mt-4"
    />
  );
}
