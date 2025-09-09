# Deploying to Netlify

This guide will help you deploy the UnimogCommunityHub to Netlify.

## Prerequisites

1. A Netlify account (free at [netlify.com](https://www.netlify.com))
2. Your environment variables ready
3. Git repository already set up

## Method 1: Deploy via Netlify Dashboard (Recommended)

### Step 1: Import from Git

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `Thabonel/unimogcommunityhub`
5. Netlify will auto-detect the build settings from `netlify.toml`

### Step 2: Configure Environment Variables

In Netlify dashboard, go to Site Settings → Environment Variables and add:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required for maps
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token

# Optional - for payments
VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
VITE_STRIPE_LIFETIME_PRICE_ID=price_xxx

# Optional - for development login (don't set in production)
# VITE_ENABLE_DEV_LOGIN=true
# VITE_DEV_MASTER_EMAIL=dev@example.com
# VITE_DEV_MASTER_PASSWORD=devpassword123
```

### Step 3: Deploy

1. Click "Deploy site"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-site-name.netlify.app`

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize Netlify

```bash
# In your project directory
netlify init

# Choose "Create & configure a new site"
# Select your team
# Give your site a name (or leave blank for random)
```

### Step 4: Set Environment Variables

```bash
# Set each variable
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
netlify env:set VITE_MAPBOX_ACCESS_TOKEN "pk.your_mapbox_token"
```

### Step 5: Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or just preview first
netlify deploy
```

## Method 3: Continuous Deployment

Once connected to GitHub, Netlify will automatically deploy:

1. **Production deploys**: Every push to `main` branch
2. **Preview deploys**: Every pull request
3. **Branch deploys**: Other branches (if configured)

## Post-Deployment Checklist

### 1. Test Core Features
- [ ] User registration and login
- [ ] Map functionality
- [ ] File uploads
- [ ] Offline mode
- [ ] Barry AI Chat (requires Supabase Edge Function)

### 2. Configure Custom Domain (Optional)

1. Go to Domain Settings in Netlify
2. Add your custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

### 3. Performance Optimization

Netlify automatically provides:
- ✅ CDN distribution
- ✅ Automatic HTTPS
- ✅ Asset optimization
- ✅ Brotli compression

### 4. Monitor Your Site

1. Check build logs in Netlify dashboard
2. Set up notifications for failed builds
3. Monitor Analytics (if enabled)

## Troubleshooting

### Build Fails

1. Check build logs for errors
2. Ensure all environment variables are set
3. Try building locally first: `npm run build`

### Environment Variables Not Working

1. Redeploy after adding variables
2. Check variable names match exactly
3. No quotes needed in Netlify UI

### 404 Errors on Routes

- The `_redirects` file should handle this
- Verify it exists in the `public` folder
- Check `netlify.toml` redirect rules

### Large Build Times

- Netlify caches dependencies
- First build is slower
- Subsequent builds are faster

## Build Settings Reference

From `netlify.toml`:
- **Base directory**: `/` (root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

## Security Notes

1. Never commit `.env` files
2. Use Netlify environment variables
3. Enable deploy notifications
4. Review deploy previews before merging

## Support

- [Netlify Docs](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
- [Netlify Status](https://www.netlifystatus.com)

Your site is now ready to deploy to Netlify! 🚀