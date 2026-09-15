import { createHash } from "node:crypto";

export type SpendNamespace = "production" | "preview" | "development";

export function resolveSpendNamespace(env: Record<string, string | undefined> = process.env): SpendNamespace {
  if (env.VERCEL_ENV === "production") {
    return "production";
  }
  if (env.VERCEL_ENV === "preview") {
    return "preview";
  }
  if (env.NODE_ENV === "production") {
    return "production";
  }
  return "development";
}

export function isLocalDevelopment(env: Record<string, string | undefined> = process.env): boolean {
  return resolveSpendNamespace(env) === "development" && env.VERCEL !== "1";
}

/**
 * Derive a client identifier from hosting-platform metadata only.
 * Arbitrary forwarding headers are ignored off-platform. Client session IDs
 * are never used as the sole protection. The hash is not a stored raw IP.
 */
export function deriveClientHash(
  headers: Headers,
  env: Record<string, string | undefined> = process.env
): { hash: string; trusted: boolean; source: string } {
  const namespace = resolveSpendNamespace(env);
  if (env.VERCEL === "1") {
    const platformIp = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || headers.get("x-real-ip")?.trim();
    const ja4 = headers.get("x-vercel-ja4-digest")?.trim();
    if (!platformIp && !ja4) {
      return { hash: "", trusted: false, source: "vercel-missing" };
    }
    return {
      hash: sha256(`vercel:${namespace}:${platformIp || "none"}:${ja4 || "none"}`),
      trusted: true,
      source: "vercel",
    };
  }

  if (isLocalDevelopment(env)) {
    return { hash: sha256(`local:${namespace}:dev`), trusted: true, source: "local-dev" };
  }

  return { hash: "", trusted: false, source: "untrusted" };
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
