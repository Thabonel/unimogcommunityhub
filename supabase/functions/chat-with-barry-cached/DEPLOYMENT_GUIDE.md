# Barry AI Cache Deployment Guide

## Overview
This cached wrapper provides significant performance improvements while maintaining 100% compatibility with the existing `chat-with-barry-claude` function.

## Deployment Steps

### 1. Deploy the Cached Function
```bash
# Deploy the new cached function
supabase functions deploy chat-with-barry-cached

# Verify deployment
curl -X GET https://your-project.supabase.co/functions/v1/chat-with-barry-cached/health
```

### 2. Test the Function
```bash
# Run comprehensive test suite
npm run test:cache

# Or test manually
curl -X POST https://your-project.supabase.co/functions/v1/chat-with-barry-cached \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What oil for my Unimog?"}]}'
```

### 3. A/B Testing Configuration

#### Option A: Update Existing Components (Gradual Rollout)
Replace function calls in components one by one:

```typescript
// In src/components/wis/BarryChat.tsx
const { data, error } = await supabase.functions.invoke('chat-with-barry-cached', {
  body: {
    messages: [{ role: 'user', content: userInput }]
  },
  headers: {
    Authorization: `Bearer ${session.access_token}`,
    // Add cache bypass for testing: 'X-Skip-Cache': 'true'
  }
});
```

#### Option B: Environment-Based Toggle
Add environment variable for function selection:

```typescript
const functionName = import.meta.env.VITE_USE_CACHED_BARRY === 'true' 
  ? 'chat-with-barry-cached' 
  : 'chat-with-barry-claude';
```

### 4. Performance Monitoring
Monitor cache performance using the health endpoint:

```bash
# Check cache statistics
curl https://your-project.supabase.co/functions/v1/chat-with-barry-cached/health
```

Response includes:
```json
{
  "status": "healthy",
  "cache": {
    "type": "memory",
    "stats": {
      "hits": 45,
      "misses": 23,
      "errors": 0,
      "bypassed": 2
    },
    "hitRate": "66.2%"
  }
}
```

## Cache Configuration

### TTL Settings
- **Vehicle Profiles**: 5 minutes (user data changes rarely)
- **Query Responses**: 30 minutes (balance freshness vs performance)  
- **Manual Search**: 1 hour (technical content stable)

### Cache Keys
- Vehicle: `vehicle_${userId}_profile`
- Response: `response_${userId}_${queryHash}`
- Manual: `manual_${searchTermsHash}`

## Testing & Validation

### Cache Bypass Testing
Add header to bypass cache for testing:
```bash
-H "X-Skip-Cache: true"
```

### Performance Comparison
Expected improvements:
- **Cache Hits**: 50-80% faster response times
- **User Profiles**: Eliminate repeated database queries
- **Identical Queries**: Near-instant responses

### Accuracy Validation
The cached function should return identical responses to the original function for the same inputs.

## Rollback Procedure

### Option 1: Instant Component Rollback
Change function calls back to `chat-with-barry-claude`:

```typescript
// Revert to original function
const { data, error } = await supabase.functions.invoke('chat-with-barry-claude', {
  // ... existing code
});
```

### Option 2: Function-Level Rollback  
If needed, remove the cached function:
```bash
supabase functions delete chat-with-barry-cached
```

## Monitoring & Alerts

### Key Metrics to Watch
1. **Cache Hit Rate**: Should be >50% after warm-up
2. **Response Times**: Cache hits should be 2-5x faster
3. **Error Rates**: Should remain the same as original function
4. **Fallback Usage**: Should be minimal

### Red Flags
- Cache hit rate <30% (poor cache efficiency)
- Increased error rates (cache logic issues)
- Response accuracy differs from original
- Frequent fallback usage (cache system instability)

## Best Practices

### 1. Gradual Rollout
- Start with one component (e.g., BarryChat)
- Monitor for 24-48 hours
- Gradually expand to other interfaces

### 2. Cache Warming
Popular queries will naturally warm the cache, but you can pre-warm:
```bash
# Pre-warm common queries
curl -X POST .../chat-with-barry-cached -d '{"messages":[{"role":"user","content":"What oil for my Unimog?"}]}'
```

### 3. Monitoring Dashboard
Track cache performance alongside system metrics:
- Response time improvements
- Cache hit/miss ratios
- User satisfaction (faster responses)

## Troubleshooting

### Cache Not Working
1. Check health endpoint for cache stats
2. Verify proper headers in requests
3. Look for `X-Cache-Status` header in responses

### Performance Issues
1. Monitor memory usage (in-memory cache)
2. Check TTL settings (too short = poor hit rate)
3. Validate cache key generation (collisions = poor hit rate)

### Fallback Activation
1. Review function logs for errors
2. Ensure original function is still deployed
3. Check service connectivity

## Security Considerations

### Data Privacy
- Cache keys use hashes, not plaintext
- User data is properly segmented by user ID
- TTL ensures data doesn't persist indefinitely

### Access Control
- Same authentication as original function
- Cache bypass requires valid authentication
- Health endpoint doesn't expose sensitive data

## Success Criteria

### Technical Metrics
- ✅ Cache hit rate >50%
- ✅ Response time improvement >30%
- ✅ Zero increase in error rates
- ✅ Identical response accuracy

### User Experience
- ✅ Faster Barry responses
- ✅ No functionality changes
- ✅ Improved system responsiveness

## Next Steps

After successful deployment:
1. **Monitor for 1 week** - Ensure stability
2. **Gather user feedback** - Perceived performance improvements  
3. **Optimize cache settings** - Adjust TTLs based on usage patterns
4. **Consider Redis upgrade** - For multi-instance scaling
5. **Implement cache analytics** - Detailed performance insights

---

**Deployment Status**: Ready for A/B testing
**Risk Level**: Low (zero-risk wrapper design)
**Expected Impact**: 30-60% performance improvement for cached queries