import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ui/ThemeProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { 
  Bot, 
  Plug, 
  Rocket, 
  Settings, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Newspaper,
  TrendingUp,
  Eye,
  Bell,
  Plus,
  Twitter,
  Youtube,
  Rss,
  ExternalLink,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, getCachedUser, getCachedProfile } from '../lib/supabase';
import { useOverallProgress } from '../hooks/useOverallProgress';

const N8nIndex: React.FC = () => {
  const { theme } = useTheme();
  const [userProgress, setUserProgress] = useState({
    totalProgress: 0,
    completedWorkflows: 0,
    activeIntegrations: 0,
    deployedAgents: 0
  });
  const [userName, setUserName] = useState('');
  const [userFocus, setUserFocus] = useState<'ai-automation' | 'web-dev' | 'ai-video' | 'explore'>('ai-automation');
  const [loading, setLoading] = useState(true);
  
  // Get real progress based on user focus (for N8n page, always use ai-automation focus)
  const { progress: overallProgress } = useOverallProgress('ai-automation');
  
  // News tracking state
  const [trackedSources, setTrackedSources] = useState([
    {
      id: 'openai-twitter',
      name: 'OpenAI',
      type: 'Twitter',
      icon: '🧠',
      handle: '@OpenAI',
      status: 'active',
      newPosts: 3,
      totalPosts: 47,
      color: 'from-purple-500 to-indigo-600',
      latestPost: {
        id: '1',
        content: 'Excited to announce GPT-5 will feature enhanced reasoning capabilities and multimodal understanding. Coming Spring 2024! 🚀',
        timestamp: '2 hours ago',
        likes: 12500,
        retweets: 8934,
        link: 'https://twitter.com/OpenAI/status/1234567890',
        media: null
      },
      allNewPosts: [
        {
          id: '1',
          content: 'Excited to announce GPT-5 will feature enhanced reasoning capabilities and multimodal understanding. Coming Spring 2024! 🚀',
          timestamp: '2 hours ago',
          likes: 12500,
          retweets: 8934,
          link: 'https://twitter.com/OpenAI/status/1234567890'
        },
        {
          id: '2',
          content: 'Our research team has published new findings on AI alignment. Read the full paper here: [link]',
          timestamp: '5 hours ago',
          likes: 7800,
          retweets: 3200,
          link: 'https://twitter.com/OpenAI/status/1234567891'
        },
        {
          id: '3',
          content: 'ChatGPT now supports advanced code analysis and debugging. Try it out!',
          timestamp: '8 hours ago',
          likes: 15600,
          retweets: 9800,
          link: 'https://twitter.com/OpenAI/status/1234567892'
        }
      ]
    },
    {
      id: 'apple-twitter',
      name: 'Apple',
      type: 'Twitter',
      icon: '🍎',
      handle: '@Apple',
      status: 'active',
      newPosts: 2,
      totalPosts: 23,
      color: 'from-gray-600 to-gray-800',
      latestPost: {
        id: '1',
        content: 'iPhone 16 Pro features our most advanced AI chip yet. Neural Engine processes 15.8 trillion operations per second.',
        timestamp: '4 hours ago',
        likes: 45600,
        retweets: 21000,
        link: 'https://twitter.com/Apple/status/2234567890',
        media: 'https://example.com/iphone-ai-image.jpg'
      },
      allNewPosts: [
        {
          id: '1',
          content: 'iPhone 16 Pro features our most advanced AI chip yet. Neural Engine processes 15.8 trillion operations per second.',
          timestamp: '4 hours ago',
          likes: 45600,
          retweets: 21000,
          link: 'https://twitter.com/Apple/status/2234567890'
        },
        {
          id: '2',
          content: 'Siri now understands context better than ever with on-device AI processing.',
          timestamp: '1 day ago',
          likes: 32400,
          retweets: 18200,
          link: 'https://twitter.com/Apple/status/2234567891'
        }
      ]
    },
    {
      id: 'elonmusk-twitter',
      name: 'Elon Musk',
      type: 'Twitter',
      icon: '🚗',
      handle: '@elonmusk',
      status: 'active',
      newPosts: 5,
      totalPosts: 89,
      color: 'from-blue-500 to-cyan-600',
      latestPost: {
        id: '1',
        content: 'Tesla FSD v12 is now using pure neural nets end-to-end. No more hand-coded driving rules. This is a major milestone! 🧠🚗',
        timestamp: '1 hour ago',
        likes: 78900,
        retweets: 45600,
        link: 'https://twitter.com/elonmusk/status/3234567890',
        media: null
      },
      allNewPosts: [
        {
          id: '1',
          content: 'Tesla FSD v12 is now using pure neural nets end-to-end. No more hand-coded driving rules. This is a major milestone! 🧠🚗',
          timestamp: '1 hour ago',
          likes: 78900,
          retweets: 45600,
          link: 'https://twitter.com/elonmusk/status/3234567890'
        },
        {
          id: '2',
          content: 'Grok AI will soon be available to all X Premium subscribers. Get ready for some witty AI conversations!',
          timestamp: '3 hours ago',
          likes: 92300,
          retweets: 67800,
          link: 'https://twitter.com/elonmusk/status/3234567891'
        },
        {
          id: '3',
          content: 'Neuralink patient can now control multiple devices simultaneously with thought alone. Incredible progress!',
          timestamp: '6 hours ago',
          likes: 156000,
          retweets: 89400,
          link: 'https://twitter.com/elonmusk/status/3234567892'
        },
        {
          id: '4',
          content: 'SpaceX Starship will use AI for autonomous landing on Mars. The future is here.',
          timestamp: '12 hours ago',
          likes: 203000,
          retweets: 112000,
          link: 'https://twitter.com/elonmusk/status/3234567893'
        },
        {
          id: '5',
          content: 'X.AI Grok-2 beats GPT-4 on several benchmarks. Competition drives innovation!',
          timestamp: '1 day ago',
          likes: 187000,
          retweets: 98600,
          link: 'https://twitter.com/elonmusk/status/3234567894'
        }
      ]
    }
  ]);

  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    trackedSources.map(source => source.id) // All sources selected by default
  );
  
  const [availableSources] = useState([
    { id: 'google-ai', name: 'Google AI', type: 'Twitter', icon: '🔍', handle: '@GoogleAI' },
    { id: 'microsoft-ai', name: 'Microsoft AI', type: 'Twitter', icon: '🔷', handle: '@MSFTResearch' },
    { id: 'anthropic-ai', name: 'Anthropic', type: 'Twitter', icon: '🤖', handle: '@AnthropicAI' },
    { id: 'meta-ai', name: 'Meta AI', type: 'Instagram', icon: '📱', handle: '@meta.ai' },
    { id: 'nvidia-ai', name: 'NVIDIA AI', type: 'Twitter', icon: '💚', handle: '@NVIDIA_AI' },
    { id: 'huggingface', name: 'Hugging Face', type: 'Twitter', icon: '🤗', handle: '@huggingface' },
    { id: 'ycombinator', name: 'Y Combinator', type: 'Twitter', icon: '🚀', handle: '@ycombinator' },
    { id: 'vercel', name: 'Vercel', type: 'Twitter', icon: '⚡', handle: '@vercel' }
  ]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Social media feed functions
  const addNewsSource = (sourceId: string) => {
    const sourceToAdd = availableSources.find(source => source.id === sourceId);
    if (sourceToAdd && !trackedSources.find(tracked => tracked.id === sourceId)) {
      const newSource = {
        ...sourceToAdd,
        status: 'active' as const,
        newPosts: 0,
        totalPosts: 0,
        color: 'from-blue-500 to-cyan-600',
        latestPost: {
          id: '1',
          content: 'Just added this source to your tracking list!',
          timestamp: 'Just now',
          likes: 0,
          retweets: 0,
          link: '#',
          media: null
        },
        allNewPosts: []
      };
      setTrackedSources([...trackedSources, newSource]);
    }
  };

  const removeNewsSource = (sourceId: string) => {
    setTrackedSources(trackedSources.filter(source => source.id !== sourceId));
    setExpandedSources(expandedSources.filter(id => id !== sourceId));
  };

  const toggleSourceStatus = (sourceId: string) => {
    setTrackedSources(trackedSources.map(source =>
      source.id === sourceId
        ? { ...source, status: source.status === 'active' ? 'paused' : 'active' }
        : source
    ));
  };

  const toggleExpanded = (sourceId: string) => {
    setExpandedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const markAsRead = (sourceId: string) => {
    setTrackedSources(trackedSources.map(source =>
      source.id === sourceId
        ? { ...source, newPosts: 0, allNewPosts: [] }
        : source
    ));
  };

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const selectAllSources = () => {
    setSelectedSources(trackedSources.map(source => source.id));
  };

  const deselectAllSources = () => {
    setSelectedSources([]);
  };

  const totalNewPosts = trackedSources.reduce((total, source) => total + source.newPosts, 0);
  const filteredSources = trackedSources.filter(source => selectedSources.includes(source.id));

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await getCachedUser();
      if (!user) return;

      const { data: profile } = await getCachedProfile(user.id);
      setUserName(profile?.full_name || user.email?.split('@')[0] || 'User');

      // Mock progress data - in a real app, this would come from the database
      setUserProgress({
        totalProgress: 68,
        completedWorkflows: 12,
        activeIntegrations: 8,
        deployedAgents: 3
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Start Automating',
      description: 'Build your first AI-powered workflow',
      icon: <Bot className="h-6 w-6" />,
      to: '/n8n-ai-agents',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      title: 'Connect Services',
      description: 'Integrate with external APIs and tools',
      icon: <Plug className="h-6 w-6" />,
      to: '/n8n/integrate',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Deploy Workflows',
      description: 'Launch your automations to production',
      icon: <Rocket className="h-6 w-6" />,
      to: '/n8n/deploy',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Optimize Performance',
      description: 'Fine-tune your automation systems',
      icon: <Settings className="h-6 w-6" />,
      to: '/n8n/optimize',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const recentAchievements = [
    {
      title: 'First Workflow Created',
      description: 'Successfully built your first automation',
      date: '2 days ago',
      completed: true
    },
    {
      title: 'API Integration Master',
      description: 'Connected 5+ external services',
      date: '1 week ago',
      completed: true
    },
    {
      title: 'Deployment Expert',
      description: 'Deploy 3 workflows to production',
      date: 'In progress',
      completed: false
    }
  ];

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Welcome Header */}
      <div className={`relative overflow-hidden rounded-2xl ${
        theme === 'gradient'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' // Grey gradient for gradient theme
          : 'bg-gradient-to-br from-purple-600 to-indigo-700'
      } p-8`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-purple-200 mb-4">
            <Bot className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">N8N AI AGENTS</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userName}!
          </h1>
          
          <p className="text-purple-100 text-lg mb-6">
            Continue building powerful automation workflows and AI-driven processes.
          </p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <ProgressRing 
                progress={overallProgress.percentage} 
                size={60} 
                theme={theme}
              />
              <div>
                <div className="text-white font-semibold">{overallProgress.percentage}% Complete</div>
                <div className="text-purple-200 text-sm">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Workflows Built
              </p>
              <h4 className={`mt-2 text-2xl font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {userProgress.completedWorkflows}
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'gradient' 
                ? 'bg-purple-900/30 text-purple-400' 
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              <Bot className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Active Integrations
              </p>
              <h4 className={`mt-2 text-2xl font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {userProgress.activeIntegrations}
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'gradient' 
                ? 'bg-blue-900/30 text-blue-400' 
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            }`}>
              <Plug className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Deployed Agents
              </p>
              <h4 className={`mt-2 text-2xl font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {userProgress.deployedAgents}
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'gradient' 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            }`}>
              <Rocket className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className={`text-xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.to} className="block group">
              <Card className="h-full transition-all duration-300 hover:shadow-lg group-hover:translate-y-[-4px]">
                <div className="flex flex-col h-full">
                  <div className={`p-3 mb-4 rounded-lg bg-gradient-to-br ${action.color} w-12 h-12 flex items-center justify-center text-white`}>
                    {action.icon}
                  </div>
                  
                  <h3 className={`text-lg font-semibold mb-2 ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {action.title}
                  </h3>
                  
                  <p className={`text-sm flex-grow ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {action.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mt-4">
                    <span>Get Started</span>
                    <ArrowRight size={16} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Social Feed Tracker */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white`}>
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                AI Social Feed
              </h2>
              <p className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Track the latest AI posts from Twitter, Instagram, and more
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Feed</span>
          </Button>
        </div>

        {/* Filter Navigation */}
        <div className={`rounded-2xl p-4 backdrop-blur-sm border ${
          theme === 'gradient' 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className={`font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                Filter Sources
              </h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                theme === 'gradient' 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {selectedSources.length} of {trackedSources.length} selected
              </span>
              {totalNewPosts > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Bell className="h-3 w-3" />
                  <span>{totalNewPosts} total new</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllSources}
                disabled={selectedSources.length === trackedSources.length}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAllSources}
                disabled={selectedSources.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Source Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {trackedSources.map((source) => {
              const isSelected = selectedSources.includes(source.id);
              return (
                <button
                  key={source.id}
                  onClick={() => toggleSourceSelection(source.id)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isSelected
                      ? `bg-gradient-to-r ${source.color} text-white shadow-lg scale-105`
                      : theme === 'gradient'
                        ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-sm">{source.icon}</span>
                  <span className="font-medium text-sm">{source.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : source.type === 'Twitter' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : source.type === 'Instagram'
                          ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {source.type}
                  </span>
                  
                  {/* Notification Badge */}
                  {source.newPosts > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] flex items-center justify-center font-bold shadow-lg">
                      {source.newPosts}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Social Media Feed */}
        {selectedSources.length > 0 ? (
          <div className="space-y-8">
            {filteredSources.map((source) => (
            <div key={source.id} className="space-y-4">
              {/* Source Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${source.color} text-white`}>
                    {source.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className={`font-bold text-xl ${
                        theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {source.name}
                      </h3>
                      <span className={`text-sm ${
                        theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {source.handle}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        source.type === 'Twitter' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                        source.type === 'Instagram' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {source.type}
                      </span>
                      {source.newPosts > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <Bell className="h-3 w-3" />
                          <span>{source.newPosts} new</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {source.newPosts > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(source.id)}
                      className="flex items-center space-x-2"
                    >
                      <ArrowRight className={`h-4 w-4 transition-transform ${
                        expandedSources.includes(source.id) ? 'rotate-90' : ''
                      }`} />
                      <span>
                        {expandedSources.includes(source.id) 
                          ? 'Show Less' 
                          : `Show All ${source.newPosts}`
                        }
                      </span>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(source.id)}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark Read</span>
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSourceStatus(source.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        source.status === 'active'
                          ? 'text-green-500 bg-green-100 dark:bg-green-900/30'
                          : 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
                      }`}
                    >
                      {source.status === 'active' ? <Activity className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => removeNewsSource(source.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'gradient' 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
                      }`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Latest Post - Always Shown */}
                <div className={`aspect-square relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 group ${
                  theme === 'gradient' 
                    ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                    : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-900/90'
                }`}>
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  
                  {/* Content */}
                  <div className="relative p-4 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${source.color} text-white text-sm`}>
                        {source.icon}
                      </div>
                      <span className={`text-xs ${
                        theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {source.latestPost.timestamp}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <p className={`text-sm leading-relaxed mb-4 line-clamp-4 flex-1 ${
                        theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {source.latestPost.content}
                      </p>
                      
                      {source.latestPost.media && (
                        <div className="mb-3">
                          <div className={`h-16 bg-gradient-to-br from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg flex items-center justify-center ${
                            theme === 'gradient' ? 'from-gray-600/30 to-gray-700/30' : ''
                          }`}>
                            <span className="text-lg">📷</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs flex items-center space-x-1 ${
                          theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <TrendingUp className="h-3 w-3" />
                          <span>{source.latestPost.retweets > 999 ? `${(source.latestPost.retweets/1000).toFixed(1)}k` : source.latestPost.retweets}</span>
                        </span>
                        <span className={`text-xs flex items-center space-x-1 ${
                          theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <Eye className="h-3 w-3" />
                          <span>{source.latestPost.likes > 999 ? `${(source.latestPost.likes/1000).toFixed(1)}k` : source.latestPost.likes}</span>
                        </span>
                      </div>
                      <a
                        href={source.latestPost.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                          source.type === 'Twitter' ? 'text-blue-500 hover:bg-blue-500/10' :
                          source.type === 'Instagram' ? 'text-pink-500 hover:bg-pink-500/10' :
                          'text-gray-500 hover:bg-gray-500/10'
                        }`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Additional Posts - Show when expanded */}
                {expandedSources.includes(source.id) && source.allNewPosts.slice(1).map((post, index) => (
                  <div key={post.id} className={`aspect-square relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 group ${
                    theme === 'gradient' 
                      ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                      : 'bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-900/90'
                  }`}>
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                    
                    {/* Content */}
                    <div className="relative p-4 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${source.color} text-white text-sm`}>
                          {source.icon}
                        </div>
                        <span className={`text-xs ${
                          theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {post.timestamp}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <p className={`text-sm leading-relaxed mb-4 line-clamp-4 flex-1 ${
                          theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {post.content}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs flex items-center space-x-1 ${
                            theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <TrendingUp className="h-3 w-3" />
                            <span>{post.retweets > 999 ? `${(post.retweets/1000).toFixed(1)}k` : post.retweets}</span>
                          </span>
                          <span className={`text-xs flex items-center space-x-1 ${
                            theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <Eye className="h-3 w-3" />
                            <span>{post.likes > 999 ? `${(post.likes/1000).toFixed(1)}k` : post.likes}</span>
                          </span>
                        </div>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                            source.type === 'Twitter' ? 'text-blue-500 hover:bg-blue-500/10' :
                            source.type === 'Instagram' ? 'text-pink-500 hover:bg-pink-500/10' :
                            'text-gray-500 hover:bg-gray-500/10'
                          }`}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        ) : (
          <Card>
            <div className="p-12 text-center">
              <div className={`p-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white mx-auto w-16 h-16 flex items-center justify-center mb-4`}>
                <Eye className="h-8 w-8" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                No Sources Selected
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Choose which social media sources you'd like to see in the filter above.
              </p>
              <Button onClick={selectAllSources} className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Show All Sources</span>
              </Button>
            </div>
          </Card>
        )}

        {/* Available Sources to Add */}
        <Card className="mt-6">
          <div className="p-4">
            <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              <Plus className="h-4 w-4" />
              <span>Available Social Media Sources</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSources
                .filter(source => !trackedSources.find(tracked => tracked.id === source.id))
                .map((source) => (
                  <button
                    key={source.id}
                    onClick={() => addNewsSource(source.id)}
                    className={`p-3 rounded-lg text-left transition-all hover:scale-105 ${
                      theme === 'gradient' 
                        ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{source.icon}</span>
                      <span className="font-medium text-sm">{source.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {source.handle}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        source.type === 'Twitter' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                        source.type === 'Instagram' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {source.type}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-semibold mb-6 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Recent Achievements
          </h3>
          
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className={`flex items-start p-3 rounded-lg ${
                theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className="flex-shrink-0 mr-3">
                  {achievement.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  <span className={`text-xs ${
                    theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {achievement.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className={`text-lg font-semibold mb-6 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Next Steps
          </h3>
          
          <div className="space-y-4">
            {[
              {
                title: 'Complete Advanced Workflows',
                description: 'Build complex multi-step automations',
                progress: 60
              },
              {
                title: 'Master API Integrations',
                description: 'Connect with 10+ external services',
                progress: 80
              },
              {
                title: 'Optimize Performance',
                description: 'Improve workflow execution speed',
                progress: 30
              }
            ].map((step, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {step.title}
                  </h4>
                  <span className={`text-sm ${
                    theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.progress}%
                  </span>
                </div>
                <p className={`text-sm mb-2 ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {step.description}
                </p>
                <div className={`w-full h-2 rounded-full ${
                  theme === 'gradient' ? 'bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default N8nIndex;