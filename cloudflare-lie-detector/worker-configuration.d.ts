interface Env {
  ExamConceptChat: DurableObjectNamespace<
    import("./src/chat-agent").ExamConceptChat
  >;
  ExamConceptMCP: DurableObjectNamespace<
    import("./src/mcp-server").ExamConceptMCP
  >;
  ASSETS: Fetcher;
  OPENROUTER_API_KEY: string;
}
