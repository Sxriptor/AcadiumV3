import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ui/ThemeProvider';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { 
  Video, 
  Plug, 
  Rocket, 
  Settings, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Film,
  Camera,
  Plus,
  Twitter,
  Youtube,
  Rss,
  ExternalLink,
  Activity,
  TrendingUp,
  Eye,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, getCachedUser, getCachedProfile } from '../lib/supabase';
import { useOverallProgress } from '../hooks/useOverallProgress';

const VideoIndex: React.FC = () => {
  const { theme } = useTheme();
  const [userProgress, setUserProgress] = useState({
    totalProgress: 0,
    videosCreated: 0,
    coursesBuilt: 0,
    totalViews: 0
  });
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Get real progress based on ai-video focus
  const { progress: overallProgress } = useOverallProgress('ai-video');

  // News tracking state
  const [trackedSources, setTrackedSources] = useState([
    {
      id: 'midjourney-twitter',
      name: 'Midjourney',
      type: 'Twitter',
      icon: '🎨',
      handle: '@midjourney',
      status: 'active',
      newPosts: 2,
      totalPosts: 32,
      color: 'from-purple-500 to-indigo-600',
      latestPost: {
        id: '1',
        content: 'Midjourney V6 now supports more detailed image generation with improved lighting and composition. Try our new /imagine command options!',
        timestamp: '3 hours ago',
        likes: 8700,
        retweets: 3200,
        link: 'https://twitter.com/midjourney/status/1234567890',
        media: null
      },
      allNewPosts: [
        {
          id: '1',
          content: 'Midjourney V6 now supports more detailed image generation with improved lighting and composition. Try our new /imagine command options!',
          timestamp: '3 hours ago',
          likes: 8700,
          retweets: 3200,
          link: 'https://twitter.com/midjourney/status/1234567890'
        },
        {
          id: '2',
          content: 'We\'ve just released a new tutorial on creating cinematic scenes with Midjourney. Check it out on our website!',
          timestamp: '6 hours ago',
          likes: 5400,
          retweets: 1800,
          link: 'https://twitter.com/midjourney/status/1234567891'
        }
      ]
    },
    {
      id: 'runwayml-twitter',
      name: 'Runway',
      type: 'Twitter',
      icon: '🎬',
      handle: '@runwayml',
      status: 'active',
      newPosts: 3,
      totalPosts: 45,
      color: 'from-red-500 to-pink-600',
      latestPost: {
        id: '1',
        content: 'Introducing Gen-3: Our most advanced text-to-video model yet. Create stunning, high-quality videos from text prompts with unprecedented control.',
        timestamp: '1 hour ago',
        likes: 12300,
        retweets: 5600,
        link: 'https://twitter.com/runwayml/status/2234567890',
        media: 'https://example.com/runway-gen3-video.mp4'
      },
      allNewPosts: [
        {
          id: '1',
          content: 'Introducing Gen-3: Our most advanced text-to-video model yet. Create stunning, high-quality videos from text prompts with unprecedented control.',
          timestamp: '1 hour ago',
          likes: 12300,
          retweets: 5600,
          link: 'https://twitter.com/runwayml/status/2234567890'
        },
        {
          id: '2',
          content: 'New tutorial: Learn how to use Gen-3 for creating professional-quality product videos in minutes.',
          timestamp: '4 hours ago',
          likes: 7800,
          retweets: 2100,
          link: 'https://twitter.com/runwayml/status/2234567891'
        },
        {
          id: '3',
          content: 'Runway is now integrated with Adobe Premiere Pro! Edit and enhance your videos with AI directly in your favorite editing software.',
          timestamp: '8 hours ago',
          likes: 9500,
          retweets: 4200,
          link: 'https://twitter.com/runwayml/status/2234567892'
        }
      ]
    },
    {
      id: 'elevenlabs-twitter',
      name: 'ElevenLabs',
      type: 'Twitter',
      icon: '🎤',
      handle: '@elevenlabsio',
      status: 'active',
      newPosts: 1,
      totalPosts: 28,
      color: 'from-blue-500 to-cyan-600',
      latestPost: {
        id: '1',
        content: 'We\'ve just released our new Voice Design tool! Create custom voices with unprecedented control over tone, emotion, and delivery.',
        timestamp: '5 hours ago',
        likes: 6200,
        retweets: 1900,
        link: 'https://twitter.com/elevenlabsio/status/3234567890',
        media: null
      },
      allNewPosts: [
        {
          id: '1',
          content: 'We\'ve just released our new Voice Design tool! Create custom voices with unprecedented control over tone, emotion, and delivery.',
          timestamp: '5 hours ago',
          likes: 6200,
          retweets: 1900,
          link: 'https://twitter.com/elevenlabsio/status/3234567890'
        }
      ]
    }
  ]);

  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>(
    trackedSources.map(source => source.id) // All sources selected by default
  );
  
  const [availableSources] = useState([
    { id: 'pika-labs', name: 'Pika Labs', type: 'Twitter', icon: '⚡', handle: '@pika_labs' },
    { id: 'veo-ai', name: 'Veo AI', type: 'Twitter', icon: '👁️', handle: '@veo_ai' },
    { id: 'synthesia', name: 'Synthesia', type: 'Twitter', icon: '🎭', handle: '@synthesiaIO' },
    { id: 'descript', name: 'Descript', type: 'Twitter', icon: '✂️', handle: '@descriptapp' },
    { id: 'topaz-labs', name: 'Topaz Labs', type: 'Twitter', icon: '💎', handle: '@topazlabs' },
    { id: 'stability-ai', name: 'Stability AI', type: 'Twitter', icon: '🧠', handle: '@stabilityai' },
    { id: 'adobe-video', name: 'Adobe Video', type: 'Twitter', icon: '🎬', handle: '@AdobeVideo' },
    { id: 'davinci-resolve', name: 'DaVinci Resolve', type: 'Twitter', icon: '🎞️', handle: '@Blackmagic_News' }
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
        color: 'from-red-500 to-pink-600',
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
        totalProgress: 45,
        videosCreated: 8,
        coursesBuilt: 2,
        totalViews: 1250
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Videos',
      description: 'Generate AI-powered video content',
      icon: <Video className="h-6 w-6" />,
      to: '/ai-course-factory',
      color: 'from-red-500 to-pink-600'
    },
    {
      title: 'Connect Tools',
      description: 'Integrate video creation platforms',
      icon: <Plug className="h-6 w-6" />,
      to: '/video/integrate',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Publish Content',
      description: 'Deploy videos to multiple platforms',
      icon: <Rocket className="h-6 w-6" />,
      to: '/video/deploy',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Optimize Quality',
      description: 'Enhance video production workflow',
      icon: <Settings className="h-6 w-6" />,
      to: '/video/optimize',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const recentAchievements = [
    {
      title: 'First Video Created',
      description: 'Successfully generated your first AI video',
      date: '3 days ago',
      completed: true
    },
    {
      title: 'Course Builder',
      description: 'Built your first complete video course',
      date: '1 week ago',
      completed: true
    },
    {
      title: 'Viral Content Creator',
      description: 'Reach 1000+ views on a single video',
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
          : 'bg-gradient-to-br from-red-600 to-pink-700'
      } p-8`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-red-200 mb-4">
            <Video className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">AI VIDEO CREATION</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userName}!
          </h1>
          
          <p className="text-red-100 text-lg mb-6">
            Continue creating stunning AI-powered video content and educational courses.
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
                <div className="text-red-200 text-sm">Overall Progress</div>
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
                Videos Created
              </p>
              <h4 className={`mt-2 text-2xl font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {userProgress.videosCreated}
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'gradient' 
                ? 'bg-red-900/30 text-red-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              <Camera className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Courses Built
              </p>
              <h4 className={`mt-2 text-2xl font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {userProgress.coursesBuilt}
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'gradient' 
                ? 'bg-purple-900/30 text-purple-400' 
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
            }`}>
              <Film className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                Total Views
              </p>
              <h4 className={`mt-2 text-2xl font-semibold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {userProgress.totalViews.toLocaleString()}
              </h4>
            </div>
            <div className={`p-2 rounded-lg ${
              theme === 'gradient' 
                ? 'bg-green-900/30 text-green-400' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            }`}>
              <Target className="h-6 w-6" />
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
            <div className={`p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white`}>
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                Video Creation Feed
              </h2>
              <p className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                Track the latest updates from video creation tools and platforms
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
              <span>Available Video Creation Sources</span>
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
                title: 'Master Video Editing',
                description: 'Learn advanced editing techniques',
                progress: 70
              },
              {
                title: 'Build Course Series',
                description: 'Create comprehensive video courses',
                progress: 40
              },
              {
                title: 'Optimize for Platforms',
                description: 'Tailor content for different channels',
                progress: 25
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
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-300"
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

export default VideoIndex;