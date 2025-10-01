# How to Trigger Manual Processing

I've created a complete document chunking system for Barry AI. Here's how to trigger the processing of existing manuals:

## Option 1: Using the Admin Interface (Recommended)

1. **Access the Admin Page**:
   - Go to `http://localhost:5177/admin/manual-processing`
   - You need to be logged in as an admin user

2. **Process Existing Manuals**:
   - Click "Check Files" to see what PDF files are in your manuals storage bucket
   - Click "Process Manuals" to automatically process all unprocessed PDF files
   - Monitor the progress in real-time

## Option 2: Manual API Call

If you prefer to trigger processing manually via API:

```javascript
// Call this from browser console when logged into your app
async function processManual(filename) {
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-manual`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        filename: filename, // e.g., 'UHB-Unimog-Cargo.pdf'
        bucket: 'manuals'
      })
    }
  );
  
  const result = await response.json();
  console.log('Processing result:', result);
}

// Example usage:
// processManual('UHB-Unimog-Cargo.pdf');
```

## What Gets Created

When a manual is processed, the system will:

1. **Extract text** from all PDF pages using LangChain
2. **Create intelligent chunks** (typically 1500 characters with 200 character overlap)
3. **Generate embeddings** using OpenAI's text-embedding-ada-002 model
4. **Store in database** with metadata like:
   - Model codes (U1700, 404, etc.)
   - Year ranges
   - Categories (operator, service, parts, etc.)
   - Page numbers and section titles
5. **Enable Barry's search** - Barry can now reference these manuals with page numbers

## Database Tables Created

The system creates these tables in your Supabase database:

- `manual_metadata` - Stores manual information
- `manual_chunks` - Stores text chunks with vector embeddings
- `processing_errors` - Tracks any processing failures
- `manual_processing_queue` - Queues files for processing

## Verification

After processing, you can verify in the admin interface:
- View processed manuals in the "Processed Manuals" tab
- See chunk counts, page counts, and detected model codes
- Test Barry's knowledge by asking about specific manual content

The system is now ready to make all your technical manuals searchable by Barry AI!