type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function now() {
  return Date.now()
}

export function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) {
    return xff.split(",")[0].trim()
  }

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const current = now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= current) {
    const next: Bucket = { count: 1, resetAt: current + windowMs }
    buckets.set(key, next)
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      resetAt: next.resetAt,
    }
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt,
    }
  }

  bucket.count += 1
  buckets.set(key, bucket)

  return {
    allowed: true,
    remaining: Math.max(limit - bucket.count, 0),
    resetAt: bucket.resetAt,
  }
}

export function buildRateLimitHeaders(remaining: number, resetAt: number) {
  const resetInSeconds = Math.max(Math.ceil((resetAt - now()) / 1000), 0)

  return {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(resetInSeconds),
  }
}
