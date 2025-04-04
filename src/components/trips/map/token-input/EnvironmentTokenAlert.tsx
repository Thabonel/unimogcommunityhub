
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, RefreshCw } from 'lucide-react';

interface EnvironmentTokenAlertProps {
  isChecking: boolean;
  onValidate: () => void;
}

const EnvironmentTokenAlert = ({ isChecking, onValidate }: EnvironmentTokenAlertProps) => {
  return (
    <Alert variant="default" className="mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Info className="h-4 w-4 mr-2" />
          <span className="text-sm">Environment token detected</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onValidate}
          disabled={isChecking}
          className="flex items-center gap-1"
        >
          {isChecking && <RefreshCw className="h-3 w-3 animate-spin" />}
          Test Token
        </Button>
      </div>
    </Alert>
  );
};

export default EnvironmentTokenAlert;
