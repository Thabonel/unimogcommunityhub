# Barry AI Search Workaround


BARRY AI SEARCH WORKAROUND:

Since the search_manual_chunks function has parameter conflicts, Barry should use direct table queries:

Instead of:
  supabaseClient.rpc('search_manual_chunks', {
    query_embedding: embedding,
    match_count: 5,
    match_threshold: 0.7
  })

Use:
  supabaseClient
    .from('manual_chunks')
    .select('id, manual_title, page_number, section_title, content')
    .or(`content.ilike.%${searchKeywords}%,manual_title.ilike.%${searchKeywords}%`)
    .limit(5)
    .order('page_number')

This will work immediately with existing data!
  

## Status
- Manual content: ✅ Available (139 chunks)
- Basic search: ✅ Working
- RPC function: ❌ Parameter conflicts
- Workaround: ✅ Direct table queries work

## Implementation
Update the Barry Edge Function to use direct table queries instead of the RPC function.