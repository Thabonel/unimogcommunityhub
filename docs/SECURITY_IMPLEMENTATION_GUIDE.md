# Security Implementation Guide

**Created**: November 9, 2025
**Status**: ACTION REQUIRED
**Priority**: HIGH

## Overview

This document outlines the security improvements that need to be implemented across the UnimogCommunityHub application, particularly in Edge Functions.

## Current Status

**Security Helpers Created**: ✅
- `/supabase/functions/_shared/rateLimit.ts` - Rate limiting (EXISTS, NOT USED)
- `/supabase/functions/_shared/security.ts` - Security utilities (NEW)
- `/public/_headers` - Security headers (UPDATED)

**Implementation Status**: ❌ NOT APPLIED
- Rate limiting: 0/20+ edge functions use it
- Security validation: 0/20+ edge functions use it
- Input sanitization: Inconsistent
- IDOR protection: Needs verification

---

## Critical Finding

**NONE of the 20+ edge functions are using the rate limiting helper** that was created.

This means:
- ❌ No protection against API abuse
- ❌ No protection against DDoS attacks
- ❌ No protection against credential stuffing
- ❌ Barry AI can be spammed (expensive OpenAI calls)
- ❌ No limits on file uploads
- ❌ No limits on email sending

---

## Phase 1: Edge Function Security (IMMEDIATE)

### Priority Edge Functions to Secure

1. **chat-with-barry** (CRITICAL)
   - Current: No rate limiting
   - Risk: Expensive OpenAI API abuse
   - Cost Impact: $0.012 per query × unlimited = $$$$

2. **chat-with-barry-agentic** (CRITICAL)
   - Current: No rate limiting
   - Risk: Same as above

3. **create-checkout** (HIGH)
   - Current: No rate limiting
   - Risk: Payment system abuse

4. **manual-upload-trigger** (HIGH)
   - Current: No rate limiting
   - Risk: Storage abuse

5. **generate-embeddings** (MEDIUM)
   - Current: No rate limiting
   - Risk: OpenAI embedding API abuse

---

## Implementation Steps

### Step 1: Add Rate Limiting to chat-with-barry

**File**: `/supabase/functions/chat-with-barry/index.ts`

**Add imports** (top of file):
```typescript
import { rateLimiters, applyRateLimit } from '../_shared/rateLimit.ts';
import { getUserIdFromAuth, getClientIP, logSecurityEvent } from '../_shared/security.ts';
```

**Add at start of handler** (before processing):
```typescript
Deno.serve(async (req) => {
  // Get user authentication
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! }
      }
    }
  );

  const { userId, error: authError } = await getUserIdFromAuth(req, supabaseClient);

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(userId, rateLimiters.chat);
  if (rateLimitResponse) {
    // Log rate limit event
    await logSecurityEvent({
      type: 'rate_limit',
      userId,
      ip: getClientIP(req),
      userAgent: req.headers.get('user-agent') || 'unknown',
      details: { endpoint: 'chat-with-barry' },
      severity: 'medium'
    }, supabaseAdmin);

    return rateLimitResponse; // 429 Too Many Requests
  }

  // Continue with existing logic...
});
```

---

### Step 2: Add to All Edge Functions

**Template for all edge functions**:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { rateLimiters, applyRateLimit } from '../_shared/rateLimit.ts';
import {
  getUserIdFromAuth,
  getClientIP,
  logSecurityEvent,
  sanitizeInput
} from '../_shared/security.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Get user authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! }
        }
      }
    );

    const { userId, error: authError } = await getUserIdFromAuth(req, supabaseClient);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Apply rate limiting (choose appropriate limiter)
    const rateLimitResponse = await applyRateLimit(userId, rateLimiters.general);
    if (rateLimitResponse) {
      return new Response(rateLimitResponse.body, {
        status: rateLimitResponse.status,
        headers: { ...corsHeaders, ...Object.fromEntries(rateLimitResponse.headers) }
      });
    }

    // 3. Parse and sanitize input
    const body = await req.json();
    const sanitizedInput = sanitizeInput(body.userInput, 1000);

    // 4. Your function logic here...

    // 5. Return response
    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[Function Error]', error);

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

---

### Step 3: Choose Appropriate Rate Limiters

**Rate Limiter Selection Guide**:

| Function Type | Rate Limiter | Limit | Window |
|---------------|--------------|-------|--------|
| AI Chat (Barry) | `rateLimiters.chat` | 10 requests | 1 minute |
| Manual Processing | `rateLimiters.manualProcessing` | 20 requests | 1 minute |
| File Uploads | `rateLimiters.upload` | 10 uploads | 5 minutes |
| Email Sending | `rateLimiters.email` | 5 emails | 5 minutes |
| General API | `rateLimiters.general` | 100 requests | 1 minute |

**Functions and Their Limiters**:

