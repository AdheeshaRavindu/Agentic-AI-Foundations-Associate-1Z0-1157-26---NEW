interface Env {
  ExamConceptChat: DurableObjectNamespace<
    import("./src/chat-agent").ExamConceptChat
  >;
  ExamConceptMCP: DurableObjectNamespace<
    import("./src/mcp-server").ExamConceptMCP
  >;
  ASSETS: Fetcher;
  OPENROUTER_API_KEY: string;
  RATE_LIMIT_AGENT: RateLimit;
  RATE_LIMIT_API: RateLimit;
}
