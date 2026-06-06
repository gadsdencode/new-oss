"use client";

/**
 * Custom global error boundary.
 *
 * Replaces Next's auto-generated `/_global-error` page, whose default
 * implementation fails to prerender under Next 16 with an
 * "Expected workUnitAsyncStorage to have a store" invariant. This boundary
 * sits outside the root layout, so it must render its own <html>/<body> and
 * relies on inline styles to stay self-contained even when the app crashes.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1120",
          color: "#e2e8f0",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <div
            style={{
              width: "3.5rem",
              height: "3.5rem",
              margin: "0 auto 1.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #0B7CFF, #00D6C9)",
            }}
          />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#94a3b8", margin: "0 0 1.5rem" }}>
            An unexpected error occurred. You can try again, and if the problem
            persists, please reach out to us.
          </p>
          {error?.digest ? (
            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "0 0 1.5rem" }}>
              Error reference: {error.digest}
            </p>
          ) : null}
          <button
            onClick={() => reset()}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.625rem 1.5rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#ffffff",
              background: "linear-gradient(135deg, #0B7CFF, #00D6C9)",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
