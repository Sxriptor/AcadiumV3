import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeProvider';

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [uiDensity, setUiDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [savedSettings, setSavedSettings] = useState(false);

  // Load saved UI density setting from localStorage on component mount
  useEffect(() => {
    const savedDensity = localStorage.getItem('ui-density');
    if (savedDensity === 'compact' || savedDensity === 'comfortable') {
      setUiDensity(savedDensity);
      applyUiDensity(savedDensity);
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    
    // Save UI density setting to localStorage
    localStorage.setItem('ui-density', uiDensity);
    
    // Apply the UI density setting
    applyUiDensity(uiDensity);
    
    // Show success message briefly
    setSavedSettings(true);
    setTimeout(() => {
      setSavedSettings(false);
      setLoading(false);
    }, 1500);
  };

  const applyUiDensity = (density: 'comfortable' | 'compact') => {
    const html = document.documentElement;
    
    if (density === 'compact') {
      // Apply compact UI (similar to 75% zoom)
      html.style.fontSize = '75%';
      html.classList.add('ui-compact');
      html.classList.remove('ui-comfortable');
    } else {
      // Reset to comfortable UI (normal 100% zoom)
      html.style.fontSize = '100%';
      html.classList.add('ui-comfortable');
      html.classList.remove('ui-compact');
    }
  };

  const handleDensityChange = (density: 'comfortable' | 'compact') => {
    setUiDensity(density);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Appearance Settings</h2>
        <p className={`text-sm mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          Customize how the dashboard looks and feels.
        </p>
      </div>

      {/* Theme Selection */}
      <Card>
        <h3 className={`text-lg font-medium mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
            }`}
            onClick={() => setTheme('light')}
          >
            <div className="flex flex-col items-center">
              <Sun className={`h-6 w-6 mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>Light</span>
            </div>
          </button>

          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
            }`}
            onClick={() => setTheme('dark')}
          >
            <div className="flex flex-col items-center">
              <Moon className={`h-6 w-6 mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>Dark</span>
            </div>
          </button>

          <button
            className={`p-4 rounded-lg border-2 transition-all ${
              theme === 'gradient'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
            }`}
            onClick={() => setTheme('gradient')}
          >
            <div className="flex flex-col items-center">
              <Monitor className={`h-6 w-6 mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`} />
              <span className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>Gradient</span>
            </div>
          </button>
        </div>
      </Card>

      {/* UI Density */}
      <Card>
        <h3 className={`text-lg font-medium mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          UI Density
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`p-4 rounded-lg border-2 transition-all ${
                uiDensity === 'comfortable'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
              }`}
              onClick={() => handleDensityChange('comfortable')}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                  <div className="w-12 h-6 bg-white dark:bg-gray-600 rounded"></div>
                </div>
                <span className={`text-sm font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>Comfortable</span>
                <span className={`text-xs ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>Default size</span>
              </div>
            </button>

            <button
              className={`p-4 rounded-lg border-2 transition-all ${
                uiDensity === 'compact'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
              }`}
              onClick={() => handleDensityChange('compact')}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center">
                  <div className="w-14 h-8 bg-white dark:bg-gray-600 rounded"></div>
                </div>
                <span className={`text-sm font-medium ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>Compact</span>
                <span className={`text-xs ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                }`}>More content visible</span>
              </div>
            </button>
          </div>
          
          <div className={`p-4 rounded-lg ${
            theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <p className={`text-sm ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
            }`}>
              <strong>Compact mode</strong> reduces the size of UI elements, allowing more content to fit on screen (similar to zooming out to 75%).
            </p>
          </div>
        </div>
      </Card>

      {/* Font Size - Disabled since UI Density handles this now */}
      <Card className="opacity-50 pointer-events-none">
        <h3 className={`text-lg font-medium mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Font Size
        </h3>
        <div className="space-y-4">
          {['Small', 'Normal', 'Large'].map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="radio"
                name="fontSize"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                defaultChecked={size === 'Normal'}
                disabled
              />
              <span className={`ml-2 text-sm ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>{size}</span>
            </label>
          ))}
        </div>
        <p className={`text-xs mt-2 ${
          theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          Font size is controlled by UI Density setting
        </p>
      </Card>

      <div className="flex justify-end">
        {savedSettings && (
          <div className={`mr-4 px-4 py-2 rounded-md ${
            theme === 'gradient' 
              ? 'bg-green-900/30 text-green-400' 
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}>
            Settings saved successfully!
          </div>
        )}
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Appearance Settings'}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;