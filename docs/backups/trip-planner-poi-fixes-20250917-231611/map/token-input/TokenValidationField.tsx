
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface TokenValidationFieldProps {
  token: string;
  onTokenChange: (token: string) => void;
  validationStatus: 'idle' | 'validating' | 'valid' | 'invalid';
  validationMessage: string;
  onValidate: () => void;
}

const TokenValidationField = ({
  token,
  onTokenChange,
  validationStatus,
  validationMessage,
  onValidate
}: TokenValidationFieldProps) => {
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTokenChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="pk.eyJ1Ijoi..."
          value={token}
          onChange={handleTokenChange}
          className="font-mono flex-1"
        />
        <Button 
          variant="outline" 
          onClick={onValidate}
          disabled={!token.trim() || validationStatus === 'validating'}
        >
          {validationStatus === 'validating' ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : 'Validate'}
        </Button>
      </div>
      
      {validationStatus !== 'idle' && (
        <Alert variant={validationStatus === 'valid' ? 'default' : 'destructive'}>
          {validationStatus === 'valid' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {validationMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TokenValidationField;
