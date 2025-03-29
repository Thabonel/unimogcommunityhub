
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
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Set up the drag and drop event listeners when the component mounts
  const setupDragAndDrop = (element: HTMLDivElement) => {
    if (!element) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if we're leaving the drop zone (not just entering a child element)
      const rect = element.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (
        x < rect.left ||
        x >= rect.right ||
        y < rect.top ||
        y >= rect.bottom
      ) {
        setIsDragging(false);
      }
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        onFileSelected(file);
      }
    };
    
    // Add event listeners directly to the DOM element
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
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
      ref={(el) => {
        if (el && !dropAreaRef.current) {
          dropAreaRef.current = el;
          setupDragAndDrop(el);
        }
      }}
      className={`flex flex-col border-2 border-dashed rounded-md p-6 ${
        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
      } transition-colors text-center hover:bg-muted`}
      onClick={(e) => {
        // Prevent default only if clicking directly on this element
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
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
