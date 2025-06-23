import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Monitor, 
  Zap, 
  BarChart2, 
  Search, 
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  Gauge,
  Eye,
  Lock,
  TestTube,
  Activity,
  Settings,
  Target,
  TrendingUp,
  Loader2,
  Users
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

interface LearningPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const WebDevOptimize: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('performance');
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
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'accessibility', name: 'Accessibility', icon: '♿' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'testing', name: 'Testing', icon: '🧪' },
    { id: 'monitoring', name: 'Monitoring', icon: '📈' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    performance: [
      {
        id: 'analyze-core-web-vitals',
        title: 'Analyze Core Web Vitals',
        description: 'Measure LCP, FID, and CLS performance metrics',
        completed: false
      },
      {
        id: 'optimize-images-assets',
        title: 'Optimize images and assets',
        description: 'Compress images and minify CSS/JS files',
        completed: false
      },
      {
        id: 'implement-lazy-loading',
        title: 'Implement lazy loading',
        description: 'Add lazy loading for images and components',
        completed: false
      },
      {
        id: 'setup-code-splitting',
        title: 'Set up code splitting',
        description: 'Implement dynamic imports and route-based splitting',
        completed: false
      },
      {
        id: 'configure-caching',
        title: 'Configure caching strategies',
        description: 'Set up browser and server-side caching',
        completed: false
      },
      {
        id: 'monitor-performance',
        title: 'Monitor performance',
        description: 'Set up performance monitoring and alerts',
        completed: false
      }
    ],
    seo: [
      {
        id: 'conduct-seo-audit',
        title: 'Conduct SEO audit',
        description: 'Analyze current SEO performance and issues',
        completed: false
      },
      {
        id: 'optimize-meta-tags',
        title: 'Optimize meta tags',
        description: 'Improve title tags, descriptions, and meta data',
        completed: false
      },
      {
        id: 'implement-structured-data',
        title: 'Implement structured data',
        description: 'Add JSON-LD schema markup for better indexing',
        completed: false
      },
      {
        id: 'optimize-internal-linking',
        title: 'Optimize internal linking',
        description: 'Improve site structure and internal link strategy',
        completed: false
      },
      {
        id: 'setup-sitemap-robots',
        title: 'Set up sitemap and robots.txt',
        description: 'Configure XML sitemap and robots.txt file',
        completed: false
      },
      {
        id: 'monitor-search-rankings',
        title: 'Monitor search rankings',
        description: 'Set up Google Search Console and tracking',
        completed: false
      }
    ],
    accessibility: [
      {
        id: 'conduct-accessibility-audit',
        title: 'Conduct accessibility audit',
        description: 'Test with screen readers and accessibility tools',
        completed: false
      },
      {
        id: 'implement-aria-labels',
        title: 'Implement ARIA labels',
        description: 'Add proper ARIA attributes and labels',
        completed: false
      },
      {
        id: 'ensure-keyboard-navigation',
        title: 'Ensure keyboard navigation',
        description: 'Test and improve keyboard-only navigation',
        completed: false
      },
      {
        id: 'optimize-color-contrast',
        title: 'Optimize color contrast',
        description: 'Ensure WCAG compliant color contrast ratios',
        completed: false
      },
      {
        id: 'add-focus-indicators',
        title: 'Add focus indicators',
        description: 'Implement visible focus states for all interactive elements',
        completed: false
      },
      {
        id: 'test-screen-readers',
        title: 'Test with screen readers',
        description: 'Verify compatibility with assistive technologies',
        completed: false
      }
    ],
    security: [
      {
        id: 'conduct-security-scan',
        title: 'Conduct security scan',
        description: 'Run automated security vulnerability scans',
        completed: false
      },
      {
        id: 'implement-csp-headers',
        title: 'Implement CSP headers',
        description: 'Configure Content Security Policy headers',
        completed: false
      },
      {
        id: 'setup-https-ssl',
        title: 'Set up HTTPS/SSL',
        description: 'Ensure all connections use secure HTTPS',
        completed: false
      },
      {
        id: 'sanitize-user-inputs',
        title: 'Sanitize user inputs',
        description: 'Implement input validation and sanitization',
        completed: false
      },
      {
        id: 'configure-auth-security',
        title: 'Configure authentication security',
        description: 'Implement secure authentication and session management',
        completed: false
      },
      {
        id: 'setup-security-monitoring',
        title: 'Set up security monitoring',
        description: 'Configure security monitoring and alerts',
        completed: false
      }
    ],
    analytics: [
      {
        id: 'setup-google-analytics',
        title: 'Set up Google Analytics',
        description: 'Configure GA4 for comprehensive traffic analysis',
        completed: false
      },
      {
        id: 'implement-custom-events',
        title: 'Implement custom events',
        description: 'Track user interactions and conversion events',
        completed: false
      },
      {
        id: 'setup-conversion-tracking',
        title: 'Set up conversion tracking',
        description: 'Monitor goals and conversion funnels',
        completed: false
      },
      {
        id: 'configure-ecommerce-tracking',
        title: 'Configure e-commerce tracking',
        description: 'Track sales, revenue, and product performance',
        completed: false
      },
      {
        id: 'create-custom-dashboards',
        title: 'Create custom dashboards',
        description: 'Build personalized analytics dashboards',
        completed: false
      },
      {
        id: 'setup-automated-reports',
        title: 'Set up automated reports',
        description: 'Configure scheduled analytics reports',
        completed: false
      }
    ],
    testing: [
      {
        id: 'setup-unit-testing',
        title: 'Set up unit testing',
        description: 'Configure Jest and testing framework',
        completed: false
      },
      {
        id: 'implement-integration-tests',
        title: 'Implement integration tests',
        description: 'Test component interactions and API integration',
        completed: false
      },
      {
        id: 'setup-e2e-testing',
        title: 'Set up E2E testing',
        description: 'Configure Cypress or Playwright for end-to-end tests',
        completed: false
      },
      {
        id: 'implement-visual-regression',
        title: 'Implement visual regression testing',
        description: 'Test UI consistency across different scenarios',
        completed: false
      },
      {
        id: 'setup-performance-testing',
        title: 'Set up performance testing',
        description: 'Configure load testing and performance benchmarks',
        completed: false
      },
      {
        id: 'automate-test-pipeline',
        title: 'Automate test pipeline',
        description: 'Integrate testing into CI/CD pipeline',
        completed: false
      }
    ],
    monitoring: [
      {
        id: 'setup-error-monitoring',
        title: 'Set up error monitoring',
        description: 'Configure Sentry or similar error tracking',
        completed: false
      },
      {
        id: 'implement-performance-monitoring',
        title: 'Implement performance monitoring',
        description: 'Set up real-user monitoring and synthetic testing',
        completed: false
      },
      {
        id: 'configure-uptime-monitoring',
        title: 'Configure uptime monitoring',
        description: 'Monitor website availability and response times',
        completed: false
      },
      {
        id: 'setup-custom-alerts',
        title: 'Set up custom alerts',
        description: 'Configure alerts for critical issues and thresholds',
        completed: false
      },
      {
        id: 'implement-log-aggregation',
        title: 'Implement log aggregation',
        description: 'Centralize and analyze application logs',
        completed: false
      },
      {
        id: 'create-monitoring-dashboard',
        title: 'Create monitoring dashboard',
        description: 'Build comprehensive monitoring and metrics dashboard',
        completed: false
      }
    ]
  };

  const learningPaths: { [key: string]: LearningPath } = {
    performance: {
      id: 'performance',
      title: 'Step-by-Step Performance Optimization',
      icon: <Gauge className="h-5 w-5" />,
      description: 'Optimize speed, loading times, and user experience',
      sections: [
        {
          id: 'foundation',
          title: '⚡ Foundation',
          description: 'Performance fundamentals and measurement',
          steps: [
            {
              id: 'webdev-optimize-perf-step-1',
              title: 'Core Web Vitals',
              description: 'Understanding key performance metrics',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Core Web Vitals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>LCP</h3>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Largest Contentful Paint - measures loading performance
                      </p>
                      <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Target: &lt; 2.5 seconds
                      </p>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>FID</h3>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        First Input Delay - measures interactivity
                      </p>
                      <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Target: &lt; 100 milliseconds
                      </p>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>CLS</h3>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Cumulative Layout Shift - measures visual stability
                      </p>
                      <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        Target: &lt; 0.1
                      </p>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-optimize-perf-step-2',
              title: 'Performance Auditing',
              description: 'Tools and techniques for measuring performance',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Auditing Tools</h2>
                  
                  {/* Essential Tools */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Auditing Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Google Lighthouse</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Built into Chrome DevTools</li>
                          <li>• Comprehensive performance audit</li>
                          <li>• Actionable recommendations</li>
                          <li>• Scores for all Core Web Vitals</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>WebPageTest</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-world testing conditions</li>
                          <li>• Multiple locations &amp; devices</li>
                          <li>• Waterfall charts</li>
                          <li>• Filmstrip view of loading</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>GTmetrix</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Detailed performance reports</li>
                          <li>• PageSpeed &amp; YSlow scores</li>
                          <li>• Video playback of loading</li>
                          <li>• Historical data tracking</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Chrome DevTools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Performance profiling</li>
                          <li>• Network analysis</li>
                          <li>• Memory usage tracking</li>
                          <li>• Real-time monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Audit Process */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Audit Process</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-blue-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <ol className={`space-y-3 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                          <div>
                            <strong>Baseline Measurement:</strong> Run initial audits to establish current performance metrics
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                          <div>
                            <strong>Identify Bottlenecks:</strong> Analyze waterfall charts and identify slow-loading resources
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                          <div>
                            <strong>Prioritize Issues:</strong> Focus on problems with highest impact on Core Web Vitals
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                          <div>
                            <strong>Test Multiple Conditions:</strong> Audit on different devices, networks, and locations
                          </div>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                          <div>
                            <strong>Document Findings:</strong> Create actionable reports with specific recommendations
                          </div>
                        </li>
                      </ol>
                    </div>
                  </div>
                  
                  {/* Key Metrics to Monitor */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics to Monitor</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Loading Performance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• First Contentful Paint (FCP)</li>
                          <li>• Largest Contentful Paint (LCP)</li>
                          <li>• Speed Index</li>
                          <li>• Time to Interactive (TTI)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Interactivity</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• First Input Delay (FID)</li>
                          <li>• Total Blocking Time (TBT)</li>
                          <li>• Interaction to Next Paint</li>
                          <li>• JavaScript execution time</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Visual Stability</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cumulative Layout Shift (CLS)</li>
                          <li>• Layout shift occurrences</li>
                          <li>• Viewport stability</li>
                          <li>• Content reflow frequency</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Action Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Quick Audit Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Run Lighthouse audit</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test on mobile device</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Check Core Web Vitals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Analyze waterfall chart</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify largest assets</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document improvements</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'optimization',
          title: '🚀 Optimization',
          description: 'Optimize assets and code',
          steps: [
            {
              id: 'perf-step-3',
              title: 'Image Optimization',
              description: 'Compress and optimize images for web',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Image Optimization Strategies</h2>
                  
                  {/* Modern Image Formats */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Modern Image Formats</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>WebP</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 25-35% smaller than JPEG</li>
                          <li>• Supports transparency</li>
                          <li>• Wide browser support</li>
                          <li>• Lossless &amp; lossy compression</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>AVIF</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 50% smaller than JPEG</li>
                          <li>• Superior compression</li>
                          <li>• Growing browser support</li>
                          <li>• HDR &amp; wide color gamut</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>SVG</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Vector-based graphics</li>
                          <li>• Infinite scalability</li>
                          <li>• Small file sizes</li>
                          <li>• CSS &amp; JS integration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optimization Techniques */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimization Techniques</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-blue-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Responsive Images with Picture Element</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<picture>
  <source srcSet="image.avif" type="image/avif" />
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" 
       loading="lazy" 
       width="800" 
       height="600" />
</picture>`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Lazy Loading</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use loading="lazy" attribute</li>
                          <li>• Implement Intersection Observer</li>
                          <li>• Progressive image loading</li>
                          <li>• Reduce initial page weight</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Image Compression</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use tools like TinyPNG, ImageOptim</li>
                          <li>• Optimize quality vs. size balance</li>
                          <li>• Automate with build tools</li>
                          <li>• Remove metadata &amp; unnecessary data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tools & Services */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Image Optimization Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Build Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Webpack: imagemin-webpack-plugin</li>
                          <li>• Vite: vite-plugin-imagemin</li>
                          <li>• Next.js: built-in Image component</li>
                          <li>• Parcel: automatic optimization</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>CDN Services</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cloudinary: AI-powered optimization</li>
                          <li>• ImageKit: real-time transformations</li>
                          <li>• Cloudflare Images: global delivery</li>
                          <li>• AWS CloudFront: edge optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Impact */}
                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-3`}>Performance Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>60%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average size reduction with WebP</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>2.3s</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster LCP with lazy loading</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>40%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Bandwidth savings</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Image Optimization Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Convert to WebP/AVIF format</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement lazy loading</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add responsive images</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Compress existing images</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set proper dimensions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Use CDN for delivery</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'perf-step-4',
              title: 'Code Splitting',
              description: 'Implement dynamic imports and lazy loading',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Splitting Strategies</h2>
                  
                  {/* What is Code Splitting */}
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Code Splitting?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Code splitting breaks your application into smaller chunks that can be loaded on-demand, reducing initial bundle size and improving loading performance.
                    </p>
                  </div>
                  
                  {/* Types of Code Splitting */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Code Splitting</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Route-based</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Split code by routes/pages
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Easy to implement</li>
                          <li>• Natural split points</li>
                          <li>• User-friendly UX</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Component-based</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Split individual components
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Granular control</li>
                          <li>• Load on interaction</li>
                          <li>• Better performance</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Vendor-based</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Separate vendor libraries
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Better caching</li>
                          <li>• Shared between pages</li>
                          <li>• Stable chunks</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Implementation Examples */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Implementation Examples</h3>
                    
                    {/* React Route Splitting */}
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>React Route-based Splitting</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Profile = lazy(() => import('./components/Profile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}`}
                        </pre>
                      </div>
                    </div>
                    
                    {/* Component Splitting */}
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Component-based Splitting</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`import { useState, lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => setShowChart(true)}>
        Load Chart
      </button>
      
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}`}
                        </pre>
                      </div>
                    </div>
                    
                    {/* Dynamic Imports */}
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Dynamic Imports for Libraries</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Load heavy libraries only when needed
const loadDatePicker = async () => {
  const { default: DatePicker } = await import('react-datepicker');
  return DatePicker;
};

// Load utility functions dynamically
const processData = async (data) => {
  const { processCSV } = await import('./utils/csv-processor');
  return processCSV(data);
};

// Feature detection with dynamic imports
const loadPolyfills = async () => {
  if (!window.IntersectionObserver) {
    await import('intersection-observer');
  }
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bundle Analysis Tools */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Bundle Analysis Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Webpack Bundle Analyzer</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Visualize bundle size</li>
                          <li>• Identify large dependencies</li>
                          <li>• Interactive treemap</li>
                          <li>• npm install --save-dev webpack-bundle-analyzer</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Source Map Explorer</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Analyze JavaScript bundles</li>
                          <li>• Tree shaking effectiveness</li>
                          <li>• Dead code identification</li>
                          <li>• npx source-map-explorer build/static/js/*.js</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-3`}>Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Do's</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Split at route level first</li>
                          <li>✅ Use meaningful loading states</li>
                          <li>✅ Preload critical chunks</li>
                          <li>✅ Monitor bundle sizes</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Don'ts</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>❌ Over-split small components</li>
                          <li>❌ Ignore loading states</li>
                          <li>❌ Split everything immediately</li>
                          <li>❌ Forget error boundaries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Impact */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>70%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster initial load</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>3.2s</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Improved TTI</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>50%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Reduced bundle size</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Implementation Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Code Splitting Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement route-based splitting</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add loading fallbacks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Split heavy components</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Analyze bundle sizes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement error boundaries</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test on slow connections</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'perf-step-5',
              title: 'Caching Strategies',
              description: 'Implement effective caching mechanisms',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Caching Strategies</h2>
                  
                  {/* What is Caching */}
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Caching?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Caching stores frequently accessed data closer to users, reducing load times and server requests by serving content from faster storage locations.
                    </p>
                  </div>
                  
                  {/* Types of Caching */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Caching</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Browser Caching</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Cache resources locally in the user's browser
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• HTTP cache headers</li>
                          <li>• localStorage/sessionStorage</li>
                          <li>• Service Worker cache</li>
                          <li>• Application cache</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>CDN Caching</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Cache content at edge servers globally
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Static asset caching</li>
                          <li>• Geographic distribution</li>
                          <li>• Reduced latency</li>
                          <li>• Bandwidth optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* HTTP Cache Headers */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>HTTP Cache Headers</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Cache Headers</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`# Cache-Control Examples
Cache-Control: public, max-age=31536000    # 1 year for static assets
Cache-Control: private, max-age=3600       # 1 hour for user data
Cache-Control: no-cache, no-store          # Never cache sensitive data
Cache-Control: must-revalidate             # Always check for updates

# ETag for validation
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Last-Modified for conditional requests
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT

# Expires header (HTTP/1.0 compatibility)
Expires: Thu, 01 Dec 2025 16:00:00 GMT`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Cache-Control</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Controls caching behavior</li>
                          <li>• Sets max-age limits</li>
                          <li>• Defines cache scope</li>
                          <li>• Validation requirements</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>ETag</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Validates cached resources</li>
                          <li>• Prevents unnecessary transfers</li>
                          <li>• Supports conditional requests</li>
                          <li>• Efficient cache validation</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Last-Modified</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Timestamp-based validation</li>
                          <li>• Enables conditional requests</li>
                          <li>• Reduces bandwidth usage</li>
                          <li>• Simple cache validation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Caching Strategies */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Caching Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Cache First</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Serve from cache, fallback to network
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Fastest response time</li>
                          <li>✅ Offline capability</li>
                          <li>❌ May serve stale content</li>
                          <li>💡 Best for: Static assets</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Network First</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Try network first, fallback to cache
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Always fresh content</li>
                          <li>✅ Offline fallback</li>
                          <li>❌ Slower when network is slow</li>
                          <li>💡 Best for: Dynamic content</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Stale While Revalidate</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Serve cached, update in background
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Fast response time</li>
                          <li>✅ Fresh content eventually</li>
                          <li>❌ Temporary stale content</li>
                          <li>💡 Best for: Semi-dynamic content</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Network Only</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Always fetch from network
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Always fresh content</li>
                          <li>✅ No cache management</li>
                          <li>❌ No offline support</li>
                          <li>💡 Best for: Critical API calls</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Implementation Examples */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Implementation Examples</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Service Worker Caching</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Cache First Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Stale While Revalidate
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update cache with fresh content
            caches.open('v1').then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          });
        
        // Return cached version immediately, update in background
        return response || fetchPromise;
      })
  );
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Impact */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>85%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster repeat visits</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>60%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Reduced bandwidth</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>95%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better offline experience</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Caching Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Caching Implementation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set appropriate cache headers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement service worker caching</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure CDN caching</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Use ETags for validation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement cache invalidation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor cache performance</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'perf-step-6',
              title: 'Service Workers',
              description: 'Progressive Web App optimization',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Service Workers &amp; PWA Optimization</h2>
                  
                  {/* What are Service Workers */}
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What are Service Workers?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Service Workers are scripts that run in the background, enabling features like offline functionality, push notifications, and advanced caching strategies for Progressive Web Apps.
                    </p>
                  </div>
                  
                  {/* Service Worker Capabilities */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Service Worker Capabilities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Offline Support</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cache resources locally</li>
                          <li>• Serve content offline</li>
                          <li>• Fallback strategies</li>
                          <li>• Background sync</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Caching Control</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Advanced caching strategies</li>
                          <li>• Runtime caching</li>
                          <li>• Cache versioning</li>
                          <li>• Selective caching</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Push Notifications</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Background notifications</li>
                          <li>• User engagement</li>
                          <li>• Cross-platform support</li>
                          <li>• Rich media support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Worker Registration */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Service Worker Registration</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Basic Registration</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Check for updates
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Impact */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>85%</div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>53%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Increase in mobile engagement</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>90%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster load times offline</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>137%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Increase in conversions</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Implementation Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Service Worker Implementation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Register service worker</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement caching strategy</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create web app manifest</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add offline fallbacks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement background sync</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test PWA with Lighthouse</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'perf-step-7',
              title: 'Performance Monitoring',
              description: 'Real User Monitoring and synthetic testing',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Monitoring &amp; Analytics</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Performance Monitoring?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Performance monitoring tracks how your application performs in real-world conditions, helping identify bottlenecks and optimize user experience through continuous measurement and analysis.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Performance Monitoring</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Real User Monitoring (RUM)</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real user data collection</li>
                          <li>• Geographic performance insights</li>
                          <li>• Device &amp; browser variations</li>
                          <li>• Network condition impacts</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Synthetic Monitoring</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Scheduled performance tests</li>
                          <li>• Consistent testing conditions</li>
                          <li>• Proactive issue detection</li>
                          <li>• API &amp; transaction monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Performance Metrics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Core Web Vitals</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Largest Contentful Paint (LCP)</li>
                          <li>• First Input Delay (FID)</li>
                          <li>• Cumulative Layout Shift (CLS)</li>
                          <li>• Interaction to Next Paint (INP)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Loading Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Time to First Byte (TTFB)</li>
                          <li>• First Contentful Paint (FCP)</li>
                          <li>• Speed Index</li>
                          <li>• Time to Interactive (TTI)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Business Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Bounce rate correlation</li>
                          <li>• Conversion rate impact</li>
                          <li>• User session duration</li>
                          <li>• Revenue per visitor</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Performance Monitoring Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up RUM tracking</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement Core Web Vitals monitoring</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure performance alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up synthetic monitoring</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create performance dashboards</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Track business impact metrics</span>
                      </label>
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
      icon: <Eye className="h-5 w-5" />,
      description: 'Improve search engine visibility and rankings',
      sections: [
        {
          id: 'foundation',
          title: '🔍 Foundation',
          description: 'SEO basics and fundamentals',
          steps: [
            {
              id: 'seo-step-1',
              title: 'SEO Fundamentals',
              description: 'Understanding search engine optimization basics',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SEO Fundamentals</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is SEO?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Search Engine Optimization (SEO) is the practice of optimizing your website to increase its visibility and ranking in search engine results pages (SERPs), driving organic traffic and improving user experience.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>How Search Engines Work</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>1. Crawling</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Search engines discover &amp; scan web pages using automated bots called crawlers
                        </p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>2. Indexing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Pages are analyzed, processed &amp; stored in massive databases for quick retrieval
                        </p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>3. Ranking</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Algorithms determine page order based on relevance &amp; authority signals
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key SEO Ranking Factors</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>On-Page Factors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Content quality &amp; relevance</li>
                          <li>• Title tags &amp; meta descriptions</li>
                          <li>• Header structure (H1, H2, H3)</li>
                          <li>• URL structure &amp; keywords</li>
                          <li>• Internal linking strategy</li>
                          <li>• Page loading speed</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Off-Page Factors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Backlink quality &amp; quantity</li>
                          <li>• Domain authority &amp; trustworthiness</li>
                          <li>• Social media signals</li>
                          <li>• Brand mentions &amp; citations</li>
                          <li>• User behavior metrics</li>
                          <li>• Geographic relevance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>SEO Fundamentals Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Understand search engine basics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Learn key ranking factors</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up Google Search Console</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Install Google Analytics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create SEO strategy plan</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Audit current site performance</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'seo-step-2',
              title: 'Keyword Research',
              description: 'Find and target the right keywords',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Keyword Research &amp; Analysis</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Keyword Research?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Keyword research is the process of finding and analyzing search terms that people use to find information, products, or services online. It forms the foundation of effective SEO and content strategy.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Keywords</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Short-tail Keywords</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 1-2 words long</li>
                          <li>• High search volume</li>
                          <li>• High competition</li>
                          <li>• Broad search intent</li>
                          <li>• Example: "SEO tools"</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Long-tail Keywords</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 3+ words long</li>
                          <li>• Lower search volume</li>
                          <li>• Lower competition</li>
                          <li>• Specific search intent</li>
                          <li>• Example: "best SEO tools for beginners"</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Local Keywords</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Geographic modifiers</li>
                          <li>• Location-specific</li>
                          <li>• Local business focus</li>
                          <li>• Higher conversion rates</li>
                          <li>• Example: "SEO agency near me"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Search Intent Types</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Informational Intent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>User wants to learn something</p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• "How to do SEO"</li>
                          <li>• "What is keyword research"</li>
                          <li>• "SEO best practices"</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Commercial Intent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>User researching before purchase</p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• "Best SEO tools"</li>
                          <li>• "SEO software review"</li>
                          <li>• "Ahrefs vs Semrush"</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Transactional Intent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>User ready to purchase</p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• "Buy SEO software"</li>
                          <li>• "SEO tools discount"</li>
                          <li>• "Hire SEO consultant"</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Navigational Intent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>User looking for specific website</p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• "Google Search Console"</li>
                          <li>• "Ahrefs login"</li>
                          <li>• "Moz keyword explorer"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Keyword Research Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Free Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Google Keyword Planner</li>
                          <li>• Google Search Console</li>
                          <li>• Google Trends</li>
                          <li>• Answer The Public</li>
                          <li>• Ubersuggest (limited)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Premium Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Ahrefs Keyword Explorer</li>
                          <li>• SEMrush Keyword Magic</li>
                          <li>• Moz Keyword Explorer</li>
                          <li>• KWFinder by Mangools</li>
                          <li>• Serpstat</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-cyan-600 dark:text-cyan-400 mb-2`}>Additional Sources</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Competitor analysis</li>
                          <li>• Customer interviews</li>
                          <li>• Social media listening</li>
                          <li>• Forum discussions</li>
                          <li>• Search suggestions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Keyword Research Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>70%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Long-tail keywords convert better</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>3.5x</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better conversion with intent matching</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>50%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Reduction in customer acquisition cost</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Keyword Research Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify seed keywords</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Analyze search intent</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Check search volume &amp; difficulty</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Research competitor keywords</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create keyword clusters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Prioritize keywords by opportunity</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'on-page',
          title: '📄 On-Page SEO',
          description: 'Optimize individual pages',
          steps: [
            {
              id: 'seo-step-3',
              title: 'Meta Tags & Headers',
              description: 'Optimize titles, descriptions, and headings',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Meta Tags &amp; Headers Optimization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What are Meta Tags?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Meta tags provide metadata about HTML documents, helping search engines understand page content and display rich snippets in search results.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Meta Tags</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Title Tag</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Most important SEO element - appears in search results &amp; browser tabs
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<title>Primary Keyword | Secondary Keyword | Brand</title>
<!-- Good: 50-60 characters -->
<title>Web Development Course | Learn HTML CSS JS | TechAcademy</title>`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Meta Description</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Summary of page content shown in search results - affects click-through rates
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<meta name="description" content="Learn web development with our comprehensive course covering HTML, CSS, JavaScript, and modern frameworks. Start building websites today!">
<!-- Good: 150-160 characters with call-to-action -->`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Open Graph &amp; Twitter Cards</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Control how content appears when shared on social platforms
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<!-- Open Graph -->
<meta property="og:title" content="Web Development Course">
<meta property="og:description" content="Learn HTML, CSS, JS">
<meta property="og:image" content="/course-preview.jpg">
<meta property="og:type" content="website">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Web Development Course">
<meta name="twitter:description" content="Learn HTML, CSS, JS">
<meta name="twitter:image" content="/course-preview.jpg">`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Header Structure (H1-H6)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Best Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• One H1 per page (main topic)</li>
                          <li>• Use H2-H6 for content hierarchy</li>
                          <li>• Include target keywords naturally</li>
                          <li>• Keep headers descriptive &amp; clear</li>
                          <li>• Don't skip heading levels</li>
                          <li>• Use consistent formatting</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Example Structure</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<h1>Complete Guide to Web Development</h1>
  <h2>Frontend Technologies</h2>
    <h3>HTML Fundamentals</h3>
    <h3>CSS Styling</h3>
      <h4>Flexbox Layout</h4>
      <h4>Grid Layout</h4>
    <h3>JavaScript Programming</h3>
  <h2>Backend Technologies</h2>
    <h3>Node.js</h3>
    <h3>Databases</h3>`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Technical Meta Tags</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Charset &amp; Viewport</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-2`}>
                          <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Robots &amp; Canonical</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-2`}>
                          <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<meta name="robots" content="index,follow">
<link rel="canonical" href="https://example.com/page">`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-cyan-600 dark:text-cyan-400 mb-2`}>Language &amp; Author</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-2`}>
                          <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<html lang="en">
<meta name="author" content="Company Name">
<meta name="language" content="English">`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Meta Tags Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>36%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>CTR improvement with good titles</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>5.8%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>CTR boost from meta descriptions</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>2.5x</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More social shares with OG tags</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Meta Tags Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Optimize title tags (50-60 chars)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Write compelling meta descriptions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Structure headers hierarchically</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add Open Graph tags</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set canonical URLs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Include essential technical tags</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'seo-step-4',
              title: 'Content Optimization',
              description: 'Create SEO-friendly content',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Optimization for SEO</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Content Optimization?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Content optimization involves creating and structuring content that satisfies both search engines and users, balancing keyword targeting with high-quality, valuable information that meets user intent.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Quality Factors</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>E-A-T Principles</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Expertise:</strong> Demonstrate knowledge</li>
                          <li>• <strong>Authoritativeness:</strong> Build credibility</li>
                          <li>• <strong>Trustworthiness:</strong> Ensure accuracy</li>
                          <li>• Author bio &amp; credentials</li>
                          <li>• Regular content updates</li>
                          <li>• Fact-checking &amp; sources</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>User Experience</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Clear, scannable structure</li>
                          <li>• Engaging headlines &amp; subheadings</li>
                          <li>• Short paragraphs &amp; bullet points</li>
                          <li>• Visual elements (images, videos)</li>
                          <li>• Internal linking strategy</li>
                          <li>• Mobile-friendly formatting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Keyword Optimization Strategy</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Primary Keywords</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 1-2 per page maximum</li>
                          <li>• Include in title &amp; H1</li>
                          <li>• Natural placement in content</li>
                          <li>• Use in meta description</li>
                          <li>• Avoid keyword stuffing</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Secondary Keywords</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Related terms &amp; synonyms</li>
                          <li>• Use in subheadings (H2-H6)</li>
                          <li>• Sprinkle throughout content</li>
                          <li>• Long-tail variations</li>
                          <li>• Semantic keyword clusters</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-cyan-600 dark:text-cyan-400 mb-2`}>LSI Keywords</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Latent Semantic Indexing</li>
                          <li>• Contextually related terms</li>
                          <li>• Improve content relevance</li>
                          <li>• Google "searches related to"</li>
                          <li>• Topic modeling approach</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Structure Best Practices</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Optimal Content Layout</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>Introduction (First 100 words)</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Include primary keyword</li>
                            <li>• Answer user's main question</li>
                            <li>• Hook readers with value</li>
                            <li>• Set clear expectations</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={`font-medium text-green-600 dark:text-green-400 mb-2`}>Body Content</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use descriptive subheadings</li>
                            <li>• Include relevant keywords</li>
                            <li>• Add supporting evidence</li>
                            <li>• Use bullet points &amp; lists</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Technical Content Optimization</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Readability Factors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Flesch Reading Score: 60-70</li>
                          <li>• Average sentence length: 15-20 words</li>
                          <li>• Paragraph length: 2-3 sentences</li>
                          <li>• Use transition words</li>
                          <li>• Active voice preferred</li>
                          <li>• Simple, clear language</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Content Length Guidelines</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Blog posts: 1,500-2,500 words</li>
                          <li>• Product pages: 300-500 words</li>
                          <li>• Landing pages: 500-1,000 words</li>
                          <li>• About pages: 200-400 words</li>
                          <li>• Quality over quantity</li>
                          <li>• Cover topic comprehensively</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Content Optimization Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>434%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More traffic with long-form content</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>73%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better engagement with proper structure</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>2.3x</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More backlinks to quality content</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Content Optimization Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Research target keywords thoroughly</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create comprehensive content outlines</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Optimize for user intent</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Use natural keyword placement</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement proper content structure</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Optimize for readability &amp; engagement</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'technical',
          title: '⚙️ Technical SEO',
          description: 'Technical optimization strategies',
          steps: [
            {
              id: 'seo-step-5',
              title: 'Site Structure & URLs',
              description: 'Optimize site architecture and URL structure',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Site Structure &amp; URL Optimization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Site Structure Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Proper site structure helps search engines crawl and understand your content while providing users with intuitive navigation and improved user experience.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>URL Structure Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Good URL Examples</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`example.com/web-development-guide
example.com/blog/seo-best-practices
example.com/products/wireless-headphones
example.com/category/digital-marketing`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>❌ Poor URL Examples</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`example.com/page?id=12345&cat=tech
example.com/product_details.php?item=567
example.com/folder1/subfolder2/page.html
example.com/this-is-a-very-long-url-name`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Site Structure Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Information Architecture</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Logical content grouping</li>
                          <li>• Clear hierarchy</li>
                          <li>• Consistent navigation</li>
                          <li>• User-centric design</li>
                          <li>• Avoid deep nesting</li>
                          <li>• Use breadcrumbs</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-indigo-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-indigo-700' : 'border-indigo-200 dark:border-indigo-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-indigo-600 dark:text-indigo-400 mb-2`}>URL Structure</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use descriptive keywords</li>
                          <li>• Keep URLs short</li>
                          <li>• Use hyphens for readability</li>
                          <li>• Avoid query strings</li>
                          <li>• Use lowercase letters</li>
                          <li>• Avoid special characters</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Technical SEO Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-pink-900/20' : 'bg-pink-50 dark:bg-pink-900/20'} border ${theme === 'gradient' ? 'border-pink-700' : 'border-pink-200 dark:border-pink-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Crawlability</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• XML sitemap</li>
                          <li>• Robots.txt</li>
                          <li>• Canonical URLs</li>
                          <li>• 301 redirects</li>
                          <li>• Avoid duplicate content</li>
                          <li>• Use noindex for irrelevant pages</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-teal-900/20' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-teal-700' : 'border-teal-200 dark:border-teal-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-teal-600 dark:text-teal-400 mb-2`}>Performance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Fast loading times</li>
                          <li>• Compressed images</li>
                          <li>• Minified code</li>
                          <li>• Caching mechanisms</li>
                          <li>• CDN for static assets</li>
                          <li>• Lazy loading</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Site Structure Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>55%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better crawling with flat structure</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>40%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Lower bounce rate with good nav</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>25%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More page views per session</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Site Structure Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create logical site hierarchy</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Optimize URL structure</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement internal linking strategy</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create &amp; submit XML sitemap</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add breadcrumb navigation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test site navigation usability</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'seo-step-6',
              title: 'Schema Markup',
              description: 'Implement structured data for rich snippets',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Schema Markup &amp; Structured Data</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Schema Markup?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Schema markup is structured data that helps search engines understand your content better, enabling rich snippets and enhanced search results that improve click-through rates.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Schema Types</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Article</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Blog posts &amp; news articles</li>
                          <li>• Author information</li>
                          <li>• Publication date</li>
                          <li>• Article headline</li>
                          <li>• Featured image</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Product</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• E-commerce products</li>
                          <li>• Price &amp; availability</li>
                          <li>• Reviews &amp; ratings</li>
                          <li>• Brand information</li>
                          <li>• Product images</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-cyan-600 dark:text-cyan-400 mb-2`}>Local Business</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Business address</li>
                          <li>• Phone &amp; hours</li>
                          <li>• Customer reviews</li>
                          <li>• Business type</li>
                          <li>• Geographic area</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>JSON-LD Implementation</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Article Schema Example</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to SEO Optimization",
  "description": "Learn SEO best practices and techniques",
  "author": {
    "@type": "Person",
    "name": "SEO Expert"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tech Academy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2024-01-15T08:00:00Z",
  "dateModified": "2024-01-20T08:00:00Z",
  "image": "https://example.com/seo-guide.jpg",
  "url": "https://example.com/seo-guide"
}
</script>`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Product Schema Example</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless headphones",
  "brand": {
    "@type": "Brand",
    "name": "AudioTech"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127"
  }
}
</script>`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Rich Snippet Benefits</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Enhanced SERP Appearance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Star ratings display</li>
                          <li>• Price information</li>
                          <li>• Author &amp; publication date</li>
                          <li>• Business hours &amp; location</li>
                          <li>• FAQ sections</li>
                          <li>• Recipe details</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Performance Benefits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Higher click-through rates</li>
                          <li>• Improved search visibility</li>
                          <li>• Better user experience</li>
                          <li>• Increased trust signals</li>
                          <li>• Voice search optimization</li>
                          <li>• Featured snippet eligibility</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing &amp; Validation Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Google Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Rich Results Test</li>
                          <li>• Search Console</li>
                          <li>• Structured Data Markup Helper</li>
                          <li>• Schema.org Validator</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Third-party Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• JSON-LD Schema Generator</li>
                          <li>• Merkle Schema Markup Generator</li>
                          <li>• Schema App</li>
                          <li>• Structured Data Linter</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Browser Extensions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Schema &amp; Structured Data Tester</li>
                          <li>• Web Developer</li>
                          <li>• SEO META in 1 CLICK</li>
                          <li>• Structured Data Viewer</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Schema Markup Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>30%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Higher CTR with rich snippets</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>25%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better search visibility</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>40%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More voice search results</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Schema Markup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify content types for markup</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement JSON-LD structured data</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test with Google Rich Results</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Validate schema syntax</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor rich snippet performance</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Update schema regularly</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'seo-step-7',
              title: 'SEO Monitoring',
              description: 'Track and analyze SEO performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SEO Monitoring &amp; Analytics</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Monitor SEO Performance?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Regular SEO monitoring helps track progress, identify issues, measure ROI, and make data-driven decisions to continuously improve your search engine rankings and organic traffic.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential SEO Metrics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Traffic Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Organic traffic volume</li>
                          <li>• Traffic growth rate</li>
                          <li>• Pages per session</li>
                          <li>• Session duration</li>
                          <li>• New vs returning visitors</li>
                          <li>• Traffic by device type</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Ranking Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Keyword rankings</li>
                          <li>• Search visibility</li>
                          <li>• SERP features captured</li>
                          <li>• Click-through rates</li>
                          <li>• Average position</li>
                          <li>• Ranking volatility</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Technical Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Page speed scores</li>
                          <li>• Core Web Vitals</li>
                          <li>• Crawl errors</li>
                          <li>• Index coverage</li>
                          <li>• Mobile usability</li>
                          <li>• Schema markup status</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential SEO Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Free Google Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Google Search Console:</strong> Rankings, CTR, crawl issues</li>
                          <li>• <strong>Google Analytics 4:</strong> Traffic, user behavior, conversions</li>
                          <li>• <strong>PageSpeed Insights:</strong> Core Web Vitals monitoring</li>
                          <li>• <strong>Google Trends:</strong> Keyword trend analysis</li>
                          <li>• <strong>Mobile-Friendly Test:</strong> Mobile optimization check</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Premium SEO Platforms</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Ahrefs:</strong> Backlinks, keywords, competitor analysis</li>
                          <li>• <strong>SEMrush:</strong> Comprehensive SEO suite</li>
                          <li>• <strong>Moz Pro:</strong> Rankings, site audits, link building</li>
                          <li>• <strong>Screaming Frog:</strong> Technical SEO crawling</li>
                          <li>• <strong>Brightedge:</strong> Enterprise SEO platform</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Dashboard Setup</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google Analytics 4 SEO Dashboard</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>Custom Reports to Create</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Organic traffic by landing page</li>
                            <li>• Top converting organic keywords</li>
                            <li>• Mobile vs desktop organic performance</li>
                            <li>• Content performance by topic</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={`font-medium text-green-600 dark:text-green-400 mb-2`}>Key Segments to Monitor</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Organic traffic only</li>
                            <li>• New vs returning organic visitors</li>
                            <li>• High-value organic sessions</li>
                            <li>• Mobile organic traffic</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automated Monitoring &amp; Alerts</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Critical Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 20%+ traffic drop</li>
                          <li>• Site downtime detected</li>
                          <li>• Major ranking losses</li>
                          <li>• Crawl errors spike</li>
                          <li>• Index coverage issues</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Performance Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Page speed degradation</li>
                          <li>• Core Web Vitals failures</li>
                          <li>• CTR drops below threshold</li>
                          <li>• New 404 errors found</li>
                          <li>• Schema markup issues</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Opportunity Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• New keyword rankings</li>
                          <li>• Competitor ranking drops</li>
                          <li>• Featured snippet opportunities</li>
                          <li>• Backlink acquisition</li>
                          <li>• Content gap identification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SEO Reporting Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Monthly SEO Report Elements</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Executive summary with key wins</li>
                          <li>• Traffic trends &amp; growth metrics</li>
                          <li>• Keyword ranking improvements</li>
                          <li>• Technical SEO health status</li>
                          <li>• Competitor benchmark analysis</li>
                          <li>• Next month's action plan</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Reporting Frequency Guide</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Daily:</strong> Critical issues &amp; alerts</li>
                          <li>• <strong>Weekly:</strong> Rankings &amp; traffic trends</li>
                          <li>• <strong>Monthly:</strong> Comprehensive performance review</li>
                          <li>• <strong>Quarterly:</strong> Strategy assessment &amp; planning</li>
                          <li>• <strong>Annually:</strong> Full SEO audit &amp; roadmap</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SEO Monitoring ROI</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>58%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster issue detection with monitoring</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>35%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better performance with data-driven decisions</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>4.2x</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>ROI improvement with proper tracking</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>SEO Monitoring Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up Google Search Console</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure GA4 for SEO tracking</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create automated alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up ranking monitoring</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Schedule regular SEO audits</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create monthly reporting schedule</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    accessibility: {
      id: 'accessibility',
      title: 'Step-by-Step Accessibility Optimization',
      icon: <Users className="h-5 w-5" />,
      description: 'Make your application accessible to all users',
      sections: [
        {
          id: 'foundation',
          title: '♿ Foundation',
          description: 'Accessibility basics and guidelines',
          steps: [
            {
              id: 'a11y-step-1',
              title: 'WCAG Guidelines',
              description: 'Understanding Web Content Accessibility Guidelines',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>WCAG Guidelines content</div>
            },
            {
              id: 'a11y-step-2',
              title: 'Accessibility Auditing',
              description: 'Tools and techniques for accessibility testing',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Accessibility Auditing content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '🛠️ Implementation',
          description: 'Implement accessibility features',
          steps: [
            {
              id: 'a11y-step-3',
              title: 'Semantic HTML',
              description: 'Use proper HTML semantics for accessibility',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Semantic HTML content</div>
            },
            {
              id: 'a11y-step-4',
              title: 'ARIA Labels & Roles',
              description: 'Implement ARIA for complex components',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>ARIA Labels & Roles content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced accessibility techniques',
          steps: [
            {
              id: 'a11y-step-5',
              title: 'Keyboard Navigation',
              description: 'Ensure full keyboard accessibility',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Keyboard Navigation content</div>
            },
            {
              id: 'a11y-step-6',
              title: 'Screen Reader Optimization',
              description: 'Optimize for assistive technologies',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Screen Reader Optimization content</div>
            },
            {
              id: 'a11y-step-7',
              title: 'Color & Contrast',
              description: 'Ensure proper color accessibility',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Color &amp; Contrast Accessibility</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Color &amp; Contrast Matter</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Proper color contrast ensures that text and visual elements are readable by users with visual impairments, including color blindness, low vision, and other conditions. Good contrast benefits all users, especially in varying lighting conditions.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Users Who Benefit from Good Contrast</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Visual Impairments</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• People with low vision or visual processing disorders</li>
                          <li>• Users with color blindness (8% of men, 0.5% of women)</li>
                          <li>• Elderly users experiencing age-related vision changes</li>
                          <li>• Users with light sensitivity or photophobia</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Environmental Factors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Users in bright environments or sunlight</li>
                          <li>• Poor quality displays or older monitors</li>
                          <li>• Mobile devices with varying screen brightness</li>
                          <li>• Users wearing sunglasses or protective eyewear</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>WCAG Contrast Requirements</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Level AA (Standard)</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Normal Text:</strong> 4.5:1 contrast ratio minimum</li>
                          <li>• <strong>Large Text (18pt+ or 14pt+ bold):</strong> 3:1 minimum</li>
                          <li>• <strong>Non-text Elements:</strong> 3:1 for UI components</li>
                          <li>• <strong>Legal Standard:</strong> Required by ADA, Section 508</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Level AAA (Enhanced)</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Normal Text:</strong> 7:1 contrast ratio minimum</li>
                          <li>• <strong>Large Text:</strong> 4.5:1 contrast ratio minimum</li>
                          <li>• <strong>Highest Level:</strong> Not required for general compliance</li>
                          <li>• <strong>Recommendation:</strong> Use selectively for critical content</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Color Contrast Testing Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Browser Extensions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Colour Contrast Analyser:</strong> Real-time testing</li>
                          <li>• <strong>WAVE:</strong> Full page accessibility scan</li>
                          <li>• <strong>axe DevTools:</strong> Comprehensive testing suite</li>
                          <li>• <strong>Lighthouse:</strong> Built into Chrome DevTools</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Online Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>WebAIM Contrast Checker:</strong> Simple color testing</li>
                          <li>• <strong>Contrast Ratio:</strong> Real-time color picker</li>
                          <li>• <strong>Colorbrewing:</strong> Palette suggestions</li>
                          <li>• <strong>Stark:</strong> Design tool integration</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-cyan-600 dark:text-cyan-400 mb-2`}>Color Blind Testing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>NoCoffee:</strong> Vision deficiency simulator</li>
                          <li>• <strong>Colorblinding:</strong> Chrome extension</li>
                          <li>• <strong>Sim Daltonism:</strong> macOS color blind simulator</li>
                          <li>• <strong>Coblis:</strong> Online color blindness simulator</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Color Accessibility Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Don't Rely on Color Alone</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>Information should be conveyed through multiple means</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 rounded"></span>
                            <span>*</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Required fields (color + asterisk + label)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded"></span>
                            <span>✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Success messages (color + icon + text)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                            <span>⚠</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Warnings (color + icon + text)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🎨 Color Blind Friendly Palettes</h4>
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div>
                            <h5 className={`font-medium ${theme === 'gradient' ? 'text-gray-200' : 'text-gray-800 dark:text-gray-200'} mb-1`}>Safe Color Combinations:</h5>
                            <ul className={`space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Blue + Orange (complementary)</li>
                              <li>• Purple + Yellow (high contrast)</li>
                              <li>• Dark Blue + Light Gray</li>
                              <li>• Black + White (maximum contrast)</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className={`font-medium ${theme === 'gradient' ? 'text-gray-200' : 'text-gray-800 dark:text-gray-200'} mb-1`}>Avoid These Combinations:</h5>
                            <ul className={`space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Red + Green (common color blindness)</li>
                              <li>• Blue + Purple (hard to distinguish)</li>
                              <li>• Gray + Gray (low contrast)</li>
                              <li>• Light colors on white backgrounds</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Practical Implementation</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>CSS Custom Properties for Accessible Colors</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`:root {
  /* High contrast color palette */
  --color-primary: #1f2937;      /* 4.5:1 on white */
  --color-secondary: #0f766e;    /* 4.5:1 on white */
  --color-success: #15803d;      /* 4.5:1 on white */
  --color-warning: #ca8a04;      /* 4.5:1 on white */
  --color-error: #dc2626;        /* 4.5:1 on white */
  
  /* Light text colors */
  --color-text-light: #ffffff;   /* 21:1 on dark backgrounds */
  --color-text-muted: #6b7280;   /* 4.5:1 on white */
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  /* Results in 21:1 contrast ratio */
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Color Accessibility Issues</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                        <span className="text-red-500 text-xl">❌</span>
                        <div>
                          <h5 className={`font-medium text-red-700 dark:text-red-300 mb-1`}>Low Contrast Text</h5>
                          <p className={`text-sm text-red-600 dark:text-red-400`}>Light gray text on white backgrounds often fails contrast requirements</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                        <span className="text-orange-500 text-xl">⚠️</span>
                        <div>
                          <h5 className={`font-medium text-orange-700 dark:text-orange-300 mb-1`}>Color-Only Information</h5>
                          <p className={`text-sm text-orange-600 dark:text-orange-400`}>Using only red/green to indicate errors/success without text or icons</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <span className="text-yellow-500 text-xl">⚠️</span>
                        <div>
                          <h5 className={`font-medium text-yellow-700 dark:text-yellow-300 mb-1`}>Poor Focus Indicators</h5>
                          <p className={`text-sm text-yellow-600 dark:text-yellow-400`}>Focus outlines that don't meet contrast requirements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Color Accessibility Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>15%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Of global population affected by color vision deficiencies</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>67%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better user engagement with good contrast</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>3.2x</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Lower bounce rate with accessible colors</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 Quick Win</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Install a browser extension like "NoCoffee" or "Colorblinding" to simulate color vision deficiencies. Test your site with these filters enabled to quickly identify color accessibility issues. Many problems become immediately obvious when you can't distinguish between colors.
                    </p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Color Accessibility Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test all text meets 4.5:1 ratio</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test large text meets 3:1 ratio</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test UI components meet 3:1 ratio</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test focus indicators</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test with color blindness filters</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Verify information without color</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    security: {
      id: 'security',
      title: 'Step-by-Step Security Optimization',
      icon: <Lock className="h-5 w-5" />,
      description: 'Secure your application against threats',
      sections: [
        {
          id: 'foundation',
          title: '🔒 Foundation',
          description: 'Security fundamentals',
          steps: [
            {
              id: 'sec-step-1',
              title: 'Security Principles',
              description: 'Understanding core security concepts',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Principles &amp; Fundamentals</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Security Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Application security protects sensitive data, maintains user trust, ensures business continuity, and prevents financial losses from cyber attacks and data breaches.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Core Security Principles (CIA Triad)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🔒 Confidentiality</h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Ensuring information is accessible only to authorized individuals
                      </p>
                        <ul className={`text-xs mt-2 space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Encryption</li>
                          <li>• Access controls</li>
                          <li>• Authentication</li>
                        </ul>
                    </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>✅ Integrity</h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Protecting data from unauthorized modification or corruption
                      </p>
                        <ul className={`text-xs mt-2 space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Data validation</li>
                          <li>• Checksums</li>
                          <li>• Digital signatures</li>
                        </ul>
                    </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🌐 Availability</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Ensuring systems are accessible when needed by authorized users
                        </p>
                        <ul className={`text-xs mt-2 space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Redundancy</li>
                          <li>• DDoS protection</li>
                          <li>• Disaster recovery</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Defense in Depth Strategy</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Multiple Security Layers</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Physical Security:</strong> Server &amp; facility protection</li>
                          <li>• <strong>Network Security:</strong> Firewalls &amp; intrusion detection</li>
                          <li>• <strong>Application Security:</strong> Secure coding practices</li>
                          <li>• <strong>Data Security:</strong> Encryption &amp; access controls</li>
                          <li>• <strong>User Security:</strong> Authentication &amp; training</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-pink-600 dark:text-pink-400 mb-2`}>Fail-Safe Approach</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• If one layer fails, others provide protection</li>
                          <li>• No single point of failure</li>
                          <li>• Redundant security controls</li>
                          <li>• Assume breach mentality</li>
                          <li>• Regular security audits &amp; updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Security Threats</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>External Threats</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Hackers &amp; Cybercriminals:</strong> Financial gain, data theft</li>
                          <li>• <strong>Nation-State Actors:</strong> Espionage, warfare</li>
                          <li>• <strong>Organized Crime:</strong> Ransomware, fraud</li>
                          <li>• <strong>Script Kiddies:</strong> Automated attacks, vandalism</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Internal Threats</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Malicious Insiders:</strong> Disgruntled employees</li>
                          <li>• <strong>Negligent Users:</strong> Accidental data exposure</li>
                          <li>• <strong>Third-Party Vendors:</strong> Supply chain attacks</li>
                          <li>• <strong>Social Engineering:</strong> Phishing, pretexting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Best Practices</h3>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Principle of Least Privilege</h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                        Grant users and systems only the minimum access rights needed to perform their functions.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-medium text-green-600 dark:text-green-400 mb-2`}>Implementation:</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Role-based access control (RBAC)</li>
                            <li>• Regular access reviews</li>
                            <li>• Just-in-time access</li>
                            <li>• Segregation of duties</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={`font-medium text-blue-600 dark:text-blue-400 mb-2`}>Benefits:</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Reduces attack surface</li>
                            <li>• Limits damage from breaches</li>
                            <li>• Improves compliance</li>
                            <li>• Easier audit trails</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Breach Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-red-600 dark:text-red-400`}>$4.88M</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average cost of a data breach in 2024</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-orange-600 dark:text-orange-400`}>277</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average days to identify &amp; contain breach</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>95%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Of breaches caused by human error</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Security Principles Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Understand CIA triad principles</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement defense in depth</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Apply principle of least privilege</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify potential threats</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create security policies</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Plan incident response</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'sec-step-2',
              title: 'Vulnerability Assessment',
              description: 'Identify common security vulnerabilities',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vulnerability Assessment &amp; Identification</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-red-600 dark:text-red-400 mb-2`}>What is Vulnerability Assessment?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      A systematic review of security weaknesses in applications, networks, and systems. It identifies, quantifies, and prioritizes vulnerabilities that could be exploited by attackers.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>OWASP Top 10 Web Application Vulnerabilities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>1. Broken Access Control</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Users can access unauthorized functionality or data.
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Privilege escalation</li>
                          <li>• Directory traversal</li>
                          <li>• Missing authorization</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>2. Cryptographic Failures</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Weak encryption or exposed sensitive data.
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Weak algorithms</li>
                          <li>• Hardcoded keys</li>
                          <li>• Data in transit/rest</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>3. Injection Attacks</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Malicious code inserted into applications.
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• SQL injection</li>
                          <li>• XSS (Cross-Site Scripting)</li>
                          <li>• Command injection</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>4. Insecure Design</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Missing or ineffective security controls.
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Lack of threat modeling</li>
                          <li>• Missing security patterns</li>
                          <li>• Weak architecture</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vulnerability Assessment Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🔍 Static Analysis</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Code analysis without execution
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• SonarQube</li>
                          <li>• ESLint (security rules)</li>
                          <li>• Bandit (Python)</li>
                          <li>• CodeQL</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🎯 Dynamic Analysis</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Testing running applications
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• OWASP ZAP</li>
                          <li>• Burp Suite</li>
                          <li>• Nessus</li>
                          <li>• Nikto</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🔧 Dependency Scan</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Third-party vulnerabilities
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• npm audit</li>
                          <li>• Snyk</li>
                          <li>• OWASP Dependency-Check</li>
                          <li>• GitHub Security</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Assessment Process</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Planning Phase</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. <strong>Scope Definition:</strong> Assets, systems, applications</li>
                          <li>2. <strong>Tool Selection:</strong> Choose appropriate scanners</li>
                          <li>3. <strong>Permission:</strong> Get authorization for testing</li>
                          <li>4. <strong>Timeline:</strong> Schedule assessment windows</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Execution Phase</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. <strong>Discovery:</strong> Identify services &amp; technologies</li>
                          <li>2. <strong>Scanning:</strong> Run vulnerability scanners</li>
                          <li>3. <strong>Manual Testing:</strong> Verify findings</li>
                          <li>4. <strong>Documentation:</strong> Record all findings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Risk Scoring (CVSS)</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                      Common Vulnerability Scoring System helps prioritize vulnerabilities based on severity.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/30'} rounded p-2`}>
                        <div className={`font-bold text-green-600 dark:text-green-400`}>0.1-3.9</div>
                        <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Low</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'} rounded p-2`}>
                        <div className={`font-bold text-yellow-600 dark:text-yellow-400`}>4.0-6.9</div>
                        <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Medium</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/30' : 'bg-orange-100 dark:bg-orange-900/30'} rounded p-2`}>
                        <div className={`font-bold text-orange-600 dark:text-orange-400`}>7.0-8.9</div>
                        <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>High</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-red-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded p-2`}>
                        <div className={`font-bold text-red-600 dark:text-red-400`}>9.0-10.0</div>
                        <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Critical</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vulnerability Statistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-red-600 dark:text-red-400`}>28,000+</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>New CVEs published annually</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-orange-600 dark:text-orange-400`}>84%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Of breaches exploit known vulnerabilities</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>60%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>From vulnerable third-party components</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Vulnerability Assessment Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define assessment scope</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Run automated scans</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Perform manual testing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Risk score vulnerabilities</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create remediation plan</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Schedule regular assessments</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'implementation',
          title: '🛡️ Implementation',
          description: 'Implement security measures',
          steps: [
            {
              id: 'sec-step-3',
              title: 'HTTPS & SSL',
              description: 'Secure connections and certificates',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>HTTPS &amp; SSL/TLS Implementation</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-green-600 dark:text-green-400 mb-2`}>Why HTTPS is Essential</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      HTTPS encrypts data transmission, protects against man-in-the-middle attacks, ensures data integrity, and builds user trust. It's now required for modern web features and SEO rankings.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SSL/TLS Fundamentals</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>How SSL/TLS Works</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. <strong>Handshake:</strong> Client &amp; server negotiate encryption</li>
                          <li>2. <strong>Certificate:</strong> Server presents digital certificate</li>
                          <li>3. <strong>Verification:</strong> Client validates certificate</li>
                          <li>4. <strong>Key Exchange:</strong> Secure session keys created</li>
                          <li>5. <strong>Encryption:</strong> All data encrypted with session keys</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>TLS Versions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>❌ <strong>TLS 1.0/1.1:</strong> Deprecated, insecure</li>
                          <li>✅ <strong>TLS 1.2:</strong> Secure, widely supported</li>
                          <li>🎯 <strong>TLS 1.3:</strong> Latest, fastest, most secure</li>
                          <li>💡 <strong>Recommendation:</strong> Use TLS 1.2+ only</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>HTTPS Implementation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Obtain SSL certificate</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure server for HTTPS</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Force HTTP to HTTPS redirect</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up auto-renewal</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'sec-step-4',
              title: 'Input Validation',
              description: 'Sanitize and validate user inputs',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Input Validation &amp; Sanitization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Why Input Validation Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Input validation prevents injection attacks, data corruption, and system compromises. Never trust user input - validate everything on both client and server sides.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Input Attack Vectors</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>SQL Injection</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Malicious SQL code inserted into input fields
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded p-2 text-xs`}>
                          <code className={`${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>
                            '; DROP TABLE users; --
                          </code>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>XSS (Cross-Site Scripting)</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Malicious scripts injected into web pages
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded p-2 text-xs`}>
                          <code className={`${theme === 'gradient' ? 'text-orange-300' : 'text-orange-600'}`}>
                            &lt;script&gt;alert('XSS')&lt;/script&gt;
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Validation Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Whitelist Validation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Allow only known good inputs (recommended)
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Define allowed characters/patterns</li>
                          <li>• Reject everything else</li>
                          <li>• More secure approach</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Blacklist Validation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Block known bad inputs (less secure)
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Filter out dangerous patterns</li>
                          <li>• Allow everything else</li>
                          <li>• Easily bypassed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Input Validation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Validate all user inputs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Use parameterized queries</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Use whitelist validation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Log validation failures</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚨 Advanced',
          description: 'Advanced security measures',
          steps: [
            {
              id: 'sec-step-5',
              title: 'Security Headers',
              description: 'Implement security HTTP headers',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security HTTP Headers</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What are Security Headers?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      HTTP security headers are response headers that tell browsers how to behave when handling your site's content, providing an additional layer of security against common attacks.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Security Headers</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Content-Security-Policy (CSP)</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Prevents XSS attacks by controlling resource loading
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded p-2 text-xs mb-2`}>
                          <code className={`${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>
                            Content-Security-Policy: default-src 'self'; script-src 'self'
                          </code>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Strict-Transport-Security (HSTS)</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Forces HTTPS connections for future visits
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded p-2 text-xs mb-2`}>
                          <code className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>
                            Strict-Transport-Security: max-age=31536000; includeSubDomains
                          </code>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>X-Frame-Options</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Prevents clickjacking attacks
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded p-2 text-xs mb-2`}>
                          <code className={`${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>
                            X-Frame-Options: DENY
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Security Headers Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement CSP policy</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Enable HSTS header</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set X-Frame-Options</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test with online tools</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'sec-step-6',
              title: 'Dependency Security',
              description: 'Secure third-party dependencies',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Dependency Security Management</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Why Dependency Security Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Modern applications rely heavily on third-party dependencies. A single vulnerable dependency can compromise your entire application, making dependency security crucial for overall application security.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Dependency Risks</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Known Vulnerabilities</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Published security flaws in packages
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• CVE-documented vulnerabilities</li>
                          <li>• Publicly disclosed exploits</li>
                          <li>• Unpatched security issues</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Malicious Packages</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Intentionally harmful code in packages
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Typosquatting attacks</li>
                          <li>• Supply chain compromises</li>
                          <li>• Backdoored packages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Scanning Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>📦 Package Managers</h4>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• npm audit</li>
                          <li>• yarn audit</li>
                          <li>• pip-audit</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🔍 Commercial Tools</h4>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Snyk</li>
                          <li>• WhiteSource</li>
                          <li>• Veracode</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🛠️ Open Source</h4>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• OWASP Dependency-Check</li>
                          <li>• Safety (Python)</li>
                          <li>• GitHub Security</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Dependency Security Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Run dependency scans regularly</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Keep dependencies updated</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Use lock files</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Integrate scanning in CI/CD</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'sec-step-7',
              title: 'Security Monitoring',
              description: 'Monitor and respond to security threats',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Monitoring &amp; Threat Response</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Why Security Monitoring Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Continuous security monitoring helps detect threats in real-time, enables rapid incident response, and provides insights for improving security posture. Early detection is crucial for minimizing damage.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Security Metrics to Monitor</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Failed Authentication Attempts</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Monitor login failures to detect brute force attacks
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Multiple failed logins from same IP</li>
                          <li>• Failed admin account access</li>
                          <li>• Unusual login patterns</li>
                          <li>• Password spray attacks</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>HTTP Error Patterns</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Unusual error rates may indicate attacks
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 403/404 error spikes</li>
                          <li>• SQL injection attempts (500 errors)</li>
                          <li>• Path traversal attempts</li>
                          <li>• Scanner tool signatures</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Traffic Anomalies</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Unusual traffic patterns may signal attacks
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Sudden traffic spikes (DDoS)</li>
                          <li>• Requests from suspicious IPs</li>
                          <li>• Unusual user-agent strings</li>
                          <li>• Geographic anomalies</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>File System Changes</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Monitor for unauthorized file modifications
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Unexpected file uploads</li>
                          <li>• Configuration file changes</li>
                          <li>• New executable files</li>
                          <li>• Web shell detection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Tools &amp; Solutions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>📊 SIEM Solutions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Security Information &amp; Event Management
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Splunk</li>
                          <li>• ELK Stack (Elasticsearch)</li>
                          <li>• IBM QRadar</li>
                          <li>• Azure Sentinel</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🔍 Web Application Firewalls</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Real-time attack detection
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cloudflare WAF</li>
                          <li>• AWS WAF</li>
                          <li>• ModSecurity</li>
                          <li>• Imperva</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>📈 Application Monitoring</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Performance &amp; security insights
                        </p>
                        <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• New Relic</li>
                          <li>• Datadog</li>
                          <li>• AppDynamics</li>
                          <li>• Dynatrace</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Incident Response Process</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Detection &amp; Analysis</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. <strong>Alert Triage:</strong> Prioritize security alerts</li>
                          <li>2. <strong>Initial Assessment:</strong> Determine threat severity</li>
                          <li>3. <strong>Evidence Collection:</strong> Gather logs &amp; artifacts</li>
                          <li>4. <strong>Impact Analysis:</strong> Assess potential damage</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Containment &amp; Recovery</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. <strong>Immediate Containment:</strong> Stop the threat</li>
                          <li>2. <strong>System Isolation:</strong> Quarantine affected systems</li>
                          <li>3. <strong>Eradication:</strong> Remove malicious content</li>
                          <li>4. <strong>Recovery:</strong> Restore normal operations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Monitoring Dashboard Setup</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`# Example: Setting up basic log monitoring with fail2ban
# Install fail2ban
sudo apt-get install fail2ban

# Configure fail2ban for web server
sudo nano /etc/fail2ban/jail.local

[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10

# Start and enable fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban`}
                          </pre>
                        </div>
                      </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Alert Configuration Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>High Priority Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Immediate Response:</strong> Active breaches</li>
                          <li>• <strong>Admin Access:</strong> Privileged account usage</li>
                          <li>• <strong>Data Exfiltration:</strong> Large data transfers</li>
                          <li>• <strong>System Compromise:</strong> Malware detection</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>Medium Priority Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Suspicious Activity:</strong> Unusual patterns</li>
                          <li>• <strong>Policy Violations:</strong> Security rule breaches</li>
                          <li>• <strong>Configuration Changes:</strong> Security settings</li>
                          <li>• <strong>Vulnerability Scans:</strong> Automated scanners</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Monitoring Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>80%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster threat detection</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>70%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Reduced incident response time</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>60%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Lower security breach costs</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Security Monitoring Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up centralized logging</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure security alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor authentication events</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement file integrity monitoring</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create incident response plan</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test monitoring &amp; alerting</span>
                      </label>
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
      title: 'Step-by-Step Analytics Optimization',
      icon: <BarChart2 className="h-5 w-5" />,
      description: 'Track and optimize user behavior',
      sections: [
        {
          id: 'foundation',
          title: '📊 Foundation',
          description: 'Analytics setup and basics',
          steps: [
            {
              id: 'webdev-optimize-analytics-step-1',
              title: 'Analytics Strategy',
              description: 'Define metrics and KPIs',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Strategy &amp; Planning</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Analytics Strategy Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      A well-defined analytics strategy helps you measure what matters, make data-driven decisions, and optimize user experience. Without clear goals and metrics, you're flying blind.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Performance Indicators (KPIs)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>📈 Business Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Revenue:</strong> Total sales &amp; conversion value</li>
                          <li>• <strong>Conversion Rate:</strong> Visitors to customers</li>
                          <li>• <strong>Customer Lifetime Value (CLV):</strong> Long-term value</li>
                          <li>• <strong>Return on Investment (ROI):</strong> Marketing efficiency</li>
                          <li>• <strong>Cost Per Acquisition (CPA):</strong> Customer acquisition cost</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>👥 User Experience Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Page Load Time:</strong> Site performance</li>
                          <li>• <strong>Bounce Rate:</strong> Single-page sessions</li>
                          <li>• <strong>Session Duration:</strong> User engagement time</li>
                          <li>• <strong>Pages Per Session:</strong> Content consumption</li>
                          <li>• <strong>User Flow:</strong> Navigation patterns</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>🎯 Engagement Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Click-Through Rate (CTR):</strong> Link effectiveness</li>
                          <li>• <strong>Scroll Depth:</strong> Content consumption</li>
                          <li>• <strong>Form Completion Rate:</strong> Lead generation</li>
                          <li>• <strong>Video Engagement:</strong> Media consumption</li>
                          <li>• <strong>Social Shares:</strong> Content virality</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>🚨 Technical Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Error Rate:</strong> Technical issues</li>
                          <li>• <strong>Uptime:</strong> Site availability</li>
                          <li>• <strong>Core Web Vitals:</strong> Performance scores</li>
                          <li>• <strong>Mobile Performance:</strong> Device-specific metrics</li>
                          <li>• <strong>API Response Time:</strong> Backend performance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Framework: SMART Goals</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold text-blue-600 dark:text-blue-400 mb-1`}>S</div>
                          <div className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Specific</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Clear, well-defined objectives</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold text-green-600 dark:text-green-400 mb-1`}>M</div>
                          <div className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Measurable</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Quantifiable metrics</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-1`}>A</div>
                          <div className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Achievable</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Realistic targets</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold text-purple-600 dark:text-purple-400 mb-1`}>R</div>
                          <div className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Relevant</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Business-aligned goals</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold text-red-600 dark:text-red-400 mb-1`}>T</div>
                          <div className={`text-sm font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Time-bound</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Deadline-driven</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Tool Selection</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>📊 Web Analytics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Google Analytics 4 (Free)</li>
                          <li>• Adobe Analytics (Enterprise)</li>
                          <li>• Mixpanel (Product-focused)</li>
                          <li>• Amplitude (User behavior)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 Conversion Tracking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Google Tag Manager</li>
                          <li>• Facebook Pixel</li>
                          <li>• LinkedIn Insight Tag</li>
                          <li>• Custom event tracking</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>📈 Visualization</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Google Data Studio</li>
                          <li>• Tableau</li>
                          <li>• Power BI</li>
                          <li>• Custom dashboards</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Strategy Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>3.2x</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Higher ROI with data-driven decisions</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>67%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster decision making</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>45%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Improvement in conversion rates</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Analytics Strategy Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define business objectives</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify key metrics &amp; KPIs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set SMART goals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Choose analytics tools</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create measurement plan</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document analytics framework</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-optimize-analytics-step-2',
              title: 'Google Analytics Setup',
              description: 'Configure GA4 for your application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google Analytics 4 Setup &amp; Configuration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-green-600 dark:text-green-400 mb-2`}>Why Google Analytics 4 (GA4)?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      GA4 is the future of Google Analytics with enhanced privacy controls, cross-platform tracking, AI-powered insights, and event-based measurement that provides deeper user behavior understanding.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step-by-Step GA4 Setup</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>1. Create GA4 Property</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li>Go to <strong>analytics.google.com</strong></li>
                          <li>Click <strong>"Create Account"</strong> or use existing</li>
                          <li>Choose <strong>"Web"</strong> as platform</li>
                          <li>Enter your website URL &amp; business details</li>
                          <li>Accept terms &amp; create property</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>2. Install Tracking Code</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Add the Global Site Tag (gtag.js) or use Google Tag Manager
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                          <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>`}
                          </pre>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>3. Configure Enhanced Measurement</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Enable automatic event tracking for common interactions
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ <strong>Page views:</strong> Automatically tracked</li>
                          <li>✅ <strong>Scrolls:</strong> 90% scroll depth</li>
                          <li>✅ <strong>Outbound clicks:</strong> External links</li>
                          <li>✅ <strong>Site search:</strong> Internal search tracking</li>
                          <li>✅ <strong>File downloads:</strong> PDF, DOC, etc.</li>
                          <li>✅ <strong>Video engagement:</strong> YouTube videos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>React/Next.js Integration</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>React Analytics Hook</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// useAnalytics.js
import { useEffect } from 'react';

export const useAnalytics = () => {
  useEffect(() => {
    // Initialize GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);

  const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  };

  return { trackEvent, trackPageView };
};

// Usage in component
const { trackEvent } = useAnalytics();

const handleButtonClick = () => {
  trackEvent('button_click', {
    button_name: 'cta_button',
    page_location: window.location.pathname
  });
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential GA4 Configurations</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 Conversion Goals</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Purchase:</strong> E-commerce transactions</li>
                          <li>• <strong>Lead Generation:</strong> Form submissions</li>
                          <li>• <strong>Engagement:</strong> Time on site, pages/session</li>
                          <li>• <strong>Custom Events:</strong> Business-specific actions</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>👥 Audience Segments</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>New vs Returning:</strong> User behavior patterns</li>
                          <li>• <strong>High-Value Users:</strong> Revenue-generating segments</li>
                          <li>• <strong>Geographic:</strong> Location-based insights</li>
                          <li>• <strong>Device Type:</strong> Mobile vs desktop behavior</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>🔗 Cross-Domain Tracking</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Track users across multiple domains
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-2 text-xs`}>
                          <code className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                            gtag('config', 'GA_ID', {'{'}"linker": {'{'}"domains": ['domain1.com', 'domain2.com']{'}'}{'}'}');
                          </code>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🛡️ Privacy &amp; Compliance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Cookie Consent:</strong> GDPR compliance</li>
                          <li>• <strong>IP Anonymization:</strong> Privacy protection</li>
                          <li>• <strong>Data Retention:</strong> Storage period settings</li>
                          <li>• <strong>User Deletion:</strong> Right to be forgotten</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GA4 Setup Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>90%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More accurate user tracking</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>50%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better conversion attribution</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>75%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Improved data insights</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>GA4 Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create GA4 property</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Install tracking code</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Enable enhanced measurement</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure conversion goals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up audience segments</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test tracking implementation</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'tracking',
          title: '📈 Tracking',
          description: 'Implement tracking and events',
          steps: [
            {
              id: 'webdev-optimize-analytics-step-3',
              title: 'Event Tracking',
              description: 'Track user interactions and conversions',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Event Tracking &amp; User Interactions</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Event Tracking Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Event tracking captures specific user interactions beyond page views, providing insights into user behavior, engagement patterns, and conversion paths that drive business decisions.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Events to Track</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🛒 E-commerce Events</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>view_item:</strong> Product page views</li>
                          <li>• <strong>add_to_cart:</strong> Cart additions</li>
                          <li>• <strong>begin_checkout:</strong> Checkout starts</li>
                          <li>• <strong>purchase:</strong> Completed transactions</li>
                          <li>• <strong>remove_from_cart:</strong> Cart removals</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>📝 Engagement Events</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>form_submit:</strong> Form completions</li>
                          <li>• <strong>file_download:</strong> Document downloads</li>
                          <li>• <strong>video_play:</strong> Video interactions</li>
                          <li>• <strong>scroll:</strong> Page scroll depth</li>
                          <li>• <strong>search:</strong> Site search usage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Event Tracking Implementation</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Track button clicks
const trackButtonClick = (buttonName, location) => {
  gtag('event', 'button_click', {
    button_name: buttonName,
    page_location: location,
    event_category: 'engagement',
    event_label: buttonName
  });
};

// Track form submissions
const trackFormSubmit = (formName, success) => {
  gtag('event', 'form_submit', {
    form_name: formName,
    success: success,
    event_category: 'lead_generation'
  });
};

// Track scroll depth
const trackScrollDepth = (percentage) => {
  gtag('event', 'scroll', {
    scroll_depth: percentage,
    event_category: 'engagement'
  });
};

// Track file downloads
const trackDownload = (fileName, fileType) => {
  gtag('event', 'file_download', {
    file_name: fileName,
    file_type: fileType,
    event_category: 'downloads'
  });
};`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Event Tracking Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Track button clicks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor form submissions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Track file downloads</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Measure scroll depth</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-optimize-analytics-step-4',
              title: 'Custom Dimensions',
              description: 'Create custom tracking parameters',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Dimensions &amp; Parameters</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Why Custom Dimensions Matter</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Custom dimensions allow you to track business-specific data points that standard analytics can't capture. They provide deeper insights into user behavior, content performance, and business metrics unique to your application.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Custom Dimensions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>👤 User-Level Dimensions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Persistent data about the user across sessions
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>User Type:</strong> Premium, Free, Trial</li>
                          <li>• <strong>Registration Date:</strong> New vs returning</li>
                          <li>• <strong>User Role:</strong> Admin, Editor, Viewer</li>
                          <li>• <strong>Subscription Plan:</strong> Basic, Pro, Enterprise</li>
                          <li>• <strong>Geographic Region:</strong> Custom regions</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>📄 Event-Level Dimensions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Specific to individual events or interactions
                        </p>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Content Category:</strong> Blog, Product, Support</li>
                          <li>• <strong>Feature Used:</strong> Search, Filter, Sort</li>
                          <li>• <strong>Error Type:</strong> 404, 500, Validation</li>
                          <li>• <strong>Campaign Source:</strong> Email, Social, Paid</li>
                          <li>• <strong>Form Type:</strong> Contact, Newsletter, Support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Implementation Examples</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>User-Level Custom Dimension</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Set user-level custom dimension
const setUserDimensions = (userData) => {
  gtag('config', 'GA_MEASUREMENT_ID', {
    'custom_map': {
      'custom_dimension_1': 'user_type',
      'custom_dimension_2': 'subscription_plan'
    }
  });
  
  // Send user data
  gtag('event', 'login', {
    'user_type': userData.isPremium ? 'premium' : 'free',
    'subscription_plan': userData.plan,
    'user_id': userData.id
  });
};

// Usage example
const userData = {
  id: 'user123',
  isPremium: true,
  plan: 'pro'
};
setUserDimensions(userData);`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Event-Level Custom Dimension</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Track content engagement with custom dimensions
const trackContentView = (content) => {
  gtag('event', 'page_view', {
    'content_category': content.category,
    'content_author': content.author,
    'content_length': content.wordCount > 1000 ? 'long' : 'short',
    'reading_time': Math.ceil(content.wordCount / 200),
    'content_tags': content.tags.join(',')
  });
};

// Track feature usage
const trackFeatureUsage = (feature, context) => {
  gtag('event', 'feature_used', {
    'feature_name': feature,
    'feature_category': context.category,
    'user_experience_level': context.userLevel,
    'page_section': context.section
  });
};

// Usage examples
trackContentView({
  category: 'tutorial',
  author: 'john_doe',
  wordCount: 1500,
  tags: ['react', 'javascript', 'frontend']
});

trackFeatureUsage('advanced_search', {
  category: 'search',
  userLevel: 'expert',
  section: 'product_catalog'
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GA4 Custom Parameters Setup</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>📊 In GA4 Interface</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li>Go to <strong>Configure → Custom Definitions</strong></li>
                          <li>Click <strong>"Create custom dimensions"</strong></li>
                          <li>Choose <strong>Event</strong> or <strong>User</strong> scope</li>
                          <li>Enter parameter name &amp; description</li>
                          <li>Save and wait 24-48 hours for data</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>⚠️ Important Limits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Free:</strong> 25 custom dimensions</li>
                          <li>• <strong>GA4 360:</strong> 100 custom dimensions</li>
                          <li>• <strong>Parameter names:</strong> 40 characters max</li>
                          <li>• <strong>Parameter values:</strong> 100 characters max</li>
                          <li>• <strong>Processing time:</strong> 24-48 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Do's</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use consistent naming conventions</li>
                          <li>• Document all custom dimensions</li>
                          <li>• Group related parameters logically</li>
                          <li>• Test before full implementation</li>
                          <li>• Plan for data governance</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>❌ Don'ts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Don't send personally identifiable info</li>
                          <li>• Don't use special characters in names</li>
                          <li>• Don't exceed character limits</li>
                          <li>• Don't create duplicate dimensions</li>
                          <li>• Don't ignore data quality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Dimensions Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>40%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better user segmentation</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>60%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>More actionable insights</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>35%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Improved personalization</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Custom Dimensions Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define business requirements</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Plan naming convention</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create dimensions in GA4</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement tracking code</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test data collection</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document implementation</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Analyze and optimize',
          steps: [
            {
              id: 'webdev-optimize-analytics-step-5',
              title: 'Conversion Funnels',
              description: 'Track and optimize conversion paths',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Conversion Funnel Analysis &amp; Optimization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-green-600 dark:text-green-400 mb-2`}>Why Funnel Analysis Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Conversion funnels reveal where users drop off in their journey, helping you identify bottlenecks, optimize user experience, and increase conversion rates. Understanding the user path is crucial for business growth.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Funnel Types</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🛒 E-commerce Funnel</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li><strong>Product Discovery:</strong> Homepage, search, category</li>
                          <li><strong>Product View:</strong> Product detail page</li>
                          <li><strong>Add to Cart:</strong> Shopping cart addition</li>
                          <li><strong>Checkout Start:</strong> Begin checkout process</li>
                          <li><strong>Payment Info:</strong> Enter payment details</li>
                          <li><strong>Purchase Complete:</strong> Transaction success</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>📝 Lead Generation Funnel</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li><strong>Traffic Source:</strong> Organic, paid, social</li>
                          <li><strong>Landing Page:</strong> First impression</li>
                          <li><strong>Content Engagement:</strong> Blog, resources</li>
                          <li><strong>Lead Magnet:</strong> Download, signup</li>
                          <li><strong>Form Completion:</strong> Contact information</li>
                          <li><strong>Qualified Lead:</strong> Sales-ready prospect</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>💳 SaaS Subscription Funnel</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li><strong>Landing Page:</strong> Value proposition</li>
                          <li><strong>Free Trial Signup:</strong> Account creation</li>
                          <li><strong>Product Activation:</strong> First value moment</li>
                          <li><strong>Feature Adoption:</strong> Core functionality use</li>
                          <li><strong>Upgrade Decision:</strong> Trial to paid</li>
                          <li><strong>Payment Success:</strong> Subscription active</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>📱 App Download Funnel</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li><strong>App Store Visit:</strong> Store page view</li>
                          <li><strong>App Download:</strong> Install initiation</li>
                          <li><strong>App Open:</strong> First launch</li>
                          <li><strong>Onboarding:</strong> Tutorial completion</li>
                          <li><strong>Core Action:</strong> Key feature use</li>
                          <li><strong>Retention:</strong> Return usage</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GA4 Funnel Setup</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Creating Funnels in GA4</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>📊 Funnel Exploration</h5>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                            <li>Go to <strong>Explore → Funnel exploration</strong></li>
                            <li>Define funnel steps with events</li>
                            <li>Set up step conditions</li>
                            <li>Apply segments and filters</li>
                            <li>Analyze drop-off rates</li>
                          </ol>
                        </div>
                        <div>
                          <h5 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 Conversion Paths</h5>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                            <li>Go to <strong>Explore → Path exploration</strong></li>
                            <li>Set starting point (event/page)</li>
                            <li>Choose path direction (forward/backward)</li>
                            <li>Analyze user flow patterns</li>
                            <li>Identify optimization opportunities</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Funnel Tracking Implementation</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>E-commerce Funnel Tracking</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// E-commerce funnel events
const trackFunnelStep = (step, data) => {
  const funnelEvents = {
    'product_view': () => gtag('event', 'view_item', {
      currency: 'USD',
      value: data.price,
      items: [{
        item_id: data.productId,
        item_name: data.productName,
        category: data.category,
        price: data.price
      }]
    }),
    
    'add_to_cart': () => gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: data.price,
      items: data.items
    }),
    
    'begin_checkout': () => gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: data.cartTotal,
      items: data.items
    }),
    
    'add_payment_info': () => gtag('event', 'add_payment_info', {
      currency: 'USD',
      value: data.cartTotal
    }),
    
    'purchase': () => gtag('event', 'purchase', {
      transaction_id: data.transactionId,
      currency: 'USD',
      value: data.total,
      items: data.items
    })
  };
  
  if (funnelEvents[step]) {
    funnelEvents[step]();
  }
};

// Usage examples
trackFunnelStep('product_view', {
  productId: 'SKU123',
  productName: 'Premium Widget',
  category: 'Electronics',
  price: 99.99
});

trackFunnelStep('add_to_cart', {
  items: [{ item_id: 'SKU123', price: 99.99 }],
  price: 99.99
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Funnel Optimization Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 High-Impact Optimizations</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Reduce form fields:</strong> Minimize friction</li>
                          <li>• <strong>Improve page speed:</strong> Faster load times</li>
                          <li>• <strong>Clear CTAs:</strong> Obvious next steps</li>
                          <li>• <strong>Trust signals:</strong> Security badges, reviews</li>
                          <li>• <strong>Mobile optimization:</strong> Responsive design</li>
                          <li>• <strong>Error handling:</strong> Clear error messages</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>📊 Analysis Techniques</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Cohort analysis:</strong> User behavior over time</li>
                          <li>• <strong>Segment comparison:</strong> Different user groups</li>
                          <li>• <strong>Device analysis:</strong> Mobile vs desktop</li>
                          <li>• <strong>Traffic source impact:</strong> Channel performance</li>
                          <li>• <strong>Time-based patterns:</strong> Seasonal trends</li>
                          <li>• <strong>Geographic analysis:</strong> Location-based insights</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Funnel Metrics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>📈 Conversion Rate</h4>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1`}>2.5%</div>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average e-commerce conversion</p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>⏱️ Time to Convert</h4>
                        <div className={`text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1`}>3.2</div>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average sessions to purchase</p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4 text-center`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>🚪 Drop-off Rate</h4>
                        <div className={`text-2xl font-bold text-red-600 dark:text-red-400 mb-1`}>68%</div>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average cart abandonment</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Funnel Optimization Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>25%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average conversion improvement</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>40%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Reduction in drop-off rates</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>15%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Increase in average order value</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Funnel Analysis Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Map complete user journey</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up funnel tracking events</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create GA4 funnel reports</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify major drop-off points</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Analyze user segments</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement optimization tests</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-optimize-analytics-step-6',
              title: 'A/B Testing',
              description: 'Implement and analyze experiments',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing &amp; Experimentation</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why A/B Testing is Critical</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      A/B testing removes guesswork from optimization by providing statistical evidence of what works. It enables data-driven decisions, reduces risk, and continuously improves user experience and business metrics.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing Framework</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 Test Planning Phase</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li><strong>Identify Problem:</strong> Data-driven insights</li>
                          <li><strong>Form Hypothesis:</strong> "If we change X, then Y will improve"</li>
                          <li><strong>Define Success Metrics:</strong> Primary &amp; secondary KPIs</li>
                          <li><strong>Calculate Sample Size:</strong> Statistical power</li>
                          <li><strong>Set Test Duration:</strong> Business cycles</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🧪 Test Execution Phase</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                          <li><strong>Create Variations:</strong> Control vs treatment</li>
                          <li><strong>Random Assignment:</strong> Unbiased distribution</li>
                          <li><strong>Monitor Performance:</strong> Real-time tracking</li>
                          <li><strong>Quality Assurance:</strong> Technical validation</li>
                          <li><strong>Avoid Peeking:</strong> Wait for significance</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Test Types</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🎨 Design Tests</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Button colors &amp; styles</li>
                          <li>• Layout &amp; positioning</li>
                          <li>• Images &amp; visual elements</li>
                          <li>• Typography &amp; fonts</li>
                          <li>• Color schemes</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>📝 Content Tests</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Headlines &amp; copy</li>
                          <li>• Call-to-action text</li>
                          <li>• Product descriptions</li>
                          <li>• Value propositions</li>
                          <li>• Social proof elements</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>⚙️ Functionality Tests</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Form field requirements</li>
                          <li>• Checkout flow steps</li>
                          <li>• Navigation structure</li>
                          <li>• Feature placement</li>
                          <li>• User onboarding</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing Tools &amp; Platforms</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🆓 Free Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Google Optimize:</strong> Basic A/B testing (discontinued)</li>
                          <li>• <strong>GA4 Experiments:</strong> Built-in testing</li>
                          <li>• <strong>Microsoft Clarity:</strong> Heatmaps &amp; insights</li>
                          <li>• <strong>Hotjar:</strong> User behavior analysis</li>
                          <li>• <strong>Custom Implementation:</strong> Roll your own</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>💰 Premium Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Optimizely:</strong> Enterprise experimentation</li>
                          <li>• <strong>VWO:</strong> Visual editor &amp; targeting</li>
                          <li>• <strong>Adobe Target:</strong> AI-powered personalization</li>
                          <li>• <strong>Unbounce:</strong> Landing page optimization</li>
                          <li>• <strong>Convert.com:</strong> Advanced statistical analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Statistical Significance &amp; Analysis</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Statistical Concepts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>📊 Confidence Level</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Probability that results aren't due to chance
                          </p>
                          <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>95%:</strong> Standard confidence level</li>
                            <li>• <strong>99%:</strong> Higher confidence, larger sample</li>
                            <li>• <strong>90%:</strong> Lower confidence, faster results</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>⚡ Statistical Power</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Ability to detect a true effect when it exists
                          </p>
                          <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>80%:</strong> Standard power level</li>
                            <li>• <strong>Higher power:</strong> Requires larger sample</li>
                            <li>• <strong>Effect size:</strong> Minimum detectable difference</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Implementation Example</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Simple A/B Test Implementation</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Simple A/B test implementation
class ABTest {
  constructor(testName, variations) {
    this.testName = testName;
    this.variations = variations;
    this.assignment = this.getAssignment();
  }
  
  getAssignment() {
    // Check for existing assignment
    let assignment = localStorage.getItem(\`ab_test_\${this.testName}\`);
    
    if (!assignment) {
      // Random assignment
      const randomValue = Math.random();
      const variationIndex = Math.floor(randomValue * this.variations.length);
      assignment = this.variations[variationIndex];
      
      // Store assignment
      localStorage.setItem(\`ab_test_\${this.testName}\`, assignment);
      
      // Track assignment event
      gtag('event', 'ab_test_assignment', {
        test_name: this.testName,
        variation: assignment,
        event_category: 'experimentation'
      });
    }
    
    return assignment;
  }
  
  track(eventName, additionalData = {}) {
    gtag('event', eventName, {
      ...additionalData,
      ab_test: this.testName,
      ab_variation: this.assignment,
      event_category: 'ab_test_conversion'
    });
  }
}

// Usage example
const buttonTest = new ABTest('cta_button_test', ['control', 'variant_a', 'variant_b']);

// Render different button based on assignment
const renderButton = () => {
  const buttonConfigs = {
    control: { text: 'Sign Up', color: 'blue' },
    variant_a: { text: 'Get Started', color: 'green' },
    variant_b: { text: 'Join Now', color: 'red' }
  };
  
  const config = buttonConfigs[buttonTest.assignment];
  return \`<button class="btn-\${config.color}" onclick="handleClick()">\${config.text}</button>\`;
};

// Track conversion
const handleClick = () => {
  buttonTest.track('button_click');
  // Handle actual click logic
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Testing Mistakes</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>❌ What NOT to Do</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Peeking at results:</strong> Early stopping bias</li>
                          <li>• <strong>Testing too many things:</strong> Reduces statistical power</li>
                          <li>• <strong>Insufficient sample size:</strong> Unreliable results</li>
                          <li>• <strong>Ignoring seasonality:</strong> Time-based bias</li>
                          <li>• <strong>Not documenting tests:</strong> Losing institutional knowledge</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Best Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>One variable at a time:</strong> Clear attribution</li>
                          <li>• <strong>Run full business cycles:</strong> Account for patterns</li>
                          <li>• <strong>Document everything:</strong> Hypothesis, results, learnings</li>
                          <li>• <strong>Monitor technical metrics:</strong> Page speed, errors</li>
                          <li>• <strong>Plan follow-up tests:</strong> Iterative improvement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>A/B Testing Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>20%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Average conversion lift</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>85%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Of companies see ROI improvement</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>300%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>ROI from testing programs</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>A/B Testing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Form clear hypothesis</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Calculate sample size</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up tracking events</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create test variations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor for significance</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document results &amp; learnings</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-optimize-analytics-step-7',
              title: 'Data Visualization',
              description: 'Create insightful dashboards',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Data Visualization &amp; Dashboards</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Why Data Visualization Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Data visualization transforms complex analytics into clear, actionable insights. It enables faster decision-making, reveals patterns invisible in raw data, and helps communicate findings effectively to stakeholders across all levels of technical expertise.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Dashboard Components</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>📊 Key Performance Indicators</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Traffic Metrics:</strong> Sessions, users, pageviews</li>
                          <li>• <strong>Conversion Rates:</strong> Goals, e-commerce, leads</li>
                          <li>• <strong>Engagement:</strong> Bounce rate, session duration</li>
                          <li>• <strong>Revenue:</strong> Sales, AOV, LTV</li>
                          <li>• <strong>Growth:</strong> Period-over-period changes</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>📈 Trend Analysis</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Time Series:</strong> Performance over time</li>
                          <li>• <strong>Seasonal Patterns:</strong> Cyclical behavior</li>
                          <li>• <strong>Anomaly Detection:</strong> Unusual spikes/drops</li>
                          <li>• <strong>Forecasting:</strong> Predictive insights</li>
                          <li>• <strong>Comparative Analysis:</strong> YoY, MoM trends</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>🎯 Segmentation Views</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>User Demographics:</strong> Age, location, device</li>
                          <li>• <strong>Traffic Sources:</strong> Organic, paid, direct</li>
                          <li>• <strong>Behavior Cohorts:</strong> User journey stages</li>
                          <li>• <strong>Product Categories:</strong> Performance by type</li>
                          <li>• <strong>Campaign Performance:</strong> Marketing attribution</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>⚠️ Alert Systems</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Performance Thresholds:</strong> Automated alerts</li>
                          <li>• <strong>Goal Completions:</strong> Conversion tracking</li>
                          <li>• <strong>Error Monitoring:</strong> Technical issues</li>
                          <li>• <strong>Traffic Anomalies:</strong> Unusual patterns</li>
                          <li>• <strong>Revenue Tracking:</strong> Sales performance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Visualization Tools &amp; Platforms</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🆓 Free Platforms</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Google Analytics:</strong> Built-in dashboards</li>
                          <li>• <strong>Google Data Studio:</strong> Custom reports</li>
                          <li>• <strong>Microsoft Power BI:</strong> Free tier available</li>
                          <li>• <strong>Grafana:</strong> Open-source dashboards</li>
                          <li>• <strong>Chart.js:</strong> Custom web charts</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>💰 Premium Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Tableau:</strong> Advanced analytics</li>
                          <li>• <strong>Power BI Pro:</strong> Enterprise features</li>
                          <li>• <strong>Looker Studio:</strong> Google's BI platform</li>
                          <li>• <strong>Mixpanel:</strong> Product analytics</li>
                          <li>• <strong>Amplitude:</strong> User behavior insights</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🛠️ Developer Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>D3.js:</strong> Custom visualizations</li>
                          <li>• <strong>React Charts:</strong> Component libraries</li>
                          <li>• <strong>Observable:</strong> Notebook-style viz</li>
                          <li>• <strong>Plotly:</strong> Interactive charts</li>
                          <li>• <strong>Apache Superset:</strong> Open-source BI</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Dashboard Design Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Design Principles</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Hierarchy:</strong> Most important metrics first</li>
                          <li>• <strong>Simplicity:</strong> Avoid chart junk</li>
                          <li>• <strong>Consistency:</strong> Uniform styling &amp; colors</li>
                          <li>• <strong>Context:</strong> Provide comparison points</li>
                          <li>• <strong>Actionability:</strong> Enable drill-down</li>
                          <li>• <strong>Accessibility:</strong> Color-blind friendly</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>📱 Responsive Design</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Mobile-first:</strong> Design for small screens</li>
                          <li>• <strong>Progressive disclosure:</strong> Layer complexity</li>
                          <li>• <strong>Touch-friendly:</strong> Large interactive elements</li>
                          <li>• <strong>Loading states:</strong> Handle slow connections</li>
                          <li>• <strong>Offline capability:</strong> Cache key data</li>
                          <li>• <strong>Cross-device sync:</strong> Consistent experience</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Dashboard Implementation</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>React Dashboard Component</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Custom Analytics Dashboard Component
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData(dateRange).then(setData);
    setLoading(false);
  }, [dateRange]);

  const fetchAnalyticsData = async (range) => {
    // Fetch from GA4 Reporting API
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRange: range,
        metrics: ['sessions', 'users', 'conversions', 'revenue'],
        dimensions: ['date', 'source', 'device']
      })
    });
    return response.json();
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <KPICard 
          title="Total Users" 
          value={data.users} 
          change={data.usersChange}
          icon="👥"
        />
        <KPICard 
          title="Sessions" 
          value={data.sessions} 
          change={data.sessionsChange}
          icon="📊"
        />
        <KPICard 
          title="Conversion Rate" 
          value={\`\${data.conversionRate}%\`} 
          change={data.conversionChange}
          icon="🎯"
        />
        <KPICard 
          title="Revenue" 
          value={\`$\${data.revenue}\`} 
          change={data.revenueChange}
          icon="💰"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Traffic Trends">
          <Line data={data.trafficTrends} options={lineChartOptions} />
        </ChartCard>
        
        <ChartCard title="Traffic Sources">
          <Doughnut data={data.trafficSources} options={doughnutOptions} />
        </ChartCard>
        
        <ChartCard title="Device Breakdown">
          <Bar data={data.deviceData} options={barChartOptions} />
        </ChartCard>
        
        <ChartCard title="Top Pages">
          <TopPagesList pages={data.topPages} />
        </ChartCard>
      </div>
    </div>
  );
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Visualization Techniques</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🎨 Chart Types</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Line Charts:</strong> Trends over time</li>
                          <li>• <strong>Bar Charts:</strong> Category comparisons</li>
                          <li>• <strong>Pie Charts:</strong> Part-to-whole relationships</li>
                          <li>• <strong>Heatmaps:</strong> Intensity patterns</li>
                          <li>• <strong>Scatter Plots:</strong> Correlation analysis</li>
                          <li>• <strong>Funnel Charts:</strong> Conversion processes</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>🔍 Interactive Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Drill-down:</strong> Explore data layers</li>
                          <li>• <strong>Filtering:</strong> Dynamic data subsets</li>
                          <li>• <strong>Tooltips:</strong> Contextual information</li>
                          <li>• <strong>Zoom &amp; Pan:</strong> Detailed exploration</li>
                          <li>• <strong>Real-time Updates:</strong> Live data feeds</li>
                          <li>• <strong>Export Options:</strong> Share insights</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Data Visualization Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>65%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster decision making</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>30%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Improved data comprehension</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>90%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Of information transmitted visually</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Dashboard Creation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define dashboard objectives</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify key metrics &amp; KPIs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Choose appropriate chart types</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Design responsive layout</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement interactive features</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test &amp; iterate based on feedback</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    testing: {
      id: 'testing',
      title: 'Step-by-Step Testing Optimization',
      icon: <TestTube className="h-5 w-5" />,
      description: 'Comprehensive testing strategies',
      sections: [
        {
          id: 'foundation',
          title: '🧪 Foundation',
          description: 'Testing fundamentals',
          steps: [
            {
              id: 'test-step-1',
              title: 'Testing Strategy',
              description: 'Plan your testing approach',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Strategy &amp; Planning</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Why Testing Strategy Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      A comprehensive testing strategy ensures code quality, reduces bugs in production, improves user experience, and provides confidence for rapid development and deployment cycles.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Pyramid</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📊 The Testing Pyramid Structure</h4>
                      <div className="space-y-4">
                        <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-3`}>
                          <h5 className={`font-semibold text-red-600 dark:text-red-400 mb-1`}>🔺 E2E Tests (Few)</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>5-10%:</strong> Full user journey tests, slow but comprehensive
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-3`}>
                          <h5 className={`font-semibold text-orange-600 dark:text-orange-400 mb-1`}>🔸 Integration Tests (Some)</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>15-25%:</strong> Component interactions, API endpoints
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-3`}>
                          <h5 className={`font-semibold text-green-600 dark:text-green-400 mb-1`}>🟢 Unit Tests (Many)</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>70-80%:</strong> Individual functions/components, fast and isolated
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Types &amp; When to Use</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>🧪 Functional Testing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Unit Tests:</strong> Individual functions/methods</li>
                          <li>• <strong>Integration Tests:</strong> Component interactions</li>
                          <li>• <strong>E2E Tests:</strong> Complete user workflows</li>
                          <li>• <strong>Smoke Tests:</strong> Basic functionality verification</li>
                          <li>• <strong>Regression Tests:</strong> Prevent breaking changes</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>⚡ Non-Functional Testing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Performance Tests:</strong> Speed &amp; scalability</li>
                          <li>• <strong>Security Tests:</strong> Vulnerability scanning</li>
                          <li>• <strong>Accessibility Tests:</strong> WCAG compliance</li>
                          <li>• <strong>Usability Tests:</strong> User experience</li>
                          <li>• <strong>Compatibility Tests:</strong> Cross-browser/device</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Strategy Framework</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📋 Strategy Planning Checklist</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>🎯 Define Objectives</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Quality gates &amp; acceptance criteria</li>
                            <li>• Coverage targets (70-80% for critical code)</li>
                            <li>• Performance benchmarks</li>
                            <li>• Risk assessment &amp; mitigation</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>🛠️ Tool Selection</h5>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Testing frameworks (Jest, Vitest)</li>
                            <li>• E2E tools (Playwright, Cypress)</li>
                            <li>• CI/CD integration</li>
                            <li>• Reporting &amp; analytics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Do's</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Write tests before or during development</li>
                          <li>• Keep tests simple and focused</li>
                          <li>• Use descriptive test names</li>
                          <li>• Test edge cases and error conditions</li>
                          <li>• Maintain test independence</li>
                          <li>• Regular test maintenance</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>❌ Don'ts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Don't test implementation details</li>
                          <li>• Avoid overly complex test setups</li>
                          <li>• Don't ignore flaky tests</li>
                          <li>• Avoid testing third-party libraries</li>
                          <li>• Don't skip test documentation</li>
                          <li>• Avoid testing everything manually</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-100 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Strategy Impact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold text-green-600 dark:text-green-400`}>40%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Reduction in production bugs</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400`}>60%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Faster development cycles</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-purple-600 dark:text-purple-400`}>80%</div>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Improved code confidence</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Testing Strategy Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define testing objectives &amp; goals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Choose appropriate testing tools</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Plan test pyramid distribution</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set coverage targets</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Establish CI/CD integration</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document testing procedures</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'test-step-2',
              title: 'Unit Testing',
              description: 'Test individual components and functions',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Unit Testing Implementation</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Unit Testing?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Unit testing involves testing individual components or functions in isolation to ensure they work correctly. It's the foundation of a robust testing strategy and helps catch bugs early in development.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular Testing Frameworks</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Jest</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Zero configuration setup</li>
                          <li>• Built-in mocking capabilities</li>
                          <li>• Snapshot testing</li>
                          <li>• Code coverage reports</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>React Testing Library</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• User-focused testing approach</li>
                          <li>• DOM-based queries</li>
                          <li>• Accessibility-friendly</li>
                          <li>• Integrates with Jest</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Vitest</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Vite-native testing</li>
                          <li>• Extremely fast execution</li>
                          <li>• Jest-compatible API</li>
                          <li>• TypeScript support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Writing Your First Unit Test</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Simple Component Test Example</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('applies correct CSS class', () => {
    render(<Button className="primary">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('primary');
  });
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Test Structure</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Follow AAA pattern (Arrange, Act, Assert)</li>
                          <li>• Use descriptive test names</li>
                          <li>• Group related tests with describe()</li>
                          <li>• Keep tests independent</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What to Test</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Component rendering</li>
                          <li>• User interactions</li>
                          <li>• Props handling</li>
                          <li>• State changes</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Unit Testing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test component rendering</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test user interactions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test props handling</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test state changes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add mocking where needed</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Achieve target coverage</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'automation',
          title: '🤖 Automation',
          description: 'Automated testing implementation',
          steps: [
            {
              id: 'test-step-3',
              title: 'Integration Testing',
              description: 'Test component interactions',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Integration Testing</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Integration Testing?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Integration testing verifies that different parts of your application work correctly together. It tests the interactions between components, services, and external systems to catch interface defects.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Integration Testing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Component Integration</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Parent-child component interaction</li>
                          <li>• Props passing &amp; event handling</li>
                          <li>• Context &amp; state management</li>
                          <li>• Component composition</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>API Integration</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• HTTP requests &amp; responses</li>
                          <li>• Error handling &amp; retries</li>
                          <li>• Data transformation</li>
                          <li>• Authentication flows</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Strategies</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Component Integration Test Example</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TodoApp from './TodoApp';
import todoReducer from './todoReducer';

describe('TodoApp Integration', () => {
  let store;
  
  beforeEach(() => {
    const initialState = { todos: [] };
    store = createStore(todoReducer, initialState);
  });

  test('adds new todo when form is submitted', () => {
    render(
      <Provider store={store}>
        <TodoApp />
      </Provider>
    );
    
    const input = screen.getByPlaceholderText('Add new todo');
    const button = screen.getByRole('button', { name: /add/i });
    
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.click(button);
    
    expect(screen.getByText('New task')).toBeInTheDocument();
  });
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Mocking &amp; Test Doubles</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>API Mocking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Mock Service Worker (MSW)</li>
                          <li>• Jest fetch mocks</li>
                          <li>• Axios mock adapter</li>
                          <li>• GraphQL mocking</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Component Mocking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Mock complex child components</li>
                          <li>• Stub external libraries</li>
                          <li>• Mock router &amp; navigation</li>
                          <li>• Mock browser APIs</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-teal-900/20' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-teal-700' : 'border-teal-200 dark:border-teal-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-teal-600 dark:text-teal-400 mb-2`}>State Mocking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Redux store setup</li>
                          <li>• Context provider mocking</li>
                          <li>• Initial state configuration</li>
                          <li>• Custom hooks testing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Integration Testing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test component interactions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Mock external dependencies</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test API integrations</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test state management</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test error scenarios</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Verify data flow</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'test-step-4',
              title: 'End-to-End Testing',
              description: 'Test complete user workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>End-to-End Testing</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is End-to-End Testing?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      End-to-End (E2E) testing simulates real user scenarios by testing the complete application flow from start to finish. It validates that all integrated components work together as expected in a production-like environment.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular E2E Testing Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Cypress</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Developer-friendly interface</li>
                          <li>• Time-travel debugging</li>
                          <li>• Real browser testing</li>
                          <li>• Built-in screenshot &amp; video</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Playwright</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cross-browser support</li>
                          <li>• Mobile testing capabilities</li>
                          <li>• Auto-wait functionality</li>
                          <li>• Parallel test execution</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Selenium</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Wide language support</li>
                          <li>• Mature ecosystem</li>
                          <li>• Grid testing support</li>
                          <li>• Browser automation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>E2E Test Example</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cypress Test Example</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`describe('User Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    // Arrange
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    
    // Act
    cy.get('[data-testid="login-button"]').click();
    
    // Assert
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]')
      .should('contain', 'Welcome back');
    cy.get('[data-testid="user-avatar"]').should('be.visible');
  });

  it('should handle login errors gracefully', () => {
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]')
      .should('contain', 'Invalid credentials');
  });
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>E2E Testing Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Test Design</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Focus on critical user journeys</li>
                          <li>• Use data-testid attributes</li>
                          <li>• Keep tests independent</li>
                          <li>• Test real user scenarios</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Performance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Run tests in parallel</li>
                          <li>• Use headless mode in CI</li>
                          <li>• Implement smart waits</li>
                          <li>• Clean up test data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>E2E Testing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up E2E testing framework</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test critical user journeys</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test across different browsers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement error handling tests</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure CI/CD integration</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up test data management</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced testing techniques',
          steps: [
            {
              id: 'test-step-5',
              title: 'Performance Testing',
              description: 'Test application performance under load',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Testing</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Performance Testing?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Performance testing evaluates how your application behaves under various load conditions. It helps identify bottlenecks, ensures scalability, and validates that your app meets performance requirements.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Performance Testing</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Load Testing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Normal expected load conditions</li>
                          <li>• Verify response times</li>
                          <li>• Check resource utilization</li>
                          <li>• Validate system stability</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Stress Testing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Beyond normal capacity limits</li>
                          <li>• Find breaking points</li>
                          <li>• Test error handling</li>
                          <li>• Recovery behavior validation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Testing Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Artillery</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Node.js based</li>
                          <li>• WebSocket support</li>
                          <li>• Realistic load patterns</li>
                          <li>• Easy configuration</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>K6</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• JavaScript scripting</li>
                          <li>• Developer-centric</li>
                          <li>• CI/CD integration</li>
                          <li>• Rich metrics</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>JMeter</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• GUI &amp; command line</li>
                          <li>• Protocol support</li>
                          <li>• Distributed testing</li>
                          <li>• Extensive reporting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>K6 Load Test Example</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function() {
  const response = http.get('https://api.example.com/users');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Performance Testing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define performance requirements</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up load testing tools</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create realistic test scenarios</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor system resources</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Analyze bottlenecks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document findings</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'test-step-6',
              title: 'Security Testing',
              description: 'Test for security vulnerabilities',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Testing</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Security Testing?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Security testing identifies vulnerabilities, threats, and risks in your application. It ensures that data and resources are protected from malicious attacks and unauthorized access.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Security Vulnerabilities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>OWASP Top 10</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Injection attacks (SQL, NoSQL, XSS)</li>
                          <li>• Broken authentication</li>
                          <li>• Sensitive data exposure</li>
                          <li>• Security misconfigurations</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Frontend Specific</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cross-Site Scripting (XSS)</li>
                          <li>• Cross-Site Request Forgery (CSRF)</li>
                          <li>• Insecure dependencies</li>
                          <li>• Client-side data exposure</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Testing Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>OWASP ZAP</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Free security scanner</li>
                          <li>• Web application testing</li>
                          <li>• Automated &amp; manual testing</li>
                          <li>• CI/CD integration</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Snyk</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Dependency vulnerability scanning</li>
                          <li>• Open source security</li>
                          <li>• Real-time monitoring</li>
                          <li>• Fix recommendations</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>ESLint Security</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Static code analysis</li>
                          <li>• Security-focused rules</li>
                          <li>• Development-time checks</li>
                          <li>• Custom rule configuration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Test Example</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`describe('XSS Protection Tests', () => {
  test('should sanitize user input', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const sanitizedInput = sanitizeInput(maliciousInput);
    
    expect(sanitizedInput).not.toContain('<script>');
    expect(sanitizedInput).not.toContain('alert');
  });

  test('should prevent CSRF attacks', async () => {
    // Test without CSRF token
    const response = await fetch('/api/transfer', {
      method: 'POST',
      body: JSON.stringify({ amount: 1000 }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    expect(response.status).toBe(403);
    expect(response.statusText).toBe('Forbidden');
  });

  test('should validate authentication', async () => {
    const response = await fetch('/api/protected', {
      method: 'GET'
    });
    
    expect(response.status).toBe(401);
    expect(response.statusText).toBe('Unauthorized');
  });
});`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Prevention</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Input validation &amp; sanitization</li>
                          <li>• Content Security Policy (CSP)</li>
                          <li>• HTTPS enforcement</li>
                          <li>• Secure authentication</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Testing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Regular vulnerability scans</li>
                          <li>• Penetration testing</li>
                          <li>• Dependency auditing</li>
                          <li>• Code security reviews</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Security Testing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Run vulnerability scans</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test input validation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Audit dependencies</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test authentication flows</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Verify HTTPS enforcement</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Review security headers</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'test-step-7',
              title: 'CI/CD Integration',
              description: 'Integrate testing into deployment pipeline',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>CI/CD Testing Integration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is CI/CD Testing Integration?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      CI/CD testing integration automatically runs your test suite whenever code changes are made, ensuring that bugs are caught early and deployments are reliable and consistent.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular CI/CD Platforms</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>GitHub Actions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Native GitHub integration</li>
                          <li>• Marketplace actions</li>
                          <li>• Matrix builds</li>
                          <li>• Secrets management</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>GitLab CI</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Integrated with GitLab</li>
                          <li>• Docker support</li>
                          <li>• Auto DevOps</li>
                          <li>• Review apps</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Jenkins</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Self-hosted solution</li>
                          <li>• Extensive plugin ecosystem</li>
                          <li>• Pipeline as code</li>
                          <li>• Distributed builds</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Testing Pipeline Stages</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Pre-deployment</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Lint code quality checks</li>
                          <li>• Unit tests execution</li>
                          <li>• Integration tests</li>
                          <li>• Security scans</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Post-deployment</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Smoke tests</li>
                          <li>• E2E tests in staging</li>
                          <li>• Performance tests</li>
                          <li>• Health checks</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub Actions Workflow Example</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`name: Test & Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Security audit
      run: npm audit --audit-level=moderate`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Quality Gates</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Block deployments on test failures</li>
                          <li>• Require code coverage thresholds</li>
                          <li>• Enforce security scan passing</li>
                          <li>• Mandate code review approval</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-teal-900/20' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-teal-700' : 'border-teal-200 dark:border-teal-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-teal-600 dark:text-teal-400 mb-2`}>Performance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Parallel test execution</li>
                          <li>• Test result caching</li>
                          <li>• Selective test running</li>
                          <li>• Fast feedback loops</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>CI/CD Integration Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up CI/CD pipeline</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure automated testing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Add quality gates</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up test reporting</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor deployment health</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    monitoring: {
      id: 'monitoring',
      title: 'Step-by-Step Monitoring Optimization',
      icon: <Activity className="h-5 w-5" />,
      description: 'Monitor application health and performance',
      sections: [
        {
          id: 'foundation',
          title: '📈 Foundation',
          description: 'Monitoring basics and setup',
          steps: [
            {
              id: 'monitor-step-1',
              title: 'Monitoring Strategy',
              description: 'Define what and how to monitor',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Strategy &amp; Foundation</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Application Monitoring?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Application monitoring involves continuously observing your application's performance, availability, and user experience to detect issues early and ensure optimal performance.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Monitoring</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Infrastructure Monitoring</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Server health &amp; resources</li>
                          <li>• CPU, memory, disk usage</li>
                          <li>• Network performance</li>
                          <li>• Database performance</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Application Monitoring</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Response times &amp; throughput</li>
                          <li>• Error rates &amp; exceptions</li>
                          <li>• User experience metrics</li>
                          <li>• Transaction tracing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Metrics to Monitor</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Golden Signals</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Latency (response time)</li>
                          <li>• Traffic (request rate)</li>
                          <li>• Errors (error rate)</li>
                          <li>• Saturation (resource usage)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Business Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• User engagement</li>
                          <li>• Conversion rates</li>
                          <li>• Revenue impact</li>
                          <li>• Feature adoption</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Security Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Failed login attempts</li>
                          <li>• Suspicious activities</li>
                          <li>• API abuse patterns</li>
                          <li>• Data access anomalies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Strategy Framework</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>The 5-Step Monitoring Strategy</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5`}>1</div>
                          <div>
                            <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Define Objectives</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Identify what success looks like for your application</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5`}>2</div>
                          <div>
                            <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Choose Metrics</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Select meaningful metrics that align with your objectives</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5`}>3</div>
                          <div>
                            <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Set Thresholds</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Define acceptable ranges and alert conditions</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5`}>4</div>
                          <div>
                            <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Implement Monitoring</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Deploy monitoring tools and configure data collection</div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className={`w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5`}>5</div>
                          <div>
                            <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Iterate &amp; Improve</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Continuously refine your monitoring strategy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Architecture Overview</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <div className="flex items-center justify-center mb-4">
                        <img 
                          src="/api/placeholder/600/300" 
                          alt="Monitoring Architecture Diagram showing data flow from applications through collectors to dashboards" 
                          className="rounded-lg border max-w-full"
                        />
                      </div>
                      <p className={`text-sm text-center ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Typical monitoring architecture: Applications → Data Collectors → Storage → Dashboards &amp; Alerts
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Industry Benchmarks &amp; SLAs</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-indigo-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-indigo-700' : 'border-indigo-200 dark:border-indigo-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-indigo-600 dark:text-indigo-400 mb-2`}>Web Application SLAs</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 99.9% uptime (8.77 hours downtime/year)</li>
                          <li>• &lt; 2s page load time</li>
                          <li>• &lt; 0.1% error rate</li>
                          <li>• &lt; 200ms API response time</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-cyan-900/20' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-cyan-700' : 'border-cyan-200 dark:border-cyan-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-cyan-600 dark:text-cyan-400 mb-2`}>E-commerce Standards</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 99.95% uptime during peak hours</li>
                          <li>• &lt; 1s checkout flow response</li>
                          <li>• &lt; 3s product page load</li>
                          <li>• 0% payment processing errors</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Real-World Implementation Example</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Startup Monitoring Strategy Template</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// monitoring-config.js
const monitoringStrategy = {
  objectives: {
    primary: "Ensure 99.9% uptime for core user flows",
    secondary: "Maintain sub-2s response times",
    business: "Track user engagement &amp; conversion rates"
  },
  
  criticalMetrics: [
    "application_uptime",
    "api_response_time", 
    "error_rate",
    "user_signup_conversion"
  ],
  
  alertThresholds: {
    uptime: 99.5,          // Alert if below 99.5%
    responseTime: 5000,     // Alert if above 5s
    errorRate: 1.0,        // Alert if above 1%
    signupDrop: 50         // Alert if 50% drop in signups
  },
  
  stakeholders: {
    engineering: ["slack-alerts", "email"],
    product: ["email-summary", "dashboard"],
    executives: ["weekly-report"]
  }
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Tool Selection Matrix</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-white dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 overflow-x-auto`}>
                      <table className={`w-full text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        <thead>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'}`}>
                            <th className="text-left p-2">Company Size</th>
                            <th className="text-left p-2">Budget</th>
                            <th className="text-left p-2">Recommended Stack</th>
                            <th className="text-left p-2">Monthly Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                            <td className="p-2">Startup (1-10 devs)</td>
                            <td className="p-2">$0-$200</td>
                            <td className="p-2">UptimeRobot + Sentry Free</td>
                            <td className="p-2">$0-$50</td>
                          </tr>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                            <td className="p-2">Scale-up (10-50 devs)</td>
                            <td className="p-2">$200-$1000</td>
                            <td className="p-2">Datadog + Sentry Pro</td>
                            <td className="p-2">$300-$800</td>
                          </tr>
                          <tr>
                            <td className="p-2">Enterprise (50+ devs)</td>
                            <td className="p-2">$1000+</td>
                            <td className="p-2">New Relic + Custom</td>
                            <td className="p-2">$1500+</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Common Pitfalls &amp; Solutions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>❌ Alert Fatigue</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Too many alerts lead to ignored notifications
                        </p>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <strong>Solution:</strong> Set conservative thresholds, use escalation rules
                        </p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>✅ Smart Alerting</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Context-aware alerts with actionable information
                        </p>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          <strong>Example:</strong> "API latency &gt; 5s for /checkout (affects 10% users)"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Complete Monitoring Strategy Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define monitoring objectives &amp; SLAs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Identify key metrics &amp; thresholds</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set performance baselines</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Plan alert thresholds &amp; escalation</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Choose &amp; budget monitoring tools</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Document strategy &amp; runbooks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test alerting &amp; incident response</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create monitoring dashboard</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'monitor-step-2',
              title: 'Error Tracking',
              description: 'Set up error monitoring and logging',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Error Tracking &amp; Logging</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Error Tracking?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Error tracking automatically captures, analyzes, and reports errors in your application, providing real-time visibility into issues affecting your users and helping you prioritize fixes.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Errors to Track</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>JavaScript Errors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Uncaught exceptions</li>
                          <li>• Promise rejections</li>
                          <li>• Type errors</li>
                          <li>• Reference errors</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Network Errors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• API failures (4xx, 5xx)</li>
                          <li>• Network timeouts</li>
                          <li>• CORS issues</li>
                          <li>• Resource loading failures</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular Error Tracking Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Sentry</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time error tracking</li>
                          <li>• Performance monitoring</li>
                          <li>• Release health tracking</li>
                          <li>• Rich context &amp; stack traces</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>LogRocket</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Session replay</li>
                          <li>• Error &amp; performance tracking</li>
                          <li>• User interaction recording</li>
                          <li>• Redux DevTools integration</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Rollbar</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Intelligent error grouping</li>
                          <li>• Deploy tracking</li>
                          <li>• RQL (Rollbar Query Language)</li>
                          <li>• Advanced filtering</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Error Tracking Screenshots</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <img 
                          src="/api/placeholder/400/250" 
                          alt="Sentry dashboard showing error list with frequency and impact metrics" 
                          className="rounded-lg border max-w-full mb-2"
                        />
                        <p className={`text-sm text-center ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Sentry Error Dashboard with Error Grouping
                        </p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-gray-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <img 
                          src="/api/placeholder/400/250" 
                          alt="LogRocket session replay showing user actions leading to error" 
                          className="rounded-lg border max-w-full mb-2"
                        />
                        <p className={`text-sm text-center ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          LogRocket Session Replay Interface
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Tool Comparison Matrix</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-white dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 overflow-x-auto`}>
                      <table className={`w-full text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        <thead>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'}`}>
                            <th className="text-left p-2">Feature</th>
                            <th className="text-left p-2">Sentry</th>
                            <th className="text-left p-2">LogRocket</th>
                            <th className="text-left p-2">Rollbar</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                            <td className="p-2">Error Tracking</td>
                            <td className="p-2">✅ Excellent</td>
                            <td className="p-2">✅ Good</td>
                            <td className="p-2">✅ Excellent</td>
                          </tr>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                            <td className="p-2">Session Replay</td>
                            <td className="p-2">❌ No</td>
                            <td className="p-2">✅ Best-in-class</td>
                            <td className="p-2">❌ No</td>
                          </tr>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                            <td className="p-2">Performance Monitoring</td>
                            <td className="p-2">✅ Yes</td>
                            <td className="p-2">✅ Yes</td>
                            <td className="p-2">❌ Limited</td>
                          </tr>
                          <tr className={`border-b ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                            <td className="p-2">Free Tier</td>
                            <td className="p-2">5K errors/month</td>
                            <td className="p-2">1K sessions/month</td>
                            <td className="p-2">5K occurrences/month</td>
                          </tr>
                          <tr>
                            <td className="p-2">Pricing (Pro)</td>
                            <td className="p-2">$26/month</td>
                            <td className="p-2">$99/month</td>
                            <td className="p-2">$12/month</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Setting Up Error Tracking</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                      <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Sentry Setup Example</h4>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Install Sentry
npm install @sentry/react

// Initialize Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

// Error Boundary Component
const SentryErrorBoundary = Sentry.withErrorBoundary(
  MyApp,
  {
    fallback: ({ error }) => (
      <div>Something went wrong: {error.message}</div>
    ),
    showDialog: true,
  }
);`}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Error Context</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Include user information</li>
                          <li>• Add breadcrumb trails</li>
                          <li>• Tag errors by feature</li>
                          <li>• Include environment details</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Error Management</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Set up alert rules</li>
                          <li>• Create error ownership</li>
                          <li>• Track resolution status</li>
                          <li>• Monitor error trends</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Error Tracking Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Choose error tracking tool</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure error boundary</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up user context</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure alert rules</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test error capturing</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor error trends</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'implementation',
          title: '⚡ Implementation',
          description: 'Implement monitoring tools',
          steps: [
            {
              id: 'monitor-step-3',
              title: 'Performance Monitoring',
              description: 'Monitor application performance metrics',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Monitoring</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Performance Monitoring?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Performance monitoring tracks application speed, responsiveness, and resource usage to identify bottlenecks and optimize user experience.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Key Performance Metrics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Core Web Vitals</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Largest Contentful Paint (LCP)</li>
                          <li>• First Input Delay (FID)</li>
                          <li>• Cumulative Layout Shift (CLS)</li>
                          <li>• First Contentful Paint (FCP)</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Performance Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Page load time</li>
                          <li>• Time to Interactive (TTI)</li>
                          <li>• Total Blocking Time (TBT)</li>
                          <li>• Speed Index</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Monitoring Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Web Vitals API</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Native browser metrics</li>
                          <li>• Real user monitoring</li>
                          <li>• Core Web Vitals tracking</li>
                          <li>• Custom performance marks</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>New Relic</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Full-stack monitoring</li>
                          <li>• APM &amp; infrastructure</li>
                          <li>• Custom dashboards</li>
                          <li>• AI-powered insights</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>DataDog</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real user monitoring</li>
                          <li>• Synthetic testing</li>
                          <li>• Performance profiling</li>
                          <li>• Log correlation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Performance Monitoring Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Track Core Web Vitals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set performance budgets</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor real user metrics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create performance alerts</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'monitor-step-4',
              title: 'Uptime Monitoring',
              description: 'Monitor application availability',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Uptime Monitoring</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What is Uptime Monitoring?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Uptime monitoring continuously checks if your application is accessible and functioning correctly, alerting you immediately when issues occur.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Uptime Checks</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>HTTP/HTTPS Checks</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Status code verification</li>
                          <li>• Response time monitoring</li>
                          <li>• Content validation</li>
                          <li>• SSL certificate checks</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>API Monitoring</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Endpoint availability</li>
                          <li>• JSON response validation</li>
                          <li>• Authentication testing</li>
                          <li>• Rate limit monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular Uptime Monitoring Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>UptimeRobot</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Free plan available</li>
                          <li>• 5-minute intervals</li>
                          <li>• Multiple alert channels</li>
                          <li>• Public status pages</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Pingdom</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real user monitoring</li>
                          <li>• Page speed monitoring</li>
                          <li>• Multi-location checks</li>
                          <li>• Root cause analysis</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>StatusCake</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Domain monitoring</li>
                          <li>• Server monitoring</li>
                          <li>• Virus checking</li>
                          <li>• Pagespeed monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Uptime Monitoring Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Monitor main endpoints</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up multi-location checks</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure alert thresholds</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create status page</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚨 Advanced',
          description: 'Advanced monitoring and alerting',
          steps: [
            {
              id: 'monitor-step-5',
              title: 'Custom Metrics',
              description: 'Create and track custom business metrics',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Metrics &amp; Business Intelligence</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What are Custom Metrics?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Custom metrics track business-specific data points that matter to your application's success, beyond standard technical metrics.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Types of Custom Metrics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Business Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• User registrations</li>
                          <li>• Purchase conversions</li>
                          <li>• Feature usage</li>
                          <li>• Customer lifetime value</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>User Experience</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Form completion rates</li>
                          <li>• Search success rates</li>
                          <li>• User journey completion</li>
                          <li>• Session duration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/30' : 'bg-green-50 dark:bg-gray-800/30'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-gray-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Metrics with Google Analytics</h4>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-700/50'} rounded-lg p-3 overflow-x-auto`}>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Track custom events
gtag('event', 'purchase', {
  'event_category': 'ecommerce',
  'event_label': 'subscription',
  'value': 29.99
});

// Track feature usage
gtag('event', 'feature_used', {
  'event_category': 'engagement',
  'event_label': 'dark_mode_toggle',
  'custom_parameter': 'enabled'
});`}
                      </pre>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Custom Metrics Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define business KPIs</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Implement event tracking</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up conversion goals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create custom dashboards</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'monitor-step-6',
              title: 'Alerting Systems',
              description: 'Set up intelligent alerting',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Alerting Systems &amp; Incident Response</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What are Alerting Systems?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Alerting systems notify you when critical issues occur in your application, enabling rapid response to minimize downtime and user impact.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Alert Types &amp; Severity</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-900/20' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-700' : 'border-red-200 dark:border-red-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-red-600 dark:text-red-400 mb-2`}>Critical</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Service outages</li>
                          <li>• Database failures</li>
                          <li>• Security breaches</li>
                          <li>• High error rates</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-orange-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-700' : 'border-orange-200 dark:border-orange-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Warning</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• High response times</li>
                          <li>• Resource usage spikes</li>
                          <li>• Unusual traffic patterns</li>
                          <li>• API rate limit approaching</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Info</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Deployment notifications</li>
                          <li>• Daily reports</li>
                          <li>• Maintenance windows</li>
                          <li>• Performance summaries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Alert Channels</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Immediate Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• SMS/Text messages</li>
                          <li>• Phone calls</li>
                          <li>• Push notifications</li>
                          <li>• Slack/Teams messages</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Batch Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Email summaries</li>
                          <li>• Daily/weekly reports</li>
                          <li>• Dashboard updates</li>
                          <li>• Ticketing systems</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Alerting Systems Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define alert thresholds</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Set up escalation rules</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Configure multiple channels</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Create runbooks</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'monitor-step-7',
              title: 'Monitoring Dashboards',
              description: 'Create comprehensive monitoring dashboards',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Dashboards &amp; Visualization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                    <h3 className={`text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2`}>What are Monitoring Dashboards?</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      Monitoring dashboards provide visual representations of your application's health, performance, and key metrics in real-time, enabling quick decision-making and issue identification.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Dashboard Types</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Operational Dashboards</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time system health</li>
                          <li>• Current performance metrics</li>
                          <li>• Active alerts &amp; incidents</li>
                          <li>• Resource utilization</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-700' : 'border-purple-200 dark:border-purple-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-purple-600 dark:text-purple-400 mb-2`}>Analytical Dashboards</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Historical trends</li>
                          <li>• Performance comparisons</li>
                          <li>• Business metrics analysis</li>
                          <li>• Growth &amp; usage patterns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Popular Dashboard Tools</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-orange-600 dark:text-orange-400 mb-2`}>Grafana</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Open-source platform</li>
                          <li>• Multi-data source support</li>
                          <li>• Rich visualization options</li>
                          <li>• Alert integration</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>DataDog</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• All-in-one monitoring</li>
                          <li>• Custom dashboards</li>
                          <li>• APM integration</li>
                          <li>• Log correlation</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>New Relic</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Pre-built dashboards</li>
                          <li>• Custom chart builder</li>
                          <li>• NRQL query language</li>
                          <li>• Mobile app support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Dashboard Best Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-700' : 'border-blue-200 dark:border-blue-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-blue-600 dark:text-blue-400 mb-2`}>Design Principles</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Show most critical metrics first</li>
                          <li>• Use consistent color schemes</li>
                          <li>• Keep layouts clean &amp; uncluttered</li>
                          <li>• Make data actionable</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-green-900/20' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-700' : 'border-green-200 dark:border-green-700'} rounded-lg p-4`}>
                        <h4 className={`font-semibold text-green-600 dark:text-green-400 mb-2`}>Organization</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Group related metrics</li>
                          <li>• Create role-specific dashboards</li>
                          <li>• Use meaningful names</li>
                          <li>• Implement access controls</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-yellow-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-700' : 'border-yellow-200 dark:border-yellow-700'} rounded-lg p-4`}>
                    <h4 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-3`}>Dashboard Creation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Define dashboard purpose</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Select key metrics</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Choose visualization types</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>Test with stakeholders</span>
                      </label>
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

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  const currentLearningPath = learningPaths[activeApp] || learningPaths.performance;
  const totalSteps = currentLearningPath.sections.reduce((total, section) => total + section.steps.length, 0);

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
      
      Object.keys(learningPaths).forEach(appId => {
        const path = learningPaths[appId];
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

  const handleTabOpen = (tabId: string, step: any) => {
    // Check if tab is already open
    if (openTabs.find(tab => tab.id === tabId)) {
      setActiveTab(tabId);
      return;
    }

    // Create tab content based on tabId
    let content: React.ReactNode;
    
    switch (tabId) {
      case 'performance-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Performance Optimization Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Core Web Vitals
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Understand and optimize for Core Web Vitals metrics.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Asset Optimization
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Optimize images, JavaScript, and CSS for faster loading.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'lighthouse-tool':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Lighthouse Audit Tool
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Zap className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Lighthouse audit tool would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'seo-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              SEO Optimization Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  On-Page SEO
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Optimize page content, titles, and metadata.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'seo-audit-tool':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              SEO Audit Tool
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Search className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                SEO audit tool would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'security-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Security Optimization Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <ShieldCheck className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Security optimization guide would be embedded here
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
            Optimize Applications
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Improve performance, SEO, accessibility, and security
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {checklistCollapsed && (
            <button
              onClick={() => setChecklistCollapsed(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                theme === 'gradient' 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${theme === 'gradient' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                <span className="font-medium">Checklist</span>
              </div>
            </button>
          )}
          <Monitor className={`h-8 w-8 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
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
               items={checklistItems[activeApp] || []}
               toolId={activeApp}
             />
        </div>
            </div>
          </div>
        )}

        {/* Right Column - FAQ-Style Learning Path and Tabs */}
        <div className={checklistCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
          <div className="space-y-6">
            {/* FAQ-Style Learning Path Section */}
            <div className={`${theme === 'gradient' ? 'bg-gray-800/30 border-gray-700' : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                {currentLearningPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentLearningPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentLearningPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                  {currentLearningPath.sections.map((section, sectionIndex) => {
                    let stepCounter = 0;
                    // Calculate step number offset for this section
                    for (let i = 0; i < sectionIndex; i++) {
                      stepCounter += currentLearningPath.sections[i].steps.length;
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
                                        isCompleted ? 'bg-green-500 text-white' : `${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white`
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
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

export default WebDevOptimize;