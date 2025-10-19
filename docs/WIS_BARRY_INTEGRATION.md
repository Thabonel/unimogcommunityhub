# WIS Barry Integration Guide

**Created**: October 13, 2025
**Status**: Ready for Implementation
**Version**: 1.0

---

## Overview

WIS Barry is a dedicated AI assistant for the Workshop Information System (WIS). Unlike Manual Barry (which searches PDF manuals), WIS Barry queries structured workshop procedures directly from the database.

### Architecture

```
┌─────────────────────────────────────────────────┐
│          Two Separate Barry Systems              │
└─────────────────────────────────────────────────┘

1. MANUAL BARRY (Existing)
   ├─ Edge Function: chat-with-barry
   ├─ Data Source: manual_index + manual_chunks (PDF manuals)
   ├─ Purpose: General technical questions from PDF manuals
   ├─ Used In: Knowledge Base, Floating Barry button
   └─ NEW: Refers users to WIS Barry for workshop procedures

2. WIS BARRY (New - This Guide)
   ├─ Edge Function: chat-with-wis-barry
   ├─ Data Source: wis_procedures, wis_systems, wis_components
   ├─ Purpose: Structured workshop procedure queries
   └─ Used In: WIS Interface ONLY
```

---

## Why Two Separate Systems?

### Data Type Differences

**Manual Barry (Unstructured)**:
- Searches: PDF page content (text)
- Returns: Manual sections, page numbers
- Data: Unstructured text from PDFs

**WIS Barry (Structured)**:
- Searches: Database procedures (SQL)
- Returns: Procedure links, metadata
- Data: Structured procedure records

### Response Format Differences

**Manual Barry Response**:
```json
{
  "content": "According to U435 Manual, page 142...",
  "manualReferences": [
    {
      "manual": "U435_Part1.pdf",
      "section": "Cab Structure",
      "pageNumber": 142,
      "content": "...page snippet..."
    }
  ]
}
```

**WIS Barry Response**:
```json
{
  "content": "Right, you want the engine oil change procedure. Here's what you need...",
  "procedures": [
    {
      "id": "uuid",
      "title": "Unimog 400 Series - Engine Oil Change",
      "procedureCode": "PROC_U435_OIL_CHANGE",
      "systemName": "Engine",
      "estimatedTime": 0.75,
      "difficulty": "Easy",
      "link": "/wis/procedures/uuid"
    }
  ]
}
```

### Use Case Differences

**Manual Barry**:
- "How do I lift the cab?" → Searches PDF manual pages
- "What's the cooling system capacity?" → Searches specifications
- General technical questions requiring manual citations

**WIS Barry**:
- "Show me engine procedures for U435" → SQL query for procedures
- "What's the procedure code for oil change?" → Structured data lookup
- "List all transmission procedures" → Database query with filters

---

## Implementation Files

### Edge Function
**Location**: `/supabase/functions/chat-with-wis-barry/index.ts`

**Key Features**:
- Queries `wis_procedures` table directly with SQL
- Joins across `wis_components`, `wis_systems`, `wis_models`
- Returns structured procedure data with metadata
- Includes direct links to WIS interface procedures

### React Hook
**Location**: `/src/hooks/use-wis-barry.ts`

**Interface**:
```typescript
const {
  messages,        // Chat message history
  procedures,      // Array of WIS procedure references
  isLoading,       // Loading state
  error,           // Error message if any
  sendMessage,     // Send a message to WIS Barry
  clearMessages    // Clear chat history
} = useWISBarry(modelCode);
```

