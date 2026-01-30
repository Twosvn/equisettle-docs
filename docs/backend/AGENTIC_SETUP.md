# Agentic System Setup Guide

## Overview

This guide will help you set up the agentic AI system for payment terms recommendations, customer risk analysis, and cash flow forecasting.

## Prerequisites

- Node.js 16+ installed
- MongoDB running
- Python 3.8+ (for TensorFlow MCP server)
- OpenAI or Anthropic API key

## Installation

### 1. Install Node.js Dependencies

```bash
cd eqs-platform-be
npm install openai @anthropic-ai/sdk axios js-yaml
```

### 2. Install Python Dependencies (for MCP server)

```bash
cd ../equisettle-llm-model
pip install -r requirements.txt
```

If `requirements.txt` doesn't have these, install manually:

```bash
pip install fastapi uvicorn tensorflow pymongo python-dotenv
```

### 3. Configure Environment Variables

Copy the example file and configure:

```bash
cd ../eqs-platform-be
cp .env.agentic.example .env.agentic
```

Edit `.env.agentic` and add your API keys:

```bash
# Enable agentic features
ENABLE_AGENTIC=true

# Choose your LLM provider
LLM_PROVIDER=openai                    # or 'anthropic'
OPENAI_API_KEY=sk-your-key-here
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Model selection
LLM_MODEL=gpt-4-turbo-preview          # or 'claude-3-5-sonnet-20241022'

# MCP Server URLs
MCP_PYTHON_URL=http://localhost:8001
MCP_PYTHON_API_KEY=your_secure_api_key_here
MCP_TYPESCRIPT_URL=http://localhost:3002

# Skills directory (default: ./skills)
SKILLS_DIRECTORY=./skills

# Agentic configuration
AGENTIC_MAX_ITERATIONS=10
AGENTIC_TIMEOUT_MS=30000
AGENTIC_STREAMING=true
```

Then add these to your main `.env` file:

```bash
cat .env.agentic >> .env
```

## Starting the Services

### 1. Start Python MCP Server (TensorFlow models)

```bash
cd equisettle-llm-model
python mcp_server.py
```

This should start on port 8001.

### 2. Start TypeScript MCP Server (Business tools)

```bash
cd eqs-mcp-server
npm install
npm run dev
```

This should start on port 3002.

### 3. Start Main Backend

```bash
cd eqs-platform-be
npm run dev
```

## Testing the Agentic System

### 1. Health Check

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

### 2. Test Payment Terms Recommendation

```bash
curl -X POST http://localhost:3000/api/v1/agentic/recommend-terms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "customerId": "customer_123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "conversationId": "agentic_1234567890_abc123",
    "recommendation": "Net 30 with 2% early payment discount for Net 10",
    "reasoning": [
      {
        "type": "tool_call",
        "tool": "get_customer_risk_score",
        "input": { "customerId": "customer_123" },
        "output": { "riskScore": 25, "riskLevel": "low" }
      },
      {
        "type": "decision",
        "content": "Based on low risk score...",
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

## Available Endpoints

### POST /api/v1/agentic/recommend-terms
Recommend payment terms for a customer

**Request:**
```json
{
  "customerId": "string",
  "context": {
    "userPreferences": {},
    "companyPolicies": {}
  }
}
```

### POST /api/v1/agentic/analyze-customer
Analyze customer risk profile

**Request:**
```json
{
  "customerId": "string"
}
```

### POST /api/v1/agentic/forecast-cashflow
Forecast cash flow

**Request:**
```json
{
  "days": 90,
  "includeML": true
}
```

### GET /api/v1/agentic/conversation/:id
Get conversation details

### POST /api/v1/agentic/conversation/:id/continue
Continue an existing conversation

**Request:**
```json
{
  "message": "What if the customer has a seasonal business?"
}
```

### GET /api/v1/agentic/skills
List available skills

### GET /api/v1/agentic/health
Health check for agentic system

## Creating Custom Skills

Skills are markdown files that teach the AI how to perform specific tasks.

### 1. Create a new skill directory

```bash
mkdir -p skills/my-custom-skill
```

### 2. Create SKILL.md

```bash
touch skills/my-custom-skill/SKILL.md
```

### 3. Add YAML frontmatter and instructions

```markdown
---
name: my-custom-skill
description: Brief description of what this skill does
version: 1.0.0
author: Your Name
---

# Skill Name

## When to Use

Describe when this skill should be used...

## Instructions

Step-by-step instructions for the AI...

### 1. First Step

Use tool X to gather data...

### 2. Second Step

Analyze the data...

## Example Response Format

Show an example of the expected output...
```

### 4. Reload skills

The skills manager caches skills for 5 minutes. To force reload:

```bash
curl http://localhost:3000/api/v1/agentic/skills
```

## Troubleshooting

### "Agentic engine not initialized"

Make sure `ENABLE_AGENTIC=true` in your `.env` file.

### "Tool not found"

Check that both MCP servers are running:
- Python server: `http://localhost:8001/health`
- TypeScript server: `http://localhost:3002/health`

### "OpenAI API error"

Verify your API key is correct and has sufficient credits.

### "Skill not found"

Check that:
1. The skill directory exists in `./skills/`
2. The directory contains a `SKILL.md` file
3. The YAML frontmatter is valid

## Next Steps

1. Create additional skills for your specific use cases
2. Integrate agentic endpoints into your frontend
3. Monitor LLM costs and usage
4. Fine-tune system prompts based on results
5. Add more tools to your MCP servers

## Support

For issues or questions, contact the platform team.
