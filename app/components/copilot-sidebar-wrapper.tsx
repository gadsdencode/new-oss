// app/components/copilot-sidebar-wrapper.tsx
"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";

export function CopilotSidebarWrapper() {
  return (
    <CopilotSidebar
      clickOutsideToClose={false}
      defaultOpen={false}
      labels={{
        title: "AI Assistant",
        initial: "Hi, I'm the Overture Systems Solutions assistant. I can help you:\n\n- Find the right service for your goals\n- Understand the AI Center of Excellence and how to get started\n- Set up an executive briefing with our team\n\nWhat brings you here today?"
      }}
    />
  );
}
