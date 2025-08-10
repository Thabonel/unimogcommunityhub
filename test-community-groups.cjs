const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Community Groups');
console.log('========================');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCommunityGroups() {
  try {
    // Test 1: Check if table exists
    console.log('\n1. Testing community_groups table:');
    const { data: groups, error: groupsError } = await supabase
      .from('community_groups')
      .select('*')
      .limit(5);
    
    if (groupsError) {
      console.log('❌ Error fetching groups:', groupsError.message);
      console.log('   Error code:', groupsError.code);
      console.log('   Error details:', groupsError.details);
      
      // Check if table exists
      if (groupsError.code === '42P01') {
        console.log('\n⚠️  Table "community_groups" does not exist!');
        console.log('   Need to create the table first.');
      }
    } else {
      console.log('✅ Table exists and is accessible');
      console.log('   Found', groups?.length || 0, 'groups');
    }

    // Test 2: Check members table
    console.log('\n2. Testing community_group_members table:');
    const { data: members, error: membersError } = await supabase
      .from('community_group_members')
      .select('*')
      .limit(5);
    
    if (membersError) {
      console.log('❌ Error fetching members:', membersError.message);
      if (membersError.code === '42P01') {
        console.log('   Table "community_group_members" does not exist!');
      }
    } else {
      console.log('✅ Members table exists');
      console.log('   Found', members?.length || 0, 'member records');
    }

    // Test 3: Check posts table
    console.log('\n3. Testing community_group_posts table:');
    const { data: posts, error: postsError } = await supabase
      .from('community_group_posts')
      .select('*')
      .limit(5);
    
    if (postsError) {
      console.log('❌ Error fetching posts:', postsError.message);
      if (postsError.code === '42P01') {
        console.log('   Table "community_group_posts" does not exist!');
      }
    } else {
      console.log('✅ Posts table exists');
      console.log('   Found', posts?.length || 0, 'posts');
    }

  } catch (error) {
    console.error('\nUnexpected error:', error);
  }
}

testCommunityGroups();