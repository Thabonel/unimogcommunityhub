# Barry Decision Table Acceptance Tests

## Test Queries for Manual Mode (Should Find PDF References)

### Repair/Diagnosis Intent Tests
- "I need to replace the radiator" → **Manual** (Rule 2: repair_diagnosis)
- "How do I fix hydraulic pump noise" → **Manual** (Rule 2: repair_diagnosis)
- "Torque spec for axle bolts" → **Manual** (Rule 2: repair_diagnosis)
- "Radiator leaking—what now?" → **Manual** (Rule 2: repair_diagnosis)
- "Portal hub seals" → **Manual** (Rule 3: vehicle_part)
- "U1700L brake pedal is mushy" → **Manual** (Rule 4: unimog_context)
- "How to bleed the brake system" → **Manual** (Rule 2: repair_diagnosis)
- "Stuck differential lock" → **Manual** (Rule 2: repair_diagnosis)
- "Overheating engine trouble" → **Manual** (Rule 2: repair_diagnosis)
- "Service manual procedure" → **Manual** (Rule 2: repair_diagnosis)

### Vehicle Parts/Systems Tests
- "radiator" → **Manual** (Rule 3: vehicle_part)
- "transmission problems" → **Manual** (Rule 3: vehicle_part)
- "portal hub" → **Manual** (Rule 3: vehicle_part)
- "brake caliper" → **Manual** (Rule 3: vehicle_part)
- "hydraulic pump" → **Manual** (Rule 3: vehicle_part)
- "cooling system" → **Manual** (Rule 3: vehicle_part)
- "power take off" → **Manual** (Rule 3: vehicle_part)
- "differential lock" → **Manual** (Rule 4: unimog_context)

### Unimog Context Tests
- "my Unimog U435" → **Manual** (Rule 4: unimog_context)
- "U1700L specifications" → **Manual** (Rule 4: unimog_context)
- "OM366 engine" → **Manual** (Rule 4: unimog_context)
- "my truck needs service" → **Manual** (Rule 4: unimog_context)

## Test Queries for ChatGPT Mode (Should NOT Search Manuals)

### Non-Technical Intent Tests
- "Tell me a joke" → **ChatGPT** (Rule 1: non_technical)
- "What's the weather like?" → **ChatGPT** (Rule 1: non_technical)
- "How much does a U1700 cost?" → **ChatGPT** (Rule 1: non_technical)
- "How do I reset my password?" → **ChatGPT** (Rule 1: non_technical)
- "Community forum rules" → **ChatGPT** (Rule 1: non_technical)
- "Shipping policy" → **ChatGPT** (Rule 1: non_technical)
- "Account billing issues" → **ChatGPT** (Rule 1: non_technical)

### General/Ambiguous Tests
- "Hello Barry" → **ChatGPT** (Rule 5: default)
- "How are you?" → **ChatGPT** (Rule 1: non_technical)
- "What can you do?" → **ChatGPT** (Rule 5: default)

## Expected Console Logs

### Manual Mode Examples
```
🔧 Technical question detected - Rule: repair_diagnosis, Match: repair_intent
🎯 Calling search_manual_index directly for: I need to replace the radiator
✅ Found 2 manual references
```

### ChatGPT Mode Examples
```
💬 General question detected - Rule: non_technical, Match: general_intent
```

## Telemetry Data Expected

### For Manual Mode Queries
```json
{
  "knowledge_source": "manual_index_direct_repair_diagnosis",
  "routing_rule": "repair_diagnosis",
  "routing_match": "repair_intent",
  "pdf_references_found": 2
}
```

### For ChatGPT Mode Queries
```json
{
  "knowledge_source": "general_non_technical",
  "routing_rule": "non_technical",
  "routing_match": "general_intent",
  "pdf_references_found": 0
}
```

## Pass/Fail Criteria

### ✅ PASS Requirements
- All "Manual Mode" test queries must trigger manual search
- All "ChatGPT Mode" test queries must use general ChatGPT
- Console logs show correct rule matching
- Telemetry data captures routing decisions
- No queries misrouted (false positives/negatives)

### ❌ FAIL Conditions
- Any repair/part query goes to ChatGPT mode
- Any general/joke query triggers manual search
- Missing or incorrect routing rule logging
- No telemetry data captured

## Success Metrics Target
- **≥95% vehicle-technical queries** → Manual mode
- **100% non-technical queries** → ChatGPT mode
- **Zero false positives** for general questions

## Testing Instructions

1. Deploy the updated Edge Function with decision table logic
2. Test each query in the lists above
3. Verify console logs show correct rule matching
4. Check chat_logs table for telemetry data
5. Confirm PDF references appear for Manual mode queries
6. Confirm generic responses for ChatGPT mode queries

This decision table approach should achieve consistent, deterministic routing for Barry's dual-mode operation.