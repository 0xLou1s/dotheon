"use client";

import { useState, useEffect } from "react";
import { WhatsNewDialog } from "./index";

// Key used in sessionStorage to track if the user has seen the What's New dialog in the current session
const SESSION_KEY = "dotheon_whatsnew_shown";

interface SessionWhatsNewDialogProps {
  // Version identifier - increment this when you have new content to show
  version?: string;
  // If true, will show on each session. If false, will only show on version changes
  showEachSession?: boolean;
}

export function SessionWhatsNewDialog({
  version = "1.0",
  showEachSession = false,
}: SessionWhatsNewDialogProps) {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // This effect will run only on the client side
    const checkAndShowDialog = () => {
      if (typeof window === "undefined") return;

      // Get the current session value
      const sessionValue = sessionStorage.getItem(SESSION_KEY);

      if (showEachSession) {
        // If showEachSession is true, show dialog if it hasn't been shown in this session
        if (!sessionValue) {
          setShowDialog(true);
          sessionStorage.setItem(SESSION_KEY, "shown");
        }
      } else {
        // Otherwise, show dialog only when version changes or first time
        if (!sessionValue || sessionValue !== version) {
          setShowDialog(true);
          sessionStorage.setItem(SESSION_KEY, version);
        }
      }
    };

    // Slight delay to avoid immediate popup which can be jarring
    const timer = setTimeout(() => {
      checkAndShowDialog();
    }, 1000);

    return () => clearTimeout(timer);
  }, [version, showEachSession]);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <WhatsNewDialog
      open={showDialog}
      onOpenChange={(open) => {
        if (!open) handleDialogClose();
      }}
    />
  );
}

export default SessionWhatsNewDialog;
