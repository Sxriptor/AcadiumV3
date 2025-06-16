import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Shield, Smartphone, LogOut, Github as GitHub, Disc as Discord, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeProvider';

const SecuritySettings: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { theme } = useTheme();

  const activeSessions = [
    {
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      device: 'iPhone 15',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      current: false
    }
  ];

  const linkedAccounts = [
    {
      platform: 'GitHub',
      username: '@johndoe',
      icon: <GitHub className="h-5 w-5" />
    },
    {
      platform: 'Discord',
      username: 'johndoe#1234',
      icon: <Discord className="h-5 w-5" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Security Settings</h2>
        <p className={`text-sm mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          Manage your account security and connected services.
        </p>
      </div>

      {/* Password Change */}
      <Card>
        <h3 className={`text-lg font-medium mb-4 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              Current Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'gradient'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              New Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'gradient'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
            }`}>
              Confirm New Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                theme === 'gradient'
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            />
          </div>
          <Button>Update Password</Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h3 className={`text-lg font-medium ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Two-Factor Authentication
            </h3>
            <p className={`text-sm mt-1 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Enable 2FA
          </Button>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <h3 className={`text-lg font-medium mb-4 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Active Sessions
        </h3>
        <div className="space-y-4">
          {activeSessions.map((session, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {session.device}
                    {session.current && (
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                        (Current)
                      </span>
                    )}
                  </p>
                  <p className={`text-xs ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <h3 className={`text-lg font-medium mb-4 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Linked Accounts
        </h3>
        <div className="space-y-4">
          {linkedAccounts.map((account, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <div className="flex items-center">
                {account.icon}
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {account.platform}
                  </p>
                  <p className={`text-xs ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {account.username}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Disconnect
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <p className={`text-sm mb-4 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button 
          variant="outline" 
          className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[400px] p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
              <h3 className={`text-lg font-medium ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                Delete Account
              </h3>
            </div>
            <p className={`text-sm mb-4 ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SecuritySettings;