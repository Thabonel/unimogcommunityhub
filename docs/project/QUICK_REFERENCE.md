# Quick Reference Guide

## 🚨 Emergency Fixes

### Site is Down
1. Check Netlify dashboard for build errors
2. Verify environment variables in Netlify
3. Check Supabase service status
4. See [`troubleshooting/TROUBLESHOOTING.md`](troubleshooting/TROUBLESHOOTING.md)

### Authentication Issues
- Invalid API key → Check [`authentication/AUTH_ERROR_PREVENTION.md`](authentication/AUTH_ERROR_PREVENTION.md)
- Login loops → See [`authentication/SUPABASE_AUTH_FIX.md`](authentication/SUPABASE_AUTH_FIX.md)
- Session errors → Review [`authentication/auth-recovery-system.md`](authentication/auth-recovery-system.md)

### Component Rendering Issues
- Double rendering → Check for Layout wrapping issues
- Flashing pages → See [`troubleshooting/2025-08-23-profile-accountsettings-fix.md`](troubleshooting/2025-08-23-profile-accountsettings-fix.md)
- Infinite loops → Check useEffect dependencies

## 🛠️ Common Tasks

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Git Workflow
```bash
# Always work on staging branch
git checkout staging-restore-complete

# Commit with proper format
git add -A
git commit -m "type: description

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to staging only
git push staging staging-restore-complete:main

# NEVER push to production without permission
# git push origin main  # DON'T DO THIS
```

### Database Operations
```sql
-- Check if table exists
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'your_table';

-- Make user admin
INSERT INTO user_roles (user_id, role) 
VALUES ('user-uuid', 'admin');

-- Check admin status
SELECT * FROM user_roles 
WHERE user_id = 'user-uuid';
```

## 📁 Where to Find Things

### Configuration Files
- Environment variables → `.env.local`
- Netlify config → `netlify.toml`
- TypeScript config → `tsconfig.json`
- Vite config → `vite.config.ts`

### Key Source Files
- Routes → `/src/routes/`
- Pages → `/src/pages/`
- Components → `/src/components/`
- Services → `/src/services/`
- Hooks → `/src/hooks/`
- Contexts → `/src/contexts/`

### Documentation
- This guide → `/docs/QUICK_REFERENCE.md`
- Full index → `/docs/README.md`
- Troubleshooting → `/docs/troubleshooting/`
- Development → `/docs/development/`

## 🔑 Environment Variables

### Required
```env
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_OPENAI_API_KEY=your_openai_key
```

### Optional
```env
VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
VITE_STRIPE_LIFETIME_PRICE_ID=price_xxx
VITE_ENABLE_DEV_LOGIN=false
```

## 🐛 Debug Commands

### Check for Secrets
```bash
# Scan for hardcoded keys
grep -r "ydevatqwkoccxhtejdor.supabase.co" src/
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/
grep -r "sk-" src/  # OpenAI keys
```

### Clear Local Storage
```javascript
// In browser console
localStorage.clear();
window.location.reload();
```

### Check Service Health
```javascript
// In browser console
const checkHealth = async () => {
  const response = await fetch('/api/health');
  console.log(await response.json());
};
checkHealth();
```

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Run `npm run lint`
- [ ] Run `npm run build` locally
- [ ] Check for console errors
- [ ] Test authentication flow
- [ ] Verify maps load
- [ ] Check Barry AI responds
- [ ] No hardcoded secrets

### After Deploying
- [ ] Check Netlify build logs
- [ ] Test live site authentication
- [ ] Verify all features work
- [ ] Check browser console
- [ ] Monitor error reports

## 📞 Important Links

### Internal
- Production: https://unimogcommunityhub.com
- Staging: Check Netlify dashboard
- Supabase: https://ydevatqwkoccxhtejdor.supabase.co

### External
- [Netlify Dashboard](https://app.netlify.com)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [GitHub Repo](https://github.com/Thabonel/unimogcommunityhub)
- [Staging Repo](https://github.com/Thabonel/unimogcommunity-staging)

## ⚠️ Critical Warnings

### NEVER
- Push to production without permission
- Hardcode API keys as fallbacks
- Clear sessions on API key errors
- Use `git push --force` without permission
- Expose service role keys

### ALWAYS
- Work on staging branch
- Test locally before pushing
- Check for secrets before committing
- Document significant changes
- Update relevant documentation

Last Updated: 2025-08-23