# Features To Add

**Last Updated**: October 3, 2025
**Purpose**: Track feature requests and enhancement ideas for Unimog Community Hub

---

## 🌍 Internationalization & Localization

### Currency & Language Configuration
**Issue**: Current configuration doesn't match actual user base
- **Current Users**: 91% Australian, 9% German
- **Configured**: England, Turkey, Argentina (no users)
- **Action Needed**:
  1. Research Unimog owner distribution worldwide
  2. Identify actual target markets (where Unimog owners are)
  3. Simplify currency options to match real user base
  4. Remove unused language/country configurations

**Priority**: Medium
**Assigned**: Research needed
**Related Files**:
- `/src/lib/i18n.ts`
- `/src/config/pricing.ts`
- `/src/hooks/use-currency-pricing.ts`

---

## 🗺️ Trip Planner Enhancements

### Trail Search Feature
**Status**: Research complete - ready for implementation
**Documentation**: `/docs/trail-search-implementation-research.md`

**Tasks**:
- [ ] Create `user_trail_library` database table
- [ ] Build Edge Function: `search-trails` (Overpass API)
- [ ] Create TrailSearchInput component
- [ ] Create TrailSearchResults component
- [ ] Integrate with TripPlanner map
- [ ] Implement save to library functionality
- [ ] Add GPX export feature

**Priority**: High
**Estimated Time**: 4-6 hours implementation + 2 hours testing

---

## 🛡️ Admin Dashboard

### Feedback Management
**Issue**: Cannot delete feedback items
**Status**: Migration created, not deployed

**Tasks**:
- [ ] Deploy admin delete policy migration
- [ ] Test feedback deletion functionality
- [ ] Verify RLS policies working correctly

**Priority**: Medium
**Related Files**: `/supabase/migrations/20251003_add_admin_delete_feedback_policy.sql`

---

## 🚀 Production Deployment Queue

### Pending Changes (Staging → Production)
**Note**: Must accumulate more fixes before pushing to production

**Ready to Deploy**:
1. ✅ Testimonials (Geoff Barton with U1700L)
2. ✅ White screen fixes (CSP, service worker, Safari)
3. ⏳ Admin feedback delete policy (not yet deployed to staging)
4. ⏳ Currency/language configuration updates (pending research)
5. ⏳ Trail search feature (pending implementation)

---

## 📋 Future Features (From Roadmap)

### Phase 1: Content Aggregation (0% Complete)
- Automated trip discovery from OSM, forums, social media
- Admin interface for content review
- Web scraping infrastructure
- Edge Functions for scheduled aggregation

### Phase 2: Enhanced Search & Categories (5% Complete)
- Advanced search with filters
- Comprehensive trip categorization
- Vehicle class system (1-9 scale)
- Terrain/difficulty/duration classification

### Phase 3: Community Features (0% Complete)
- Trip reviews and ratings
- Photo galleries with GPS metadata
- Comments and discussions
- Trip buddy finder
- Achievement badges

### Phase 4: Advanced Planning Tools (30% Complete)
- Cost calculator with real-time pricing
- Equipment/packing list generator
- Weather integration
- Fuel stop planning
- Permit tracking

### Phase 5: Mobile & Offline (Partial)
- Progressive Web App enhancements
- Offline map caching
- GPS tracking improvements
- Voice notes for trip logs

### Phase 6: Quality & Automation (0% Complete)
- Content quality scoring
- Automated content updates
- Duplicate detection
- Seasonal condition monitoring

**Reference**: `/docs/features/TRIP_LIBRARY_DEVELOPMENT_ROADMAP.md`

---

## 🐛 Known Issues

### White Screen on Production
**Status**: Intermittent, cannot reproduce consistently
**Last Occurrence**: After latest production push
**Action**: Monitor after next deployment, capture console logs

### Service Worker Cache
**Status**: Fixed with cache version 5
**Note**: Index.html no longer cached to ensure fresh CSP headers

---

## 💡 Ideas & Suggestions

*Add feature requests and ideas here*

---

## ✅ Completed Features

### 2025-10-03
- ✅ Testimonials section with real user feedback
- ✅ White screen fixes (CSP violations, service worker caching)
- ✅ Safari compatibility (ES2020 build target)
- ✅ Admin feedback management interface

---

**How to Use This Document**:
1. Add new feature requests under appropriate sections
2. Mark priority (Low/Medium/High/Critical)
3. Link to related files and documentation
4. Update status as features are implemented
5. Move completed items to "Completed Features" section
