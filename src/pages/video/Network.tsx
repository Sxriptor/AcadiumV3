import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { StepTreeNavigator } from '../../components/shared/StepTreeNavigator';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Network, 
  Share2, 
  MessageSquare, 
  Users,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  Settings,
  Monitor,
  Target,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useUserProgress } from '../../hooks/useUserProgress';

const VideoNetwork: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('social');
  const [openTabs, setOpenTabs] = useState<Array<{id: string, title: string, content: React.ReactNode}>>([]);
  const [activeTab, setActiveTab] = useState('');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [checklistCollapsed, setChecklistCollapsed] = useState(false);
  
  // Use the custom hook for user progress
  const { 
    completedSteps, 
    loading: progressLoading, 
    markStepComplete, 
    markStepIncomplete, 
    isStepCompleted 
  } = useUserProgress(activeApp);

  const miniApps = [
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'collaboration', name: 'Collaboration', icon: '🤝' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'feedback', name: 'Feedback', icon: '📝' },
    { id: 'mentorship', name: 'Mentorship', icon: '🧠' },
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'challenges', name: 'Challenges', icon: '🏆' }
  ];

  const checklistItems = [
    {
      id: 'join-community',
      title: 'Join creator community',
      description: 'Connect with other video creators',
      completed: false
    },
    {
      id: 'setup-discord',
      title: 'Set up Discord integration',
      description: 'Join relevant Discord servers',
      completed: false
    },
    {
      id: 'find-collaborators',
      title: 'Find collaborators',
      description: 'Connect with potential collaboration partners',
      completed: false
    },
    {
      id: 'join-challenge',
      title: 'Join a creator challenge',
      description: 'Participate in community challenges',
      completed: false
    },
    {
      id: 'get-feedback',
      title: 'Get feedback on content',
      description: 'Share your work for constructive feedback',
      completed: false
    },
    {
      id: 'attend-event',
      title: 'Attend a networking event',
      description: 'Join virtual or in-person creator events',
      completed: false
    }
  ];

  const networkSteps = [
    {
      id: 'community',
      title: 'Community Engagement',
      description: 'Connect with the creator community',
      actions: [
        { type: 'tab' as const, tabId: 'community-guide', label: 'Community Guide' }
      ],
      children: [
        {
          id: 'discord-community',
          title: 'Discord Community',
          description: 'Join creator Discord servers',
          actions: [
            { type: 'external' as const, url: 'https://discord.com/', label: 'Open Discord' },
            { type: 'tab' as const, tabId: 'discord-guide', label: 'Guide' }
          ]
        },
        {
          id: 'forums-community',
          title: 'Creator Forums',
          description: 'Participate in creator forums',
          actions: [
            { type: 'tab' as const, tabId: 'forums-guide', label: 'Guide' }
          ]
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Creator Collaboration',
      description: 'Find and work with other creators',
      actions: [
        { type: 'tab' as const, tabId: 'collaboration-guide', label: 'Collaboration Guide' }
      ],
      children: [
        {
          id: 'find-collaborators',
          title: 'Find Collaborators',
          description: 'Discover potential collaboration partners',
          actions: [
            { type: 'tab' as const, tabId: 'collaborator-finder', label: 'Finder Tool' }
          ]
        },
        {
          id: 'collaboration-tools',
          title: 'Collaboration Tools',
          description: 'Tools for remote collaboration',
          actions: [
            { type: 'tab' as const, tabId: 'collab-tools', label: 'Tools' }
          ]
        }
      ]
    },
    {
      id: 'challenges',
      title: 'Creator Challenges',
      description: 'Participate in community challenges',
      actions: [
        { type: 'tab' as const, tabId: 'challenges-guide', label: 'Challenges Guide' }
      ],
      children: [
        {
          id: 'current-challenges',
          title: 'Current Challenges',
          description: 'View active creator challenges',
          actions: [
            { type: 'tab' as const, tabId: 'challenge-browser', label: 'Browse Challenges' }
          ]
        },
        {
          id: 'challenge-submission',
          title: 'Challenge Submission',
          description: 'Submit your entries to challenges',
          actions: [
            { type: 'tab' as const, tabId: 'submission-tool', label: 'Submission Tool' }
          ]
        }
      ]
    }
  ];

  const handleTabOpen = (tabId: string, step: any) => {
    // Check if tab is already open
    if (openTabs.find(tab => tab.id === tabId)) {
      setActiveTab(tabId);
      return;
    }

    // Create tab content based on tabId
    let content: React.ReactNode;
    
    switch (tabId) {
      case 'community-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Creator Community Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Finding Your Community
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Discover communities that align with your content niche.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Effective Engagement
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Learn how to meaningfully engage with other creators.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'discord-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Discord Community Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Discord community guide would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'collaboration-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Creator Collaboration Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Finding the Right Partners
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Identify creators who complement your style and audience.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'collaborator-finder':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Collaborator Finder Tool
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Users className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Collaborator finder tool would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'challenges-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Creator Challenges Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Target className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Creator challenges guide would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      default:
        content = (
          <div className="text-center py-8">
            <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
              Content for {step.title}
            </p>
          </div>
        );
    }

    const newTab = {
      id: tabId,
      title: step.title,
      content,
      closeable: true
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : '');
    }
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Creator Network
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Connect with other creators, collaborate, and grow together
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Users className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      </div>

      {/* Mini App Switcher */}
      <MiniAppSwitcher 
        apps={miniApps}
        activeApp={activeApp}
        onAppChange={setActiveApp}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Checklist */}
        <div className="lg:col-span-1">
          <EnhancedChecklist
            title="Networking Checklist"
            items={checklistItems}
            toolId={activeApp}
          />
        </div>

        {/* Right Column - Content Tree */}
        <div className="lg:col-span-2">
          <StepTreeNavigator
            steps={networkSteps}
            onTabOpen={handleTabOpen}
          />

          {/* Main Content Tabs */}
          <MainContentTabs
            tabs={openTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={handleTabClose}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoNetwork;