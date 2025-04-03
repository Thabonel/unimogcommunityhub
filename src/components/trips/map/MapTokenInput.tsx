
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  
  const handleSaveToken = () => {
    if (!token.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    
    onTokenSave(token);
    toast({
      title: "Token Saved",
      description: "Your Mapbox token has been saved and will be remembered for future sessions",
    });
  };
  
  return (
    <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
          <MapPin className="h-5 w-5" />
          <h3 className="font-medium">Mapbox Token Required</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Your environment token isn't working. Please enter your Mapbox access token manually. You can get one for free at{" "}
          <a 
            href="https://mapbox.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline hover:text-primary"
          >
            mapbox.com
          </a>
        </p>
        
        <div className="space-y-2">
          <Input 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox access token"
            className="w-full"
          />
          <Button onClick={handleSaveToken} className="w-full">
            Save Token & Load Map
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MapTokenInput;
