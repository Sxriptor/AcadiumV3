import React, { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { useTheme } from '../ui/ThemeProvider';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
  className = ''
}) => {
  const { theme } = useTheme();
  
  return (
    <Card className={`h-full ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${
            theme === 'gradient' 
              ? 'text-gray-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {title}
          </p>
          <h4 className={`mt-2 text-2xl font-semibold ${
            theme === 'gradient' 
              ? 'text-white' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {value}
          </h4>
          
          {trend && (
            <div className="mt-1 flex items-center">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className={`ml-2 text-xs ${
                theme === 'gradient' 
                  ? 'text-gray-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>from last period</span>
            </div>
          )}
          
          {description && (
            <p className={`mt-2 text-sm ${
              theme === 'gradient' 
                ? 'text-gray-300' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {description}
            </p>
          )}
        </div>
        
        <div className={`p-2 rounded-lg ${
          theme === 'gradient' 
            ? 'bg-gray-800 text-gray-300' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
        }`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};