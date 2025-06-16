import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Checklist } from '../../components/shared/Checklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Database, 
  Plug, 
  Lock, 
  Cloud, 
  Webhook,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  Server,
  Shield,
  Zap,
  Settings,
  Monitor,
  Code,
  Loader2
} from 'lucide-react';
import { useUserProgress } from '../../hooks/useUserProgress';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';

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

const WebDevIntegrate: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('database');
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
    { id: 'database', name: 'Database', icon: '🗄️' },
    { id: 'auth', name: 'Authentication', icon: '🔐' },
    { id: 'apis', name: 'APIs', icon: '🔌' },
    { id: 'storage', name: 'Storage', icon: '📦' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'ai', name: 'AI Services', icon: '🧠' }
  ];

  const learningPaths: { [key: string]: LearningPath } = {
    database: {
      id: 'database',
      title: 'Step-by-Step Database Integration',
      icon: <Database className="h-5 w-5" />,
      description: 'Master database setup and management',
      sections: [
        {
          id: 'foundation',
          title: '🏗️ Foundation',
          description: 'Database fundamentals and setup',
          steps: [
            {
              id: 'webdev-integrate-db-step-1',
              title: 'Choose Your Database',
              description: 'Understanding different database types and selection',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Database Selection Guide</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Relational Databases</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• PostgreSQL (Supabase)</li>
                        <li>• MySQL</li>
                        <li>• SQLite</li>
                        <li>• Best for: Structured data, ACID compliance</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>NoSQL Databases</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• MongoDB</li>
                        <li>• Firebase Firestore</li>
                        <li>• DynamoDB</li>
                        <li>• Best for: Flexible schema, scalability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-db-step-2',
              title: 'Set Up Supabase',
              description: 'Configure your PostgreSQL database with Supabase',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Setting Up Supabase</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Supabase provides a complete backend-as-a-service with PostgreSQL database, authentication, and real-time subscriptions.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'configuration',
          title: '⚙️ Configuration',
          description: 'Database setup and optimization',
          steps: [
            {
              id: 'webdev-integrate-db-step-3',
              title: 'Design Your Schema',
              description: 'Create efficient database schemas',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Schema design content</div>
            },
            {
              id: 'webdev-integrate-db-step-4',
              title: 'Set Up Relationships',
              description: 'Configure table relationships and constraints',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Relationships content</div>
            }
          ]
        },
        {
          id: 'deployment',
          title: '🚀 Deployment',
          description: 'Production setup and optimization',
          steps: [
            {
              id: 'webdev-integrate-db-step-5',
              title: 'Optimize Performance',
              description: 'Database indexing and query optimization',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance optimization content</div>
            },
            {
              id: 'webdev-integrate-db-step-6',
              title: 'Backup & Security',
              description: 'Implement backup strategies and security measures',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Backup & Security content</div>
            },
            {
              id: 'webdev-integrate-db-step-7',
              title: 'Monitor & Scale',
              description: 'Set up monitoring and scaling strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Monitor & Scale content</div>
            }
          ]
        }
      ]
    },
    auth: {
      id: 'auth',
      title: 'Step-by-Step Authentication Guide',
      icon: <Shield className="h-5 w-5" />,
      description: 'Implement secure user authentication',
      sections: [
        {
          id: 'basics',
          title: '🔐 Basics',
          description: 'Authentication fundamentals',
          steps: [
            {
              id: 'webdev-integrate-auth-step-1',
              title: 'Authentication Types',
              description: 'Understanding different authentication methods',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Authentication types content</div>
            },
            {
              id: 'webdev-integrate-auth-step-2',
              title: 'Set Up Supabase Auth',
              description: 'Configure Supabase authentication',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Supabase Auth setup content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '🔧 Implementation',
          description: 'Build authentication features',
          steps: [
            {
              id: 'webdev-integrate-auth-step-3',
              title: 'Login & Registration',
              description: 'Create login and registration forms',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Login & Registration content</div>
            },
            {
              id: 'webdev-integrate-auth-step-4',
              title: 'Social Login',
              description: 'Implement OAuth providers',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Social Login content</div>
            }
          ]
        },
        {
          id: 'security',
          title: '🛡️ Security',
          description: 'Advanced security measures',
          steps: [
            {
              id: 'webdev-integrate-auth-step-5',
              title: 'Role-Based Access',
              description: 'Implement user roles and permissions',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Role-Based Access content</div>
            },
            {
              id: 'webdev-integrate-auth-step-6',
              title: 'Session Management',
              description: 'Secure session handling and JWT tokens',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Session Management content</div>
            },
            {
              id: 'webdev-integrate-auth-step-7',
              title: 'Security Best Practices',
              description: 'Implement security headers and best practices',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Security Best Practices content</div>
            }
          ]
        }
      ]
    },
    apis: {
      id: 'apis',
      title: 'Step-by-Step API Integration',
      icon: <Plug className="h-5 w-5" />,
      description: 'Connect and manage external APIs',
      sections: [
        {
          id: 'foundation',
          title: '🔌 Foundation',
          description: 'API basics and setup',
          steps: [
            {
              id: 'webdev-integrate-api-step-1',
              title: 'Understanding APIs',
              description: 'Learn API fundamentals and types',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>API Fundamentals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>REST APIs</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• HTTP methods (GET, POST, PUT, DELETE)</li>
                        <li>• JSON data format</li>
                        <li>• Status codes</li>
                        <li>• Best for: Simple, stateless operations</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>GraphQL APIs</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Single endpoint</li>
                        <li>• Query specific data</li>
                        <li>• Type system</li>
                        <li>• Best for: Complex data requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-api-step-2',
              title: 'API Authentication',
              description: 'Secure API access with proper authentication',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>API Authentication content</div>
            }
          ]
        },
        {
          id: 'integration',
          title: '🔗 Integration',
          description: 'Connect and consume APIs',
          steps: [
            {
              id: 'webdev-integrate-api-step-3',
              title: 'Fetch & Axios',
              description: 'Make HTTP requests with modern tools',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Fetch & Axios content</div>
            },
            {
              id: 'webdev-integrate-api-step-4',
              title: 'Error Handling',
              description: 'Handle API errors gracefully',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error Handling content</div>
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Optimize API performance',
          steps: [
            {
              id: 'webdev-integrate-api-step-5',
              title: 'Caching Strategies',
              description: 'Implement effective API caching',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Caching Strategies content</div>
            },
            {
              id: 'webdev-integrate-api-step-6',
              title: 'Rate Limiting',
              description: 'Handle rate limits and quotas',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Rate Limiting content</div>
            },
            {
              id: 'webdev-integrate-api-step-7',
              title: 'API Monitoring',
              description: 'Monitor API performance and health',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>API Monitoring content</div>
            }
          ]
        }
      ]
    },
    storage: {
      id: 'storage',
      title: 'Step-by-Step Storage Integration',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Implement file storage and management',
      sections: [
        {
          id: 'foundation',
          title: '📦 Foundation',
          description: 'Storage fundamentals',
          steps: [
            {
              id: 'webdev-integrate-storage-step-1',
              title: 'Storage Types',
              description: 'Understanding different storage solutions',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Storage Solutions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Object Storage</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• AWS S3</li>
                        <li>• Supabase Storage</li>
                        <li>• Cloudinary</li>
                        <li>• Best for: Files, images, documents</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>CDN Storage</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Cloudflare</li>
                        <li>• AWS CloudFront</li>
                        <li>• Vercel</li>
                        <li>• Best for: Fast global delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-storage-step-2',
              title: 'Set Up Supabase Storage',
              description: 'Configure cloud storage with Supabase',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Supabase Storage setup content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '📁 Implementation',
          description: 'File upload and management',
          steps: [
            {
              id: 'webdev-integrate-storage-step-3',
              title: 'File Upload',
              description: 'Implement file upload functionality',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>File Upload content</div>
            },
            {
              id: 'webdev-integrate-storage-step-4',
              title: 'Image Optimization',
              description: 'Optimize images for web delivery',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Image Optimization content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced storage features',
          steps: [
            {
              id: 'webdev-integrate-storage-step-5',
              title: 'Progressive Upload',
              description: 'Implement chunked and resumable uploads',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Progressive Upload content</div>
            },
            {
              id: 'webdev-integrate-storage-step-6',
              title: 'Access Control',
              description: 'Secure file access with permissions',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Access Control content</div>
            },
            {
              id: 'webdev-integrate-storage-step-7',
              title: 'Backup & Sync',
              description: 'Implement backup and synchronization',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Backup & Sync content</div>
            }
          ]
        }
      ]
    },
    payments: {
      id: 'payments',
      title: 'Step-by-Step Payment Integration',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Implement secure payment processing',
      sections: [
        {
          id: 'foundation',
          title: '💳 Foundation',
          description: 'Payment fundamentals',
          steps: [
            {
              id: 'webdev-integrate-payment-step-1',
              title: 'Payment Providers',
              description: 'Choose the right payment processor',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Payment Providers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Popular Providers</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Stripe</li>
                        <li>• PayPal</li>
                        <li>• Square</li>
                        <li>• Razorpay</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Key Features</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• PCI compliance</li>
                        <li>• Multiple currencies</li>
                        <li>• Fraud protection</li>
                        <li>• Easy integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-payment-step-2',
              title: 'Set Up Stripe',
              description: 'Configure Stripe for payments',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Stripe setup content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '💰 Implementation',
          description: 'Build payment flows',
          steps: [
            {
              id: 'webdev-integrate-payment-step-3',
              title: 'One-time Payments',
              description: 'Implement single payment processing',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>One-time Payments content</div>
            },
            {
              id: 'webdev-integrate-payment-step-4',
              title: 'Subscriptions',
              description: 'Set up recurring billing',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Subscriptions content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🔒 Advanced',
          description: 'Advanced payment features',
          steps: [
            {
              id: 'webdev-integrate-payment-step-5',
              title: 'Webhooks',
              description: 'Handle payment events with webhooks',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhooks content</div>
            },
            {
              id: 'webdev-integrate-payment-step-6',
              title: 'Refunds & Disputes',
              description: 'Handle refunds and chargebacks',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Refunds & Disputes content</div>
            },
            {
              id: 'webdev-integrate-payment-step-7',
              title: 'Multi-vendor Payments',
              description: 'Implement marketplace payments',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Multi-vendor Payments content</div>
            }
          ]
        }
      ]
    },
    analytics: {
      id: 'analytics',
      title: 'Step-by-Step Analytics Integration',
      icon: <Settings className="h-5 w-5" />,
      description: 'Track and analyze user behavior',
      sections: [
        {
          id: 'foundation',
          title: '📊 Foundation',
          description: 'Analytics basics and setup',
          steps: [
            {
              id: 'webdev-integrate-analytics-step-1',
              title: 'Analytics Platforms',
              description: 'Choose the right analytics solution',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Platforms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Web Analytics</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Google Analytics</li>
                        <li>• Mixpanel</li>
                        <li>• Amplitude</li>
                        <li>• Plausible</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Key Metrics</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Page views</li>
                        <li>• User sessions</li>
                        <li>• Conversion rates</li>
                        <li>• User behavior</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-analytics-step-2',
              title: 'Set Up Google Analytics',
              description: 'Configure GA4 for your application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Google Analytics setup content</div>
            }
          ]
        },
        {
          id: 'tracking',
          title: '📈 Tracking',
          description: 'Implement event tracking',
          steps: [
            {
              id: 'webdev-integrate-analytics-step-3',
              title: 'Event Tracking',
              description: 'Track user interactions and events',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Event Tracking content</div>
            },
            {
              id: 'webdev-integrate-analytics-step-4',
              title: 'Custom Dimensions',
              description: 'Create custom tracking parameters',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom Dimensions content</div>
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Advanced analytics features',
          steps: [
            {
              id: 'webdev-integrate-analytics-step-5',
              title: 'Conversion Funnels',
              description: 'Track user conversion paths',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Conversion Funnels content</div>
            },
            {
              id: 'webdev-integrate-analytics-step-6',
              title: 'A/B Testing',
              description: 'Implement and track experiments',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>A/B Testing content</div>
            },
            {
              id: 'webdev-integrate-analytics-step-7',
              title: 'Data Visualization',
              description: 'Create custom analytics dashboards',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data Visualization content</div>
            }
          ]
        }
      ]
    },
    ai: {
      id: 'ai',
      title: 'Step-by-Step AI Services Integration',
      icon: <Code className="h-5 w-5" />,
      description: 'Integrate AI and machine learning services',
      sections: [
        {
          id: 'foundation',
          title: '🧠 Foundation',
          description: 'AI service fundamentals',
          steps: [
            {
              id: 'webdev-integrate-ai-step-1',
              title: 'AI Service Types',
              description: 'Understanding different AI service categories',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Service Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Language Models</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• OpenAI GPT</li>
                        <li>• Anthropic Claude</li>
                        <li>• Google Gemini</li>
                        <li>• Text generation & analysis</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Specialized AI</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Computer Vision</li>
                        <li>• Speech Recognition</li>
                        <li>• Image Generation</li>
                        <li>• Recommendation Systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-ai-step-2',
              title: 'Set Up OpenAI API',
              description: 'Configure OpenAI for your application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>OpenAI API setup content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '🤖 Implementation',
          description: 'Build AI-powered features',
          steps: [
            {
              id: 'webdev-integrate-ai-step-3',
              title: 'Text Generation',
              description: 'Implement AI text generation features',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Text Generation content</div>
            },
            {
              id: 'webdev-integrate-ai-step-4',
              title: 'Image Analysis',
              description: 'Add computer vision capabilities',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Image Analysis content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced AI implementations',
          steps: [
            {
              id: 'webdev-integrate-ai-step-5',
              title: 'Custom Training',
              description: 'Fine-tune models for your use case',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom Training content</div>
            },
            {
              id: 'webdev-integrate-ai-step-6',
              title: 'AI Workflows',
              description: 'Chain multiple AI services together',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>AI Workflows content</div>
            },
            {
              id: 'webdev-integrate-ai-step-7',
              title: 'AI Ethics & Safety',
              description: 'Implement responsible AI practices',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>AI Ethics & Safety content</div>
            }
          ]
        }
      ]
    }
  };

  const currentLearningPath = learningPaths[activeApp] || learningPaths.database;
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

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    database: [
      {
        id: 'choose-database-type',
        title: 'Choose database type',
        description: 'Select between SQL or NoSQL based on your needs',
        completed: false
      },
      {
        id: 'setup-supabase-project',
        title: 'Set up Supabase project',
        description: 'Create new Supabase project with PostgreSQL',
        completed: false
      },
      {
        id: 'design-database-schema',
        title: 'Design database schema',
        description: 'Create tables and define relationships',
        completed: false
      },
      {
        id: 'configure-row-level-security',
        title: 'Configure row-level security',
        description: 'Set up RLS policies for data protection',
        completed: false
      },
      {
        id: 'setup-database-functions',
        title: 'Set up database functions',
        description: 'Create stored procedures and triggers',
        completed: false
      },
      {
        id: 'optimize-performance',
        title: 'Optimize database performance',
        description: 'Add indexes and optimize queries',
        completed: false
      }
    ],
    auth: [
      {
        id: 'configure-auth-providers',
        title: 'Configure auth providers',
        description: 'Set up email, OAuth, and social login providers',
        completed: false
      },
      {
        id: 'implement-signup-login',
        title: 'Implement signup/login',
        description: 'Create authentication forms and flows',
        completed: false
      },
      {
        id: 'setup-protected-routes',
        title: 'Set up protected routes',
        description: 'Implement route guards and middleware',
        completed: false
      },
      {
        id: 'configure-session-management',
        title: 'Configure session management',
        description: 'Handle user sessions and token refresh',
        completed: false
      },
      {
        id: 'implement-user-profiles',
        title: 'Implement user profiles',
        description: 'Create user profile management features',
        completed: false
      },
      {
        id: 'setup-password-reset',
        title: 'Set up password reset',
        description: 'Implement secure password recovery flow',
        completed: false
      }
    ],
    apis: [
      {
        id: 'design-api-structure',
        title: 'Design API structure',
        description: 'Plan RESTful API endpoints and data flow',
        completed: false
      },
      {
        id: 'implement-crud-operations',
        title: 'Implement CRUD operations',
        description: 'Create, read, update, delete data operations',
        completed: false
      },
      {
        id: 'setup-api-authentication',
        title: 'Set up API authentication',
        description: 'Secure APIs with JWT tokens and API keys',
        completed: false
      },
      {
        id: 'implement-rate-limiting',
        title: 'Implement rate limiting',
        description: 'Add rate limiting to prevent API abuse',
        completed: false
      },
      {
        id: 'setup-api-documentation',
        title: 'Set up API documentation',
        description: 'Create comprehensive API docs with examples',
        completed: false
      },
      {
        id: 'test-api-endpoints',
        title: 'Test API endpoints',
        description: 'Implement automated API testing suite',
        completed: false
      }
    ],
    storage: [
      {
        id: 'configure-file-storage',
        title: 'Configure file storage',
        description: 'Set up cloud storage buckets and policies',
        completed: false
      },
      {
        id: 'implement-file-upload',
        title: 'Implement file upload',
        description: 'Create secure file upload functionality',
        completed: false
      },
      {
        id: 'setup-image-processing',
        title: 'Set up image processing',
        description: 'Add image resize, compression, and optimization',
        completed: false
      },
      {
        id: 'implement-file-versioning',
        title: 'Implement file versioning',
        description: 'Track file versions and enable rollbacks',
        completed: false
      },
      {
        id: 'configure-cdn',
        title: 'Configure CDN',
        description: 'Set up content delivery network for faster access',
        completed: false
      },
      {
        id: 'setup-file-security',
        title: 'Set up file security',
        description: 'Implement access controls and virus scanning',
        completed: false
      }
    ],
    payments: [
      {
        id: 'choose-payment-provider',
        title: 'Choose payment provider',
        description: 'Select Stripe, PayPal, or other payment gateway',
        completed: false
      },
      {
        id: 'setup-payment-forms',
        title: 'Set up payment forms',
        description: 'Create secure payment collection forms',
        completed: false
      },
      {
        id: 'implement-subscription-billing',
        title: 'Implement subscription billing',
        description: 'Set up recurring payments and subscriptions',
        completed: false
      },
      {
        id: 'configure-webhooks',
        title: 'Configure payment webhooks',
        description: 'Handle payment status updates and events',
        completed: false
      },
      {
        id: 'setup-refund-system',
        title: 'Set up refund system',
        description: 'Implement automated and manual refund processing',
        completed: false
      },
      {
        id: 'implement-payment-analytics',
        title: 'Implement payment analytics',
        description: 'Track revenue, conversion rates, and payment metrics',
        completed: false
      }
    ],
    analytics: [
      {
        id: 'setup-google-analytics',
        title: 'Set up Google Analytics',
        description: 'Configure GA4 for web traffic analysis',
        completed: false
      },
      {
        id: 'implement-event-tracking',
        title: 'Implement event tracking',
        description: 'Track user interactions and custom events',
        completed: false
      },
      {
        id: 'setup-conversion-tracking',
        title: 'Set up conversion tracking',
        description: 'Monitor goals and conversion funnels',
        completed: false
      },
      {
        id: 'configure-custom-dashboards',
        title: 'Configure custom dashboards',
        description: 'Create personalized analytics dashboards',
        completed: false
      },
      {
        id: 'implement-user-segmentation',
        title: 'Implement user segmentation',
        description: 'Analyze different user groups and behaviors',
        completed: false
      },
      {
        id: 'setup-automated-reports',
        title: 'Set up automated reports',
        description: 'Generate and schedule analytics reports',
        completed: false
      }
    ],
    ai: [
      {
        id: 'choose-ai-provider',
        title: 'Choose AI service provider',
        description: 'Select OpenAI, Anthropic, or other AI services',
        completed: false
      },
      {
        id: 'setup-api-keys',
        title: 'Set up API keys',
        description: 'Configure secure API key management',
        completed: false
      },
      {
        id: 'implement-chat-interface',
        title: 'Implement chat interface',
        description: 'Create conversational AI user interface',
        completed: false
      },
      {
        id: 'setup-prompt-engineering',
        title: 'Set up prompt engineering',
        description: 'Design effective prompts for AI responses',
        completed: false
      },
      {
        id: 'implement-context-management',
        title: 'Implement context management',
        description: 'Handle conversation history and context',
        completed: false
      },
      {
        id: 'setup-ai-safety-measures',
        title: 'Set up AI safety measures',
        description: 'Implement content filtering and safety checks',
        completed: false
      }
    ]
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

  const handleTabOpen = (tabId: string, step: any) => {
    // Check if tab is already open
    if (openTabs.find(tab => tab.id === tabId)) {
      setActiveTab(tabId);
      return;
    }

    // Create tab content based on tabId
    let content: React.ReactNode;
    
    switch (tabId) {
      case 'database-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Database Integration Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Choosing a Database
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Select the right database for your application needs.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Connection Setup
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Configure secure database connections.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'supabase-config':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Supabase Configuration
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Database className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Supabase configuration interface would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'auth-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Authentication Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Auth Strategies
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Choose the right authentication strategy for your app.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'supabase-auth-config':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Supabase Auth Configuration
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Lock className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Supabase auth configuration interface would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'api-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              API Integration Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Webhook className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                API integration guide would be embedded here
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
            Integrate Services
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Connect your web application to databases, APIs, and third-party services
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
          <Database className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
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
                  Integration Checklist
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

export default WebDevIntegrate;