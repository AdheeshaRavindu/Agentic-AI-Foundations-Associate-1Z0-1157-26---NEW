# LangChain for AI Agents

Hands-on Python exercises for the OCI Agentic AI Foundations Associate (1Z0-1157-26) curriculum.

## Setup

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

## Environment Variables

Copy the example env file and add your API key:

```bash
copy .env.example .env   # Windows
cp .env.example .env     # macOS / Linux
```

Required variables:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |

Never commit `.env` — it is listed in the root `.gitignore`.

## Status

Work in progress. Exercise scripts will be added here as the practical curriculum is built out.
