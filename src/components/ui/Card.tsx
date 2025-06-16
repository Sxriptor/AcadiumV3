import React, { ReactNode } from 'react';
import { useTheme } from './ThemeProvider';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  glassEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '',
  glassEffect = false
}) => {
  const { theme } = useTheme();
  
  const getCardStyles = () => {
    if (glassEffect) {
      return 'bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg border border-white/20 dark:border-gray-800/30';
    }
    
    // For gradient mode, use exact same styling as dark mode
    if (theme === 'gradient') {
      return 'bg-gray-800 border border-gray-700';
    }
    
    // Default light/dark mode styling
    return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
  };
  
  const getTitleBorderStyles = () => {
    if (theme === 'gradient') {
      return 'border-gray-700';
    }
    return 'border-gray-200 dark:border-gray-700';
  };
  
  const getTitleTextStyles = () => {
    if (theme === 'gradient') {
      return 'text-white';
    }
    return 'text-gray-900 dark:text-white';
  };
  
  return (
    <div className={`rounded-xl shadow-sm transition-all duration-200 ${getCardStyles()} ${className}`}>
      {title && (
        <div className={`px-5 py-4 border-b ${getTitleBorderStyles()}`}>
          <h3 className={`font-medium ${getTitleTextStyles()}`}>{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};