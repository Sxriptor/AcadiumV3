import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../components/shared/MainContentTabs';
import { 
  Bot, 
  Webhook, 
  Database, 
  Clock, 
  Bell, 
  MessageSquare,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  Cloud,
  Link,
  Timer,
  AlertTriangle,
  Workflow,
  Settings,
  Loader2
} from 'lucide-react';
import { useUserProgress } from '../hooks/useUserProgress';

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

const N8nAIAgents: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('n8n');
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
    { id: 'n8n', name: 'n8n Cloud', icon: '🔄' },
    { id: 'webhooks', name: 'Webhooks', icon: '🔗' },
    { id: 'supabase', name: 'Supabase', icon: '🗄️' },
    { id: 'cronjobs', name: 'CronJobs', icon: '⏰' },
    { id: 'alerts', name: 'Alerts', icon: '🔔' },
    { id: 'discord', name: 'Discord Bots', icon: '🤖' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    n8n: [
      {
        id: 'setup-n8n-cloud',
        title: 'Set up n8n Cloud account',
        description: 'Create your n8n Cloud workspace and configure basic settings',
        completed: false
      },
      {
        id: 'understand-workflow-concepts',
        title: 'Understand workflow concepts',
        description: 'Learn about nodes, connections, and workflow execution',
        completed: false
      },
      {
        id: 'build-first-workflow',
        title: 'Build your first workflow',
        description: 'Create a simple automation workflow to understand the basics',
        completed: false
      },
      {
        id: 'configure-credentials',
        title: 'Configure service credentials',
        description: 'Set up secure credentials for external service connections',
        completed: false
      },
      {
        id: 'test-and-debug',
        title: 'Test and debug workflow',
        description: 'Run tests and fix any issues in your automation',
        completed: false
      },
      {
        id: 'deploy-to-production',
        title: 'Deploy to production',
        description: 'Activate your workflow and monitor its performance',
        completed: false
      }
    ],
    webhooks: [
      {
        id: 'understand-webhooks',
        title: 'Understand webhook concepts',
        description: 'Learn what webhooks are and how they work',
        completed: false
      },
      {
        id: 'setup-webhook-endpoint',
        title: 'Set up webhook endpoint',
        description: 'Create n8n webhook trigger node for incoming data',
        completed: false
      },
      {
        id: 'configure-webhook-security',
        title: 'Configure webhook security',
        description: 'Implement authentication and signature verification',
        completed: false
      },
      {
        id: 'test-webhook-delivery',
        title: 'Test webhook delivery',
        description: 'Send test data to verify webhook is working correctly',
        completed: false
      },
      {
        id: 'implement-error-handling',
        title: 'Implement error handling',
        description: 'Add retry logic and error handling for failed webhooks',
        completed: false
      },
      {
        id: 'monitor-webhook-performance',
        title: 'Monitor webhook performance',
        description: 'Set up logging and monitoring for webhook endpoints',
        completed: false
      }
    ],
    supabase: [
      {
        id: 'setup-supabase-project',
        title: 'Set up Supabase project',
        description: 'Create and configure your Supabase database project',
        completed: false
      },
      {
        id: 'design-database-schema',
        title: 'Design database schema',
        description: 'Create tables and relationships for your automation data',
        completed: false
      },
      {
        id: 'configure-supabase-credentials',
        title: 'Configure Supabase credentials',
        description: 'Add Supabase API keys and connection details to n8n',
        completed: false
      },
      {
        id: 'implement-crud-operations',
        title: 'Implement CRUD operations',
        description: 'Create workflows for database create, read, update, delete',
        completed: false
      },
      {
        id: 'setup-row-level-security',
        title: 'Set up Row Level Security',
        description: 'Configure RLS policies for secure data access',
        completed: false
      },
      {
        id: 'test-database-integration',
        title: 'Test database integration',
        description: 'Verify all database operations work correctly',
        completed: false
      }
    ],
    cronjobs: [
      {
        id: 'understand-cron-syntax',
        title: 'Understand cron syntax',
        description: 'Learn how to write cron expressions for scheduling',
        completed: false
      },
      {
        id: 'setup-cron-trigger',
        title: 'Set up cron trigger',
        description: 'Configure n8n cron trigger node for scheduled execution',
        completed: false
      },
      {
        id: 'design-scheduled-workflow',
        title: 'Design scheduled workflow',
        description: 'Create automation workflow for periodic tasks',
        completed: false
      },
      {
        id: 'configure-timezone-settings',
        title: 'Configure timezone settings',
        description: 'Set appropriate timezone for your scheduled jobs',
        completed: false
      },
      {
        id: 'implement-job-monitoring',
        title: 'Implement job monitoring',
        description: 'Add logging and monitoring for scheduled executions',
        completed: false
      },
      {
        id: 'test-schedule-execution',
        title: 'Test schedule execution',
        description: 'Verify cron jobs execute at the correct times',
        completed: false
      }
    ],
    alerts: [
      {
        id: 'define-alert-criteria',
        title: 'Define alert criteria',
        description: 'Determine what events should trigger alerts',
        completed: false
      },
      {
        id: 'setup-monitoring-triggers',
        title: 'Set up monitoring triggers',
        description: 'Configure triggers that watch for alert conditions',
        completed: false
      },
      {
        id: 'configure-notification-channels',
        title: 'Configure notification channels',
        description: 'Set up email, SMS, Slack, or Discord notifications',
        completed: false
      },
      {
        id: 'implement-alert-logic',
        title: 'Implement alert logic',
        description: 'Create workflows that process and send alerts',
        completed: false
      },
      {
        id: 'setup-alert-throttling',
        title: 'Set up alert throttling',
        description: 'Prevent alert spam with rate limiting and deduplication',
        completed: false
      },
      {
        id: 'test-alert-system',
        title: 'Test alert system',
        description: 'Verify alerts are sent correctly for test conditions',
        completed: false
      }
    ],
    discord: [
      {
        id: 'create-discord-bot',
        title: 'Create Discord bot',
        description: 'Set up a Discord application and bot user',
        completed: false
      },
      {
        id: 'configure-bot-permissions',
        title: 'Configure bot permissions',
        description: 'Set appropriate permissions and invite bot to server',
        completed: false
      },
      {
        id: 'setup-discord-credentials',
        title: 'Set up Discord credentials',
        description: 'Add bot token and credentials to n8n',
        completed: false
      },
      {
        id: 'implement-message-automation',
        title: 'Implement message automation',
        description: 'Create workflows for automated Discord messaging',
        completed: false
      },
      {
        id: 'setup-slash-commands',
        title: 'Set up slash commands',
        description: 'Configure Discord slash commands for bot interaction',
        completed: false
      },
      {
        id: 'test-bot-functionality',
        title: 'Test bot functionality',
        description: 'Verify all Discord bot features work as expected',
        completed: false
      }
    ]
  };

  const learningPaths: { [key: string]: LearningPath } = {
    n8n: {
      id: 'n8n',
      title: 'Step-by-Step n8n Cloud Guide',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Master workflow automation with n8n Cloud',
      sections: [
        {
          id: 'foundation',
          title: '☁️ Foundation',
          description: 'Get started with n8n Cloud basics',
          steps: [
            {
              id: 'n8n-step-1',
              title: 'Understanding n8n',
              description: 'Learn workflow automation fundamentals',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>What is n8n?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Key Features</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Visual workflow editor</li>
                        <li>• 500+ integrations</li>
                        <li>• Code when needed</li>
                        <li>• Self-hosted or cloud</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Use Cases</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Data sync between apps</li>
                        <li>• Automated notifications</li>
                        <li>• API integrations</li>
                        <li>• Business process automation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'n8n-step-2',
              title: 'Set Up n8n Cloud',
              description: 'Create and configure your n8n Cloud account',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>n8n Cloud setup content</div>
            }
          ]
        },
        {
          id: 'workflows',
          title: '⚙️ Workflows',
          description: 'Build and manage workflows',
          steps: [
            {
              id: 'n8n-step-3',
              title: 'First Workflow',
              description: 'Create your first automation workflow',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>First Workflow content</div>
            },
            {
              id: 'n8n-step-4',
              title: 'Workflow Logic',
              description: 'Add conditions and branching logic',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Workflow Logic content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced workflow techniques',
          steps: [
            {
              id: 'n8n-step-5',
              title: 'Error Handling',
              description: 'Implement robust error handling',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error Handling content</div>
            },
            {
              id: 'n8n-step-6',
              title: 'Custom Functions',
              description: 'Write custom JavaScript functions',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom Functions content</div>
            },
            {
              id: 'n8n-step-7',
              title: 'Workflow Optimization',
              description: 'Optimize performance and efficiency',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Workflow Optimization content</div>
            }
          ]
        }
      ]
    },
    webhooks: {
      id: 'webhooks',
      title: 'Webhooks Integration Guide',
      icon: <Webhook className="h-5 w-5" />,
      description: 'Master webhook implementation and management',
      sections: [
        {
          id: 'foundation',
          title: '🔗 Foundation',
          description: 'Understanding webhook fundamentals',
          steps: [
            {
              id: 'webhook-step-1',
              title: 'What are Webhooks?',
              description: 'Learn the basics of webhooks and HTTP callbacks',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook fundamentals content</div>
            },
            {
              id: 'webhook-step-2',
              title: 'Webhook Security',
              description: 'Understand authentication and verification',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook security content</div>
            }
          ]
        },
        {
          id: 'setup',
          title: '⚙️ Setup',
          description: 'Configure webhook endpoints',
          steps: [
            {
              id: 'webhook-step-3',
              title: 'Create Webhook Endpoint',
              description: 'Set up your first webhook receiver',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook endpoint setup content</div>
            },
            {
              id: 'webhook-step-4',
              title: 'Test Webhooks',
              description: 'Test and debug webhook delivery',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook testing content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced webhook patterns',
          steps: [
            {
              id: 'webhook-step-5',
              title: 'Retry Logic',
              description: 'Implement robust retry mechanisms',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook retry logic content</div>
            },
            {
              id: 'webhook-step-6',
              title: 'Rate Limiting',
              description: 'Handle rate limits and throttling',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Rate limiting content</div>
            },
            {
              id: 'webhook-step-7',
              title: 'Monitoring & Logs',
              description: 'Monitor webhook performance and debug issues',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook monitoring content</div>
            }
          ]
        }
      ]
    },
    supabase: {
      id: 'supabase',
      title: 'Supabase Integration Guide',
      icon: <Database className="h-5 w-5" />,
      description: 'Master database operations with Supabase',
      sections: [
        {
          id: 'foundation',
          title: '🗄️ Foundation',
          description: 'Supabase fundamentals',
          steps: [
            {
              id: 'supabase-step-1',
              title: 'Supabase Overview',
              description: 'Understand Supabase features and capabilities',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Supabase overview content</div>
            },
            {
              id: 'supabase-step-2',
              title: 'Database Setup',
              description: 'Create and configure your first database',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Database setup content</div>
            }
          ]
        },
        {
          id: 'operations',
          title: '🔧 Operations',
          description: 'Database operations and queries',
          steps: [
            {
              id: 'supabase-step-3',
              title: 'CRUD Operations',
              description: 'Master Create, Read, Update, Delete operations',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>CRUD operations content</div>
            },
            {
              id: 'supabase-step-4',
              title: 'Real-time Features',
              description: 'Implement real-time subscriptions',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Real-time features content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced Supabase features',
          steps: [
            {
              id: 'supabase-step-5',
              title: 'Row Level Security',
              description: 'Implement fine-grained access control',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>RLS content</div>
            },
            {
              id: 'supabase-step-6',
              title: 'Functions & Triggers',
              description: 'Create database functions and triggers',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Functions and triggers content</div>
            },
            {
              id: 'supabase-step-7',
              title: 'Performance Optimization',
              description: 'Optimize queries and database performance',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance optimization content</div>
            }
          ]
        }
      ]
    },
    cronjobs: {
      id: 'cronjobs',
      title: 'CronJobs Automation Guide',
      icon: <Clock className="h-5 w-5" />,
      description: 'Master scheduled task automation',
      sections: [
        {
          id: 'foundation',
          title: '⏰ Foundation',
          description: 'Understanding scheduled tasks',
          steps: [
            {
              id: 'cron-step-1',
              title: 'Cron Basics',
              description: 'Learn cron syntax and scheduling patterns',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cron basics content</div>
            },
            {
              id: 'cron-step-2',
              title: 'Schedule Planning',
              description: 'Plan efficient job schedules',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Schedule planning content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '🔧 Implementation',
          description: 'Create and manage cron jobs',
          steps: [
            {
              id: 'cron-step-3',
              title: 'First Cron Job',
              description: 'Create your first scheduled automation',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>First cron job content</div>
            },
            {
              id: 'cron-step-4',
              title: 'Job Dependencies',
              description: 'Handle job dependencies and sequences',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Job dependencies content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced scheduling patterns',
          steps: [
            {
              id: 'cron-step-5',
              title: 'Error Handling',
              description: 'Implement robust error handling for jobs',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cron error handling content</div>
            },
            {
              id: 'cron-step-6',
              title: 'Job Monitoring',
              description: 'Monitor job execution and performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Job monitoring content</div>
            },
            {
              id: 'cron-step-7',
              title: 'Scaling Jobs',
              description: 'Scale cron jobs for high-load scenarios',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Scaling jobs content</div>
            }
          ]
        }
      ]
    },
    alerts: {
      id: 'alerts',
      title: 'Alert System Guide',
      icon: <Bell className="h-5 w-5" />,
      description: 'Master alert and notification systems',
      sections: [
        {
          id: 'foundation',
          title: '🔔 Foundation',
          description: 'Alert system fundamentals',
          steps: [
            {
              id: 'alert-step-1',
              title: 'Alert Types',
              description: 'Understand different types of alerts',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert types content</div>
            },
            {
              id: 'alert-step-2',
              title: 'Alert Channels',
              description: 'Configure notification channels',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert channels content</div>
            }
          ]
        },
        {
          id: 'setup',
          title: '⚙️ Setup',
          description: 'Configure alert rules and triggers',
          steps: [
            {
              id: 'alert-step-3',
              title: 'Alert Rules',
              description: 'Create intelligent alert rules',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert rules content</div>
            },
            {
              id: 'alert-step-4',
              title: 'Threshold Management',
              description: 'Set up effective alert thresholds',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Threshold management content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced alerting strategies',
          steps: [
            {
              id: 'alert-step-5',
              title: 'Alert Fatigue Prevention',
              description: 'Prevent alert overload and fatigue',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert fatigue prevention content</div>
            },
            {
              id: 'alert-step-6',
              title: 'Escalation Policies',
              description: 'Implement smart escalation workflows',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Escalation policies content</div>
            },
            {
              id: 'alert-step-7',
              title: 'Alert Analytics',
              description: 'Analyze alert patterns and optimize',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert analytics content</div>
            }
          ]
        }
      ]
    },
    discord: {
      id: 'discord',
      title: 'Discord Bot Guide',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Build powerful Discord bots and integrations',
      sections: [
        {
          id: 'foundation',
          title: '🤖 Foundation',
          description: 'Discord bot fundamentals',
          steps: [
            {
              id: 'discord-step-1',
              title: 'Bot Basics',
              description: 'Understand Discord bot architecture',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Discord bot basics content</div>
            },
            {
              id: 'discord-step-2',
              title: 'Bot Setup',
              description: 'Create and configure your Discord bot',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Bot setup content</div>
            }
          ]
        },
        {
          id: 'commands',
          title: '⚡ Commands',
          description: 'Implement bot commands and interactions',
          steps: [
            {
              id: 'discord-step-3',
              title: 'Slash Commands',
              description: 'Create modern slash commands',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Slash commands content</div>
            },
            {
              id: 'discord-step-4',
              title: 'Event Handling',
              description: 'Handle Discord events and interactions',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Event handling content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced bot features',
          steps: [
            {
              id: 'discord-step-5',
              title: 'Moderation Features',
              description: 'Implement moderation and admin tools',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Moderation features content</div>
            },
            {
              id: 'discord-step-6',
              title: 'Database Integration',
              description: 'Connect bot to database for persistence',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Database integration content</div>
            },
            {
              id: 'discord-step-7',
              title: 'Bot Deployment',
              description: 'Deploy and scale your Discord bot',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Bot deployment content</div>
            }
          ]
        }
      ]
    }
  };

  // Update active app when switching tools
  useEffect(() => {
    // Reset expanded step when changing tools
    setExpandedStep(null);
  }, [activeApp]);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const openStepInTab = (step: Step) => {
    const newTab = {
      id: step.id,
      title: step.title,
      content: step.content,
      closeable: true
    };

    // Check if tab is already open
    if (openTabs.find(tab => tab.id === step.id)) {
      setActiveTab(step.id);
      return;
    }

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(step.id);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  const currentLearningPath = learningPaths[activeApp] || learningPaths.n8n;
  const totalSteps = currentLearningPath.sections.reduce((total, section) => total + section.steps.length, 0);

  // State to store completion data for ALL apps
  const [allAppsCompletionData, setAllAppsCompletionData] = useState<{ [key: string]: { completed: number; total: number } }>({});

  // Function to fetch completion data for all apps
  const fetchAllAppsCompletionData = useCallback(async () => {
    try {
      const { data: { user } } = await (await import('../lib/supabase')).supabase.auth.getUser();
      if (!user) return;

      // Fetch all completed steps for this user across all tools
      const { data, error } = await (await import('../lib/supabase')).supabase
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
            N8n AI Agents Room
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Build powerful automation workflows and AI-driven processes
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
          <Bot className={`h-8 w-8 ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`} />
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
                  Automation Workflow Checklist
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

export default N8nAIAgents;