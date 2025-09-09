# Emergency Backup Restoration Guide

## Backup Created: August 24, 2025 12:01 PM

### Current State Backup Details

**Git Branch:** `staging-restore-complete`
**Last Commit:** `2e86680` - fix: resolve WIS database connection and data loading issues
**Backup Location:** `~/Desktop/unimogcommunity-backup-20250824-120153.tar.gz` (108MB)

### Working Features at Time of Backup

✅ **Core Features:**
- User authentication and profiles
- Vehicle management system
- Marketplace with currency conversion
- Trip planning with GPX support
- Knowledge base and manuals

✅ **Recently Fixed:**
- WIS Workshop Database (needs data migration)
- Barry AI on all pages (split-view interface)
- International currency conversion
- Mark as sold functionality
- No more page flickering

✅ **Database Structure:**
- `manual_chunks` table with vector embeddings
- WIS tables ready (migration not yet run)
- All RLS policies in place
- Storage buckets configured

---

## Quick Restoration Instructions

### Option 1: Restore from Git Branch (Fastest)
```bash
# If something breaks, immediately run:
git stash
git checkout backup-20250824-120129
npm install
npm run dev
```

### Option 2: Restore from Tar Backup
```bash
# Extract backup to new location
cd ~/Desktop
tar -xzf unimogcommunity-backup-20250824-120153.tar.gz
cd Users/thabonel/Documents/unimogcommunityhub
npm install
npm run dev
```

### Option 3: Revert Specific Changes
```bash
# To undo last commit
git revert HEAD

# To reset to specific commit
git reset --hard 2e86680
```

---

## Database Restoration

### Current Migrations Applied
All migrations up to `20250823_add_currency_to_marketplace.sql`

### WIS Migration NOT YET Applied
File ready at: `supabase/migrations/20250821120900_create_wis_tables.sql`

### If Database Issues Occur
1. Check Supabase Dashboard for table structure
2. Manual chunks system is at: `20250109_manual_chunks_system.sql`
3. WIS tables pending at: `20250821120900_create_wis_tables.sql`

---

## Environment Variables Required
```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY=[your_key]
VITE_MAPBOX_ACCESS_TOKEN=[your_token]
VITE_OPENAI_API_KEY=[your_key]
```

---

## Critical Files to Preserve

### Recently Modified Core Files
- `/src/pages/knowledge/WISSystemPage.tsx` - WIS interface
- `/src/services/wisService.ts` - WIS data service
- `/src/utils/seedWISData.ts` - Sample data seeder
- `/src/components/barry/EnhancedBarryChat.tsx` - Barry AI interface
- `/src/services/exchangeRateService.ts` - Currency conversion

### Edge Functions
- `/supabase/functions/chat-with-barry/` - Barry AI backend
- `/supabase/functions/process-manual/` - PDF processing

---

## Testing Checklist After Restoration

- [ ] User can sign in
- [ ] No "Invalid API key" errors in console
- [ ] Maps load without flashing
- [ ] Barry AI responds to questions
- [ ] PDF viewer works in Knowledge > Manuals
- [ ] WIS page loads (even if empty)
- [ ] Marketplace shows correct currencies
- [ ] No infinite loops or flickering

---

## Contact for Issues
If restoration fails, the last working state was at commit `2e86680` on branch `staging-restore-complete`.

Key branches available:
- `staging-restore-complete` - Current working state
- `backup-20250824-120129` - Today's backup
- `main` - Production (DO NOT push without permission)

---

## Notes
- WIS data migration needs to be run manually in Supabase
- Manual PDF processing system exists but needs PDFs uploaded
- Barry can search manual_chunks table when populated
- Currency conversion working for marketplace globally