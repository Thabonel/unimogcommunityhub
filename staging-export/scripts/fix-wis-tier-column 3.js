#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTierColumn() {
  console.log('🔧 Adding tier column to user_subscriptions table...\n');
  
  try {
    // Check if tier column exists and add it if not
    const { data: checkColumn, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('tier')
      .limit(1);
    
    if (checkError && checkError.message.includes('column "tier" does not exist')) {
      console.log('❌ Tier column does not exist');
      console.log('ℹ️  The tier column needs to be added via Supabase Dashboard SQL Editor');
      console.log('\n📋 Run this SQL in your Supabase Dashboard:\n');
      console.log(`-- Add tier column to user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN tier TEXT NOT NULL DEFAULT 'free' 
CHECK (tier IN ('free', 'premium', 'professional'));`);
      console.log('\n🔗 SQL Editor URL:');
      console.log(`https://supabase.com/dashboard/project/${process.env.VITE_SUPABASE_PROJECT_ID}/sql/new`);
    } else if (checkError) {
      console.error('❌ Error checking column:', checkError);
    } else {
      console.log('✅ Tier column already exists!');
      
      // Let's check some sample data
      const { data: subs, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .limit(5);
      
      if (subs && subs.length > 0) {
        console.log('\n📊 Sample subscriptions:');
        console.table(subs.map(s => ({
          user_id: s.user_id.substring(0, 8) + '...',
          tier: s.tier,
          monthly_minutes_used: s.monthly_minutes_used,
          monthly_minutes_limit: s.monthly_minutes_limit
        })));
      } else {
        console.log('\n📊 No subscriptions found yet');
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixTierColumn();