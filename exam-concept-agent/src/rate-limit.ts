/** Per-IP rate limiting helpers for Cloudflare Workers Rate Limiting bindings. */

export function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") || "anonymous";
}

export async function enforceRateLimit(
  limiter: RateLimit,
  key: string
): Promise<Response | null> {
  const { success } = await limiter.limit({ key });
  if (success) return null;
  return Response.json(
    { error: "Rate limit exceeded. Try again shortly." },
    {
      status: 429,
      headers: { "Retry-After": "60" }
    }
  );
}