**Usage Example**:
```typescript
import { useWISBarry } from '@/hooks/use-wis-barry';

function WISBarryChat() {
  const { messages, procedures, sendMessage, isLoading } = useWISBarry('U435');

  const handleSend = async () => {
    await sendMessage('Show me engine oil change procedure');
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}

      {procedures.length > 0 && (
        <div>
          <h3>Related Procedures:</h3>
          {procedures.map(proc => (
            <a href={proc.link} key={proc.id}>
              {proc.title} ({proc.difficulty}, {proc.estimatedTime}h)
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Manual Barry Referral
**Modified**: `/supabase/functions/chat-with-barry/index.ts`

**Added Detection**:
```typescript
function isWISQuery(query: string): boolean {
  const wisKeywords = [
    'wis', 'workshop information', 'workshop procedure',
    'step by step', 'step-by-step', 'detailed procedure',
    'procedure code', 'service procedure', 'work instruction',
    'torque specification', 'torque spec', 'torque value',
    'special tool', 'required tools', 'parts list',
    'service interval', 'maintenance schedule'
  ];

  const lowerQuery = query.toLowerCase();
  return wisKeywords.some(keyword => lowerQuery.includes(keyword));
}
```

**Referral Response**:
When Manual Barry detects a WIS query, it responds:
```
Listen mate, you're asking about detailed workshop procedures. For that,
you'll want to use WIS Barry - he's got access to the structured Workshop
Information System with step-by-step procedures, torque specs, parts lists,
and all that proper workshop manual stuff.

To access WIS Barry:
1. Go to the WIS (Workshop Information System) section
2. Look for the WIS Barry chat interface there
3. Ask him your question about procedures, torque specs, or tools
```

---

## Frontend Integration

### Where to Add WIS Barry

**WIS Interface Component** (`/src/components/wis/AdvancedWISInterface.tsx`):

```typescript
import { useWISBarry } from '@/hooks/use-wis-barry';

function AdvancedWISInterface() {
  const [showWISBarry, setShowWISBarry] = useState(false);
  const { messages, procedures, sendMessage } = useWISBarry(selectedModel?.model_code);

  return (
    <div>
      {/* Existing WIS interface */}

      {/* Add WIS Barry button */}
      <Button onClick={() => setShowWISBarry(true)}>
        Ask WIS Barry
      </Button>

      {/* WIS Barry chat dialog */}
      {showWISBarry && (
        <Dialog open={showWISBarry} onOpenChange={setShowWISBarry}>
          <DialogContent>
            <DialogTitle>WIS Barry - Workshop Assistant</DialogTitle>

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'user' : 'assistant'}>
                {msg.content}
              </div>
            ))}

            {/* Procedure links */}
            {procedures.map(proc => (
              <Card key={proc.id}>
                <a href={proc.link}>{proc.title}</a>
                <span>{proc.difficulty} • {proc.estimatedTime}h</span>
              </Card>
            ))}

            {/* Input */}
            <Input
              onSend={(text) => sendMessage(text)}
              placeholder="Ask about procedures, tools, or specs..."
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
```

### Manual Barry WIS Referral UI

When Manual Barry detects a WIS query and returns `wisReferral: true`:

```typescript
// In EnhancedBarryChat.tsx or wherever Manual Barry is used:

if (response.wisReferral) {
  // Show special UI with link to WIS interface
  return (
    <div className="wis-referral">
      <p>{response.content}</p>
      <Button asChild>
        <Link to="/wis">
          Go to WIS Interface
        </Link>
      </Button>
    </div>
  );
}
```

---

## Database Schema Requirements

WIS Barry queries these tables:

### wis_procedures
```sql
SELECT
  p.id,
  p.procedure_code,
  p.title,
  p.description,
  p.difficulty_level,
  p.estimated_time_hours,
  p.status
FROM wis_procedures p
WHERE p.status = 'active'
  AND p.title ILIKE '%oil change%'
```

### Full Hierarchy Join
```sql
SELECT
  p.*,
  c.component_name,
  s.system_name,
  m.model_code
FROM wis_procedures p
JOIN wis_components c ON p.component_id = c.id
JOIN wis_systems s ON c.system_id = s.id
JOIN wis_models m ON s.model_id = m.id
WHERE m.model_code = 'U435'
  AND s.system_name ILIKE '%engine%'
```

---

## Testing

### Test WIS Barry Edge Function

```bash
# Test WIS Barry directly
supabase functions invoke chat-with-wis-barry \
  --data '{
    "messages": [
      {"role": "user", "content": "Show me engine procedures for U435"}
    ],
    "modelCode": "U435"
  }'

# Expected response:
# {
#   "content": "Right, you want engine procedures...",
#   "procedures": [
#     {
#       "title": "Engine Oil Change",
#       "procedureCode": "PROC_U435_OIL_CHANGE",
#       "link": "/wis/procedures/uuid"
#     }
#   ]
# }
```

### Test Manual Barry Referral

```bash
# Test referral trigger
supabase functions invoke chat-with-barry \
  --data '{
    "messages": [
      {"role": "user", "content": "I need a detailed step-by-step procedure for oil change"}
    ]
  }'

