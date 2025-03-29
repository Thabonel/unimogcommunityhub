
import React from "react";
import { Loader2 } from "lucide-react";

interface UploadProgressBarProps {
  isUploading: boolean;
  progress: number;
}

export function UploadProgressBar({ isUploading, progress }: UploadProgressBarProps) {
  if (!isUploading || progress === 0) {
    return null;
  }

  return (
    <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
      <div 
        className="bg-primary h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-muted-foreground mt-1 text-right">
        {progress}% uploaded
      </p>
    </div>
  );
}

export function SubmitButton({ isUploading }: { isUploading: boolean }) {
  return (
    <div className="flex justify-end pt-4">
      <button 
        type="submit" 
        disabled={isUploading}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        {isUploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none size-4 shrink-0"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Submit Manual
          </>
        )}
      </button>
    </div>
  );
}
