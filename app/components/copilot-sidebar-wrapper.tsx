"use client";

import Link from "next/link";
import {useCopilotChat} from "@copilotkit/react-core";
import {FeedbackReview} from "@/components/ai/feedback-review";
import { useEffect, useState } from "react";
import { AssistantMessage, CopilotSidebar, type AssistantMessageProps } from "@copilotkit/react-ui";
import { BrandLogo } from "@/components/brand-logo";
import { Square, X, SendHorizontal } from "lucide-react";
import {
  approvedVisitorMessage,
  ASSISTANT_CONTACT_PATH,
  ASSISTANT_QUEUE_NOTE_DELAY_MS,
  retryDelaySeconds,
  VISITOR_UNAVAILABLE_MESSAGE,
} from "@/lib/assistant/constants";
import "./copilot-chat-theme.css";

function visitorFacingMessage(error?: { message?: string }) {
  return approvedVisitorMessage(error?.message);
}

function AssistantErrorMessage({
  error,
  onRegenerate,
}: {
  error?: { message?: string };
  isCurrentMessage?: boolean;
  onRegenerate?: () => void;
}) {
  const message = visitorFacingMessage(error);
  const [remaining, setRemaining] = useState(() => retryDelaySeconds(message));
  useEffect(() => {
    setRemaining(retryDelaySeconds(message));
  }, [message]);
  useEffect(() => {
    if (remaining <= 0) {
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return (
    <div className="overture-copilot-error">
      <p className="text-sm">{message}</p>
      <p className="text-sm mt-2">
        <Link href={ASSISTANT_CONTACT_PATH} className="underline underline-offset-2">
          Open the contact page
        </Link>
      </p>
      {onRegenerate ? (
        <button
          type="button"
          className="text-sm mt-3 underline underline-offset-2 disabled:no-underline disabled:opacity-60"
          onClick={onRegenerate}
          disabled={remaining > 0}
        >
          {remaining > 0 ? `Try again in ${remaining}s` : "Try again"}
        </button>
      ) : null}
    </div>
  );
}

function QueueNote() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), ASSISTANT_QUEUE_NOTE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) {
    return null;
  }
  return <p>Another conversation may be ahead.</p>;
}

function WaitingAssistantMessage(props: AssistantMessageProps) {
  const content = typeof props.message?.content === "string" ? props.message.content.trim() : "";
  const {visibleMessages}=useCopilotChat();
  const index=visibleMessages.findIndex(m=>m.id===props.message?.id);
  const prior=visibleMessages.slice(0,index<0?0:index).reverse().find(m=>"role" in m&&m.role==='user');
  const question=prior&&"content" in prior&&typeof prior.content==='string'?prior.content:'';
  const toolUI = props.message?.generativeUI?.();
  const waiting = props.isLoading && !props.isGenerating && content.length === 0 && !toolUI;

  return (
    <>
      {waiting ? (
        <div role="status" className="text-sm mb-2">
          <p>Waiting for the assistant…</p>
          <QueueNote />
        </div>
      ) : null}
      <AssistantMessage {...props} />
      {!props.isLoading&&!props.isGenerating&&content?<FeedbackReview question={question} answer={content}/>:null}
    </>
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
          stopIcon: (
            <>
              <Square className="h-4 w-4" aria-hidden />
              <span className="sr-only">Stop</span>
            </>
          ),
        }}
        labels={{
          title: "Overture AI",
          placeholder: "Ask about Overture services…",
          initial:
            "Hi, I'm the Overture Systems Solutions assistant. I can help you:\n\n- Find the right service for your goals\n- Understand the AI Center of Excellence and how to get started\n- Set up an executive briefing with our team\n\nWhat brings you here today?",
          error: `${VISITOR_UNAVAILABLE_MESSAGE} You can also reach us through the contact page.`,
        }}
        ErrorMessage={AssistantErrorMessage}
        AssistantMessage={WaitingAssistantMessage}
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
