"use client";

import { defaultPresets } from "./theme-presets";
import { ThemePreset } from "@/types/theme";
import { defaultThemeState } from "@/config/theme";
import { getPresetThemeStyles } from "./theme-preset-helper";

// Save current theme preset to localStorage
export function saveThemePreset(presetName: string): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("current-theme-preset", presetName);
  } catch (error) {
    console.error("Error saving theme preset:", error);
  }
}

// Get current theme preset from localStorage
export function getThemePreset(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    return localStorage.getItem("current-theme-preset");
  } catch (error) {
    console.error("Error getting theme preset:", error);
    return null;
  }
}

// Apply theme to document
export function applyThemeToDocument(presetName: string, mode: "light" | "dark" = "light"): void {
  if (typeof window === "undefined") return;
  
  try {
    const preset = defaultPresets[presetName as keyof typeof defaultPresets] as ThemePreset;
    if (!preset) return;
    
    const rootElement = document.documentElement;
    const themeStyles = preset.styles[mode];
    
    // Apply all CSS variables from the theme
    Object.entries(themeStyles).forEach(([key, value]) => {
      rootElement.style.setProperty(`--${key}`, value);
    });
    
    // Save to localStorage
    saveThemePreset(presetName);
  } catch (error) {
    console.error("Error applying theme to document:", error);
  }
}

// Set theme color mode (light/dark)
export function setThemeMode(mode: "light" | "dark"): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("theme-mode", mode);
    const presetName = getThemePreset() || "notebook";
    applyThemeToDocument(presetName, mode);
  } catch (error) {
    console.error("Error setting theme mode:", error);
  }
}

// Get theme color mode from localStorage or system preference
export function getThemeMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  
  try {
    const savedMode = localStorage.getItem("theme-mode");
    if (savedMode === "light" || savedMode === "dark") {
      return savedMode;
    }
    
    // Fall back to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (error) {
    console.error("Error getting theme mode:", error);
    return "light";
  }
}

// Initialize theme from localStorage or defaults
export function initializeTheme(): void {
  if (typeof window === "undefined") return;
  
  try {
    const mode = getThemeMode();
    const presetName = getThemePreset() || "notebook";
    applyThemeToDocument(presetName, mode);
  } catch (error) {
    console.error("Error initializing theme:", error);
  }
} 