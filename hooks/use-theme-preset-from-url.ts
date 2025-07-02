import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { useEditorStore } from "@/store/editor-store";

export const useThemePresetFromUrl = () => {
  const [preset, setPreset] = useQueryState("theme");
  const applyThemePreset = useEditorStore((state) => state.applyThemePreset);
  const initialLoadDone = useRef(false);

  // Apply theme preset if it exists in URL and remove it
  useEffect(() => {
    if (!initialLoadDone.current && preset) {
      applyThemePreset(preset);
      setPreset(null); // Remove the preset from URL
      initialLoadDone.current = true;
    }
  }, []);
}; 