```typescript
// AI/Chat Functions
chat-with-barry          → rateLimiters.chat
chat-with-barry-agentic  → rateLimiters.chat
chat-with-wis-barry      → rateLimiters.chat
ai-router                → rateLimiters.chat

// Manual Processing
manual-upload-trigger    → rateLimiters.upload
process-all-manuals      → rateLimiters.manualProcessing
extract-manual-images    → rateLimiters.manualProcessing
generate-embeddings      → rateLimiters.manualProcessing
generate-wis-embeddings  → rateLimiters.manualProcessing

// Payment Functions
create-checkout          → rateLimiters.general (strict validation more important)
customer-portal          → rateLimiters.general

// Admin Functions
admin-users              → rateLimiters.general
admin-rps-synonyms       → rateLimiters.general

// General Functions
fetch-rss-feeds          → rateLimiters.general
fetch-wikipedia          → rateLimiters.general
barry-simple-search      → rateLimiters.general
canonical-search         → rateLimiters.general
```

---

## Phase 2: IDOR Protection (HIGH PRIORITY)

### What is IDOR?

Insecure Direct Object Reference - when users can access resources they don't own by manipulating IDs.

### Example Vulnerability

```typescript
// VULNERABLE CODE
async function deleteVehicle(vehicleId: string) {
  return supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId); // Anyone can delete any vehicle!
}
```

### Secure Implementation

```typescript
// SECURE CODE
async function deleteVehicle(vehicleId: string, userId: string) {
  // 1. Verify ownership
  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('owner_id')
    .eq('id', vehicleId)
    .single();

  if (!vehicle || vehicle.owner_id !== userId) {
    throw new Error('Forbidden: Not vehicle owner');
  }

  // 2. Delete with ownership check
  return supabase
    .from('vehicles')
    .delete()
    .eq('id', vehicleId)
    .eq('owner_id', userId); // Double-check with RLS
}
```

### Files to Review for IDOR

Run this check:
```bash
grep -r "\.delete()\|\.update()" src/services/ --include="*.ts" -A 3 -B 3
```

**High-Risk Operations**:
- Vehicle deletion/update
- Trip deletion/update
- Marketplace listing deletion/update
- User profile updates
- File uploads/deletions

**Action Required**:
1. Audit all delete/update operations
2. Verify ownership checks exist
3. Add ownership verification before RLS
4. Test with different user accounts

---

## Phase 3: XSS Protection

### Dangerous Patterns to Find

```bash
# Find dangerous HTML rendering
grep -r "dangerouslySetInnerHTML" src/ --include="*.tsx"

# Find innerHTML usage
grep -r "innerHTML\|outerHTML" src/ --include="*.tsx"
```

### Safe Implementation

```typescript
import DOMPurify from 'isomorphic-dompurify';

// OPTION 1: Sanitize HTML
function UserContent({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a'],
    ALLOWED_ATTR: ['href'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?):\/\/)/i
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// OPTION 2: Avoid HTML entirely (PREFERRED)
function UserContent({ text }: { text: string }) {
  return <div className="whitespace-pre-wrap">{text}</div>;
}
```

### Components to Review

- Forum posts
- User comments
- Marketplace descriptions
- User bio/profiles
- Trip descriptions

---

## Phase 4: Input Validation

### Implement Zod Schemas

**Install** (if not already):
```bash
npm install zod validator
```

**Example Schema**:
```typescript
import { z } from 'zod';
import validator from 'validator';

const VehicleListingSchema = z.object({
  model: z.string()
    .min(2, 'Model too short')
    .max(50, 'Model too long')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid characters'),

  year: z.number()
    .int()
    .min(1950, 'Year too old')
    .max(new Date().getFullYear(), 'Future year not allowed'),

  price: z.number()
    .positive('Price must be positive')
    .max(10000000, 'Price too high'),

  description: z.string()
    .max(5000, 'Description too long')
    .transform(text => validator.escape(text)),

  vin: z.string()
    .length(17, 'Invalid VIN length')
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format')
    .optional()
});

// Usage
function handleSubmit(formData: unknown) {
  try {
    const validated = VehicleListingSchema.parse(formData);
    // Proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: error.errors };
    }
    throw error;
  }
}
```

### Forms to Add Validation

- [ ] Vehicle listing form
- [ ] Trip creation form
- [ ] Marketplace item form
- [ ] User profile form
- [ ] Contact/email forms

---

## Phase 5: Security Logging

### Create Security Logs Table

**Migration**: `supabase/migrations/[timestamp]_create_security_logs.sql`

```sql
CREATE TABLE IF NOT EXISTS public.security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  ip_address text,
  user_agent text,
  details jsonb DEFAULT '{}'::jsonb,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now()
);

-- Index for querying
CREATE INDEX idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at DESC);
CREATE INDEX idx_security_logs_severity ON public.security_logs(severity);

-- RLS Policies
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read security logs
CREATE POLICY "Admins can read security logs"
  ON public.security_logs
  FOR SELECT
  USING (check_admin_access());

-- System (service role) can insert logs
CREATE POLICY "System can insert security logs"
  ON public.security_logs
  FOR INSERT
  WITH CHECK (true);
```

### Events to Log

**Critical Events**:
- Failed login attempts
- Rate limit violations
- Admin access
- Data exports
- Account deletions

