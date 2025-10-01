# ChatGPT Integration Setup Guide

## Overview
Barry the AI Mechanic is now powered by OpenAI's ChatGPT. This guide will help you set up the integration.

## Prerequisites
1. An OpenAI account
2. An API key from OpenAI
3. The UnimogCommunityHub project set up locally

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **Important**: Save this key securely - you won't be able to see it again!

## Setting Up the Integration

### 1. Environment Variables
Create a `.env` file in the project root (if it doesn't exist) and add:

```bash
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

### 2. Verify Setup
1. Start the development server: `npm run dev`
2. Navigate to Knowledge Base > AI Mechanic
3. Barry should greet you and be ready to answer questions

## Usage

### Barry's Capabilities
Barry can help with:
- Step-by-step maintenance procedures
- Troubleshooting mechanical issues
- Recommending tools and parts
- Explaining technical specifications
- Providing torque values and fluid capacities
- Offering tips for off-road preparation

### Sample Questions
- "How do I replace portal seals on a U1700L?"
- "What's the correct tire pressure for sand driving?"
- "My Unimog is making a grinding noise when turning"
- "What tools do I need for transmission service?"

## API Usage and Costs

### Model
Barry uses `gpt-4-turbo-preview` for the best quality responses.

### Rate Limits
- Default: 10,000 tokens per minute
- Adjust in `src/services/chatgpt/chatgptService.ts` if needed

### Cost Estimation
- Each conversation typically uses 500-1500 tokens
- Check [OpenAI Pricing](https://openai.com/pricing) for current rates

## Security Best Practices

### Development
- Never commit `.env` files to git
- Use environment variables only
- The API key is only used in the browser for development

### Production
1. **DO NOT** use the API key directly in the browser
2. Set up a backend proxy endpoint
3. Implement rate limiting
4. Add user authentication checks
5. Monitor API usage

### Example Backend Proxy (Node.js)
```javascript
// server.js
app.post('/api/chat', authenticate, async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: BARRY_SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]
    });
    
    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Chat service unavailable' });
  }
});
```

## Troubleshooting

### Barry not responding
1. Check the browser console for errors
2. Verify your API key is correct
3. Ensure you have API credits in your OpenAI account
4. Check if you've hit rate limits

### API Key Issues
- Make sure the key starts with `sk-`
- Verify it's in the `.env` file correctly
- Restart the dev server after adding the key

### Network Errors
- Check your internet connection
- Verify OpenAI services are operational
- Check for firewall/proxy issues

## Customizing Barry

### Personality
Edit `BARRY_SYSTEM_PROMPT` in `src/services/chatgpt/chatgptService.ts`

### Model Selection
Change the model in `chatgptService.ts`:
- `gpt-4-turbo-preview` (current - best quality)
- `gpt-4` (slower but very capable)
- `gpt-3.5-turbo` (faster, cheaper, still good)

### Response Length
Adjust `max_tokens` in the API call (default: 800)

## Support
For issues specific to:
- OpenAI API: Check [OpenAI Documentation](https://platform.openai.com/docs)
- This integration: Create an issue in the project repository