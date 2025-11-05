// lib/errors.ts
// Utility functions for standardized error handling across the application

import { NextResponse } from "next/server";
import { logError, ErrorContext, ErrorSeverity } from "./monitoring";

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  details?: unknown;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: string,
  message: string,
  statusCode: number,
  details?: unknown
): NextResponse<ErrorResponse> {
  const errorResponse: ErrorResponse = {
    error,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  // Conditionally add details if provided
  if (details !== undefined && details !== null) {
    errorResponse.details = details;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Handle API errors and return appropriate response
 * Logs to monitoring service and returns structured JSON response
 */
export function handleApiError(
  error: unknown,
  context?: ErrorContext,
  severity: ErrorSeverity = "high"
): NextResponse<ErrorResponse> {
  // Log to monitoring service
  logError(error, context, severity);
  
  console.error("API Error:", error);

  // Handle known error types
  if (error instanceof Error) {
    // Check for specific error types
    if (error.name === "ValidationError") {
      return createErrorResponse(
        "Validation Error",
        error.message,
        400,
        { name: error.name }
      );
    }

    if (error.name === "UnauthorizedError") {
      return createErrorResponse(
        "Unauthorized",
        error.message,
        401,
        { name: error.name }
      );
    }

    if (error.name === "NotFoundError") {
      return createErrorResponse(
        "Not Found",
        error.message,
        404,
        { name: error.name }
      );
    }

    // Generic error with message
    return createErrorResponse(
      "Internal Server Error",
      error.message || "An unexpected error occurred",
      500,
      { name: error.name, stack: process.env.NODE_ENV === "development" ? error.stack : undefined }
    );
  }

  // Handle string errors
  if (typeof error === "string") {
    return createErrorResponse(
      "Internal Server Error",
      error,
      500
    );
  }

  // Unknown error type
  return createErrorResponse(
    "Internal Server Error",
    "An unexpected error occurred",
    500,
    { error: String(error) }
  );
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(vars: string[]): { valid: boolean; missing: string[] } {
  const missing = vars.filter((varName) => !process.env[varName]);
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}

/**
 * LLM Adapter Error - Specific error for LLM adapter failures
 */
export class LLMAdapterError extends Error {
  constructor(message: string, public readonly adapterName?: string, public readonly cause?: Error) {
    super(message);
    this.name = "LLMAdapterError";
  }
}

/**
 * Handle LLM adapter errors specifically
 * Returns structured JSON response with LLM_ADAPTER_ERROR code
 */
export function handleLLMAdapterError(
  error: unknown,
  context?: ErrorContext
): NextResponse<ErrorResponse> {
  // Log to monitoring service with high severity
  logError(error, {
    ...context,
    errorCode: "LLM_ADAPTER_ERROR",
    source: "copilotkit-route",
  }, "high");

  if (error instanceof Error) {
    return createErrorResponse(
      "LLM_ADAPTER_ERROR",
      error.message || "LLM adapter encountered an error",
      500,
      {
        errorCode: "LLM_ADAPTER_ERROR",
        errorName: error.name,
        adapterName: context?.adapterName,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      }
    );
  }

  // Unknown error type
  return createErrorResponse(
    "LLM_ADAPTER_ERROR",
    "An unexpected error occurred in the LLM adapter",
    500,
    {
      errorCode: "LLM_ADAPTER_ERROR",
      error: String(error),
    }
  );
}

