
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveToken = () => {
    if (!token.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    
    // Basic validation - Mapbox tokens are typically at least 60 chars
    if (token.length < 60) {
      toast({
        title: "Invalid Token Format",
        description: "The token you entered doesn't appear to be a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Saving Mapbox token...');
      onTokenSave(token);
      toast({
        title: "Token Saved",
        description: "Your Mapbox token has been saved and will be remembered for future sessions",
      });
    } catch (error) {
      console.error('Error saving token:', error);
      toast({
        title: "Error Saving Token",
        description: "There was a problem saving your token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
          <MapPin className="h-5 w-5" />
          <h3 className="font-medium">Mapbox Token Required</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          To display the interactive map, please enter your Mapbox access token. You can get one for free at{" "}
          <a 
            href="https://account.mapbox.com/auth/signup/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline hover:text-primary"
          >
            mapbox.com
          </a>
        </p>

        <Alert>
          <AlertTitle>How to get a Mapbox token:</AlertTitle>
          <AlertDescription className="text-xs">
            <ol className="list-decimal list-inside space-y-1 mt-1">
              <li>Sign up or sign in at <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a></li>
              <li>Go to your account dashboard</li>
              <li>Under "Access tokens" copy your Default public token</li>
              <li>Paste it in the field below</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Input 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox access token"
            className="w-full font-mono text-xs"
          />
          <Button 
            onClick={handleSaveToken} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Token & Load Map'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MapTokenInput;
