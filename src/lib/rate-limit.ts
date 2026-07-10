import 'server-only';

// Best-effort in-memory rate limit. On serverless this is per warm instance
// (not global), but combined with the honeypot it stops bursts and basic bots
// without needing an external store.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // crude cap to bound memory
  return true;
}

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  return (
    xff?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}
