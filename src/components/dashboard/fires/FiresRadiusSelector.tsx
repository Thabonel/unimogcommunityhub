
import { Slider } from '@/components/ui/slider';

interface FiresRadiusSelectorProps {
  radius: number;
  setRadius: (radius: number) => void;
}

export const FiresRadiusSelector = ({ radius, setRadius }: FiresRadiusSelectorProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Search Radius: {radius} km</span>
      </div>
      <Slider
        value={[radius]}
        onValueChange={(values) => setRadius(values[0])}
        min={5}
        max={300}
        step={5}
        className="mt-2"
      />
    </div>
  );
};
