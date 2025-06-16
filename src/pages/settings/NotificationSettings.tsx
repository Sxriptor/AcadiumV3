import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, MessageSquare, BarChart2, Users } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeProvider';

const NotificationSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  const notifications = [
    {
      title: 'Course Announcements',
      description: 'Get notified about new lessons and course updates',
      icon: <Bell className="h-5 w-5" />
    },
    {
      title: 'AI Assistant Messages',
      description: 'Receive messages from your AI learning assistant',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      title: 'Weekly Performance Summary',
      description: 'Get insights about your learning progress',
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      title: 'Community Replies & Mentions',
      description: 'Stay updated with community interactions',
      icon: <Users className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Notification Settings</h2>
        <p className={`text-sm mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          Choose what notifications you want to receive.
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-start">
              <div className={`p-2 rounded-lg mr-4 ${
                theme === 'gradient' 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {notification.icon}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${
                      theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {notification.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;