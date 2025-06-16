import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Checklist } from '../../components/shared/Checklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { StepTreeNavigator } from '../../components/shared/StepTreeNavigator';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { Globe, Users, MessageSquare, Share2, Star } from 'lucide-react';

const WebDevNetwork: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('community');
  const [openTabs, setOpenTabs] = useState<Array<{id: string, title: string, content: React.ReactNode}>>([]);
  const [activeTab, setActiveTab] = useState('');

  const miniApps = [
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'stackoverflow', name: 'Stack Overflow', icon: '📚' },
    { id: 'hackathons', name: 'Hackathons', icon: '🏆' },
    { id: 'meetups', name: 'Meetups', icon: '🤝' },
    { id: 'conferences', name: 'Conferences', icon: '🎤' }
  ];

  const checklistItems = [
    {
      id: 'join-community',
      title: 'Join developer community',
      description: 'Connect with other web developers',
      completed: false
    },
    {
      id: 'setup-github',
      title: 'Set up GitHub profile',
      description: 'Create or optimize your GitHub presence',
      completed: false
    },
    {
      id: 'join-discord',
      title: 'Join Discord servers',
      description: 'Connect to relevant developer Discord communities',
      completed: false
    },
    {
      id: 'contribute-opensource',
      title: 'Contribute to open source',
      description: 'Make contributions to open source projects',
      completed: false
    },
    {
      id: 'attend-meetup',
      title: 'Attend a meetup',
      description: 'Join local or virtual developer meetups',
      completed: false
    },
    {
      id: 'participate-hackathon',
      title: 'Participate in a hackathon',
      description: 'Join a hackathon to build projects and network',
      completed: false
    }
  ];

  const networkSteps = [
    {
      id: 'community',
      title: 'Developer Community',
      description: 'Connect with the developer community',
      actions: [
        { type: 'tab' as const, tabId: 'community-guide', label: 'Community Guide' }
      ],
      children: [
        {
          id: 'discord-community',
          title: 'Discord Communities',
          description: 'Join developer Discord servers',
          actions: [
            { type: 'external' as const, url: 'https://discord.com/', label: 'Open Discord' },
            { type: 'tab' as const, tabId: 'discord-guide', label: 'Guide' }
          ]
        },
        {
          id: 'github-community',
          title: 'GitHub Community',
          description: 'Engage with the GitHub community',
          actions: [
            { type: 'tab' as const, tabId: 'github-guide', label: 'Guide' }
          ]
        }
      ]
    },
    {
      id: 'events',
      title: 'Developer Events',
      description: 'Participate in developer events',
      actions: [
        { type: 'tab' as const, tabId: 'events-guide', label: 'Events Guide' }
      ],
      children: [
        {
          id: 'hackathons',
          title: 'Hackathons',
          description: 'Find and join hackathons',
          actions: [
            { type: 'tab' as const, tabId: 'hackathon-finder', label: 'Finder Tool' }
          ]
        },
        {
          id: 'meetups',
          title: 'Meetups & Conferences',
          description: 'Discover developer meetups and conferences',
          actions: [
            { type: 'tab' as const, tabId: 'meetup-finder', label: 'Finder Tool' }
          ]
        }
      ]
    },
    {
      id: 'opensource',
      title: 'Open Source Contribution',
      description: 'Contribute to open source projects',
      actions: [
        { type: 'tab' as const, tabId: 'opensource-guide', label: 'Contribution Guide' }
      ],
      children: [
        {
          id: 'find-projects',
          title: 'Find Projects',
          description: 'Discover projects to contribute to',
          actions: [
            { type: 'tab' as const, tabId: 'project-finder', label: 'Finder Tool' }
          ]
        },
        {
          id: 'contribution-workflow',
          title: 'Contribution Workflow',
          description: 'Learn the process of contributing',
          actions: [
            { type: 'tab' as const, tabId: 'workflow-guide', label: 'Guide' }
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
              Developer Community Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Finding Your Community
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Discover communities that align with your tech stack and interests.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Effective Participation
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Learn how to meaningfully engage with developer communities.
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
              Discord Communities Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Discord communities guide would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'events-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Developer Events Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Finding Events
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Discover relevant developer events and meetups.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'hackathon-finder':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Hackathon Finder
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Star className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Hackathon finder tool would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'opensource-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Open Source Contribution Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Share2 className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Open source contribution guide would be embedded here
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

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Developer Network
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Connect with other developers, contribute to open source, and attend events
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
          <Checklist
            title="Networking Checklist"
            items={checklistItems}
            storageKey="webdev-networking-checklist"
          />
        </div>

        {/* Right Column - Steps and Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Navigator */}
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

export default WebDevNetwork;