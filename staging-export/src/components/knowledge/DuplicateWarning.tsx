
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DuplicateWarningProps {
  potentialDuplicates: string[];
}

export function DuplicateWarning({ potentialDuplicates }: DuplicateWarningProps) {
  if (potentialDuplicates.length === 0) return null;
  
  return (
    <Alert variant="warning" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <span className="font-medium">Potential duplicate(s) detected:</span>
        <ul className="mt-1 text-xs">
          {potentialDuplicates.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
        <p className="mt-1 text-xs">
          Please verify this is not a duplicate manual before uploading.
        </p>
      </AlertDescription>
    </Alert>
  );
}
