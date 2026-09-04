export type Concept = {
  id: string;
  name: string;
  aliases: string[];
  definition: string;
  examTip: string;
};

export const CONCEPTS: Concept[] = [
  {
    id: "llm-vs-agent",
    name: "LLM vs AI Agent",
    aliases: ["standalone llm", "agent", "ai agent", "llm"],
    definition:
      "A standalone LLM is a passive text generator: one prompt, one response, then stop. An AI Agent uses an LLM as its reasoning core plus tools and an iterative loop to pursue goals autonomously.",
    examTip:
      "Remember the formula: AI Agent = LLM (Brain) + Tools (Hands) + Loop (Nervous System)."
  },
  {
    id: "brain-hands-loop",
    name: "Brain, Hands, and Loop",
    aliases: ["brain", "hands", "nervous system", "three components"],
    definition:
      "Brain = LLM reasoning. Hands = tools/APIs the agent can call. Loop = orchestration that runs Perceive → Reason → Act → Observe until the goal is done.",
    examTip:
      "The LLM never executes tools itself — it only emits structured tool-call intents."
  },
  {
    id: "tool-cycle",
    name: "5-Step Tool Execution Cycle",
    aliases: ["tool execution", "tool cycle", "tool schema"],
    definition:
      "1) Define tools with schemas. 2) Send schemas + query to the LLM. 3) LLM decides a tool call. 4) App validates and executes locally. 5) Return observation to the LLM.",
    examTip:
      "Type hints become JSON schema; docstrings become the tool description the model reads."
  },
  {
    id: "cot",
    name: "Chain-of-Thought (CoT)",
    aliases: ["chain of thought", "cot", "step by step"],
    definition:
      "CoT makes the model break a problem into linear reasoning steps before answering. Useful for math/logic, but it cannot call tools or verify facts against the real world.",
    examTip:
      "Standalone CoT hallucinates confidently when training data is wrong — it cannot self-correct with tools."
  },
  {
    id: "react",
    name: "ReAct (Reasoning + Acting)",
    aliases: ["react", "reason and act", "thought action observation"],
    definition:
      "ReAct interleaves Thought → Action → Observation. The agent grounds each next thought on real tool results, which reduces hallucinations vs CoT-only prompting.",
    examTip:
      "If a question asks why ReAct reduces hallucinations, pick the interleaved grounding answer."
  },
  {
    id: "tot",
    name: "Tree-of-Thoughts (ToT)",
    aliases: ["tree of thoughts", "tot", "branching"],
    definition:
      "ToT explores multiple reasoning branches and can backtrack when a branch fails. Best for strategic planning and complex design, not simple single-tool lookups.",
    examTip: "CoT = linear path; ReAct = tools in a loop; ToT = branching search."
  },
  {
    id: "mcp",
    name: "Model Context Protocol (MCP)",
    aliases: ["mcp", "model context protocol", "stdio"],
    definition:
      "MCP is an open standard for connecting LLMs to tools, data, prompts, and resources uniformly. The model still only emits intents; an MCP server executes tools (often over stdio or HTTP).",
    examTip:
      "In local stdio MCP, the client talks pipes to the server; only the server process opens outbound HTTPS."
  },
  {
    id: "guardrails",
    name: "Defense-in-Depth Guardrails",
    aliases: [
      "guardrails",
      "defense in depth",
      "input validation",
      "output filtering"
    ],
    definition:
      "Layered safety: Input Validation, LLM Guardrails, Tool Boundaries, Output Filtering, and Observability. Never rely on one layer alone.",
    examTip:
      "Output filtering screens PII/toxicity before the user sees the response."
  },
  {
    id: "direct-injection",
    name: "Direct Prompt Injection",
    aliases: ["direct prompt injection", "jailbreak"],
    definition:
      "The user types malicious instructions into the chat to override system rules (e.g., 'ignore previous instructions').",
    examTip: "Direct = user chat bar. Indirect = poisoned external content."
  },
  {
    id: "indirect-injection",
    name: "Indirect Prompt Injection",
    aliases: ["indirect prompt injection", "rag injection"],
    definition:
      "Hidden instructions in retrieved documents, emails, or web pages hijack the agent when those contents enter context (classic RAG attack).",
    examTip:
      "If the attack rides in via a retrieved file, it is indirect prompt injection."
  },
  {
    id: "memory-poisoning",
    name: "Memory Poisoning",
    aliases: ["memory poisoning", "long-term memory attack"],
    definition:
      "An attacker writes malicious content into persistent agent memory so future sessions inherit corrupted behavior.",
    examTip:
      "Memory poisoning persists across sessions; one-shot prompt injection does not."
  },
  {
    id: "memory",
    name: "Agent Memory",
    aliases: ["memory management", "short-term memory", "long-term memory"],
    definition:
      "Short-term memory is the active scratchpad for the current loop. Long-term memory stores history/preferences across sessions. Context compaction summarizes history to fit token limits.",
    examTip:
      "Orchestration module responsible for scratchpads + history = Memory Management."
  },
  {
    id: "two-tier",
    name: "Two-Tier LLM Pattern",
    aliases: ["two tier", "two-tier", "routing model"],
    definition:
      "A cheap, fast model handles routine routing and tool dispatch; a stronger model is reserved for hard reasoning tasks to control cost and latency.",
    examTip: "Fast model = router; capable model = deep reasoner."
  },
  {
    id: "handoffs",
    name: "Handoffs Pattern",
    aliases: ["handoff", "handoffs", "specialist agent"],
    definition:
      "A triage agent transfers control to a specialist. The specialist typically receives full conversation history so context is preserved.",
    examTip:
      "Handoffs = specialist takes over dialogue. Manager pattern = manager keeps control and calls workers as tools."
  },
  {
    id: "manager-pattern",
    name: "Manager Pattern",
    aliases: ["manager pattern", "agent as tool", "as_tool"],
    definition:
      "A manager agent keeps primary control and packages specialist agents as tools (e.g. agent.as_tool), then synthesizes their results into one final answer.",
    examTip:
      "Manager retains control; workers are tools, not full dialogue takeovers."
  }
];

export const LIMITS = {
  maxInputChars: 4_000,
  maxOutputChars: 8_000
} as const;
