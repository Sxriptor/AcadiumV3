import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  CreditCard, 
  HelpCircle 
} from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';
import ProfileSettings from './settings/ProfileSettings';
import NotificationSettings from './settings/NotificationSettings';
import SecuritySettings from './settings/SecuritySettings';
import AppearanceSettings from './settings/AppearanceSettings';
import BillingSettings from './settings/BillingSettings';
import HelpSupport from './settings/HelpSupport';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme } = useTheme();

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      component: <ProfileSettings />
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      component: <NotificationSettings />
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-5 w-5" />,
      component: <SecuritySettings />
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="h-5 w-5" />,
      component: <AppearanceSettings />
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard className="h-5 w-5" />,
      component: <BillingSettings />
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle className="h-5 w-5" />,
      component: <HelpSupport />
    }
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col pt-6">
      {/* Tabs */}
      <div className="px-6">
        <Card className="p-2 overflow-hidden">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-w-fit ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : theme === 'gradient'
                      ? 'text-white hover:bg-gray-700/50'
                      : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                } mr-2 last:mr-0`}
                onClick={() => setActiveTab(tab.id)}
              >
                {React.cloneElement(tab.icon, {
                  className: `${tab.icon.props.className} mr-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : theme === 'gradient'
                        ? 'text-gray-300'
                        : 'text-gray-400 dark:text-gray-500'
                  }`
                })}
                {tab.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 mt-6 overflow-hidden">
        <div className="h-[calc(100%-15px)] overflow-y-auto [scrollbar-gutter:stable] pr-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default Settings;