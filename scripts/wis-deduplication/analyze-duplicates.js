#!/usr/bin/env node

/**
 * WIS Database Deduplication Analysis Script
 *
 * Analyzes duplicate procedures in the WIS database to understand:
 * - Exact duplication patterns
 * - Media file variations between duplicates
 * - Step count differences
 * - Content variations
 *
 * Usage: node scripts/wis-deduplication/analyze-duplicates.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client with service role for admin access
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Analyze duplicate patterns in WIS procedures
 */
async function analyzeDuplicates() {
  console.log('🔍 Starting WIS Database Duplication Analysis...\n');

  try {
    // 1. Get overall statistics
    console.log('📊 Getting overall database statistics...');
    const { data: stats, error: statsError } = await supabase
      .rpc('get_procedure_stats');

    if (statsError) {
      // Fallback to direct query if RPC doesn't exist
      const { data: procedures, error } = await supabase
        .from('wis_procedures')
        .select('id, title, procedure_code, created_at');

      if (error) throw error;

      const uniqueTitles = new Set(procedures.map(p => p.title));
      console.log(`   Total procedures: ${procedures.length}`);
      console.log(`   Unique titles: ${uniqueTitles.size}`);
      console.log(`   Duplicate ratio: ${((procedures.length - uniqueTitles.size) / procedures.length * 100).toFixed(1)}%\n`);
    }

    // 2. Identify top duplicate groups
    console.log('🔍 Analyzing duplicate groups...');
    const { data: duplicateGroups, error: dupError } = await supabase
      .from('wis_procedures')
      .select('title, procedure_code, media, steps')
      .order('title, procedure_code');

    if (dupError) throw dupError;

    // Group by title
    const titleGroups = {};
    duplicateGroups.forEach(proc => {
      if (!titleGroups[proc.title]) {
        titleGroups[proc.title] = [];
      }
      titleGroups[proc.title].push(proc);
    });

    // Find duplicates and analyze them
    const duplicateAnalysis = [];
    const consolidationPlan = [];

    for (const [title, procedures] of Object.entries(titleGroups)) {
      if (procedures.length > 1) {
        const analysis = {
          title,
          duplicateCount: procedures.length,
          procedures: procedures.map(p => ({
            code: p.procedure_code,
            mediaCount: p.media ? (Array.isArray(p.media) ? p.media.length : Object.keys(p.media).length) : 0,
            stepsCount: p.steps ? (Array.isArray(p.steps) ? p.steps.length : Object.keys(p.steps).length) : 0
          })),
          totalMediaFiles: 0,
          totalSteps: 0,
          consolidationStrategy: 'merge'
        };

        // Calculate totals
        analysis.totalMediaFiles = analysis.procedures.reduce((sum, p) => sum + p.mediaCount, 0);
        analysis.totalSteps = analysis.procedures.reduce((sum, p) => sum + p.stepsCount, 0);

        duplicateAnalysis.push(analysis);

        // Create consolidation plan
        consolidationPlan.push({
          title,
          action: 'consolidate',
          keepRecord: procedures[0].procedure_code, // Keep first one as master
          mergeRecords: procedures.slice(1).map(p => p.procedure_code),
          preserveData: {
            totalMedia: analysis.totalMediaFiles,
            totalSteps: analysis.totalSteps
          }
        });
      }
    }

    // Sort by duplicate count descending
    duplicateAnalysis.sort((a, b) => b.duplicateCount - a.duplicateCount);

    // 3. Generate detailed report
    console.log(`\n📋 DUPLICATION ANALYSIS RESULTS`);
    console.log(`${'='.repeat(50)}`);
    console.log(`Found ${duplicateAnalysis.length} procedure titles with duplicates\n`);

    // Top 10 most duplicated
    console.log('🔥 TOP 10 MOST DUPLICATED PROCEDURES:');
    duplicateAnalysis.slice(0, 10).forEach((analysis, index) => {
      console.log(`${index + 1}. "${analysis.title}"`);
      console.log(`   - ${analysis.duplicateCount} duplicates`);
      console.log(`   - ${analysis.totalMediaFiles} total media files`);
      console.log(`   - ${analysis.totalSteps} total steps`);
      console.log(`   - Codes: ${analysis.procedures.map(p => p.code).join(', ')}\n`);
    });

    // 4. Calculate consolidation impact
    const totalDuplicates = duplicateAnalysis.reduce((sum, a) => sum + a.duplicateCount - 1, 0);
    const totalProcedures = Object.keys(titleGroups).length;
    const uniqueProcedures = totalProcedures - duplicateAnalysis.length + duplicateAnalysis.length;

    console.log('💡 CONSOLIDATION IMPACT:');
    console.log(`   Current procedures: ${totalProcedures + totalDuplicates}`);
    console.log(`   After consolidation: ${totalProcedures}`);
    console.log(`   Records to be consolidated: ${totalDuplicates}`);
    console.log(`   Database size reduction: ${((totalDuplicates / (totalProcedures + totalDuplicates)) * 100).toFixed(1)}%\n`);

    // 5. Save analysis results
    const analysisReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCurrentProcedures: totalProcedures + totalDuplicates,
        uniqueTitles: totalProcedures,
        duplicateGroups: duplicateAnalysis.length,
        totalDuplicates: totalDuplicates,
        consolidationReduction: `${((totalDuplicates / (totalProcedures + totalDuplicates)) * 100).toFixed(1)}%`
      },
      duplicateAnalysis,
      consolidationPlan
    };

    // Create output directory
    const outputDir = path.join(process.cwd(), 'scripts', 'wis-deduplication', 'reports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save detailed report
    const reportPath = path.join(outputDir, `duplication-analysis-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(analysisReport, null, 2));
    console.log(`📄 Detailed analysis saved to: ${reportPath}`);

    // Save consolidation plan
    const planPath = path.join(outputDir, `consolidation-plan-${Date.now()}.json`);
    fs.writeFileSync(planPath, JSON.stringify(consolidationPlan, null, 2));
    console.log(`📋 Consolidation plan saved to: ${planPath}`);

    console.log('\n✅ Analysis complete!');
    console.log('\nNext steps:');
    console.log('1. Review the analysis report');
    console.log('2. Run consolidation script with: node scripts/wis-deduplication/consolidate-procedures.js');

    return analysisReport;

  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    throw error;
  }
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeDuplicates().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { analyzeDuplicates };