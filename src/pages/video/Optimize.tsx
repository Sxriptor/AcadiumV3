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
  Loader2,
  Brain,
  Palette,
  Lightbulb,
  TestTube,
  LineChart,
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
                  <div className="border-l-4 border-green-500 pl-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Data-Driven Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Transform raw analytics data into actionable insights for video improvement and channel growth.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Key Interpretations</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Watch time patterns</li>
                        <li>• Drop-off analysis</li>
                        <li>• Engagement spikes</li>
                        <li>• Audience behavior</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Action Steps</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Content restructuring</li>
                        <li>• Thumbnail optimization</li>
                        <li>• Title adjustments</li>
                        <li>• Timing improvements</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📊 Analytics Interpretation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Review retention graphs weekly</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Identify top-performing content</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Track click-through rates</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Monitor audience demographics</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Analyze traffic sources</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Compare video performance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Document key insights</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Create action plans</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Pro Tip: Reading the Data Story</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Don't just look at numbers - understand the story they tell. A 30% drop at 2:15 might indicate where your content becomes less engaging. Use these insights to restructure future videos and improve retention patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-analytics-step-3',
              title: 'Retention Analysis',
              description: 'Master audience retention graphs and patterns',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Audience Retention Mastery</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Learn to read and optimize based on audience retention graphs to keep viewers watching longer.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Retention Patterns</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Hook effectiveness (first 15 seconds)</li>
                        <li>• Content flow analysis</li>
                        <li>• Drop-off identification</li>
                        <li>• Re-engagement opportunities</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Eye className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Optimization Tactics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Stronger hooks &amp; previews</li>
                        <li>• Pacing adjustments</li>
                        <li>• Content restructuring</li>
                        <li>• Interactive elements</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📈 Retention Analysis Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded p-4`}>
                        <h4 className={`font-medium text-purple-600 dark:text-purple-400 mb-2`}>Good Retention Benchmarks:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 15 seconds: 80%+ retention (strong hook)</li>
                          <li>• 30 seconds: 65%+ retention (engaging intro)</li>
                          <li>• 1 minute: 50%+ retention (solid content)</li>
                          <li>• Mid-video: 35%+ retention (sustained interest)</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded p-4`}>
                        <h4 className={`font-medium text-red-600 dark:text-red-400 mb-2`}>Common Drop-off Points:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Slow/boring intro (0-30 seconds)</li>
                          <li>• Long sponsor segments</li>
                          <li>• Repetitive content</li>
                          <li>• Lack of visual variety</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-analytics-step-4',
              title: 'Traffic Source Analysis',
              description: 'Understand where your viewers come from',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Traffic Source Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Analyze where your viewers discover your content and optimize each traffic source for maximum growth.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Search className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>YouTube Search</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Optimize titles</li>
                        <li>• Use relevant tags</li>
                        <li>• Write SEO descriptions</li>
                        <li>• Target keywords</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Suggested Videos</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Create eye-catching thumbnails</li>
                        <li>• Study competitor content</li>
                        <li>• Optimize for related videos</li>
                        <li>• Build topical authority</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>External Traffic</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Social media promotion</li>
                        <li>• Website embeds</li>
                        <li>• Email newsletters</li>
                        <li>• Community sharing</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Traffic Source Action Plan</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Identify your top traffic source</strong> - Focus 70% of optimization efforts here
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Diversify traffic sources</strong> - Don't rely on just one discovery method
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Monitor changes weekly</strong> - Track how algorithm updates affect traffic
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-analytics-step-5',
              title: 'A/B Testing Setup',
              description: 'Test and optimize video elements systematically',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing for Video Performance</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up systematic testing to continuously improve your video performance through data-driven decisions.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-red-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400`}>Test Elements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Thumbnails (A vs B)</li>
                        <li>• Titles (different angles)</li>
                        <li>• Video intros</li>
                        <li>• Upload timing</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Key Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Click-through rate (CTR)</li>
                        <li>• Average view duration</li>
                        <li>• Engagement rate</li>
                        <li>• Subscriber conversion</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🧪 A/B Testing Framework</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded p-4`}>
                          <h4 className={`font-medium text-green-600 dark:text-green-400 mb-2`}>Thumbnail Testing:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Create 3-5 variations</li>
                            <li>• Test facial expressions</li>
                            <li>• Try different colors</li>
                            <li>• Test text vs no text</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded p-4`}>
                          <h4 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>Title Testing:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Question vs statement</li>
                            <li>• Numbers vs no numbers</li>
                            <li>• Different emotional triggers</li>
                            <li>• Length variations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Settings className="h-6 w-6 text-red-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Testing Best Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Test one element at a time for clear results</li>
                          <li>• Run tests for at least 48-72 hours</li>
                          <li>• Ensure statistical significance before concluding</li>
                          <li>• Document all test results for future reference</li>
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
                      Master keyword research to boost your video's discoverability and reach across YouTube search.
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
                        <li>• TubeBuddy &amp; VidIQ</li>
                        <li>• Google Trends</li>
                        <li>• Answer The Public</li>
                        <li>• Competitor analysis tools</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Keyword Types</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Primary keywords (main topic)</li>
                        <li>• Long-tail keywords (specific phrases)</li>
                        <li>• Trending keywords (current topics)</li>
                        <li>• Location-based keywords</li>
                        <li>• Question-based keywords</li>
                        <li>• Brand-related keywords</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔍 Keyword Research Process</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Brainstorm seed keywords</strong> - Start with basic terms related to your video topic
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Use YouTube's autocomplete</strong> - Type your keywords and see suggested searches
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Analyze search volume &amp; competition</strong> - Find the sweet spot for your niche
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Check trending topics</strong> - Incorporate current trends when relevant
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-green-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Pro Tip: The 3-Keyword Strategy</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Use one primary keyword (high volume), one long-tail keyword (specific), and one trending keyword (current) in your title, description, and tags. This balances discoverability with competition.
                        </p>
                      </div>
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
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Competitor SEO Analysis</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Study your competitors' SEO strategies to identify opportunities and gaps in your own approach.
                  </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Analysis Areas</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Title structures &amp; keywords</li>
                        <li>• Description patterns</li>
                        <li>• Tag strategies</li>
                        <li>• Thumbnail styles</li>
                        <li>• Video length &amp; format</li>
                        <li>• Upload frequency</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Key Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• View counts &amp; growth</li>
                        <li>• Engagement rates</li>
                        <li>• Search rankings</li>
                        <li>• Subscriber growth</li>
                        <li>• Content gaps</li>
                        <li>• Trending topics coverage</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔍 Competitor Research Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Identify top 5 competitors</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Analyze their best-performing videos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Study title formulas</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Review description structures</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Extract common keywords</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Note content gaps</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Track posting schedules</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Document successful patterns</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Target className="h-6 w-6 text-purple-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Strategic Opportunity Finding</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Look for keywords your competitors rank for but you don't, topics they haven't covered yet, and formats that perform well in your niche. Use this intelligence to create your content strategy.
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
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Title Optimization Mastery</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of creating titles that both search engines and viewers love, balancing SEO with click appeal.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Hash className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Title Elements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Primary keyword first</li>
                        <li>• Emotional triggers</li>
                        <li>• Numbers &amp; specifics</li>
                        <li>• Power words</li>
                        <li>• Curiosity gaps</li>
                        <li>• Benefit statements</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Title Formulas</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• How to [Keyword] in [Time]</li>
                        <li>• [Number] Ways to [Benefit]</li>
                        <li>• Why [Statement] is Wrong</li>
                        <li>• The Secret to [Desired Outcome]</li>
                        <li>• [Keyword]: Complete Guide</li>
                        <li>• What [Experts] Don't Tell You</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📝 Title Optimization Framework</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded p-4`}>
                          <h4 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>SEO Best Practices:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Keep under 60 characters</li>
                            <li>• Primary keyword in first 5 words</li>
                            <li>• Avoid keyword stuffing</li>
                            <li>• Use natural language</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded p-4`}>
                          <h4 className={`font-medium text-green-600 dark:text-green-400 mb-2`}>Click Appeal Tips:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Create curiosity gaps</li>
                            <li>• Promise specific benefits</li>
                            <li>• Use emotional triggers</li>
                            <li>• Add urgency when relevant</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-seo-step-4',
              title: 'Description & Tags Strategy',
              description: 'Optimize descriptions and tags for maximum reach',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Description &amp; Tags Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Maximize your video's discoverability through strategic description writing and smart tag selection.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>Description Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Hook in first 125 characters</li>
                        <li>• Detailed video summary</li>
                        <li>• Timestamps for sections</li>
                        <li>• Relevant links &amp; resources</li>
                        <li>• Social media links</li>
                        <li>• Call-to-action statements</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Hash className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Tag Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• 10-15 relevant tags</li>
                        <li>• Mix of broad &amp; specific tags</li>
                        <li>• Include video title as tag</li>
                        <li>• Use competitor tags</li>
                        <li>• Add branded tags</li>
                        <li>• Include trending topics</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Description Template</h3>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-white dark:bg-gray-900/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'} rounded p-4 font-mono text-sm`}>
                      <div className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        <p className="mb-2">🎯 [Compelling hook with main benefit]</p>
                        <p className="mb-2">[Detailed explanation of video content]</p>
                        <p className="mb-2">📍 TIMESTAMPS:</p>
                        <p className="mb-2">00:00 - Introduction</p>
                        <p className="mb-2">02:30 - Main Topic</p>
                        <p className="mb-2">05:45 - Key Tips</p>
                        <p className="mb-2">🔗 RESOURCES:</p>
                        <p className="mb-2">[Links to tools, websites, etc.]</p>
                        <p>👉 Don't forget to LIKE &amp; SUBSCRIBE!</p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Target className="h-6 w-6 text-yellow-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Keyword Distribution Strategy</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Naturally distribute your primary keyword 2-3 times in the description. Use related keywords and synonyms to avoid repetition while maintaining relevance for YouTube's algorithm.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-seo-step-5',
              title: 'Advanced SEO Tactics',
              description: 'Implement advanced techniques for maximum visibility',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced SEO Techniques</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master advanced SEO strategies to dominate YouTube search and maximize your video's reach.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-red-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400`}>Content Clusters</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Topic authority building</li>
                        <li>• Interconnected content</li>
                        <li>• Playlist optimization</li>
                        <li>• Cross-video linking</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Timing Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Optimal upload times</li>
                        <li>• Trending topic timing</li>
                        <li>• Seasonal optimization</li>
                        <li>• Algorithm timing</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Cross-Platform SEO</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Google search optimization</li>
                        <li>• Social media keywords</li>
                        <li>• Blog post integration</li>
                        <li>• Podcast optimization</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Advanced Optimization Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Create topic clusters</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Optimize custom thumbnails</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Use closed captions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Add chapter markers</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Create playlists strategically</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Use end screens effectively</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Optimize upload schedule</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Monitor algorithm changes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Zap className="h-6 w-6 text-red-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Algorithm Mastery</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          YouTube's algorithm prioritizes watch time, click-through rate, and user engagement. Focus on creating content that keeps viewers watching and encourages interaction. Consistency in uploads and audience retention are key ranking factors.
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
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Hook &amp; Retention Mastery</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of keeping viewers engaged from start to finish with proven hook and retention strategies.
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
                        <li>• Story teasers</li>
                        <li>• Benefit promises</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Retention Tactics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Pacing optimization</li>
                        <li>• Visual variety</li>
                        <li>• Story arcs</li>
                        <li>• Interaction prompts</li>
                        <li>• Loop backs</li>
                        <li>• Cliffhangers</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚡ Hook Formula Framework</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>First 3 seconds</strong> - Grab attention with a pattern interrupt or shocking visual
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>First 15 seconds</strong> - Preview the main value and create curiosity
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>First 30 seconds</strong> - Promise specific outcomes and set expectations
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Throughout video</strong> - Use callbacks, previews, and interaction prompts
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Eye className="h-6 w-6 text-purple-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Retention Psychology</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Viewers decide within 15 seconds whether to keep watching. Use the "curiosity gap" technique: reveal just enough to hook them, but save the payoff for later in the video. Always preview what's coming next.
                        </p>
                      </div>
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
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Interactive Features Mastery</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement interactive elements that encourage viewer participation and boost engagement metrics.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Cards &amp; Polls</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube polls</li>
                        <li>• Info cards</li>
                        <li>• Video cards</li>
                        <li>• Playlist cards</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <PlayCircle className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>End Screens</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Subscribe prompts</li>
                        <li>• Video suggestions</li>
                        <li>• Playlist promotion</li>
                        <li>• Channel trailer</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Users className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Community</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Comment prompts</li>
                        <li>• Question stickers</li>
                        <li>• Live chat engagement</li>
                        <li>• Community posts</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🎯 Interactive Elements Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Add 2-3 cards per video</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Create engaging end screens</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Use community polls regularly</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Add chapter timestamps</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Include clear comment prompts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Test interactive timing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Monitor engagement metrics</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Optimize based on data</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Settings className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Timing Strategy</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Place cards at high-retention moments, not during drops. End screens should appear in the last 20 seconds. Use polls during natural pauses, and always give viewers time to interact before moving on.
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
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>CTA Strategy &amp; Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Learn when and how to ask viewers to like, subscribe, comment, and take other actions for maximum conversion.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>CTA Types</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Subscribe requests</li>
                        <li>• Like prompts</li>
                        <li>• Comment questions</li>
                        <li>• Share suggestions</li>
                        <li>• Notification bell</li>
                        <li>• External links</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Optimal Timing</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Early hook (15-30 seconds)</li>
                        <li>• Mid-video value</li>
                        <li>• After delivering value</li>
                        <li>• End screen CTAs</li>
                        <li>• Natural pause points</li>
                        <li>• High engagement moments</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📝 CTA Script Templates</h3>
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded p-3`}>
                        <h4 className={`font-medium text-green-600 dark:text-green-400 mb-1`}>Subscribe CTA:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          "If you're getting value from this, you'll love my weekly [topic] tips - hit subscribe!"
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded p-3`}>
                        <h4 className={`font-medium text-blue-600 dark:text-blue-400 mb-1`}>Comment CTA:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          "Drop a comment below - what's your biggest [topic] challenge right now?"
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded p-3`}>
                        <h4 className={`font-medium text-purple-600 dark:text-purple-400 mb-1`}>Like CTA:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          "Smash that like button if this helped you [specific outcome]!"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="h-6 w-6 text-yellow-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Psychology of Effective CTAs</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Always provide value first, then ask. Make CTAs specific ("comment your favorite tip") rather than generic ("comment below"). Use urgency and social proof when authentic. Limit to 1-2 CTAs per video to avoid overwhelming viewers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'engagement-step-4',
              title: 'Community Building',
              description: 'Build an engaged community around your content',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Community Building Strategy</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Transform viewers into an engaged community that actively participates and supports your channel growth.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Users className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Engagement</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Respond to comments</li>
                        <li>• Ask questions</li>
                        <li>• Create discussions</li>
                        <li>• Host live streams</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Value Creation</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Exclusive content</li>
                        <li>• Behind-the-scenes</li>
                        <li>• Community posts</li>
                        <li>• Member perks</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Growth</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Cross-platform presence</li>
                        <li>• Collaborations</li>
                        <li>• User-generated content</li>
                        <li>• Community challenges</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Community Building Action Plan</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Respond within 24 hours</strong> - Show your community you value their input
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Create weekly community posts</strong> - Keep engagement high between videos
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Feature viewer content</strong> - Highlight community contributions in videos
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Host monthly live streams</strong> - Connect directly with your audience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'engagement-step-5',
              title: 'Engagement Analytics & Optimization',
              description: 'Track and optimize engagement performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-red-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Engagement Analytics Mastery</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master engagement analytics to continuously improve your content strategy and audience connection.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-6 w-6 text-red-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400`}>Key Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Like-to-view ratio</li>
                        <li>• Comment engagement rate</li>
                        <li>• Average watch time</li>
                        <li>• Click-through rate</li>
                        <li>• Subscriber conversion</li>
                        <li>• Share rate</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Optimization</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• A/B test CTAs</li>
                        <li>• Optimize hook timing</li>
                        <li>• Improve interaction timing</li>
                        <li>• Test content formats</li>
                        <li>• Analyze comment sentiment</li>
                        <li>• Track engagement trends</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📊 Engagement Benchmarks</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded p-4`}>
                          <h4 className={`font-medium text-green-600 dark:text-green-400 mb-2`}>Good Engagement:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 4-6% like rate</li>
                            <li>• 0.5-1% comment rate</li>
                            <li>• 1-2% share rate</li>
                            <li>• 15%+ CTR (small channels)</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded p-4`}>
                          <h4 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>Excellent Engagement:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 8%+ like rate</li>
                            <li>• 2%+ comment rate</li>
                            <li>• 3%+ share rate</li>
                            <li>• 20%+ CTR (small channels)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Target className="h-6 w-6 text-red-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Continuous Improvement Strategy</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Track engagement patterns weekly. Look for content types, topics, and formats that generate the highest engagement. Double down on what works and gradually phase out underperforming approaches. Always test one variable at a time.
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
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Thumbnail Design Mastery</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of creating eye-catching thumbnails that boost your click-through rate and attract viewers.
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
                        <li>• Rule of thirds</li>
                        <li>• Negative space</li>
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
                        <li>• Mobile optimization</li>
                        <li>• Competitive analysis</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🎨 Design Best Practices</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Resolution &amp; Size</strong> - Use 1280x720 pixels (16:9), ensure text is readable at small sizes
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Text Elements</strong> - Use 2-3 words maximum, large font size, high contrast colors
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Visual Elements</strong> - Include faces when possible, use arrows or circles to draw attention
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Branding</strong> - Maintain consistent style, colors, and fonts across your channel
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-pink-900/20' : 'bg-pink-50 dark:bg-pink-900/20'} border ${theme === 'gradient' ? 'border-pink-700' : 'border-pink-200 dark:border-pink-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Image className="h-6 w-6 text-pink-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Pro Design Tips</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Use layers in your design software to create depth. Keep a template with your brand elements. Test thumbnails at multiple sizes. Create 2-3 variations before finalizing. Always export in high quality with proper compression.
                        </p>
                      </div>
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
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Thumbnail Psychology</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the psychological principles and color theory that make thumbnails irresistible to click.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Brain className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Psychological Triggers</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Emotional response</li>
                        <li>• Pattern interrupts</li>
                        <li>• Curiosity gaps</li>
                        <li>• Social proof</li>
                        <li>• Visual contrast</li>
                        <li>• Action cues</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Palette className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Color Psychology</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Red: Urgency/Excitement</li>
                        <li>• Blue: Trust/Stability</li>
                        <li>• Yellow: Optimism</li>
                        <li>• Green: Growth/Success</li>
                        <li>• Purple: Luxury/Quality</li>
                        <li>• Orange: Energy/Action</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🎯 Emotional Impact Framework</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded p-4`}>
                        <h4 className={`font-medium text-purple-600 dark:text-purple-400 mb-2`}>Primary Emotions:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Curiosity - Use mystery elements</li>
                          <li>• Surprise - Show unexpected results</li>
                          <li>• Excitement - Dynamic visuals</li>
                          <li>• Trust - Professional elements</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded p-4`}>
                        <h4 className={`font-medium text-orange-600 dark:text-orange-400 mb-2`}>Visual Triggers:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Facial expressions - Show emotion</li>
                          <li>• Arrows - Direct attention</li>
                          <li>• Numbers - Quantify value</li>
                          <li>• Before/After - Show transformation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-6 w-6 text-purple-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Advanced Psychology Tips</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Combine multiple psychological triggers but don't overwhelm. Use the Zeigarnik effect (unfinished tasks create tension) in your thumbnail text. Create visual metaphors that resonate with your audience's desires and pain points.
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
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing Strategy</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of systematic thumbnail testing to continuously improve your click-through rates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TestTube className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Testing Elements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Text variations</li>
                        <li>• Color schemes</li>
                        <li>• Image composition</li>
                        <li>• Facial expressions</li>
                        <li>• Visual hierarchy</li>
                        <li>• Emotional triggers</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Key Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Click-through rate (CTR)</li>
                        <li>• Impression velocity</li>
                        <li>• Audience retention</li>
                        <li>• Watch time correlation</li>
                        <li>• Traffic source impact</li>
                        <li>• Conversion metrics</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📊 Testing Framework</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Hypothesis</strong> - Form clear predictions about what will improve CTR
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Variables</strong> - Test one element at a time (text, colors, images)
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Duration</strong> - Run tests for at least 48-72 hours for reliable data
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Analysis</strong> - Document results and update your thumbnail strategy
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <LineChart className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Data-Driven Optimization</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Track CTR changes over time. Look for patterns in successful thumbnails. Consider audience demographics and preferences. Use YouTube Studio's A/B testing feature for accurate results. Document all tests and outcomes for future reference.
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
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Title Optimization</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of creating titles that boost discoverability and drive clicks.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Hash className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>Title Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Strategic keyword placement</li>
                        <li>• Emotional trigger words</li>
                        <li>• Power words that convert</li>
                        <li>• Length optimization</li>
                        <li>• Click psychology</li>
                        <li>• Brand consistency</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Search className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>SEO Elements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Search intent matching</li>
                        <li>• Keyword research</li>
                        <li>• Competitive analysis</li>
                        <li>• Title formatting</li>
                        <li>• Algorithm optimization</li>
                        <li>• Trend alignment</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📝 Title Formula Framework</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Hook Element</strong> - Start with curiosity, numbers, or emotion (e.g., "How I..." or "5 Ways to...")
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Core Keyword</strong> - Include your main target keyword naturally
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Value Proposition</strong> - What will viewers gain? (e.g., "in 5 Minutes" or "Step by Step")
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Branding</strong> - Optional channel/brand name if relevant
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-6 w-6 text-yellow-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Pro Title Tips</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Keep titles under 60 characters for full display in search. Front-load important keywords. Use power words like "Ultimate," "Essential," or "Complete." Create curiosity gaps but avoid clickbait. Test different title variations using YouTube Studio's A/B testing feature.
                        </p>
                      </div>
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
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Description & Tags</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create comprehensive descriptions and strategic tags that improve discoverability and engagement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Description Elements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Compelling opening hook</li>
                        <li>• Key points summary</li>
                        <li>• Timestamps/chapters</li>
                        <li>• Resource links</li>
                        <li>• Call-to-actions</li>
                        <li>• Social proof</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Hash className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Tag Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Primary keywords</li>
                        <li>• Long-tail variations</li>
                        <li>• Related topics</li>
                        <li>• Trending terms</li>
                        <li>• Brand/channel tags</li>
                        <li>• Category tags</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Description Template</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded p-4`}>
                        <h4 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>First 2-3 Lines:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Hook sentence with main keyword</li>
                          <li>• Value proposition</li>
                          <li>• Call-to-action</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded p-4`}>
                        <h4 className={`font-medium text-purple-600 dark:text-purple-400 mb-2`}>Main Body:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Detailed content overview</li>
                          <li>• Timestamps (00:00 format)</li>
                          <li>• Key points and takeaways</li>
                          <li>• Resources mentioned</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Target className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Optimization Tips</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Use natural language in descriptions. Include variations of your keywords. Keep tags relevant and specific. Update descriptions with new links/info. Use YouTube's auto-suggest for tag ideas. Monitor which tags bring the most traffic.
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
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Chapters</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create well-structured chapters that improve viewer experience and boost retention.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Chapter Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Clear section names</li>
                        <li>• Logical progression</li>
                        <li>• Keyword optimization</li>
                        <li>• Time formatting</li>
                        <li>• Content hierarchy</li>
                        <li>• Navigation points</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Timestamp Benefits</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Improved navigation</li>
                        <li>• Higher retention</li>
                        <li>• Search visibility</li>
                        <li>• User experience</li>
                        <li>• Content skimming</li>
                        <li>• Rewatch value</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⏱️ Chapter Best Practices</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Format</strong> - Use "00:00 Chapter Name" format, start with 00:00
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Names</strong> - Keep chapter names clear, descriptive, and keyword-rich
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Length</strong> - Aim for chapters between 2-5 minutes for optimal navigation
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Structure</strong> - Follow a logical progression through your content
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-6 w-6 text-green-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Advanced Chapter Tips</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Use chapters to highlight key moments that viewers often rewatch. Include mini-summaries in chapter names. Consider adding duration in parentheses for longer sections. Test different chapter lengths and names to optimize for retention.
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
    },
    monetization: {
      id: 'monetization',
      title: 'Step-by-Step Revenue Optimization',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Maximize revenue through strategic monetization',
      sections: [
        {
          id: 'revenue-streams',
          title: '💰 Revenue Streams Setup',
          description: 'Implement and optimize multiple revenue sources',
          steps: [
            {
              id: 'video-optimize-monetization-step-1',
              title: 'YouTube Partner Program Setup',
              description: 'Enable and optimize YouTube monetization features',
              estimated_time: '45 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      YouTube Partner Program Optimization
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the fundamentals of YouTube monetization and set up your revenue streams effectively.
                    </p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Step-by-Step YPP Setup
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            Eligibility Requirements
                          </p>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            • 1,000+ subscribers<br/>
                            • 4,000+ valid public watch hours<br/>
                            • AdSense account linked<br/>
                            • No active Community Guidelines strikes
                          </p>
                    </div>
                    </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            Account Setup
                          </p>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            • Enable monetization in YouTube Studio<br/>
                            • Configure ad preferences<br/>
                            • Set up payment information<br/>
                            • Review and accept terms
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            Content Optimization
                          </p>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            • Ensure content is advertiser-friendly<br/>
                            • Optimize video length (8+ minutes for mid-rolls)<br/>
                            • Add strategic ad break points<br/>
                            • Maintain high engagement metrics
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-blue-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Pro Tip: Ad Placement Strategy</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          For videos over 8 minutes, place mid-roll ads at natural breaks in content (scene changes, topic transitions) to minimize viewer disruption. Keep pre-rolls and end screens consistent across videos to build viewer expectations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-monetization-step-2',
              title: 'Alternative Revenue Streams',
              description: 'Diversify your income with multiple revenue sources',
              estimated_time: '60 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Revenue Stream Diversification
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Expand beyond ad revenue with multiple income sources to build a sustainable channel.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Channel Memberships
                      </h3>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Tier Structure:</strong> Create 3-5 membership tiers with increasing value</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Exclusive Content:</strong> Behind-the-scenes, early access, member-only streams</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Community Engagement:</strong> Member-only posts, polls, and Q&amp;As</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Perks Management:</strong> Sustainable, scalable member benefits</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Sponsorships &amp; Affiliates
                      </h3>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Brand Partnerships:</strong> Direct sponsorships, product placements</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Affiliate Marketing:</strong> Strategic product recommendations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Disclosure Compliance:</strong> FTC guidelines, transparency</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Integration Strategy:</strong> Natural, value-adding promotions</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-purple-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Pro Tip: Revenue Stack</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Build your revenue streams in order of impact: First master ad revenue, then add channel memberships, followed by strategic sponsorships. This allows you to focus on perfecting each revenue stream before adding complexity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
        },
            {
              id: 'video-optimize-monetization-step-3',
              title: 'Revenue Analytics & Optimization',
              description: 'Track and improve monetization performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Revenue Performance Tracking
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Monitor and optimize your revenue streams using analytics and data-driven decisions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Key Performance Indicators
                      </h3>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Revenue Metrics:</strong> RPM, CPM, estimated revenue</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Audience Metrics:</strong> Watch time, retention, engagement</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Membership Metrics:</strong> Join rate, churn rate, lifetime value</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Sponsorship Metrics:</strong> Conversion rates, ROI tracking</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        Optimization Strategies
                      </h3>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>A/B Testing:</strong> Test thumbnails, titles, ad placements</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Content Strategy:</strong> Align content with high-RPM topics</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Seasonal Planning:</strong> Capitalize on high-value periods</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Audience Development:</strong> Build engaged, high-value viewership</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-6`}>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-6 w-6 text-orange-500 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Pro Tip: Data-Driven Decisions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Create a monthly revenue review process: Analyze performance across all streams, identify top-performing content and formats, and adjust your content strategy to focus on what drives the highest revenue while maintaining audience satisfaction.
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
    },
    audience: {
      id: 'audience',
      title: 'Step-by-Step Retention Optimization',
      icon: <Users className="h-5 w-5" />,
      description: 'Improve audience retention and reduce drop-off rates',
      sections: [
        {
          id: 'retention-strategies',
          title: '👥 Retention Analysis & Optimization',
          description: 'Master viewer retention techniques',
          steps: [
            {
              id: 'retention-step-1',
              title: 'Understanding Retention Metrics',
              description: 'Master YouTube retention analytics',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  {/* Existing content remains the same until the pro tip section */}
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Guide
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Step 1: Baseline Analysis
                        </h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Export retention data for your last 5 videos</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Calculate average retention at key points (15s, 30s, 1min, mid, end)</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Identify your highest and lowest performing videos</span>
                          </li>
                      </ul>
                    </div>
                    
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Step 2: Pattern Recognition
                        </h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Mark common drop-off points across videos</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Note content types during high retention moments</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Document audience demographics for top performers</span>
                          </li>
                      </ul>
                    </div>

                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Step 3: Action Plan
                        </h4>
                        <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded p-4`}>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Create a retention improvement document with:
                          </p>
                          <ul className={`mt-2 space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Current retention benchmarks</li>
                            <li>• Target improvements (aim for 5% increase)</li>
                            <li>• Content adjustments based on findings</li>
                            <li>• Timeline for implementing changes</li>
                          </ul>
                  </div>
                      </div>
                    </div>
                  </div>

                  {/* Existing pro tip section remains */}
                </div>
              )
            },
            {
              id: 'retention-step-2',
              title: 'Content Structure Optimization',
              description: 'Design engaging video structures',
              estimated_time: '45 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  {/* Existing content remains the same until the pro tip section */}

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Practical Implementation
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Content Planning Template
                        </h4>
                        <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded p-4`}>
                          <p className={`text-sm font-medium mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Video Structure Outline:
                          </p>
                          <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Hook (0:00 - 0:30)
                              <ul className="ml-4 mt-1">
                                <li>• Pattern interrupt moment</li>
                                <li>• Value statement</li>
                                <li>• Preview of best content</li>
                              </ul>
                            </li>
                            <li>2. Main Content (0:30 - 6:30)
                              <ul className="ml-4 mt-1">
                                <li>• 3 main segments (2 min each)</li>
                                <li>• Transition hooks between segments</li>
                                <li>• Visual style changes every 45-60s</li>
                              </ul>
                            </li>
                            <li>3. Conclusion (6:30 - 8:00)
                              <ul className="ml-4 mt-1">
                                <li>• Key takeaways</li>
                                <li>• Call-to-action</li>
                                <li>• End screen optimization</li>
                              </ul>
                            </li>
                          </ol>
                        </div>
                      </div>

                      <div>
                        <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Implementation Checklist
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className={`text-sm font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                              Pre-Production
                            </h5>
                            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Create content outline with timing</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Plan visual transitions</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Script pattern interrupts</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h5 className={`text-sm font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                              Production
                            </h5>
                            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Record multiple hook versions</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Film transition segments</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Create variety in visuals</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Existing pro tip section remains */}
                </div>
              )
        },
            {
              id: 'retention-step-3',
              title: 'Engagement Techniques',
              description: 'Implement viewer retention tactics',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  {/* Existing content remains the same until the pro tip section */}

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Workshop
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Exercise 1: Engagement Map
                        </h4>
                        <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded p-4`}>
                          <p className={`text-sm mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Create an engagement map for your next video:
                          </p>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3`}>
                              <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                0:00 - 2:00
                              </p>
                              <ul className={`mt-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Opening hook + question prompt</li>
                                <li>• First value delivery</li>
                                <li>• Preview tease</li>
                              </ul>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3`}>
                              <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                2:00 - 4:00
                              </p>
                              <ul className={`mt-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Pattern interrupt</li>
                                <li>• Interactive element</li>
                                <li>• Open loop creation</li>
                              </ul>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3`}>
                              <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                4:00 - End
                              </p>
                              <ul className={`mt-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Loop closure</li>
                                <li>• Call-to-action</li>
                                <li>• End screen optimization</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Exercise 2: Engagement Script Template
                        </h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                          <div className="space-y-3">
                            <div>
                              <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                Hook Template:
                              </p>
                              <p className={`text-sm italic ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                "In this video, I'll show you [unexpected result]. You might think [common belief], but [pattern interrupt]. Stay tuned to discover [value promise]..."
                              </p>
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                Re-engagement Prompt:
                              </p>
                              <p className={`text-sm italic ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                "Before I show you [next valuable point], let me know in the comments if you've ever [relevant question]. Coming up, I'll reveal [teaser]..."
                              </p>
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                Call-to-Action:
                              </p>
                              <p className={`text-sm italic ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                "If you found this helpful, you'll love what's coming in [preview next video]. Subscribe and hit the notification bell to [specific benefit]..."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Implementation Checklist
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className={`text-sm font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                              Content Preparation
                            </h5>
                            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Create engagement map</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Write hook variations</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Plan interactive moments</span>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h5 className={`text-sm font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                              Post-Production
                            </h5>
                            <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Add engagement graphics</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Insert pattern interrupts</span>
                              </li>
                              <li className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span>Optimize end screen</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Existing pro tip section remains */}
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