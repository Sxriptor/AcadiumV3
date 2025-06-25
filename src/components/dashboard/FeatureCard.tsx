import React, { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { useTheme } from '../ui/ThemeProvider';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
  gradient?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  to,
  gradient = 'from-blue-500 to-indigo-600'
}) => {
  const { theme } = useTheme();
  
  return (
    <Link to={to} className="block group">
      <Card 
        glassEffect
        className="h-full transition-all duration-300 hover:shadow-md group-hover:translate-y-[-4px]"
      >
        <div className="flex sm:flex-col h-full">
          <div className={`p-2 sm:p-3 mb-0 sm:mb-3 mr-3 sm:mr-0 rounded-lg bg-gradient-to-br ${gradient} w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center text-white flex-shrink-0`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: 'h-4 w-4 sm:h-6 sm:w-6'
            })}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm sm:text-lg font-semibold mb-0.5 sm:mb-2 truncate ${
              theme === 'gradient' 
                ? 'text-white' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {title}
            </h3>
            
            <p className={`text-xs sm:text-sm flex-grow mb-1 sm:mb-4 line-clamp-2 sm:line-clamp-none ${
              theme === 'gradient' 
                ? 'text-gray-300' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {description}
            </p>
            
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium">
              <span className="sm:inline hidden">Explore</span>
              <span className="sm:hidden">Learn More</span>
              <ArrowRight size={12} className="ml-1 transition-transform duration-200 group-hover:translate-x-1 sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};