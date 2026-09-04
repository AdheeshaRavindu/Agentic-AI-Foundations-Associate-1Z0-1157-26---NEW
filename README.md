# Agentic AI Foundations Associate (1Z0-1157-26)

Study materials and hands-on labs for the Oracle Cloud Infrastructure (OCI) certification:

**Agentic AI Foundations Associate (1Z0-1157-26)**

## Repository Structure

| Folder | Contents |
|--------|----------|
| [Introduction to AI Agents/](Introduction%20to%20AI%20Agents/) | Module 1 study guide and 12 practice questions |
| [Agentic AI for Oracle AI Database/](Agentic%20AI%20for%20Oracle%20AI%20Database/) | 30-question full practice exam covering Modules 1–5 |
| [LangChain for AI Agents/](LangChain%20for%20AI%20Agents/) | Hands-on Python exercises (work in progress) |

## Recommended Study Order

1. Read `Introduction to AI Agents/introduction-to-ai-agents-v2.pdf` for core concepts (LLM vs agent, tools, orchestration, security).
2. Test yourself with `Introduction to AI Agents/introduction-to-ai-agents-questions.pdf` (12 questions + answer key).
3. Take the full practice exam in `Agentic AI for Oracle AI Database/oracle-1z0-1157-26-practice-exam-complete.pdf` (30 scenario questions).
4. Work through the LangChain practical exercises when available.

## Branches

- `main` — study materials (PDFs)
- `practical` — LangChain lab work and code exercises

## LangChain Setup

```bash
cd "LangChain for AI Agents"
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
```

Edit `.env` and add your API key before running any scripts. See [LangChain for AI Agents/README.md](LangChain%20for%20AI%20Agents/README.md) for details.

## Disclaimer

These PDFs are personal study companions compiled for exam preparation. Oracle and OCI are trademarks of Oracle Corporation.
