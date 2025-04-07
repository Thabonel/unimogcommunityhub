
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info, Key, CheckCircle } from 'lucide-react';
import EnvironmentTokenAlert from './EnvironmentTokenAlert';
import { isTokenFormatValid, saveMapboxToken } from '../utils/tokenUtils';
import { toast } from 'sonner';

const formSchema = z.object({
  token: z.string().min(20, {
    message: 'Mapbox token is required and should be at least 20 characters',
  }).refine((val) => isTokenFormatValid(val), {
    message: 'Token should start with "pk." (public key) for browser usage',
  }),
});

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onTokenSave }) => {
  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: '',
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isTokenFormatValid(values.token)) {
      toast.error('Invalid token format. Make sure to use a public token (pk.*) not a secret token (sk.*)', {
        duration: 8000
      });
      return;
    }
    
    // Save token using our standardized function
    saveMapboxToken(values.token);
    
    // Notify success
    toast.success('Mapbox token saved successfully', {
      description: 'The map will now load with your token'
    });
    
    // Call the callback
    onTokenSave(values.token);
  }

  return (
    <Card className="max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5 text-primary" />
          <span>Mapbox Access Token</span>
        </CardTitle>
        <CardDescription>
          Enter your Mapbox public access token to use the map features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <EnvironmentTokenAlert isChecking={false} onValidate={() => {}} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mapbox Token</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="pk.eyJ1..." 
                      {...field} 
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded text-sm flex items-start space-x-2 border border-blue-100 dark:border-blue-800">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-muted-foreground">
                <p className="mb-1">You need a Mapbox account and token to use the map features:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Create a free account at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a></li>
                  <li>Go to your account page and create a new token</li>
                  <li>Make sure it's a <strong>public token</strong> (starts with pk.*)</li>
                  <li>Copy and paste it here</li>
                </ol>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          type="submit" 
          onClick={form.handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Token
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapTokenInput;
