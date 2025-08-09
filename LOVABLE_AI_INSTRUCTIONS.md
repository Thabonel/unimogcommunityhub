# Instructions for Lovable AI: Secure Environment Variable Handling

## 🚨 URGENT: Fix "supabaseUrl is required" Error

**This error means environment variables are not set in Lovable.**

### Quick Fix:
1. Go to **Environment Variables** in Lovable settings
2. Add these 4 variables exactly as shown:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
   VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_TOKEN_HERE
   ```
3. **Restart the preview**
4. Error will be fixed ✅

## ⚠️ CRITICAL SECURITY NOTICE

**DO NOT revert to hardcoded API keys under any circumstances.** The current environment variable implementation is correct and secure. Hardcoding API keys triggers GitGuardian security alerts and violates security best practices.

## Current Architecture (CORRECT ✅)

### Environment Variable Configuration
The project uses a secure, centralized configuration system:

```typescript
// src/config/env.ts - This is CORRECT and secure
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID || ''
};

export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  defaultStyle: 'mapbox://styles/mapbox/outdoors-v12',
  defaultCenter: [9.1829, 48.7758] as [number, number],
  defaultZoom: 5
};
```

### Required Environment Variables
```bash
# These must be set in Lovable's environment configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
VITE_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_TOKEN_HERE
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

## How to Fix "Environment Variables Not Set" Error

### In Lovable Platform:
1. Go to Environment Variables settings
2. Add each variable with the exact names and values above
3. Restart the preview

### The Current Code Architecture:
- ✅ Uses `import.meta.env.VITE_*` for all secrets
- ✅ Has proper fallbacks (empty strings) when env vars missing
- ✅ Centralizes configuration in `src/config/env.ts`
- ✅ Includes automatic token synchronization system

## Token Synchronization System

The app includes a sophisticated token management system:

### 1. Automatic Sync on Startup
```typescript
// src/App.tsx - Syncs environment variables to localStorage
syncMapboxTokenToStorage();
```

### 2. Centralized Token Management
```typescript
// src/contexts/MapTokenContext.tsx - Provides app-wide token access
<MapTokenProvider>
  <App />
</MapTokenProvider>
```

### 3. Helper Utilities
```typescript
// src/utils/mapbox-helper.ts - Standardized token operations
getMapboxTokenFromAnySource() // Gets token from env or localStorage
syncMapboxTokenToStorage()    // Syncs env to localStorage
debugMapboxTokenStatus()      // Development debugging
```

## What NOT to Do ❌

```typescript
// SECURITY VIOLATION - Never do this:
export const SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_KEY_HERE', // This triggers GitGuardian alerts!
};
```

## Troubleshooting Steps

### If "supabaseUrl is required" error occurs:

**This is the exact error you're seeing now.** The environment variables are not set in Lovable.

**IMMEDIATE FIX:**
1. In Lovable, go to **Environment Variables** settings
2. Add these exact variables:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
   VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
   VITE_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_TOKEN_HERE
   ```
3. **Restart the preview** (very important!)
4. The error will disappear and the app will work

### If "No environment variables found" error occurs:

1. **Check Lovable Environment Settings**: Ensure all `VITE_*` variables are set
2. **Verify Variable Names**: Must match exactly (case-sensitive)
3. **Restart Preview**: After adding environment variables
4. **Check Browser Console**: Look for debug messages from `debugMapboxTokenStatus()`

### Debug Information Available:
The app includes comprehensive debugging:
```javascript
// Development console output shows:
🗺️ Mapbox Token Debug Status
  Environment Variable (MAPBOX_CONFIG): ✅ Set
  Environment Variable (direct): ✅ Set  
  localStorage (current key): ✅ Set
  Final resolved token: ✅ Available
```

## Security Benefits of Current System

1. **GitGuardian Compliant**: No hardcoded secrets in source code
2. **Environment Isolation**: Different keys for development/production
3. **Automatic Cleanup**: Removes legacy localStorage keys
4. **Fallback Graceful**: App fails safely when env vars missing
5. **Audit Trail**: All token access is logged in development

## Integration Points

### For Map Components:
```typescript
import { MAPBOX_CONFIG } from '@/config/env';
// Token automatically available as MAPBOX_CONFIG.accessToken
```

### For Supabase Operations:
```typescript
import { SUPABASE_CONFIG } from '@/config/env';
// Credentials automatically available in SUPABASE_CONFIG
```

### For Token Management:
```typescript
import { useMapToken } from '@/contexts/MapTokenContext';
// Provides reactive token state throughout the app
```

## Final Notes

- The current implementation is **production-ready** and **security-compliant**
- Environment variables are the **only correct way** to handle secrets
- The token synchronization system ensures **seamless user experience**
- All components are **properly integrated** with the centralized configuration

**Remember**: If environment variables appear "not set", the solution is to set them in Lovable's environment configuration, NOT to revert to hardcoded values.