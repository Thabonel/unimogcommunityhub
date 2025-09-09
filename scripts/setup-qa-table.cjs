#!/usr/bin/env node

/**
 * Setup QA Issues table in Supabase
 * This script creates the table structure using Supabase's JavaScript client
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupQATable() {
  console.log('🚀 Setting up QA Issues tracking in Supabase...\n');
  
  // First, let's check if the table exists
  console.log('📊 Checking if qa_issues table exists...');
  const { data: existingData, error: checkError } = await supabase
    .from('qa_issues')
    .select('id')
    .limit(1);
  
  if (!checkError || checkError.code !== '42P01') {
    console.log('✅ Table qa_issues already exists!');
    
    // Let's check the structure
    const { count } = await supabase
      .from('qa_issues')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📈 Current issue count: ${count || 0}`);
    return;
  }
  
  console.log('❌ Table does not exist yet.');
  console.log('\n📝 Please run the following SQL in your Supabase Dashboard:\n');
  console.log('URL: ' + supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', '/sql'));
  console.log('\n--- COPY SQL BELOW ---\n');
  
  const sql = `
-- Create qa_issues table for website QA tracking
CREATE TABLE IF NOT EXISTS public.qa_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  priority TEXT CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')) NOT NULL DEFAULT 'Medium',
  category TEXT CHECK (category IN ('UI/Design', 'Functionality', 'Content', 'Performance', 'Integration', 'Other')) NOT NULL DEFAULT 'Other',
  status TEXT CHECK (status IN ('Open', 'Closed')) NOT NULL DEFAULT 'Open',
  notes TEXT,
  screenshot_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qa_issues_status ON public.qa_issues(status);
CREATE INDEX IF NOT EXISTS idx_qa_issues_priority ON public.qa_issues(priority);
CREATE INDEX IF NOT EXISTS idx_qa_issues_category ON public.qa_issues(category);
CREATE INDEX IF NOT EXISTS idx_qa_issues_created_by ON public.qa_issues(created_by);
CREATE INDEX IF NOT EXISTS idx_qa_issues_created_at ON public.qa_issues(created_at DESC);

-- Enable RLS
ALTER TABLE public.qa_issues ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow authenticated users to view all issues
CREATE POLICY "qa_issues_view_policy" ON public.qa_issues
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to create issues
CREATE POLICY "qa_issues_insert_policy" ON public.qa_issues
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update any issue (for collaborative QA)
CREATE POLICY "qa_issues_update_policy" ON public.qa_issues
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow users to delete their own issues or admins to delete any
CREATE POLICY "qa_issues_delete_policy" ON public.qa_issues
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = created_by 
    OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_qa_issues_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  -- If status changed to Closed, set closed_at and closed_by
  IF NEW.status = 'Closed' AND OLD.status = 'Open' THEN
    NEW.closed_at = NOW();
    NEW.closed_by = auth.uid();
  -- If status changed back to Open, clear closed_at and closed_by
  ELSIF NEW.status = 'Open' AND OLD.status = 'Closed' THEN
    NEW.closed_at = NULL;
    NEW.closed_by = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER qa_issues_updated_at
  BEFORE UPDATE ON public.qa_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_qa_issues_updated_at();

-- Create storage bucket for QA screenshots if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('qa-screenshots', 'qa-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for qa-screenshots bucket
CREATE POLICY "qa_screenshots_view_policy" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'qa-screenshots');

CREATE POLICY "qa_screenshots_upload_policy" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'qa-screenshots');

CREATE POLICY "qa_screenshots_update_policy" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'qa-screenshots');

CREATE POLICY "qa_screenshots_delete_policy" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'qa-screenshots');
  `;
  
  console.log(sql);
  console.log('\n--- END SQL ---\n');
  console.log('✅ After running the SQL, re-run this script to verify the setup.');
}

setupQATable().catch(console.error);