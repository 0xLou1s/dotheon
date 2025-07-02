"use client";

import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/store/editor-store";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  MonitorIcon,
  CheckIcon,
  SettingsIcon,
} from "lucide-react";

// Simple theme preview component
const ThemePreview = ({
  mode,
  isSelected,
  onClick,
}: {
  mode: "light" | "dark";
  isSelected: boolean;
  onClick: () => void;
}) => {
  const getIcon = () => {
    switch (mode) {
      case "light":
        return <SunIcon className="h-4 w-4" />;
      case "dark":
        return <MoonIcon className="h-4 w-4" />;
    }
  };

  const getPreviewColors = () => {
    switch (mode) {
      case "light":
        return {
          bg: "bg-gray-50",
          card: "bg-white",
          accent: "bg-gray-200",
          border: "border-gray-200",
        };
      case "dark":
        return {
          bg: "bg-gray-900",
          card: "bg-gray-800",
          accent: "bg-gray-600",
          border: "border-gray-700",
        };
    }
  };

  const colors = getPreviewColors();

  return (
    <motion.div
      className={`relative cursor-pointer rounded-lg border-2 p-1 transition-all duration-200 ${
        isSelected
          ? "border-foreground"
          : "border-border hover:border-muted-foreground"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10 rounded-full bg-foreground p-1">
          <CheckIcon className="h-3 w-3 text-background" />
        </div>
      )}

      {/* Theme preview */}
      <div className={`space-y-2 rounded-md ${colors.bg} p-3`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between rounded-md ${colors.card} p-2 ${colors.border} border`}
        >
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colors.accent}`} />
            <div className={`h-1.5 w-8 rounded ${colors.accent}`} />
          </div>
          <div className={`h-1.5 w-4 rounded ${colors.accent}`} />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div
            className={`rounded-md ${colors.card} p-2 ${colors.border} border`}
          >
            <div className={`h-1.5 w-12 rounded ${colors.accent} mb-1`} />
            <div className={`h-1 w-16 rounded ${colors.accent}`} />
          </div>
          <div
            className={`flex items-center gap-2 rounded-md ${colors.card} p-2 ${colors.border} border`}
          >
            <div className={`h-2.5 w-2.5 rounded-full ${colors.accent}`} />
            <div className={`h-1 w-10 rounded ${colors.accent}`} />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span
            className={isSelected ? "text-foreground" : "text-muted-foreground"}
          >
            {getIcon()}
          </span>
        </div>
        <span
          className={`text-sm font-medium capitalize ${
            isSelected ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {mode}
        </span>
      </div>
    </motion.div>
  );
};

export function AppearanceForm() {
  const { themeState, setThemeState } = useEditorStore();
  const [currentMode, setCurrentMode] = useState<"light" | "dark" | "system">(
    themeState.currentMode || "light"
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Load saved theme mode on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("theme-mode") as
        | "light"
        | "dark"
        | "system";
      if (savedMode) {
        setCurrentMode(savedMode);
      }
    }
  }, []);

  const handleThemeModeChange = async (mode: "light" | "dark" | "system") => {
    setCurrentMode(mode);
    setIsUpdating(true);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 300));

    setThemeState({
      ...themeState,
      currentMode: mode as "light" | "dark",
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("theme-mode", mode);
    }

    setIsUpdating(false);
  };

  const handleUpdatePreferences = async () => {
    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsUpdating(false);
  };

  const getModeIcon = () => {
    switch (currentMode) {
      case "light":
        return <SunIcon className="h-4 w-4" />;
      case "dark":
        return <MoonIcon className="h-4 w-4" />;
      case "system":
        return <MonitorIcon className="h-4 w-4" />;
    }
  };

  const getModeDescription = () => {
    switch (currentMode) {
      case "light":
        return "Bright and clean interface";
      case "dark":
        return "Dark theme for comfortable viewing";
      case "system":
        return "Automatically matches your system preference";
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent">
            <SettingsIcon className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Appearance</h3>
            <p className="text-sm text-muted-foreground">
              Customize how your interface looks and feels
            </p>
          </div>
        </div>
      </div>

      {/* Current Theme Display */}
      <div className="p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">{getModeIcon()}</div>
            <div>
              <p className="font-medium capitalize text-foreground">
                {currentMode} Mode
              </p>
              <p className="text-xs text-muted-foreground">
                {getModeDescription()}
              </p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 border-green-200"
          >
            <CheckIcon className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-1">Theme Mode</h4>
          <p className="text-sm text-muted-foreground">
            Select your preferred appearance
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(["light", "dark"] as const).map((mode) => (
            <ThemePreview
              key={mode}
              mode={mode}
              isSelected={currentMode === mode}
              onClick={() => handleThemeModeChange(mode)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
