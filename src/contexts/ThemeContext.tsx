import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'small' | 'medium' | 'large';
}

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '174 77% 56%', // Teal
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 'medium',
  borderRadius: 'medium',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    localStorage.setItem('erp-theme', JSON.stringify(newTheme));
    applyThemeToDOM(newTheme);
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.removeItem('erp-theme');
    applyThemeToDOM(defaultTheme);
  };

  const applyThemeToDOM = (themeConfig: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply primary color
    root.style.setProperty('--primary', themeConfig.primaryColor);
    root.style.setProperty('--sidebar-primary', themeConfig.primaryColor);
    root.style.setProperty('--ring', themeConfig.primaryColor);
    
    // Apply font family
    root.style.setProperty('--font-family', themeConfig.fontFamily);
    document.body.style.fontFamily = themeConfig.fontFamily;
    
    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--base-font-size', fontSizes[themeConfig.fontSize]);
    root.style.fontSize = fontSizes[themeConfig.fontSize];
    
    // Apply border radius
    const radiusValues = {
      small: '0.375rem',
      medium: '0.75rem',
      large: '1rem',
    };
    root.style.setProperty('--radius', radiusValues[themeConfig.borderRadius]);
  };

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('erp-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        applyThemeToDOM(parsedTheme);
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    } else {
      applyThemeToDOM(defaultTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};