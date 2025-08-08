
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FileUploadErrorProps {
  error: string | null;
}

export function FileUploadError({ error }: FileUploadErrorProps) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
