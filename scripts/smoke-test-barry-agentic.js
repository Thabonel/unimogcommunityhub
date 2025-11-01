#!/usr/bin/env node
/*
  Simple smoke tests for chat-with-barry-agentic

  Usage:
    export SUPABASE_URL="https://<project>.supabase.co"
    export TEST_JWT="<user_jwt_token>"    # from your staging UI
    node scripts/smoke-test-barry-agentic.js
*/

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const TEST_JWT = process.env.TEST_JWT;

if (!SUPABASE_URL || !TEST_JWT) {
  console.error('Missing env. Set SUPABASE_URL and TEST_JWT');
  process.exit(1);
}

const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/chat-with-barry-agentic`;

async function callBarry(messages, location) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_JWT}`
    },
    body: JSON.stringify({ messages, location })
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch (_) { json = { raw: text }; }
  return { status: res.status, json };
}

async function run() {
  console.log('🔎 Endpoint:', endpoint);

  // 1) Technical (procedure) — should route to manual mode
  console.log('\n1) Technical: replace the portal hub seal');
  let r = await callBarry([{ role: 'user', content: 'How do I replace the front portal hub seal on a U435?' }]);
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.json).slice(0, 600));

  // 2) RPS exploded view — should include illustrations
  console.log('\n2) RPS: exploded view request');
  r = await callBarry([{ role: 'user', content: 'Show me the exploded view for the portal hub' }]);
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.json).slice(0, 600));

  // 3) Ambiguous — should ask one clarifying question
  console.log('\n3) Ambiguous: hub is leaking');
  r = await callBarry([{ role: 'user', content: 'My hub is leaking' }]);
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.json).slice(0, 600));

  // 4) Weather — with location
  console.log('\n4) Weather: tomorrow forecast with location');
  r = await callBarry([
    { role: 'user', content: 'What is the weather like tomorrow?' }
  ], { latitude: -33.8688, longitude: 151.2093 }); // Sydney as example
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.json).slice(0, 600));

  // 5) Weather — without location (should prompt for location)
  console.log('\n5) Weather: without location');
  r = await callBarry([
    { role: 'user', content: 'Weather today?' }
  ]);
  console.log('Status:', r.status);
  console.log('Response:', JSON.stringify(r.json).slice(0, 600));

  console.log('\n✅ Smoke tests complete');
}

run().catch(err => {
  console.error('Smoke test error:', err);
  process.exit(1);
});

