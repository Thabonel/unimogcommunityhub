// Debug environment variables in development
console.log('🔍 Environment Variables Debug:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET (length: ' + process.env.VITE_SUPABASE_ANON_KEY.length + ')' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('---');
console.log('All VITE_ variables:');
Object.keys(process.env)
  .filter(key => key.startsWith('VITE_'))
  .forEach(key => {
    const value = process.env[key];
    if (key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN')) {
      console.log(`${key}: SET (length: ${value?.length || 0})`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });