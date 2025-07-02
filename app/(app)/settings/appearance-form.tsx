"use client";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";

export function AppearanceForm() {
  const { themeState, setThemeState } = useEditorStore();
  const currentMode = themeState.currentMode;

  const toggleThemeMode = () => {
    const newMode = currentMode === "light" ? "dark" : "light";
    setThemeState({
      ...themeState,
      currentMode: newMode,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("theme-mode", newMode);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Mode</h3>
        <p className="text-sm text-muted-foreground">
          Select the theme mode you prefer.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant={currentMode === "light" ? "default" : "outline"}
          onClick={() => {
            if (currentMode !== "light") toggleThemeMode();
          }}
        >
          Light
        </Button>
        <Button
          variant={currentMode === "dark" ? "default" : "outline"}
          onClick={() => {
            if (currentMode !== "dark") toggleThemeMode();
          }}
        >
          Dark
        </Button>
      </div>
    </div>
  );
}
