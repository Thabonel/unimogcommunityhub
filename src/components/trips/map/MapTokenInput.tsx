
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveMapboxToken } from './mapConfig';
import { Map } from 'lucide-react';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (!token.trim()) return;
    
    setIsSubmitting(true);
    try {
      saveMapboxToken(token.trim());
      onTokenSave(token.trim());
    } catch (err) {
      console.error('Error saving token:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-6 w-6" />
          Map Configuration Required
        </CardTitle>
        <CardDescription>
          Please enter your Mapbox access token to enable map functionality.
          You can get one for free from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After signing up, go to your Mapbox account and copy your default public token from the Access Tokens section.
          </p>
          <Input
            placeholder="pk.eyJ1Ijoi..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="font-mono"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={!token.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Token'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapTokenInput;
