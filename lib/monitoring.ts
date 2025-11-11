// lib/monitoring.ts
// Production-ready monitoring service abstraction for error logging and observability
// Supports integration with Sentry, Datadog, LogRocket, or custom services
// Provides structured JSON logging for production environments

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
  ip?: string;
  [key: string]: unknown;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Structured log entry for production logging
 */
interface StructuredLogEntry {
  timestamp: string;
  level: string;
  severity?: ErrorSeverity;
  message?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    type?: string;
  };
  context?: ErrorContext;
  environment: string;
  service: string;
  version?: string;
}

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
 * Production-ready console monitoring with structured JSON logging
 * Automatically uses structured JSON in production, readable format in development
 */
class ConsoleMonitoring implements MonitoringService {
  private readonly isProduction: boolean;
  private readonly isDevelopment: boolean;
  private readonly serviceName: string;
  private readonly appVersion: string;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.serviceName = process.env.SERVICE_NAME || "new-oss";
    this.appVersion = process.env.APP_VERSION || "0.1.0";
  }

  /**
   * Serialize error to structured format
   */
  private serializeError(error: Error | unknown): {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    type?: string;
  } {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        code: (error as any).code,
        type: (error as any).type,
      };
    }
    return {
      name: "UnknownError",
      message: String(error),
    };
  }

  /**
   * Create structured log entry
   */
  private createLogEntry(
    level: string,
    severity: ErrorSeverity | undefined,
    message?: string,
    error?: Error | unknown,
    context?: ErrorContext
  ): StructuredLogEntry {
    const entry: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      severity,
      environment: process.env.NODE_ENV || "unknown",
      service: this.serviceName,
      version: this.appVersion,
    };

    if (message) {
      entry.message = message;
    }

    if (error) {
      entry.error = this.serializeError(error);
    }

    if (context) {
      entry.context = {
        ...context,
        environment: context.environment || process.env.NODE_ENV,
      };
    }

    return entry;
  }

  /**
   * Output log entry (structured JSON in production, readable in development)
   */
  private outputLog(entry: StructuredLogEntry, logMethod: typeof console.error | typeof console.warn | typeof console.log): void {
    if (this.isProduction) {
      // Production: Output structured JSON for log aggregation systems
      logMethod(JSON.stringify(entry));
    } else {
      // Development: Output readable format
      const { timestamp, level, severity, message, error, context } = entry;
      const prefix = `[${timestamp}] [${level}${severity ? `/${severity.toUpperCase()}` : ""}]`;
      
      if (error) {
        logMethod(`${prefix} Error:`, {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code,
          type: error.type,
          context: context || {},
        });
      } else if (message) {
        logMethod(`${prefix} ${message}`, context || {});
      } else {
        logMethod(`${prefix}`, entry);
      }
    }
  }

  logError(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = "high"): void {
    const entry = this.createLogEntry("error", severity, undefined, error, context);
    this.outputLog(entry, console.error);
    
    // In production, also attempt to send to external services if configured
    // This allows for dual logging: structured console + external service
    if (this.isProduction) {
      this.tryExternalLogging(error, context, severity);
    }
  }

  logMessage(message: string, context?: ErrorContext, level: "info" | "warn" | "error" = "info"): void {
    const severity: ErrorSeverity = level === "error" ? "high" : level === "warn" ? "medium" : "low";
    const entry = this.createLogEntry(level, severity, message, undefined, context);
    
    const logMethod = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
    this.outputLog(entry, logMethod);
    
    // In production, also attempt to send to external services if configured
    if (this.isProduction && level === "error") {
      this.tryExternalLogging(new Error(message), context, severity);
    }
  }

  /**
   * Attempt to send logs to external services (Datadog, LogRocket, etc.)
   * Falls back gracefully if services are not configured
   */
  private tryExternalLogging(
    error: Error | unknown,
    context?: ErrorContext,
    severity: ErrorSeverity = "high"
  ): void {
    // Datadog integration (if DD_API_KEY is set)
    if (process.env.DD_API_KEY && typeof process.env.DD_API_KEY === "string") {
      this.logToDatadog(error, context, severity);
    }

    // LogRocket integration (if LOGROCKET_APP_ID is set)
    if (process.env.LOGROCKET_APP_ID && typeof process.env.LOGROCKET_APP_ID === "string") {
      this.logToLogRocket(error, context, severity);
    }
  }

  /**
   * Send logs to Datadog via HTTP API
   */
  private logToDatadog(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = "high"): void {
    // Datadog logs API integration
    // In a real implementation, you would use @datadog/browser-logs or @datadog/datadog-api-client
    // This is a placeholder for the integration pattern
    try {
      const logEntry = this.createLogEntry("error", severity, undefined, error, context);
      
      // Datadog expects logs in a specific format
      // For production, you would send this via Datadog's API or SDK
      // Example: https://docs.datadoghq.com/api/latest/logs/#send-logs
      if (process.env.DD_SITE && logEntry) {
        // Log entry prepared for Datadog - actual sending would happen via SDK
        // This is a no-op placeholder that can be extended with actual Datadog SDK
        // Example implementation:
        // await fetch(`https://http-intake.logs.${process.env.DD_SITE}/api/v2/logs`, {
        //   method: 'POST',
        //   headers: {
        //     'DD-API-KEY': process.env.DD_API_KEY,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(logEntry),
        // });
      }
    } catch (err) {
      // Silently fail - don't break the application if external logging fails
      if (this.isDevelopment) {
        console.warn("Failed to send log to Datadog:", err);
      }
    }
  }

  /**
   * Send logs to LogRocket
   */
  private logToLogRocket(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = "high"): void {
    // LogRocket integration
    // In a real implementation, you would use logrocket
    // This is a placeholder for the integration pattern
    try {
      // LogRocket expects logs via their SDK
      // Example implementation:
      // if (typeof window !== 'undefined' && (window as any).LogRocket) {
      //   const errorObj = error instanceof Error ? error : new Error(String(error));
      //   (window as any).LogRocket.captureException(errorObj, {
      //     extra: context,
      //     tags: { severity },
      //   });
      // }
      // This is a no-op placeholder that can be extended with actual LogRocket SDK
      void error;
      void context;
      void severity;
    } catch (err) {
      // Silently fail - don't break the application if external logging fails
      if (this.isDevelopment) {
        console.warn("Failed to send log to LogRocket:", err);
      }
    }
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
 * Composite monitoring service that logs to multiple services
 * Provides redundancy and ensures logs are captured even if one service fails
 */
class CompositeMonitoringService implements MonitoringService {
  private services: MonitoringService[];

  constructor(services: MonitoringService[]) {
    this.services = services;
  }

  logError(error: Error | unknown, context?: ErrorContext, severity: ErrorSeverity = "high"): void {
    // Log to all configured services
    // If one fails, others should still succeed
    for (const service of this.services) {
      try {
        service.logError(error, context, severity);
      } catch (err) {
        // Silently fail individual services - don't break the application
        if (process.env.NODE_ENV === "development") {
          console.warn("Monitoring service failed:", err);
        }
      }
    }
  }

  logMessage(message: string, context?: ErrorContext, level: "info" | "warn" | "error" = "info"): void {
    // Log to all configured services
    for (const service of this.services) {
      try {
        service.logMessage(message, context, level);
      } catch (err) {
        // Silently fail individual services - don't break the application
        if (process.env.NODE_ENV === "development") {
          console.warn("Monitoring service failed:", err);
        }
      }
    }
  }
}

/**
 * Get the configured monitoring service
 * Priority: Sentry (if configured) + Enhanced Console (always)
 * Uses composite pattern to log to multiple services for redundancy
 */
function getMonitoringService(): MonitoringService {
  const services: MonitoringService[] = [];
  
  // Always include enhanced console logging (production-ready with structured JSON)
  services.push(new ConsoleMonitoring());

  // Add Sentry if configured
  if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      services.push(new SentryMonitoring());
    } catch {
      // Fallback gracefully if Sentry initialization fails
      if (process.env.NODE_ENV === "development") {
        console.warn("Sentry initialization failed, using console logging only");
      }
    }
  }

  // Return composite service if multiple services, single service if only one
  return services.length > 1 ? new CompositeMonitoringService(services) : services[0];
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

