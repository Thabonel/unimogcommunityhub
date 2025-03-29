
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileDropAreaProps {
  onFileSelected: (file: File) => void;
}

export function FileDropArea({ onFileSelected }: FileDropAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`flex flex-col border-2 border-dashed rounded-md p-6 ${
        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
      } transition-colors text-center hover:bg-muted`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Input 
        type="file" 
        accept=".pdf"
        className="hidden" 
        id="manual-upload"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-2">
        <Upload size={36} className="text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop your PDF here or{" "}
          <Button 
            type="button" 
            variant="link" 
            onClick={handleButtonClick}
            className="p-0 h-auto font-medium"
          >
            browse files
          </Button>
        </p>
        <p className="text-xs text-muted-foreground">
          PDF files only (max 100MB)
        </p>
      </div>
    </div>
  );
}
