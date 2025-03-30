
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const docsumoApiKey = Deno.env.get("DOCSUMO_API_KEY");
    
    if (!docsumoApiKey) {
      throw new Error("DOCSUMO_API_KEY is not set");
    }

    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      throw new Error("No file provided");
    }

    console.log(`Processing file: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
    
    // Upload the file to Docsumo
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const uploadResponse = await fetch("https://api.docsumo.com/v1/documents/", {
      method: "POST",
      headers: {
        "apikey": docsumoApiKey
      },
      body: uploadFormData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Docsumo upload error:", errorText);
      throw new Error(`Docsumo upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadResult = await uploadResponse.json();
    const docId = uploadResult.data.document_id;
    
    console.log(`Docsumo document ID: ${docId}`);

    // Poll for processing completion
    let processedDocument = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      attempts++;
      
      // Wait 2 seconds between polling attempts
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await fetch(`https://api.docsumo.com/v1/documents/${docId}/`, {
        headers: {
          "apikey": docsumoApiKey
        }
      });
      
      if (!statusResponse.ok) {
        console.error(`Status check failed: ${statusResponse.status} ${statusResponse.statusText}`);
        continue;
      }
      
      const statusResult = await statusResponse.json();
      
      if (statusResult.data.status === "processed") {
        processedDocument = statusResult;
        break;
      } else if (statusResult.data.status === "failed") {
        throw new Error("Document processing failed in Docsumo");
      }
      
      console.log(`Document status: ${statusResult.data.status}, attempt ${attempts}`);
    }

    if (!processedDocument) {
      throw new Error("Document processing timed out");
    }

    // Get the processed document with extracted text
    const downloadResponse = await fetch(`https://api.docsumo.com/v1/documents/${docId}/export/`, {
      headers: {
        "apikey": docsumoApiKey
      }
    });

    if (!downloadResponse.ok) {
      throw new Error(`Failed to download processed document: ${downloadResponse.status} ${downloadResponse.statusText}`);
    }

    const contentType = downloadResponse.headers.get("content-type");
    const result = await downloadResponse.json();

    // Extract the text content in a structured format
    const content = formatDocsumoOutput(result);
    
    return new Response(
      JSON.stringify({
        content,
        success: true
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in convert-pdf function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});

// Helper function to format Docsumo output into structured text
function formatDocsumoOutput(docsumoResult: any): string {
  let formattedContent = "";
  
  // Add document title if available
  if (docsumoResult.title) {
    formattedContent += `# ${docsumoResult.title}\n\n`;
  }
  
  // Process extracted pages
  if (docsumoResult.pages && Array.isArray(docsumoResult.pages)) {
    docsumoResult.pages.forEach((page: any, pageIndex: number) => {
      formattedContent += `## Page ${pageIndex + 1}\n\n`;
      
      // Process tables
      if (page.tables && Array.isArray(page.tables)) {
        page.tables.forEach((table: any, tableIndex: number) => {
          formattedContent += `### Table ${tableIndex + 1}\n\n`;
          
          if (table.rows && Array.isArray(table.rows)) {
            table.rows.forEach((row: any) => {
              if (row.cells && Array.isArray(row.cells)) {
                formattedContent += row.cells.map((cell: any) => cell.text || "").join(" | ");
                formattedContent += "\n";
              }
            });
          }
          
          formattedContent += "\n";
        });
      }
      
      // Process paragraphs/text blocks
      if (page.paragraphs && Array.isArray(page.paragraphs)) {
        page.paragraphs.forEach((para: any) => {
          formattedContent += `${para.text || ""}\n\n`;
        });
      }
    });
  } else if (typeof docsumoResult.text === 'string') {
    // Fallback to plain text if structured data is not available
    formattedContent = docsumoResult.text;
  }
  
  return formattedContent;
}
