export type ConsultationOutcome = "idle" | "success" | "error" | "cancelled";

export function outcomeFromSubmitResult(
  result: { success?: boolean } | null | undefined,
  cancelled = false
): ConsultationOutcome {
  if (cancelled) {
    return "cancelled";
  }
  if (result?.success === true) {
    return "success";
  }
  return "error";
}

/**
 * CopilotKit sets action status to "complete" after respond(), including
 * failures and cancellations. Success UI is allowed only for an actual
 * successful submission.
 */
export function consultationCompleteIsSuccess(outcome: ConsultationOutcome): boolean {
  return outcome === "success";
}
