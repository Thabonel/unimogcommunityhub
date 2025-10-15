import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const handler = async (event, context) => {
  console.log('🔍 Starting signup health check...');

  try {
    const testEmail = `healthcheck-${Date.now()}@unimogtest.com`;
    const testPassword = 'TestPassword123!@#';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`📧 Testing signup with: ${testEmail}`);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Health Check Test User'
        }
      }
    });

    if (signupError) {
      console.error('❌ SIGNUP FAILED:', signupError);

      await sendCriticalAlert({
        subject: '🚨 CRITICAL: User Signup is BROKEN',
        message: `Signup test FAILED at ${new Date().toISOString()}

Error: ${signupError.message}

This means REAL USERS CANNOT CREATE ACCOUNTS RIGHT NOW!

Fix immediately:
1. Check Supabase logs: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/logs/postgres-logs
2. Run diagnostic: SELECT * FROM signup_health_check;
3. Check triggers: SELECT * FROM pg_trigger WHERE tgname LIKE '%user%';

Last successful test: Check admin_email_log for previous health checks`,
        error: signupError
      });

      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: signupError.message,
          timestamp: new Date().toISOString()
        })
      };
    }

    console.log('✅ Signup successful:', signupData.user?.id);

    const userId = signupData.user?.id;

    if (userId) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('🧹 Cleaning up test user...');

      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

      if (deleteError) {
        console.warn('⚠️ Failed to delete test user:', deleteError);
      } else {
        console.log('✅ Test user cleaned up');
      }
    }

    console.log('✅ Health check passed');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Signup is working',
        testEmail,
        userId,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('💥 Unexpected error:', error);

    await sendCriticalAlert({
      subject: '🚨 CRITICAL: Signup Health Check CRASHED',
      message: `Health check crashed at ${new Date().toISOString()}

Error: ${error.message}

Stack: ${error.stack}`,
      error
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

async function sendCriticalAlert({ subject, message, error }) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: emailError } = await supabase
      .from('admin_email_log')
      .insert({
        event_type: 'error',
        event_id: crypto.randomUUID(),
        subject: subject,
        message: message,
        recipient_email: 'thabonel0@gmail.com',
        status: 'pending'
      });

    if (emailError) {
      console.error('Failed to queue alert email:', emailError);
    } else {
      console.log('📧 Alert email queued');
    }

    console.error('🚨 CRITICAL ALERT:', subject);
    console.error('Error details:', error);

  } catch (alertError) {
    console.error('Failed to send alert:', alertError);
  }
}

export const config = {
  schedule: '@hourly'
};
