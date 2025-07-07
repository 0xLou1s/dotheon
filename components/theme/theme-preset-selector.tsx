"use client";

import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/store/editor-store";
import { defaultPresets } from "@/lib/theme/theme-presets";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { getPresetThemeStyles } from "@/lib/theme/theme-preset-helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, PaletteIcon, CheckIcon } from "lucide-react";
import Link from "next/link";

// Enhanced ColorBox component with better styling and animations
const ColorBox = ({
  color,
  size = "sm",
}: {
  color: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 rounded-[4px] border-white shadow-sm ring-1 ring-black/10`}
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    />
  );
};

// Enhanced ColorPalette component
const ColorPalette = ({
  presetName,
  mode,
  size = "sm",
}: {
  presetName: string;
  mode: string;
  size?: "sm" | "md" | "lg";
}) => {
  const themeStyles =
    getPresetThemeStyles(presetName)[mode as "light" | "dark"];

  return (
    <div className="flex gap-1">
      {["primary", "secondary", "accent", "background"].map((key, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <ColorBox
            color={
              themeStyles[key as keyof typeof themeStyles]?.toString() || "#000"
            }
            size={size}
          />
        </motion.div>
      ))}
    </div>
  );
};

export function ThemePresetSelector() {
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = Object.keys(defaultPresets);
  const initialLoadDone = useRef(false);
  const [open, setOpen] = useState(false);

  // Load theme from localStorage on initial render only
  useEffect(() => {
    if (initialLoadDone.current) return;
    const savedTheme = localStorage.getItem("current-theme-preset");
    if (savedTheme && presetNames.includes(savedTheme)) {
      applyThemePreset(savedTheme);
    }
    initialLoadDone.current = true;
  }, []);

  // Custom theme preset handler that also saves to localStorage
  const handleApplyThemePreset = (preset: string) => {
    applyThemePreset(preset);
    localStorage.setItem("current-theme-preset", preset);
    setOpen(false);
  };

  // Get current theme name
  const currentPresetName = themeState.preset || "notebook";
  const displayName = currentPresetName.replace(/-/g, " ");

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
            <PaletteIcon className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Theme Preset</h3>
            <p className="text-sm text-muted-foreground">
              Choose from our curated collection of beautiful themes
            </p>
          </div>
        </div>
      </div>

      {/* Current Theme Preview */}
      <div className="p-4 rounded-xl border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ColorPalette
              presetName={currentPresetName}
              mode={mode}
              size="md"
            />
            <div>
              <p className="font-medium capitalize text-foreground">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground">Current theme</p>
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

      {/* Theme Selector Dropdown */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className=" justify-between">
            <span className="font-medium">Browse Themes</span>
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 p-2" align="start">
          <div className="p-2 border-b border-border mb-2">
            <p className="text-sm font-medium text-foreground">
              Themes available
            </p>
            <p className="text-xs text-muted-foreground">
              Click to apply a new theme
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by{" "}
              <Link
                className="text-primary underline font-bold"
                href="https://tweakcn.com"
                target="_blank"
              >
                Tweakcn
              </Link>
            </p>
          </div>

          <div className="space-y-1 max-h-60">
            <AnimatePresence>
              {presetNames.map((presetName, index) => {
                const isSelected = presetName === currentPresetName;
                const themeName = presetName.replace(/-/g, " ");

                return (
                  <div key={presetName}>
                    <DropdownMenuItem
                      className={` flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected ? "bg-accent" : "hover:bg-accent"
                      }`}
                      onClick={() => handleApplyThemePreset(presetName)}
                    >
                      <ColorPalette
                        presetName={presetName}
                        mode={mode}
                        size="sm"
                      />

                      <div className="flex-1">
                        <p
                          className={`font-medium capitalize ${
                            isSelected
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {themeName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {presetName.includes("light")
                            ? "Light theme"
                            : presetName.includes("dotheon")
                            ? "Dotheon theme"
                            : presetName.includes("openguild")
                            ? "Open Guild theme"
                            : presetName.includes("buildstation")
                            ? "Build Station theme"
                            : "Beautiful theme"}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="p-1 rounded-full bg-accent">
                          <CheckIcon className="h-3 w-3 text-accent-foreground" />
                        </div>
                      )}
                    </DropdownMenuItem>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
