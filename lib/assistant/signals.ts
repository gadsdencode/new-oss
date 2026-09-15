import { AssistantUnavailableError } from "./errors";

export interface GenerationSignal {
  signal: AbortSignal;
  cleanup: () => void;
}

export function createGenerationSignal(
  requestSignal: AbortSignal | undefined,
  timeoutMs: number
): GenerationSignal {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);

  if (!requestSignal) {
    return {
      signal: timeoutSignal,
      cleanup: () => undefined,
    };
  }

  if (requestSignal.aborted) {
    const controller = new AbortController();
    controller.abort(requestSignal.reason);
    return { signal: controller.signal, cleanup: () => undefined };
  }

  if (typeof AbortSignal.any === "function") {
    return {
      signal: AbortSignal.any([requestSignal, timeoutSignal]),
      cleanup: () => undefined,
    };
  }

  const controller = new AbortController();
  const onAbort = () => {
    if (!controller.signal.aborted) {
      controller.abort(requestSignal.aborted ? requestSignal.reason : timeoutSignal.reason);
    }
  };

  requestSignal.addEventListener("abort", onAbort, { once: true });
  timeoutSignal.addEventListener("abort", onAbort, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      requestSignal.removeEventListener("abort", onAbort);
      timeoutSignal.removeEventListener("abort", onAbort);
    },
  };
}

export function throwIfAborted(signal: AbortSignal): void {
  if (!signal.aborted) {
    return;
  }

  const reason = signal.reason;
  if (reason && typeof reason === "object" && "name" in reason && reason.name === "TimeoutError") {
    throw new AssistantUnavailableError("ASSISTANT_TIMEOUT");
  }
  throw new AssistantUnavailableError("ASSISTANT_CANCELLED");
}
