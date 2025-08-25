# WIS EPC Supabase-First Architecture

## Overview

Instead of running WIS EPC on expensive Windows VPS, we:
1. Extract all WIS EPC data to Supabase (one-time process)
2. Use cheap Linux VPS ($5/month) for processing only
3. Serve content directly from Supabase to users

## Cost Comparison

| Solution | Monthly Cost | Storage | Speed |
|----------|-------------|---------|--------|
| Windows VPS | €34-40 | On VPS | Fast |
| Time4VPS | €14.29 | On VPS | Fast |
| **Supabase + Cheap VPS** | **€5** | Supabase | Good enough |

## Architecture

```
[WIS EPC Data in Supabase]
         ↓
[User Request via Website]
         ↓
[Cheap Linux VPS processes request]
         ↓
[Returns formatted data to user]
```

## Step 1: Database Schema for WIS Content

```sql
-- Main procedures table
CREATE TABLE IF NOT EXISTS public.wis_procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  model TEXT NOT NULL,
  system TEXT NOT NULL,
  subsystem TEXT,
  content TEXT, -- HTML/Markdown content
  steps JSONB, -- Structured steps
  tools_required TEXT[],
  parts_required TEXT[],
  safety_warnings TEXT[],
  time_estimate INTEGER, -- minutes
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parts catalog
CREATE TABLE IF NOT EXISTS public.wis_parts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  part_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  models TEXT[], -- Compatible models
  superseded_by TEXT, -- New part number if replaced
  price DECIMAL(10,2),
  availability TEXT,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Diagrams and images
CREATE TABLE IF NOT EXISTS public.wis_diagrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('wiring', 'exploded', 'schematic', 'photo')),
  procedure_id UUID REFERENCES public.wis_procedures(id) ON DELETE CASCADE,
  part_id UUID REFERENCES public.wis_parts(id) ON DELETE CASCADE,
  file_path TEXT, -- Supabase Storage path
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wiring diagrams
CREATE TABLE IF NOT EXISTS public.wis_wiring (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model TEXT NOT NULL,
  system TEXT NOT NULL,
  diagram_name TEXT NOT NULL,
  svg_content TEXT, -- Store as SVG for interactivity
  connections JSONB, -- Structured wiring data
  components JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Technical bulletins
CREATE TABLE IF NOT EXISTS public.wis_bulletins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bulletin_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  models_affected TEXT[],
  issue_date DATE,
  category TEXT,
  content TEXT,
  priority TEXT CHECK (priority IN ('info', 'recommended', 'mandatory', 'safety')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_wis_procedures_model ON public.wis_procedures(model);
CREATE INDEX idx_wis_procedures_system ON public.wis_procedures(system);
CREATE INDEX idx_wis_parts_models ON public.wis_parts USING GIN(models);
CREATE INDEX idx_wis_parts_part_number ON public.wis_parts(part_number);
CREATE INDEX idx_wis_procedures_search ON public.wis_procedures USING GIN(to_tsvector('english', title || ' ' || content));

-- Full text search function
CREATE OR REPLACE FUNCTION search_wis_content(search_query TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content_type TEXT,
  model TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    'procedure' as content_type,
    p.model,
    ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', search_query)) as relevance
  FROM public.wis_procedures p
  WHERE to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', search_query)
  UNION ALL
  SELECT 
    pt.id,
    pt.description as title,
    'part' as content_type,
    NULL as model,
    ts_rank(to_tsvector('english', pt.description || ' ' || pt.part_number), plainto_tsquery('english', search_query)) as relevance
  FROM public.wis_parts pt
  WHERE to_tsvector('english', pt.description || ' ' || pt.part_number) @@ plainto_tsquery('english', search_query)
  ORDER BY relevance DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

## Step 2: Data Extraction Process

```javascript
// Script to extract WIS EPC data to Supabase
// Run this on a Windows machine with WIS EPC installed

