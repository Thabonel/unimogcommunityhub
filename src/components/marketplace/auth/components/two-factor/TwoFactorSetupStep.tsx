
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorSetupStepProps {
  qrCode: string | null;
  onNext: () => void;
  onBack: () => void;
}

export const TwoFactorSetupStep = ({ qrCode, onNext, onBack }: TwoFactorSetupStepProps) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Scan QR Code</CardTitle>
        <CardDescription className="text-center">
          Scan this QR code with your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {qrCode && (
          <div className="flex justify-center">
            <div className="border-4 border-white bg-white rounded shadow-md p-2 w-64 h-64">
              <img 
                src={qrCode} 
                alt="2FA QR Code"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Can't scan the code?</h4>
          <p className="text-sm text-muted-foreground">
            You can manually enter this setup key in your authenticator app:
          </p>
          <div className="bg-muted p-2 rounded flex items-center justify-between">
            <code className="text-sm">ABCD EFGH IJKL MNOP</code>
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard.writeText("ABCDEFGHIJKLMNOP");
              toast({
                description: "Setup key copied to clipboard",
              });
            }}>
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={onNext}
          className="w-full"
        >
          I've Scanned the QR Code
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};
