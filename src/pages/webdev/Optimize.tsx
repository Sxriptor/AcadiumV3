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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance Auditing content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Image Optimization content</div>
            },
            {
              id: 'perf-step-4',
              title: 'Code Splitting',
              description: 'Implement dynamic imports and lazy loading',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Code Splitting content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '⚡ Advanced',
          description: 'Advanced performance techniques',
          steps: [
            {
              id: 'perf-step-5',
              title: 'Caching Strategies',
              description: 'Implement effective caching mechanisms',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Caching Strategies content</div>
            },
            {
              id: 'perf-step-6',
              title: 'Service Workers',
              description: 'Progressive Web App optimization',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Service Workers content</div>
            },
            {
              id: 'perf-step-7',
              title: 'Performance Monitoring',
              description: 'Real User Monitoring and synthetic testing',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance Monitoring content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>SEO Fundamentals content</div>
            },
            {
              id: 'seo-step-2',
              title: 'Keyword Research',
              description: 'Find and target the right keywords',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Keyword Research content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Meta Tags & Headers content</div>
            },
            {
              id: 'seo-step-4',
              title: 'Content Optimization',
              description: 'Create SEO-friendly content',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Content Optimization content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Site Structure & URLs content</div>
            },
            {
              id: 'seo-step-6',
              title: 'Schema Markup',
              description: 'Implement structured data for rich snippets',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Schema Markup content</div>
            },
            {
              id: 'seo-step-7',
              title: 'SEO Monitoring',
              description: 'Track and analyze SEO performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>SEO Monitoring content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Color & Contrast content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Security Principles content</div>
            },
            {
              id: 'sec-step-2',
              title: 'Vulnerability Assessment',
              description: 'Identify common security vulnerabilities',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Vulnerability Assessment content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>HTTPS & SSL content</div>
            },
            {
              id: 'sec-step-4',
              title: 'Input Validation',
              description: 'Sanitize and validate user inputs',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Input Validation content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Security Headers content</div>
            },
            {
              id: 'sec-step-6',
              title: 'Dependency Security',
              description: 'Secure third-party dependencies',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Dependency Security content</div>
            },
            {
              id: 'sec-step-7',
              title: 'Security Monitoring',
              description: 'Monitor and respond to security threats',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Security Monitoring content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Analytics Strategy content</div>
            },
            {
              id: 'webdev-optimize-analytics-step-2',
              title: 'Google Analytics Setup',
              description: 'Configure GA4 for your application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Google Analytics Setup content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Event Tracking content</div>
            },
            {
              id: 'webdev-optimize-analytics-step-4',
              title: 'Custom Dimensions',
              description: 'Create custom tracking parameters',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom Dimensions content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Conversion Funnels content</div>
            },
            {
              id: 'webdev-optimize-analytics-step-6',
              title: 'A/B Testing',
              description: 'Implement and analyze experiments',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>A/B Testing content</div>
            },
            {
              id: 'webdev-optimize-analytics-step-7',
              title: 'Data Visualization',
              description: 'Create insightful dashboards',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data Visualization content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Testing Strategy content</div>
            },
            {
              id: 'test-step-2',
              title: 'Unit Testing',
              description: 'Test individual components and functions',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Unit Testing content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Integration Testing content</div>
            },
            {
              id: 'test-step-4',
              title: 'End-to-End Testing',
              description: 'Test complete user workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>End-to-End Testing content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance Testing content</div>
            },
            {
              id: 'test-step-6',
              title: 'Security Testing',
              description: 'Test for security vulnerabilities',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Security Testing content</div>
            },
            {
              id: 'test-step-7',
              title: 'CI/CD Integration',
              description: 'Integrate testing into deployment pipeline',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>CI/CD Integration content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Monitoring Strategy content</div>
            },
            {
              id: 'monitor-step-2',
              title: 'Error Tracking',
              description: 'Set up error monitoring and logging',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error Tracking content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance Monitoring content</div>
            },
            {
              id: 'monitor-step-4',
              title: 'Uptime Monitoring',
              description: 'Monitor application availability',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Uptime Monitoring content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom Metrics content</div>
            },
            {
              id: 'monitor-step-6',
              title: 'Alerting Systems',
              description: 'Set up intelligent alerting',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alerting Systems content</div>
            },
            {
              id: 'monitor-step-7',
              title: 'Monitoring Dashboards',
              description: 'Create comprehensive monitoring dashboards',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Monitoring Dashboards content</div>
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