const extractWISData = async () => {
  // 1. Parse WIS EPC database files
  // 2. Convert to structured format
  // 3. Upload to Supabase in batches
  
  // Example for procedures
  const procedures = await parseWISProcedures();
  for (const batch of chunks(procedures, 100)) {
    await supabase.from('wis_procedures').insert(batch);
  }
  
  // Example for parts
  const parts = await parseWISParts();
  for (const batch of chunks(parts, 100)) {
    await supabase.from('wis_parts').insert(batch);
  }
  
  // Upload diagrams to Supabase Storage
  const diagrams = await findAllDiagrams();
  for (const diagram of diagrams) {
    const { data, error } = await supabase.storage
      .from('wis-diagrams')
      .upload(diagram.path, diagram.file);
  }
};
```

## Step 3: Cheap VPS Setup (€5/month)

Use any €5/month Linux VPS:
- DigitalOcean Droplet
- Linode Nanode
- Vultr
- Hetzner CX11

```bash
# Simple Node.js processing server
sudo apt update
sudo apt install nodejs npm nginx

# Create processing API
mkdir wis-processor
cd wis-processor
npm init -y
npm install express @supabase/supabase-js sharp pdf-lib
```

```javascript
// wis-processor/server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Process complex queries
app.get('/api/wis/procedure/:id/pdf', async (req, res) => {
  // Fetch from Supabase
  const { data } = await supabase
    .from('wis_procedures')
    .select('*, wis_diagrams(*)')
    .eq('id', req.params.id)
    .single();
  
  // Generate PDF
  const pdf = await generatePDF(data);
  res.contentType('application/pdf');
  res.send(pdf);
});

// Complex wiring diagram interactions
app.post('/api/wis/wiring/trace', async (req, res) => {
  const { model, component } = req.body;
  
  // Fetch wiring data from Supabase
  const { data } = await supabase
    .from('wis_wiring')
    .select('*')
    .eq('model', model);
  
  // Process connections
  const trace = calculateWiringPath(data, component);
  res.json(trace);
});

app.listen(3000);
```

## Step 4: Frontend Integration

```typescript
// Direct Supabase queries from frontend
const wisService = {
  async searchProcedures(query: string) {
    // Direct to Supabase - no VPS needed
    const { data } = await supabase.rpc('search_wis_content', {
      search_query: query
    });
    return data;
  },
  
  async getProcedure(id: string) {
    // Direct to Supabase
    const { data } = await supabase
      .from('wis_procedures')
      .select('*, wis_diagrams(*), wis_parts(*)')
      .eq('id', id)
      .single();
    return data;
  },
  
  async generatePDF(procedureId: string) {
    // Only this needs VPS
    const response = await fetch(`${VPS_URL}/api/wis/procedure/${procedureId}/pdf`);
    return response.blob();
  }
};
```

## Step 5: Migration Timeline

### Phase 1: Setup (1 week)
1. Create Supabase tables
2. Set up cheap Linux VPS
3. Deploy processing API

### Phase 2: Data Migration (2-4 weeks)
1. Extract procedures from WIS EPC
2. Extract parts catalog
3. Extract and convert diagrams
4. Upload to Supabase Storage

### Phase 3: Testing (1 week)
1. Verify data integrity
2. Test search functionality
3. Optimize queries

### Phase 4: Launch
1. Update frontend to use Supabase
2. Switch off expensive VPS
3. Save €30+/month!

## Benefits

1. **Cost**: €5/month instead of €34-40
2. **Scalability**: Supabase handles unlimited users
3. **Speed**: Data served from Supabase CDN
4. **Reliability**: No Windows crashes, automatic backups
5. **Search**: PostgreSQL full-text search
6. **Mobile**: Works perfectly on phones

## Storage Estimate

- Procedures text: ~500MB
- Parts data: ~200MB  
- Diagrams (compressed): ~5GB
- Total in Supabase: ~6GB (well within limits)

## The VPS Only Handles:

- PDF generation
- Complex diagram processing
- Legacy format conversions
- Batch operations

Everything else is served directly from Supabase!