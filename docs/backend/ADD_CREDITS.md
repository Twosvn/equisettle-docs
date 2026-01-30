# Claude API - Add Credits

## The Issue

Your Claude API key is valid but has no credits. You need to add credits to your Anthropic account.

## Quick Fix: Add Credits to Claude

1. Go to https://console.anthropic.com/settings/billing
2. Click "Add Credits"
3. Add $5-10 (this will last months)
4. Wait 1-2 minutes for credits to activate
5. Test again

## Alternative: Switch to OpenAI (Faster)

If you want to test NOW, switch to OpenAI:

### 1. Update .env

```bash
# Change these lines in .env:
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
LLM_MODEL=gpt-4-turbo-preview
```

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy it (starts with `sk-`)
4. Add to `.env`

### 3. Restart Backend

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test Again

```bash
curl -X POST http://localhost:7001/api/v1/agentic/recommend-terms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "69091c47dc897c0c055b820e"}'
```

## Cost Comparison

**Claude:**
- Need to pre-purchase credits ($5 minimum)
- ~$0.01-0.03 per request
- Better reasoning

**OpenAI:**
- Pay-as-you-go (no minimum)
- ~$0.03-0.10 per request  
- Faster responses

## Recommendation

**For testing now:** Use OpenAI (no minimum purchase)  
**For production:** Use Claude (cheaper long-term)

You can switch between them anytime by changing 2 lines in `.env`!
