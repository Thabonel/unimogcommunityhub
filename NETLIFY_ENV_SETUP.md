# URGENT: Netlify Environment Variables Setup

## Problem
The deployed sites (main and staging) show "Invalid API key" because **environment variables are not set in Netlify**.

## Solution

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com
- Find your site: `unimogcommunityhub`

### 2. Add Environment Variables
Go to: **Site Settings** → **Environment Variables** → **Add Variable**

Add these **EXACT** variables:

```
VITE_SUPABASE_URL = https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY = <SUPABASE_ANON_KEY>
```

**Important**: Make sure the variable names are EXACTLY as shown above (including `VITE_` prefix)

### 3. Redeploy
After adding the environment variables:
- Go to **Deploys** tab
- Click **Trigger Deploy** → **Deploy Site**

### 4. Check Browser Console
After deployment, open the browser console and look for:
```
🔍 Supabase Client Initialization: {
  envVarsPresent: {
    VITE_SUPABASE_URL: true,    // Should be true
    VITE_SUPABASE_ANON_KEY: true // Should be true
  }
}
```

## Why This Happened
When I removed the hardcoded API keys (which were causing auth conflicts), the deployed sites had no fallback and were getting empty strings for the Supabase configuration.

## Current Status
- ✅ **Local Development**: Working (uses .env file)
- ❌ **Staging**: Missing env vars in Netlify
- ❌ **Production**: Missing env vars in Netlify

Once you add the environment variables and redeploy, both staging and production will work correctly.