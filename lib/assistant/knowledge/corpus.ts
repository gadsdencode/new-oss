import { createHash } from "node:crypto";
import { GETTING_STARTED } from "../../coe/getting-started-data";
import { approvedResearchAssistantPayload } from "../../research/approved-services";
import { absoluteUrl } from "../../site";
import { ICDU_EMBED_MAX_CHARS } from "../constants";

export type PublicationStatus = "published" | "unpublished";

export interface KnowledgeDocument {
  documentId: string;
  title: string;
  sourceUrl: string;
  content: string;
  publicationStatus: PublicationStatus;
}

export interface KnowledgeChunk extends KnowledgeDocument {
  chunkId: string;
  contentHash: string;
}

export function hashKnowledgeContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function chunkKnowledgeDocument(document: KnowledgeDocument): KnowledgeChunk[] {
  const pieces = packParagraphs(document.content, ICDU_EMBED_MAX_CHARS - 200);
  return pieces.map((content, index) => ({
    ...document,
    content,
    chunkId: `${document.documentId}#${index}`,
    contentHash: hashKnowledgeContent(`${document.documentId}\n${document.sourceUrl}\n${content}`),
  }));
}

function packParagraphs(content: string, maxChars: number): string[] {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length > maxChars && current) {
      chunks.push(current);
      current = paragraph.slice(0, maxChars);
    } else {
      current = next.slice(0, maxChars);
    }
  }
  if (current) {
    chunks.push(current);
  }
  return chunks.length > 0 ? chunks : [content.slice(0, maxChars)];
}

function tiersText(): string {
  return GETTING_STARTED.tiers
    .map((tier) => `${tier.name} (${tier.duration}). ${tier.whatItIs} Best for: ${tier.bestFor}`)
    .join("\n\n");
}

/**
 * Approved published Overture copy. Facts come from this repository's pages
 * and structured data. Do not add services, prices, certifications, customers,
 * or research findings that are not already published here.
 */
