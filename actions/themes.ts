"use client";

import { z } from "zod";
import { themeStylesSchema, type ThemeStyles } from "@/types/theme";

// Define error classes
class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "ValidationError";
  }
}

class ThemeNotFoundError extends Error {
  constructor(message: string = "Theme not found") {
    super(message);
    this.name = "ThemeNotFoundError";
  }
}

class ThemeLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ThemeLimitError";
  }
}

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper to get user ID - this is simplified for localStorage
function getCurrentUserId(): string {
  return "default-user";
}

// Log errors for observability
function logError(error: Error, context: Record<string, any>) {
  console.error("Theme action error:", error, context);
}

const createThemeSchema = z.object({
  name: z.string().min(1, "Theme name cannot be empty").max(50, "Theme name too long"),
  styles: themeStylesSchema,
});

const updateThemeSchema = z.object({
  id: z.string().min(1, "Theme ID required"),
  name: z.string().min(1, "Theme name cannot be empty").max(50, "Theme name too long").optional(),
  styles: themeStylesSchema.optional(),
});

// Local Storage Keys
const THEMES_STORAGE_KEY = "user-themes";

// Helper to get themes from localStorage
function getThemesFromStorage(): any[] {
  if (typeof window === "undefined") return [];
  
  try {
    const storedThemes = localStorage.getItem(THEMES_STORAGE_KEY);
    return storedThemes ? JSON.parse(storedThemes) : [];
  } catch (error) {
    console.error("Error reading themes from localStorage:", error);
    return [];
  }
}

// Helper to save themes to localStorage
function saveThemesToStorage(themes: any[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(themes));
  } catch (error) {
    console.error("Error saving themes to localStorage:", error);
  }
}

// Layer 1: Clean client functions with proper error handling
export async function getThemes() {
  try {
    const userThemes = getThemesFromStorage();
    return userThemes;
  } catch (error) {
    logError(error as Error, { action: "getThemes" });
    throw error;
  }
}

export async function getTheme(themeId: string) {
  try {
    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    const themes = getThemesFromStorage();
    const theme = themes.find((t) => t.id === themeId);

    if (!theme) {
      throw new ThemeNotFoundError();
    }

    return theme;
  } catch (error) {
    logError(error as Error, { action: "getTheme", themeId });
    throw error;
  }
}

export async function createTheme(formData: { name: string; styles: ThemeStyles }) {
  try {
    const userId = getCurrentUserId();

    const validation = createThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    // Check theme limit
    const userThemes = getThemesFromStorage();
    if (userThemes.length >= 10) {
      throw new ThemeLimitError("You cannot have more than 10 themes yet.");
    }

    const { name, styles } = validation.data;
    const newThemeId = generateId();
    const now = new Date().toISOString();

    const newTheme = {
      id: newThemeId,
      userId: userId,
      name: name,
      styles: styles,
      createdAt: now,
      updatedAt: now,
    };

    // Add to localStorage
    userThemes.push(newTheme);
    saveThemesToStorage(userThemes);

    return newTheme;
  } catch (error) {
    logError(error as Error, { action: "createTheme", formData: { name: formData.name } });
    throw error;
  }
}

export async function updateTheme(formData: { id: string; name?: string; styles?: ThemeStyles }) {
  try {
    const userId = getCurrentUserId();

    const validation = updateThemeSchema.safeParse(formData);
    if (!validation.success) {
      throw new ValidationError("Invalid input", validation.error.format());
    }

    const { id: themeId, name, styles } = validation.data;

    if (!name && !styles) {
      throw new ValidationError("No update data provided");
    }

    // Get themes and find the one to update
    const userThemes = getThemesFromStorage();
    const themeIndex = userThemes.findIndex((theme) => theme.id === themeId);

    if (themeIndex === -1) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }

    // Update the theme
    const updatedTheme = {
      ...userThemes[themeIndex],
      updatedAt: new Date().toISOString(),
    };
    
    if (name) updatedTheme.name = name;
    if (styles) updatedTheme.styles = styles;

    userThemes[themeIndex] = updatedTheme;
    saveThemesToStorage(userThemes);

    return updatedTheme;
  } catch (error) {
    logError(error as Error, { action: "updateTheme", themeId: formData.id });
    throw error;
  }
}

export async function deleteTheme(themeId: string) {
  try {
    const userId = getCurrentUserId();

    if (!themeId) {
      throw new ValidationError("Theme ID required");
    }

    const userThemes = getThemesFromStorage();
    const initialLength = userThemes.length;
    
    const filteredThemes = userThemes.filter((theme) => theme.id !== themeId);
    
    if (filteredThemes.length === initialLength) {
      throw new ThemeNotFoundError("Theme not found or not owned by user");
    }
    
    saveThemesToStorage(filteredThemes);
    
    return { id: themeId, name: "Theme deleted" };
  } catch (error) {
    logError(error as Error, { action: "deleteTheme", themeId });
    throw error;
  }
}

// Add function to get current user's selected theme
export function getCurrentTheme() {
  try {
    if (typeof window === "undefined") return null;
    
    const currentThemeId = localStorage.getItem("current-theme-id");
    if (!currentThemeId) return null;
    
    const themes = getThemesFromStorage();
    return themes.find((theme) => theme.id === currentThemeId) || null;
  } catch (error) {
    logError(error as Error, { action: "getCurrentTheme" });
    return null;
  }
}

// Set current theme
export function setCurrentTheme(themeId: string) {
  try {
    if (typeof window === "undefined") return false;
    
    localStorage.setItem("current-theme-id", themeId);
    return true;
  } catch (error) {
    logError(error as Error, { action: "setCurrentTheme", themeId });
    return false;
  }
}
