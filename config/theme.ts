import { ThemeEditorState } from "../types/editor";

// these are common between light and dark modes
// we can assume that light mode's value will be used for dark mode as well
export const COMMON_STYLES = [
  "font-sans",
  "font-serif",
  "font-mono",
  "radius",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
  "letter-spacing",
  "spacing",
];

export const DEFAULT_FONT_SANS =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export const DEFAULT_FONT_SERIF =
  'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Default light theme styles
export const defaultLightThemeStyles = {
  background: "#fdfdfd",
  foreground: "#000000",
  card: "#fdfdfd",
  "card-foreground": "#000000",
  popover: "#fcfcfc",
  "popover-foreground": "#000000",
  primary: "#ff8e42",
  "primary-foreground": "#ffffff",
  secondary: "#edf0f4",
  "secondary-foreground": "#57534e",
  muted: "#f5f5f5",
  "muted-foreground": "#525252",
  accent: "#f2daba",
  "accent-foreground": "#57534e",
  destructive: "#e54b4f",
  "destructive-foreground": "#ffffff",
  border: "#e7e7ee",
  input: "#ebebeb",
  ring: "#f59e0b",
  "chart-1": "#f59e0b",
  "chart-2": "#d97706",
  "chart-3": "#b45309",
  "chart-4": "#92400e",
  "chart-5": "#78350f",
  sidebar: "#f5f8fb",
  "sidebar-foreground": "#000000",
  "sidebar-primary": "#000000",
  "sidebar-primary-foreground": "#ffffff",
  "sidebar-accent": "#ebebeb",
  "sidebar-accent-foreground": "#000000",
  "sidebar-border": "#ebebeb",
  "sidebar-ring": "#000000",
  "font-sans": "Plus Jakarta Sans, sans-serif",
  "font-serif": "Lora, serif",
  "font-mono": "IBM Plex Mono, monospace",
  radius: "1.4rem",
  spacing: "0.27rem",
  "shadow-color": "hsl(0 0% 0%)",
  "shadow-opacity": "0.16",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "2px",
  "letter-spacing": "0.5px",
};

// Default dark theme styles
export const defaultDarkThemeStyles = {
  ...defaultLightThemeStyles,
  background: "#1a1b1e",
  foreground: "#f0f0f0",
  card: "#222327",
  "card-foreground": "#f0f0f0",
  popover: "#222327",
  "popover-foreground": "#f0f0f0",
  primary: "#f38d33",
  "primary-foreground": "#ffffff",
  secondary: "#2a2c33",
  "secondary-foreground": "#57534e",
  muted: "#2a2c33",
  "muted-foreground": "#a0a0a0",
  accent: "#1e4252",
  "accent-foreground": "#e7e5e4",
  destructive: "#f87171",
  "destructive-foreground": "#ffffff",
  border: "#33353a",
  input: "#33353a",
  ring: "#f59e0b",
  "chart-1": "#fbbf24",
  "chart-2": "#d97706",
  "chart-3": "#92400e",
  "chart-4": "#b45309",
  "chart-5": "#92400e",
  sidebar: "#161618",
  "sidebar-foreground": "#f0f0f0",
  "sidebar-primary": "#8c5cff",
  "sidebar-primary-foreground": "#ffffff",
  "sidebar-accent": "#2a2c33",
  "sidebar-accent-foreground": "#8c5cff",
  "sidebar-border": "#33353a",
  "sidebar-ring": "#8c5cff",
  "font-sans": "Plus Jakarta Sans, sans-serif",
  "font-serif": "Lora, serif",
  "font-mono": "IBM Plex Mono, monospace",
  radius: "1.4rem",
  "shadow-color": "hsl(0 0% 0%)",
  "shadow-opacity": "0.16",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "2px",
};

// Default theme state
export const defaultThemeState: ThemeEditorState = {
  styles: {
    light: defaultLightThemeStyles,
    dark: defaultDarkThemeStyles,
  },
  currentMode:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  hslAdjustments: {
    hueShift: 0,
    saturationScale: 1,
    lightnessScale: 1,
  },
};
