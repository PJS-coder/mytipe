/**
 * In-Memory Sliding Window Rate Limiter
 * Provides DDoS, brute-force, and spam protection across API endpoints
 * with automatic garbage collection to prevent memory leaks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// Global cache to persist across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __mytipe_rate_limit_map__: Map<string, RateLimitRecord> | undefined;
}

if (!global.__mytipe_rate_limit_map__) {
  global.__mytipe_rate_limit_map__ = new Map<string, RateLimitRecord>();
}

const rateLimitMap = global.__mytipe_rate_limit_map__;

// Periodic cleanup every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Unref timer so it doesn't prevent Node process exit
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

export interface RateLimitOptions {
  /** Maximum number of allowed requests in the time window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 60, windowSeconds: 60 }
): RateLimitResult {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;
  const cutoff = now - windowMs;

  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((ts) => ts > cutoff);

  if (record.timestamps.length >= options.maxRequests) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.ceil((oldest + windowMs - now) / 1000);

    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record this request
  record.timestamps.push(now);
  rateLimitMap.set(identifier, record);

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - record.timestamps.length,
    resetSeconds: options.windowSeconds,
  };
}

/**
 * Extracts a client identifier from incoming NextRequest headers
 */
export function getClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}
