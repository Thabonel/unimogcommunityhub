
import { useLocalization } from '@/contexts/LocalizationContext';

interface LocalizedDateTimeProps {
  date: Date | string | number;
  format?: 'date' | 'time' | 'datetime';
  className?: string;
}

export function LocalizedDateTime({
  date,
  format = 'date',
  className = ''
}: LocalizedDateTimeProps) {
  const { formatDate, formatTime } = useLocalization();
  
  let formattedValue = '';
  
  switch (format) {
    case 'date':
      formattedValue = formatDate(date);
      break;
    case 'time':
      formattedValue = formatTime(date);
      break;
    case 'datetime':
      formattedValue = `${formatDate(date)} ${formatTime(date)}`;
      break;
    default:
      formattedValue = formatDate(date);
  }
  
  return (
    <time className={className}>
      {formattedValue}
    </time>
  );
}
