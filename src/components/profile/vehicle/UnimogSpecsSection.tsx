
import { Badge } from '@/components/ui/badge';
import { UnimogModel } from '@/hooks/use-unimog-data';

interface UnimogSpecsSectionProps {
  unimogData: UnimogModel;
}

export const UnimogSpecsSection = ({ unimogData }: UnimogSpecsSectionProps) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium">{unimogData.name} Technical Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Model Code</p>
          <p className="font-medium">{unimogData.model_code}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Series</p>
          <p className="font-medium">{unimogData.series}</p>
        </div>
      </div>
      
      {Object.keys(unimogData.specs).length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Specifications</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(unimogData.specs).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}: </span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {unimogData.features && unimogData.features.length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Features</p>
          <div className="flex flex-wrap gap-2">
            {unimogData.features.map((feature, index) => (
              <Badge key={index} variant="secondary">{feature}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {unimogData.history && (
        <div className="pt-4 mt-2 border-t">
          <p className="text-sm font-medium mb-2">History</p>
          <p className="text-sm">{unimogData.history}</p>
        </div>
      )}
      
      {unimogData.capabilities && (
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Capabilities</p>
          <p className="text-sm">{unimogData.capabilities}</p>
        </div>
      )}
    </div>
  );
};
