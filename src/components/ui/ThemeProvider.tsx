import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'gradient';
type GradientType = 'blueRed' | 'purpleBlue' | 'greenTeal' | 'orangePink' | 'darkTeal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  gradientType: GradientType;
  setGradientType: (gradient: GradientType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const gradientOptions = {
  blueRed: 'linear-gradient(to bottom right, rgb(29 78 216), rgb(220 38 38))',
  purpleBlue: 'linear-gradient(to bottom right, rgb(109 40 217), rgb(59 130 246))',
  greenTeal: 'linear-gradient(to bottom right, rgb(34 197 94), rgb(20 184 166))',
  orangePink: 'linear-gradient(to bottom right, rgb(249 115 22), rgb(236 72 153))',
  darkTeal: 'linear-gradient(to bottom right, rgb(15 23 42), rgb(6 182 212))'
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  const [gradientType, setGradientType] = useState<GradientType>(() => {
    const savedGradient = localStorage.getItem('gradientType') as GradientType;
    return savedGradient || 'blueRed';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'gradient');
    root.classList.add(theme);
    
    // Apply gradient mode styles
    if (theme === 'gradient') {
      root.style.setProperty('--gradient-bg', gradientOptions[gradientType]);
    } else {
      root.style.removeProperty('--gradient-bg');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme, gradientType]);

  useEffect(() => {
    localStorage.setItem('gradientType', gradientType);
  }, [gradientType]);

  // Apply UI density setting from localStorage on initial load
  useEffect(() => {
    const savedDensity = localStorage.getItem('ui-density');
    if (savedDensity === 'compact') {
      document.documentElement.style.fontSize = '75%';
      document.documentElement.classList.add('ui-compact');
      document.documentElement.classList.remove('ui-comfortable');
    } else {
      document.documentElement.style.fontSize = '100%';
      document.documentElement.classList.add('ui-comfortable');
      document.documentElement.classList.remove('ui-compact');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, gradientType, setGradientType }}>
      {children}
    </ThemeContext.Provider>
  );
};