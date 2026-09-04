# Exam Concept Agent

Simple Cloudflare Workers demo for **Oracle Agentic AI Foundations Associate (1Z0-1157-26)**.

Shows the exam architecture in code:

- **Brain** — OpenRouter → `deepseek/deepseek-chat` (`ExamConceptChat` / `/api/agent`)
- **Hands** — MCP tools on `ExamConceptMCP`
- **Loop** — ReAct-style tool calling

> Folder name is still `cloudflare-lie-detector/` (legacy). The app itself is the Exam Concept Agent.

## What you can do

Chat with the agent. It **must call tools** (lookup / compare / quiz / check) and the UI shows each **Action → Observation** step so the ReAct loop is visible.

## MCP tools

| Tool | Purpose |
|------|---------|
| `lookup_concept` | Definition + exam tip |
| `compare_concepts` | Side-by-side two concepts |
| `quiz_me` | Random MCQ (no answer leaked) |
| `check_answer` | Grade A/B/C/D |

## Setup

```bash
cd cloudflare-lie-detector
npm install --legacy-peer-deps
```

Create `.dev.vars` (copy from `.dev.vars.example`):

```env
OPENROUTER_API_KEY=sk-or-your-openrouter-key
```

Get a key at https://openrouter.ai/keys

```bash
npm run check
npm run dev
```

Open http://localhost:8787 — ask a question and watch tool calls appear.

**Restart `npm run dev` after changing `.dev.vars`.**

## Rate limits (per IP)

Cloudflare Workers Rate Limiting bindings (plus edge DDoS protection):

| Route | Limit |
|-------|-------|
| `POST /api/agent` | 10 requests / 60s |
| Other `/api/*`, `/mcp`, `/agents/*` | 60 requests / 60s |

Over limit returns `429` with `Retry-After: 60`. Static UI assets are not app-rate-limited.

## Deploy

```bash
npx wrangler secret put OPENROUTER_API_KEY
npm run deploy
```

After deploy:

- UI: `https://exam-concept-agent.<your-subdomain>.workers.dev/`
- MCP (Streamable HTTP): `https://exam-concept-agent.<your-subdomain>.workers.dev/mcp`

## Architecture routes

| Path | Role |
|------|------|
| `/` | Chat UI with visible ReAct tool loop |
| `POST /api/agent` | OpenRouter + tools; returns `{ answer, steps }` |
| `/mcp` | Streamable HTTP MCP server |
| `/agents/exam-concept-chat/*` | Durable Object chat agent |
