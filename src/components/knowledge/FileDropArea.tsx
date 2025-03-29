
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropAreaProps {
  onFileSelected: (file: File) => void;
}

export function FileDropArea({ onFileSelected }: FileDropAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
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

  // Add an onClick handler to prevent default browser behavior when clicking on the drop area
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only prevent default if the click is directly on the drop area div
    // and not on any child buttons
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
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
      onClick={handleClick}
    >
      <Input 
        type="file" 
        accept=".pdf,.txt,.doc,.docx,.rtf,.md"
        className="hidden" 
        id="manual-upload"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-2">
        <Upload size={36} className="text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag and drop your file here or{" "}
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
          PDF, TXT, DOC, DOCX, RTF, MD files only
        </p>
      </div>
    </div>
  );
}
