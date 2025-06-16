import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Rocket, 
  Youtube, 
  Film, 
  Globe, 
  Calendar,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Settings,
  Minus,
  Plus,
  BarChart3,
  BookOpen,
  Share2,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  PlayCircle,
  Upload,
  Target,
  MessageSquare,
  Monitor,
  Play,
  Cloud,
  Loader2
} from 'lucide-react';
import { useUserProgress } from '../../hooks/useUserProgress';

interface Step {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  estimated_time?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface StepSection {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

interface DeploymentPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const VideoDeploy: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('youtube');
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
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'vimeo', name: 'Vimeo Pro', icon: '🎬' },
    { id: 'social', name: 'Social Share', icon: '📱' },
    { id: 'courses', name: 'Course Hub', icon: '🎓' },
    { id: 'scheduling', name: 'Schedule', icon: '📅' },
    { id: 'analytics', name: 'Insights', icon: '📊' },
    { id: 'monetization', name: 'Revenue', icon: '💰' }
  ];

  // Dynamic checklist based on active app
  const getChecklistForApp = (appId: string) => {
    const checklistMap: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
      youtube: [
        { id: 'finalize-video', title: 'Finalize video content', description: 'Complete all editing and post-production', completed: false },
        { id: 'prepare-metadata', title: 'Prepare metadata', description: 'Create compelling titles, descriptions, and tags', completed: false },
        { id: 'create-thumbnails', title: 'Create thumbnails', description: 'Design eye-catching, high-CTR thumbnails', completed: false },
        { id: 'setup-seo', title: 'Set up SEO optimization', description: 'Optimize for YouTube search and discovery', completed: false },
        { id: 'configure-monetization', title: 'Configure monetization', description: 'Enable ads, memberships, and Super Thanks', completed: false },
        { id: 'schedule-release', title: 'Schedule release', description: 'Set optimal publishing time and date', completed: false },
        { id: 'prepare-promotion', title: 'Prepare promotion', description: 'Create end screens, cards, and promotional plan', completed: false },
        { id: 'setup-analytics', title: 'Set up analytics', description: 'Configure YouTube Analytics tracking', completed: false }
      ],
      vimeo: [
        { id: 'upload-hd-video', title: 'Upload HD/4K video', description: 'Upload high-quality video with Vimeo Pro', completed: false },
        { id: 'configure-privacy', title: 'Configure privacy settings', description: 'Set password protection and access controls', completed: false },
        { id: 'customize-player', title: 'Customize video player', description: 'Brand player with custom colors and logo', completed: false },
        { id: 'setup-embeds', title: 'Set up embeds', description: 'Configure embedding options for websites', completed: false },
        { id: 'enable-downloads', title: 'Enable downloads', description: 'Set download permissions for viewers', completed: false },
        { id: 'add-captions', title: 'Add captions', description: 'Upload or auto-generate video captions', completed: false },
        { id: 'organize-showcase', title: 'Organize showcase', description: 'Add to showcases and collections', completed: false },
        { id: 'review-analytics', title: 'Review analytics', description: 'Check Vimeo Pro analytics dashboard', completed: false }
      ],
      social: [
        { id: 'optimize-formats', title: 'Optimize video formats', description: 'Create platform-specific video formats', completed: false },
        { id: 'prepare-instagram', title: 'Prepare Instagram content', description: 'Format for Reels, Stories, and IGTV', completed: false },
        { id: 'setup-tiktok', title: 'Set up TikTok version', description: 'Create vertical format with trending sounds', completed: false },
        { id: 'configure-facebook', title: 'Configure Facebook post', description: 'Optimize for Facebook video algorithm', completed: false },
        { id: 'prepare-linkedin', title: 'Prepare LinkedIn content', description: 'Add professional context and captions', completed: false },
        { id: 'schedule-posts', title: 'Schedule social posts', description: 'Plan optimal posting times across platforms', completed: false },
        { id: 'create-hashtags', title: 'Create hashtag strategy', description: 'Research and plan platform-specific hashtags', completed: false },
        { id: 'monitor-engagement', title: 'Monitor engagement', description: 'Track comments, shares, and interactions', completed: false }
      ],
      courses: [
        { id: 'structure-lessons', title: 'Structure video lessons', description: 'Organize content into learning modules', completed: false },
        { id: 'upload-lms', title: 'Upload to LMS', description: 'Deploy to Canvas, Moodle, or Blackboard', completed: false },
        { id: 'add-transcripts', title: 'Add transcripts', description: 'Provide accessibility with full transcripts', completed: false },
        { id: 'create-quizzes', title: 'Create assessments', description: 'Add quizzes and learning checkpoints', completed: false },
        { id: 'setup-discussions', title: 'Set up discussions', description: 'Enable student discussion forums', completed: false },
        { id: 'configure-grades', title: 'Configure grading', description: 'Set up gradebook integration', completed: false },
        { id: 'test-playback', title: 'Test video playback', description: 'Ensure smooth streaming in LMS', completed: false },
        { id: 'launch-course', title: 'Launch course', description: 'Make course available to students', completed: false }
      ],
      scheduling: [
        { id: 'analyze-audience', title: 'Analyze audience activity', description: 'Research optimal posting times', completed: false },
        { id: 'create-calendar', title: 'Create content calendar', description: 'Plan release schedule across platforms', completed: false },
        { id: 'setup-automation', title: 'Set up automation', description: 'Configure auto-publishing tools', completed: false },
        { id: 'coordinate-platforms', title: 'Coordinate platforms', description: 'Sync release timing across channels', completed: false },
        { id: 'prepare-variants', title: 'Prepare content variants', description: 'Create platform-specific versions', completed: false },
        { id: 'test-scheduling', title: 'Test scheduling system', description: 'Verify automated publishing works', completed: false },
        { id: 'backup-plans', title: 'Create backup plans', description: 'Set up manual publishing fallbacks', completed: false },
        { id: 'monitor-releases', title: 'Monitor releases', description: 'Track scheduled publication success', completed: false }
      ],
      analytics: [
        { id: 'setup-tracking', title: 'Set up tracking codes', description: 'Install analytics across all platforms', completed: false },
        { id: 'configure-goals', title: 'Configure conversion goals', description: 'Set up goal tracking and events', completed: false },
        { id: 'connect-platforms', title: 'Connect all platforms', description: 'Link YouTube, social, and website analytics', completed: false },
        { id: 'create-dashboards', title: 'Create dashboards', description: 'Build comprehensive performance dashboards', completed: false },
        { id: 'setup-alerts', title: 'Set up alerts', description: 'Configure performance and issue alerts', completed: false },
        { id: 'test-tracking', title: 'Test tracking', description: 'Verify all analytics are working correctly', completed: false },
        { id: 'baseline-metrics', title: 'Establish baseline metrics', description: 'Record initial performance benchmarks', completed: false },
        { id: 'schedule-reports', title: 'Schedule reports', description: 'Set up automated analytics reports', completed: false }
      ],
      monetization: [
        { id: 'enable-monetization', title: 'Enable platform monetization', description: 'Activate revenue features on each platform', completed: false },
        { id: 'setup-adsense', title: 'Set up AdSense', description: 'Connect Google AdSense for ad revenue', completed: false },
        { id: 'create-memberships', title: 'Create memberships', description: 'Set up paid membership tiers', completed: false },
        { id: 'add-affiliate-links', title: 'Add affiliate links', description: 'Include revenue-generating affiliate links', completed: false },
        { id: 'setup-sponsorships', title: 'Set up sponsorships', description: 'Configure brand partnership integrations', completed: false },
        { id: 'price-courses', title: 'Price course content', description: 'Set pricing for educational content', completed: false },
        { id: 'track-revenue', title: 'Track revenue streams', description: 'Monitor income from all sources', completed: false },
        { id: 'optimize-earnings', title: 'Optimize earnings', description: 'Adjust strategies based on performance', completed: false }
      ]
    };
    return checklistMap[appId] || checklistMap.youtube;
  };

  const checklistItems = getChecklistForApp(activeApp);

  const deploymentPaths: { [key: string]: DeploymentPath } = {
    youtube: {
      id: 'youtube',
      title: 'Step-by-Step YouTube Deployment',
      icon: <Youtube className="h-5 w-5" />,
      description: 'Deploy and optimize your videos for YouTube success',
      sections: [
        {
          id: 'youtube-upload',
          title: '📺 YouTube Upload Process',
          description: 'Upload and configure your video on YouTube',
          steps: [
            {
              id: 'video-deploy-youtube-step-1',
              title: 'Video Upload Setup',
              description: 'Prepare and upload your video to YouTube Studio',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>YouTube Video Upload</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Upload your video to YouTube and configure basic settings for optimal performance.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Upload className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Upload Process</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Access YouTube Studio</li>
                        <li>• Select "Create" → "Upload video"</li>
                        <li>• Choose video file (max 256GB)</li>
                        <li>• Wait for processing completion</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Basic Settings</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Set video title (60 chars max)</li>
                        <li>• Write description (5000 chars)</li>
                        <li>• Choose thumbnail</li>
                        <li>• Select audience settings</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-500/30' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-red-300' : 'text-red-700 dark:text-red-300'}`}>🎯 Key Objectives</h3>
                    <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Master the YouTube upload process:</p>
                    <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      <li>• Efficient video uploading workflow</li>
                      <li>• Proper metadata configuration</li>
                      <li>• Audience and visibility settings</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'video-deploy-youtube-step-2',
              title: 'SEO Optimization',
              description: 'Optimize your video for search and discovery',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>YouTube SEO Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Optimize your video metadata for maximum discoverability and engagement.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'youtube-monetization',
          title: '💰 Monetization Setup',
          description: 'Configure revenue generation features',
          steps: [
            {
              id: 'video-deploy-youtube-step-3',
              title: 'Enable Monetization Features',
              description: 'Set up ads, memberships, and Super Thanks',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>YouTube Monetization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Enable and configure YouTube's monetization features to generate revenue from your content.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'youtube-promotion',
          title: '📢 Promotion & Engagement',
          description: 'Promote your video and engage with viewers',
          steps: [
            {
              id: 'video-deploy-youtube-step-4',
              title: 'End Screens & Cards Setup',
              description: 'Add interactive elements to promote other content',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Promotion</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Use end screens, cards, and other YouTube features to promote your content and grow your channel.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    vimeo: {
      id: 'vimeo',
      title: 'Step-by-Step Vimeo Pro Deployment',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Deploy professional videos with Vimeo Pro features',
      sections: [
        {
          id: 'vimeo-setup',
          title: '🎬 Vimeo Pro Upload',
          description: 'Upload and configure professional video settings',
          steps: [
            {
              id: 'vimeo-step-1',
              title: 'Professional Upload Setup',
              description: 'Configure Vimeo Pro upload with advanced settings',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vimeo Pro Deployment</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Upload your video to Vimeo Pro with professional quality and privacy controls.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <PlayCircle className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Pro Features</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• 4K/8K video support</li>
                        <li>• Advanced privacy controls</li>
                        <li>• Custom player branding</li>
                        <li>• Password protection</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Upload Settings</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Upload up to 20GB/week</li>
                        <li>• Set video quality preferences</li>
                        <li>• Configure download permissions</li>
                        <li>• Enable/disable comments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vimeo-step-2',
              title: 'Privacy & Branding Configuration',
              description: 'Set up privacy controls and custom branding',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Privacy & Branding</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure privacy settings and customize your video player with professional branding.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'vimeo-distribution',
          title: '🌐 Distribution & Embedding',
          description: 'Set up video distribution and embedding options',
          steps: [
            {
              id: 'vimeo-step-3',
              title: 'Embedding & Showcase Setup',
              description: 'Configure embedding options and organize in showcases',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Distribution Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up embedding options and organize your videos in professional showcases.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    social: {
      id: 'social',
      title: 'Step-by-Step Social Media Deployment',
      icon: <Share2 className="h-5 w-5" />,
      description: 'Deploy videos across multiple social media platforms',
      sections: [
        {
          id: 'social-platforms',
          title: '📱 Multi-Platform Sharing',
          description: 'Share videos across social media platforms',
          steps: [
            {
              id: 'video-deploy-social-step-1',
              title: 'Platform Optimization',
              description: 'Optimize videos for different social platforms',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Social Media Deployment</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Optimize and deploy your videos across Instagram, TikTok, Facebook, and LinkedIn.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <div className="h-8 w-8 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">IG</span>
                      </div>
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Instagram</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <div className="h-8 w-8 mx-auto mb-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">TT</span>
                      </div>
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>TikTok</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">FB</span>
                      </div>
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Facebook</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <div className="h-8 w-8 mx-auto mb-2 bg-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">LI</span>
                      </div>
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>LinkedIn</span>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-deploy-social-step-2',
              title: 'Content Adaptation Strategy',
              description: 'Adapt content for each platform\'s unique requirements',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform-Specific Adaptation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to adapt your content for each platform's unique format and audience expectations.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'social-scheduling',
          title: '📅 Cross-Platform Scheduling',
          description: 'Schedule and coordinate posts across platforms',
          steps: [
            {
              id: 'video-deploy-social-step-3',
              title: 'Multi-Platform Publishing',
              description: 'Set up coordinated publishing across all social platforms',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Coordinated Publishing</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Schedule and coordinate your video releases across multiple social media platforms for maximum impact.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    courses: {
      id: 'courses',
      title: 'Step-by-Step Course Hub Deployment',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Deploy videos to educational platforms and LMS',
      sections: [
        {
          id: 'course-integration',
          title: '🎓 Educational Platform Integration',
          description: 'Deploy videos to learning management systems',
          steps: [
            {
              id: 'course-step-1',
              title: 'LMS Platform Setup',
              description: 'Configure video deployment for educational platforms',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Course Hub Deployment</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Deploy your educational videos to LMS platforms like Canvas, Moodle, and Blackboard.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Canvas</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Moodle</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Blackboard</span>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'course-step-2',
              title: 'Accessibility & Compliance',
              description: 'Ensure educational accessibility and compliance standards',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Educational Compliance</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Ensure your educational videos meet accessibility standards and compliance requirements.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'course-assessment',
          title: '📝 Assessment Integration',
          description: 'Add quizzes, assignments, and learning checkpoints',
          steps: [
            {
              id: 'course-step-3',
              title: 'Interactive Learning Elements',
              description: 'Create quizzes and assignments tied to video content',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Interactive Assessments</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Integrate interactive quizzes, assignments, and learning checkpoints with your video content.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    scheduling: {
      id: 'scheduling',
      title: 'Step-by-Step Scheduling Deployment',
      icon: <Clock className="h-5 w-5" />,
      description: 'Schedule and automate video releases across platforms',
      sections: [
        {
          id: 'schedule-setup',
          title: '📅 Release Scheduling',
          description: 'Plan and schedule video releases',
          steps: [
            {
              id: 'schedule-step-1',
              title: 'Content Calendar Setup',
              description: 'Create automated release schedules',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automated Scheduling</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up automated release schedules for optimal timing across all platforms.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Schedule Planning</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Optimal posting times</li>
                        <li>• Multi-platform coordination</li>
                        <li>• Timezone considerations</li>
                        <li>• Audience activity analysis</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Automation</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Automated publishing</li>
                        <li>• Cross-platform sync</li>
                        <li>• Backup scheduling</li>
                        <li>• Performance monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'schedule-step-2',
              title: 'Cross-Platform Coordination',
              description: 'Synchronize releases across multiple platforms',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Coordination</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Coordinate video releases across multiple platforms for maximum reach and engagement.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'automation-tools',
          title: '🤖 Automation Tools',
          description: 'Set up automated publishing and monitoring',
          steps: [
            {
              id: 'schedule-step-3',
              title: 'Publishing Automation Setup',
              description: 'Configure automated publishing tools and backup systems',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automation Systems</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up robust automation systems with monitoring and backup publishing capabilities.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    analytics: {
      id: 'analytics',
      title: 'Step-by-Step Analytics Deployment',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Deploy comprehensive analytics tracking across platforms',
      sections: [
        {
          id: 'analytics-setup',
          title: '📊 Performance Tracking',
          description: 'Set up analytics and performance monitoring',
          steps: [
            {
              id: 'video-deploy-analytics-step-1',
              title: 'Multi-Platform Analytics',
              description: 'Configure comprehensive performance tracking',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Deployment</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up comprehensive analytics to track video performance across all deployment platforms.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Key Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• View counts & engagement</li>
                        <li>• Watch time & retention</li>
                        <li>• Click-through rates</li>
                        <li>• Conversion tracking</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Reporting</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Automated reports</li>
                        <li>• Platform comparisons</li>
                        <li>• ROI calculations</li>
                        <li>• Performance alerts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-deploy-analytics-step-2',
              title: 'Goal & Conversion Setup',
              description: 'Configure conversion goals and event tracking',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Conversion Tracking</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up goal tracking and conversion analytics to measure video performance and ROI.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'analytics-dashboard',
          title: '📈 Dashboard & Reporting',
          description: 'Create custom dashboards and automated reports',
          steps: [
            {
              id: 'video-deploy-analytics-step-3',
              title: 'Custom Dashboard Creation',
              description: 'Build comprehensive analytics dashboards',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Dashboards</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create custom dashboards that provide comprehensive insights into video performance across all platforms.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    monetization: {
      id: 'monetization',
      title: 'Step-by-Step Revenue Deployment',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Deploy monetization strategies across video platforms',
      sections: [
        {
          id: 'revenue-setup',
          title: '💰 Monetization Strategy',
          description: 'Implement revenue generation across platforms',
          steps: [
            {
              id: 'video-deploy-monetization-step-1',
              title: 'Revenue Stream Setup',
              description: 'Configure multiple monetization channels',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Deployment</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up comprehensive monetization strategies across YouTube, courses, and premium content.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Ad Revenue</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Memberships</span>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Course Sales</span>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-deploy-monetization-step-2',
              title: 'Payment System Integration',
              description: 'Set up payment processors and revenue tracking',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Payment Integration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Integrate payment systems and set up comprehensive revenue tracking across all monetization channels.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'revenue-optimization',
          title: '📈 Revenue Optimization',
          description: 'Optimize and scale monetization strategies',
          steps: [
            {
              id: 'video-deploy-monetization-step-3',
              title: 'Performance-Based Optimization',
              description: 'Optimize revenue streams based on performance data',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Use performance data to optimize and scale your monetization strategies for maximum revenue.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    }
  };

  const currentDeploymentPath = deploymentPaths[activeApp] || deploymentPaths.youtube;
  const totalSteps = currentDeploymentPath.sections.reduce((acc, section) => acc + section.steps.length, 0);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  // State to store completion data for ALL apps
  const [allAppsCompletionData, setAllAppsCompletionData] = useState<{ [key: string]: { completed: number; total: number } }>({});

  // Function to fetch completion data for all apps
  const fetchAllAppsCompletionData = useCallback(async () => {
    try {
      const { data: { user } } = await (await import('../../lib/supabase')).supabase.auth.getUser();
      if (!user) return;

      // Fetch all completed steps for this user across all tools
      const { data, error } = await (await import('../../lib/supabase')).supabase
        .from('user_learning_progress')
        .select('tool_id, step_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      // Group completed steps by tool_id
      const completedStepsByTool: { [key: string]: Set<string> } = {};
      (data || []).forEach(item => {
        if (!completedStepsByTool[item.tool_id]) {
          completedStepsByTool[item.tool_id] = new Set();
        }
        completedStepsByTool[item.tool_id].add(item.step_id);
      });

      // Calculate completion data for all apps
      const completionData: { [key: string]: { completed: number; total: number } } = {};
      
      Object.keys(deploymentPaths).forEach(appId => {
        const path = deploymentPaths[appId];
        const totalStepsForApp = path.sections.reduce((total, section) => total + section.steps.length, 0);
        const completedStepsForApp = completedStepsByTool[appId]?.size || 0;
        
        completionData[appId] = {
          completed: completedStepsForApp,
          total: totalStepsForApp
        };
      });

      setAllAppsCompletionData(completionData);
    } catch (err) {
      console.error('Error fetching all apps completion data:', err);
    }
  }, []);

  // Load completion data for all apps on mount
  useEffect(() => {
    fetchAllAppsCompletionData();
    
    // Listen for progress updates and refresh data
    const handleProgressUpdate = () => {
      fetchAllAppsCompletionData();
    };
    
    window.addEventListener('userProgressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('userProgressUpdated', handleProgressUpdate);
    };
  }, [fetchAllAppsCompletionData]);

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
            Deploy Video Content
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Publish, schedule, and promote your video content
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {checklistCollapsed && (
            <button
              onClick={() => setChecklistCollapsed(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                theme === 'gradient' 
                  ? 'bg-green-600/20 border-green-500 text-green-300 hover:bg-green-600/30' 
                  : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${theme === 'gradient' ? 'bg-green-400' : 'bg-green-500'}`}></div>
                <span className="font-medium">Checklist</span>
              </div>
            </button>
          )}
          <Rocket className={`h-8 w-8 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
        </div>
      </div>

      {/* Mini App Switcher */}
      <MiniAppSwitcher 
        apps={miniApps}
        activeApp={activeApp}
        onAppChange={setActiveApp}
        completionData={allAppsCompletionData}
      />

      <div className={`grid gap-6 ${checklistCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Left Column - Collapsible Checklist */}
        {!checklistCollapsed && (
        <div className="lg:col-span-1">
            <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'} border rounded-lg overflow-hidden`}>
              <button
                onClick={() => setChecklistCollapsed(!checklistCollapsed)}
                className={`w-full px-4 py-3 flex items-center justify-between ${theme === 'gradient' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
              >
                <h3 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Deployment Checklist
                </h3>
                <Minus className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-300'}`} />
              </button>
              <div className="p-4">
           <EnhancedChecklist
                    title=""
             items={checklistItems}
             toolId={activeApp}
           />
        </div>
            </div>
          </div>
        )}

        {/* Right Column - FAQ-Style Deployment Guide and Tabs */}
        <div className={checklistCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
          <div className="space-y-6">
            {/* FAQ-Style Deployment Guide Section */}
            <div className={`${theme === 'gradient' ? 'bg-gray-800/30 border-gray-700' : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                {currentDeploymentPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentDeploymentPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentDeploymentPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                {currentDeploymentPath.sections.map((section, sectionIndex) => {
                  let stepCounter = 0;
                  // Calculate step number offset for this section
                  for (let i = 0; i < sectionIndex; i++) {
                    stepCounter += currentDeploymentPath.sections[i].steps.length;
                  }
                  
                  return (
                    <div key={section.id} className="space-y-3">
                      {/* Section Header */}
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600'} border rounded-lg p-4`}>
                        <div className="flex items-center space-x-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white`}>
                            {sectionIndex + 1}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{section.title}</h3>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{section.description}</p>
                          </div>
                          <div className="ml-auto">
                            <span className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'} px-3 py-1 rounded-full`}>
                              {section.steps.length} steps
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Section Steps */}
                      <div className="space-y-2 ml-4">
                        {section.steps.map((step, stepIndex) => {
                          const isCompleted = isStepCompleted(step.id);
                          const isExpanded = expandedStep === step.id;
                          const globalStepNumber = stepCounter + stepIndex + 1;
                          
                          return (
                            <div key={step.id} className={`${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} border rounded-lg overflow-hidden`}>
                              <button
                                onClick={() => toggleStep(step.id)}
                                className={`w-full p-4 text-left ${theme === 'gradient' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'} transition-colors`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      isCompleted ? 'bg-green-500 text-white' : `${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} text-white`
                                    }`}>
                                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : globalStepNumber}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{step.title}</h4>
                                      <p className={`text-sm mt-1 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{step.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 text-xs">
                                      <span className={`${theme === 'gradient' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                                        {step.estimated_time}
                                      </span>
                                      <span className={`px-2 py-1 rounded ${
                                        step.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                        step.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                      }`}>
                                        {step.difficulty}
                                      </span>
                                    </div>
                                    {isExpanded ? (
                                      <ChevronDown className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                                    ) : (
                                      <ChevronRight className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                                    )}
                                  </div>
                                </div>
                              </button>
                              
                              {isExpanded && (
                                <div className={`px-6 pb-6 ${theme === 'gradient' ? 'bg-gray-800/20' : 'bg-gray-50 dark:bg-gray-800/20'}`}>
                                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                    {step.content}
                                  </div>
                                  <div className="flex justify-end mt-6">
                                    {isCompleted ? (
                                      <button
                                        onClick={() => handleMarkStepIncomplete(step.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center"
                                      >
                                        <Minus className="h-4 w-4 mr-2" />
                                        Mark Incomplete
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleMarkStepComplete(step.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Complete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>

          {/* Progress Bar */}
          <div className={`mt-6 pt-4 ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} border-t`}>
            <div className={`flex items-center justify-between text-sm mb-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
              <span>Progress</span>
              <span>{completedSteps.size}/{totalSteps} steps completed</span>
            </div>
            <div className={`w-full ${theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'} rounded-full h-2`}>
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.size / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

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
    </div>
  );
};

export default VideoDeploy;