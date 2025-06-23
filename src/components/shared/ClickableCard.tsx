import React from 'react';
import { useTheme } from '../ui/ThemeProvider';
import { Card } from '../ui/Card';

interface ClickableCardProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const ClickableCard: React.FC<ClickableCardProps> = ({
  children,
  onClick,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <div 
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <Card className={`${
        theme === 'gradient' ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'hover:shadow-lg'
      } transition-all duration-200 group`}>
        {children}
      </Card>
    </div>
  );
}; 