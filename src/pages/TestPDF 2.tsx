import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase-client';

export default function TestPDF() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const addResult = (result: string) => {
    console.log(result);
    setTestResults(prev => [...prev, result]);
  };

  const testPdfAccess = async () => {
    setTestResults([]);
    setPdfUrl('');
    
    try {
      // Step 1: List files in bucket
      addResult('Step 1: Listing files in manuals bucket...');
      const { data: files, error: listError } = await supabase
        .storage
        .from('manuals')
        .list();
      
      if (listError) {
        addResult(`❌ Error listing files: ${listError.message}`);
        return;
      }
      
      addResult(`✅ Found ${files?.length || 0} files in bucket`);
      
      if (!files || files.length === 0) {
        addResult('❌ No files found in bucket');
        return;
      }
      
      // Get first PDF file
      const pdfFile = files.find(f => f.name.endsWith('.pdf'));
      if (!pdfFile) {
        addResult('❌ No PDF files found');
        return;
      }
      
      addResult(`✅ Using test file: ${pdfFile.name}`);
      
      // Step 2: Try public URL
      addResult('Step 2: Getting public URL...');
      const { data: publicData } = supabase
        .storage
        .from('manuals')
        .getPublicUrl(pdfFile.name);
      
      if (publicData?.publicUrl) {
        addResult(`✅ Public URL: ${publicData.publicUrl}`);
        
        // Test if URL is accessible
        addResult('Step 3: Testing public URL accessibility...');
        try {
          const response = await fetch(publicData.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            addResult(`✅ Public URL is accessible (Status: ${response.status})`);
            setPdfUrl(publicData.publicUrl);
          } else {
            addResult(`❌ Public URL not accessible (Status: ${response.status})`);
          }
        } catch (fetchError: any) {
          addResult(`❌ Cannot fetch public URL: ${fetchError.message}`);
        }
      }
      
      // Step 4: Try signed URL
      addResult('Step 4: Creating signed URL...');
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from('manuals')
        .createSignedUrl(pdfFile.name, 3600);
      
      if (signedError) {
        addResult(`❌ Error creating signed URL: ${signedError.message}`);
      } else if (signedData?.signedUrl) {
        addResult(`✅ Signed URL created: ${signedData.signedUrl.substring(0, 100)}...`);
        
        // Test signed URL
        addResult('Step 5: Testing signed URL accessibility...');
        try {
          const response = await fetch(signedData.signedUrl, { method: 'HEAD' });
          if (response.ok) {
            addResult(`✅ Signed URL is accessible (Status: ${response.status})`);
            if (!pdfUrl) setPdfUrl(signedData.signedUrl);
          } else {
            addResult(`❌ Signed URL not accessible (Status: ${response.status})`);
          }
        } catch (fetchError: any) {
          addResult(`❌ Cannot fetch signed URL: ${fetchError.message}`);
        }
      }
      
      // Step 6: Check CORS headers
      if (pdfUrl || publicData?.publicUrl) {
        const testUrl = pdfUrl || publicData.publicUrl;
        addResult('Step 6: Checking CORS headers...');
        try {
          const response = await fetch(testUrl, { 
            method: 'GET',
            headers: {
              'Range': 'bytes=0-1024' // Get just first 1KB
            }
          });
          
          const corsHeader = response.headers.get('access-control-allow-origin');
          if (corsHeader) {
            addResult(`✅ CORS header present: ${corsHeader}`);
          } else {
            addResult('⚠️ No CORS headers found (might cause issues)');
          }
          
          // Check content type
          const contentType = response.headers.get('content-type');
          addResult(`📄 Content-Type: ${contentType || 'not set'}`);
          
        } catch (corsError: any) {
          addResult(`❌ CORS check failed: ${corsError.message}`);
        }
      }
      
    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    }
  };

  const testDirectEmbed = () => {
    if (!pdfUrl) {
      addResult('❌ No PDF URL available. Run test first.');
      return;
    }
    
    // Try opening in new tab
    window.open(pdfUrl, '_blank');
    addResult('✅ Opened PDF in new tab. Check if it loads there.');
  };

  return (
    <Layout isLoggedIn={true}>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">PDF Access Test</h1>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testPdfAccess}>Run PDF Access Test</Button>
            <Button onClick={testDirectEmbed} disabled={!pdfUrl}>
              Open PDF in New Tab
            </Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Test Results:</h2>
            <div className="font-mono text-sm space-y-1">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">Click "Run PDF Access Test" to start</p>
              ) : (
                testResults.map((result, i) => (
                  <div key={i}>{result}</div>
                ))
              )}
            </div>
          </div>
          
          {pdfUrl && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">PDF URL (for manual testing):</h3>
                <p className="text-xs break-all font-mono">{pdfUrl}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Embedded iframe test:</h3>
                <iframe 
                  src={pdfUrl}
                  className="w-full h-[600px] border"
                  title="PDF Test"
                />
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Object embed test:</h3>
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-[600px]"
                >
                  <p>PDF cannot be displayed. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
                </object>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}