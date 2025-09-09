#!/usr/bin/env node

/**
 * Script to clear service worker cache and force a fresh start
 * Use this when experiencing white page issues or stale cache problems
 */

console.log('🧹 Clearing service worker cache...\n');

console.log('To clear service worker cache in your browser:');
console.log('1. Open Developer Tools (F12 or Cmd+Option+I)');
console.log('2. Go to the Application tab');
console.log('3. Click on "Storage" in the left sidebar');
console.log('4. Click "Clear site data"');
console.log('\nAlternatively:');
console.log('1. Go to Application tab > Service Workers');
console.log('2. Click "Unregister" for all service workers');
console.log('3. Go to Application tab > Storage > Clear site data');
console.log('\nOr use these keyboard shortcuts:');
console.log('- Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)');
console.log('- Force reload without cache');

console.log('\n📝 You can also add this to your index.html temporarily:');
console.log(`
<script>
  // Clear all service workers on load (remove after fixing)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
    // Clear all caches
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
</script>
`);

console.log('\n✅ Instructions provided. Please follow the steps above in your browser.');