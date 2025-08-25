
import { Mountain } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TerrainFormProps } from './types';

const TerrainForm = ({ selectedTerrainTypes, handleTerrainChange }: TerrainFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="terrain-type">Terrain Types</Label>
        <div className="grid grid-cols-2 gap-2">
          {['desert', 'mountain', 'forest', 'river', 'snow', 'mud'].map((terrain) => (
            <div key={terrain} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={`terrain-${terrain}`} 
                className="h-4 w-4 rounded" 
                checked={selectedTerrainTypes.includes(terrain)}
                onChange={() => handleTerrainChange(terrain)}
              />
              <Label htmlFor={`terrain-${terrain}`}>
                {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="elevation">Elevation Preference</Label>
        <div className="flex items-center space-x-2">
          <Mountain className="h-4 w-4 text-muted-foreground" />
          <Select>
            <SelectTrigger id="elevation">
              <SelectValue placeholder="Select elevation preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Elevation</SelectItem>
              <SelectItem value="medium">Medium Elevation</SelectItem>
              <SelectItem value="high">High Elevation</SelectItem>
              <SelectItem value="mixed">Mixed Terrain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TerrainForm;
