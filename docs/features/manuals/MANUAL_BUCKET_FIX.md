# Fix for PDF Manual Loading Issues

## Problem
PDFs in the Vehicle Manuals section fail to load with error: "Failed to load PDF document. Please check the URL and try again."

## Root Causes
1. **CORS Issues**: Signed URLs from Supabase may have CORS restrictions
2. **Bucket Permissions**: The 'manuals' bucket might not have proper RLS policies
3. **PDF.js Configuration**: Need to handle CORS-related loading issues

## Solutions Implemented

### 1. Enhanced Error Handling
- Added detailed logging to track URL generation
- Improved error messages to identify specific issues (CORS, 404, invalid PDF)
- Added URL validation before attempting to load

### 2. Multiple URL Strategies
- Created fallback mechanism: signed URL → public URL
- Extended signed URL expiry from 15 to 60 minutes
- Added direct public URL access as last resort

### 3. PDF.js CORS Configuration
- Disabled range requests to avoid CORS issues
- Disabled streaming to prevent partial content problems
- Added withCredentials: false for cross-origin requests

## Manual Supabase Configuration Required

To fully fix the issue, you need to update the bucket permissions in Supabase:

### Option 1: Make Manuals Bucket Public (Easiest)
1. Go to Supabase Dashboard → Storage
2. Click on 'manuals' bucket
3. Click "Edit bucket" 
4. Toggle "Public bucket" to ON
5. Save changes

### Option 2: Add RLS Policy (More Secure)
Run this SQL in Supabase SQL Editor:

```sql
-- Allow authenticated users to read manuals
CREATE POLICY "Allow authenticated users to read manuals"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'manuals');

-- Allow public read access to manuals (if you want public access)
CREATE POLICY "Allow public to read manuals"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'manuals');
```

## Testing Steps

1. Open browser console (F12)
2. Navigate to Vehicle Manuals page
3. Click on a PDF to view
4. Check console for:
   - "Getting signed URL for manual: [filename]"
   - "Generated signed URL: [url]"
   - "Loading PDF from URL: [url]"
   - Any error messages

## Expected Console Output

### Success Case:
```
Getting signed URL for manual: example.pdf
Bucket verification result: {success: true}
Generated signed URL: https://[project].supabase.co/storage/v1/...
Loading PDF from URL: https://[project].supabase.co/storage/v1/...
PDF loaded successfully, pages: 10
```

### Failure with Fallback:
```
Getting signed URL for manual: example.pdf
Signed URL failed, trying public URL as fallback
Using direct public URL as fallback: https://[project].supabase.co/storage/v1/object/public/...
```

## Files Modified

1. `/src/components/knowledge/pdf-viewer/usePdfLoader.ts`
   - Enhanced error handling
   - Added CORS configuration options
   - Better logging

2. `/src/services/manuals/fetchManuals.ts`
   - Extended signed URL expiry
   - Added detailed logging

3. `/src/services/manuals/getPublicUrl.ts` (NEW)
   - Created fallback URL generation
   - Public URL as alternative to signed URLs

4. `/src/hooks/manuals/use-manuals.ts`
   - Implemented fallback strategy
   - Multiple URL attempts

## Next Steps

1. **Check Supabase bucket settings** - Ensure 'manuals' bucket is either public or has proper RLS policies
2. **Upload test PDFs** - Make sure PDFs exist in the bucket
3. **Monitor console logs** - Watch for specific error messages
4. **Clear browser cache** - Sometimes old CORS headers are cached

## Alternative Solution

If CORS issues persist, consider:
1. Proxying PDF requests through your backend
2. Using a CDN to serve PDFs
3. Storing PDFs in a public bucket with unique/obscured filenames for security