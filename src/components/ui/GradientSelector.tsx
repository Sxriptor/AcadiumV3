import React, { useState } from 'react';
import { Card } from './Card';
import { useTheme } from './ThemeProvider';
import { Palette, Check } from 'lucide-react';

interface GradientSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onGradientSelected?: () => void;
}

export const GradientSelector: React.FC<GradientSelectorProps> = ({ isOpen, onClose, onGradientSelected }) => {
  const { gradientType, setGradientType } = useTheme();
  const [selectedGradient, setSelectedGradient] = useState(gradientType);

  const gradients = [
    {
      id: 'blueRed' as const,
      name: 'Blue Red',
      description: 'Classic blue to red',
      preview: 'bg-gradient-to-br from-blue-600 to-red-600'
    },
    {
      id: 'purpleBlue' as const,
      name: 'Purple Blue',
      description: 'Deep purple to bright blue',
      preview: 'bg-gradient-to-br from-purple-600 to-blue-500'
    },
    {
      id: 'greenTeal' as const,
      name: 'Green Teal',
      description: 'Fresh green to teal',
      preview: 'bg-gradient-to-br from-green-500 to-teal-500'
    },
    {
      id: 'orangePink' as const,
      name: 'Orange Pink',
      description: 'Warm orange to pink',
      preview: 'bg-gradient-to-br from-orange-500 to-pink-500'
    },
    {
      id: 'darkTeal' as const,
      name: 'Dark Teal',
      description: 'Dark slate to cyan',
      preview: 'bg-gradient-to-br from-slate-800 to-cyan-500'
    }
  ];

  const handleGradientChange = (newGradient: typeof gradients[0]['id']) => {
    setSelectedGradient(newGradient);
    setGradientType(newGradient);
    if (onGradientSelected) {
      onGradientSelected();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[400px] p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Palette className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Gradient</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose your preferred gradient combination
          </p>
        </div>
        
        <div className="p-4 space-y-3">
          {gradients.map((gradient) => (
            <button
              key={gradient.id}
              className={`
                w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3
                ${selectedGradient === gradient.id 
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-transparent'}
                border-2
              `}
              onClick={() => handleGradientChange(gradient.id)}
            >
              <div className={`w-12 h-12 rounded-lg ${gradient.preview} relative`}>
                {selectedGradient === gradient.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900 dark:text-white">
                  {gradient.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {gradient.description}
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </Card>
    </div>
  );
}; 