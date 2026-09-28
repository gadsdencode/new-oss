import { COE_INTENT_IDS } from "../contact/coe-intent";

export interface PublishedRoute {
  path: string;
  title: string;
  purpose: string;
  summary: string;
  anchors: readonly string[];
}

export const PUBLISHED_ROUTES: readonly PublishedRoute[] = [
  {
    path: "/",
    title: "Home",
    purpose: "Introduce Overture Systems Solutions and the main published offerings.",
    summary:
      "Enterprise AI consulting founded in 2005. Links to consulting, the AI Center of Excellence, research, web development, compliance, and contact.",
    anchors: [],
  },
  {
    path: "/consulting",
    title: "AI Strategy & Consulting",
    purpose: "Describe published AI consulting services and how a consultation request works.",
    summary:
      "Strategy, implementation, operations, training, governance, and analytics services. A consultation form submits a request and does not book a calendar meeting.",
    anchors: ["services"],
  },
  {
    path: "/research",
    title: "B2B Research",
    purpose: "Describe the published healthcare and non-profit research offering.",
    summary:
      "AI-powered B2B research for healthcare and non-profit organizations. The site assistant cannot search research databases or invent findings.",
    anchors: [],
  },
  {
    path: "/ai-center-of-excellence",
    title: "AI Center of Excellence",
    purpose: "Explain the CoE operating model and where to start.",
    summary:
      "A governed AI capability across strategy, expertise, infrastructure, data, governance, and adoption. Entry can start with a contained readiness engagement.",
    anchors: ["framework", "assessment", "engagement-path"],
  },
  {
    path: "/ai-center-of-excellence/getting-started",
    title: "How to get started",
    purpose: "Explain CoE entry tiers and the difference between the Snapshot and the Diagnostic.",
    summary:
      "Readiness Diagnostic, Foundation Pilot, and CoE Build & Scale. The free Snapshot is orientation only. The Diagnostic is a paid fixed-scope engagement.",
    anchors: ["compare-tiers"],
  },
  {
    path: "/ai-center-of-excellence/strategic-vision",
    title: "Strategic Vision & Leadership",
    purpose: "Pillar 1 of the AI Center of Excellence.",
    summary: "Priorities, sponsorship, portfolio management, and a sequenced roadmap. Not an inspirational statement by itself.",
    anchors: [],
  },
  {
    path: "/ai-center-of-excellence/centralized-expertise",
    title: "Centralized AI Expertise",
    purpose: "Pillar 2 of the AI Center of Excellence.",
    summary: "A multidisciplinary way to capture and reuse expertise. It does not require hiring a large permanent central data-science team.",
    anchors: [],
  },
  {
    path: "/ai-center-of-excellence/scalable-infrastructure",
    title: "Scalable AI Infrastructure",
    purpose: "Pillar 3 of the AI Center of Excellence.",
    summary: "A model-agnostic capability layer for retrieval, evaluation, guardrails, and production operation.",
    anchors: [],
  },
  {
    path: "/ai-center-of-excellence/data-governance",
    title: "Data Management & Governance",
    purpose: "Pillar 4 of the AI Center of Excellence.",
    summary: "Trusted context: permissions, freshness, lineage, and evidence of which information influenced an output.",
    anchors: [],
  },
  {
    path: "/ai-center-of-excellence/governance-risk",
    title: "Governance, Risk & Responsible AI",
    purpose: "Pillar 5 of the AI Center of Excellence.",
    summary: "Intake, ownership, evaluation, provenance, human approval, monitoring, and incident handling.",
    anchors: [],
  },
  {
    path: "/ai-center-of-excellence/adoption-culture",
    title: "Culture of Adoption & Continuous Learning",
    purpose: "Pillar 6 of the AI Center of Excellence.",
    summary: "Role-based enablement, workflow redesign, and human accountability. Not a generic company-wide fundamentals course.",
    anchors: [],
  },
  {
    path: "/compliance",
    title: "Security & Data Protection",
    purpose: "Describe framework-aligned security practices without claiming unheld certifications.",
    summary:
      "Controls designed around recognized frameworks. Overture does not currently assert held third-party certifications on this page.",
    anchors: ["certifications"],
  },
  {
    path: "/web-development",
    title: "AI-Powered Web Development",
    purpose: "Describe published web development packages and included AI capabilities.",
    summary: "Starter, Business, and Enterprise website packages with published starting prices and included AI features.",
    anchors: ["calculator"],
  },
  {
    path: "/contact",
    title: "Contact",
    purpose: "Help the visitor request a follow-up. Submitting the form does not schedule a meeting.",
    summary:
      "Contact form, email, and a phone number that is not regularly staffed. Headquarters in Chesterfield, Virginia. Business hours Monday–Friday, 9am–6pm EST.",
    anchors: ["contact-form", "contact-form-anchor"],
  },
  {
    path: "/ai",
    title: "AI tools",
    purpose: "Published on-site estimators and an explanation of model-catalog limits.",
    summary: "Cost estimators and notes that the assistant does not rank or compare unverified models.",
    anchors: ["calculator", "models"],
  },
] as const;