# Expected response:
# {
#   "content": "Listen mate, you're asking about detailed workshop procedures...",
#   "wisReferral": true
# }
```

### Test Cases

1. **WIS Query Detection**:
   - "Show me workshop procedures" → Refers to WIS Barry ✅
   - "I need torque specifications" → Refers to WIS Barry ✅
   - "What's the WIS code for oil change?" → Refers to WIS Barry ✅

2. **Manual Query (Should NOT Refer)**:
   - "How do I lift the cab?" → Manual Barry searches PDFs ✅
   - "What's in section 5.3 of the manual?" → Manual Barry searches ✅

3. **WIS Barry Procedure Search**:
   - "Show me engine procedures" → Returns engine procedures ✅
   - "List transmission maintenance" → Returns transmission procedures ✅
   - "Oil change for U435" → Returns oil change procedure ✅

---

## Deployment Checklist

### 1. Deploy WIS Barry Edge Function

```bash
# Deploy new edge function
supabase functions deploy chat-with-wis-barry

# Verify deployment
supabase functions list
```

### 2. Update Manual Barry Edge Function

```bash
# Manual Barry already modified with referral logic
supabase functions deploy chat-with-barry

# Test referral
supabase functions invoke chat-with-barry --data '{...}'
```

### 3. Frontend Integration

```bash
# Commit new hook
git add src/hooks/use-wis-barry.ts

# Add WIS Barry to WIS interface
# (Modify AdvancedWISInterface.tsx)

# Deploy to staging
git push staging main:main
```

### 4. Verification

- [ ] WIS Barry edge function deployed
- [ ] Manual Barry referral working
- [ ] Frontend hook installed
- [ ] WIS interface shows Barry button
- [ ] Test queries return correct procedures
- [ ] Procedure links navigate correctly

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic WIS Barry edge function
- ✅ Manual Barry referral logic
- ✅ Frontend hook
- ⏳ WIS interface integration (pending)

### Phase 2 (Next 1-3 Months)
- Advanced filters (difficulty, time, system)
- Procedure comparison ("compare oil change methods")
- Multi-procedure workflows ("what's after oil change?")
- Tool and parts lookup integration

### Phase 3 (Next 6-12 Months)
- Voice input for hands-free workshop use
- Image recognition (show tool, Barry identifies it)
- Procedure tracking (mark steps as complete)
- Community procedure notes/tips

---

## Troubleshooting

### Issue: "No procedures found"
**Cause**: Database empty or search query too specific
**Fix**:
- Check procedures exist: `SELECT COUNT(*) FROM wis_procedures WHERE status = 'active'`
- Broaden search terms

### Issue: "WIS referral not triggering"
**Cause**: Query doesn't match WIS keywords
**Fix**:
- Check `isWISQuery()` function keywords
- Add more keywords if needed
- Test with explicit "wis" or "procedure" terms

### Issue: "Procedures missing metadata"
**Cause**: ETL didn't populate all fields
**Fix**:
- Check `wis_procedures` table has: difficulty_level, estimated_time_hours
- Re-run ETL processor if needed

---

## Related Documentation

- **Barry Evolution**: `/docs/barry/BARRY_EVOLUTION_HISTORY.md`
- **Manual Barry Architecture**: `/docs/barry/BARRY_V85_CURRENT_ARCHITECTURE.md`
- **WIS ETL System**: `/docs/WIS_UPLOAD_WORKFLOW.md`
- **Database Schema**: `/docs/memory/database-schema.md`

---

## Conclusion

WIS Barry provides structured workshop procedure queries optimized for the WIS interface. By separating from Manual Barry, we maintain clean architecture and optimize each system for its specific use case.

**Key Benefits**:
- Clean separation of concerns (structured vs unstructured data)
- Optimized queries (SQL vs text search)
- Better UX (procedure links vs PDF pages)
- Independent evolution (can update without affecting Manual Barry)

**Status**: Ready for frontend integration. Edge functions complete and tested.

---

**Document Version**: 1.0
**Last Updated**: October 13, 2025
**Author**: UnimogCommunityHub Development Team
