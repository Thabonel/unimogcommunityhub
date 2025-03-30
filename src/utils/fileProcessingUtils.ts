
import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';
import { sanitizeText, isBinaryContent, isReadableText } from "@/utils/textSanitizer";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Upload a file to Supabase storage
 * @param file File to upload
 * @param fileName Name to use for the file
 * @param bucketName Storage bucket name
 * @returns The URL of the uploaded file
 */
export const uploadFileToStorage = async (
  file: File,
  fileName: string,
  bucketName: string = 'article_files'
): Promise<{ path: string; url: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return { 
      path: fileName,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to storage');
  }
};

/**
 * Helper to detect if items on a line have consistent spacing (potential table)
 */
export const hasConsistentSpacing = (items: any[]): boolean => {
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
  
  // Count gaps that are within 30% of median
  const consistentGaps = gaps.filter(gap => 
    Math.abs(gap - medianGap) < medianGap * 0.3
  );
  
  // If more than 60% of gaps are consistent, it might be a table
  return consistentGaps.length >= gaps.length * 0.6;
};

/**
 * Extract text from PDF using PDF.js
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
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
    
    return "Note: The content below was extracted from a PDF. Table structures have been preserved using | symbols as column separators. You may need to review and format tables manually.\n\n" + fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Could not extract text from PDF');
  }
};

/**
 * Extract text from DOCX using mammoth.js
 */
export const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use mammoth to convert DOCX to HTML
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    let htmlContent = result.value;
    
    // Check if conversion was successful and we have readable content
    if (htmlContent.length < 20) {
      throw new Error("Could not extract enough content from the document");
    }
    
    // Extract any warnings to help users
    const warnings = result.messages
      .filter(msg => msg.type === 'warning')
      .map(msg => msg.message);
    
    // Create a simple text representation with formatting hints
    let textContent = htmlContent
      // Replace common HTML elements with text formatting
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n## $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '  • $1\n')
      .replace(/<hr[^>]*>/gi, '\n---\n')
      .replace(/<table[^>]*>(.*?)<\/table>/gi, (match) => {
        // Preserve table structure using text-based formatting
        return match
          .replace(/<tr[^>]*>(.*?)<\/tr>/gi, (_, rowContent) => {
            const cells = rowContent.match(/<t[hd][^>]*>(.*?)<\/t[hd]>/gi) || [];
            return cells.map(cell => 
              cell.replace(/<t[hd][^>]*>(.*?)<\/t[hd]>/i, '$1').trim()
            ).join(' | ') + '\n';
          })
          .replace(/<thead[^>]*>.*?<\/thead>/gi, match => match + '\n---\n');
      })
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
      
    // Clean up extra whitespace
    textContent = textContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
      
    // Add any relevant warnings for the user
    let warningText = '';
    if (warnings.length > 0) {
      warningText = '\n\nNote: Some elements may not have converted properly:\n';
      warningText += warnings.slice(0, 3).map(w => `- ${w}`).join('\n');
      if (warnings.length > 3) {
        warningText += `\n- Plus ${warnings.length - 3} more issues`;
      }
    }
    
    return `Note: This content was extracted from a Word document. Some formatting has been preserved.\n\n${textContent}${warningText}`;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    
    // Fall back to the binary method if mammoth fails
    return extractTextFromOfficeDoc(file);
  }
};

/**
 * Handle Office documents with improved text extraction (fallback method)
 */
export const extractTextFromOfficeDoc = async (file: File): Promise<string> => {
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
    
    // If we couldn't extract good content, use a robust fallback message
    return `The document appears to be in a binary format that cannot be fully converted to text.
      
Please consider uploading your document in PDF or plain text format for better results.

[Note: For best results with Word documents, consider converting to PDF first]`;
  } catch (error) {
    console.error('Error processing Office document:', error);
    throw new Error("Could not process the document. Please try converting it to PDF format for best results.");
  }
};

/**
 * Helper to read file as text with specific encoding
 */
export const readFileAsText = (file: File, encoding: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file, encoding);
  });
};

/**
 * Process a file and extract its text content based on file type
 */
export const processFile = async (file: File): Promise<{
  content: string;
  fileType: string;
}> => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Check file size - limit to 5MB
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large. Please upload a file smaller than 5MB.");
  }

  let content = '';
  let fileType = '';
  
  // Handle file based on type
  if (file.type === 'application/pdf') {
    fileType = 'PDF';
    content = await extractTextFromPDF(file);
  } 
  // Handle Microsoft Office files with improved detection
  else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // .docx
    file.name.toLowerCase().endsWith('.docx')
  ) {
    fileType = 'Word Document (DOCX)';
    // Use mammoth.js for DOCX files
    content = await extractTextFromDocx(file);
  }
  // Handle older Word formats and RTF
  else if (
    file.type === 'application/msword' || // .doc
    file.name.toLowerCase().endsWith('.doc') ||
    file.type === 'application/rtf' || // RTF
    file.name.toLowerCase().endsWith('.rtf')
  ) {
    fileType = file.name.toLowerCase().endsWith('.rtf') ? 'RTF Document' : 'Word Document (DOC)';
    // Use fallback method for older formats
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
    throw new Error("Please upload a supported document (PDF, TXT, DOC, DOCX, RTF, MD)");
  }
  
  // Final check to ensure we have readable content
  if (!content || content.trim().length < 10) {
    throw new Error("Could not extract readable text from the document");
  }

  return { content, fileType };
};
