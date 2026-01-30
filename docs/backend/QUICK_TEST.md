# Quick Test Guide

## Start All Services (3 Terminals)

### Terminal 1: Python MCP Server
```bash
cd /Users/dos/eqs-production/equisettle-llm-model
./start-server.sh
```
Should see: `INFO: Uvicorn running on http://0.0.0.0:8001`

### Terminal 2: TypeScript MCP Server
```bash
cd /Users/dos/eqs-production/eqs-mcp-server
npm run dev
```
Should see: `MCP Server running on port 3002`

### Terminal 3: Main Backend
```bash
cd /Users/dos/eqs-production/eqs-platform-be

# Add OpenAI key to .env first:
echo "ENABLE_AGENTIC=true" >> .env
echo "LLM_PROVIDER=openai" >> .env
echo "OPENAI_API_KEY=sk-your-key-here" >> .env
echo "MCP_PYTHON_URL=http://localhost:8001" >> .env
echo "MCP_TYPESCRIPT_URL=http://localhost:3002" >> .env

npm run dev
```
Look for: `✅ Agentic engine initialized successfully`

## Test It

```bash
# 1. Health check (no auth needed)
curl http://localhost:3000/api/v1/agentic/health

# 2. Login to get JWT token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "password": "yourpass"}'

# 3. Test payment terms (replace TOKEN)
curl -X POST http://localhost:3000/api/v1/agentic/recommend-terms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"customerId": "test-123"}'
```

## What Happens

1. **Your request** → Backend API
2. **Agentic engine** loads payment-terms skill
3. **OpenAI** reads skill, decides to call tools
4. **MCP client** routes calls to your Python/TypeScript servers
5. **Your tools** return data (NO AI in them)
6. **OpenAI** analyzes data and makes recommendation
7. **Response** includes reasoning, confidence, alternatives

**Cost:** ~$0.01-0.05 per request (OpenAI API)
