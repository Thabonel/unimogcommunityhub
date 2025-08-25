#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Files to process
const problematicFiles = [
  // Files importing from @/lib/supabase (wrong)
  'src/utils/userOperations 4.ts',
  'src/utils/userMembershipOperations 4.ts',
  'src/utils/supabaseEdgeFunctions 4.ts',
  'src/utils/supabase-connection-test 4.ts',
  'src/utils/manualUploader 4.ts',
  'src/utils/emailUtils 4.ts',
  'src/utils/email/core 4.ts',
  'src/utils/authUtils 4.ts',
  'src/utils/adminUtils 4.ts',
  'src/services/wis/wisSessionService 4.ts',
  'src/services/wis/wisContentService 4.ts',
  'src/services/wis/wisAnalyticsService 4.ts',
  'src/services/trackCommentService 4.ts',
  'src/services/manuals/manualService 4.ts',
  'src/services/manuals/manualOperations 4.ts',
  'src/services/manuals/fetchManuals 4.ts',
  'src/services/feedbackService 4.ts',
  'src/services/feedback/roadmapService 4.ts',
  'src/services/emergencyAlertService 4.ts',
  'src/services/chatgpt/secureChatGPTService 4.ts',
  'src/services/analytics/activityTrackingService 4.ts',
  'src/pages/TestPDF 4.tsx',
  'src/pages/ProfileSetup 4.tsx',
  'src/pages/KnowledgeManuals 4.tsx',
  'src/pages/ForgotPassword 4.tsx',
  'src/hooks/use-subscription 4.ts',
  'src/hooks/trial-conversion/fetch-conversion-data 4.ts',
  'src/hooks/profile/use-profile-fetcher 4.ts',
  'src/hooks/profile/use-profile-edit 4.ts',
  'src/hooks/manuals/use-manual-operations 4.ts',
  'src/components/trips/map/TrackCommunity 4.tsx',
  'src/components/profile/ProfilePhotoFields 4.tsx',
  'src/components/knowledge/useStorageInitialization 4.ts',
  'src/components/auth/DevMasterLogin 4.tsx',
  // Files importing from @/integrations/supabase (wrong)
  'src/utils/userBanOperations 4.ts',
  'src/utils/manualDuplicateChecker 4.ts',
  'src/utils/fileValidation 4.ts',
  'src/utils/fileProcessingUtils 4.ts',
  'src/utils/emailBlockOperations 4.ts',
  'src/services/userMessageService 4.ts',
  'src/services/trackService 7.ts',
  'src/services/trackService 6.ts',
  'src/services/post/postQueryService.optimized 4.ts',
  'src/services/post/postQueryService 4.ts',
  'src/services/post/postEngagementService 4.ts',
  'src/services/post/postCreationService 4.ts',
  'src/services/post/commentService 4.ts',
  'src/services/poiService 5.ts',
  'src/services/offline/offlineSync 4.ts',
  'src/services/messageOperationsService 4.ts',
  'src/services/conversationService 4.ts',
  'src/services/conversationHelpers 4.ts',
  'src/services/articles 4.ts',
  'src/hooks/vehicle-maintenance/useVehicleOperations 4.ts',
  'src/hooks/vehicle-maintenance/use-maintenance-settings 4.ts',
  'src/hooks/vehicle-maintenance/use-fuel-logs 4.ts',
  'src/hooks/vehicle-maintenance/types 4.ts',
  'src/hooks/use-user-presence 4.ts',
  'src/hooks/use-unimog-data 4.ts',
  'src/hooks/use-search-results 4.ts',
  'src/hooks/use-audit-logger 4.ts',
  'src/hooks/use-articles 4.tsx',
  'src/contexts/AuthContext 4.tsx'
];

let totalFixed = 0;
let totalErrors = 0;

console.log('🔧 Fixing Supabase Import Paths\n');
console.log('=' .repeat(50));

for (const file of problematicFiles) {
  const filePath = path.join(rootDir, file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix imports from @/lib/supabase to @/lib/supabase-client
    if (content.includes("from '@/lib/supabase'") || content.includes('from "@/lib/supabase"')) {
      content = content.replace(/from ['"]@\/lib\/supabase['"]/g, "from '@/lib/supabase-client'");
      modified = true;
    }
    
    // Fix imports from @/integrations/supabase/client to @/lib/supabase-client
    if (content.includes("@/integrations/supabase")) {
      content = content.replace(/from ['"]@\/integrations\/supabase\/client['"]/g, "from '@/lib/supabase-client'");
      content = content.replace(/from ['"]@\/integrations\/supabase['"]/g, "from '@/lib/supabase-client'");
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      totalFixed++;
    } else {
      console.log(`⏭️  No changes needed: ${file}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${file}: ${error.message}`);
    totalErrors++;
  }
}

console.log('\n' + '=' .repeat(50));
console.log(`\n📊 Summary:`);
console.log(`  ✅ Files fixed: ${totalFixed}`);
console.log(`  ❌ Errors: ${totalErrors}`);
console.log(`  📁 Total processed: ${problematicFiles.length}`);

if (totalFixed > 0) {
  console.log('\n✨ Import paths have been standardized to use @/lib/supabase-client');
  console.log('🔄 Please restart your dev server for changes to take effect.');
}