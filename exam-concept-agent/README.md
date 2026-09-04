# Exam Concept Agent

Hands-on Cloudflare Workers demo for **Oracle Agentic AI Foundations Associate (1Z0-1157-26)**.

Live: **https://agent47.adheesha.dev** · MCP: **https://agent47.adheesha.dev/mcp**

## What it shows (exam architecture)

| Piece | In this app |
|-------|-------------|
| **Brain** | DeepSeek via OpenRouter (`/api/agent`) |
| **Hands** | MCP tools on `ExamConceptMCP` |
| **Loop** | ReAct — Thought → Action → Observation (visible in the chat UI) |

The UI includes a waiting animation while the agent runs, a **Clear** button, and suggestion chips (ReAct, CoT vs ReAct, Quiz on MCP, Guardrails).

## MCP tools

| Tool | Purpose |
|------|---------|
| `lookup_concept` | Definition + exam tip |
| `compare_concepts` | Side-by-side two concepts |
| `quiz_me` | Random MCQ (no answer leaked) |
| `check_answer` | Grade A/B/C/D |

Connect a client (e.g. Cursor) to:

```text
https://agent47.adheesha.dev/mcp
```

## Setup (local)

```bash
cd exam-concept-agent
npm install --legacy-peer-deps
```

Create `.dev.vars` (copy from `.dev.vars.example`):

```env
OPENROUTER_API_KEY=sk-or-your-openrouter-key
```

```bash
npm run check
npm run dev
```

Open the local URL wrangler prints (often http://127.0.0.1:8787). Restart after changing `.dev.vars`.

## Rate limits (per IP)

| Route | Limit |
|-------|-------|
| `POST /api/agent` | 10 / 60s |
| Other `/api/*`, `/mcp`, `/agents/*` | 60 / 60s |

Over limit → `429` with `Retry-After: 60`. Static UI is not app-rate-limited.

## Deploy

```bash
npx wrangler secret put OPENROUTER_API_KEY
npm run deploy
```

Custom domain: `agent47.adheesha.dev` (configured in `wrangler.jsonc`).

## Architecture routes

| Path | Role |
|------|------|
| `/` | Chat UI with visible ReAct tool loop |
| `POST /api/agent` | OpenRouter + tools; returns `{ answer, steps }` |
| `/mcp` | Streamable HTTP MCP server |
| `/agents/exam-concept-chat/*` | Durable Object chat agent |
