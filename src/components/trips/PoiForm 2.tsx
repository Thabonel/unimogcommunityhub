
import { Label } from '@/components/ui/label';
import { PoiFormProps } from './types';

const PoiForm = ({ selectedPois, handlePoiChange }: PoiFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label>Points of Interest</Label>
        <div className="space-y-2">
          {['campsites', 'fuel', 'repair', 'scenic', 'water'].map((poi) => (
            <div key={poi} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id={poi} 
                className="h-4 w-4 rounded" 
                checked={selectedPois.includes(poi)}
                onChange={() => handlePoiChange(poi)}
              />
              <Label htmlFor={poi}>
                {poi === 'campsites' && 'Off-grid Campsites'}
                {poi === 'fuel' && 'Fuel Stations'}
                {poi === 'repair' && 'Repair Shops'}
                {poi === 'scenic' && 'Scenic Viewpoints'}
                {poi === 'water' && 'Water Crossings'}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoiForm;
