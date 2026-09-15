"use client";

import Link from "next/link";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { BrandLogo } from "@/components/brand-logo";
import { X, SendHorizontal } from "lucide-react";
import {
  ASSISTANT_CONTACT_PATH,
  VISITOR_BUSY_MESSAGE,
  VISITOR_UNAVAILABLE_MESSAGE,
} from "@/lib/assistant/constants";
import "./copilot-chat-theme.css";

function visitorFacingMessage(error?: { message?: string }) {
  if (error?.message === VISITOR_BUSY_MESSAGE) {
    return VISITOR_BUSY_MESSAGE;
  }
  return VISITOR_UNAVAILABLE_MESSAGE;
}

function AssistantErrorMessage({
  error,
  onRegenerate,
}: {
  error?: { message?: string };
  isCurrentMessage?: boolean;
  onRegenerate?: () => void;
}) {
  return (
    <div className="overture-copilot-error">
      <p className="text-sm">{visitorFacingMessage(error)}</p>
      <p className="text-sm mt-2">
        <Link href={ASSISTANT_CONTACT_PATH} className="underline underline-offset-2">
          Open the contact page
        </Link>
      </p>
      {onRegenerate ? (
        <button type="button" className="text-sm mt-3 underline underline-offset-2" onClick={onRegenerate}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function CopilotSidebarWrapper() {
  return (
    <div className="overture-copilot">
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={false}
        icons={{
          openIcon: (
            <BrandLogo
              size="md"
              decorative
              className="overture-copilot-launcher-logo"
            />
          ),
          closeIcon: <X className="h-6 w-6" aria-hidden />,
          headerCloseIcon: <X className="h-4 w-4" aria-hidden />,
          sendIcon: <SendHorizontal className="h-5 w-5" aria-hidden />,
        }}
        labels={{
          title: "Overture AI",
          placeholder: "Ask about Overture services…",
          initial:
            "Hi, I'm the Overture Systems Solutions assistant. I can help you:\n\n- Find the right service for your goals\n- Understand the AI Center of Excellence and how to get started\n- Set up an executive briefing with our team\n\nWhat brings you here today?",
          error: `${VISITOR_UNAVAILABLE_MESSAGE} You can also reach us through the contact page.`,
        }}
        ErrorMessage={AssistantErrorMessage}
        renderError={({ onDismiss }) => (
          <div className="overture-copilot-error">
            <p className="text-sm">{VISITOR_UNAVAILABLE_MESSAGE}</p>
            <p className="text-sm mt-2">
              <Link href={ASSISTANT_CONTACT_PATH} className="underline underline-offset-2">
                Open the contact page
              </Link>
            </p>
            <button type="button" className="text-sm mt-3 underline underline-offset-2" onClick={onDismiss}>
              Dismiss
            </button>
          </div>
        )}
      />
    </div>
  );
}
