# Testing Agentic System Locally - Step by Step

## Prerequisites Check

Before we start, make sure you have:
- ✅ Node.js installed
- ✅ Python 3.8+ installed
- ✅ MongoDB running
- ✅ OpenAI API key (or Anthropic API key)

## Step 1: Install Node.js Dependencies

```bash
cd /Users/dos/eqs-production/eqs-platform-be
npm install openai @anthropic-ai/sdk axios js-yaml
```

## Step 2: Configure Environment

Add these to your `.env` file:

```bash
# Enable agentic features
ENABLE_AGENTIC=true

# LLM Configuration
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-key-here
LLM_MODEL=gpt-4-turbo-preview

# MCP Server URLs (localhost)
MCP_PYTHON_URL=http://localhost:8001
MCP_PYTHON_API_KEY=test-api-key-123
MCP_TYPESCRIPT_URL=http://localhost:3002

# Skills directory
SKILLS_DIRECTORY=/Users/dos/eqs-production/eqs-platform-be/skills

# Agentic config
AGENTIC_MAX_ITERATIONS=10
AGENTIC_TIMEOUT_MS=30000
AGENTIC_STREAMING=true
```

## Step 3: Start Python MCP Server (Terminal 1)

```bash
cd /Users/dos/eqs-production/equisettle-llm-model
python mcp_server.py
```

Expected output:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8001
```

Test it:
```bash
curl http://localhost:8001/health
```

## Step 4: Start TypeScript MCP Server (Terminal 2)

```bash
cd /Users/dos/eqs-production/eqs-mcp-server
npm install
npm run dev
```

Expected output:
```
MCP Server running on port 3002
```

Test it:
```bash
curl http://localhost:3002/health
```

## Step 5: Start Main Backend (Terminal 3)

```bash
cd /Users/dos/eqs-production/eqs-platform-be
npm run dev
```

Look for these logs:
```
✅ Agentic engine initialized successfully
✅ Agentic routes registered at /api/v1/agentic
```

## Step 6: Test Health Endpoint

```bash
curl http://localhost:3000/api/v1/agentic/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "llmProvider": "openai",
    "llmModel": "gpt-4-turbo-preview",
    "mcpServers": [
      { "server": "tensorflow-models", "status": "healthy" },
      { "server": "business-tools", "status": "healthy" }
    ],
    "skillsCount": 1,
    "activeConversations": 0
  }
}
```

## Step 7: Get JWT Token

You need a valid JWT token to test protected endpoints. 

**Option A: Login via API**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Copy the `token` from the response.

**Option B: Use existing token from browser**
- Open your app in browser
- Login
- Open DevTools → Application → Local Storage
- Copy the JWT token

## Step 8: Test Payment Terms Recommendation

```bash
# Replace YOUR_JWT_TOKEN with actual token
export JWT_TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/api/v1/agentic/recommend-terms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "customerId": "test-customer-123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "conversationId": "agentic_1738172327_abc123",
    "recommendation": "Net 30 with 2% early payment discount for Net 10",
    "reasoning": [
      {
        "type": "tool_call",
        "tool": "get_customer_risk_score",
        "input": { "customerId": "test-customer-123" },
        "output": { "riskScore": 25, "riskLevel": "low" }
      },
      {
        "type": "decision",
        "content": "Based on low risk score and excellent payment history...",
        "confidence": "high"
      }
    ],
    "confidence": "high",
    "alternatives": [
      "Net 45 for larger orders",
      "Net 15 if faster cash flow needed"
    ],
    "metadata": {
      "duration": 3500,
      "iterations": 2,
      "toolCallsCount": 3,
      "model": "gpt-4-turbo-preview"
    }
  }
}
```

## Step 9: Test Available Skills

```bash
curl http://localhost:3000/api/v1/agentic/skills \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Step 10: Test Conversation Continuation

```bash
# Use conversationId from previous response
curl -X POST http://localhost:3000/api/v1/agentic/conversation/agentic_1738172327_abc123/continue \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{
    "message": "What if this customer has seasonal revenue?"
  }'
```

## Troubleshooting

### "Agentic engine not initialized"
- Check `.env` has `ENABLE_AGENTIC=true`
- Restart backend server
- Check logs for initialization errors

### "Tool not found"
- Verify both MCP servers are running
- Test health endpoints: `curl http://localhost:8001/health` and `curl http://localhost:3002/health`
- Check MCP server URLs in `.env`

### "OpenAI API error: 401"
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Try a different API key

### "Skills not found"
- Check `SKILLS_DIRECTORY` path in `.env`
- Verify `skills/payment-terms/SKILL.md` exists
- Check file permissions

### Python MCP server won't start
- Install dependencies: `pip install fastapi uvicorn tensorflow pymongo python-dotenv`
- Check port 8001 is not in use: `lsof -i :8001`
- Check MongoDB is running

### TypeScript MCP server won't start
- Run `npm install` in `eqs-mcp-server`
- Check port 3002 is not in use: `lsof -i :3002`
- Check for TypeScript errors

## Quick Test Script

Save this as `test-agentic.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Agentic System..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test health endpoint
echo "1. Testing health endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/v1/agentic/health)
if echo "$HEALTH" | grep -q "healthy"; then
  echo -e "${GREEN}✅ Health check passed${NC}"
else
  echo -e "${RED}❌ Health check failed${NC}"
  echo "$HEALTH"
  exit 1
fi

echo ""
echo "2. Testing skills endpoint..."
SKILLS=$(curl -s http://localhost:3000/api/v1/agentic/skills \
  -H "Authorization: Bearer $JWT_TOKEN")
if echo "$SKILLS" | grep -q "payment-terms"; then
  echo -e "${GREEN}✅ Skills loaded${NC}"
else
  echo -e "${RED}❌ Skills not found${NC}"
  echo "$SKILLS"
fi

echo ""
echo "3. Testing payment terms recommendation..."
RESULT=$(curl -s -X POST http://localhost:3000/api/v1/agentic/recommend-terms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"customerId": "test-123"}')

if echo "$RESULT" | grep -q "recommendation"; then
  echo -e "${GREEN}✅ Payment terms recommendation works${NC}"
  echo "Response preview:"
  echo "$RESULT" | jq '.data.recommendation' 2>/dev/null || echo "$RESULT"
else
  echo -e "${RED}❌ Payment terms failed${NC}"
  echo "$RESULT"
fi

echo ""
echo "🎉 Testing complete!"
```

Make it executable and run:
```bash
chmod +x test-agentic.sh
export JWT_TOKEN="your-token-here"
./test-agentic.sh
```

## What to Watch For

**Good signs:**
- ✅ All 3 servers start without errors
- ✅ Health endpoint returns "healthy"
- ✅ Skills are discovered
- ✅ LLM makes tool calls
- ✅ Recommendations include reasoning

**Red flags:**
- ❌ "Connection refused" - MCP server not running
- ❌ "Unauthorized" - Invalid JWT token
- ❌ "Tool not found" - MCP client can't connect
- ❌ "Skill not found" - Skills directory misconfigured
- ❌ High response times (>10s) - Check LLM model selection

## Next Steps After Testing

1. **Monitor costs** - Check OpenAI dashboard for API usage
2. **Test edge cases** - Try invalid customer IDs, missing data
3. **Create more skills** - Add customer-risk-assessment, cash-flow-forecast
4. **Frontend integration** - Build UI to display reasoning steps
5. **Production deployment** - Add rate limiting, monitoring, error tracking
