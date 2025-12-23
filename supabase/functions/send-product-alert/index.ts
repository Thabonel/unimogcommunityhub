import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertPayload {
  product_id: string;
  product_title: string;
  alert_type: 'unavailable' | 'price_drop' | 'price_increase';
  old_status?: string;
  new_status?: string;
  old_price?: number;
  new_price?: number;
  currency?: string;
  change_percent?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: AlertPayload = await req.json();

    console.log('[Product Alert] Processing alert:', payload);

    const { data: adminPrefs, error: prefsError } = await supabaseAdmin
      .from('admin_sms_preferences')
      .select('phone_number, user_id')
      .eq('enabled', true)
      .single();

    if (prefsError || !adminPrefs) {
      console.log('[Product Alert] No admin preferences found or SMS disabled');
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'No admin preferences configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: adminUser, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', adminPrefs.user_id)
      .single();

    if (userError || !adminUser) {
      console.log('[Product Alert] Admin user not found');
      return new Response(
        JSON.stringify({ status: 'skipped', reason: 'Admin user not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let smsMessage = '';
    let emailSubject = '';
    let emailMessage = '';

    if (payload.alert_type === 'unavailable') {
      smsMessage = `ALERT: "${payload.product_title}" is now UNAVAILABLE on Amazon (was: ${payload.old_status})`;
      emailSubject = `Product Unavailable: ${payload.product_title}`;
      emailMessage = `The affiliate product "${payload.product_title}" has become unavailable on Amazon.\n\nPrevious status: ${payload.old_status}\nCurrent status: ${payload.new_status}\n\nPlease review the product listing.`;
    } else if (payload.alert_type === 'price_drop') {
      const changeText = payload.change_percent ? ` (${payload.change_percent.toFixed(1)}% drop)` : '';
      smsMessage = `DEAL: "${payload.product_title}" price dropped from ${payload.currency} ${payload.old_price} to ${payload.currency} ${payload.new_price}${changeText}`;
      emailSubject = `Price Drop Alert: ${payload.product_title}`;
      emailMessage = `Good news! The price for "${payload.product_title}" has dropped.\n\nOld price: ${payload.currency} ${payload.old_price}\nNew price: ${payload.currency} ${payload.new_price}\nChange: ${payload.change_percent?.toFixed(1)}%\n\nThis could increase affiliate conversion rates!`;
    } else if (payload.alert_type === 'price_increase') {
      const changeText = payload.change_percent ? ` (${payload.change_percent.toFixed(1)}% increase)` : '';
      smsMessage = `NOTICE: "${payload.product_title}" price increased from ${payload.currency} ${payload.old_price} to ${payload.currency} ${payload.new_price}${changeText}`;
      emailSubject = `Price Increase Alert: ${payload.product_title}`;
      emailMessage = `The price for "${payload.product_title}" has increased.\n\nOld price: ${payload.currency} ${payload.old_price}\nNew price: ${payload.currency} ${payload.new_price}\nChange: ${payload.change_percent?.toFixed(1)}%\n\nConsider updating product description or monitoring conversion rates.`;
    }

    const { error: smsError } = await supabaseAdmin
      .from('admin_sms_log')
      .insert({
        phone_number: adminPrefs.phone_number,
        message: smsMessage,
        status: 'pending',
        metadata: { alert_type: payload.alert_type, product_id: payload.product_id }
      });

    if (smsError) {
      console.error('[Product Alert] Failed to queue SMS:', smsError);
    } else {
      console.log('[Product Alert] SMS queued successfully');
    }

    const { error: emailError } = await supabaseAdmin
      .from('admin_email_log')
      .insert({
        recipient_email: adminUser.email,
        subject: emailSubject,
        message: emailMessage,
        status: 'pending',
        metadata: { alert_type: payload.alert_type, product_id: payload.product_id }
      });

    if (emailError) {
      console.error('[Product Alert] Failed to queue email:', emailError);
    } else {
      console.log('[Product Alert] Email queued successfully');
    }

    const smsPromise = fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-admin-sms`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      }
    });

    const emailPromise = fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-admin-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json'
      }
    });

    await Promise.allSettled([smsPromise, emailPromise]);

    return new Response(
      JSON.stringify({
        status: 'success',
        alert_type: payload.alert_type,
        notifications_sent: {
          sms: !smsError,
          email: !emailError
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Product Alert] Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
