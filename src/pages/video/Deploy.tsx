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
                  <div className="border-l-4 border-red-500 pl-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>YouTube SEO Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master YouTube SEO to maximize video discoverability and grow your audience organically.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🔍 Understanding YouTube SEO Basics</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>YouTube SEO involves optimizing your video content, metadata, and engagement signals to rank higher in search results and suggested videos.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Title Optimization</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Include primary keyword early</li>
                            <li>• Keep under 60 characters</li>
                            <li>• Make it compelling &amp; clickable</li>
                            <li>• Use numbers &amp; power words</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Description Strategy</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• First 125 characters are crucial</li>
                            <li>• Include 3-5 relevant keywords</li>
                            <li>• Add timestamps for chapters</li>
                            <li>• Include relevant links</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>🤖 Using AI for SEO Optimization</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Leverage AI tools to supercharge your YouTube SEO strategy:</p>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Title Generator Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Generate 10 YouTube titles for a video about [TOPIC]. Include keywords like [KEYWORDS]. Make them under 60 characters, engaging, and click-worthy. Include numbers or power words where relevant."
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Description Template:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Write a YouTube description for a video about [TOPIC]. Include the main keyword '[KEYWORD]' in the first 125 characters. Add 3-5 related keywords naturally. Include timestamps if provided: [TIMESTAMPS]. Make it informative and engaging."
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Tag Generator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Generate 15 relevant YouTube tags for a video about [TOPIC]. Mix broad and specific tags. Include: [MAIN KEYWORDS]. Format as comma-separated list."
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📋 SEO Optimization Checklist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Before Upload:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Research target keywords</li>
                            <li>□ Analyze competitor titles</li>
                            <li>□ Prepare 3-5 title options</li>
                            <li>□ Write compelling description</li>
                            <li>□ Create tag list (10-15 tags)</li>
                            <li>□ Plan custom thumbnail</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>After Upload:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Add end screens &amp; cards</li>
                            <li>□ Create engaging thumbnail</li>
                            <li>□ Add to relevant playlists</li>
                            <li>□ Pin a comment with key info</li>
                            <li>□ Share on social media</li>
                            <li>□ Monitor performance metrics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>YouTube Monetization Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master YouTube's monetization features to turn your content into sustainable revenue streams.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>💰 Understanding YouTube Monetization</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>YouTube offers multiple ways to monetize your content. Here's what you need to know about each option:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Eligibility Requirements</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 1,000+ subscribers</li>
                            <li>• 4,000+ watch hours (past 12 months)</li>
                            <li>• Follow community guidelines</li>
                            <li>• Live in eligible country</li>
                            <li>• Have AdSense account</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Streams</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Ad revenue (primary)</li>
                            <li>• Channel memberships</li>
                            <li>• Super Chat &amp; Super Thanks</li>
                            <li>• YouTube Shorts Fund</li>
                            <li>• Merchandise shelf</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🤖 AI-Powered Monetization Strategy</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Use AI to optimize your monetization approach and maximize revenue potential:</p>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Revenue Optimization Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Analyze my YouTube channel: [CHANNEL NICHE/TOPIC]. Current stats: [SUBSCRIBERS/VIEWS]. Suggest the best monetization strategy. Which revenue streams should I prioritize? Include specific tactics for my audience."
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Membership Content Ideas:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "I'm starting YouTube channel memberships for [NICHE]. Generate 20 exclusive perks and content ideas that would make viewers want to become members. Include different membership tiers with pricing suggestions."
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Ad Revenue Optimizer:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "My videos average [DURATION] minutes with [AVG VIEWS] views. Current CPM is $[AMOUNT]. Suggest strategies to increase ad revenue: optimal video length, ad placement, content timing, and engagement tactics."
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700 dark:text-yellow-300'}`}>⚙️ Step-by-Step Monetization Setup</h3>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>1. Join YouTube Partner Program</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Go to YouTube Studio → Monetization</li>
                            <li>• Review &amp; accept YPP terms</li>
                            <li>• Connect AdSense account</li>
                            <li>• Wait for review (usually 1 month)</li>
                          </ul>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>2. Configure Ad Settings</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Enable ads on uploaded videos</li>
                            <li>• Choose ad formats (display, overlay, skippable)</li>
                            <li>• Set ad placement preferences</li>
                            <li>• Configure monetization for future uploads</li>
                          </ul>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>3. Set Up Channel Memberships</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Enable memberships in YouTube Studio</li>
                            <li>• Create membership tiers &amp; pricing</li>
                            <li>• Design custom badges &amp; emojis</li>
                            <li>• Plan exclusive member content</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📈 Revenue Tracking &amp; Optimization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics to Monitor:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• RPM (Revenue per Mille)</li>
                            <li>• CPM (Cost per Mille)</li>
                            <li>• Watch time &amp; retention</li>
                            <li>• Click-through rates</li>
                            <li>• Membership conversion rate</li>
                            <li>• Super Chat earnings</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Tips:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Test different video lengths</li>
                            <li>• Experiment with upload timing</li>
                            <li>• Create content around high-CPM topics</li>
                            <li>• Promote memberships in videos</li>
                            <li>• Use end screens for monetization</li>
                            <li>• Engage with Super Chat during live streams</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Promotion &amp; Engagement</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master YouTube's promotional features to increase viewer retention and channel growth.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📺 Understanding YouTube Promotion Tools</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>YouTube provides several built-in tools to help promote your content and keep viewers engaged:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>End Screens (Last 5-20 seconds)</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Promote another video</li>
                            <li>• Encourage subscriptions</li>
                            <li>• Link to playlists</li>
                            <li>• Direct to your channel</li>
                            <li>• Best for: Long-form content</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cards (Anywhere in video)</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Add up to 5 cards per video</li>
                            <li>• Link to related content</li>
                            <li>• Promote fundraisers</li>
                            <li>• Share polls with viewers</li>
                            <li>• Best for: Context-relevant moments</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>🤖 AI-Powered Promotion Strategy</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Use AI to create compelling promotional content and optimize viewer engagement:</p>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI End Screen Script Generator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Create 5 compelling end screen scripts for my YouTube video about [TOPIC]. Each should be 15-20 seconds long, encourage subscriptions, and smoothly transition to promoting my next video about [NEXT TOPIC]. Make them engaging and natural."
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Card Content Optimizer:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Suggest 5 strategic moments in my [DURATION] minute video about [TOPIC] where I should add YouTube cards. For each moment, recommend the type of card (video, playlist, channel) and explain why it would be effective at that timestamp."
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Engagement Hook Creator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Write 10 compelling call-to-action phrases I can use throughout my video to encourage likes, comments, and subscriptions. Make them feel natural and specific to my content about [TOPIC]. Include emotional triggers and specific requests."
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>⚙️ Step-by-Step Setup Guide</h3>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Adding End Screens:</h4>
                          <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Go to YouTube Studio → Content</li>
                            <li>2. Select your video → Editor</li>
                            <li>3. Click "End screen" in the left menu</li>
                            <li>4. Choose elements: Video, Playlist, Subscribe, Channel</li>
                            <li>5. Position &amp; resize elements on screen</li>
                            <li>6. Set duration (5-20 seconds from end)</li>
                            <li>7. Preview &amp; save changes</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Adding Cards:</h4>
                          <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. In YouTube Studio editor, click "Cards"</li>
                            <li>2. Choose card type (Video, Playlist, Channel, Link)</li>
                            <li>3. Select specific content to promote</li>
                            <li>4. Set the timestamp when card appears</li>
                            <li>5. Add teaser text (optional)</li>
                            <li>6. Repeat for up to 5 cards total</li>
                            <li>7. Review card placement &amp; timing</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Tips:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use the subscribe button on every video</li>
                            <li>• Promote your most successful videos</li>
                            <li>• Time cards for natural breaks in content</li>
                            <li>• Test different end screen layouts</li>
                            <li>• Update promoted content regularly</li>
                            <li>• Mention your promotions verbally in video</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-700 dark:text-orange-300'}`}>📊 Promotion Performance Tracking</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics to Monitor:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• End screen click-through rate</li>
                            <li>• Card click rate &amp; impressions</li>
                            <li>• Subscriber conversion from videos</li>
                            <li>• Session duration increase</li>
                            <li>• Playlist additions</li>
                            <li>• Cross-video engagement</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• A/B test different end screen layouts</li>
                            <li>• Use compelling thumbnails for promoted videos</li>
                            <li>• Keep promoted content relevant &amp; recent</li>
                            <li>• Verbally reference your promotions</li>
                            <li>• Update promotional content monthly</li>
                            <li>• Focus on your best-performing videos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
      icon: <Film className="h-5 w-5" />,
      description: 'Deploy and optimize your videos for professional Vimeo hosting',
      sections: [
        {
          id: 'vimeo-upload',
          title: '🎬 Vimeo Pro Upload Process',
          description: 'Upload and configure your video on Vimeo Pro',
          steps: [
            {
              id: 'video-deploy-vimeo-step-1',
              title: 'Professional Upload Setup',
              description: 'Configure and upload your video to Vimeo Pro',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vimeo Pro Upload Process</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master Vimeo Pro's professional upload workflow and advanced configuration options.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Upload className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Upload Options</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Direct file upload (up to 16GB)</li>
                        <li>• Pull from cloud storage</li>
                        <li>• FTP for large files</li>
                        <li>• Batch upload tool</li>
                        <li>• API integration options</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Pro Features</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• 4K/HDR support</li>
                        <li>• Custom encoding settings</li>
                        <li>• Replace video feature</li>
                        <li>• Team collaboration tools</li>
                        <li>• Review &amp; approval workflow</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🎯 Upload Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pre-Upload Checklist:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>□ Verify video specs match requirements</li>
                          <li>□ Check file size limitations</li>
                          <li>□ Prepare metadata and descriptions</li>
                          <li>□ Set up folder structure</li>
                          <li>□ Configure team access permissions</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Upload Settings:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>□ Choose optimal quality preset</li>
                          <li>□ Set privacy controls</li>
                          <li>□ Enable collaboration features</li>
                          <li>□ Configure download permissions</li>
                          <li>□ Set up review workflow</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-deploy-vimeo-step-2',
              title: 'Professional Customization',
              description: 'Customize player and privacy settings',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Professional Video Customization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Leverage Vimeo Pro's advanced customization features for a professional viewing experience.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>🎨 Player Customization</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Branding Options</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Custom player colors</li>
                            <li>• Logo watermark</li>
                            <li>• End screen customization</li>
                            <li>• Custom thumbnails</li>
                            <li>• Outro card design</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Interactive Features</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Call-to-action buttons</li>
                            <li>• Email capture forms</li>
                            <li>• Clickable hotspots</li>
                            <li>• Chapter markers</li>
                            <li>• Custom playlists</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🔒 Privacy & Access Control</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Privacy Settings</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Password protection</li>
                            <li>• Domain-level privacy</li>
                            <li>• Private team sharing</li>
                            <li>• Single-sign-on (SSO)</li>
                            <li>• IP address restrictions</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Access Controls</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Team permissions</li>
                            <li>• Viewer analytics</li>
                            <li>• Download restrictions</li>
                            <li>• Embed controls</li>
                            <li>• Geographic restrictions</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📋 Customization Checklist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Player Setup:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Set brand colors</li>
                            <li>□ Upload custom logo</li>
                            <li>□ Configure end screens</li>
                            <li>□ Add interactive elements</li>
                            <li>□ Set up chapters</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Privacy Setup:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Configure privacy settings</li>
                            <li>□ Set up team access</li>
                            <li>□ Define embed permissions</li>
                            <li>□ Enable download controls</li>
                            <li>□ Set up review workflow</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'vimeo-analytics',
          title: '📊 Analytics & Performance',
          description: 'Track and analyze video performance',
          steps: [
            {
              id: 'video-deploy-vimeo-step-3',
              title: 'Advanced Analytics Setup',
              description: 'Configure and monitor video analytics',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vimeo Analytics &amp; Insights</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master Vimeo Pro's advanced analytics tools to track performance and viewer engagement.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📊 Key Performance Metrics</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Engagement Metrics</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Watch time</li>
                            <li>• Engagement rate</li>
                            <li>• Drop-off points</li>
                            <li>• Interactive clicks</li>
                            <li>• Viewer feedback</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Technical Metrics</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Loading time</li>
                            <li>• Buffer rate</li>
                            <li>• Quality switches</li>
                            <li>• Error rates</li>
                            <li>• Bandwidth usage</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>📈 Performance Tracking</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Audience Insights</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Geographic data</li>
                            <li>• Device breakdown</li>
                            <li>• Viewer demographics</li>
                            <li>• Traffic sources</li>
                            <li>• Viewing patterns</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Reports</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Performance summaries</li>
                            <li>• Engagement reports</li>
                            <li>• Team analytics</li>
                            <li>• ROI tracking</li>
                            <li>• Custom dashboards</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>📋 Analytics Setup Checklist</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Initial Setup:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Enable advanced analytics</li>
                            <li>□ Set up custom tracking</li>
                            <li>□ Configure team access</li>
                            <li>□ Set performance goals</li>
                            <li>□ Create baseline metrics</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Plan:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Schedule regular reviews</li>
                            <li>□ Set up automated reports</li>
                            <li>□ Configure alerts</li>
                            <li>□ Track key benchmarks</li>
                            <li>□ Plan optimization strategy</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-l-4 border-indigo-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Professional Video Distribution</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master Vimeo Pro's embedding options and showcase features for professional video distribution.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Globe className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Embedding Options</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Customize player appearance</li>
                        <li>• Set responsive sizing</li>
                        <li>• Configure autoplay settings</li>
                        <li>• Enable/disable controls</li>
                        <li>• Add interactive elements</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Film className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Showcase Features</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Create branded showcases</li>
                        <li>• Organize video collections</li>
                        <li>• Customize showcase layout</li>
                        <li>• Set access permissions</li>
                        <li>• Enable team collaboration</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🔧 Embedding Configuration Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Basic Embedding:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Navigate to video settings</li>
                          <li>2. Click "Embed" button</li>
                          <li>3. Choose player size/responsiveness</li>
                          <li>4. Configure player controls</li>
                          <li>5. Set privacy options</li>
                          <li>6. Copy embed code</li>
                          <li>7. Test on target platform</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Options:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Enable interactive elements</li>
                          <li>2. Set custom start time</li>
                          <li>3. Configure loop behavior</li>
                          <li>4. Add call-to-action buttons</li>
                          <li>5. Enable API access</li>
                          <li>6. Set domain restrictions</li>
                          <li>7. Configure tracking options</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>🎨 Showcase Creation Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Setting Up Showcases:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Create new showcase</li>
                          <li>2. Choose layout template</li>
                          <li>3. Add videos to showcase</li>
                          <li>4. Arrange video order</li>
                          <li>5. Customize appearance</li>
                          <li>6. Set privacy settings</li>
                          <li>7. Share with team/clients</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Showcase Best Practices:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Group related content together</li>
                          <li>• Use clear showcase titles</li>
                          <li>• Add showcase descriptions</li>
                          <li>• Maintain consistent branding</li>
                          <li>• Update content regularly</li>
                          <li>• Monitor showcase analytics</li>
                          <li>• Optimize for target audience</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>💡 Pro Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Embedding Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use responsive embedding</li>
                          <li>• Test on multiple devices</li>
                          <li>• Enable speed optimization</li>
                          <li>• Consider autoplay settings</li>
                          <li>• Implement lazy loading</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Showcase Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Create themed collections</li>
                          <li>• Use custom thumbnails</li>
                          <li>• Add chapter markers</li>
                          <li>• Enable team reviews</li>
                          <li>• Track engagement metrics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform-Specific Content Adaptation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of adapting your video content for each platform's unique format, audience, and algorithm requirements.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-pink-500/30' : 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-pink-300' : 'text-pink-700 dark:text-pink-300'}`}>📱 Understanding Platform Differences</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Each social media platform has unique characteristics that require specific content adaptations:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Instagram - Visual Storytelling</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• High-quality visuals are essential</li>
                            <li>• Strong first 3 seconds for Reels</li>
                            <li>• Use trending audio &amp; effects</li>
                            <li>• Aesthetic consistency matters</li>
                            <li>• Stories for behind-the-scenes content</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>TikTok - Entertainment First</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Hook viewers in first 2 seconds</li>
                            <li>• Fast-paced, engaging content</li>
                            <li>• Follow trending challenges</li>
                            <li>• Authentic, less polished feel</li>
                            <li>• Vertical format is mandatory</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Facebook - Community Focus</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Longer-form content performs well</li>
                            <li>• Encourage meaningful conversations</li>
                            <li>• Share personal stories &amp; insights</li>
                            <li>• Use Facebook Groups for niche content</li>
                            <li>• Live videos get priority in feed</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>LinkedIn - Professional Value</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Educational &amp; professional content</li>
                            <li>• Industry insights &amp; expertise</li>
                            <li>• Professional tone &amp; presentation</li>
                            <li>• Career development focus</li>
                            <li>• B2B networking opportunities</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>🤖 AI-Powered Content Adaptation</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Leverage AI to efficiently adapt your content for multiple platforms:</p>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Multi-Platform Caption Generator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Take my video about [TOPIC] and create platform-optimized captions for Instagram (engaging with hashtags), TikTok (trendy &amp; fun), Facebook (conversational &amp; detailed), and LinkedIn (professional &amp; value-driven). Original caption: '[YOUR CAPTION]'"
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Format Adaptation Guide:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "My video is [CURRENT FORMAT] and [DURATION] long about [TOPIC]. Help me adapt it for different platforms: suggest cuts for TikTok (under 60s), Instagram Reels format, Facebook highlights, and LinkedIn key points. Include timing recommendations."
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Hook &amp; Opener Creator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Create platform-specific video hooks for my content about [TOPIC]. Instagram: visually compelling first 3 seconds. TikTok: trend-following opener. Facebook: story-driven start. LinkedIn: value-proposition hook. Make each unique and engaging."
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>⚙️ Step-by-Step Setup Guide</h3>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Adding End Screens:</h4>
                          <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Go to YouTube Studio → Content</li>
                            <li>2. Select your video → Editor</li>
                            <li>3. Click "End screen" in the left menu</li>
                            <li>4. Choose elements: Video, Playlist, Subscribe, Channel</li>
                            <li>5. Position &amp; resize elements on screen</li>
                            <li>6. Set duration (5-20 seconds from end)</li>
                            <li>7. Preview &amp; save changes</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Adding Cards:</h4>
                          <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. In YouTube Studio editor, click "Cards"</li>
                            <li>2. Choose card type (Video, Playlist, Channel, Link)</li>
                            <li>3. Select specific content to promote</li>
                            <li>4. Set the timestamp when card appears</li>
                            <li>5. Add teaser text (optional)</li>
                            <li>6. Repeat for up to 5 cards total</li>
                            <li>7. Review card placement &amp; timing</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Tips:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use the subscribe button on every video</li>
                            <li>• Promote your most successful videos</li>
                            <li>• Time cards for natural breaks in content</li>
                            <li>• Test different end screen layouts</li>
                            <li>• Update promoted content regularly</li>
                            <li>• Mention your promotions verbally in video</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/30' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-700 dark:text-orange-300'}`}>📊 Promotion Performance Tracking</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics to Monitor:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• End screen click-through rate</li>
                            <li>• Card click rate &amp; impressions</li>
                            <li>• Subscriber conversion from videos</li>
                            <li>• Session duration increase</li>
                            <li>• Playlist additions</li>
                            <li>• Cross-video engagement</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• A/B test different end screen layouts</li>
                            <li>• Use compelling thumbnails for promoted videos</li>
                            <li>• Keep promoted content relevant &amp; recent</li>
                            <li>• Verbally reference your promotions</li>
                            <li>• Update promotional content monthly</li>
                            <li>• Focus on your best-performing videos</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-deploy-social-step-3',
              title: 'Multi-Platform Publishing',
              description: 'Set up coordinated publishing across all social platforms',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cross-Platform Publishing Strategy</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of coordinated social media publishing to maximize your video's reach and engagement across platforms.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Scheduling Tools</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Buffer for basic scheduling</li>
                        <li>• Hootsuite for team collaboration</li>
                        <li>• Later for visual planning</li>
                        <li>• SproutSocial for analytics</li>
                        <li>• Meta Business Suite for FB/IG</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Globe className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Platform Timing</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Instagram: 11 AM - 3 PM</li>
                        <li>• TikTok: 7 PM - 9 PM</li>
                        <li>• Facebook: 1 PM - 4 PM</li>
                        <li>• LinkedIn: 10 AM - 12 PM</li>
                        <li>• Best days: Tue-Thu</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🔄 Publishing Workflow</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pre-Publishing Checklist:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Verify video formats for each platform</li>
                          <li>2. Prepare platform-specific captions</li>
                          <li>3. Research optimal hashtags</li>
                          <li>4. Create engaging thumbnails</li>
                          <li>5. Set up cross-platform tracking</li>
                          <li>6. Schedule posts in content calendar</li>
                          <li>7. Prepare engagement responses</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Post-Publishing Tasks:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Monitor initial engagement</li>
                          <li>2. Respond to early comments</li>
                          <li>3. Share across owned channels</li>
                          <li>4. Track cross-platform performance</li>
                          <li>5. Adjust timing for future posts</li>
                          <li>6. Document successful strategies</li>
                          <li>7. Plan follow-up content</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📊 Cross-Platform Analytics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Views per platform</li>
                          <li>• Engagement rates</li>
                          <li>• Audience retention</li>
                          <li>• Click-through rates</li>
                          <li>• Share/save ratios</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Tracking:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use platform analytics</li>
                          <li>• Track cross-posting impact</li>
                          <li>• Monitor audience overlap</li>
                          <li>• Compare platform performance</li>
                          <li>• Measure ROI per platform</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>💡 Pro Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Scheduling Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Stagger post timing</li>
                          <li>• Test different time slots</li>
                          <li>• Use platform insights</li>
                          <li>• Consider time zones</li>
                          <li>• Plan content series</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Engagement Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cross-promote content</li>
                          <li>• Use platform features</li>
                          <li>• Engage in first hour</li>
                          <li>• Create platform-specific CTAs</li>
                          <li>• Build community interaction</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>LMS Integration Setup</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the process of integrating your video content with major Learning Management Systems.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Globe className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Platform Support</h3>
                    </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Canvas LMS integration</li>
                        <li>• Moodle compatibility</li>
                        <li>• Blackboard embedding</li>
                        <li>• D2L/Brightspace support</li>
                        <li>• Google Classroom setup</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Integration Features</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Single sign-on (SSO)</li>
                        <li>• Grade passback</li>
                        <li>• Analytics tracking</li>
                        <li>• Content sequencing</li>
                        <li>• Student progress sync</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🔧 Platform Setup Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Initial Setup:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Choose LMS platform</li>
                          <li>2. Configure API access</li>
                          <li>3. Set up authentication</li>
                          <li>4. Test connection</li>
                          <li>5. Configure default settings</li>
                          <li>6. Set up user roles</li>
                          <li>7. Test permissions</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Integration Testing:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Upload test video</li>
                          <li>2. Verify playback</li>
                          <li>3. Test student view</li>
                          <li>4. Check analytics</li>
                          <li>5. Test grade sync</li>
                          <li>6. Verify accessibility</li>
                          <li>7. Document settings</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'course-step-2',
              title: 'Content Organization',
              description: 'Structure and organize course content',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Course Content Organization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create an effective learning structure by organizing your video content into modules and lessons.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Content Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Module organization</li>
                        <li>• Lesson sequencing</li>
                        <li>• Learning objectives</li>
                        <li>• Resource linking</li>
                        <li>• Progress tracking</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Release Schedule</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Module availability</li>
                        <li>• Prerequisite setup</li>
                        <li>• Due date planning</li>
                        <li>• Access controls</li>
                        <li>• Automated releases</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📚 Content Planning Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Module Structure:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Define learning outcomes</li>
                          <li>2. Create module outline</li>
                          <li>3. Organize video content</li>
                          <li>4. Add supplementary materials</li>
                          <li>5. Set up assessments</li>
                          <li>6. Configure prerequisites</li>
                          <li>7. Review module flow</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Optimization:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Break content into digestible chunks</li>
                          <li>• Include practice activities</li>
                          <li>• Add knowledge checks</li>
                          <li>• Provide resource links</li>
                          <li>• Create discussion prompts</li>
                          <li>• Include reflection exercises</li>
                          <li>• Add progress markers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
        },
            {
              id: 'course-step-3',
              title: 'Assessment Integration',
              description: 'Set up quizzes and assessments',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Assessment & Evaluation Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create effective assessment strategies to measure learning outcomes and student progress.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Assessment Types</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Knowledge checks</li>
                        <li>• Video quizzes</li>
                        <li>• Module tests</li>
                        <li>• Practice exercises</li>
                        <li>• Final assessments</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Grading Setup</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Grade schemes</li>
                        <li>• Rubric creation</li>
                        <li>• Feedback options</li>
                        <li>• Auto-grading rules</li>
                        <li>• Grade sync settings</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>📝 Assessment Creation Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Quiz Setup:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Choose question types</li>
                          <li>2. Set time limits</li>
                          <li>3. Configure attempts</li>
                          <li>4. Set passing score</li>
                          <li>5. Add feedback rules</li>
                          <li>6. Enable review options</li>
                          <li>7. Test assessment flow</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Align with learning objectives</li>
                          <li>• Vary question types</li>
                          <li>• Provide clear instructions</li>
                          <li>• Include practice tests</li>
                          <li>• Use meaningful feedback</li>
                          <li>• Enable progress tracking</li>
                          <li>• Monitor completion rates</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>💡 Pro Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Assessment Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use varied formats</li>
                          <li>• Include self-checks</li>
                          <li>• Add reflection points</li>
                          <li>• Enable retakes</li>
                          <li>• Track analytics</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Feedback Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Provide instant feedback</li>
                          <li>• Include explanations</li>
                          <li>• Link to resources</li>
                          <li>• Use encouraging tone</li>
                          <li>• Offer improvement paths</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
      icon: <Calendar className="h-5 w-5" />,
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
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Calendar Management</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of content calendar planning and automated scheduling for maximum impact.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Calendar Essentials</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Content themes & series</li>
                        <li>• Release frequency</li>
                        <li>• Platform scheduling</li>
                        <li>• Time zone planning</li>
                        <li>• Holiday calendars</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Globe className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Global Considerations</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Audience time zones</li>
                        <li>• Regional events</li>
                        <li>• Cultural calendars</li>
                        <li>• Market-specific timing</li>
                        <li>• International holidays</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>📋 Calendar Setup Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Initial Setup:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Choose calendar platform</li>
                          <li>2. Set up content categories</li>
                          <li>3. Define time slots</li>
                          <li>4. Create content series</li>
                          <li>5. Add key dates/events</li>
                          <li>6. Set up reminders</li>
                          <li>7. Configure sharing</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Color code content types</li>
                          <li>• Use consistent naming</li>
                          <li>• Include buffer time</li>
                          <li>• Plan content series</li>
                          <li>• Track performance data</li>
                          <li>• Regular calendar review</li>
                          <li>• Backup scheduling plans</li>
                        </ul>
                      </div>
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
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Multi-Platform Coordination</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Synchronize your video releases across multiple platforms for maximum reach and engagement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Globe className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Platform Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Platform-specific timing</li>
                        <li>• Audience overlap</li>
                        <li>• Content adaptation</li>
                        <li>• Cross-promotion</li>
                        <li>• Performance tracking</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Coordination Tools</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Scheduling platforms</li>
                        <li>• API integrations</li>
                        <li>• Automation tools</li>
                        <li>• Analytics tracking</li>
                        <li>• Backup systems</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>🔄 Coordination Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Setup:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Analyze platform metrics</li>
                          <li>2. Map audience overlap</li>
                          <li>3. Create timing strategy</li>
                          <li>4. Set up cross-promotion</li>
                          <li>5. Configure analytics</li>
                          <li>6. Test coordination</li>
                          <li>7. Monitor performance</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Stagger release times</li>
                          <li>• Use platform insights</li>
                          <li>• Monitor engagement patterns</li>
                          <li>• Adjust timing based on data</li>
                          <li>• Test different schedules</li>
                          <li>• Track cross-platform metrics</li>
                          <li>• Regular performance review</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
        },
            {
              id: 'schedule-step-3',
              title: 'Publishing Automation Setup',
              description: 'Configure automated publishing tools and backup systems',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automation & Backup Systems</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up robust automation systems with monitoring and backup publishing capabilities.
                  </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Automation Setup</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Publishing tools</li>
                        <li>• API configuration</li>
                        <li>• Error handling</li>
                        <li>• Monitoring systems</li>
                        <li>• Performance tracking</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Backup Systems</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Manual fallbacks</li>
                        <li>• Error notifications</li>
                        <li>• Recovery procedures</li>
                        <li>• System redundancy</li>
                        <li>• Emergency protocols</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>⚙️ System Setup Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automation Setup:</h4>
                        <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Choose automation tools</li>
                          <li>2. Configure API access</li>
                          <li>3. Set up error handling</li>
                          <li>4. Create monitoring system</li>
                          <li>5. Test automation flow</li>
                          <li>6. Set up notifications</li>
                          <li>7. Document procedures</li>
                        </ol>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Backup Procedures:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Regular system checks</li>
                          <li>• Backup publishing methods</li>
                          <li>• Error recovery steps</li>
                          <li>• Emergency contacts</li>
                          <li>• System maintenance</li>
                          <li>• Performance monitoring</li>
                          <li>• Regular testing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>💡 Pro Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automation Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Start with simple flows</li>
                          <li>• Test thoroughly</li>
                          <li>• Monitor consistently</li>
                          <li>• Document everything</li>
                          <li>• Regular updates</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Backup Tips:</h4>
                        <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Multiple backup methods</li>
                          <li>• Regular testing</li>
                          <li>• Clear procedures</li>
                          <li>• Team training</li>
                          <li>• Emergency contacts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Conversion Tracking &amp; Goal Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master conversion tracking to measure your video content's impact on business goals and ROI.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🎯 Understanding Conversion Goals</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Conversion goals help you measure how effectively your videos drive specific actions:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Primary Conversions</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Purchases &amp; sales</li>
                            <li>• Email signups</li>
                            <li>• Course enrollments</li>
                            <li>• App downloads</li>
                            <li>• Service bookings</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Engagement Conversions</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Subscription clicks</li>
                            <li>• Social follows</li>
                            <li>• Video completions</li>
                            <li>• Link clicks</li>
                            <li>• Contact form submissions</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-500/30' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>🤖 AI-Powered Goal Strategy</h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Use AI to optimize your conversion tracking strategy:</p>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Goal Definition Assistant:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "I create [TYPE OF CONTENT] videos for [AUDIENCE]. My business goal is [BUSINESS OBJECTIVE]. Help me define 5 specific conversion goals to track, including primary conversions (sales/signups) and micro-conversions (engagement). Include suggested tracking methods for each."
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Funnel Analysis Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Map out a video marketing funnel for my [NICHE] business. Starting from video view to final conversion: [END GOAL]. Identify 7 key stages and what metrics to track at each stage. Include specific conversion events and their typical rates."
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-600 dark:text-yellow-400'}`}>AI Attribution Model Guide:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-900/50 text-gray-300' : 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300'} text-sm p-3 rounded font-mono`}>
                            "Explain attribution models for my video marketing campaigns. I post on YouTube, Instagram, TikTok, and have email marketing. Customer journey usually takes [TIME PERIOD]. Recommend the best attribution model and explain how to set it up in Google Analytics."
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700 dark:text-yellow-300'}`}>⚙️ Technical Setup Guide</h3>
                      
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google Analytics 4 Setup:</h4>
                          <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Create GA4 property if not existing</li>
                            <li>2. Install GA4 tracking code on website</li>
                            <li>3. Set up Enhanced Ecommerce (if applicable)</li>
                            <li>4. Configure custom events for video interactions</li>
                            <li>5. Link YouTube Analytics to GA4</li>
                            <li>6. Set up conversion events</li>
                            <li>7. Configure attribution settings</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Facebook Pixel &amp; Conversions API:</h4>
                          <ol className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Install Facebook Pixel on website</li>
                            <li>2. Set up Conversions API for iOS 14.5+ tracking</li>
                            <li>3. Create custom conversions for video-driven actions</li>
                            <li>4. Set up video engagement custom audiences</li>
                            <li>5. Configure offline conversion imports</li>
                            <li>6. Test pixel firing with Facebook Pixel Helper</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>UTM Parameter Strategy:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Source: youtube, instagram, tiktok, facebook</li>
                            <li>• Medium: video, social, organic</li>
                            <li>• Campaign: video_title_date</li>
                            <li>• Content: specific_video_id</li>
                            <li>• Term: target_keyword (if applicable)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>📊 Advanced Tracking &amp; Optimization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics to Track:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Cost per acquisition (CPA)</li>
                            <li>• Customer lifetime value (CLV)</li>
                            <li>• Return on ad spend (ROAS)</li>
                            <li>• Video-to-conversion time</li>
                            <li>• Multi-touch attribution paths</li>
                            <li>• Assisted conversions</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Strategies:</h4>
                          <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• A/B test call-to-action placement</li>
                            <li>• Optimize video length based on conversion data</li>
                            <li>• Test different landing pages</li>
                            <li>• Analyze conversion paths by platform</li>
                            <li>• Set up automated alerts for goal completions</li>
                            <li>• Create custom audiences for retargeting</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Revenue Features</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube Partner Program</li>
                        <li>• Channel Memberships</li>
                        <li>• Super Chat &amp; Super Thanks</li>
                        <li>• Merchandise Shelf</li>
                        <li>• BrandConnect Sponsorships</li>
                        <li>• Course Platform Integration</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Setup Requirements</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• 1000+ subscribers</li>
                        <li>• 4000+ watch hours</li>
                        <li>• AdSense account</li>
                        <li>• Content compliance</li>
                        <li>• Tax information</li>
                        <li>• Payment method</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700 dark:text-yellow-300'}`}>Quick Start Checklist</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Enable monetization</strong> - Apply for YouTube Partner Program
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Configure ad settings</strong> - Set up ad placements and formats
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Set up memberships</strong> - Create member perks and tiers
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Connect payment systems</strong> - Link AdSense and payment methods
                        </p>
                      </div>
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
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Payment Integration</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up and integrate payment systems for all revenue streams with proper tracking and reporting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Payment Processors</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• AdSense Integration</li>
                        <li>• Stripe Connect</li>
                        <li>• PayPal Business</li>
                        <li>• Bank Account Setup</li>
                        <li>• Tax Forms (W-9/W-8BEN)</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Tracking</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Analytics Dashboard</li>
                        <li>• Revenue Reports</li>
                        <li>• Performance Metrics</li>
                        <li>• Payment History</li>
                        <li>• Tax Documentation</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>Integration Steps</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Account Setup</strong> - Create and verify payment processor accounts
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>API Integration</strong> - Connect payment APIs to your platforms
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Testing</strong> - Verify payment processing and tracking
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Monitoring</strong> - Set up alerts and reporting systems
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement data-driven strategies to maximize revenue across all monetization channels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Revenue per View (RPV)</li>
                        <li>• Cost per Mile (CPM)</li>
                        <li>• Click-Through Rate (CTR)</li>
                        <li>• Member Retention Rate</li>
                        <li>• Conversion Rate</li>
                        <li>• Lifetime Value (LTV)</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Strategies</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• A/B Testing</li>
                        <li>• Content Optimization</li>
                        <li>• Pricing Strategy</li>
                        <li>• Audience Targeting</li>
                        <li>• Engagement Analysis</li>
                        <li>• Performance Tracking</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>Optimization Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Data Collection</strong> - Gather performance metrics across all channels
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Analysis</strong> - Identify trends and opportunities
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Implementation</strong> - Apply optimization strategies
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Monitoring</strong> - Track results and iterate
                        </p>
                      </div>
                    </div>
                  </div>
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