# 🚨 URGENT FIX NEEDED: Invalid API Key Error

## Problem Found
The production Netlify site has a **BROKEN API KEY** with spaces in it!

### What's Wrong:
Your production `VITE_SUPABASE_ANON_KEY` has spaces in the middle:
```
BROKEN:  ...ImFub   24iLCJpYX...  ❌ (has spaces)
CORRECT: ...ImFub24iLCJpYX...     ✅ (no spaces)
```

## Fix Instructions (Do This Now!)

1. **Go to Netlify Dashboard** for your PRODUCTION site
2. **Navigate to:** Site Settings → Environment Variables  
3. **Find:** `VITE_SUPABASE_ANON_KEY`
4. **Replace with this correct key** (copy this entire line, no spaces!):
```
<JWT_TOKEN>
```
5. **Click Save**
6. **Go to Deploys tab**
7. **Click:** Trigger deploy → Clear cache and deploy site
8. **Wait** for deployment to complete (2-3 minutes)
9. **Test** login on the production site

## Why This Happened
When copying the API key, spaces were accidentally included, breaking the JWT token format.

## How to Prevent This
- Always copy keys in one selection
- Check for line breaks or spaces
- Use the validation script: `node scripts/validate-env.js`

## Verification
After fixing and redeploying, the login should work immediately. If not:
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for any remaining errors

The staging site already has the correct key, which is why it works!