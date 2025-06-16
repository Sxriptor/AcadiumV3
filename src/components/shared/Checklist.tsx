import React, { useState, useEffect } from 'react';
import { Check, Square, Loader2 } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';
import { useUserChecklist } from '../../hooks/useUserChecklist';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface ChecklistProps {
  title: string;
  items: ChecklistItem[];
  storageKey: string;
  onItemToggle?: (itemId: string, completed: boolean) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({
  title,
  items: initialItems,
  storageKey,
  onItemToggle
}) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const toolId = storageKey.split('-').pop() || 'default';
  
  // Use the custom hook for user checklist
  const { 
    completedItems, 
    loading, 
    updateChecklistItem, 
    isItemCompleted 
  } = useUserChecklist(toolId);

  // Update local items when completedItems changes
  useEffect(() => {
    if (!loading) {
      const updatedItems = initialItems.map(item => ({
        ...item,
        completed: isItemCompleted(item.id)
      }));
      setItems(updatedItems);
    }
  }, [initialItems, completedItems, isItemCompleted, loading]);

  const toggleItem = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const newCompleted = !item.completed;
    
    // Update in database
    const success = await updateChecklistItem(itemId, newCompleted);
    
    if (success) {
      // Update local state
      setItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return { ...item, completed: newCompleted };
        }
        return item;
      }));
      
      // Call optional callback
      onItemToggle?.(itemId, newCompleted);
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const progressPercentage = (completedCount / items.length) * 100;

  if (loading) {
    return (
      <div className={`rounded-xl border p-6 ${
        theme === 'gradient'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex justify-center items-center py-8">
          <Loader2 className={`h-8 w-8 animate-spin ${
            theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
          }`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-6 ${
      theme === 'gradient'
        ? 'bg-gray-800/50 border-gray-700'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="mb-4">
        <h3 className={`text-lg font-semibold mb-2 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          {title}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
            {completedCount} of {items.length} completed
          </span>
          <span className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className={`w-full h-2 rounded-full mt-2 ${
          theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              theme === 'gradient'
                ? 'hover:bg-gray-700/50'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <button className="flex-shrink-0 mt-0.5">
              {item.completed ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Square className={`h-5 w-5 ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-400 dark:text-gray-500'
                }`} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium ${
                item.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : theme === 'gradient'
                    ? 'text-white'
                    : 'text-gray-900 dark:text-white'
              }`}>
                {item.title}
              </h4>
              {item.description && (
                <p className={`text-sm mt-1 ${
                  item.completed 
                    ? 'line-through text-gray-400' 
                    : theme === 'gradient'
                      ? 'text-gray-300'
                      : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};