const ROUTE_BY_PATH = new Map(PUBLISHED_ROUTES.map((route) => [route.path, route]));

export interface NavigationSuccess {
  ok: true;
  href: string;
  path: string;
  title: string;
}

export interface NavigationFailure {
  ok: false;
  reason: string;
}

function reject(reason: string): NavigationFailure {
  return { ok: false, reason };
}

/**
 * Allow only published site paths, known section anchors, and the contact intent key.
 * Rejects external URLs, protocol-relative URLs, and script-bearing input.
 */
export function resolveNavigationTarget(rawPath: string, rawAnchor?: string): NavigationSuccess | NavigationFailure {
  if (typeof rawPath !== "string") {
    return reject("A site path is required.");
  }
  const trimmed = rawPath.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\") || trimmed.includes("..")) {
    return reject("Only published paths on this website are allowed.");
  }
  if (/^[a-z]+:/i.test(trimmed) || trimmed.includes("://") || /[\s<>"']/.test(trimmed)) {
    return reject("Only published paths on this website are allowed.");
  }

  let url: URL;
  try {
    url = new URL(trimmed, "https://overture-systems.invalid");
  } catch {
    return reject("That destination is not a published page.");
  }
  if (url.origin !== "https://overture-systems.invalid") {
    return reject("Only published paths on this website are allowed.");
  }

  let pathname = url.pathname;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    return reject("That destination is not a published page.");
  }
  if (pathname.includes("..") || pathname.includes("\\") || pathname.includes("://")) {
    return reject("Only published paths on this website are allowed.");
  }
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  const route = ROUTE_BY_PATH.get(pathname);
  if (!route) {
    return reject("That destination is not a published page.");
  }

  const params = [...url.searchParams.entries()];
  if (params.length > 0 && pathname !== "/contact") {
    return reject("That page does not accept query parameters.");
  }
  if (pathname === "/contact") {
    for (const [key, value] of params) {
      if (key !== "intent" || !(COE_INTENT_IDS as readonly string[]).includes(value)) {
        return reject("That contact link is not an allowed consultation intent.");
      }
    }
  }

  const anchorSource = rawAnchor?.trim() || (url.hash ? url.hash.slice(1) : "");
  if (anchorSource) {
    if (!/^[a-z0-9-]+$/i.test(anchorSource) || !route.anchors.includes(anchorSource)) {
      return reject("That section is not on the published page.");
    }
  }

  const query = url.searchParams.toString();
  const href = `${pathname}${query ? `?${query}` : ""}${anchorSource ? `#${anchorSource}` : ""}`;
  return { ok: true, href, path: pathname, title: route.title };
}

export function describeCurrentPage(pathname: string): PublishedRoute & { path: string } {
  const normalized = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname || "/";
  return ROUTE_BY_PATH.get(normalized) ?? {
    path: normalized,
    title: "This page",
    purpose: "This path is not one of the published assistant destinations.",
    summary: "Offer a published page from the site map instead of inventing a service.",
    anchors: [],
  };
}

export function listDestinationHrefs(): string[] {
  return PUBLISHED_ROUTES.map((route) => route.path);
}
