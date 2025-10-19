// EXAMPLE: How to integrate model-adapter-simple.ts into Barry's index.ts
// This shows the minimal changes needed for hot-swappable models

import { callAI } from './model-adapter-simple.ts';

// BEFORE (Direct OpenAI call - Lines ~420-450):
const expandResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a search query expansion system...'
      },
      { role: 'user', content: userQuestion }
    ],
    temperature: 0.3,
    max_tokens: 500
  })
});

const expandData = await expandResponse.json();
const expandedTerms = JSON.parse(expandData.choices[0].message.content);

// AFTER (Hot-swappable - using adapter):
const expandResult = await callAI(
  supabaseClient,  // Already available in index.ts
  'barry_query_expansion',
  [
    {
      role: 'system',
      content: 'You are a search query expansion system...'
    },
    { role: 'user', content: userQuestion }
  ]
);

const expandedTerms = JSON.parse(expandResult.content);

// ---

// BEFORE (Reranking - Lines ~520-560):
const rerankResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a search result ranker...'
      },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 200
  })
});

const rerankData = await rerankResponse.json();
const scores = JSON.parse(rerankData.choices[0].message.content);

// AFTER (Hot-swappable):
const rerankResult = await callAI(
  supabaseClient,
  'barry_reranking',
  [
    {
      role: 'system',
      content: 'You are a search result ranker...'
    },
    { role: 'user', content: prompt }
  ]
);

const scores = JSON.parse(rerankResult.content);

// ---

// BEFORE (Verification - Lines ~710-750):
const verifyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a relevance verification system...'
      },
      { role: 'user', content: verifyPrompt }
    ],
    temperature: 0.2,
    max_tokens: 200
  })
});

const verifyData = await verifyResponse.json();
const relevanceScores = JSON.parse(verifyData.choices[0].message.content);

// AFTER (Hot-swappable):
const verifyResult = await callAI(
  supabaseClient,
  'barry_verification',
  [
    {
      role: 'system',
      content: 'You are a relevance verification system...'
    },
    { role: 'user', content: verifyPrompt }
  ]
);

const relevanceScores = JSON.parse(verifyResult.content);

// ---

// BEFORE (Main Response - Lines ~1100-1112):
const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1500
  })
});

const data = await openAIResponse.json();
const finalContent = data.choices[0].message.content;

// AFTER (Hot-swappable):
const mainResult = await callAI(
  supabaseClient,
  'barry_main_response',
  [
    { role: 'system', content: systemPrompt },
    ...messages
  ]
);

const finalContent = mainResult.content;

// Update chat log with provider info:
await supabaseClient.from('chat_logs').insert({
  user_id: user.id,
  messages: messages,
  response: finalContent,
  model: `${mainResult.provider}/${mainResult.model}`,  // Now shows actual provider!
  tokens_used: mainResult.usage?.total_tokens || 0,
  // ... rest of fields
});

// ---

// SUMMARY OF CHANGES:
// 1. Add import at top: import { callAI } from './model-adapter-simple.ts';
// 2. Replace 4 fetch() calls with callAI()
// 3. Use result.content instead of data.choices[0].message.content
// 4. Done! Models now hot-swappable via database
