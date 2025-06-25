"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";

export type TourStep = {
  element: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
  };
};

type OnboardingTourProps = {
  steps: TourStep[];
  showTour?: boolean;
  onClose?: () => void;
};

export function OnboardingTour({
  steps,
  showTour = false,
  onClose,
}: OnboardingTourProps) {
  const [driverObj, setDriverObj] = useState<any>(null);

  // Create a new driver instance when component mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    const driverInstance = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps: steps,
      animate: true,
      allowClose: true,
      onDestroyStarted: () => {
        if (onClose) onClose();
      },
      onDestroyed: () => {
        if (onClose) onClose();
      },
      stagePadding: 10,
      popoverClass: "dotheon-popover",
      smoothScroll: true,
    });

    setDriverObj(driverInstance);

    return () => {
      driverInstance.destroy();
    };
  }, [steps, onClose]);

  // Start or stop the tour when showTour changes
  useEffect(() => {
    if (!driverObj) return;

    if (showTour) {
      driverObj.drive();

      // Add manual handler for the Done button on the last step
      const handleLastStep = () => {
        const doneBtn = document.querySelector(
          ".driver-popover-footer .driver-next-btn"
        );
        if (doneBtn) {
          doneBtn.addEventListener("click", () => {
            if (onClose) onClose();
          });
        }
      };

      // Wait for the tour to initialize
      setTimeout(handleLastStep, 500);
    } else {
      driverObj.destroy();
    }
  }, [driverObj, showTour, onClose]);

  // Add global escape key handler
  useEffect(() => {
    if (typeof window === "undefined" || !showTour) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTour, onClose]);

  return null;
}

export function StartTourButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      Tour Guide
    </Button>
  );
}
