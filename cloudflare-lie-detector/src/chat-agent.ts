import { AIChatAgent, type OnChatMessageOptions } from "@cloudflare/ai-chat";
import {
  convertToModelMessages,
  pruneMessages,
  stepCountIs,
  streamText,
  type StreamTextOnFinishCallback,
  type ToolSet
} from "ai";
import { getModel } from "./llm";

export class ExamConceptChat extends AIChatAgent<Env> {
  maxPersistedMessages = 100;
  waitForMcpConnections = true;

  async onStart() {
    await this.addMcpServer("exam-concepts", this.env.ExamConceptMCP, {
      id: "exam-concept-mcp"
    });
  }

  async onChatMessage(
    _onFinish: StreamTextOnFinishCallback<ToolSet>,
    options?: OnChatMessageOptions
  ): Promise<Response | undefined> {
    await this.mcp.waitForConnections();

    const mcpTools = this.mcp.getAITools();

    const result = streamText({
      model: getModel(this.env.OPENROUTER_API_KEY),
      system: `You are Exam Concept Agent, a study assistant for Oracle Agentic AI Foundations Associate (1Z0-1157-26).

Always use MCP tools for facts:
- lookup_concept for definitions
- compare_concepts for side-by-side comparisons
- quiz_me to ask a practice question
- check_answer to grade A/B/C/D — never invent whether an answer is correct

Explain clearly and include exam tips from tool results. Keep answers concise.`,
      messages: pruneMessages({
        messages: await convertToModelMessages(this.messages),
        toolCalls: "before-last-2-messages"
      }),
      tools: mcpTools,
      stopWhen: stepCountIs(12),
      abortSignal: options?.abortSignal
    });

    return result.toUIMessageStreamResponse();
  }
}
