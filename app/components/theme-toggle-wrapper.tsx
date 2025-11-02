"use client";

import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { cn } from "@/lib/utils";

/**
 * Wrapper component for the theme toggle that adjusts its positioning
 * and z-index based on whether the CopilotKit sidebar is open.
 * This prevents the theme toggle from obscuring the sidebar's close button.
 */
export function ThemeToggleWrapper() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Watch for changes to CopilotKit sidebar state
    const checkSidebarState = () => {
      // Check if the sidebar window has the 'open' class
      // CopilotKit uses: .copilotKitSidebar .copilotKitWindow.open
      const sidebarWindow = document.querySelector(
        ".copilotKitSidebar .copilotKitWindow.open"
      );
      const isOpen = !!sidebarWindow;
      setIsSidebarOpen(isOpen);
    };

    // Initial check after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(checkSidebarState, 100);

    // Watch for DOM changes to detect when sidebar opens/closes
    const observer = new MutationObserver((mutations) => {
      // Only check if mutations involve class changes or element additions
      const shouldCheck = mutations.some((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          return true;
        }
        if (mutation.type === "childList") {
          return Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              (node instanceof Element &&
                (node.classList.contains("copilotKitSidebar") ||
                  node.classList.contains("copilotKitWindow") ||
                  node.querySelector?.(".copilotKitSidebar, .copilotKitWindow")))
          );
        }
        return false;
      });

      if (shouldCheck) {
        checkSidebarState();
      }
    });

    // Observe changes in the document body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed top-4 right-4 transition-all duration-200",
        // When sidebar is open, lower z-index to be behind it
        // CopilotKit sidebar uses z-30, so we use z-20 to be below it
        isSidebarOpen ? "z-20" : "z-40"
      )}
    >
      <AnimatedThemeToggler />
    </div>
  );
}

