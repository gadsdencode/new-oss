// app/components/copilot-sidebar-wrapper.tsx
"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { usePaymentTools } from "@/app/ai/AIPageTools";

export function CopilotSidebarWrapper() {
  // Register payment tools with Generative UI
  usePaymentTools();

  return (
    <CopilotSidebar
      clickOutsideToClose={false}
      defaultOpen={false}
      labels={{
        title: "AI Assistant",
        initial: "👋 Hi! I'm your AI assistant for Overture Systems Solutions.\n\nI can help you with:\n- **Navigation**: Find information about our services\n- **Information**: Learn about AI consulting and solutions\n- **Support**: Answer questions about our offerings\n- **Payments**: Process payments directly in the chat\n\nHow can I assist you today?"
      }}
    />
  );
}