**Medium Events**:
- Successful logins
- Password resets
- Profile updates
- Payment transactions

**Low Events**:
- API usage
- File uploads
- Search queries

---

## Testing Checklist

### Security Testing

- [ ] Test rate limiting (make 11+ requests in 1 minute)
- [ ] Test IDOR protection (try accessing other users' resources)
- [ ] Test XSS (try injecting `<script>alert('XSS')</script>`)
- [ ] Test SQL injection (try `' OR '1'='1`)
- [ ] Test CSRF (make request from different origin)
- [ ] Test file upload validation (try uploading .exe file)
- [ ] Test authentication bypass (try requests without token)
- [ ] Test admin-only endpoints (try as non-admin user)

### Automated Tests

```typescript
// security.test.ts
describe('Security Tests', () => {
  it('should prevent SQL injection', async () => {
    const malicious = "'; DROP TABLE users; --";
    const result = await searchVehicles(malicious);
    expect(result).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('should sanitize XSS attempts', () => {
    const malicious = '<script>alert("XSS")</script>';
    const result = sanitizeInput(malicious);
    expect(result).not.toContain('<script>');
  });

  it('should enforce rate limits', async () => {
    const requests = Array(11).fill(null).map(() =>
      fetch('/functions/v1/chat-with-barry', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
    );
    const results = await Promise.all(requests);
    const rateLimited = results.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  it('should prevent IDOR attacks', async () => {
    const otherUserId = 'other-user-id';
    const myUserId = 'my-user-id';

    // Try to delete other user's vehicle
    const result = await deleteVehicle('vehicle-id', myUserId);
    expect(result.error).toBe('Forbidden: Not vehicle owner');
  });
});
```

---

## Rollout Plan

### Week 1: Core Security
- [ ] Day 1-2: Implement rate limiting on critical functions (Barry, checkout)
- [ ] Day 3-4: Add security logging infrastructure
- [ ] Day 5: Test and deploy to staging

### Week 2: IDOR & Validation
- [ ] Day 1-2: Audit and fix IDOR vulnerabilities
- [ ] Day 3-4: Add Zod validation to forms
- [ ] Day 5: Test and deploy to staging

### Week 3: XSS & Hardening
- [ ] Day 1-2: Audit and fix XSS vulnerabilities
- [ ] Day 3-4: Add DOMPurify to user content
- [ ] Day 5: Final security review and deploy

### Week 4: Monitoring & Documentation
- [ ] Day 1-2: Set up security monitoring dashboards
- [ ] Day 3-4: Document security procedures
- [ ] Day 5: Security training and review

---

## Monitoring & Alerts

### Key Metrics to Track

1. **Rate Limit Events**
   - Threshold: > 10 per hour from single user
   - Action: Alert admin, potentially ban IP

2. **Failed Auth Attempts**
   - Threshold: > 5 per hour from single IP
   - Action: Temporary IP block

3. **Admin Access**
   - Threshold: Any admin access
   - Action: Log and notify

4. **Unusual API Usage**
   - Threshold: > 1000 requests per day from single user
   - Action: Review and investigate

### Supabase Dashboard Queries

```sql
-- Rate limit violations in last 24h
SELECT
  user_id,
  ip_address,
  COUNT(*) as violation_count
FROM security_logs
WHERE event_type = 'rate_limit'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id, ip_address
ORDER BY violation_count DESC;

-- Failed auth attempts by IP
SELECT
  ip_address,
  COUNT(*) as attempt_count,
  MAX(created_at) as last_attempt
FROM security_logs
WHERE event_type = 'auth_failure'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) >= 5;

-- Critical security events
SELECT *
FROM security_logs
WHERE severity = 'critical'
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## Emergency Response

### If Security Breach Detected

1. **Immediate Actions**
   - Disable affected edge function
   - Revoke compromised API keys
   - Alert user if data exposed

2. **Investigation**
   - Review security logs
   - Identify attack vector
   - Assess data exposure

3. **Remediation**
   - Patch vulnerability
   - Force password resets if needed
   - Update security measures

4. **Communication**
   - Notify affected users
   - Document incident
   - Implement prevention measures

---

## Success Criteria

Security implementation is complete when:

- [ ] All 20+ edge functions have rate limiting
- [ ] All edge functions validate user authentication
- [ ] All delete/update operations check ownership
- [ ] All user input is validated with Zod
- [ ] All user-generated content is sanitized
- [ ] Security logging is capturing events
- [ ] Automated security tests are passing
- [ ] Security dashboard is monitoring key metrics
- [ ] npm audit shows 0 high/critical vulnerabilities
- [ ] Security headers are deployed

---

## Next Steps

1. **Read this guide thoroughly**
2. **Prioritize edge functions** (start with Barry)
3. **Implement rate limiting** (highest impact)
4. **Test on staging**
5. **Monitor for 48 hours**
6. **Deploy to production**
7. **Continue with IDOR and XSS fixes**

**Estimated Total Effort**: 3-4 weeks
**Highest Impact**: Rate limiting (Week 1)
