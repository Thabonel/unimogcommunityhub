
import { Button } from '@/components/ui/button';
import { ManualSection } from './ManualSection';

interface UnimogData {
  engine: string;
  transmission: string;
  power: string;
  torque: string;
  weight: string;
  dimensions: string;
  features: string[];
}

interface UnimogSpecsSectionProps {
  unimogData: UnimogData;
  modelCode?: string;
  showManual?: boolean;
}

export const UnimogSpecsSection = ({ 
  unimogData, 
  modelCode, 
  showManual = true 
}: UnimogSpecsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Engine</p>
            <p className="font-medium">{unimogData.engine}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Transmission</p>
            <p className="font-medium">{unimogData.transmission}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Power</p>
            <p className="font-medium">{unimogData.power}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Torque</p>
            <p className="font-medium">{unimogData.torque}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="font-medium">{unimogData.weight}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dimensions</p>
            <p className="font-medium">{unimogData.dimensions}</p>
          </div>
        </div>
      </div>

      {unimogData.features && unimogData.features.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-1">
            {unimogData.features.map((feature, index) => (
              <li key={index} className="text-sm">{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Owner's Manual section */}
      {showManual && modelCode && <ManualSection modelCode={modelCode} variant="inline" />}
    </div>
  );
};
