import { AssistantSpendError, AssistantUnavailableError } from "./errors";
import { visitorGatewayBusyMessage } from "./constants";
import { throwIfAborted } from "./signals";

/**
 * One in-flight ICDU chat or embedding call from this process.
 * A second caller may wait. A third is rejected so requests do not pile up.
 * The shared gateway can still return 429; callers must not retry that.
 */
let running = false;
let nextStart: (() => void) | null = null;

export function acquireIcdUSlot(signal?: AbortSignal): Promise<() => void> {
  if (signal) {
    throwIfAborted(signal);
  }
  if (running && nextStart) {
    return Promise.reject(new AssistantSpendError("ASSISTANT_BUSY", visitorGatewayBusyMessage(5), 429, 5));
  }

  return new Promise((resolve, reject) => {
    const start = () => {
      if (signal?.aborted) {
        running = false;
        const pending = nextStart;
        nextStart = null;
        pending?.();
        reject(new AssistantUnavailableError("ASSISTANT_CANCELLED"));
        return;
      }
      running = true;
      let released = false;
      resolve(() => {
        if (released) {
          return;
        }
        released = true;
        running = false;
        const pending = nextStart;
        nextStart = null;
        pending?.();
      });
    };

    if (!running) {
      start();
      return;
    }
    nextStart = start;
  });
}

export function resetIcdUSlotForTests(): void {
  running = false;
  nextStart = null;
}
