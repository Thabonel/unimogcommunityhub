
import React from 'react';
import { Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TerrainTabContentProps {
  terrainTypes: string[];
}

const TerrainTabContent = ({ terrainTypes }: TerrainTabContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium flex items-center">
          <Mountain className="h-4 w-4 mr-2" /> Terrain Types
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {terrainTypes.map((terrain, index) => (
            <Badge key={index} variant="outline">
              {typeof terrain === 'string' ? terrain.charAt(0).toUpperCase() + terrain.slice(1) : terrain}
            </Badge>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium">Elevation Profile</h3>
        <div className="h-20 bg-muted rounded-md mt-2 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Elevation data visualization</p>
        </div>
      </div>
    </div>
  );
};

export default TerrainTabContent;
