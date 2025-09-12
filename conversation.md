# Community Page Database Fixes - September 12, 2025

## Current Status
We are fixing critical database issues with the Community page that are causing console errors and preventing proper functionality.

## Issues Identified
From the console errors, we found these critical problems:

1. **Missing `visibility` column** in `community_posts` table - causing 400 errors
2. **Infinite recursion in RLS policies** - causing 500 errors for `group_members` and `user_details`
3. **Foreign key reference issues** in GroupsList component
4. **Posts and Groups not loading** due to database schema mismatches

## Previous Work Completed
1. ✅ **Fixed post service schema mismatches** - Updated to use `author_id` instead of `user_id`
2. ✅ **Fixed GroupsList foreign key references** - Simplified join queries
3. ✅ **Updated user profile service** - Added fallbacks for recursion errors
4. ✅ **Created diagnostic migration** - Safe migration that checks existing state

## MCP Configuration Fixed
- Updated `.mcp.json` with correct project ref: `ydevatqwkoccxhtejdor`
- Added Supabase access token: `sbp_fb3efa42dcbe8fd86507613c8c2f23e74b50d4b5`
- MCP server still needs restart to work properly

## Key Files Modified
- `src/services/post/postCreationService.ts` - Fixed to use `author_id` and add `title`
- `src/services/post/postQueryService.ts` - Fixed schema mappings and fallbacks
- `src/components/community/groups/GroupsList.tsx` - Fixed foreign key references
- `src/services/userProfileService.ts` - Added recursion error handling

## Migration Ready to Deploy
Created: `supabase/migrations/20250912_diagnose_and_fix_community.sql`

This migration will:
- ✅ Check what tables actually exist
- ✅ Add missing `visibility` column to `community_posts` if needed
- ✅ Fix RLS policy recursion issues with simple policies
- ✅ Recreate `user_details` view without recursion
- ✅ Show detailed logs of current database state

## Next Steps After Restart
1. **Test MCP connection**: Try `mcp__supabase__execute_sql` to see current tables
2. **If MCP works**: Inspect database directly and create targeted fixes
3. **If MCP doesn't work**: Deploy the diagnostic migration manually in Supabase dashboard
4. **Verify fixes**: Test Community page for resolved errors
5. **Implement trip sharing**: Once basic functionality works

## Console Errors to Watch For
- ❌ `column community_posts.visibility does not exist`
- ❌ `infinite recursion detected in rules for relation "group_members"`
- ❌ `infinite recursion detected in rules for relation "user_details"`
- ❌ Foreign key reference errors in GroupsList

## Trip Sharing Feature (Future)
After fixing database issues, implement:
- Share GPX tracks as community posts
- Group trip planning and coordination
- Trip collaboration features for group drives

## Important Notes
- All fixes are designed to be **safe** - they check existing state before making changes
- The diagnostic migration provides detailed logging of what it finds and fixes
- Community posts should work once `visibility` column is added and RLS issues are resolved
- Groups functionality should work once RLS recursion is fixed