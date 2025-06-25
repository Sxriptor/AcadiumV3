import React from 'react';
import { useTheme } from '../ui/ThemeProvider';
import { X, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface GuideOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  sections: {
    title: string;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';
    content: React.ReactNode;
    resources?: {
      title: string;
      url: string;
    }[];
    checklist?: string[];
  }[];
}

export const GuideOverlay: React.FC<GuideOverlayProps> = ({
  isOpen,
  onClose,
  title,
  description,
  sections
}) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: theme === 'gradient' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
        text: theme === 'gradient' ? 'text-blue-300' : 'text-blue-800 dark:text-blue-300',
        textSecondary: theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200',
        textTertiary: theme === 'gradient' ? 'text-blue-100' : 'text-blue-600 dark:text-blue-100'
      },
      green: {
        bg: theme === 'gradient' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700',
        text: theme === 'gradient' ? 'text-green-300' : 'text-green-800 dark:text-green-300',
        textSecondary: theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200',
        textTertiary: theme === 'gradient' ? 'text-green-100' : 'text-green-600 dark:text-green-100'
      },
      yellow: {
        bg: theme === 'gradient' ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
        text: theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-800 dark:text-yellow-300',
        textSecondary: theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-700 dark:text-yellow-200',
        textTertiary: theme === 'gradient' ? 'text-yellow-100' : 'text-yellow-600 dark:text-yellow-100'
      },
      purple: {
        bg: theme === 'gradient' ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
        text: theme === 'gradient' ? 'text-purple-300' : 'text-purple-800 dark:text-purple-300',
        textSecondary: theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200',
        textTertiary: theme === 'gradient' ? 'text-purple-100' : 'text-purple-600 dark:text-purple-100'
      },
      orange: {
        bg: theme === 'gradient' ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
        text: theme === 'gradient' ? 'text-orange-300' : 'text-orange-800 dark:text-orange-300',
        textSecondary: theme === 'gradient' ? 'text-orange-200' : 'text-orange-700 dark:text-orange-200',
        textTertiary: theme === 'gradient' ? 'text-orange-100' : 'text-orange-600 dark:text-orange-100'
      },
      red: {
        bg: theme === 'gradient' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700',
        text: theme === 'gradient' ? 'text-red-300' : 'text-red-800 dark:text-red-300',
        textSecondary: theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200',
        textTertiary: theme === 'gradient' ? 'text-red-100' : 'text-red-600 dark:text-red-100'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not its children
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`${
        theme === 'gradient' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
      } border rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="sticky top-0 bg-inherit border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {title}
            </h2>
            {description && (
              <p className={`mt-2 ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
              theme === 'gradient' ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {sections.map((section, index) => {
            const colorClasses = getColorClasses(section.color);
            return (
              <div key={index} className={`${colorClasses.bg} border rounded-lg p-6 space-y-6`}>
                <h3 className={`text-xl font-bold ${colorClasses.text}`}>
                  {section.title}
                </h3>
                
                <div className={`prose max-w-none ${colorClasses.textSecondary}`}>
                  {section.content}
                </div>

                {/* Resources Section */}
                {section.resources && section.resources.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`font-semibold ${colorClasses.textSecondary}`}>
                      Additional Resources:
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {section.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                            theme === 'gradient'
                              ? 'border-gray-700 hover:bg-gray-800'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                          } transition-colors`}
                        >
                          {resource.title}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist Section */}
                {section.checklist && section.checklist.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`font-semibold ${colorClasses.textSecondary}`}>
                      Action Items:
                    </h4>
                    <div className="space-y-2">
                      {section.checklist.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${colorClasses.textTertiary}`}
                        >
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 