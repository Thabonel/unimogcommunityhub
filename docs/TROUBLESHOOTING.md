# UnimogCommunityHub Troubleshooting Guide

## Common Issues and Solutions

### 1. Development Server Issues

#### Problem: 503 Service Unavailable Errors
**Symptoms**:
```
GET http://localhost:8080/@vite/client net::ERR_ABORTED 503 (Service Unavailable)
GET http://localhost:8080/src/main.tsx net::ERR_ABORTED 503 (Service Unavailable)
```

**Solution**:
```bash
# Server not running - start it
npm run dev

# If port 8080 is blocked, kill existing process
lsof -ti:8080 | xargs kill -9
npm run dev

# Alternative: use different port
npm run dev -- --port 5173
```

#### Problem: White/Blank Page but Server Running
**Symptoms**:
- Page loads but shows white/blank
- Barry chat widget visible
- No 503 errors

**Causes & Solutions**:
1. **JavaScript compilation errors**:
   ```bash
   # Check for build errors
   npm run build
   ```
   Common issues:
   - Duplicate exports
   - Missing imports
   - TypeScript errors

2. **Check browser console** (F12) for runtime errors

3. **Clear cache**:
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + F5`

### 2. Map and Route Issues

#### Problem: Map Not Loading
**Solutions**:
1. Check Mapbox token:
   ```bash
   # Verify .env file has token
   cat .env | grep MAPBOX
   ```

2. Token should be in format: `pk.xxxxx...`

3. Clear localStorage and reload:
   ```javascript
   // In browser console
   localStorage.clear()
   location.reload()
   ```

#### Problem: Route Line Flickering
**Reference**: See [MAPBOX_ROUTE_FLICKERING_FIX.md](./MAPBOX_ROUTE_FLICKERING_FIX.md)

**Quick fix**: Ensure `/src/hooks/use-waypoint-manager.ts` has:
- Debounced route fetching
- Smart layer updates (not recreation)
- Proper useEffect dependencies

#### Problem: Routes Not Saving
**Causes**:
1. Database tables missing
2. User not authenticated
3. Supabase connection issues

**Solutions**:
```sql
-- Run migrations in Supabase dashboard
-- Check /supabase/migrations/20250107_fix_tracks_trips_tables.sql
```

### 3. Database Issues

#### Problem: Supabase Tables Missing
**Solution**:
Run migrations in order:
1. `/supabase/migrations/20250107_create_trips_table.sql`
2. `/supabase/migrations/20250107_create_tracks_table.sql`
3. `/supabase/migrations/20250107_fix_tracks_trips_tables.sql`

#### Problem: Type Mismatch Errors
**Example**: `operator does not exist: text = uuid`

**Solution**: Ensure `created_by` columns are UUID type, not TEXT

### 4. Offline Detection Issues

#### Problem: "You're Currently Offline" in Development
**Solution**: Already fixed in `/src/hooks/use-offline.ts`:
```typescript
const initialOffline = import.meta.env.DEV ? false : !navigator.onLine;
```

### 5. Build and Deployment Issues

#### Problem: Build Fails
**Common causes**:
1. **Duplicate exports**:
   ```
   ERROR: Multiple exports with the same name "MAP_STYLES"
   ```
   Solution: Remove duplicate exports

2. **Missing imports**:
   ```
   "hasMapboxToken" is not exported by...
   ```
   Solution: Fix import paths

3. **TypeScript errors**:
   ```bash
   # Check TypeScript
   npx tsc --noEmit
   ```

### 6. Authentication Issues

#### Problem: Can't Save Routes/Tracks
**Check**:
1. User is logged in
2. Supabase connection working
3. RLS policies are correct

**Debug**:
```javascript
// In browser console
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

### 7. Performance Issues

#### Problem: Slow Map Performance
**Solutions**:
1. Reduce number of markers
2. Use clustering for many points
3. Simplify route geometry
4. Check browser dev tools Performance tab

#### Problem: Memory Leaks
**Check for**:
- Missing cleanup in useEffect
- Event listeners not removed
- Markers not cleared

## Debug Commands

### Check Application Status
```bash
# Check if server running
ps aux | grep vite

# Check port usage
lsof -i :8080

# Check Node version
node --version  # Should be 18+

# Check dependencies
npm list --depth=0

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Browser Console Commands
```javascript
// Check Mapbox token
localStorage.getItem('mapbox-token')

// Check Supabase connection
supabase.auth.getUser()

// Clear all storage
localStorage.clear()
sessionStorage.clear()

// Check map instance
MapManager.getInstance()
```

### Environment Verification
```bash
# Check all env variables are set
node scripts/check-env.js

# Verify Supabase connection
npx supabase status

# Test build
npm run build
```

## Quick Fixes Checklist

- [ ] Dev server running? (`npm run dev`)
- [ ] Browser cache cleared? (Cmd+Shift+R / Ctrl+F5)
- [ ] Environment variables set? (`.env` file)
- [ ] Database migrations run? (Supabase dashboard)
- [ ] User authenticated? (Check auth status)
- [ ] Console errors? (F12 → Console tab)
- [ ] Network errors? (F12 → Network tab)
- [ ] TypeScript errors? (`npm run build`)

## Getting Help

1. **Check documentation**:
   - [MAPBOX_FIX.md](./MAPBOX_FIX.md) - Map initialization issues
   - [MAPBOX_ROUTE_FLICKERING_FIX.md](./MAPBOX_ROUTE_FLICKERING_FIX.md) - Route rendering issues
   - [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Initial setup

2. **GitHub Issues**: Report bugs at project repository

3. **Common Solutions**:
   - Restart dev server
   - Clear browser cache
   - Check console for errors
   - Verify environment variables

## Prevention Tips

1. **Always run after pulling changes**:
   ```bash
   npm install
   npm run dev
   ```

2. **Check for TypeScript errors before committing**:
   ```bash
   npm run build
   ```

3. **Keep dependencies updated**:
   ```bash
   npm outdated
   npm update
   ```

4. **Use proper cleanup in React hooks**:
   ```typescript
   useEffect(() => {
     // Setup
     return () => {
       // Cleanup
     };
   }, []);
   ```

---

*Last Updated: January 2025*