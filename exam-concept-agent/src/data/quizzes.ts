export type QuizChoice = "A" | "B" | "C" | "D";

export type QuizQuestion = {
  id: string;
  topic: string;
  question: string;
  choices: Record<QuizChoice, string>;
  answer: QuizChoice;
  explanation: string;
};

export const QUIZZES: QuizQuestion[] = [
  {
    id: "q1",
    topic: "react",
    question:
      "What is the core execution loop difference between a standalone LLM and an LLM-based AI Agent?",
    choices: {
      A: "Standalone LLMs are stateful; agents are entirely stateless.",
      B: "Standalone LLMs do single-pass inference; agents iterate Perceive → Reason → Act → Observe.",
      C: "Standalone LLMs require tools; agents cannot use tools.",
      D: "Agents only run offline; LLMs only run in the cloud."
    },
    answer: "B",
    explanation:
      "Agents run an iterative loop; standalone LLMs answer once and stop."
  },
  {
    id: "q2",
    topic: "two-tier",
    question:
      "In the two-tier LLM architecture pattern, what are the roles of the models?",
    choices: {
      A: "Primary model handles guardrails; secondary handles user registration.",
      B: "A cheap low-latency model routes routine work; a high-capacity model handles deep reasoning.",
      C: "Both models always run in parallel to average cost.",
      D: "Open-source model embeds; proprietary model only indexes SQL."
    },
    answer: "B",
    explanation:
      "Fast/cheap model for routing; stronger model for hard reasoning."
  },
  {
    id: "q3",
    topic: "tool-cycle",
    question:
      "Why keep tool code execution outside the LLM?",
    choices: {
      A: "The LLM cannot cache tool results.",
      B: "Running code inside the LLM increases token cost exponentially.",
      C: "The LLM only outputs structured tool-call text; the app validates and runs tools.",
      D: "MCP forbids tools entirely."
    },
    answer: "C",
    explanation:
      "Security boundary: LLM emits intents; backend executes tools."
  },
  {
    id: "q4",
    topic: "react",
    question: "Why does ReAct reduce hallucinations compared with CoT-only?",
    choices: {
      A: "It fine-tunes the model on domain databases.",
      B: "It skips intermediate reasoning.",
      C: "It interleaves reasoning with tool Actions and grounds next steps on Observations.",
      D: "It forces fully offline execution."
    },
    answer: "C",
    explanation:
      "ReAct grounds thoughts on real tool observations."
  },
  {
    id: "q5",
    topic: "memory",
    question:
      "Which orchestration module manages short-term scratchpads and long-term history?",
    choices: {
      A: "Safety & Guardrails",
      B: "State Machine",
      C: "Memory Management",
      D: "Tool Routing"
    },
    answer: "C",
    explanation: "Memory Management owns scratchpad + persistent history."
  },
  {
    id: "q6",
    topic: "indirect-injection",
    question:
      "Hidden instructions in a retrieved web document hijack an agent. What attack is this?",
    choices: {
      A: "Runaway Execution",
      B: "Direct Prompt Injection",
      C: "Memory Poisoning",
      D: "Indirect Prompt Injection"
    },
    answer: "D",
    explanation:
      "Indirect injection arrives via external content (RAG/docs), not the chat bar."
  },
  {
    id: "q7",
    topic: "guardrails",
    question:
      "Under defense-in-depth, which layer screens toxic/PII content before returning it to the user?",
    choices: {
      A: "Input Validation",
      B: "Output Filtering",
      C: "Tool Boundaries",
      D: "Observability"
    },
    answer: "B",
    explanation: "Output Filtering is the last line before the user sees text."
  },
  {
    id: "q8",
    topic: "mcp",
    question: "What is the primary purpose of MCP?",
    choices: {
      A: "Let the LLM execute shell commands directly.",
      B: "Provide a standardized protocol to connect LLMs with tools, data, and prompts.",
      C: "Fine-tune routing models.",
      D: "Compress JSON schemas."
    },
    answer: "B",
    explanation:
      "MCP standardizes how models get tools/context; it does not run tool code inside the LLM."
  },
  {
    id: "q9",
    topic: "handoffs",
    question:
      "In the Handoffs pattern, what context does the specialist typically receive?",
    choices: {
      A: "Zero prior conversation history.",
      B: "Full conversation history to maintain context.",
      C: "Only the latest user message.",
      D: "No state can be passed."
    },
    answer: "B",
    explanation:
      "Handoffs pass control and usually the full dialogue so specialists stay coherent."
  },
  {
    id: "q10",
    topic: "manager-pattern",
    question:
      "In the Manager pattern, how does the manager coordinate workers?",
    choices: {
      A: "Uses handoffs and relinquishes control entirely.",
      B: "Packages workers as tools (e.g. as_tool) and synthesizes a final output while keeping control.",
      C: "Bypasses LLM reasoning with raw pipes.",
      D: "Spawns workers only via uvx stdio."
    },
    answer: "B",
    explanation:
      "Manager keeps control; specialists are tools whose results are merged."
  }
];
