
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface FiresRadiusSelectorProps {
  radius: number;
  setRadius: (value: number) => void;
  location?: string;
  setLocation?: (value: string) => void;
}

export const FiresRadiusSelector = ({ 
  radius, 
  setRadius,
  location = 'nsw-australia',
  setLocation
}: FiresRadiusSelectorProps) => {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
        <div className="text-sm font-medium">Search Radius: {radius} km</div>
        <Slider
          className="max-w-[180px]"
          defaultValue={[radius]}
          min={10}
          max={100}
          step={10}
          onValueChange={(values) => setRadius(values[0])}
        />
      </div>
      
      {setLocation && (
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
          <div className="text-sm font-medium">Data Location:</div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Australia</SelectLabel>
                <SelectItem value="nsw-australia">NSW, Australia</SelectItem>
                <SelectItem value="victoria-australia">Victoria, Australia</SelectItem>
                <SelectItem value="queensland-australia">Queensland, Australia</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>United States</SelectLabel>
                <SelectItem value="california-usa">California, USA</SelectItem>
                <SelectItem value="colorado-usa">Colorado, USA</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="germany">Germany</SelectItem>
                <SelectItem value="france">France</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
