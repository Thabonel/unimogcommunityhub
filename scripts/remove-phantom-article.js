#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removePhantomArticle() {
  console.log('🔍 Searching for phantom article...');
  
  // Search for the phantom article
  const { data: articles, error: searchError } = await supabase
    .from('community_articles')
    .select('id, title, author_id, published_at')
    .or('title.ilike.%Insurance and Registration%,title.ilike.%Unimogs in Australia%');

  if (searchError) {
    console.error('❌ Error searching for articles:', searchError.message);
    return;
  }

  if (!articles || articles.length === 0) {
    console.log('✅ No phantom article found - database is clean!');
    return;
  }

  console.log(`Found ${articles.length} phantom article(s):`, articles);

  // Delete the phantom articles
  for (const article of articles) {
    console.log(`🗑️  Deleting article: "${article.title}" (ID: ${article.id})`);
    
    const { error: deleteError } = await supabase
      .from('community_articles')
      .delete()
      .eq('id', article.id);

    if (deleteError) {
      console.error(`❌ Error deleting article ${article.id}:`, deleteError.message);
    } else {
      console.log(`✅ Successfully deleted article ${article.id}`);
    }
  }

  // Verify deletion
  const { data: remaining, error: verifyError } = await supabase
    .from('community_articles')
    .select('id, title')
    .or('title.ilike.%Insurance and Registration%,title.ilike.%Unimogs in Australia%');

  if (verifyError) {
    console.error('❌ Error verifying deletion:', verifyError.message);
  } else if (remaining && remaining.length > 0) {
    console.error('⚠️  Some phantom articles still remain:', remaining);
  } else {
    console.log('✅ All phantom articles successfully removed!');
  }

  // Show all remaining articles
  const { data: allArticles, error: allError } = await supabase
    .from('community_articles')
    .select('id, title, category, published_at')
    .order('published_at', { ascending: false });

  if (!allError && allArticles) {
    console.log(`\n📚 Remaining articles in database (${allArticles.length} total):`);
    allArticles.forEach(article => {
      console.log(`  - "${article.title}" (${article.category}) - ${article.id}`);
    });
  }
}

// Run the cleanup
removePhantomArticle().catch(console.error);