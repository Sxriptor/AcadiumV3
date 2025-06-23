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
  Tag,
  Layout
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
        { id: 'connect-payment-systems', title: 'Connect payment processing systems', description: 'Integrate Stripe, PayPal, and bank accounts', completed: false },
        { id: 'setup-oauth-integrations', title: 'Setup OAuth integrations', description: 'Connect YouTube, AdSense, and third-party APIs', completed: false },
        { id: 'configure-webhooks', title: 'Configure revenue webhooks', description: 'Set up real-time payment notifications', completed: false },
        { id: 'integrate-analytics-tracking', title: 'Integrate analytics tracking', description: 'Connect revenue tracking across platforms', completed: false },
        { id: 'setup-subscription-billing', title: 'Setup subscription billing integration', description: 'Configure recurring payment systems', completed: false },
        { id: 'connect-sponsorship-platforms', title: 'Connect sponsorship platforms', description: 'Integrate with FameBit, Creator.co, and Grin', completed: false },
        { id: 'implement-affiliate-tracking', title: 'Implement affiliate tracking', description: 'Set up commission tracking and payouts', completed: false },
        { id: 'configure-tax-reporting', title: 'Configure tax reporting integration', description: 'Connect tax software and 1099 generation', completed: false }
      ],
      audience: [
        { id: 'integrate-retention-analytics', title: 'Integrate retention analytics systems', description: 'Connect advanced audience tracking platforms', completed: false },
        { id: 'setup-engagement-apis', title: 'Setup engagement tracking APIs', description: 'Configure real-time viewer behavior monitoring', completed: false },
        { id: 'connect-heatmap-tools', title: 'Connect video heatmap tools', description: 'Integrate click and attention tracking systems', completed: false },
        { id: 'implement-ab-testing', title: 'Implement A/B testing framework', description: 'Set up retention experiment infrastructure', completed: false },
        { id: 'configure-cohort-analysis', title: 'Configure cohort analysis tracking', description: 'Connect viewer journey mapping systems', completed: false },
        { id: 'setup-retention-webhooks', title: 'Setup retention event webhooks', description: 'Configure real-time engagement notifications', completed: false },
        { id: 'integrate-predictive-analytics', title: 'Integrate predictive analytics', description: 'Connect ML-powered retention forecasting', completed: false },
        { id: 'implement-cross-platform', title: 'Implement cross-platform tracking', description: 'Unify retention data across all video platforms', completed: false }
      ],
      revenue: [
        { id: 'setup-monetization', title: 'Setup monetization features', description: 'Enable and configure revenue streams', completed: false },
        { id: 'optimize-ad-placement', title: 'Optimize ad placements', description: 'Strategic positioning of ad breaks', completed: false },
        { id: 'create-sponsorship-deck', title: 'Create sponsorship deck', description: 'Develop brand partnership materials', completed: false },
        { id: 'setup-memberships', title: 'Setup channel memberships', description: 'Configure exclusive content tiers', completed: false },
        { id: 'design-merchandise', title: 'Design merchandise strategy', description: 'Plan product integration and sales', completed: false },
        { id: 'track-metrics', title: 'Track revenue metrics', description: 'Monitor RPM and revenue growth', completed: false },
        { id: 'optimize-ctr', title: 'Optimize click-through rates', description: 'Improve conversion performance', completed: false },
        { id: 'test-ad-formats', title: 'Test different ad formats', description: 'Experiment with ad types and styles', completed: false }
      ]
    };
    return checklistMap[appId] || checklistMap.analytics;
  };

  const checklistItems = getChecklistForApp(activeApp);

  const optimizationPaths: { [key: string]: OptimizationPath } = {
    revenue: {
      id: 'revenue',
      title: 'Step-by-Step Revenue Optimization',
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Maximize video monetization and revenue streams',
      sections: [
        {
          id: 'revenue-basics',
          title: '💰 Core Revenue Setup',
          description: 'Set up fundamental revenue streams',
          steps: [
            {
              id: 'revenue-step-1',
              title: 'YouTube Partner Program Setup',
              description: 'Enable and optimize YouTube monetization features',
              estimated_time: '45 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      YouTube Partner Program
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Complete setup of YouTube monetization features and optimize your revenue potential through the Partner Program.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <DollarSign className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Eligibility Requirements</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Watch Hours:</strong> 4,000 valid public watch hours</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Subscribers:</strong> 1,000+ subscribers</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>AdSense:</strong> Active linked account</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Guidelines:</strong> Follow community guidelines</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Initial Setup Steps</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Account:</strong> Verify account status</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>AdSense:</strong> Complete account setup</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Settings:</strong> Configure monetization preferences</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Review:</strong> Submit for program review</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Revenue Features Checklist
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} rounded-lg p-4`}>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Basic Setup
                            <ul className="pl-4 mt-1">
                              <li>- Enable all ad formats</li>
                              <li>- Set default monetization</li>
                              <li>- Configure mid-roll settings</li>
                              <li>- Review content restrictions</li>
                            </ul>
                          </li>
                          <li>2. Advanced Features
                            <ul className="pl-4 mt-1">
                              <li>- Super Chat configuration</li>
                              <li>- Channel memberships setup</li>
                              <li>- Merchandise shelf activation</li>
                              <li>- BrandConnect enrollment</li>
                            </ul>
                          </li>
                          <li>3. Compliance
                            <ul className="pl-4 mt-1">
                              <li>- Content guidelines review</li>
                              <li>- Copyright compliance check</li>
                              <li>- Advertiser-friendly status</li>
                              <li>- Age-appropriate content</li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'revenue-step-2',
              title: 'Advanced Revenue Optimization',
              description: 'Maximize earnings through multiple revenue streams',
              estimated_time: '60 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Revenue Stream Diversification
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement and optimize multiple revenue streams to maximize channel earnings and create sustainable income.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <DollarSign className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Channel Memberships</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Tier Structure:</strong> Create value-based membership levels</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Exclusive Content:</strong> Member-only videos and posts</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Custom Perks:</strong> Badges, emojis, and shoutouts</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Community:</strong> Member-only discussions</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Brand Partnerships</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Sponsorship Kit:</strong> Create professional media kit</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Integration:</strong> Natural brand placement</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Disclosure:</strong> FTC compliance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Analytics:</strong> Track sponsor ROI</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Merchandise Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Product Design:</strong> Create branded merchandise</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Platform:</strong> Choose merch platform</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Integration:</strong> Shelf placement</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Promotion:</strong> Marketing strategy</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Performance Tracking</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Revenue Mix:</strong> Track all streams</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Growth:</strong> Monitor trends</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>ROI:</strong> Calculate effectiveness</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Optimization:</strong> Adjust strategy</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Timeline
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} rounded-lg p-4`}>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Foundation (Month 1)
                            <ul className="pl-4 mt-1">
                              <li>- Set up all revenue features</li>
                              <li>- Create membership tiers</li>
                              <li>- Design initial merch</li>
                              <li>- Develop sponsor kit</li>
                            </ul>
                          </li>
                          <li>2. Growth (Months 2-3)
                            <ul className="pl-4 mt-1">
                              <li>- Launch membership program</li>
                              <li>- Release merchandise</li>
                              <li>- Secure first sponsors</li>
                              <li>- Track performance</li>
                            </ul>
                          </li>
                          <li>3. Optimization (Months 4+)
                            <ul className="pl-4 mt-1">
                              <li>- Analyze revenue mix</li>
                              <li>- Adjust pricing strategy</li>
                              <li>- Expand product lines</li>
                              <li>- Scale successful streams</li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'revenue-step-3',
              title: 'Analytics & Optimization',
              description: 'Track, analyze, and optimize revenue performance',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Revenue Analytics & Optimization
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement comprehensive analytics tracking and optimization strategies across all revenue streams.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-indigo-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400`}>Key Performance Indicators</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>RPM (Revenue Per Mille):</strong> Track earnings per 1000 views</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Revenue Mix:</strong> Distribution across streams</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Conversion Rates:</strong> Member/merch purchase rates</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Sponsor Value:</strong> Brand deal ROI metrics</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Optimization Strategies</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>A/B Testing:</strong> Test pricing and offerings</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Funnel Analysis:</strong> Optimize conversion paths</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Audience Segmentation:</strong> Target specific groups</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Content Strategy:</strong> Align with revenue goals</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Analytics Tools</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>YouTube Analytics:</strong> Revenue & performance data</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Google Analytics:</strong> Traffic & conversion tracking</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Custom Dashboards:</strong> Revenue stream tracking</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Third-party Tools:</strong> Advanced analytics</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Growth Metrics</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Revenue Growth:</strong> Month-over-month tracking</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Lifetime Value:</strong> Member & customer value</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Churn Rate:</strong> Member retention metrics</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>ROI:</strong> Investment performance tracking</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Optimization Framework
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} rounded-lg p-4`}>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Data Collection & Analysis
                            <ul className="pl-4 mt-1">
                              <li>- Set up comprehensive tracking</li>
                              <li>- Define key metrics for each stream</li>
                              <li>- Create automated reporting</li>
                              <li>- Establish benchmarks</li>
                            </ul>
                          </li>
                          <li>2. Strategic Testing
                            <ul className="pl-4 mt-1">
                              <li>- Design A/B test experiments</li>
                              <li>- Test pricing strategies</li>
                              <li>- Optimize conversion funnels</li>
                              <li>- Validate hypotheses</li>
                            </ul>
                          </li>
                          <li>3. Continuous Improvement
                            <ul className="pl-4 mt-1">
                              <li>- Implement winning strategies</li>
                              <li>- Monitor impact on revenue</li>
                              <li>- Refine based on data</li>
                              <li>- Scale successful approaches</li>
                            </ul>
                          </li>
                        </ol>
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
      title: 'Step-by-Step Performance Optimization',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Optimize video performance and loading speed',
      sections: [
        {
          id: 'video-performance',
          title: '⚡ Video Performance',
          description: 'Optimize video loading and playback performance',
          steps: [
            {
              id: 'performance-step-1',
              title: 'Video Compression & Encoding',
              description: 'Master advanced video compression and encoding techniques',
              estimated_time: '45 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Video Compression Optimization
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master advanced video compression techniques to achieve optimal balance between quality and file size, ensuring efficient delivery across all platforms and network conditions.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Codec Selection & Configuration</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>H.264/AVC:</strong> Most compatible codec, ideal for broad device support
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- High profile for 1080p/4K (Level 4.1/5.1)</li>
                              <li>- Main profile for mobile (Level 3.1/4.0)</li>
                              <li>- Baseline profile for legacy devices</li>
                              <li>- CABAC entropy coding for better compression</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>H.265/HEVC:</strong> Advanced codec for higher efficiency
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Main10 profile for HDR content</li>
                              <li>- 20-30% better compression vs H.264</li>
                              <li>- Optimal for 4K/8K resolution</li>
                              <li>- Hardware acceleration requirements</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>AV1:</strong> Next-generation open codec
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- 30-40% better compression vs HEVC</li>
                              <li>- Royalty-free implementation</li>
                              <li>- Growing device/browser support</li>
                              <li>- Higher encoding complexity</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>VP9:</strong> Alternative for specific platforms
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- YouTube's preferred format</li>
                              <li>- Good for WebM container</li>
                              <li>- Chrome/Android optimization</li>
                              <li>- Profile 2 for HDR support</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Resolution & Bitrate Optimization</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>4K (2160p) Settings:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- High motion: 35-45 Mbps</li>
                              <li>- Standard content: 20-30 Mbps</li>
                              <li>- Animation: 15-24 Mbps</li>
                              <li>- HDR overhead: +20-30%</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>1080p Configuration:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Sports/Action: 8-12 Mbps</li>
                              <li>- General content: 4-8 Mbps</li>
                              <li>- Animation: 3-6 Mbps</li>
                              <li>- Live streaming: 4.5-6 Mbps</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>720p Optimization:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- High motion: 3.5-5 Mbps</li>
                              <li>- Standard: 2.5-4 Mbps</li>
                              <li>- Mobile target: 1.5-2.5 Mbps</li>
                              <li>- Low bandwidth: 1-1.5 Mbps</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>480p and Below:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Standard: 1-2 Mbps</li>
                              <li>- Mobile fallback: 600-900 Kbps</li>
                              <li>- Minimum viable: 400-600 Kbps</li>
                              <li>- Audio-focused: 300-500 Kbps</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Encoding Parameters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Frame Rate & Motion</h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>60 FPS Settings:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Gaming/Sports content</li>
                                <li>- Motion interpolation settings</li>
                                <li>- +50% bitrate requirement</li>
                                <li>- Hardware decode verification</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>30 FPS Optimization:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Standard video content</li>
                                <li>- Mobile battery optimization</li>
                                <li>- Bandwidth efficiency</li>
                                <li>- Universal compatibility</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>24 FPS Film Content:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Cinema-style content</li>
                                <li>- Pulldown handling</li>
                                <li>- Frame blending settings</li>
                                <li>- Judder prevention</li>
                              </ul>
                            </span>
                          </li>
                      </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">GOP & Keyframe Settings</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Keyframe Interval:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- 2 seconds (default)</li>
                                <li>- 1 second for live content</li>
                                <li>- 4 seconds for static content</li>
                                <li>- Scene change detection</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>B-Frame Configuration:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Maximum: 3-4 frames</li>
                                <li>- Reference buffer size</li>
                                <li>- Adaptive B-frame decision</li>
                                <li>- Pyramid structure</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Reference Frames:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- 3-5 frames optimal</li>
                                <li>- Memory buffer impact</li>
                                <li>- Device compatibility</li>
                                <li>- Quality vs performance</li>
                              </ul>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    </div>
                    
                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Quality Control & Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Quality Metrics</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>VMAF Scoring:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Target: 90+ for premium</li>
                                <li>- 75-85 for standard</li>
                                <li>- 70+ for mobile</li>
                                <li>- Model selection</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>SSIM Analysis:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Minimum: 0.95+</li>
                                <li>- Per-frame analysis</li>
                                <li>- Multi-scale SSIM</li>
                                <li>- HDR consideration</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>PSNR Thresholds:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Target: 40+ dB</li>
                                <li>- Minimum: 35 dB</li>
                                <li>- Peak analysis</li>
                                <li>- Frame comparison</li>
                              </ul>
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Artifact Prevention</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Blocking Artifacts:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Deblocking strength</li>
                                <li>- QP threshold</li>
                                <li>- Edge detection</li>
                                <li>- Adaptive filtering</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Banding Prevention:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Dithering techniques</li>
                                <li>- Bit depth handling</li>
                                <li>- Gradient analysis</li>
                                <li>- Color space consideration</li>
                              </ul>
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span><strong>Noise Handling:</strong>
                              <ul className="pl-4 mt-2 space-y-1">
                                <li>- Grain synthesis</li>
                                <li>- Adaptive strength</li>
                                <li>- Source preservation</li>
                                <li>- Film grain SEI</li>
                              </ul>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Implementation Guide</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">FFmpeg Command Templates</h4>
                        <div className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <div>
                            <p className="font-medium mb-2">1. High-Quality H.264 Encoding:</p>
                            <pre className={`p-3 rounded ${theme === 'gradient' ? 'bg-gray-900' : 'bg-gray-100 dark:bg-gray-900'}`}>
                              ffmpeg -i input.mp4 -c:v libx264 -preset slower -crf 18 \
                              -x264-params "keyint=48:min-keyint=48:no-scenecut=1" \
                              -profile:v high -level:v 4.1 \
                              -movflags +faststart -c:a aac -b:a 192k output.mp4
                            </pre>
                          </div>
                          <div>
                            <p className="font-medium mb-2">2. HEVC/H.265 HDR Encoding:</p>
                            <pre className={`p-3 rounded ${theme === 'gradient' ? 'bg-gray-900' : 'bg-gray-100 dark:bg-gray-900'}`}>
                              ffmpeg -i input.mp4 -c:v libx265 -preset medium -crf 22 \
                              -x265-params "keyint=60:min-keyint=60:no-scenecut=1" \
                              -tag:v hvc1 -pix_fmt yuv420p10le \
                              -color_primaries bt2020 -color_trc smpte2084 \
                              -colorspace bt2020nc output.mp4
                            </pre>
                          </div>
                          <div>
                            <p className="font-medium mb-2">3. AV1 Next-Gen Encoding:</p>
                            <pre className={`p-3 rounded ${theme === 'gradient' ? 'bg-gray-900' : 'bg-gray-100 dark:bg-gray-900'}`}>
                              ffmpeg -i input.mp4 -c:v libaom-av1 -crf 30 -b:v 0 \
                              -strict experimental -cpu-used 4 \
                              -row-mt 1 -tiles 2x2 -threads 8 \
                              -g 240 -aom-params "enable-qm=1" output.mkv
                            </pre>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Quality Verification Process</h4>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Source Analysis
                            <ul className="pl-4 mt-1">
                              <li>- MediaInfo inspection</li>
                              <li>- Frame rate verification</li>
                              <li>- Color space check</li>
                              <li>- HDR metadata validation</li>
                            </ul>
                          </li>
                          <li>2. Encoding Verification
                            <ul className="pl-4 mt-1">
                              <li>- VMAF score calculation</li>
                              <li>- SSIM/PSNR analysis</li>
                              <li>- Bitrate consistency check</li>
                              <li>- GOP structure validation</li>
                            </ul>
                          </li>
                          <li>3. Platform Testing
                            <ul className="pl-4 mt-1">
                              <li>- Multi-device playback</li>
                              <li>- Browser compatibility</li>
                              <li>- Network simulation</li>
                              <li>- CPU/GPU load analysis</li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-2',
              title: 'Adaptive Streaming Setup',
              description: 'Implement adaptive bitrate streaming',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Adaptive Streaming Implementation
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up adaptive bitrate streaming to deliver optimal video quality across varying network conditions and devices.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Streaming Protocols</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>HLS Implementation:</strong> 6-second segments, EXT-X-VERSION:6, encrypted segments, I-frame playlists</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>DASH Configuration:</strong> Dynamic MPD, segment templates, multi-period content, common encryption</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Multi-bitrate Ladder:</strong> 6-8 quality levels, 1.5x bitrate steps, resolution-based switching</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>CDN Setup:</strong> Edge caching, token authentication, geographic distribution, origin shielding</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-indigo-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400`}>Quality Switching</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Buffer Management:</strong> 3-tier buffer (12s optimal, 8s warning, 4s critical), preload strategies</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Quality Selection:</strong> Throughput-based (1.5x safety factor), buffer-based hybrid approach</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Network Adaptation:</strong> EWMA bandwidth estimation, rapid up-switch, conservative down-switch</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Error Recovery:</strong> Segment retry logic, fallback CDNs, automatic quality reduction</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Low-Latency Streaming</h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• LL-HLS with partial segments</li>
                          <li>• CMAF chunk encoding</li>
                          <li>• Reduced segment duration</li>
                          <li>• HTTP/2 push promises</li>
                      </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">DRM Integration</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Multi-DRM support</li>
                          <li>• Key rotation</li>
                          <li>• License delivery</li>
                          <li>• Offline playback</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-5',
              title: 'Mobile Performance',
              description: 'Optimize video delivery for mobile devices',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Mobile-First Optimization
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement specialized optimizations for mobile devices, considering bandwidth constraints, battery life, and varying network conditions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-pink-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-pink-600 dark:text-pink-400`}>Device Optimization</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Screen Adaptation:</strong> Resolution switching (360p-1080p), aspect ratio handling, viewport optimization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Battery Efficiency:</strong> CPU/GPU usage monitoring, background playback modes, power-saving profiles</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Memory Management:</strong> Buffer size limits (15-30s), aggressive garbage collection, texture memory optimization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Touch Interface:</strong> Custom controls, gesture support, scrubbing optimization, fullscreen transitions</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Network Handling</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Connection Detection:</strong> Network type detection (4G/5G/WiFi), bandwidth estimation, connection stability monitoring</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Adaptive Streaming:</strong> Dynamic quality switching, reduced segment size (2-4s), aggressive buffer management</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Offline Support:</strong> Progressive downloads, smart caching strategies, background preloading</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Data Saving:</strong> Bandwidth caps, quality limits by network, data usage tracking and alerts</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Mobile-Specific Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Platform Integration</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Native player bridging (ExoPlayer/AVPlayer)</li>
                          <li>• Picture-in-Picture support</li>
                          <li>• System audio integration</li>
                          <li>• Background playback modes</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">User Experience</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Mobile-optimized controls</li>
                          <li>• Orientation handling</li>
                          <li>• Lock screen controls</li>
                          <li>• Download management UI</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-6',
              title: 'Real-Time Streaming',
              description: 'Optimize live and real-time video delivery',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-indigo-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Real-Time Performance
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement advanced optimizations for live streaming and real-time video delivery with minimal latency.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-indigo-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400`}>Latency Optimization</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Low-Latency HLS:</strong> Partial segments (200ms), preload hints, aggressive buffer management (2-4s)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>WebRTC Integration:</strong> P2P connections, TURN/STUN setup, ICE candidate optimization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Stream Synchronization:</strong> NTP time sync, frame accurate playback, multi-stream alignment</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Buffer Strategy:</strong> Dynamic buffer size (1-4s), keyframe alignment, GOP optimization</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Users className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Scalability Features</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Connection Management:</strong> WebSocket optimization, connection pooling, heartbeat monitoring</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Load Balancing:</strong> Geographic distribution, edge server selection, automatic failover</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Quality Management:</strong> Dynamic encoding profiles, bandwidth adaptation (500kbps-8Mbps)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Error Resilience:</strong> Packet loss recovery, stream reconnection, error concealment</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Streaming Features</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Interactive Features</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time chat synchronization</li>
                          <li>• Live reactions and overlays</li>
                          <li>• Dynamic quality switching</li>
                          <li>• Multi-camera switching</li>
                        </ul>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Monitoring & Analytics</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time viewer metrics</li>
                          <li>• Quality of service monitoring</li>
                          <li>• Network performance tracking</li>
                          <li>• Automated issue detection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-7',
              title: 'Infrastructure Optimization',
              description: 'Optimize server-side and delivery infrastructure',
              estimated_time: '50 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-cyan-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Infrastructure Performance
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement comprehensive server-side optimizations and delivery infrastructure improvements for maximum performance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-cyan-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400`}>Server Optimization</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Origin Server:</strong> Load balancing, auto-scaling (CPU 60-80%), request queuing, connection pooling</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Storage Optimization:</strong> Caching layers (L1/L2), hot/cold storage, content replication</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Processing Pipeline:</strong> Parallel encoding, GPU acceleration, job prioritization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Security Measures:</strong> DDoS protection, token authentication, request rate limiting</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Share2 className="h-6 w-6 text-teal-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-teal-600 dark:text-teal-400`}>Delivery Network</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>CDN Configuration:</strong> Multi-CDN setup, optimal routing, cache hit ratio optimization (&gt;95%)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Edge Computing:</strong> Edge transcoding, dynamic packaging, regional optimization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Network Protocols:</strong> HTTP/3 support, TLS 1.3, QUIC implementation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Traffic Management:</strong> Geographic routing, load shedding, traffic shaping</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Infrastructure Management</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Monitoring & Alerts</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Infrastructure health monitoring</li>
                          <li>• Performance metrics tracking</li>
                          <li>• Automated scaling triggers</li>
                          <li>• Cost optimization analysis</li>
                        </ul>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Disaster Recovery</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Multi-region failover</li>
                          <li>• Backup and restoration</li>
                          <li>• Data replication strategy</li>
                          <li>• Recovery time objectives</li>
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
          id: 'player-optimization',
          title: '🎮 Player Performance',
          description: 'Optimize video player settings and behavior',
          steps: [
            {
              id: 'performance-step-3',
              title: 'Player Configuration',
              description: 'Optimize video player settings for performance',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Player Optimization
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Fine-tune player settings and implement advanced optimizations for seamless video playback experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <PlayCircle className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Playback Settings</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Preload Strategy:</strong> Metadata preload for quick starts, auto-preload for playlists, dynamic preload distance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Buffer Configuration:</strong> Forward buffer (30-60s), back buffer (30s), live edge delay (3-6s)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Quality Selection:</strong> Initial quality rules, startup quality logic, quality caps by device</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Resource Management:</strong> Memory limits, source buffer cleanup, garbage collection hints</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Loader2 className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>Loading Optimization</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Startup Time:</strong> Manifest prefetch, parallel initialization, reduced quality for quick start</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Thumbnail Loading:</strong> Sprite sheets, lazy loading, WebP format, resolution optimization</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Progressive Enhancement:</strong> Quality ramp-up, staggered resource loading, priority queuing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Cache Strategy:</strong> Browser cache headers, manifest caching, segment cache management</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`mt-6 ${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Player Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Advanced Playback</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Trick play support (fast-forward, rewind)</li>
                          <li>• Frame-accurate seeking</li>
                          <li>• Time-shift buffer management</li>
                          <li>• Multi-audio/subtitle tracks</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Performance Features</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Hardware acceleration detection</li>
                          <li>• Background playback optimization</li>
                          <li>• Memory leak prevention</li>
                          <li>• Error resilience features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'performance-step-4',
              title: 'Performance Monitoring',
              description: 'Set up performance tracking and optimization',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Performance Analytics
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement comprehensive monitoring systems to track, analyze, and optimize video performance metrics.
                    </p>
                  </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Metrics Tracking</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Startup Performance:</strong> Time to first frame, time to play, player initialization time</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Playback Health:</strong> Buffer levels, download speed, available bandwidth, dropped frames</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Quality Metrics:</strong> Bitrate switches, average bitrate, quality score, rendering performance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Error Tracking:</strong> Network errors, player errors, recovery attempts, error patterns</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-6 w-6 text-red-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400`}>User Experience</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Playback Smoothness:</strong> Rebuffering ratio, playback continuity, frame drop rate</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Stall Analysis:</strong> Frequency, duration, cause identification, impact assessment</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Interaction Metrics:</strong> Seek time, UI responsiveness, player controls usage</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>QoE Scoring:</strong> MOS calculation, viewer satisfaction index, engagement metrics</span>
                        </li>
                      </ul>
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
              title: 'Understanding SEO Fundamentals & AI Enhancement',
              description: 'Learn SEO basics and how AI can supercharge your video optimization',
              estimated_time: '45 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      SEO Fundamentals &amp; AI-Powered Optimization
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the fundamentals of Search Engine Optimization (SEO) for videos and discover how AI tools can dramatically enhance your content's discoverability, reach, and ranking performance across platforms.
                    </p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎯 What is SEO for Videos?
                    </h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <strong>SEO (Search Engine Optimization)</strong> is the practice of optimizing your video content to rank higher in search results on platforms like YouTube, Google, and social media. It involves strategic use of keywords, metadata, and content structure to help algorithms understand and recommend your videos to the right audience.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Why SEO Matters:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 70% of YouTube traffic comes from search</li>
                            <li>• Higher rankings = more views &amp; subscribers</li>
                            <li>• Better discoverability across platforms</li>
                            <li>• Increased organic reach without ads</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Key SEO Elements:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Video titles with target keywords</li>
                            <li>• Detailed, keyword-rich descriptions</li>
                            <li>• Strategic tags and categories</li>
                            <li>• Custom thumbnails &amp; closed captions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Search className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Traditional SEO Research</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Manual Research Methods:</h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• YouTube Search Suggestions (autocomplete)</li>
                            <li>• Google Keyword Planner (free tool)</li>
                            <li>• TubeBuddy &amp; VidIQ browser extensions</li>
                            <li>• Manual competitor analysis</li>
                            <li>• Google Trends for trending topics</li>
                      </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <strong>Time Investment:</strong> 2-4 hours per video for comprehensive research
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>AI-Enhanced SEO Research</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">AI-Powered Tools &amp; Methods:</h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• ChatGPT/Claude for keyword brainstorming</li>
                            <li>• AI content analysis tools (Jasper, Copy.ai)</li>
                            <li>• Automated competitor research (SEMrush AI)</li>
                            <li>• AI-powered trend prediction</li>
                            <li>• Smart tag generation &amp; optimization</li>
                      </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-purple-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>
                            <strong>Time Investment:</strong> 15-30 minutes per video with 10x better results
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🤖 AI SEO Enhancement Strategies
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Target className="h-5 w-5 text-blue-500 mr-2" />
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Smart Keyword Research</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-generated keyword clusters</li>
                          <li>• Semantic keyword analysis</li>
                          <li>• Long-tail keyword discovery</li>
                          <li>• Search intent prediction</li>
                          <li>• Competitive gap analysis</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-600 dark:text-green-400">Content Optimization</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-optimized titles &amp; descriptions</li>
                          <li>• Automatic tag suggestions</li>
                          <li>• Content structure recommendations</li>
                          <li>• Thumbnail text optimization</li>
                          <li>• Caption &amp; transcript enhancement</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <BarChart2 className="h-5 w-5 text-orange-500 mr-2" />
                          <h4 className="font-medium text-orange-600 dark:text-orange-400">Performance Tracking</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-powered analytics insights</li>
                          <li>• Automated A/B testing</li>
                          <li>• Ranking change predictions</li>
                          <li>• Performance optimization alerts</li>
                          <li>• Competitor monitoring automation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/50 dark:to-purple-900/50'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      ⚡ Quick Start: AI SEO Workflow
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-blue-600 dark:text-blue-400">Step 1: AI Keyword Discovery</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt Example:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'} text-xs`}>
                              "Generate 20 SEO keywords for a YouTube video about [your topic]. Include long-tail keywords, search volume estimates, and difficulty scores."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Step 2: AI Content Optimization</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt Example:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'} text-xs`}>
                              "Create 5 SEO-optimized YouTube titles using these keywords: [keywords]. Make them engaging and click-worthy while maintaining search optimization."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white/70 dark:bg-gray-700/50'} border-l-4 border-green-500 pl-4 py-2`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Pro Tip:</strong> AI can analyze your existing top-performing videos and suggest optimization strategies based on what's already working for your channel.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Foundation Setup:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Set up AI tool accounts (ChatGPT, Claude, etc.)</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Install browser extensions (TubeBuddy/VidIQ)</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create keyword research templates</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Analyze 3 competitor channels</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">AI Implementation:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Test AI keyword generation prompts</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create AI-optimized title variations</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Generate AI-enhanced descriptions</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Set up performance tracking system</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-optimize-seo-step-2',
              title: 'AI-Powered Competitor Analysis & Keyword Research',
              description: 'Use AI to analyze competitors and discover high-impact keywords',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      AI-Powered Competitor Analysis &amp; Keyword Research
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Leverage AI tools to conduct deep competitor analysis and discover high-impact keywords that your competitors are ranking for, while identifying content gaps and opportunities in your niche.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎯 Why Competitor Analysis is Crucial
                    </h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <strong>Competitor analysis</strong> reveals what's already working in your niche, helping you identify proven keyword strategies, content gaps, and optimization opportunities that you can leverage for your own videos.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Discover Winning Keywords:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Find keywords driving competitor traffic</li>
                            <li>• Identify low-competition opportunities</li>
                            <li>• Discover trending search terms</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Content Gap Analysis:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Find topics competitors miss</li>
                            <li>• Identify underserved audiences</li>
                            <li>• Spot content improvement opportunities</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Strategy Insights:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Learn from successful formats</li>
                            <li>• Understand audience preferences</li>
                            <li>• Optimize content timing &amp; frequency</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Users className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Manual Competitor Research</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Traditional Methods:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Manually browse competitor channels</li>
                            <li>• Check individual video titles &amp; descriptions</li>
                            <li>• Track competitor rankings over time</li>
                            <li>• Analyze comment sections for insights</li>
                            <li>• Use basic YouTube search filters</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <strong>Limitations:</strong> Time-intensive, limited scope, prone to human error, difficult to scale
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>AI-Enhanced Analysis</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">AI-Powered Tools &amp; Techniques:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• AI bulk competitor analysis (VidIQ AI, TubeBuddy)</li>
                            <li>• ChatGPT/Claude for strategy analysis</li>
                            <li>• Automated keyword extraction tools</li>
                            <li>• AI-powered trend identification</li>
                            <li>• Bulk content analysis &amp; insights</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-purple-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>
                            <strong>Advantages:</strong> Analyze 100+ competitors in minutes, deep insights, pattern recognition
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🔍 AI Competitor Analysis Workflow
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Target className="h-5 w-5 text-orange-500 mr-2" />
                          <h4 className="font-medium text-orange-600 dark:text-orange-400">Step 1: Competitor Identification</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use AI to find similar channels in your niche</li>
                          <li>• Analyze subscriber count &amp; engagement rates</li>
                          <li>• Identify direct &amp; indirect competitors</li>
                          <li>• Group competitors by content type &amp; audience</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Search className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-600 dark:text-green-400">Step 2: Keyword Extraction</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Extract keywords from top-performing videos</li>
                          <li>• Analyze title patterns &amp; structures</li>
                          <li>• Identify recurring themes &amp; topics</li>
                          <li>• Map keywords to search volume &amp; competition</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' : 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/50 dark:to-red-900/50'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🤖 AI Prompts for Competitor Analysis
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-orange-600 dark:text-orange-400">Competitor Research Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'} text-xs`}>
                              "Analyze these competitor YouTube channels: [channel names]. Identify their top 10 keywords, content patterns, posting frequency, and engagement strategies. Suggest 5 content gaps I could fill."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-red-600 dark:text-red-400">Keyword Gap Analysis:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'} text-xs`}>
                              "Compare my channel keywords [your keywords] with competitor keywords [competitor keywords]. Find 15 high-opportunity keywords I'm missing that have good search volume but low competition."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white/70 dark:bg-gray-700/50'} border-l-4 border-yellow-500 pl-4 py-2`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Pro Tip:</strong> Use AI to analyze competitor comment sections for audience pain points and content requests that aren't being addressed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Competitor Research:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Identify 10-15 direct competitors in your niche</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Use AI to analyze their top-performing videos</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Extract keywords from competitor titles</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Analyze competitor posting schedules</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Keyword Discovery:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Generate AI-powered keyword clusters</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Identify content gaps &amp; opportunities</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create keyword priority matrix</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Set up competitor monitoring alerts</span>
                          </li>
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
          id: 'title-optimization',
          title: '📝 Title & Description Optimization',
          description: 'Craft compelling, SEO-friendly titles and descriptions',
          steps: [
            {
              id: 'video-optimize-seo-step-3',
              title: 'AI-Optimized Title &amp; Description Creation',
              description: 'Create compelling, SEO-optimized titles and descriptions using AI',
              estimated_time: '35 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      AI-Optimized Title &amp; Description Creation
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of creating titles and descriptions that rank high in search results while compelling viewers to click. Learn how AI can generate multiple optimized variations and help you choose the most effective options.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      📝 The Science of SEO Titles &amp; Descriptions
                    </h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Your title is the first thing both search algorithms and viewers see. It needs to balance <strong>SEO optimization</strong> (keywords, searchability) with <strong>human psychology</strong> (curiosity, emotion, value proposition) to maximize both rankings and click-through rates.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">SEO Elements (Algorithm):</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Primary keyword in first 60 characters</li>
                            <li>• Secondary keywords naturally integrated</li>
                            <li>• Optimal length (60-70 characters)</li>
                            <li>• Relevant to video content &amp; category</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-pink-600 dark:text-pink-400">Psychology Elements (Human):</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Emotional triggers (curiosity, urgency, benefit)</li>
                            <li>• Power words (ultimate, secret, proven, easy)</li>
                            <li>• Numbers &amp; specificity (5 tips, 2024 guide)</li>
                            <li>• Clear value proposition (what viewer gains)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Hash className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>Traditional Title Creation</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Manual Process:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Brainstorm 5-10 title ideas manually</li>
                            <li>• Check keyword placement &amp; length</li>
                            <li>• Test emotional appeal subjectively</li>
                            <li>• Write descriptions from scratch</li>
                            <li>• Manually add tags &amp; timestamps</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <strong>Challenges:</strong> Limited creativity, time-consuming, inconsistent quality, no data-driven insights
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>AI-Enhanced Creation</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">AI-Powered Process:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Generate 20+ title variations instantly</li>
                            <li>• Automatic keyword optimization</li>
                            <li>• Psychology-based title scoring</li>
                            <li>• AI-written SEO descriptions</li>
                            <li>• Smart tag generation &amp; suggestions</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-purple-900/30' : 'bg-purple-100 dark:bg-purple-900/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'}`}>
                            <strong>Benefits:</strong> Endless creativity, data-driven optimization, consistent quality, A/B testing ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎯 AI Title &amp; Description Optimization Framework
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Title Optimization</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Keyword-first structure</li>
                          <li>• Emotional hook integration</li>
                          <li>• Length optimization (60-70 chars)</li>
                          <li>• Click-worthy power words</li>
                          <li>• A/B testing variations</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-600 dark:text-green-400">Description Strategy</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Front-load key information</li>
                          <li>• Natural keyword integration</li>
                          <li>• Compelling first 125 characters</li>
                          <li>• Call-to-action placement</li>
                          <li>• Relevant links &amp; resources</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Hash className="h-5 w-5 text-purple-500 mr-2" />
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Tag &amp; Metadata</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Primary &amp; secondary keywords</li>
                          <li>• Long-tail keyword variations</li>
                          <li>• Trending topic tags</li>
                          <li>• Category-specific tags</li>
                          <li>• Branded &amp; channel tags</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-pink-900/50 to-purple-900/50' : 'bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/50 dark:to-purple-900/50'} border ${theme === 'gradient' ? 'border-pink-700' : 'border-pink-200 dark:border-pink-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🤖 AI Prompts for Title &amp; Description Creation
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-pink-600 dark:text-pink-400">Title Generation Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-pink-300' : 'text-pink-600 dark:text-pink-300'} text-xs`}>
                              "Create 10 YouTube titles for a video about [topic]. Include primary keyword '[keyword]' in first 60 characters. Use emotional triggers, power words, and make them click-worthy. Optimize for both SEO and CTR."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Description Writing Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'} text-xs`}>
                              "Write a 300-word YouTube description for '[video title]'. Include keywords [list], compelling first 125 characters, clear value proposition, timestamps, and strong call-to-action. Make it SEO-optimized and engaging."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-indigo-600 dark:text-indigo-400">Tag Generation Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-300'} text-xs`}>
                              "Generate 15 YouTube tags for '[video title]' in [niche]. Include 3 broad keywords, 7 specific long-tail keywords, 3 trending tags, and 2 branded tags. Prioritize by search volume and competition."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-teal-600 dark:text-teal-400">A/B Testing Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-teal-300' : 'text-teal-600 dark:text-teal-300'} text-xs`}>
                              "Create 5 A/B test variations of this title: '[original title]'. Test different emotional appeals (curiosity vs benefit vs urgency), keyword placement, and power words. Explain the psychology behind each variation."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white/70 dark:bg-gray-700/50'} border-l-4 border-yellow-500 pl-4 py-2`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Pro Tip:</strong> Use AI to analyze your top-performing titles and create templates based on what works best for your audience and niche.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Title Optimization:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Generate 10+ AI title variations per video</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Test different emotional triggers</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Optimize keyword placement (first 60 chars)</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create A/B testing variations</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Description &amp; Metadata:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Write compelling first 125 characters</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Include strategic keyword placement</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Generate 15+ relevant tags</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Add timestamps &amp; call-to-actions</span>
                          </li>
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
              title: 'AI-Powered Hook &amp; Retention Strategies',
              description: 'Use AI to create compelling openings and maintain viewer interest throughout videos',
              estimated_time: '40 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      AI-Powered Hook &amp; Retention Strategies
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the art of creating irresistible video openings and maintaining viewer engagement throughout your content using AI-powered strategies and psychological techniques that keep audiences watching until the end.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎯 Why Engagement &amp; Retention Matter
                    </h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <strong>Viewer engagement and retention</strong> are the most critical factors for YouTube success. The algorithm prioritizes videos that keep viewers watching, leading to better rankings, more recommendations, and exponential growth.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Algorithm Benefits:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Higher search rankings</li>
                            <li>• More suggested video placements</li>
                            <li>• Increased organic reach</li>
                            <li>• Better browse features placement</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Viewer Metrics:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Average view duration increases</li>
                            <li>• Watch time percentage improves</li>
                            <li>• Session duration extends</li>
                            <li>• Return viewer rate grows</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Channel Growth:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Subscriber conversion improves</li>
                            <li>• Engagement rates increase</li>
                            <li>• Community building accelerates</li>
                            <li>• Monetization opportunities expand</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Traditional Hook Techniques</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Manual Engagement Methods:</h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Pattern interrupts (sudden changes)</li>
                            <li>• Preview highlights (teasing content)</li>
                            <li>• Question openings (curiosity gaps)</li>
                            <li>• Shocking statements (attention grabbers)</li>
                            <li>• Story-based intros (narrative hooks)</li>
                      </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <strong>Limitations:</strong> Hit-or-miss effectiveness, requires experience, time-intensive to perfect
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-cyan-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400`}>AI-Enhanced Engagement</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">AI-Powered Hook Creation:</h4>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Psychology-based hook generation</li>
                            <li>• Audience-specific opening scripts</li>
                            <li>• Retention curve optimization</li>
                            <li>• Dynamic pacing recommendations</li>
                            <li>• Emotional trigger identification</li>
                      </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-cyan-900/30' : 'bg-cyan-100 dark:bg-cyan-900/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'}`}>
                            <strong>Advantages:</strong> Data-driven hooks, proven psychological principles, scalable content creation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🧠 AI Engagement Optimization Framework
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <PlayCircle className="h-5 w-5 text-red-500 mr-2" />
                          <h4 className="font-medium text-red-600 dark:text-red-400">Hook Strategies</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-generated curiosity gaps</li>
                          <li>• Psychological pattern interrupts</li>
                          <li>• Benefit-driven openings</li>
                          <li>• Story-based engagement</li>
                          <li>• Problem-solution hooks</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Clock className="h-5 w-5 text-orange-500 mr-2" />
                          <h4 className="font-medium text-orange-600 dark:text-orange-400">Retention Tactics</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Dynamic pacing optimization</li>
                          <li>• Strategic preview placement</li>
                          <li>• Engagement loop creation</li>
                          <li>• Visual variety planning</li>
                          <li>• Interaction prompt timing</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-600 dark:text-green-400">Performance Tracking</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Retention graph analysis</li>
                          <li>• Drop-off point identification</li>
                          <li>• Engagement spike tracking</li>
                          <li>• A/B testing hooks</li>
                          <li>• Optimization recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🤖 AI Prompts for Hook &amp; Retention Creation
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Hook Generation Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'} text-xs`}>
                              "Create 5 compelling video hooks for '[video topic]' targeting [audience]. Use psychological triggers: curiosity, urgency, benefit, controversy, and story. Each hook should be 15-30 seconds and create strong retention."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-pink-600 dark:text-pink-400">Retention Strategy Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-pink-300' : 'text-pink-600 dark:text-pink-300'} text-xs`}>
                              "Design a retention strategy for a [duration] video about '[topic]'. Include: pacing changes, preview placements, interaction prompts, and re-engagement hooks every 2-3 minutes. Focus on maintaining 70%+ retention."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-indigo-600 dark:text-indigo-400">Pattern Interrupt Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-300'} text-xs`}>
                              "Generate 8 pattern interrupt techniques for '[content type]' videos. Include visual, audio, pacing, and content interrupts. Each should recapture attention within 3-5 seconds and feel natural to the flow."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-teal-600 dark:text-teal-400">Engagement Loop Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-teal-300' : 'text-teal-600 dark:text-teal-300'} text-xs`}>
                              "Create an engagement loop structure for '[video topic]'. Design: setup → tension → partial payoff → new tension → resolution. Include specific timestamps and transition phrases for a [duration] video."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white/70 dark:bg-gray-700/50'} border-l-4 border-yellow-500 pl-4 py-2`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Pro Tip:</strong> Use AI to analyze your retention graphs and identify exactly where viewers drop off, then generate targeted re-engagement strategies for those specific moments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Hook Development:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Generate 5+ AI-powered hook variations</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Test different psychological triggers</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create audience-specific openings</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Develop pattern interrupt library</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Retention Strategy:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Plan strategic preview placements</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Design engagement loop structures</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Set up retention graph monitoring</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create re-engagement trigger points</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'engagement-step-2',
              title: 'AI-Enhanced Interactive Elements &amp; Viewer Participation',
              description: 'Use AI to design and optimize interactive features that boost engagement',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-cyan-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      AI-Enhanced Interactive Elements &amp; Viewer Participation
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Transform passive viewers into active participants using AI-optimized interactive elements, strategic polling, dynamic cards, and engagement features that create deeper connections and dramatically improve retention rates.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎮 The Power of Interactive Content
                    </h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <strong>Interactive elements</strong> transform your videos from one-way broadcasts into engaging conversations. They create psychological investment, increase watch time, and build stronger community connections that drive long-term channel growth.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-cyan-600 dark:text-cyan-400">Engagement Boost:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 40% increase in average view duration</li>
                            <li>• 60% more comments &amp; interactions</li>
                            <li>• 25% higher click-through rates</li>
                            <li>• 35% better retention rates</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Psychological Impact:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Creates sense of participation</li>
                            <li>• Builds emotional investment</li>
                            <li>• Triggers curiosity &amp; anticipation</li>
                            <li>• Establishes two-way communication</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Algorithm Benefits:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Higher engagement signals</li>
                            <li>• Improved session duration</li>
                            <li>• Better recommendation priority</li>
                            <li>• Increased organic reach</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Traditional Interactive Methods</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Manual Interaction Techniques:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Basic polls &amp; questions</li>
                            <li>• Generic "like &amp; subscribe" requests</li>
                            <li>• Simple comment prompts</li>
                            <li>• Standard end screens</li>
                            <li>• Basic card placements</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <strong>Limitations:</strong> Low response rates, generic content, poor timing, minimal personalization
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-cyan-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400`}>AI-Optimized Interactions</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">AI-Enhanced Engagement Features:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Personalized poll questions</li>
                            <li>• Dynamic interaction timing</li>
                            <li>• Context-aware prompts</li>
                            <li>• Intelligent card sequences</li>
                            <li>• Adaptive engagement flows</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-cyan-900/30' : 'bg-cyan-100 dark:bg-cyan-900/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'}`}>
                            <strong>Advantages:</strong> 3x higher response rates, perfect timing, audience-specific content
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎯 AI Interactive Element Strategy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <BarChart2 className="h-5 w-5 text-purple-500 mr-2" />
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Smart Polls</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-generated questions</li>
                          <li>• Optimal timing placement</li>
                          <li>• Audience-specific topics</li>
                          <li>• Engagement-driven results</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <ExternalLink className="h-5 w-5 text-blue-500 mr-2" />
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Dynamic Cards</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Context-aware placement</li>
                          <li>• Personalized content</li>
                          <li>• Strategic call-to-actions</li>
                          <li>• Performance optimization</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-600 dark:text-green-400">Comment Triggers</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Thought-provoking prompts</li>
                          <li>• Controversy &amp; debate</li>
                          <li>• Personal story requests</li>
                          <li>• Opinion gathering</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Target className="h-5 w-5 text-orange-500 mr-2" />
                          <h4 className="font-medium text-orange-600 dark:text-orange-400">End Screens</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-optimized layouts</li>
                          <li>• Viewer journey mapping</li>
                          <li>• Conversion optimization</li>
                          <li>• Retention-focused design</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50' : 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/50 dark:to-blue-900/50'} border ${theme === 'gradient' ? 'border-cyan-700' : 'border-cyan-200 dark:border-cyan-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🤖 AI Prompts for Interactive Element Creation
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-cyan-600 dark:text-cyan-400">Poll Question Generator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-300'} text-xs`}>
                              "Create 5 engaging poll questions for a '[video topic]' video targeting [audience]. Make them thought-provoking, relevant to the content, and designed to spark discussion. Include optimal timing suggestions."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-blue-600 dark:text-blue-400">Comment Engagement Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'} text-xs`}>
                              "Design 7 comment-driving prompts for '[video topic]'. Include: opinion questions, personal experience requests, controversial takes, and community challenges. Each should encourage detailed responses."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Interactive Timing Strategy:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'} text-xs`}>
                              "Create an interactive element timeline for a [duration] '[video type]' video. Include: poll placements, card timings, comment prompts, and end screen optimization. Focus on maintaining engagement."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-green-600 dark:text-green-400">Card &amp; End Screen Optimizer:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-green-300' : 'text-green-600 dark:text-green-300'} text-xs`}>
                              "Optimize cards and end screens for '[channel niche]'. Create viewer journey maps, suggest related video connections, and design conversion-focused layouts. Include A/B testing variations."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white/70 dark:bg-gray-700/50'} border-l-4 border-yellow-500 pl-4 py-2`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Pro Tip:</strong> Use AI to analyze your most engaging videos and identify patterns in successful interactive elements, then replicate those strategies across your content.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-cyan-600 dark:text-cyan-400">Interactive Setup:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Generate AI-optimized poll questions</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Plan strategic card placements</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create comment engagement prompts</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Design interactive timing strategy</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Optimization &amp; Testing:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Optimize end screen layouts</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>A/B test interactive elements</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Monitor engagement analytics</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Refine based on performance data</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'engagement-step-3',
              title: 'AI-Optimized Call-to-Action Strategy &amp; Placement',
              description: 'Use AI to create and position compelling CTAs for maximum conversion',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      AI-Optimized Call-to-Action Strategy &amp; Placement
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master the science of strategic call-to-action placement using AI-powered timing optimization, psychological triggers, and conversion-focused messaging that transforms viewers into subscribers, commenters, and loyal community members.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      📢 The Psychology of Effective CTAs
                    </h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <strong>Call-to-actions (CTAs)</strong> are critical conversion moments that can make or break your channel growth. The key is not just asking for engagement, but strategically timing your requests when viewers are most emotionally invested and likely to take action.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Conversion Impact:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 300% higher subscription rates</li>
                            <li>• 150% more engagement actions</li>
                            <li>• 200% increase in comment activity</li>
                            <li>• 80% better viewer retention</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Timing Psychology:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Peak emotional moments</li>
                            <li>• Value delivery points</li>
                            <li>• Curiosity gap creation</li>
                            <li>• Social proof integration</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                          <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Channel Benefits:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Faster subscriber growth</li>
                            <li>• Higher engagement rates</li>
                            <li>• Stronger community building</li>
                            <li>• Better algorithm performance</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-6 w-6 text-yellow-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400`}>Traditional CTA Approaches</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Generic CTA Methods:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• "Please like and subscribe"</li>
                            <li>• Random timing placement</li>
                            <li>• One-size-fits-all messaging</li>
                            <li>• Interrupting content flow</li>
                            <li>• No emotional context</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <strong>Problems:</strong> Low conversion rates, viewer annoyance, disrupted flow, generic messaging
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Zap className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>AI-Optimized CTAs</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">AI-Enhanced CTA Strategy:</h4>
                          <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Emotionally-timed requests</li>
                            <li>• Personalized messaging</li>
                            <li>• Value-driven positioning</li>
                            <li>• Seamless content integration</li>
                            <li>• Psychology-based triggers</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-orange-900/30' : 'bg-orange-100 dark:bg-orange-900/30'} rounded p-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'}`}>
                            <strong>Results:</strong> 5x higher conversion rates, natural content flow, audience-specific messaging
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🎯 AI CTA Optimization Framework
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Clock className="h-5 w-5 text-blue-500 mr-2" />
                          <h4 className="font-medium text-blue-600 dark:text-blue-400">Timing Strategy</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Peak engagement moments</li>
                          <li>• Value delivery points</li>
                          <li>• Emotional high points</li>
                          <li>• Natural transition breaks</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                          <h4 className="font-medium text-green-600 dark:text-green-400">Message Crafting</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Value-first positioning</li>
                          <li>• Emotional trigger words</li>
                          <li>• Audience-specific language</li>
                          <li>• Clear benefit statements</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <Target className="h-5 w-5 text-purple-500 mr-2" />
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">Placement Optimization</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Strategic video positioning</li>
                          <li>• Visual &amp; audio integration</li>
                          <li>• Flow-preserving placement</li>
                          <li>• Multi-touchpoint strategy</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} border ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} rounded-lg p-4`}>
                        <div className="flex items-center mb-3">
                          <BarChart2 className="h-5 w-5 text-orange-500 mr-2" />
                          <h4 className="font-medium text-orange-600 dark:text-orange-400">Performance Tracking</h4>
                        </div>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Conversion rate monitoring</li>
                          <li>• A/B testing CTAs</li>
                          <li>• Engagement correlation</li>
                          <li>• Optimization iterations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50' : 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/50 dark:to-red-900/50'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      🤖 AI Prompts for CTA Optimization
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-orange-600 dark:text-orange-400">CTA Message Generator:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600 dark:text-orange-300'} text-xs`}>
                              "Create 5 compelling CTA messages for '[video topic]' targeting [audience]. Focus on value-first positioning, emotional triggers, and specific benefits. Include subscribe, like, comment, and share variations."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-red-600 dark:text-red-400">Timing Strategy Prompt:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-red-300' : 'text-red-600 dark:text-red-300'} text-xs`}>
                              "Design optimal CTA placement strategy for a [duration] '[video type]' video. Identify: peak engagement moments, value delivery points, emotional highs, and natural breaks for maximum conversion."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-purple-600 dark:text-purple-400">Psychology-Based CTA:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-300'} text-xs`}>
                              "Create psychology-driven CTAs using: reciprocity, social proof, scarcity, authority, and commitment principles. Tailor for '[niche]' audience with specific emotional triggers and behavioral motivators."
                            </code>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3 text-blue-600 dark:text-blue-400">A/B Testing Framework:</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white/50 dark:bg-gray-800/50'} rounded p-3 text-sm`}>
                            <p className={`mb-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>AI Prompt:</strong>
                            </p>
                            <code className={`block ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600 dark:text-blue-300'} text-xs`}>
                              "Design A/B testing framework for CTAs testing: timing variations, message approaches, visual presentations, and psychological triggers. Include success metrics and optimization strategies."
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white/70 dark:bg-gray-700/50'} border-l-4 border-yellow-500 pl-4 py-2`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <strong>Pro Tip:</strong> Use AI to analyze your highest-converting videos and identify the exact moments and messaging that drive the most subscriber growth and engagement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Action Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">CTA Development:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Create value-driven CTA messages</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Design psychology-based triggers</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Develop audience-specific language</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Plan multi-touchpoint strategy</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Optimization &amp; Testing:</h4>
                        <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Optimize timing &amp; placement</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Set up A/B testing framework</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Monitor conversion metrics</span>
                          </li>
                          <li className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span>Iterate based on performance data</span>
                          </li>
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
              title: 'Thumbnail Design Fundamentals',
              description: 'Master the core principles of effective thumbnail design',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-pink-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Thumbnail Design Essentials
                    </h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Learn the fundamental principles of creating eye-catching thumbnails that drive higher click-through rates.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Image className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Design Elements</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Visual Hierarchy:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Clear focal point</li>
                              <li>- Balanced composition</li>
                              <li>- Rule of thirds</li>
                              <li>- Negative space usage</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Typography:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Bold, readable fonts</li>
                              <li>- Limited text (3-5 words)</li>
                              <li>- High contrast colors</li>
                              <li>- Consistent branding</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Best Practices</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Image Quality:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- 1280x720 resolution</li>
                              <li>- Sharp, clear images</li>
                              <li>- Proper lighting</li>
                              <li>- High contrast</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Mobile Optimization:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Large elements</li>
                              <li>- Simple backgrounds</li>
                              <li>- Readable at small sizes</li>
                              <li>- Touch-friendly zones</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Checklist
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-white dark:bg-gray-900/50'} rounded-lg p-4`}>
                        <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Design Process</h4>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Content Analysis
                            <ul className="pl-4 mt-1">
                              <li>- Identify key message</li>
                              <li>- Define target emotion</li>
                              <li>- Select main visual</li>
                              <li>- Plan text elements</li>
                            </ul>
                          </li>
                          <li>2. Creation Steps
                            <ul className="pl-4 mt-1">
                              <li>- Set up canvas (1280x720)</li>
                              <li>- Add background/main image</li>
                              <li>- Apply text and effects</li>
                              <li>- Test at multiple sizes</li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'thumbnail-step-2',
              title: 'Advanced Thumbnail Techniques',
              description: 'Learn advanced techniques for creating high-converting thumbnails',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Advanced Thumbnail Strategies
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Master advanced techniques to create thumbnails that consistently outperform the competition.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Target className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Psychological Triggers</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Emotional Impact:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Facial expressions</li>
                              <li>- Color psychology</li>
                              <li>- Pattern interrupts</li>
                              <li>- Visual metaphors</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Curiosity Gaps:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Before/after elements</li>
                              <li>- Unexpected combinations</li>
                              <li>- Mystery elements</li>
                              <li>- Open loops</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart2 className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Performance Optimization</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Technical Excellence:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Image compression</li>
                              <li>- Color calibration</li>
                              <li>- Device testing</li>
                              <li>- Format optimization</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Analytics Integration:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- CTR tracking</li>
                              <li>- Audience retention</li>
                              <li>- A/B test setup</li>
                              <li>- Performance metrics</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'thumbnail-testing',
          title: '🧪 Testing & Optimization',
          description: 'Implement systematic thumbnail testing',
          steps: [
            {
              id: 'thumbnail-step-3',
              title: 'Thumbnail Testing Framework',
              description: 'Create a systematic approach to thumbnail testing',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Testing & Optimization Framework
                    </h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement a data-driven approach to continuously improve thumbnail performance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Testing Strategy</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>A/B Testing:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Control vs variant</li>
                              <li>- Statistical significance</li>
                              <li>- Test duration</li>
                              <li>- Sample size calculation</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Variables to Test:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Image composition</li>
                              <li>- Text placement</li>
                              <li>- Color schemes</li>
                              <li>- Emotional triggers</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Performance Analysis</h3>
                      </div>
                      <ul className={`space-y-3 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Key Metrics:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Click-through rate (CTR)</li>
                              <li>- Audience retention</li>
                              <li>- Watch time impact</li>
                              <li>- Conversion rates</li>
                            </ul>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Data Analysis:</strong>
                            <ul className="pl-4 mt-2 space-y-1">
                              <li>- Trend identification</li>
                              <li>- Segment analysis</li>
                              <li>- Competition comparison</li>
                              <li>- ROI calculation</li>
                            </ul>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Process
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} rounded-lg p-4`}>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Setup Phase
                            <ul className="pl-4 mt-1">
                              <li>- Define test objectives</li>
                              <li>- Create test variations</li>
                              <li>- Set up tracking</li>
                              <li>- Document baseline metrics</li>
                            </ul>
                          </li>
                          <li>2. Execution Phase
                            <ul className="pl-4 mt-1">
                              <li>- Launch A/B test</li>
                              <li>- Monitor performance</li>
                              <li>- Collect data</li>
                              <li>- Track user behavior</li>
                            </ul>
                          </li>
                          <li>3. Analysis Phase
                            <ul className="pl-4 mt-1">
                              <li>- Calculate significance</li>
                              <li>- Identify winners</li>
                              <li>- Document learnings</li>
                              <li>- Plan next iteration</li>
                            </ul>
                          </li>
                        </ol>
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
                  <div className="border-l-4 border-green-500 pl-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Descriptions & Tags</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create comprehensive descriptions and strategic tags that improve discoverability.
                  </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <BookOpen className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Description Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Opening Hook:</strong> First 2-3 lines to grab attention</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Content Overview:</strong> Clear value proposition</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Timestamps:</strong> Easy navigation points</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Resources:</strong> Links and references</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Tag className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Tag Strategy</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Primary Tags:</strong> Main topic keywords</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Related Tags:</strong> Broader context terms</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Niche Tags:</strong> Specific subtopics</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Trending Tags:</strong> Current relevance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'metadata-step-3',
              title: 'Chapter Creation & Optimization',
              description: 'Add chapters and timestamps for better user experience',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Chapters</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Improve viewer experience and engagement with well-structured video chapters.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Timestamp Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Format:</strong> 00:00 - Introduction</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Spacing:</strong> Key content breaks</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Labels:</strong> Clear section names</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Length:</strong> 2-5 minute segments</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Layout className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Chapter Best Practices</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Logical Flow:</strong> Natural progression</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Descriptive:</strong> Clear value in title</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Consistency:</strong> Similar length segments</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Navigation:</strong> Easy to scan</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Process
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} rounded-lg p-4`}>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Planning
                            <ul className="pl-4 mt-1">
                              <li>- Outline content structure</li>
                              <li>- Identify key segments</li>
                              <li>- Plan transition points</li>
                              <li>- Create chapter titles</li>
                            </ul>
                          </li>
                          <li>2. Implementation
                            <ul className="pl-4 mt-1">
                              <li>- Add timestamps</li>
                              <li>- Format descriptions</li>
                              <li>- Test navigation</li>
                              <li>- Verify accuracy</li>
                            </ul>
                          </li>
                          <li>3. Optimization
                            <ul className="pl-4 mt-1">
                              <li>- Review engagement</li>
                              <li>- Adjust segments</li>
                              <li>- Update labels</li>
                              <li>- Monitor feedback</li>
                            </ul>
                          </li>
                        </ol>
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
                  <div className="border-l-4 border-purple-500 pl-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Video Chapters</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Improve viewer experience and engagement with well-structured video chapters.
                  </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Clock className="h-6 w-6 text-purple-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400`}>Timestamp Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Format:</strong> 00:00 - Introduction</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Spacing:</strong> Key content breaks</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Labels:</strong> Clear section names</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Length:</strong> 2-5 minute segments</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Layout className="h-6 w-6 text-orange-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400`}>Chapter Best Practices</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Logical Flow:</strong> Natural progression</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Descriptive:</strong> Clear value in title</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Consistency:</strong> Similar length segments</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span><strong>Navigation:</strong> Easy to scan</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6 mt-6`}>
                    <h3 className={`font-semibold text-lg mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      Implementation Process
                    </h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} rounded-lg p-4`}>
                        <ol className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Planning
                            <ul className="pl-4 mt-1">
                              <li>- Outline content structure</li>
                              <li>- Identify key segments</li>
                              <li>- Plan transition points</li>
                              <li>- Create chapter titles</li>
                            </ul>
                          </li>
                          <li>2. Implementation
                            <ul className="pl-4 mt-1">
                              <li>- Add timestamps</li>
                              <li>- Format descriptions</li>
                              <li>- Test navigation</li>
                              <li>- Verify accuracy</li>
                            </ul>
                          </li>
                          <li>3. Optimization
                            <ul className="pl-4 mt-1">
                              <li>- Review engagement</li>
                              <li>- Adjust segments</li>
                              <li>- Update labels</li>
                              <li>- Monitor feedback</li>
                            </ul>
                          </li>
                        </ol>
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
          title: '💰 Revenue Strategies',
          description: 'Implement multiple revenue streams',
          steps: [
            {
              id: 'video-integrate-monetization-step-1',
              title: 'Platform Integration Setup',
              description: 'Connect revenue features across platforms',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Integration Setup</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up and connect your video platform with various monetization services and payment processors.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Platform Connections</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube Partner Program</li>
                        <li>• AdSense Integration</li>
                        <li>• Stripe Connect</li>
                        <li>• PayPal Business</li>
                        <li>• Merchandise Platforms</li>
                        <li>• Course Marketplaces</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>API Requirements</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• OAuth 2.0 Setup</li>
                        <li>• API Keys Management</li>
                        <li>• Webhook Configuration</li>
                        <li>• Rate Limits</li>
                        <li>• Error Handling</li>
                        <li>• Data Synchronization</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700 dark:text-yellow-300'}`}>Integration Steps</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Platform Authentication:</strong> Set up OAuth and API credentials
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Create developer accounts on each platform</li>
                            <li>- Generate API keys and secrets</li>
                            <li>- Configure redirect URLs</li>
                            <li>- Test authentication flow</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Payment Gateway Setup:</strong> Connect payment processors
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure Stripe Connect for marketplace</li>
                            <li>- Set up PayPal Business integration</li>
                            <li>- Link bank accounts for direct deposits</li>
                            <li>- Configure currency conversion</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Webhook Configuration:</strong> Set up event notifications
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure payment success webhooks</li>
                            <li>- Set up subscription status updates</li>
                            <li>- Create error notification handlers</li>
                            <li>- Test webhook delivery</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Testing &amp; Validation:</strong> Verify all integrations
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Test payment flows end-to-end</li>
                            <li>- Verify data synchronization</li>
                            <li>- Check error handling scenarios</li>
                            <li>- Validate security measures</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Example - Stripe Integration</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-900/50'} p-3 rounded text-xs font-mono`}>
                      <code className={`${theme === 'gradient' ? 'text-green-400' : 'text-gray-800 dark:text-green-400'}`}>
                        {`// Initialize Stripe with Connect
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create connected account
const account = await stripe.accounts.create({
  type: 'express',
  country: 'US',
  email: user.email
});

// Create account link for onboarding
const accountLink = await stripe.accountLinks.create({
  account: account.id,
  refresh_url: 'https://yoursite.com/reauth',
  return_url: 'https://yoursite.com/return',
  type: 'account_onboarding'
});`}
                      </code>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-integrate-monetization-step-2',
              title: 'Payment System Integration',
              description: 'Connect payment processors and tracking systems',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Payment System Integration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up secure payment processing and tracking systems for all revenue streams.
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
                        <li>• Currency Handling</li>
                        <li>• Tax Integration</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Features</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• SSL Encryption</li>
                        <li>• Fraud Detection</li>
                        <li>• PCI Compliance</li>
                        <li>• Data Protection</li>
                        <li>• Access Controls</li>
                        <li>• Audit Logging</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>Implementation Steps</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Security Setup:</strong> Implement SSL and security measures
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Install SSL certificates</li>
                            <li>- Configure HTTPS redirects</li>
                            <li>- Set up firewall rules</li>
                            <li>- Enable fraud detection</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Payment Integration:</strong> Connect and test payment systems
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure Stripe payment methods</li>
                            <li>- Set up PayPal checkout flow</li>
                            <li>- Link bank accounts for payouts</li>
                            <li>- Configure subscription billing</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Monitoring:</strong> Set up transaction monitoring
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure payment tracking dashboards</li>
                            <li>- Set up failed payment alerts</li>
                            <li>- Monitor chargeback rates</li>
                            <li>- Track conversion metrics</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Testing:</strong> Verify payment processing end-to-end
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Test with sandbox environments</li>
                            <li>- Verify webhook delivery</li>
                            <li>- Check refund processing</li>
                            <li>- Validate tax calculations</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Example - PayPal Integration</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-900/50'} p-3 rounded text-xs font-mono`}>
                      <code className={`${theme === 'gradient' ? 'text-green-400' : 'text-gray-800 dark:text-green-400'}`}>
                        {`// PayPal Checkout Integration
const paypal = require('@paypal/checkout-server-sdk');

// Environment setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

// Create order
const request = new paypal.orders.OrdersCreateRequest();
request.requestBody({
  intent: 'CAPTURE',
  purchase_units: [{
    amount: {
      currency_code: 'USD',
      value: '10.00'
    }
  }]
});`}
                      </code>
                    </div>
                  </div>
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
              id: 'video-integrate-monetization-step-3',
              title: 'Analytics Integration',
              description: 'Connect analytics and reporting systems',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-green-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Revenue Analytics Integration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Set up comprehensive revenue tracking and analytics systems to monitor performance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Revenue per View (RPV)</li>
                        <li>• Cost per Mile (CPM)</li>
                        <li>• Engagement Rates</li>
                        <li>• Conversion Tracking</li>
                        <li>• Revenue Sources</li>
                        <li>• Growth Trends</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Tools</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube Analytics</li>
                        <li>• Google Analytics</li>
                        <li>• Revenue Dashboard</li>
                        <li>• Custom Reports</li>
                        <li>• Performance Tracking</li>
                        <li>• Trend Analysis</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'}`}>Setup Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Analytics Setup:</strong> Configure tracking systems
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Connect YouTube Analytics API</li>
                            <li>- Set up Google Analytics 4</li>
                            <li>- Configure conversion goals</li>
                            <li>- Enable ecommerce tracking</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Dashboard Creation:</strong> Build custom reporting views
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Design revenue overview dashboard</li>
                            <li>- Create performance comparison views</li>
                            <li>- Set up automated reports</li>
                            <li>- Configure data visualization</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Alerts:</strong> Set up performance notifications
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure revenue drop alerts</li>
                            <li>- Set up growth milestone notifications</li>
                            <li>- Create anomaly detection rules</li>
                            <li>- Enable real-time monitoring</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Testing:</strong> Verify data accuracy and reporting
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Validate tracking implementation</li>
                            <li>- Test report generation</li>
                            <li>- Verify metric calculations</li>
                            <li>- Check data consistency</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Example - Analytics Integration</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-900/50'} p-3 rounded text-xs font-mono`}>
                      <code className={`${theme === 'gradient' ? 'text-green-400' : 'text-gray-800 dark:text-green-400'}`}>
                        {`// Google Analytics 4 Integration
import { gtag } from 'ga-gtag';

// Initialize GA4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href
});

// Track revenue events
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 25.25,
  currency: 'USD',
  items: [{
    item_id: 'SKU123',
    item_name: 'Video Course',
    category: 'Education',
    quantity: 1,
    price: 25.25
  }]
});`}
                      </code>
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
          title: '👥 Retention Techniques',
          description: 'Keep viewers watching longer',
          steps: [
            {
              id: 'video-integrate-retention-step-1',
              title: 'Analytics Platform Integration',
              description: 'Connect advanced retention tracking systems',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-purple-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Platform Integration</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Integrate advanced analytics platforms to track detailed viewer behavior and retention patterns across all video content.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Platforms</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• YouTube Analytics API</li>
                        <li>• Google Analytics 4</li>
                        <li>• Mixpanel Events</li>
                        <li>• Amplitude Behavioral</li>
                        <li>• Hotjar Heatmaps</li>
                        <li>• VidIQ Pro Analytics</li>
                      </ul>
                      </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Tracking Features</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Real-time viewer tracking</li>
                        <li>• Engagement heatmaps</li>
                        <li>• Drop-off analysis</li>
                        <li>• Cohort retention tracking</li>
                        <li>• A/B testing framework</li>
                        <li>• Predictive analytics</li>
                      </ul>
                    </div>
                    </div>
                    
                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'}`}>Integration Steps</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>API Setup:</strong> Configure analytics platform APIs
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Set up YouTube Analytics API credentials</li>
                            <li>- Configure Google Analytics 4 tracking</li>
                            <li>- Initialize Mixpanel project</li>
                            <li>- Connect Amplitude analytics</li>
                          </ul>
                      </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Event Tracking:</strong> Implement custom event tracking
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure video play/pause events</li>
                            <li>- Track watch time milestones</li>
                            <li>- Monitor interaction events</li>
                            <li>- Set up engagement triggers</li>
                      </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Data Integration:</strong> Unify analytics data streams
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Set up data pipelines</li>
                            <li>- Configure cross-platform tracking</li>
                            <li>- Implement data warehousing</li>
                            <li>- Create unified dashboards</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Testing &amp; Validation:</strong> Verify tracking accuracy
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Test event firing accuracy</li>
                            <li>- Validate data consistency</li>
                            <li>- Check cross-platform sync</li>
                            <li>- Verify real-time reporting</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Example - YouTube Analytics Integration</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-900/50'} p-3 rounded text-xs font-mono`}>
                      <code className={`${theme === 'gradient' ? 'text-green-400' : 'text-gray-800 dark:text-green-400'}`}>
                        {`// YouTube Analytics API Integration
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Get retention data
const retention = await youtube.analytics.query({
  ids: 'channel==MINE',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  metrics: 'audienceRetentionPercent,watchTime',
  dimensions: 'day',
  filters: 'video==' + videoId
});

// Track custom retention events
gtag('event', 'video_retention', {
  video_id: videoId,
  retention_percent: retentionData.percent,
  watch_time: retentionData.watchTime
});`}
                      </code>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'video-integrate-retention-step-2',
              title: 'Behavioral Tracking Integration',
              description: 'Connect advanced viewer behavior monitoring',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Behavioral Tracking Integration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Implement sophisticated behavioral tracking systems to monitor viewer interactions, engagement patterns, and retention triggers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Tracking Tools</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Hotjar Session Recording</li>
                        <li>• FullStory User Journeys</li>
                        <li>• LogRocket Video Replay</li>
                        <li>• Smartlook Heatmaps</li>
                        <li>• Mouseflow Click Tracking</li>
                        <li>• Crazy Egg A/B Testing</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Behavioral Metrics</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Click-through patterns</li>
                        <li>• Scroll depth tracking</li>
                        <li>• Time-on-element analysis</li>
                        <li>• Interaction heatmaps</li>
                        <li>• Form abandonment rates</li>
                        <li>• Conversion funnel analysis</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-700 dark:text-orange-300'}`}>Implementation Process</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Tracking Script Integration:</strong> Install behavioral tracking codes
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Install Hotjar tracking script</li>
                            <li>- Configure FullStory session capture</li>
                            <li>- Set up LogRocket video recording</li>
                            <li>- Initialize heatmap tracking</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Event Configuration:</strong> Set up custom behavioral events
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Configure video interaction events</li>
                            <li>- Set up scroll depth milestones</li>
                            <li>- Track button and link clicks</li>
                            <li>- Monitor form field interactions</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Data Collection:</strong> Configure behavioral data capture
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Set recording quality and duration</li>
                            <li>- Configure privacy and masking settings</li>
                            <li>- Set up data retention policies</li>
                            <li>- Enable cross-device tracking</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Analysis Setup:</strong> Configure behavioral analysis tools
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Create behavioral analysis dashboards</li>
                            <li>- Set up automated insights</li>
                            <li>- Configure anomaly detection</li>
                            <li>- Enable real-time alerts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Example - Hotjar Integration</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-900/50'} p-3 rounded text-xs font-mono`}>
                      <code className={`${theme === 'gradient' ? 'text-green-400' : 'text-gray-800 dark:text-green-400'}`}>
                        {`// Hotjar Behavioral Tracking Integration
(function(h,o,t,j,a,r){
  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
  h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
  a=o.getElementsByTagName('head')[0];
  r=o.createElement('script');r.async=1;
  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
  a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

// Track custom video events
hj('event', 'video_play', {
  video_id: videoId,
  timestamp: new Date().toISOString(),
  user_segment: 'premium'
});

// Track retention milestones
hj('event', 'retention_milestone', {
  milestone: '25_percent',
  video_duration: videoDuration,
  watch_time: currentTime
});`}
                      </code>
                    </div>
                  </div>
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
              id: 'video-integrate-retention-step-3',
              title: 'Predictive Analytics Integration',
              description: 'Connect AI-powered retention forecasting systems',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-cyan-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Predictive Analytics Integration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Integrate machine learning-powered analytics to predict viewer behavior, identify retention risks, and automate engagement optimization.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>ML Platforms</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Google Analytics Intelligence</li>
                        <li>• AWS Personalize</li>
                        <li>• Azure Cognitive Services</li>
                        <li>• TensorFlow.js</li>
                        <li>• DataRobot AutoML</li>
                        <li>• H2O.ai Platform</li>
                      </ul>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                      <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Prediction Models</h4>
                      <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Churn prediction</li>
                        <li>• Engagement scoring</li>
                        <li>• Content recommendation</li>
                        <li>• Optimal timing analysis</li>
                        <li>• Audience segmentation</li>
                        <li>• Conversion probability</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-cyan-900/20' : 'bg-cyan-50 dark:bg-cyan-900/20'} rounded-lg p-6`}>
                    <h4 className={`font-medium mb-4 ${theme === 'gradient' ? 'text-cyan-300' : 'text-cyan-700 dark:text-cyan-300'}`}>Implementation Workflow</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Data Pipeline Setup:</strong> Configure ML data ingestion
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Set up BigQuery data warehouse</li>
                            <li>- Configure real-time data streaming</li>
                            <li>- Implement data preprocessing pipelines</li>
                            <li>- Set up feature engineering workflows</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Model Training:</strong> Develop predictive models
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Train retention prediction models</li>
                            <li>- Develop engagement scoring algorithms</li>
                            <li>- Create content recommendation engines</li>
                            <li>- Build audience segmentation models</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>API Integration:</strong> Connect prediction services
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Deploy models as REST APIs</li>
                            <li>- Set up real-time prediction endpoints</li>
                            <li>- Implement batch prediction jobs</li>
                            <li>- Configure model versioning</li>
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Automation Setup:</strong> Implement automated optimization
                          </p>
                          <ul className={`text-xs mt-1 ml-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            <li>- Set up automated A/B testing</li>
                            <li>- Configure dynamic content optimization</li>
                            <li>- Implement real-time personalization</li>
                            <li>- Enable predictive alerts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/50'} p-4 rounded border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                    <h4 className={`font-medium mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Example - TensorFlow.js Prediction</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-900/50'} p-3 rounded text-xs font-mono`}>
                      <code className={`${theme === 'gradient' ? 'text-green-400' : 'text-gray-800 dark:text-green-400'}`}>
                        {`// TensorFlow.js Retention Prediction
import * as tf from '@tensorflow/tfjs';

// Load pre-trained retention model
const model = await tf.loadLayersModel('/models/retention-model.json');

// Prepare user features
const userFeatures = tf.tensor2d([[
  watchTime,           // Current watch time
  engagementScore,     // User engagement score
  sessionDuration,     // Session duration
  previousRetention,   // Historical retention
  contentCategory,     // Content category
  timeOfDay           // Time of day
]]);

// Predict retention probability
const prediction = model.predict(userFeatures);
const retentionProbability = await prediction.data();

// Trigger intervention if low retention predicted
if (retentionProbability[0] < 0.3) {
  triggerEngagementBoost();
}

// Clean up tensors
userFeatures.dispose();
prediction.dispose();`}
                      </code>
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