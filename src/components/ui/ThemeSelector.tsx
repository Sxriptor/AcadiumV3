import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Palette } from 'lucide-react';
import { GradientSelector } from './GradientSelector';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [showGradientSelector, setShowGradientSelector] = useState(false);

  const themes = [
    {
      id: 'light',
      name: 'Light Theme',
      description: 'Clean and bright interface',
      icon: <Sun className="h-5 w-5" />,
      preview: (
        <div className="w-full h-16 rounded-md bg-white border border-gray-200">
          <div className="h-3 w-24 bg-gray-100 rounded m-2"></div>
          <div className="h-2 w-16 bg-blue-500 rounded m-2"></div>
        </div>
      )
    },
    {
      id: 'dark',
      name: 'Dark Theme',
      description: 'Easy on the eyes in low light',
      icon: <Moon className="h-5 w-5" />,
      preview: (
        <div className="w-full h-16 rounded-md bg-gray-900 border border-gray-700">
          <div className="h-3 w-24 bg-gray-800 rounded m-2"></div>
          <div className="h-2 w-16 bg-blue-500 rounded m-2"></div>
        </div>
      )
    },
    {
      id: 'gradient',
      name: 'Gradient Mode',
      description: 'Dynamic gradient backgrounds',
      icon: <Palette className="h-5 w-5" />,
      preview: (
        <div className="w-full h-16 rounded-md bg-gradient-to-br from-blue-600 to-red-600 border border-gray-300">
          <div className="h-3 w-24 bg-white/20 rounded m-2"></div>
          <div className="h-2 w-16 bg-white/40 rounded m-2"></div>
        </div>
      )
    }
  ];

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'gradient') => {
    setSelectedTheme(newTheme);
    
    if (newTheme === 'gradient') {
      // Show gradient selector instead of immediately applying
      setShowGradientSelector(true);
    } else {
      setTheme(newTheme);
      onClose();
    }
  };

  const handleGradientSelected = () => {
    // Gradient was selected in the gradient selector
    setTheme('gradient');
    setShowGradientSelector(false);
    onClose();
  };

  const handleCloseGradientSelector = () => {
    setShowGradientSelector(false);
    // Reset selected theme if they cancel gradient selection
    setSelectedTheme(theme);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className={`w-[400px] rounded-xl shadow-lg border overflow-hidden ${
          theme === 'gradient' || theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`p-4 border-b ${
            theme === 'gradient' || theme === 'dark'
              ? 'border-gray-700'
              : 'border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold ${
              theme === 'gradient' || theme === 'dark'
                ? 'text-white'
                : 'text-gray-900'
            }`}>Select Theme</h3>
            <p className={`text-sm mt-1 ${
              theme === 'gradient' || theme === 'dark'
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}>
              Choose your preferred appearance
            </p>
          </div>
          
          <div className="p-4 space-y-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                className={`
                  w-full p-3 rounded-lg transition-all duration-200 text-left
                  ${selectedTheme === themeOption.id 
                    ? theme === 'gradient' || theme === 'dark'
                      ? 'bg-blue-900/30 border-blue-500'
                      : 'bg-blue-50 border-blue-500'
                    : theme === 'gradient' || theme === 'dark'
                      ? 'hover:bg-gray-700 border-transparent'
                      : 'hover:bg-gray-50 border-transparent'}
                  border-2
                `}
                onClick={() => handleThemeChange(themeOption.id as 'light' | 'dark' | 'gradient')}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`
                    p-2 rounded-md
                    ${selectedTheme === themeOption.id 
                      ? 'bg-blue-500 text-white' 
                      : theme === 'gradient' || theme === 'dark'
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-100 text-gray-600'}
                  `}>
                    {themeOption.icon}
                  </div>
                  <div>
                    <span className={`font-medium ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>{themeOption.name}</span>
                    <div className={`text-xs ${
                      theme === 'gradient' || theme === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                      {themeOption.description}
                    </div>
                  </div>
                </div>
                {themeOption.preview}
              </button>
            ))}
          </div>
          
          <div className={`p-4 border-t ${
            theme === 'gradient' || theme === 'dark'
              ? 'border-gray-700 bg-gray-800/50'
              : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={onClose}
              className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                theme === 'gradient' || theme === 'dark'
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <GradientSelector 
        isOpen={showGradientSelector}
        onClose={handleCloseGradientSelector}
        onGradientSelected={handleGradientSelected}
      />
    </>
  );
};