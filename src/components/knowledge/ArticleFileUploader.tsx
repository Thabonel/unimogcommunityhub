import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types/article";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import { sanitizeText, isBinaryContent, isReadableText } from "@/utils/textSanitizer";

// Set the worker source for PDF.js
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

  // Extract text from PDF using PDF.js
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

  // Handle Office documents with improved text extraction
  const extractTextFromOfficeDoc = async (file: File): Promise<string> => {
    try {
      // Try multiple encoding approaches to get the best result
      const encodings = ['utf-8', 'iso-8859-1', 'windows-1252', 'utf-16le'];
      let bestText = '';
      let bestReadabilityScore = 0;
      
      // Try each encoding and keep track of the most readable result
      for (const encoding of encodings) {
        try {
          const text = await readFileAsText(file, encoding);
          const sanitized = sanitizeText(text);
          
          // Score the text for readability (simple heuristic)
          const readableChars = sanitized.replace(/[^a-zA-Z0-9\s.,;:?!'\"\-()]/g, '').length;
          const score = readableChars / sanitized.length;
          
          // If we found a decent result, use it
          if (score > bestReadabilityScore && isReadableText(sanitized)) {
            bestText = sanitized;
            bestReadabilityScore = score;
          }
        } catch (err) {
          // Ignore errors from individual encoding attempts
          console.log(`Error with ${encoding} encoding:`, err);
        }
      }
      
      // If we found readable content with any encoding, return it
      if (bestText && bestReadabilityScore > 0.5) {
        return `Note: This content was extracted from a Word document. Some formatting may be lost.\n\n${bestText}`;
      }
      
      // If we couldn't extract good content, use a robust fallback method for binary files
      return `The document appears to be in a binary format that cannot be fully converted to text.
        
Please consider uploading your document in PDF or plain text format for better results.

[Note: For best results with Word documents, consider converting to PDF first]`;
    } catch (error) {
      console.error('Error processing Office document:', error);
      throw new Error("Could not process the document. Please try converting it to PDF format for best results.");
    }
  };
  
  // Helper to read file as text with specific encoding
  const readFileAsText = (file: File, encoding: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file, encoding);
    });
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
      
      // Handle file based on type
      if (file.type === 'application/pdf') {
        fileType = 'PDF';
        setIsConverting(true);
        
        toast({
          title: "Converting PDF",
          description: "Please wait while we extract text from your PDF...",
        });
        
        content = await extractTextFromPDF(file);
        
        content = "Note: The content below was extracted from a PDF. Table structures have been preserved using | symbols as column separators. You may need to review and format tables manually.\n\n" + content;
      } 
      // Handle Microsoft Office files with improved detection
      else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // .docx
        file.type === 'application/msword' || // .doc
        file.name.toLowerCase().endsWith('.docx') || 
        file.name.toLowerCase().endsWith('.doc') ||
        file.type === 'application/rtf' || // RTF
        file.name.toLowerCase().endsWith('.rtf')
      ) {
        fileType = file.name.toLowerCase().endsWith('.rtf') ? 'RTF Document' : 'Word Document';
        setIsConverting(true);
        
        toast({
          title: `Processing ${fileType}`,
          description: "Please wait while we extract text from your document...",
        });
        
        content = await extractTextFromOfficeDoc(file);
      }
      // Handle regular text files
      else if (
        file.type.includes('text/') || 
        file.type === 'application/json' || 
        file.type === 'text/markdown' || // .md
        file.name.toLowerCase().endsWith('.md') ||
        file.type === 'application/octet-stream' // fallback for unknown types
      ) {
        fileType = 'Text Document';
        const text = await readFileAsText(file, 'utf-8');
        content = sanitizeText(text);
      } else {
        setFileError("Please upload a supported document (PDF, TXT, DOC, DOCX, RTF, MD)");
        return;
      }
      
      // Final check to ensure we have readable content
      if (!content || content.trim().length < 10) {
        throw new Error("Could not extract readable text from the document");
      }
      
      // Set content to the form
      form.setValue("content", content);
      
      if (!form.getValues("title") && file.name) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        form.setValue("title", fileName);
      }

      // Generate excerpt if none exists
      if (!form.getValues("excerpt")) {
        const cleanContent = content.replace(/Note: .+formatting may be lost\.\n\n/g, '');
        const excerpt = cleanContent.slice(0, 150) + (cleanContent.length > 150 ? '...' : '');
        form.setValue("excerpt", excerpt);
      }

      toast({
        title: `${fileType} processed`,
        description: "File content has been loaded successfully",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      setFileError(typeof error === 'object' && error !== null && 'message' in error 
        ? String(error.message) 
        : "Could not process the file. Please try a different file format.");
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
            <p className="text-sm font-medium">Converting document...</p>
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
