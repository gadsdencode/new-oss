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
        initial: "👋 Hi! I'm your AI assistant for Overture Systems Solutions.\n\nI can help you with:\n- **Navigation**: Find information about our services\n- **Information**: Learn about AI consulting and solutions\n- **Support**: Answer questions about our offerings\n\nHow can I assist you today?"
      }}
    />
  );
}

