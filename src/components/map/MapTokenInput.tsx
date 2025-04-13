
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InfoCircle, MapPin, HelpCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useMapToken } from '@/contexts/MapTokenContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapTokenInputProps {
  onClose?: () => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onClose }) => {
  const [tokenInput, setTokenInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { setToken, isTokenValid } = useMapToken();

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenInput.trim()) return;
    
    setIsSubmitting(true);
    await setToken(tokenInput.trim());
    setIsSubmitting(false);
    
    if (onClose && isTokenValid) {
      onClose();
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <CardTitle>Mapbox Token Required</CardTitle>
        </div>
        <CardDescription>
          Please enter your Mapbox public access token to enable map functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="Enter pk.eyJ1..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="font-mono text-sm"
              required
            />
          </div>
          
          <Alert variant="info" className="bg-blue-50 text-blue-700 border-blue-200">
            <InfoCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your Mapbox token starts with "pk." and can be found in your Mapbox account dashboard.
            </AlertDescription>
          </Alert>
          
          <div className="text-xs text-muted-foreground space-y-2 mt-4">
            <p className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> Don't have a Mapbox account?
            </p>
            <a
              href="https://account.mapbox.com/auth/signup/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Sign up for free <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" onClick={handleTokenSubmit} disabled={isSubmitting || !tokenInput.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Save Token & Load Map'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapTokenInput;
