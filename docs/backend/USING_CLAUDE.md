# Using Claude (Anthropic) Instead of OpenAI

## Why Claude?

**Claude 3.5 Sonnet is excellent for:**
- ✅ Better reasoning and analysis
- ✅ More detailed explanations
- ✅ Better at following complex instructions
- ✅ Cheaper than GPT-4 ($3/M tokens vs $10/M)
- ✅ Longer context window (200K tokens)

## Configuration

Add to your `.env`:

```bash
# Agentic AI System Configuration (Using Claude)
ENABLE_AGENTIC=true
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
LLM_MODEL=claude-3-5-sonnet-20241022
MCP_PYTHON_URL=http://localhost:8001
MCP_PYTHON_API_KEY=test-api-key-123
MCP_TYPESCRIPT_URL=http://localhost:3002
SKILLS_DIRECTORY=./skills
AGENTIC_MAX_ITERATIONS=10
AGENTIC_TIMEOUT_MS=30000
AGENTIC_STREAMING=true
```

## Get Your Claude API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys"
4. Create a new key
5. Copy the key (starts with `sk-ant-`)

## Start the Backend

```bash
cd /Users/dos/eqs-production/eqs-platform-be
npm run dev
```

Look for: `✅ Agentic engine initialized successfully`

## Test It

```bash
# Health check
curl http://localhost:3000/api/v1/agentic/health

# Should show:
# "llmProvider": "anthropic"
# "llmModel": "claude-3-5-sonnet-20241022"
```

## Cost Comparison

**Claude 3.5 Sonnet:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- **Typical request: ~$0.01-0.03**

**GPT-4 Turbo:**
- Input: $10 per 1M tokens
- Output: $30 per 1M tokens
- **Typical request: ~$0.03-0.10**

**Claude is ~3x cheaper!**

## Switch Back to OpenAI Anytime

Just change in `.env`:
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
LLM_MODEL=gpt-4-turbo-preview
```

The system works with both!
