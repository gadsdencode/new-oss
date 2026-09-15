import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { loadAssistantConfig, publicAssistantConfigSummary } from "@/lib/assistant/config";
import { createAssistantServiceAdapter } from "@/lib/assistant/adapter";
import {
  AssistantSpendError,
  responseFromSpendError,
  visitorSafeAssistantResponse,
} from "@/lib/assistant/errors";
import { logAssistantError, logAssistantEvent } from "@/lib/assistant/logging";
import { loadAssistantSpendConfig } from "@/lib/assistant/spend-config";
import { parseCopilotKitRequest, findExcessUserMessage } from "@/lib/assistant/copilot-request";
import { deriveClientHash } from "@/lib/assistant/client-id";
import { createSpendStore } from "@/lib/assistant/spend-store";
import { createSpendGuard } from "@/lib/assistant/spend-controls";
import { getModelPrices } from "@/lib/assistant/pricing";
import { ASSISTANT_DEFAULT_MAX_BODY_BYTES } from "@/lib/assistant/constants";

export const runtime = "nodejs";

const copilotRuntime = new CopilotRuntime();

function rebuildRequest(req: NextRequest, body: Uint8Array): NextRequest {
  return new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
    body: Buffer.from(body),
    signal: req.signal,
  });
}

export const POST = async (req: NextRequest) => {
  const loaded = loadAssistantConfig();
  const spendLoaded = loadAssistantSpendConfig();
  const maxBodyBytes = spendLoaded.ok ? spendLoaded.config.maxBodyBytes : ASSISTANT_DEFAULT_MAX_BODY_BYTES;

  const contentLength = Number(req.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return visitorSafeAssistantResponse(413, { error: "ASSISTANT_UNAVAILABLE" });
  }

  let raw: Uint8Array;
  try {
    raw = new Uint8Array(await req.arrayBuffer());
  } catch {
    return visitorSafeAssistantResponse(400, { error: "ASSISTANT_UNAVAILABLE" });
  }
  if (raw.byteLength > maxBodyBytes) {
    return visitorSafeAssistantResponse(413, { error: "ASSISTANT_UNAVAILABLE" });
  }

  let jsonBody: unknown;
  try {
    jsonBody = JSON.parse(new TextDecoder().decode(raw));
  } catch {
    return visitorSafeAssistantResponse(400, { error: "ASSISTANT_UNAVAILABLE" });
  }

  const parsed = parseCopilotKitRequest(jsonBody);
  if (parsed.kind === "invalid") {
    return visitorSafeAssistantResponse(400, { error: "ASSISTANT_UNAVAILABLE" });
  }

  if (!loaded.ok) {
    logAssistantEvent(
      "assistant.unavailable",
      { source: "copilotkit-route", code: loaded.code, issueCount: loaded.issues.length },
      loaded.code === "disabled" ? "info" : "warn"
    );
    return visitorSafeAssistantResponse(503);
  }

  const { config } = loaded;
  if (!getModelPrices(config.model)) {
    logAssistantEvent("assistant.unknown_model_price", { source: "copilotkit-route", model: config.model }, "error");
    return visitorSafeAssistantResponse(503);
  }

  const rebuilt = rebuildRequest(req, raw);

  if (parsed.kind === "metadata") {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime: copilotRuntime,
      serviceAdapter: createAssistantServiceAdapter(config, req.signal),
      endpoint: "/api/copilotkit",
      logLevel: process.env.NODE_ENV === "production" ? "error" : "warn",
    });
    return handleRequest(rebuilt);
  }

  if (!spendLoaded.ok) {
    logAssistantEvent("assistant.spend_unavailable", { source: "copilotkit-route", code: spendLoaded.code }, "error");
    return visitorSafeAssistantResponse(503);
  }

  const excess = findExcessUserMessage(
    parsed.messages,
    spendLoaded.config.maxUserMessageChars,
    spendLoaded.config.maxToolResultChars
  );
  if (excess) {
    return visitorSafeAssistantResponse(413, { error: "ASSISTANT_UNAVAILABLE" });
  }

  const client = deriveClientHash(req.headers);
  if (!client.trusted) {
    logAssistantEvent("assistant.untrusted_client", { source: "copilotkit-route", idSource: client.source }, "warn");
    return visitorSafeAssistantResponse(503);
  }

  const store = createSpendStore(spendLoaded.config);
  if (!store) {
    return visitorSafeAssistantResponse(503);
  }

  const spend = createSpendGuard({
    store,
    spend: spendLoaded.config,
    assistant: config,
    clientHash: client.hash,
  });

  try {
    await spend.checkRateLimit();
  } catch (error) {
    if (error instanceof AssistantSpendError) {
      return responseFromSpendError(error);
    }
    logAssistantEvent("assistant.spend_unavailable", { source: "copilotkit-route", code: "rate_limit_store_error" }, "error");
    return visitorSafeAssistantResponse(503);
  }

  if (!config.isKnownTrialModel) {
    logAssistantEvent(
      "assistant.model_override_preserved",
      { source: "copilotkit-route", model: config.model, modelSource: config.modelSource },
      "warn"
    );
  }

  try {
    const serviceAdapter = createAssistantServiceAdapter(config, req.signal, spend);
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime: copilotRuntime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
      logLevel: process.env.NODE_ENV === "production" ? "error" : "warn",
    });

    try {
      return await handleRequest(rebuilt);
    } catch (handlerError) {
      if (handlerError instanceof AssistantSpendError) {
        return responseFromSpendError(handlerError);
      }
      logAssistantError(handlerError, {
        errorCode: "LLM_ADAPTER_ERROR",
        source: "copilotkit-route",
        endpoint: "/api/copilotkit",
        method: "POST",
        adapterName: "AssistantGeminiAdapter",
        model: config.model,
        environment: process.env.NODE_ENV || process.env.VERCEL_ENV || "unknown",
      });
      return visitorSafeAssistantResponse(500);
    }
  } catch (error) {
    if (error instanceof AssistantSpendError) {
      return responseFromSpendError(error);
    }
    logAssistantError(error, {
      errorCode: "COPILOTKIT_ROUTE_ERROR",
      source: "copilotkit-route",
      endpoint: "/api/copilotkit",
      method: "POST",
      environment: process.env.NODE_ENV || process.env.VERCEL_ENV || "unknown",
      ...publicAssistantConfigSummary(config),
    });
    return visitorSafeAssistantResponse(500);
  }
};
