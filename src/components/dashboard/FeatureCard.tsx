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
        <div className="flex flex-col h-full">
          <div className={`p-3 mb-4 rounded-lg bg-gradient-to-br ${gradient} w-12 h-12 flex items-center justify-center text-white`}>
            {icon}
          </div>
          
          <h3 className={`text-lg font-semibold mb-2 ${
            theme === 'gradient' 
              ? 'text-white' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {title}
          </h3>
          
          <p className={`text-sm flex-grow mb-4 ${
            theme === 'gradient' 
              ? 'text-gray-300' 
              : 'text-gray-600 dark:text-gray-300'
          }`}>
            {description}
          </p>
          
          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
            <span>Explore</span>
            <ArrowRight size={16} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
};