export function publishedKnowledgeDocuments(): KnowledgeDocument[] {
  const research = approvedResearchAssistantPayload();
  return [
    {
      documentId: "overture-home",
      title: "Overture Systems Solutions",
      sourceUrl: absoluteUrl("/"),
      publicationStatus: "published",
      content: `Overture Systems Solutions is an enterprise AI consulting firm founded in 2005. The public site describes strategic AI consulting, implementation, and platforms, and says Overture is the home of patented ICDU technology for structuring expert knowledge into training data for specialized AI. ICDU is described on the Overture site and at https://icdu.ai. That link is the ICDU product site. This website remains the Overture Systems Solutions site.

Published offerings linked from the homepage: AI strategy and implementation (/consulting), AI Center of Excellence (/ai-center-of-excellence), B2B research for healthcare and non-profit organizations (/research), and AI-powered web development (/web-development). The homepage also states fixed-scope entry engagements and end-to-end delivery from roadmap to production. A consultation is requested through /contact. Submitting a form does not book a calendar meeting.`,
    },
    {
      documentId: "overture-consulting",
      title: "AI Strategy & Consulting",
      sourceUrl: absoluteUrl("/consulting"),
      publicationStatus: "published",
      content: `AI Strategy & Consulting covers six published services: AI Strategy & Roadmap, AI Implementation, AI Operations & Optimization, AI Training & Enablement, AI Governance & Ethics, and AI Analytics & Insights.

Industries named on the page: Healthcare, Financial Services, Retail & E-commerce, Manufacturing, Technology, and Non-Profits.

A general consulting sequence on the page is Discovery & Assessment (1-2 weeks), Strategy & Planning (2-3 weeks), Implementation & Integration (8-16 weeks), and Optimization & Support (ongoing). These durations are distinct from the AI Center of Excellence entry tiers.

What the page says a visitor can verify: 20+ years in business (founded 2005), patented ICDU technology for structuring expert knowledge into training data for specialized AI (https://icdu.ai), fixed-scope entry engagements, and end-to-end delivery. AI Training & Enablement is employee training. It is distinct from ICDU model training. The page does not publish measured improvement percentages.

Illustrative engagement scenarios on the consulting page are composites, not named clients. Do not present them as case studies or customer results.

Request a consultation at ${absoluteUrl("/contact")}. The form submits a request. It does not schedule a meeting.`,
    },
    {
      documentId: "overture-research",
      title: "B2B Research",
      sourceUrl: absoluteUrl(research.path),
      publicationStatus: "published",
      content: `${research.overview}

Published capabilities: ${research.features.map((feature) => `${feature.title}: ${feature.description}`).join(" ")}

Healthcare use cases named on the page: ${research.healthcareUseCases.join("; ")}.

Non-profit use cases named on the page: ${research.nonProfitUseCases.join("; ")}.

${research.unavailable}`,
    },
    {
      documentId: "overture-coe",
      title: "AI Center of Excellence",
      sourceUrl: absoluteUrl("/ai-center-of-excellence"),
      publicationStatus: "published",
      content: `Overture's AI Center of Excellence practice helps an organization turn expertise, decisions, controls, data, and operating practices into a governed AI capability. Experimentation is not the objective. The CoE connects strategy, business expertise, technology, evaluation, governance, and adoption.

The six pillars are Strategic Vision & Leadership, Centralized AI Expertise, Scalable AI Infrastructure, Data Management & Governance, Governance Risk & Responsible AI, and Culture of Adoption & Continuous Learning.

Overture can begin with a contained readiness engagement rather than an immediate full-scale commitment. Published differentiation the page allows: founded in 2005, and patented ICDU technology (https://icdu.ai) for structuring expert knowledge, task intent, context, and decision criteria into training data for specialized AI. Do not invent measured results or customer names.

How to get started: ${absoluteUrl("/ai-center-of-excellence/getting-started")}.`,
    },
    {
      documentId: "overture-coe-getting-started",
      title: "How to get started with an AI Center of Excellence",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/getting-started"),
      publicationStatus: "published",
      content: `The free tool is the AI CoE Readiness Snapshot. The formal paid engagement is the Readiness Diagnostic. Do not call both an assessment or both a diagnostic. The Snapshot is orientation only and is not an objective or validated organizational maturity score.

${GETTING_STARTED.durationDisclaimer}

Entry tiers:
${tiersText()}

Prerequisites named on the page: ${GETTING_STARTED.prerequisites.map((item) => item.title).join("; ")}. ${GETTING_STARTED.prerequisitesNote}

Phases: ${GETTING_STARTED.phases.map((phase) => `${phase.step} ${phase.title} (${phase.tierLabel}, ${phase.duration})`).join("; ")}.

Pricing is not shown for these tiers. Durations are estimates, not commitments.`,
    },
    {
      documentId: "overture-coe-strategic-vision",
      title: "Strategic Vision & Leadership",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/strategic-vision"),
      publicationStatus: "published",
      content: `Strategic Vision & Leadership is pillar 1 of Overture's AI Center of Excellence. It is an operating mechanism. Overture helps establish business priorities and measurable outcomes, executive sponsorship and decision rights, use-case portfolio management, resource and usage governance, success measures, and a sequenced roadmap. Examples on the page are illustrative, not case studies. Do not invent metrics or client stories.`,
    },
    {
      documentId: "overture-coe-expertise",
      title: "Centralized AI Expertise",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/centralized-expertise"),
      publicationStatus: "published",
      content: `Centralized AI Expertise is pillar 2. It is a flexible multidisciplinary capability, not a mandate to hire a large permanent central team of data scientists. The CoE does not remove expertise from business units. ICDU, as described on this page, is a patented approach to structuring reviewed examples of expert judgment into training data, connected to task intent, context, decision criteria, exceptions, and human-review requirements. Source: https://icdu.ai as cited by the Overture page. Do not invent staffing numbers or client results.`,
    },
    {
      documentId: "overture-coe-infrastructure",
      title: "Scalable AI Infrastructure",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/scalable-infrastructure"),
      publicationStatus: "published",
      content: `Scalable AI Infrastructure is pillar 3. It is a modern, model-agnostic capability layer for dependable business operation. Capabilities named on the page include model and agent gateways, enterprise retrieval and knowledge grounding, agent orchestration, evaluation pipelines, observability, guardrails, human approval points, identity and permissions, cost and usage controls, model and cloud portability, and production deployment. Vendor products are secondary implementation choices. Do not invent results.`,
    },
    {
      documentId: "overture-coe-data",
      title: "Data Management & Governance",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/data-governance"),
      publicationStatus: "published",
      content: `Data Management & Governance is pillar 4. The page headline is that trusted AI requires trusted context. It covers structured and unstructured information, knowledge sources, data permissions, context freshness, retrieval quality, cataloging and lineage, data quality, privacy and security, approved use boundaries, and evidence of which information influenced an AI output. Do not invent results or industry statistics.`,
    },
    {
      documentId: "overture-coe-governance",
      title: "Governance, Risk & Responsible AI",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/governance-risk"),
      publicationStatus: "published",
      content: `Governance, Risk & Responsible AI is pillar 5. It is an operational governance and evidence layer. Capabilities named on the page include AI use-case intake and risk tiering, ownership and decision rights, pre-deployment evaluation, provenance, human approval, audit evidence, production monitoring, incident escalation, and periodic reassessment. ICDU (https://icdu.ai) is described as a patented approach to structuring expert judgment, task intent, context, rules, and escalation criteria into examples for model training and evaluation. The surrounding application remains responsible for permissions, approvals, monitoring, and action controls.`,
    },
    {
      documentId: "overture-coe-adoption",
      title: "Culture of Adoption & Continuous Learning",
      sourceUrl: absoluteUrl("/ai-center-of-excellence/adoption-culture"),
      publicationStatus: "published",
      content: `Culture of Adoption & Continuous Learning is pillar 6. It replaces generic company-wide AI fundamentals training with role-based enablement, workflow redesign, AI champions, reusable operating practices, capturing the judgment of strong performers, human-AI collaboration, adoption measures, feedback loops, and continuous evaluation. The CoE makes expertise more consistently available while retaining human accountability. Examples are illustrative. Do not invent results.`,
    },
    {
      documentId: "overture-compliance",
      title: "Security & Data Protection",
      sourceUrl: absoluteUrl("/compliance"),
      publicationStatus: "published",
      content: `The security page describes enterprise-grade security and data protection built around recognized frameworks. Overture Systems Solutions does not currently assert any held third-party certifications. Controls are designed around recognized frameworks.

Named alignments on the page: security and availability controls, healthcare data protection with secure governed handling, GDPR-aligned privacy, ISO 27001-informed practices, and CCPA-aligned transparency. These are design alignments, not claims that a certification has been awarded.

Request security documentation through ${absoluteUrl("/contact")}.`,
    },
    {
      documentId: "overture-web-development",
      title: "AI-Powered Web Development",
      sourceUrl: absoluteUrl("/web-development"),
      publicationStatus: "published",
      content: `Overture offers AI-powered web development: custom websites with integrated AI capabilities.

Published starting prices on the page:
- Starter ($8,000+): up to 5 pages, AI chatbot, responsive design, basic SEO, CMS integration, 30 days support.
- Business ($25,000+): up to 15 pages, chatbot, intelligent search, content recommendations, custom design system, advanced SEO, analytics dashboard, CMS, 90 days support, performance optimization.
- Enterprise ($75,000+): unlimited pages, custom AI systems, dedicated design team, headless CMS, API integrations, SSO/RBAC, 12 months support, SLA guarantees, and enterprise security and compliance readiness.

AI capabilities named on the page: AI chatbot, intelligent search, content recommendations, predictive analytics, and smart forms.

The published stack includes Next.js, React, TypeScript, Tailwind CSS, CopilotKit, LangChain, headless CMS options, hosting on Vercel, AWS, or Azure, and PostgreSQL, MongoDB, or Redis. These are implementation options named on the page, not a promise that every engagement uses every item.

A consultation request is made at ${absoluteUrl("/contact")} and does not book a meeting.`,
    },
    {
      documentId: "overture-contact",
      title: "Contact and consultation requests",
      sourceUrl: absoluteUrl("/contact"),
      publicationStatus: "published",
      content: `The contact page collects a consultation or follow-up request. Submitting the form does not schedule a meeting. No third-party calendar scheduler is embedded on the page.

Email: jordan.martens@osscontact.com. Follow-up is during business hours, Monday–Friday, 9:00 AM–6:00 PM EST. Response timing depends on volume and complexity.

Phone: +1 (888) 716-3360. A number is listed, but phones are not regularly staffed. Prefer the contact form or email. Do not promise live phone support.

Headquarters: 7305 Hancock Village Drive, Suite 223, Chesterfield, Virginia 23832.

The on-site assistant is available while browsing this website. It is not a guaranteed 24/7 human support SLA.

CoE visitors can open /contact with an intent of diagnostic, pilot, scale, or readiness-workshop. Those links still submit a request. They do not book the workshop or engagement.`,
    },
  ];
}

export function publishedKnowledgeChunks(): KnowledgeChunk[] {
  return publishedKnowledgeDocuments().flatMap(chunkKnowledgeDocument);
}
