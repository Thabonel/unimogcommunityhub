
import { useLocalization } from '@/contexts/LocalizationContext';

interface LocalizedMeasurementProps {
  value: number;
  unit: 'distance' | 'weight' | 'volume';
  className?: string;
  decimalPlaces?: number;
}

export function LocalizedMeasurement({
  value,
  unit,
  className = '',
  decimalPlaces = 1
}: LocalizedMeasurementProps) {
  const { formatMeasurement } = useLocalization();
  
  return (
    <span className={className}>
      {formatMeasurement(value, unit)}
    </span>
  );
}
