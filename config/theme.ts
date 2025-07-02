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

export const DEFAULT_FONT_SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Default light theme styles
export const defaultLightThemeStyles = {
  background: "#f9f9f9",
        foreground: "#3a3a3a",
        card: "#ffffff",
        "card-foreground": "#3a3a3a",
        popover: "#ffffff",
        "popover-foreground": "#3a3a3a",
        primary: "#606060",
        "primary-foreground": "#f0f0f0",
        secondary: "#dedede",
        "secondary-foreground": "#3a3a3a",
        muted: "#e3e3e3",
        "muted-foreground": "#505050",
        accent: "#f3eac8",
        "accent-foreground": "#5d4037",
        destructive: "#c87a7a",
        "destructive-foreground": "#ffffff",
        border: "#747272",
        input: "#ffffff",
        ring: "#a0a0a0",
        "chart-1": "#333333",
        "chart-2": "#555555",
        "chart-3": "#777777",
        "chart-4": "#999999",
        "chart-5": "#bbbbbb",
        sidebar: "#f0f0f0",
        "sidebar-foreground": "#3a3a3a",
        "sidebar-primary": "#606060",
        "sidebar-primary-foreground": "#f0f0f0",
        "sidebar-accent": "#f3eac8",
        "sidebar-accent-foreground": "#5d4037",
        "sidebar-border": "#c0c0c0",
        "sidebar-ring": "#a0a0a0",
        "font-sans": "Architects Daughter, sans-serif",
        "font-serif": '"Times New Roman", Times, serif',
        "font-mono": '"Courier New", Courier, monospace',
        radius: "0.625rem",
        "shadow-color": "#000000",
        "shadow-opacity": "0.03",
        "shadow-blur": "5px",
        "shadow-spread": "0px",
        "shadow-offset-x": "1px",
        "shadow-offset-y": "4px",
        "letter-spacing": "0.5px",
        spacing: "0.25rem",
};

// Default dark theme styles
export const defaultDarkThemeStyles = {
  ...defaultLightThemeStyles,
  background: "#2b2b2b",
        foreground: "#dcdcdc",
        card: "#333333",
        "card-foreground": "#dcdcdc",
        popover: "#333333",
        "popover-foreground": "#dcdcdc",
        primary: "#b0b0b0",
        "primary-foreground": "#2b2b2b",
        secondary: "#5a5a5a",
        "secondary-foreground": "#c0c0c0",
        muted: "#454545",
        "muted-foreground": "#a0a0a0",
        accent: "#e0e0e0",
        "accent-foreground": "#333333",
        destructive: "#d9afaf",
        "destructive-foreground": "#2b2b2b",
        border: "#4f4f4f",
        input: "#333333",
        ring: "#c0c0c0",
        "chart-1": "#efefef",
        "chart-2": "#d0d0d0",
        "chart-3": "#b0b0b0",
        "chart-4": "#909090",
        "chart-5": "#707070",
        sidebar: "#212121",
        "sidebar-foreground": "#dcdcdc",
        "sidebar-primary": "#b0b0b0",
        "sidebar-primary-foreground": "#212121",
        "sidebar-accent": "#e0e0e0",
        "sidebar-accent-foreground": "#333333",
        "sidebar-border": "#4f4f4f",
        "sidebar-ring": "#c0c0c0",
        "font-sans": "Architects Daughter, sans-serif",
        "font-serif": "Georgia, serif",
        "font-mono": '"Fira Code", "Courier New", monospace',
        radius: "0.625rem",
        "shadow-color": "#000000",
        "shadow-opacity": "0.03",
        "shadow-blur": "5px",
        "shadow-spread": "0px",
        "shadow-offset-x": "1px",
        "shadow-offset-y": "4px",
        "letter-spacing": "0.5px",
        spacing: "0.25rem",
};

// Default theme state
export const defaultThemeState: ThemeEditorState = {
  styles: {
    light: defaultLightThemeStyles,
    dark: defaultDarkThemeStyles,
  },
  currentMode:
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark",
  hslAdjustments: {
    hueShift: 0,
    saturationScale: 1,
    lightnessScale: 1,
  },
};
