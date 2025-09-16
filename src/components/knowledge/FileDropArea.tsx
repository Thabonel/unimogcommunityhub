
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileDropAreaProps {
  onFileSelected: (file: File) => void;
}

export function FileDropArea({ onFileSelected }: FileDropAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Define allowed file types
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/markdown',
      'application/json'
    ];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error(`File type ${file.type} not allowed. Please upload PDF, TXT, DOC, DOCX, RTF, MD, or JSON files.`);
      return false;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error(`File ${file.name} is too large (max 10MB). Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }

    // Additional security check - validate file extension matches MIME type
    const extension = file.name.split('.').pop()?.toLowerCase();
    const typeExtensionMap: Record<string, string[]> = {
      'application/pdf': ['pdf'],
      'text/plain': ['txt'],
      'application/msword': ['doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
      'application/rtf': ['rtf'],
      'text/markdown': ['md'],
      'application/json': ['json']
    };

    const validExtensions = typeExtensionMap[file.type];
    if (validExtensions && extension && !validExtensions.includes(extension)) {
      toast.error(`File extension .${extension} does not match the file type. Please check your file.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div 
      className={`flex flex-col items-center gap-4 border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'} rounded-md p-6 text-center hover:bg-muted transition-colors`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Input 
        type="file" 
        accept=".pdf,.txt,.doc,.docx,.rtf,.md,.json"
        className="hidden" 
        id="manual-upload"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Upload size={36} className="text-muted-foreground" />
      <p className="text-sm font-medium mb-2">Upload your file</p>
      <Button 
        type="button" 
        onClick={handleButtonClick}
        className="w-full md:w-auto"
      >
        <Upload size={16} className="mr-2" /> Select File
      </Button>
      <p className="text-xs text-muted-foreground mt-2">
        PDF, TXT, DOC, DOCX, RTF, MD files supported
      </p>
      {isDragging && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-primary border-dashed rounded-md flex items-center justify-center">
          <p className="text-primary font-medium">Drop file here</p>
        </div>
      )}
    </div>
  );
}
