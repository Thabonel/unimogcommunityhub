# Supabase Authentication "Invalid API Key" Fix

## The Problem
Users see "Invalid API key" errors when trying to sign in or load profile data, even though the API key in the `.env` file is correct.

## Root Cause
**HARDCODED FALLBACK API KEYS** in the code were overriding the environment variables. When these hardcoded keys become invalid or expired, they cause authentication failures.

## The Solution

### 1. Remove ALL Hardcoded API Keys

**File: `/src/config/env.ts`**
```typescript
// ❌ WRONG - Never use hardcoded fallbacks
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://hardcoded.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGc...',
}

// ✅ CORRECT - Use empty strings as fallback
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}
```

**File: `/src/lib/supabase-client.ts`**
```typescript
// ❌ WRONG - Never use hardcoded fallbacks
const supabaseUrl = SUPABASE_CONFIG.url || 'https://hardcoded.supabase.co';
const supabaseAnonKey = SUPABASE_CONFIG.anonKey || 'eyJhbGc...';

// ✅ CORRECT - Use the config directly
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;
```

### 2. Clear Browser Cache When Error Occurs

Add a cache clearing utility for users:

**File: `/src/utils/auth-reset.ts`**
```typescript
export async function clearAuthTokens() {
  // Clear all Supabase tokens
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Sign out
  await supabase.auth.signOut();
}
```

### 3. Add User-Friendly Error Recovery

Add a "Clear Cache & Reload" button when auth errors occur:

```typescript
<Button 
  variant="destructive" 
  onClick={clearAndReload}
>
  Clear Cache & Reload
</Button>
```

## Why This Happens

1. **Hardcoded keys override env variables** - When you include fallback values, they take precedence if env vars fail to load
2. **Keys expire or rotate** - Supabase may invalidate old keys
3. **Token conflicts** - Browser caches old auth tokens that conflict with new ones
4. **CORS/Security updates** - Supabase may update security policies

## Prevention

### DO NOT:
- ❌ Never hardcode API keys as fallbacks
- ❌ Never commit API keys to version control
- ❌ Never use expired keys as "defaults"

### DO:
- ✅ Always use environment variables
- ✅ Use empty strings as fallbacks
- ✅ Add proper error handling
- ✅ Provide cache clearing options

## Testing the Fix

1. Clear browser cache completely
2. Check `.env` file has correct keys:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```
3. Restart dev server: `npm run dev`
4. Try signing in

## If Issues Persist

1. **Get fresh keys from Supabase:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the `anon` public key (NOT the service role key)
   - Update `.env` file

2. **Clear everything:**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Clear browser data
   # In Chrome: Settings → Privacy → Clear browsing data
   ```

3. **Check Supabase RLS policies:**
   - Ensure Row Level Security policies allow public access where needed
   - Check if auth.users table has proper permissions

## Key Learning

**NEVER use hardcoded API keys as fallbacks.** They will eventually cause authentication issues when they expire or when there are token conflicts. Always rely on environment variables and provide proper error messages when they're missing.