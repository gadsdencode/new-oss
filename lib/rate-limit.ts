/**
 * Rate limiting utility for Server Actions
 * Prevents DoS attacks by limiting requests per IP address
 * 
 * Uses Vercel KV when available (production), falls back to in-memory cache (development)
 */

import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { headers } from 'next/headers';

// In-memory fallback for local development when KV is not available
const memoryCache = new Map<string, { count: number; resetAt: number }>();

// Rate limit configuration
const RATE_LIMIT_REQUESTS = 5; // Maximum requests
const RATE_LIMIT_WINDOW = '1 m'; // Time window (1 minute)

/**
 * Get rate limiter instance
 * Uses Vercel KV if available, otherwise falls back to in-memory cache
 */
function getRateLimiter() {
  // Try to use Vercel KV (requires KV_REST_API_URL and KV_REST_API_TOKEN env vars)
  try {
    if (process.env.KV_REST_API_TOKEN && process.env.KV_REST_API_URL) {
      return new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
        analytics: true,
      });
    }
  } catch (error) {
    console.warn('[Rate Limit] Vercel KV not available, using in-memory fallback');
  }

  // Fallback: in-memory rate limiting (for local development)
  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const windowMs = 60 * 1000; // 1 minute in milliseconds
      
      const record = memoryCache.get(identifier);
      
      if (!record || now > record.resetAt) {
        // New window or expired
        memoryCache.set(identifier, {
          count: 1,
          resetAt: now + windowMs,
        });
        return { success: true, limit: RATE_LIMIT_REQUESTS, remaining: RATE_LIMIT_REQUESTS - 1, reset: now + windowMs };
      }
      
      if (record.count >= RATE_LIMIT_REQUESTS) {
        // Rate limit exceeded
        return { 
          success: false, 
          limit: RATE_LIMIT_REQUESTS, 
          remaining: 0, 
          reset: record.resetAt,
        };
      }
      
      // Increment counter
      record.count++;
      memoryCache.set(identifier, record);
      
      return { 
        success: true, 
        limit: RATE_LIMIT_REQUESTS, 
        remaining: RATE_LIMIT_REQUESTS - record.count, 
        reset: record.resetAt,
      };
    },
  };
}

/**
 * Get client identifier for rate limiting
 * Uses IP address from headers if available
 */
async function getClientIdentifier(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const cfConnectingIp = headersList.get('cf-connecting-ip'); // Cloudflare
  
  // Get IP address from various headers (priority order)
  const ip = forwardedFor?.split(',')[0].trim() || 
             realIp || 
             cfConnectingIp || 
             'unknown';
  
  return ip;
}

/**
 * Check if request should be rate limited
 * @returns Object with success status and rate limit information
 */
export async function checkRateLimit(): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  error?: string;
}> {
  try {
    const identifier = await getClientIdentifier();
    const limiter = getRateLimiter();
    const result = await limiter.limit(identifier);
    
    if (!result.success) {
      const resetDate = new Date(result.reset);
      const secondsUntilReset = Math.ceil((result.reset - Date.now()) / 1000);
      
      return {
        ...result,
        error: `Too many requests. Please try again in ${secondsUntilReset} second${secondsUntilReset !== 1 ? 's' : ''}.`,
      };
    }
    
    return result;
  } catch (error) {
    // If rate limiting fails, log but don't block the request
    // This prevents rate limiting from being a single point of failure
    console.error('[Rate Limit] Error checking rate limit:', error);
    return {
      success: true,
      limit: RATE_LIMIT_REQUESTS,
      remaining: RATE_LIMIT_REQUESTS - 1,
      reset: Date.now() + 60000,
    };
  }
}

