"use client";

import { defaultPresets } from "./theme-presets";

// This script runs on the client-side to initialize theme before React hydration
// to prevent flashing of incorrect theme
export function initializeThemeScript() {
  const script = `
    (function() {
      try {
        const savedTheme = localStorage.getItem('current-theme-preset') || 'modern-minimal';
        const savedMode = localStorage.getItem('theme-mode') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply theme variables immediately
        document.documentElement.classList.add(savedMode);
      } catch (e) {
        console.error('Error initializing theme:', e);
      }
    })();
  `;
  
  return script;
}

// Use this function to get the script as a string
export function getInitializeThemeScriptAsString(): string {
  return `
    (function() {
      try {
        const savedTheme = localStorage.getItem('current-theme-preset') || 'modern-minimal';
        const savedMode = localStorage.getItem('theme-mode') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply theme variables immediately
        document.documentElement.classList.add(savedMode);
      } catch (e) {
        console.error('Error initializing theme:', e);
      }
    })();
  `;
} 