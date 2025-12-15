import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to darken a hex color for hover states
const darkenColor = (hex: string, percent: number) => {
  let num = parseInt(hex.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      B = ((num >> 8) & 0x00FF) - amt,
      G = (num & 0x0000FF) - amt;

  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
      (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
      (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColorState] = useState(() => {
    return localStorage.getItem('theme_accent_color') || '#007BFF';
  });

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    localStorage.setItem('theme_accent_color', color);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', accentColor);
    // Darken by 10% for hover
    root.style.setProperty('--color-accent-hover', darkenColor(accentColor, 10));
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};