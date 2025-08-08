
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropAreaProps {
  onFileSelected: (file: File) => void;
}

export function FileDropArea({ onFileSelected }: FileDropAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
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
      onFileSelected(e.dataTransfer.files[0]);
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
