import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";
import { truncateOutput, validateToolText } from "./guardrails";
import { compareConcepts } from "./tools/compare";
import { lookupConcept } from "./tools/lookup";
import { checkAnswer, quizMe } from "./tools/quiz";

function toolText(payload: unknown): {
  content: { type: "text"; text: string }[];
} {
  return {
    content: [
      {
        type: "text",
        text: truncateOutput(JSON.stringify(payload, null, 2))
      }
    ]
  };
}

function toolError(message: string): {
  content: { type: "text"; text: string }[];
  isError: true;
} {
  return {
    content: [{ type: "text", text: message }],
    isError: true
  };
}

export class ExamConceptMCP extends McpAgent<Env> {
  server = new McpServer({
    name: "exam-concept-agent",
    version: "1.0.0"
  });

  async init() {
    this.server.registerTool(
      "lookup_concept",
      {
        description:
          "Look up an Agentic AI Foundations exam concept by name or alias (e.g. ReAct, MCP, CoT).",
        inputSchema: {
          query: z.string().describe("Concept name or alias to look up")
        }
      },
      async ({ query }) => {
        const v = validateToolText(query);
        if (!v.ok) return toolError(v.error);
        return toolText(lookupConcept(v.text));
      }
    );

    this.server.registerTool(
      "compare_concepts",
      {
        description:
          "Compare two exam concepts side-by-side (e.g. CoT vs ReAct, handoffs vs manager).",
        inputSchema: {
          conceptA: z.string().describe("First concept"),
          conceptB: z.string().describe("Second concept")
        }
      },
      async ({ conceptA, conceptB }) => {
        const a = validateToolText(conceptA);
        if (!a.ok) return toolError(`conceptA: ${a.error}`);
        const b = validateToolText(conceptB);
        if (!b.ok) return toolError(`conceptB: ${b.error}`);
        return toolText(compareConcepts(a.text, b.text));
      }
    );

    this.server.registerTool(
      "quiz_me",
      {
        description:
          "Return a random multiple-choice exam practice question. Does not include the answer.",
        inputSchema: {
          topic: z
            .string()
            .optional()
            .describe("Optional topic filter, e.g. react, mcp, memory")
        }
      },
      async ({ topic }) => {
        if (topic !== undefined) {
          const v = validateToolText(topic);
          if (!v.ok) return toolError(v.error);
          return toolText(quizMe(v.text));
        }
        return toolText(quizMe());
      }
    );

    this.server.registerTool(
      "check_answer",
      {
        description:
          "Grade a quiz answer. Pass the question id from quiz_me and the choice A/B/C/D.",
        inputSchema: {
          questionId: z.string().describe("Question id from quiz_me"),
          choice: z.string().describe("User choice: A, B, C, or D")
        }
      },
      async ({ questionId, choice }) => {
        const id = validateToolText(questionId);
        if (!id.ok) return toolError(`questionId: ${id.error}`);
        const c = validateToolText(choice);
        if (!c.ok) return toolError(`choice: ${c.error}`);
        return toolText(checkAnswer(id.text, c.text));
      }
    );
  }
}
