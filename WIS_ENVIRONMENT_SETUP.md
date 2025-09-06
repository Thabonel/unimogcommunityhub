# Workshop Information System (WIS) Environment Setup

## Required Environment Variables

Add these variables to your `.env.local` file:

### Supabase Configuration (Required)
```bash
# Public Supabase URL - used by client-side components
NEXT_PUBLIC_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co

# Public anon key - used by client-side components for authenticated requests
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Service role key - used server-side for admin operations and API routes
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### OpenAI Configuration (Required for Barry AI)
```bash
# OpenAI API key for Barry's AI responses
OPENAI_API_KEY=sk-your_openai_api_key_here
```

## Supabase Database Schema

The WIS system expects these tables and functions to exist in your Supabase database:

### Tables
- `wis_parts` - Parts catalog data
- `wis_procedures` - Repair procedures  
- `wis_bulletins` - Service bulletins
- `wis_documents_unified` - Unified document view
- `wis_chunks` - RAG chunks for search

### RPC Functions
- `wis_search(q text, limit_rows int)` - Full-text search across all documents
- `wis_media_url(bucket text, file_name text, expires_in int)` - Generate signed URLs

### Storage Buckets
- `wis-photos` - Photographs and images
- `wis-diagrams` - Technical diagrams
- `wis-schematics` - Wiring schematics
- `wis-tables` - Data tables and specifications
- `wis-charts` - Charts and graphs

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Set Up Environment Variables**
   - Copy the variables above to your `.env.local` file
   - Replace placeholder values with your actual keys
   - Never commit `.env.local` to version control

3. **Configure Supabase**
   - Ensure your Supabase project has the required tables and functions
   - Set up Row Level Security (RLS) policies for read access
   - Configure storage buckets with appropriate permissions

4. **Test Configuration**
   ```bash
   # Start development server
   npm run dev
   
   # Navigate to /workshop to test the WIS interface
   # Try searching for "oil change" or "brake service"
   # Test Barry chat functionality
   ```

## Security Notes

- **SUPABASE_SERVICE_ROLE_KEY** should only be used server-side (API routes)
- **NEXT_PUBLIC_*** variables are exposed to the client
- Storage buckets should be configured for public read access via signed URLs only
- RLS policies should restrict write access appropriately

## Troubleshooting

### Common Issues

1. **"Invalid API key" errors**
   - Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correctly set
   - Verify the key is valid in your Supabase dashboard

2. **Search returns no results**
   - Ensure `wis_search` RPC function exists and is callable
   - Check that `wis_chunks` table has data
   - Verify RLS policies allow read access

3. **Media not loading**
   - Check that storage buckets exist and have correct names
   - Verify `wis_media_url` RPC function works
   - Ensure bucket permissions allow signed URL generation

4. **Barry not responding**
   - Verify `OPENAI_API_KEY` is valid and has credits
   - Check that the API route `/api/barry` is accessible
   - Review server logs for OpenAI API errors

### Testing API Routes

Test the Barry API directly:
```bash
curl -X POST http://localhost:3000/api/barry \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I change oil in U1700L?", "modelPrefix": "U1700L OM366 435"}'
```

Test document retrieval:
```bash
curl http://localhost:3000/api/wis/document/[doc_id]
```

## Performance Optimization

- Signed URLs are cached for 1 hour by default
- Search results are limited to 40 items for performance
- Media thumbnails are lazy-loaded
- Full documents are only loaded when expanded

## Data Requirements

The WIS system works best with:
- Properly chunked manual content (200-500 words per chunk)
- High-quality media files with descriptive filenames
- Consistent metadata in the `media` JSON fields
- Regular content updates to maintain relevance