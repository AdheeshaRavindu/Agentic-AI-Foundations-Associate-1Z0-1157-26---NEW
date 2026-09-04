import { routeAgentRequest } from "agents";
import { runExamAgent } from "./agent-run";
import { ExamConceptChat } from "./chat-agent";
import { validateInput } from "./guardrails";
import { ExamConceptMCP } from "./mcp-server";
import { compareConcepts } from "./tools/compare";
import { lookupConcept } from "./tools/lookup";
import { checkAnswer, quizMe } from "./tools/quiz";

export { ExamConceptChat, ExamConceptMCP };

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/mcp")) {
      return ExamConceptMCP.serve("/mcp", {
        binding: "ExamConceptMCP"
      }).fetch(request, env, ctx);
    }

    if (url.pathname === "/api/agent" && request.method === "POST") {
      try {
        const body = (await request.json()) as { message?: unknown };
        const validated = validateInput(body.message);
        if (!validated.ok) {
          return Response.json({ error: validated.error }, { status: 400 });
        }
        const result = await runExamAgent(
          validated.text,
          env.OPENROUTER_API_KEY
        );
        return Response.json(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Agent run failed.";
        return Response.json({ error: message }, { status: 500 });
      }
    }

    if (url.pathname === "/api/lookup" && request.method === "POST") {
      try {
        const body = (await request.json()) as { query?: unknown };
        const validated = validateInput(body.query);
        if (!validated.ok) {
          return Response.json({ error: validated.error }, { status: 400 });
        }
        return Response.json(lookupConcept(validated.text));
      } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      }
    }

    if (url.pathname === "/api/quiz" && request.method === "POST") {
      try {
        const body = (await request.json().catch(() => ({}))) as {
          topic?: unknown;
        };
        if (body.topic !== undefined) {
          const validated = validateInput(body.topic);
          if (!validated.ok) {
            return Response.json({ error: validated.error }, { status: 400 });
          }
          return Response.json(quizMe(validated.text));
        }
        return Response.json(quizMe());
      } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      }
    }

    if (url.pathname === "/api/check-answer" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          questionId?: unknown;
          choice?: unknown;
        };
        const id = validateInput(body.questionId);
        if (!id.ok) {
          return Response.json({ error: id.error }, { status: 400 });
        }
        const choice = validateInput(body.choice);
        if (!choice.ok) {
          return Response.json({ error: choice.error }, { status: 400 });
        }
        return Response.json(checkAnswer(id.text, choice.text));
      } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      }
    }

    if (url.pathname === "/api/compare" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          conceptA?: unknown;
          conceptB?: unknown;
        };
        const a = validateInput(body.conceptA);
        if (!a.ok) {
          return Response.json({ error: a.error }, { status: 400 });
        }
        const b = validateInput(body.conceptB);
        if (!b.ok) {
          return Response.json({ error: b.error }, { status: 400 });
        }
        return Response.json(compareConcepts(a.text, b.text));
      } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      }
    }

    const agentResponse = await routeAgentRequest(request, env);
    if (agentResponse) {
      return agentResponse;
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;
