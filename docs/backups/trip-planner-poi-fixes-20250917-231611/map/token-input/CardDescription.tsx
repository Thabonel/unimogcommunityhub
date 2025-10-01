
import { CardDescription as UICardDescription } from '@/components/ui/card';

const CardDescription = () => {
  return (
    <UICardDescription>
      Please enter your Mapbox access token to enable map functionality.
      You can get one for free from{' '}
      <a 
        href="https://mapbox.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-primary hover:underline"
      >
        mapbox.com
      </a>.
    </UICardDescription>
  );
};

export default CardDescription;
