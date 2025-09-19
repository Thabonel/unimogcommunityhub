// Test Gemini API connectivity
// Replace 'your_gemini_api_key_here' with actual key when testing

const API_KEY = 'your_gemini_api_key_here'; // Replace with real key from Netlify
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...');
  console.log('📍 API Endpoint:', URL.split('?')[0]);

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "Say 'API working perfectly' if you receive this test message" }]
        }]
      })
    });

    console.log('📡 Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ API Response received');

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      console.log('🤖 Gemini says:', responseText);
      console.log('🎉 Gemini API is working correctly!');
      return true;
    } else {
      console.error('❌ Unexpected response format:', data);
      return false;
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

// Instructions for running the test
console.log('📋 To test Gemini API:');
console.log('1. Get VITE_GEMINI_API_KEY from Netlify dashboard');
console.log('2. Replace "your_gemini_api_key_here" with actual key');
console.log('3. Run: node test-gemini-api.js');
console.log('4. Should see "API working perfectly" message');
console.log('');

if (API_KEY === 'your_gemini_api_key_here') {
  console.log('⚠️  API key not set. Please update the API_KEY variable with your actual Gemini API key.');
} else {
  testGeminiAPI();
}