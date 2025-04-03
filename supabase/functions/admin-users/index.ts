
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
    
    // Authenticate the request - but with fallback for development
    const authHeader = req.headers.get('Authorization');
    let isAuthorized = false;
    let userId = null;
    
    if (Deno.env.get('ENVIRONMENT') === 'development') {
      console.log("Development mode: Bypassing auth check");
      isAuthorized = true;
      userId = 'development_user';
    } else if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
        
        if (!authError && user) {
          userId = user.id;
          
          // Check if the authenticated user is an admin
          const { data: isAdmin, error: roleCheckError } = await supabaseAdmin.rpc('has_role', {
            _role: 'admin'
          });
          
          if (!roleCheckError && isAdmin) {
            isAuthorized = true;
          }
        }
      } catch (authErr) {
        console.error("Auth error:", authErr);
        // Continue with unauthorized status
      }
    }
    
    if (!isAuthorized) {
      return new Response(JSON.stringify({ 
        error: 'Forbidden. Admin access required',
        development_note: 'For development, set ENVIRONMENT=development in your edge function secrets'
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
        // For development, return mock users
        if (Deno.env.get('ENVIRONMENT') === 'development') {
          const mockUsers = [
            {
              id: "dev-user-1",
              email: "admin@example.com",
              created_at: new Date(2024, 0, 1).toISOString(),
              last_sign_in_at: new Date(2025, 2, 30).toISOString(),
              is_anonymous: false
            },
            {
              id: "dev-user-2",
              email: "user@example.com",
              created_at: new Date(2024, 1, 15).toISOString(),
              last_sign_in_at: new Date(2025, 3, 1).toISOString(),
              is_anonymous: false
            }
          ];
          
          return new Response(JSON.stringify(mockUsers), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
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
        
        // In development mode, simulate success without actual deletion
        if (Deno.env.get('ENVIRONMENT') === 'development') {
          return new Response(JSON.stringify({ success: true, mode: 'development' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
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
