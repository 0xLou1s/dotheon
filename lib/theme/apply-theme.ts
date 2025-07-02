"use client";

import { ThemeEditorState } from "@/types/editor";
import { ThemeStyleProps, ThemeStyles } from "@/types/theme";
import { colorFormatter } from "./color-converter";
import { setShadowVariables } from "@/lib/theme/shadows";
import { applyStyleToElement } from "@/lib/theme/apply-style-to-element";
import { COMMON_STYLES } from "@/config/theme";

type Theme = "dark" | "light";

const COMMON_NON_COLOR_KEYS = COMMON_STYLES;

// Helper functions (not exported, used internally by applyThemeToElement)
const updateThemeClass = (root: HTMLElement, mode: Theme) => {
  if (mode === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }
};

const applyCommonStyles = (root: HTMLElement, themeStyles: ThemeStyleProps) => {
  Object.entries(themeStyles)
    .filter(([key]) =>
      COMMON_NON_COLOR_KEYS.includes(
        key as (typeof COMMON_NON_COLOR_KEYS)[number]
      )
    )
    .forEach(([key, value]) => {
      if (typeof value === "string") {
        applyStyleToElement(root, key, value);
      }
    });
};

const applyThemeColors = (
  root: HTMLElement,
  themeStyles: ThemeStyles,
  mode: Theme
) => {
  Object.entries(themeStyles[mode]).forEach(([key, value]) => {
    if (
      typeof value === "string" &&
      !COMMON_NON_COLOR_KEYS.includes(
        key as (typeof COMMON_NON_COLOR_KEYS)[number]
      )
    ) {
      const hslValue = colorFormatter(value, "hsl", "4");
      applyStyleToElement(root, key, hslValue);
    }
  });
};

/**
 * Applies theme styles to an HTML element
 */
export function applyThemeToElement(
  themeState: ThemeEditorState,
  element: HTMLElement
): void {
  try {
    const currentMode = themeState.currentMode || "light";
    const themeStyles = themeState.styles[currentMode];

    // Apply all CSS variables from the theme
    Object.entries(themeStyles).forEach(([key, value]) => {
      element.style.setProperty(`--${key}`, value);
    });

    // Save current mode to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme-mode", currentMode);
    }
  } catch (error) {
    console.error("Error applying theme:", error);
  }
}
