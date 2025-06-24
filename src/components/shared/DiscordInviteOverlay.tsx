import React from 'react';
import { MessageSquare, X, Users, ArrowRight } from 'lucide-react';
import { useTheme } from '../ui/ThemeProvider';

interface DiscordInviteOverlayProps {
  isOpen: boolean;
  onJoin: () => void;
  onSkip: () => void;
}

export const DiscordInviteOverlay: React.FC<DiscordInviteOverlayProps> = ({ 
  isOpen, 
  onJoin, 
  onSkip 
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Modal */}
      <div className={`relative max-w-md w-full mx-4 rounded-xl shadow-2xl border ${
        theme === 'gradient' || theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        {/* Header with Discord branding */}
        <div className="relative p-6 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${
              theme === 'gradient' || theme === 'dark'
                ? 'text-white'
                : 'text-gray-900'
            }`}>
              Join Our Discord Community! 🚀
            </h2>
            <p className={`text-sm leading-relaxed ${
              theme === 'gradient' || theme === 'dark'
                ? 'text-gray-300'
                : 'text-gray-600'
            }`}>
              Joining our Discord helps you stay up to date with new features, 
              get support from our team, and connect with other learners on their journey.
            </p>
          </div>

          {/* Community benefits */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center text-left">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className={`text-sm ${
                theme === 'gradient' || theme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
                Connect with fellow learners and mentors
              </span>
            </div>
            
            <div className="flex items-center text-left">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className={`text-sm ${
                theme === 'gradient' || theme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
                Get real-time updates and announcements
              </span>
            </div>
            
            <div className="flex items-center text-left">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className={`text-sm ${
                theme === 'gradient' || theme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
                Access exclusive content and early features
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={`px-6 pb-6 border-t ${
          theme === 'gradient' || theme === 'dark'
            ? 'border-gray-700'
            : 'border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onJoin}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Join Discord
            </button>
            
            <button
              onClick={onSkip}
              className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                theme === 'gradient' || theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Not Now
            </button>
          </div>
          
          <p className={`text-xs text-center mt-3 ${
            theme === 'gradient' || theme === 'dark'
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}>
            You can always join later from the header menu
          </p>
        </div>
      </div>
    </div>
  );
}; 