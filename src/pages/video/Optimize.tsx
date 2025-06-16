import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Settings, 
  BarChart2, 
  TrendingUp, 
  Eye, 
  Search,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Minus,
  Plus,
  BarChart3,
  BookOpen,
  Share2,
  DollarSign,
  Clock,
  Users,
  PlayCircle,
  Upload,
  Target,
  MessageSquare,
  Image,
  Hash,
  Zap,
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

interface OptimizationPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const VideoOptimize: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('analytics');
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
    { id: 'analytics', name: 'Performance', icon: '📊' },
    { id: 'seo', name: 'SEO Boost', icon: '🔍' },
    { id: 'engagement', name: 'Engagement', icon: '👁️' },
    { id: 'thumbnails', name: 'Thumbnails', icon: '🖼️' },
    { id: 'titles', name: 'Metadata', icon: '🏷️' },
    { id: 'monetization', name: 'Revenue', icon: '💰' },
    { id: 'audience', name: 'Retention', icon: '👥' }
  ];

  // State to store completion data for ALL apps
  const [allAppsCompletionData, setAllAppsCompletionData] = useState<{ [key: string]: { completed: number; total: number } }>({});

  // Dynamic checklist based on active app
  const getChecklistForApp = (appId: string) => {
    const checklistMap: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
      analytics: [
        { id: 'setup-analytics', title: 'Set up YouTube Analytics tracking', description: 'Configure comprehensive performance monitoring', completed: false },
        { id: 'connect-ga', title: 'Connect Google Analytics', description: 'Link external analytics for deeper insights', completed: false },
        { id: 'configure-dashboards', title: 'Configure custom dashboards', description: 'Set up visual analytics dashboards', completed: false },
        { id: 'analyze-retention', title: 'Analyze retention graphs', description: 'Study viewer drop-off patterns', completed: false },
        { id: 'identify-dropoffs', title: 'Identify drop-off points', description: 'Find specific moments viewers leave', completed: false },
        { id: 'monitor-engagement', title: 'Monitor engagement metrics', description: 'Track likes, comments, and shares', completed: false },
        { id: 'track-ctr', title: 'Track click-through rates', description: 'Monitor thumbnail and title effectiveness', completed: false },
        { id: 'review-demographics', title: 'Review audience demographics', description: 'Understand your viewer demographics', completed: false }
      ],
      seo: [
        { id: 'research-keywords', title: 'Research target keywords', description: 'Find high-impact search terms', completed: false },
        { id: 'analyze-competitors', title: 'Analyze competitor keywords', description: 'Study successful competitor strategies', completed: false },
        { id: 'optimize-titles', title: 'Optimize video titles', description: 'Create SEO-friendly, engaging titles', completed: false },
        { id: 'write-descriptions', title: 'Write SEO descriptions', description: 'Craft detailed, keyword-rich descriptions', completed: false },
        { id: 'add-tags', title: 'Add relevant tags', description: 'Include strategic, searchable tags', completed: false },
        { id: 'create-thumbnails', title: 'Create custom thumbnails', description: 'Design eye-catching preview images', completed: false },
        { id: 'use-trending', title: 'Use trending topics', description: 'Incorporate popular search trends', completed: false },
        { id: 'monitor-rankings', title: 'Monitor search rankings', description: 'Track video position in search results', completed: false }
      ],
      engagement: [
        { id: 'create-hooks', title: 'Create compelling hooks', description: 'Design attention-grabbing openings', completed: false },
        { id: 'add-interrupts', title: 'Add pattern interrupts', description: 'Keep viewers engaged throughout video', completed: false },
        { id: 'use-previews', title: 'Use preview techniques', description: 'Tease upcoming content to maintain interest', completed: false },
        { id: 'include-ctas', title: 'Include call-to-actions', description: 'Guide viewers to take desired actions', completed: false },
        { id: 'add-interactive', title: 'Add interactive elements', description: 'Include polls, cards, and end screens', completed: false },
        { id: 'optimize-pacing', title: 'Optimize pacing', description: 'Balance content speed for engagement', completed: false },
        { id: 'create-curiosity', title: 'Create curiosity gaps', description: 'Build anticipation for answers', completed: false },
        { id: 'monitor-engagement', title: 'Monitor engagement rate', description: 'Track overall viewer interaction', completed: false }
      ],
      thumbnails: [
        { id: 'design-contrast', title: 'Design high-contrast thumbnails', description: 'Use bold colors that stand out', completed: false },
        { id: 'use-expressions', title: 'Use clear facial expressions', description: 'Show engaging emotional reactions', completed: false },
        { id: 'add-text', title: 'Add readable text overlay', description: 'Include clear, bold text elements', completed: false },
        { id: 'test-variations', title: 'Test A/B variations', description: 'Compare different thumbnail designs', completed: false },
        { id: 'maintain-consistency', title: 'Maintain brand consistency', description: 'Keep visual style aligned with brand', completed: false },
        { id: 'apply-psychology', title: 'Apply psychology principles', description: 'Use color and composition psychology', completed: false },
        { id: 'create-curiosity', title: 'Create curiosity gaps', description: 'Make viewers want to click to learn more', completed: false },
        { id: 'optimize-mobile', title: 'Optimize for mobile viewing', description: 'Ensure thumbnails work on small screens', completed: false }
      ],
      titles: [
        { id: 'research-keywords', title: 'Research keyword placement', description: 'Find optimal keyword positioning', completed: false },
        { id: 'use-emotional', title: 'Use emotional triggers', description: 'Include words that evoke emotions', completed: false },
        { id: 'add-power-words', title: 'Add power words', description: 'Use compelling, action-oriented language', completed: false },
        { id: 'optimize-length', title: 'Optimize title length', description: 'Balance completeness with readability', completed: false },
        { id: 'write-descriptions', title: 'Write detailed descriptions', description: 'Create comprehensive content summaries', completed: false },
        { id: 'add-timestamps', title: 'Add timestamp chapters', description: 'Help viewers navigate content', completed: false },
        { id: 'include-tags', title: 'Include strategic tags', description: 'Add relevant, searchable tags', completed: false },
        { id: 'create-ctas', title: 'Create compelling CTAs', description: 'Guide viewers to take action', completed: false }
      ],
      monetization: [
        { id: 'enable-monetization', title: 'Enable YouTube monetization', description: 'Set up ad revenue sharing', completed: false },
        { id: 'setup-memberships', title: 'Set up channel memberships', description: 'Create subscription tiers for fans', completed: false },
        { id: 'connect-sponsors', title: 'Connect sponsor platforms', description: 'Join sponsorship marketplaces', completed: false },
        { id: 'create-merchandise', title: 'Create merchandise store', description: 'Set up branded product sales', completed: false },
        { id: 'add-affiliate', title: 'Add affiliate links', description: 'Include revenue-generating links', completed: false },
        { id: 'implement-superthanks', title: 'Implement Super Thanks', description: 'Enable viewer tip features', completed: false },
        { id: 'track-revenue', title: 'Track revenue metrics', description: 'Monitor all income streams', completed: false },
        { id: 'optimize-ads', title: 'Optimize ad placements', description: 'Balance ads with user experience', completed: false }
      ],
      audience: [
        { id: 'analyze-retention', title: 'Analyze retention graphs', description: 'Study viewer watch patterns', completed: false },
        { id: 'identify-dropoffs', title: 'Identify drop-off points', description: 'Find where viewers stop watching', completed: false },
        { id: 'restructure-content', title: 'Restructure content flow', description: 'Reorganize for better retention', completed: false },
        { id: 'adjust-pacing', title: 'Adjust video pacing', description: 'Optimize content speed and rhythm', completed: false },
        { id: 'add-hooks', title: 'Add re-engagement hooks', description: 'Create moments to recapture attention', completed: false },
        { id: 'create-interactive', title: 'Create interactive elements', description: 'Add viewer participation opportunities', completed: false },
        { id: 'monitor-flow', title: 'Monitor audience flow', description: 'Track viewer journey patterns', completed: false },
        { id: 'implement-previews', title: 'Implement preview techniques', description: 'Tease upcoming content sections', completed: false }
      ]
    };
    return checklistMap[appId] || checklistMap.analytics;
  };

  const checklistItems = getChecklistForApp(activeApp);

  const optimizationPaths: { [key: string]: OptimizationPath } = {
    analytics: {
      id: 'analytics',
      title: 'Step-by-Step Performance Analysis',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Analyze and improve video performance metrics',
      sections: [
        {
          id: 'performance-metrics',
          title: '📊 Performance Analysis',
          description: 'Analyze key video performance indicators',
          steps: [
            {
              id: 'video-optimize-analytics-step-1',
              title: 'Analytics Dashboard Setup',
              description: 'Set up comprehensive performance tracking',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Analytics</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up comprehensive analytics to track and optimize your video performance across all platforms.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Key Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• View count & impressions</li>
                        <li>• Watch time & retention</li>
                        <li>• Click-through rate (CTR)</li>
                        <li>• Engagement rate</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Analytics Tools</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube Analytics</li>
                        <li>• Google Analytics</li>
                        <li>• Third-party tools</li>
                        <li>• Custom dashboards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-analytics-step-2',
              title: 'Data Interpretation',
              description: 'Learn to interpret and act on analytics data',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Data-Driven Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Transform raw analytics data into actionable insights for video improvement.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    seo: {
      id: 'seo',
      title: 'Step-by-Step SEO Optimization',
      icon: <Search className="h-5 w-5" />,
      description: 'Boost video discoverability through SEO optimization',
      sections: [
        {
          id: 'keyword-research',
          title: '🔍 Keyword Strategy',
          description: 'Research and implement effective keywords',
          steps: [
            {
              id: 'video-optimize-seo-step-1',
              title: 'Keyword Research & Analysis',
              description: 'Find high-impact keywords for your video content',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SEO Keyword Research</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master keyword research to boost your video's discoverability and reach.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Search className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Research Tools</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube Search Suggest</li>
                        <li>• Google Keyword Planner</li>
                        <li>• TubeBuddy & VidIQ</li>
                        <li>• Competitor analysis</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Long-tail keywords</li>
                        <li>• Search volume analysis</li>
                        <li>• Competition assessment</li>
                        <li>• Trending topics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-seo-step-2',
              title: 'Competitor SEO Analysis',
              description: 'Analyze successful competitor strategies',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Competitor Analysis</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Study your competitors' SEO strategies to identify opportunities and gaps in your own approach.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'title-optimization',
          title: '📝 Title & Description Optimization',
          description: 'Craft compelling, SEO-friendly titles and descriptions',
          steps: [
            {
              id: 'video-optimize-seo-step-3',
              title: 'SEO Title Optimization',
              description: 'Create titles that rank well and attract clicks',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Title Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of creating titles that both search engines and viewers love.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    engagement: {
      id: 'engagement',
      title: 'Step-by-Step Engagement Optimization',
      icon: <Eye className="h-5 w-5" />,
      description: 'Improve viewer engagement and interaction rates',
      sections: [
        {
          id: 'engagement-tactics',
          title: '👁️ Engagement Strategies',
          description: 'Implement proven engagement techniques',
          steps: [
            {
              id: 'engagement-step-1',
              title: 'Hook & Retention Tactics',
              description: 'Create compelling openings and maintain viewer interest',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Engagement Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of keeping viewers engaged from start to finish.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Hook Techniques</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Pattern interrupts</li>
                        <li>• Preview highlights</li>
                        <li>• Question openings</li>
                        <li>• Shocking statements</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Retention</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Pacing optimization</li>
                        <li>• Visual variety</li>
                        <li>• Story arcs</li>
                        <li>• Interaction prompts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'engagement-step-2',
              title: 'Interactive Elements Setup',
              description: 'Add polls, cards, and end screens for engagement',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Interactive Features</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Implement interactive elements that encourage viewer participation and engagement.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'cta-optimization',
          title: '📢 Call-to-Action Optimization',
          description: 'Create compelling calls-to-action that drive results',
          steps: [
            {
              id: 'engagement-step-3',
              title: 'Strategic CTA Placement',
              description: 'Position calls-to-action for maximum impact',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>CTA Strategy</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn when and how to ask viewers to like, subscribe, comment, and take other actions.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    thumbnails: {
      id: 'thumbnails',
      title: 'Step-by-Step Thumbnail Optimization',
      icon: <Image className="h-5 w-5" />,
      description: 'Create high-CTR thumbnails that drive clicks',
      sections: [
        {
          id: 'thumbnail-design',
          title: '🖼️ Thumbnail Design',
          description: 'Design thumbnails that maximize click-through rates',
          steps: [
            {
              id: 'thumbnail-step-1',
              title: 'High-CTR Thumbnail Design',
              description: 'Create thumbnails that stand out and drive clicks',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Thumbnail Mastery</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Design eye-catching thumbnails that increase your click-through rate and attract viewers.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Image className="h-6 w-6 text-pink-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-pink-600 dark:text-pink-400`}>Design Elements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• High contrast colors</li>
                        <li>• Clear facial expressions</li>
                        <li>• Bold, readable text</li>
                        <li>• Visual hierarchy</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>CTR Optimization</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• A/B testing thumbnails</li>
                        <li>• Psychology principles</li>
                        <li>• Curiosity gaps</li>
                        <li>• Brand consistency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'thumbnail-step-2',
              title: 'Thumbnail Psychology & Colors',
              description: 'Use psychology principles to improve thumbnail performance',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Psychology of Thumbnails</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Leverage color psychology and emotional triggers to create irresistible thumbnails.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'thumbnail-testing',
          title: '🧪 A/B Testing & Analysis',
          description: 'Test and optimize thumbnail performance',
          steps: [
            {
              id: 'thumbnail-step-3',
              title: 'Thumbnail A/B Testing Setup',
              description: 'Set up systematic thumbnail testing',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing Strategy</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to systematically test different thumbnail variations to find what works best.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    titles: {
      id: 'titles',
      title: 'Step-by-Step Metadata Optimization',
      icon: <Hash className="h-5 w-5" />,
      description: 'Optimize titles, descriptions, and tags for maximum reach',
      sections: [
        {
          id: 'metadata-optimization',
          title: '🏷️ Title & Tag Optimization',
          description: 'Craft compelling titles and effective tags',
          steps: [
            {
              id: 'metadata-step-1',
              title: 'Title Optimization Strategy',
              description: 'Create compelling, SEO-friendly video titles',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Metadata Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of creating titles, descriptions, and tags that boost discoverability.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Hash className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>Title Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Keyword placement</li>
                        <li>• Emotional triggers</li>
                        <li>• Power words</li>
                        <li>• Length optimization</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Descriptions & Tags</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Detailed descriptions</li>
                        <li>• Strategic tag usage</li>
                        <li>• Call-to-actions</li>
                        <li>• Timestamp chapters</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'metadata-step-2',
              title: 'Description & Tag Strategy',
              description: 'Write detailed descriptions and choose effective tags',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Descriptions & Tags</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create comprehensive descriptions and strategic tags that improve discoverability.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'chapter-optimization',
          title: '📑 Chapter & Timestamp Optimization',
          description: 'Improve navigation with chapters and timestamps',
          steps: [
            {
              id: 'metadata-step-3',
              title: 'Chapter Creation & Optimization',
              description: 'Add chapters and timestamps for better user experience',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Chapters</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Improve viewer experience and engagement with well-structured video chapters.
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
      title: 'Step-by-Step Revenue Optimization',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Maximize revenue through strategic monetization',
      sections: [
        {
          id: 'revenue-streams',
          title: '💰 Revenue Strategies',
          description: 'Implement multiple revenue streams',
          steps: [
            {
              id: 'video-optimize-monetization-step-1',
              title: 'Multi-Stream Revenue Setup',
              description: 'Set up diverse revenue streams for sustainable income',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Build multiple revenue streams to maximize your video content earnings.
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
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Sponsorships</span>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-monetization-step-2',
              title: 'YouTube Partner Program Setup',
              description: 'Enable and optimize YouTube monetization features',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>YouTube Monetization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up and optimize YouTube's built-in monetization features for steady revenue.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'sponsorship-optimization',
          title: '🤝 Sponsorship & Brand Deals',
          description: 'Attract and manage brand partnerships',
          steps: [
            {
              id: 'video-optimize-monetization-step-3',
              title: 'Brand Partnership Strategy',
              description: 'Build relationships with sponsors and brands',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Brand Partnerships</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to attract and maintain profitable brand partnerships and sponsorship deals.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    audience: {
      id: 'audience',
      title: 'Step-by-Step Retention Optimization',
      icon: <Users className="h-5 w-5" />,
      description: 'Improve audience retention and reduce drop-off rates',
      sections: [
        {
          id: 'retention-strategies',
          title: '👥 Retention Techniques',
          description: 'Keep viewers watching longer',
          steps: [
            {
              id: 'retention-step-1',
              title: 'Audience Retention Analysis',
              description: 'Analyze and improve viewer retention patterns',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-indigo-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Retention Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master techniques to keep your audience engaged throughout your entire video.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Users className="h-6 w-6 text-indigo-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400`}>Retention Analysis</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Drop-off point identification</li>
                        <li>• Retention graphs analysis</li>
                        <li>• Audience flow patterns</li>
                        <li>• Re-engagement strategies</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Improvement Tactics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Content restructuring</li>
                        <li>• Pacing adjustments</li>
                        <li>• Interactive elements</li>
                        <li>• Preview techniques</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'retention-step-2',
              title: 'Content Pacing & Structure',
              description: 'Optimize video pacing and content flow',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pacing Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to structure and pace your content to maintain viewer attention throughout.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'reengagement-strategies',
          title: '🔄 Re-engagement Techniques',
          description: 'Recapture viewer attention when it drops',
          steps: [
            {
              id: 'retention-step-3',
              title: 'Drop-off Recovery Tactics',
              description: 'Techniques to recapture attention at critical moments',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Re-engagement Strategies</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master advanced techniques to recapture viewer attention when retention starts to drop.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    }
  };

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
      
      Object.keys(optimizationPaths).forEach(appId => {
        const path = optimizationPaths[appId];
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

  const currentOptimizationPath = optimizationPaths[activeApp] || optimizationPaths.analytics;
  const totalSteps = currentOptimizationPath.sections.reduce((acc, section) => acc + section.steps.length, 0);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
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
            Optimize Video Performance
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Analyze and improve your video content's performance and reach
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {checklistCollapsed && (
            <button
              onClick={() => setChecklistCollapsed(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                theme === 'gradient' 
                  ? 'bg-orange-600/20 border-orange-500 text-orange-300 hover:bg-orange-600/30' 
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${theme === 'gradient' ? 'bg-orange-400' : 'bg-orange-500'}`}></div>
                <span className="font-medium">Checklist</span>
              </div>
            </button>
          )}
          <Settings className={`h-8 w-8 ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`} />
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
                  Optimization Checklist
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

        {/* Right Column - FAQ-Style Optimization Guide and Tabs */}
        <div className={checklistCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
          <div className="space-y-6">
            {/* FAQ-Style Optimization Guide Section */}
            <div className={`${theme === 'gradient' ? 'bg-gray-800/30 border-gray-700' : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                {currentOptimizationPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentOptimizationPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentOptimizationPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                  {currentOptimizationPath.sections.map((section, sectionIndex) => {
                    let stepCounter = 0;
                    // Calculate step number offset for this section
                    for (let i = 0; i < sectionIndex; i++) {
                      stepCounter += currentOptimizationPath.sections[i].steps.length;
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
                                        isCompleted ? 'bg-green-500 text-white' : `${theme === 'gradient' ? 'bg-orange-500' : 'bg-orange-600'} text-white`
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
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
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

export default VideoOptimize;