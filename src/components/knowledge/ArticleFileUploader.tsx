
import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types/article";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js (used as fallback)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ArticleFileUploaderProps {
  form: UseFormReturn<ArticleFormValues>;
  isConverting: boolean;
  setIsConverting: (value: boolean) => void;
}

export function ArticleFileUploader({ form, isConverting, setIsConverting }: ArticleFileUploaderProps) {
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fallback to PDF.js if Docsumo API fails
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items by their y-position to detect potential table rows
        const lineMap = new Map();
        textContent.items.forEach((item: any) => {
          // Round the y-position to group nearby items (potential table rows)
          const yPos = Math.round(item.transform[5]);
          if (!lineMap.has(yPos)) {
            lineMap.set(yPos, []);
          }
          lineMap.get(yPos).push(item);
        });
        
        // Sort lines by y-position (top to bottom)
        const sortedLines = Array.from(lineMap.entries())
          .sort((a, b) => b[0] - a[0]); // Reverse sort because PDF coords start from bottom
        
        // Process each line
        let pageText = '';
        sortedLines.forEach(([, items]) => {
          // Sort items on the same line by x-position (left to right)
          items.sort((a: any, b: any) => a.transform[4] - b.transform[4]);
          
          // Detect if line might be a table row by checking item spacing
          const isTableRow = items.length > 1 && hasConsistentSpacing(items);
          
          if (isTableRow) {
            // Format as a potential table row with pipe separators
            pageText += items.map((item: any) => item.str).join(' | ');
          } else {
            // Regular text line
            pageText += items.map((item: any) => item.str).join(' ');
          }
          pageText += '\n';
        });
        
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Could not extract text from PDF');
    }
  };
  
  // Helper to detect if items on a line have consistent spacing (potential table)
  const hasConsistentSpacing = (items: any[]): boolean => {
    if (items.length < 3) return false;
    
    const positions = items.map(item => item.transform[4]);
    const gaps = [];
    for (let i = 1; i < positions.length; i++) {
      gaps.push(positions[i] - positions[i-1]);
    }
    
    // Check if most gaps are somewhat consistent
    // First sort gaps and remove outliers
    gaps.sort((a, b) => a - b);
    const medianGap = gaps[Math.floor(gaps.length / 2)];
    
    // Count gaps that are within 20% of median
    const consistentGaps = gaps.filter(gap => 
      Math.abs(gap - medianGap) < medianGap * 0.3
    );
    
    // If more than 60% of gaps are consistent, it might be a table
    return consistentGaps.length >= gaps.length * 0.6;
  };

  // Use Docsumo API to convert PDF to text
  const convertWithDocsumo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data, error } = await supabase.functions.invoke('convert-pdf', {
      body: formData,
    });

    if (error) {
      console.error('Error calling Docsumo conversion:', error);
      throw new Error(`Docsumo conversion failed: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Conversion failed');
    }

    return data.content;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Check file size - limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File too large. Please upload a file smaller than 5MB.");
      return;
    }

    try {
      let content = '';
      let fileType = '';
      
      // Handle PDF files
      if (file.type === 'application/pdf') {
        fileType = 'PDF';
        setIsConverting(true);
        
        toast({
          title: "Converting PDF",
          description: "Please wait while we extract text from your PDF...",
        });
        
        try {
          // Try Docsumo first
          content = await convertWithDocsumo(file);
          toast({
            title: "Enhanced PDF Conversion Complete",
            description: "Your PDF was processed with Docsumo for better table preservation",
          });
        } catch (docsumoError) {
          console.error("Docsumo conversion failed, falling back to PDF.js:", docsumoError);
          
          // Fall back to PDF.js
          toast({
            title: "Using Standard Conversion",
            description: "Falling back to standard PDF extraction",
          });
          content = await extractTextFromPDF(file);
          
          // Add a notice for PDFs about table formatting when using fallback
          content = "Note: The content below was extracted from a PDF. Table structures have been preserved using | symbols as column separators. You may need to review and format tables manually.\n\n" + content;
        }
      } 
      // Handle text files
      else if (file.type.includes('text/') || file.type === 'application/json' || 
          file.type.includes('document') || file.type === 'application/octet-stream') {
        fileType = 'Text Document';
        const reader = new FileReader();
        
        content = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Error reading file'));
          reader.readAsText(file);
        });
      } else {
        setFileError("Please upload a text document (PDF, TXT, DOC, DOCX, RTF, MD)");
        return;
      }
      
      // Set content to the form
      form.setValue("content", content);
      
      if (!form.getValues("title") && file.name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        form.setValue("title", fileName);
      }

      // Generate excerpt if none exists
      if (!form.getValues("excerpt")) {
        const excerpt = content.slice(0, 150) + (content.length > 150 ? '...' : '');
        form.setValue("excerpt", excerpt);
      }

      toast({
        title: `${fileType} processed`,
        description: "File content has been loaded successfully",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      setFileError("Could not process the file. Please try a different file.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div>
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:bg-muted transition-colors flex flex-col items-center justify-center"
        onClick={() => fileInputRef.current?.click()}
      >
        {isConverting ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm font-medium">Converting PDF...</p>
          </div>
        ) : (
          <>
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, TXT, DOC, DOCX, RTF, MD (max 5MB)
            </p>
          </>
        )}
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.txt,.doc,.docx,.rtf,.md,.json"
          disabled={isConverting}
        />
      </div>
      
      {fileError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
