import React, { useState } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Checklist } from '../../components/shared/Checklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { StepTreeNavigator } from '../../components/shared/StepTreeNavigator';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { Globe, Users, MessageSquare, Share2 } from 'lucide-react';

const N8nNetwork: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('community');
  const [openTabs, setOpenTabs] = useState<Array<{id: string, title: string, content: React.ReactNode}>>([]);
  const [activeTab, setActiveTab] = useState('');

  const miniApps = [
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'forum', name: 'Forum', icon: '📝' },
    { id: 'marketplace', name: 'Marketplace', icon: '🛒' },
    { id: 'templates', name: 'Templates', icon: '📋' },
    { id: 'partners', name: 'Partners', icon: '🤝' },
    { id: 'events', name: 'Events', icon: '📅' }
  ];

  const checklistItems = [
    {
      id: 'join-community',
      title: 'Join n8n community',
      description: 'Connect with other n8n users and experts',
      completed: false
    },
    {
      id: 'join-discord',
      title: 'Join Discord server',
      description: 'Participate in real-time discussions',
      completed: false
    },
    {
      id: 'explore-templates',
      title: 'Explore workflow templates',
      description: 'Find and use pre-built workflow templates',
      completed: false
    },
    {
      id: 'share-workflows',
      title: 'Share your workflows',
      description: 'Contribute your workflows to the community',
      completed: false
    },
    {
      id: 'attend-event',
      title: 'Attend a community event',
      description: 'Join webinars, workshops, or meetups',
      completed: false
    },
    {
      id: 'connect-partners',
      title: 'Connect with partners',
      description: 'Explore partnership opportunities',
      completed: false
    }
  ];

  const networkSteps = [
    {
      id: 'community',
      title: 'Community Engagement',
      description: 'Connect with the n8n community',
      actions: [
        { type: 'external' as const, url: 'https://community.n8n.io/', label: 'Open Community' },
        { type: 'tab' as const, tabId: 'community-guide', label: 'Guide' }
      ],
      children: [
        {
          id: 'discord-community',
          title: 'Discord Community',
          description: 'Join the n8n Discord server',
          actions: [
            { type: 'external' as const, url: 'https://discord.gg/n8n', label: 'Join Discord' },
            { type: 'tab' as const, tabId: 'discord-guide', label: 'Guide' }
          ]
        },
        {
          id: 'forum-community',
          title: 'Forum Participation',
          description: 'Engage with the n8n forum',
          actions: [
            { type: 'tab' as const, tabId: 'forum-guide', label: 'Guide' }
          ]
        }
      ]
    },
    {
      id: 'resources',
      title: 'Community Resources',
      description: 'Access shared resources and templates',
      actions: [
        { type: 'tab' as const, tabId: 'resources-guide', label: 'Resources Guide' }
      ],
      children: [
        {
          id: 'workflow-templates',
          title: 'Workflow Templates',
          description: 'Find and use community templates',
          actions: [
            { type: 'tab' as const, tabId: 'templates-browser', label: 'Browse Templates' }
          ]
        },
        {
          id: 'node-marketplace',
          title: 'Node Marketplace',
          description: 'Discover community-built nodes',
          actions: [
            { type: 'tab' as const, tabId: 'marketplace-browser', label: 'Browse Marketplace' }
          ]
        }
      ]
    },
    {
      id: 'events',
      title: 'Community Events',
      description: 'Participate in n8n events and webinars',
      actions: [
        { type: 'tab' as const, tabId: 'events-calendar', label: 'View Calendar' }
      ],
      children: [
        {
          id: 'webinars',
          title: 'Webinars',
          description: 'Join educational webinars',
          actions: [
            { type: 'tab' as const, tabId: 'webinars-list', label: 'View Webinars' }
          ]
        },
        {
          id: 'meetups',
          title: 'Meetups',
          description: 'Find local and virtual meetups',
          actions: [
            { type: 'tab' as const, tabId: 'meetups-list', label: 'View Meetups' }
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
              Community Engagement Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Getting Started
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Learn how to engage with the n8n community effectively.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Community Guidelines
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Review the community guidelines and best practices.
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
      case 'resources-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Community Resources Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Finding Resources
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Learn how to find and use community resources.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'events-calendar':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Community Events Calendar
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Globe className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Events calendar would be embedded here
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
            Community & Network
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Connect with the n8n community and access shared resources
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
            title="Community Checklist"
            items={checklistItems}
            storageKey="n8n-community-checklist"
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

export default N8nNetwork;