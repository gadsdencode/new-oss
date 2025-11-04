"use client";

import { useCopilotReadable } from "@copilotkit/react-core";

interface PageAiContextProps {
  content: string;
  pageTitle?: string;
  metadata?: Record<string, unknown>;
}

/**
 * A reusable component for providing page context to the AI agent.
 * This component renders no UI and should be included in pages that need AI context.
 */
export function PageAiContext({ content, pageTitle, metadata }: PageAiContextProps) {
  useCopilotReadable({
    description: `Page content: ${pageTitle || "Page information"}`,
    value: {
      pageTitle: pageTitle || "Page",
      content,
      ...metadata,
    },
  });

  return null; // This component renders no UI
}

