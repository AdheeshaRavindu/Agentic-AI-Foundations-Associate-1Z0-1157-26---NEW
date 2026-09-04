import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { getModel } from "./llm";
import { compareConcepts } from "./tools/compare";
import { lookupConcept } from "./tools/lookup";
import { checkAnswer, quizMe } from "./tools/quiz";

export type AgentStep = {
  type: "tool";
  name: string;
  args: Record<string, unknown>;
  result: unknown;
};

export type AgentRunResult = {
  answer: string;
  steps: AgentStep[];
};

const SYSTEM = `You are Exam Concept Agent for Oracle 1Z0-1157-26 (Agentic AI Foundations).

You MUST use tools before answering factual questions:
- lookup_concept for definitions
- compare_concepts for comparisons
- quiz_me to start a practice question
- check_answer to grade A/B/C/D — never invent correctness

After tools return, explain clearly and include exam tips. Keep answers concise.
When quizzing, show the question and choices clearly and ask the user to reply with A/B/C/D.`;

function buildTools() {
  return {
    lookup_concept: tool({
      description:
        "Look up an Agentic AI Foundations exam concept (ReAct, MCP, CoT, etc.).",
      inputSchema: z.object({
        query: z.string().describe("Concept name or alias")
      }),
      execute: async ({ query }) => lookupConcept(query)
    }),
    compare_concepts: tool({
      description: "Compare two exam concepts side-by-side.",
      inputSchema: z.object({
        conceptA: z.string(),
        conceptB: z.string()
      }),
      execute: async ({ conceptA, conceptB }) =>
        compareConcepts(conceptA, conceptB)
    }),
    quiz_me: tool({
      description:
        "Return a random MCQ practice question without revealing the answer.",
      inputSchema: z.object({
        topic: z.string().optional().describe("Optional topic filter")
      }),
      execute: async ({ topic }) => quizMe(topic)
    }),
    check_answer: tool({
      description: "Grade a quiz answer (question id + A/B/C/D).",
      inputSchema: z.object({
        questionId: z.string(),
        choice: z.string()
      }),
      execute: async ({ questionId, choice }) =>
        checkAnswer(questionId, choice)
    })
  };
}

export async function runExamAgent(
  message: string,
  apiKey: string
): Promise<AgentRunResult> {
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is missing. Set it in .dev.vars and restart wrangler."
    );
  }

  const result = await generateText({
    model: getModel(apiKey),
    system: SYSTEM,
    prompt: message,
    tools: buildTools(),
    stopWhen: stepCountIs(8)
  });

  const steps: AgentStep[] = [];
  for (const step of result.steps) {
    for (const call of step.toolCalls ?? []) {
      const toolName =
        "toolName" in call
          ? String(call.toolName)
          : "name" in call
            ? String((call as { name: string }).name)
            : "tool";
      const args =
        "input" in call && call.input && typeof call.input === "object"
          ? (call.input as Record<string, unknown>)
          : "args" in call && call.args && typeof call.args === "object"
            ? (call.args as Record<string, unknown>)
            : {};
      const matching = (step.toolResults ?? []).find((r) => {
        const rName =
          "toolName" in r
            ? r.toolName
            : "name" in r
              ? (r as { name: string }).name
              : undefined;
        return rName === toolName;
      });
      const toolResult =
        matching && "output" in matching
          ? matching.output
          : matching && "result" in matching
            ? (matching as { result: unknown }).result
            : null;
      steps.push({
        type: "tool",
        name: toolName,
        args,
        result: toolResult
      });
    }
  }

  return {
    answer: result.text || "(No text response — check tool results above.)",
    steps
  };
}
