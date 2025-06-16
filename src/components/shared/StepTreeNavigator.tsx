import React, { useState } from 'react';
import { ChevronRight, ChevronDown, ExternalLink, Play } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

interface StepAction {
  type: 'link' | 'tab' | 'external';
  url?: string;
  tabId?: string;
  label: string;
}

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  actions?: StepAction[];
  children?: Step[];
}

interface StepTreeNavigatorProps {
  steps: Step[];
  onStepClick?: (step: Step, action?: StepAction) => void;
  onTabOpen?: (tabId: string, step: Step) => void;
}

export const StepTreeNavigator: React.FC<StepTreeNavigatorProps> = ({
  steps,
  onStepClick,
  onTabOpen
}) => {
  const { theme } = useTheme();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleExpanded = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const handleActionClick = (step: Step, action: StepAction) => {
    if (action.type === 'external' && action.url) {
      window.open(action.url, '_blank');
    } else if (action.type === 'tab' && action.tabId) {
      onTabOpen?.(action.tabId, step);
    }
    onStepClick?.(step, action);
  };

  const renderStep = (step: Step, level: number = 0) => {
    const hasChildren = step.children && step.children.length > 0;
    const isExpanded = expandedSteps.has(step.id);

    return (
      <div key={step.id} className="w-full">
        <div
          className={`
            flex items-center justify-between p-3 rounded-lg transition-all duration-200
            ${theme === 'gradient'
              ? 'hover:bg-gray-700/50'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }
          `}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(step.id)}
                className={`p-1 rounded ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.completed 
                  ? 'line-through text-gray-500' 
                  : theme === 'gradient'
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white'
              }`}>
                {step.title}
              </h4>
              {step.description && (
                <p className={`text-sm mt-1 ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>

          {step.actions && step.actions.length > 0 && (
            <div className="flex items-center space-x-2">
              {step.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(step, action)}
                  className={`
                    flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium
                    transition-all duration-200
                    ${action.type === 'external'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : action.type === 'tab'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : theme === 'gradient'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                    }
                  `}
                >
                  {action.type === 'external' && <ExternalLink className="h-3 w-3" />}
                  {action.type === 'tab' && <Play className="h-3 w-3" />}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {step.children!.map(childStep => renderStep(childStep, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-xl border p-6 ${
      theme === 'gradient'
        ? 'bg-gray-800/50 border-gray-700'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="space-y-2">
        {steps.map(step => renderStep(step))}
      </div>
    </div>
  );
};