import { createHash } from "node:crypto";
import type { ParsedCopilotMessage } from "./copilot-request";

export function hashVisitorText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * Server-derived identity for one visitor question plus its tool continuations
 * and exact retries. Built from user-message text only. Browser counters and
 * client message ids are not accepted as the quota key.
 */
export function visitorTurnKey(messages: ParsedCopilotMessage[]): string {
  const digests = messages
    .filter((message) => message.kind === "user-text" && message.digest)
    .map((message) => message.digest as string);
  const material = digests.length > 0 ? digests.join("\n") : "empty-user-turn";
  return createHash("sha256").update(material).digest("hex");
}
