import React from 'react';
import { useTheme } from '../ui/ThemeProvider';

interface MiniApp {
  id: string;
  name: string;
  icon: string;
  color?: string;
}

interface MiniAppSwitcherProps {
  apps: MiniApp[];
  activeApp: string;
  onAppChange: (appId: string) => void;
  completionData?: { [key: string]: { completed: number; total: number } };
}

export const MiniAppSwitcher: React.FC<MiniAppSwitcherProps> = ({
  apps,
  activeApp,
  onAppChange,
  completionData = {}
}) => {
  const { theme } = useTheme();

  const getCompletionColor = (appId: string) => {
    const data = completionData[appId];
    if (!data || data.total === 0) return 'bg-gray-400';
    
    const percentage = (data.completed / data.total) * 100;
    
    if (percentage >= 67) return 'bg-green-500';
    if (percentage >= 34) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionPercentage = (appId: string) => {
    const data = completionData[appId];
    if (!data || data.total === 0) return 0;
    return Math.round((data.completed / data.total) * 100);
  };

  return (
    <div className={`flex items-center space-x-2 p-1 rounded-lg ${
      theme === 'gradient'
        ? 'bg-gray-800/50'
        : 'bg-gray-100 dark:bg-gray-800'
    }`}>
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onAppChange(app.id)}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
            transition-all duration-200 relative
            ${activeApp === app.id
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
              : theme === 'gradient'
                ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          <span className="text-lg">{app.icon}</span>
          <span>{app.name}</span>
          {/* Completion status dot */}
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${getCompletionColor(app.id)} flex-shrink-0`}></div>
            {/* Tooltip with percentage */}
            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap ${
              theme === 'gradient' 
                ? 'bg-gray-900 text-white border border-gray-700' 
                : 'bg-gray-900 text-white'
            }`}>
              {getCompletionPercentage(app.id)}% complete
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                theme === 'gradient' ? 'border-t-gray-900' : 'border-t-gray-900'
              }`}></div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};