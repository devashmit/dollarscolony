const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const window = 15 * 60 * 1000; // 15 minutes
  const max = 5;

  const record = attempts.get(ip);
  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + window });
    return { allowed: true, remaining: max - 1 };
  }
  if (record.count >= max) {
    return { allowed: false, remaining: 0 };
  }
  record.count++;
  return { allowed: true, remaining: max - record.count };
}

export function clearRateLimit(ip: string) {
  attempts.delete(ip);
}
