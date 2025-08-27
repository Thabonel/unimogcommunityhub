# Session Summary: Fixing Maps with Content Security Policy (CSP)

**Date**: August 27, 2025
**Issue**: Traffic & Emergency Alerts and Fires Near Me maps not displaying on staging site
**Resolution**: Fixed by moving Mapbox token initialization from module level to useEffect

## Problem Statement

User reported that on the deployed staging site (Netlify):
- Traffic & Emergency Alerts map was not displaying
- Fires Near Me map was not displaying
- Trip Planner map WAS working correctly
- Main production site had working maps but no CSP headers
- Staging site had CSP headers for security

## Initial Investigation

### 1. Mock Data Replacement
- Replaced all mock data in Dashboard with real-time data fetching
- Created notification service and comprehensive data hooks
- Added loading skeletons and empty states

### 2. CSP Header Discovery
Found that staging had Content Security Policy headers while main didn't:
```
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com https://cdn.jsdelivr.net blob:; worker-src 'self' blob:; ..."
```

### 3. Initial Attempts
- Added `worker-src 'self' blob:` and `child-src 'self' blob:` to CSP
- Removed Facebook SDK and GPTEng scripts that violated CSP
- Applied SimpleMap implementation from main branch

## Root Cause Analysis

### Key Discovery
The difference between working and non-working maps was **WHEN** the Mapbox access token was set:

#### Trip Planner (WORKING)
```javascript
// Inside function, right before map creation
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({...});
```

#### SimpleMap & FiresMapView (NOT WORKING)
```javascript
// At module level, when file loads
mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

const SimpleMap = () => {
  // Component code
};
```

### Why This Matters with CSP
1. Setting token at module level triggers Mapbox worker creation immediately
2. CSP evaluation might not be complete at module load time
3. Browser blocks the early worker creation attempt
4. Setting token inside useEffect delays it until after CSP is ready

## The Solution

### Changes Made

#### 1. SimpleMap.tsx
```diff
- // Set the Mapbox access token from environment variables
- mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;
    
+   // Set the Mapbox access token right before map creation
+   mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    
    try {
      // Create map instance
```

#### 2. FiresMapView.tsx
```diff
- // Set the Mapbox access token from environment variables
- mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
+   // Set the Mapbox access token right before map creation
+   mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;
    
    try {
      // Create map instance
```

### Files Modified
- `src/components/SimpleMap.tsx` - Used by Traffic & Emergency Alerts
- `src/components/dashboard/fires/FiresMapView.tsx` - Used by Fires Near Me
- **NOT TOUCHED**: Trip Planner components (already working)

## Technical Details

### CSP Requirements for Mapbox GL JS v3
- Requires `worker-src blob:` for web workers
- Requires `script-src blob:` for worker scripts
- Workers must follow same-origin policy
- Alternative: Use `mapbox-gl-csp.js` for strict CSP environments

### Timing Issue Explained
1. **Module Load Time**: JavaScript modules execute when imported
2. **Component Mount Time**: useEffect runs after React component mounts
3. **CSP Evaluation**: Browser evaluates CSP headers after page load
4. Setting Mapbox token at module level can trigger worker creation before CSP is ready

## Key Learnings

1. **CSP is Important**: Provides protection against XSS, injection attacks, and data exfiltration
2. **Timing Matters**: Library initialization timing can conflict with security policies
3. **Consistency**: All map components should follow the same initialization pattern
4. **Testing**: Always test with production security headers, not just local development

## Benefits Achieved

✅ **Security Maintained**: CSP headers remain in place for security
✅ **All Maps Working**: Traffic, Emergency, and Fires maps now display correctly
✅ **Trip Planner Untouched**: Working code not modified, reducing risk
✅ **Pattern Established**: Clear pattern for future map components

## Deployment

Changes pushed to staging repository and automatically deployed via Netlify.
Maps confirmed working with CSP security headers enabled.

## Future Recommendations

1. **Standardize Map Components**: Create a shared hook for map initialization
2. **Document CSP Requirements**: Add CSP requirements to component documentation
3. **Consider CSP Bundle**: For stricter CSP, consider using `mapbox-gl-csp.js`
4. **Add CSP to Main**: Once verified, add same CSP headers to production for security

## Commands Used

```bash
# Check CSP headers on deployed sites
curl -I https://unimogcommunity-staging.netlify.app | grep -i "content-security"
curl -I https://unimogcommunityhub.com | grep -i "content-security"

# TypeScript validation
npx tsc --noEmit

# Git operations
git add -A
git commit -m "fix: move Mapbox token setting to useEffect to work with CSP"
git push staging staging-restore-complete:main
```

## Related Files
- `/netlify.toml` - Contains CSP header configuration
- `/src/config/env.ts` - Mapbox configuration
- `/src/contexts/MapTokenContext.tsx` - Token management (not used by broken maps)