/**
 * Create Test User for Playwright Tests
 *
 * Creates a test user account in Supabase for automated testing
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const TEST_USER = {
  email: 'test@unimogcommunityhub.com',
  password: 'TestPassword123!',
  email_confirm: true,
  user_metadata: {
    full_name: 'Test User',
    created_by: 'automated_test_setup'
  }
};

async function createTestUser() {
  console.log('Creating test user...');
  console.log('Email:', TEST_USER.email);

  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();

    if (checkError) {
      console.error('Error checking existing users:', checkError);
      throw checkError;
    }

    const existingUser = existingUsers?.users.find(u => u.email === TEST_USER.email);

    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('User ID:', existingUser.id);
      console.log('Email:', existingUser.email);
      console.log('Created at:', existingUser.created_at);

      // Update password to ensure it's known
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: TEST_USER.password }
      );

      if (updateError) {
        console.warn('Warning: Could not update password:', updateError.message);
      } else {
        console.log('✅ Password updated');
      }

      return existingUser;
    }

    // Create new test user
    const { data, error } = await supabase.auth.admin.createUser({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true,
      user_metadata: TEST_USER.user_metadata
    });

    if (error) {
      console.error('Error creating test user:', error);
      throw error;
    }

    console.log('✅ Test user created successfully');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: 'Test User',
        username: 'testuser',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.warn('Warning: Could not create profile:', profileError.message);
    } else {
      console.log('✅ User profile created');
    }

    console.log('\nTest user credentials:');
    console.log('Email:', TEST_USER.email);
    console.log('Password:', TEST_USER.password);
    console.log('\nAdd these to your .env file:');
    console.log(`TEST_USER_EMAIL=${TEST_USER.email}`);
    console.log(`TEST_USER_PASSWORD=${TEST_USER.password}`);

    return data.user;

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

createTestUser()
  .then(() => {
    console.log('\n✅ Test user setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create test user:', error);
    process.exit(1);
  });
