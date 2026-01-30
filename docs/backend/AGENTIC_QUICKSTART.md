# Agentic System - Quick Start

## What Was Built

I've implemented a complete agentic AI system for your ÉquiSettle platform that integrates with your existing workflow engine. Here's what you have:

### Core Components

1. **Agentic Engine** (`src/services/agentic/agentic-engine.js`)
   - Multi-step reasoning loop
   - LLM orchestration (OpenAI or Anthropic)
   - Tool execution via MCP servers
   - Conversation management

2. **MCP Client** (`src/services/agentic/mcp-client.js`)
   - Connects to Python MCP server (TensorFlow models)
   - Connects to TypeScript MCP server (business tools)
   - Tool discovery and routing

3. **LLM Provider** (`src/services/agentic/llm-provider.js`)
   - Supports OpenAI GPT-4
   - Supports Anthropic Claude
   - Function calling and streaming

4. **Skills Manager** (`src/services/agentic/skills-manager.js`)
   - Loads markdown-based skills
   - YAML frontmatter parsing
   - Skill caching and hot-reloading

5. **Sample Skill** (`skills/payment-terms/SKILL.md`)
   - Payment terms recommendation logic
   - Risk assessment guidelines
   - Industry-specific context

6. **API Endpoints** (`src/routes/agentic-routes.js`)
   - `POST /api/v1/agentic/recommend-terms`
   - `POST /api/v1/agentic/analyze-customer`
   - `POST /api/v1/agentic/forecast-cashflow`
   - `GET /api/v1/agentic/conversation/:id`
   - `POST /api/v1/agentic/conversation/:id/continue`
   - `GET /api/v1/agentic/skills`
   - `GET /api/v1/agentic/health`

## How It Works

1. **User makes request** → API endpoint receives payment terms request
2. **Agentic engine starts** → Loads skill instructions for payment terms
3. **LLM reasons** → Decides which tools to call (risk score, payment patterns, etc.)
4. **MCP client executes tools** → Calls your TensorFlow models and business tools
5. **LLM analyzes results** → Combines data and applies skill logic
6. **Returns recommendation** → Structured response with reasoning, confidence, alternatives

## Next Steps

### 1. Install Dependencies

```bash
npm install openai @anthropic-ai/sdk axios js-yaml
```

### 2. Configure Environment

Add to your `.env`:

```bash
ENABLE_AGENTIC=true
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
MCP_PYTHON_URL=http://localhost:8001
MCP_TYPESCRIPT_URL=http://localhost:3002
```

### 3. Start MCP Servers

**Python server (TensorFlow):**
```bash
cd equisettle-llm-model
python mcp_server.py
```

**TypeScript server (Business tools):**
```bash
cd eqs-mcp-server
npm run dev
```

### 4. Start Backend

```bash
cd eqs-platform-be
npm run dev
```

### 5. Test It

```bash
curl http://localhost:3000/api/v1/agentic/health
```

## Files Created

```
eqs-platform-be/
├── src/
│   ├── services/agentic/
│   │   ├── index.js                  # Main initialization
│   │   ├── agentic-engine.js         # Core reasoning loop
│   │   ├── mcp-client.js             # MCP server connector
│   │   ├── llm-provider.js           # OpenAI/Anthropic wrapper
│   │   └── skills-manager.js         # Skills loader
│   ├── routes/
│   │   └── agentic-routes.js         # API routes
│   ├── controllers/
│   │   └── agentic-controller.js     # Request handlers
│   └── app.js                        # Updated with agentic init
├── skills/
│   └── payment-terms/
│       └── SKILL.md                  # Payment terms skill
├── .env.agentic.example              # Environment template
└── AGENTIC_SETUP.md                  # Full setup guide
```

## Key Features

✅ **Uses your existing TensorFlow models** - Integrates via MCP server  
✅ **Works with your workflow engine** - Can trigger workflows based on AI decisions  
✅ **Markdown-based skills** - Business team can edit without code changes  
✅ **Multi-step reasoning** - Shows step-by-step decision process  
✅ **Explainable AI** - Returns reasoning, confidence, and alternatives  
✅ **LLM agnostic** - Switch between OpenAI and Anthropic  

## What's Next?

1. **Add more skills** - Create skills for customer risk, cash flow, etc.
2. **Connect frontend** - Build UI to display reasoning steps
3. **Enhance TensorFlow tools** - Add more ML model predictions
4. **Add streaming** - Real-time updates as agent thinks
5. **Monitor costs** - Track LLM API usage

## Questions?

See `AGENTIC_SETUP.md` for detailed setup instructions and troubleshooting.
