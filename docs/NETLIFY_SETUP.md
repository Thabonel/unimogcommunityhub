# Netlify Environment Variables Setup Guide

## ❌ Current Issue
Your staging site is showing "Invalid API key" because Netlify doesn't have the required environment variables configured.

## ✅ Solution - Add Environment Variables to Netlify

### Step 1: Go to Netlify Dashboard
1. Open https://app.netlify.com
2. Select your "UnimogCommunityHub" site
3. Click on "Site configuration" in the left menu
4. Click on "Environment variables"

### Step 2: Add Required Variables
Click "Add a variable" and add each of these:

#### Required Variables:
| Key | Value | Description |
|-----|-------|-------------|
| `VITE_SUPABASE_URL` | `https://ydevatqwkoccxhtejdor.supabase.co` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Get from Supabase Dashboard → Settings → API → Project API keys → anon (public) | Your Supabase anonymous key |
| `VITE_MAPBOX_ACCESS_TOKEN` | Get from Mapbox account | Your Mapbox token |
| `VITE_OPENAI_API_KEY` | Get from OpenAI platform | Your OpenAI API key for Barry AI |

#### Optional Variables:
| Key | Value | Description |
|-----|-------|-------------|
| `VITE_APP_URL` | `https://your-netlify-site.netlify.app` | Your deployed site URL |
| `VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID` | Your Stripe price ID | For premium subscriptions |
| `VITE_STRIPE_LIFETIME_PRICE_ID` | Your Stripe price ID | For lifetime subscriptions |

### Step 3: Get Your Supabase Anon Key
1. Go to https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api
2. Find "Project API keys" section
3. Copy the "anon" (public) key
4. Paste it as the value for `VITE_SUPABASE_ANON_KEY` in Netlify

### Step 4: Deploy Changes
After adding all variables:
1. Click "Save" for each variable
2. Go to "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait for deployment to complete (usually 2-3 minutes)

## 🔍 Verify Setup
Once deployed, visit your staging site and check if:
- Login works without "Invalid API key" error
- Profile page loads correctly
- Barry AI Mechanic responds (if OpenAI key is set)

## 📝 Important Notes
- **NEVER** commit API keys to your git repository
- Always use environment variables for sensitive data
- The `VITE_` prefix is required for Vite to expose variables to the browser
- Make sure there are no spaces or quotes around the values in Netlify

## 🚨 Troubleshooting
If you still see errors after setting variables:
1. Clear your browser cache
2. Try an incognito/private window
3. Check Netlify deploy logs for any build errors
4. Verify the Supabase project is active (not paused)

## 🔐 Security Best Practices
- Use different API keys for development and production
- Regularly rotate your API keys
- Never share your service role key (keep it server-side only)
- Monitor your Supabase usage to detect any unusual activity