import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
  closeable?: boolean;
}

interface MainContentTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

export const MainContentTabs: React.FC<MainContentTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose
}) => {
  const { theme } = useTheme();

  if (tabs.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        theme === 'gradient'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
          Select a step to open it in a tab
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${
      theme === 'gradient'
        ? 'bg-gray-800/50 border-gray-700'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      {/* Tab Headers */}
      <div className={`flex items-center border-b overflow-x-auto ${
        theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap
              transition-all duration-200 border-b-2
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : theme === 'gradient'
                  ? 'border-transparent text-gray-300 hover:text-white hover:bg-gray-700/50'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            <span>{tab.title}</span>
            {tab.closeable && onTabClose && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  theme === 'gradient' ? 'hover:bg-gray-600' : ''
                }`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};