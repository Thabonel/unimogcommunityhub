# Barry v65 Test Cases

## Your Original Problem (Now Fixed!)

### Test Case 1: Email Writing with "Unimog" Mention
**Query:**
```
My Unimog broke down, can you write an email to my boss telling him I'll be late?
```

**v64 Result (Broken):** ❌
- Crashed with "Sorry, I had trouble processing your request"
- Edge function returned non-2xx status
- Reason: "Unimog" triggered mechanic mode, then tried to find manual for "email writing"

**v65 Result (Fixed):** ✅
- Writes professional email explaining situation
- Uses general GPT-4o mode
- Intent detected: `non_technical_intent`
- Reason: "write" + "email" keywords override "Unimog" mention

**Expected Response Example:**
```
Subject: Running Late Due to Vehicle Issue

Hi [Boss Name],

I wanted to let you know that my Unimog broke down this morning
and I'm currently dealing with the situation. I'm working on getting
it sorted as quickly as possible, but I'll be late getting to work.

I expect to arrive approximately [time estimate] later than usual.
I apologize for any inconvenience and will make up the time.

Thank you for your understanding.

Best regards,
[Your Name]
```

---

## Technical Questions (Should Work)

### Test Case 2: Portal Hub Repair
**Query:**
```
How do I replace portal hub seals on my U435?
```

**Expected Result:** ✅
- Shows manual references
- PDF: `U435_19_Wheel_Hub_Front.pdf`, Page 1
- Section: "Hub Seal Replacement"
- Mode: `technical`
- Intent: `technical_repair_question`

### Test Case 3: Engine Work
**Query:**
```
What are the steps to remove the engine from my Unimog?
```

**Expected Result:** ✅
- Shows manual references
- PDF: `U435_03_Cylinder_Head.pdf`, Page 35
- Section: "Engine Installation and Removal"
- Includes safety warnings and torque specs

### Test Case 4: Brake Service
**Query:**
```
How to service the hydraulic brakes?
```

**Expected Result:** ✅
- Shows manual references
- PDF: `U435_23_Service_Brakes.pdf`, Page 24
- Section: "Hydraulic Brakes"

---

## General Questions (Should Work)

### Test Case 5: Weather
**Query:**
```
What's the weather going to be like today?
```

**Expected Result:** ✅
- Asks for location or uses provided coordinates
- Gives weather forecast if location available
- Mode: `general`
- Intent: `non_technical_intent`

### Test Case 6: Directions
**Query:**
```
How do I get to the nearest Unimog parts supplier?
```

**Expected Result:** ✅
- Asks for current location
- Suggests searching for suppliers
- General advice about finding parts
- Mode: `general`
- Intent: `non_technical_intent` (keyword: "how do i get")

### Test Case 7: Joke
**Query:**
```
Tell me a joke about Unimogs
```

**Expected Result:** ✅
- Tells a mechanic/Unimog joke
- Maintains Barry's gruff personality
- Mode: `general`
- Intent: `non_technical_intent` (keyword: "joke")

### Test Case 8: Story
**Query:**
```
Tell me a story about your years working on Unimogs
```

**Expected Result:** ✅
- Shares a mechanic story
- Barry's personality shines through
- Mode: `general`
- Intent: `non_technical_intent` (keyword: "story")

---

## Edge Cases (Should Handle Correctly)

### Test Case 9: Ambiguous - Unimog Mention Only
**Query:**
```
I love my Unimog
```

**Expected Result:** ✅
- General friendly response
- No manual references (not a technical question)
- Mode: `general`
- Intent: `default_general`

### Test Case 10: Technical Without "Unimog"
**Query:**
```
How to replace brake pads?
```

**Expected Result:** ✅
- Assumes Unimog (from user profile)
- Shows manual references
- Mode: `technical`
- Intent: `technical_repair_question` (keyword: "replace" + "brake")

### Test Case 11: General with Technical Words
**Query:**
```
Can you write a letter explaining why I need to replace my engine?
```

**Expected Result:** ✅
- Writes a letter (not a repair procedure)
- Mode: `general`
- Intent: `non_technical_intent` (keyword: "write a letter" overrides "replace")

### Test Case 12: Weather with Location
**Query:**
```
What's the weather like?
```
*With location coordinates provided*

**Expected Result:** ✅
- Uses coordinates to give specific weather
- Mode: `general`
- Intent: `non_technical_intent`

---

## Intent Detection Priority

The function checks intents in this order:

1. **Non-Technical First** (Highest Priority)
   - `write`, `email`, `letter`, `compose`, `draft`
   - `weather`, `forecast`, `directions`
   - `joke`, `story`, `advice`
   - `tell my boss`, `late`, `excuse`

2. **Technical Actions + Parts**
   - `replace`, `fix`, `repair`, `install`, `remove`
   - + `engine`, `brake`, `portal hub`, `transmission`, etc.

3. **Default to General** (Lowest Priority)
   - Ambiguous or unclear queries

---

## Rate Limiting Test

### Test Case 13: Rapid Fire
**Query:** Send 20 messages in quick succession

**Expected Result:** ✅
- First 15 messages: Normal responses
- Messages 16-20: "Rate limit exceeded. Please wait a moment."
- Wait 60 seconds, then works again

---

## Error Handling Tests

### Test Case 14: Empty Message
**Query:** *(empty string)*

**Expected Result:** ✅
- Returns: "No user message"
- Status: 400
- Doesn't crash

### Test Case 15: Very Long Message
**Query:** *(5000+ characters)*

**Expected Result:** ✅
- Processes normally
- Response limited to 600 tokens
- Doesn't crash

---

## Logging Verification

After running tests, check `chat_logs` table:

**Query:**
```sql
SELECT
  model,
  knowledge_source,
  routing_rule,
  manual_sections_found,
  created_at
FROM chat_logs
ORDER BY created_at DESC
LIMIT 10;
```

**Expected Columns:**
- `model`: `gpt-4o-intelligent-v65`
- `knowledge_source`: `general` or `technical`
- `routing_rule`: `non_technical_intent`, `technical_repair_question`, or `default_general`
- `manual_sections_found`: 0 for general, 1-5 for technical

---

## Success Criteria

✅ All general questions work (even with "Unimog")
✅ All technical questions show manual references
✅ No crashes or non-2xx errors
✅ Rate limiting works correctly
✅ Logs populate correctly
✅ Barry maintains personality in both modes

## Quick Verification

Run these 3 tests in order:

1. **"My Unimog broke, write email to boss"** → Should write email
2. **"How to replace portal hub seals?"** → Should show manual
3. **"Tell me a joke"** → Should tell a joke

If all 3 pass → ✅ **Barry is working perfectly!**