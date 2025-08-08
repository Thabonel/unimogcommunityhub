
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with admin privileges using service_role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase connection');
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    let isAuthorized = false;
    let userId = null;
    
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: 'Authorization header required' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
      
      if (authError || !user) {
        console.error("Auth error:", authError);
        return new Response(JSON.stringify({ 
          error: 'Invalid authentication token' 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      userId = user.id;
      console.log("Authenticated user:", { userId, email: user.email });
      
      // Check if the authenticated user is an admin using direct query
      const { data: adminRole, error: roleCheckError } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (!roleCheckError && adminRole) {
        isAuthorized = true;
        console.log("User is admin:", userId);
      } else {
        console.log("User is not admin:", { userId, error: roleCheckError });
      }
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return new Response(JSON.stringify({ 
        error: 'Authentication failed' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!isAuthorized) {
      return new Response(JSON.stringify({ 
        error: 'Forbidden. Admin access required. User must have admin role in user_roles table.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body
    let body = {};
    if (req.method !== 'GET') {
      try {
        body = await req.json();
      } catch (e) {
        console.warn("Failed to parse request body:", e);
        body = {};
      }
    }
    
    const { operation, userId: targetUserId } = body;
    
    // Handle operations
    switch (operation) {
      case 'get_all_users': {
        try {
          // Get all users (excluding service accounts)
          const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
          
          if (usersError) {
            throw usersError;
          }
          
          // Return users without sensitive information
          const sanitizedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_anonymous: !!user.app_metadata?.provider && user.app_metadata.provider === 'anonymous'
          }));
          
          return new Response(JSON.stringify(sanitizedUsers), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (fetchError) {
          console.error("Error fetching users:", fetchError);
          return new Response(JSON.stringify({ error: `Error fetching users: ${fetchError.message}` }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
        
      case 'delete_user': {
        if (!targetUserId) {
          throw new Error('User ID is required');
        }
        
        // Delete the user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
        
        if (deleteError) {
          throw deleteError;
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      case 'get_user_location': {
        // Get client IP address
        const forwarded = req.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(/\s*,\s*/)[0] : req.headers.get('cf-connecting-ip') || '127.0.0.1';
        
        try {
          // Use a free IP geolocation API
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
          const geoData = await geoResponse.json();
          
          if (geoData.error) {
            throw new Error(geoData.reason || 'Geolocation failed');
          }
          
          // Return the location data
          return new Response(JSON.stringify({
            ip,
            country: geoData.country_name,
            country_code: geoData.country_code,
            region: geoData.region,
            city: geoData.city,
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            timezone: geoData.timezone
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (geoError) {
          console.error('Geolocation error:', geoError);
          return new Response(JSON.stringify({ 
            error: 'Failed to get location from IP',
            message: geoError.message
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid operation' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
