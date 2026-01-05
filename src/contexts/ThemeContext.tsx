import { updateSettings } from "@/services/settings.services";
import { SettingsType } from "@/types/settings.type";
import { getItem, storageKeys } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: SettingsType;
  updateTheme: (updates: Partial<SettingsType>) => void;
  resetTheme: () => void;
  saveTheme:(updates: Partial<SettingsType>)=>void
}

const defaultTheme: SettingsType = {
  primaryColor: "174 77% 56%",
  fontFamily: "Montserrat, system-ui, sans-serif",
  fontSize: "small",
  borderRadius: "small",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<SettingsType>(defaultTheme);

  const updateTheme = (updates: Partial<SettingsType>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    localStorage.setItem("erp-theme", JSON.stringify(newTheme));
    applyThemeToDOM(newTheme);
  };

    const { mutate: saveTheme } = useMutation({
    mutationFn: updateSettings,
    onSuccess: (result) => {
      updateTheme(result.data)
    },

  });

  const resetTheme = () => {
    const user = getItem(storageKeys.user)
    saveTheme({...defaultTheme,userId:user.userId})
  };

  const applyThemeToDOM = (SettingsType: SettingsType) => {
    const root = document.documentElement;

    // Apply primary color
    root.style.setProperty("--primary", SettingsType.primaryColor);
    root.style.setProperty("--sidebar-primary", SettingsType.primaryColor);
    root.style.setProperty("--ring", SettingsType.primaryColor);

    // Apply font family
    root.style.setProperty("--font-family", SettingsType.fontFamily);
    document.body.style.fontFamily = SettingsType.fontFamily;

    // Apply font size
    const fontSizes = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.setProperty(
      "--base-font-size",
      fontSizes[SettingsType.fontSize]
    );
    root.style.fontSize = fontSizes[SettingsType.fontSize];

    // Apply border radius
    const radiusValues = {
      small: "0.375rem",
      medium: "0.75rem",
      large: "1rem",
    };
    root.style.setProperty("--radius", radiusValues[SettingsType.borderRadius]);
  };

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("erp-theme");
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        applyThemeToDOM(parsedTheme);
      } catch (error) {
        console.error("Error parsing saved theme:", error);
      }
    } else {
      applyThemeToDOM(defaultTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme,saveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
