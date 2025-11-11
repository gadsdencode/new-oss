// lib/monitoring.ts
// Monitoring service abstraction for error logging and observability
// Supports integration with Sentry, Datadog, LogRocket, or custom services

/**
 * Error context for monitoring services
 */
export interface ErrorContext {
  errorCode?: string;
  source?: string;
  endpoint?: string;
  method?: string;
  requestId?: string;
  userId?: string;
  userAgent?: string;
  environment?: string;
  [key: string]: unknown;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Monitoring service interface
 */
export interface MonitoringService {
  logError(
    error: Error | unknown,
    context?: ErrorContext,
    severity?: ErrorSeverity
  ): void;
  logMessage(message: string, context?: ErrorContext, level?: "info" | "warn" | "error"): void;
}

/**
 * Console-based monitoring (fallback when no external service is configured)
 */
class ConsoleMonitoring implements MonitoringService {
  logError(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = "high"): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const timestamp = new Date().toISOString();
    
    console.error(`[${timestamp}] [${severity.toUpperCase()}] Error logged:`, {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      context: context || {},
    });
  }

  logMessage(message: string, context?: ErrorContext, level: "info" | "warn" | "error" = "info"): void {
    const timestamp = new Date().toISOString();
    const logMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    
    logMethod(`[${timestamp}] [${level.toUpperCase()}] ${message}`, context || {});
  }
}

/**
 * Sentry monitoring integration (optional)
 * To use: npm install @sentry/nextjs
 */
class SentryMonitoring implements MonitoringService {
  private _sentry: any | null = null;

  private get sentry(): any | null {
    if (this._sentry !== undefined) {
      return this._sentry;
    }
    
    // Lazy load Sentry only when needed and only on server-side
    if (typeof window === "undefined") {
      try {
        // Use dynamic import pattern that webpack can't statically analyze
        // Split the module name to prevent static analysis
        const parts = ["@sentry", "/nextjs"];
        const moduleName = parts.join("");
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        this._sentry = require(moduleName);
      } catch {
        this._sentry = null;
      }
    } else {
      this._sentry = null;
    }
    
    return this._sentry;
  }

  logError(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = "high"): void {
    const sentryInstance = this.sentry;
    if (!sentryInstance) {
      // Fallback to console
      new ConsoleMonitoring().logError(error, context, severity);
      return;
    }

    const errorObj = error instanceof Error ? error : new Error(String(error));
    const sentrySeverity = this.mapSeverity(severity);

    sentryInstance.captureException(errorObj, {
      level: sentrySeverity,
      tags: {
        errorCode: context?.errorCode,
        source: context?.source,
        endpoint: context?.endpoint,
      },
      extra: context,
      contexts: {
        request: context?.requestId
          ? {
              request_id: context.requestId,
            }
          : undefined,
      },
    });
  }

  logMessage(message: string, context?: ErrorContext, level: "info" | "warn" | "error" = "info"): void {
    const sentryInstance = this.sentry;
    if (!sentryInstance) {
      new ConsoleMonitoring().logMessage(message, context, level);
      return;
    }

    const sentryLevel = level === "error" ? "error" : level === "warn" ? "warning" : "info";
    sentryInstance.captureMessage(message, {
      level: sentryLevel,
      extra: context,
    });
  }

  private mapSeverity(severity: ErrorSeverity): "fatal" | "error" | "warning" | "info" | "debug" {
    switch (severity) {
      case "critical":
        return "fatal";
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "error";
    }
  }
}

/**
 * Get the configured monitoring service
 * Priority: Sentry > Console (fallback)
 */
function getMonitoringService(): MonitoringService {
  // Check for Sentry DSN or if Sentry is configured
  if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      return new SentryMonitoring();
    } catch {
      // Fallback to console if Sentry initialization fails
    }
  }

  // Default to console logging
  return new ConsoleMonitoring();
}

// Export singleton instance
export const monitoring: MonitoringService = getMonitoringService();

/**
 * Convenience function to log errors with context
 */
export function logError(
  error: Error | unknown,
  context?: ErrorContext,
  severity: ErrorSeverity = "high"
): void {
  monitoring.logError(error, context, severity);
}

/**
 * Convenience function to log messages
 */
export function logMessage(
  message: string,
  context?: ErrorContext,
  level: "info" | "warn" | "error" = "info"
): void {
  monitoring.logMessage(message, context, level);
}

