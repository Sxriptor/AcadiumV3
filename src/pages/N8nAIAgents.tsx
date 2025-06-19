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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Understanding n8n</h2>
                  
                  {/* Architecture Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>n8n Workflow Architecture</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">1. Trigger</div>
                        <div className="text-xs">Start workflow</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">2. Process</div>
                        <div className="text-xs">Transform data</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">3. Action</div>
                        <div className="text-xs">Send to apps</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Every n8n workflow follows this simple pattern: a trigger starts the workflow, nodes process and transform data, and actions send results to other applications.
                    </p>
                  </div>

                  {/* n8n vs Competitors */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Why Choose n8n?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>vs Zapier</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Open source</li>
                          <li>✅ Self-hostable</li>
                          <li>✅ Custom code support</li>
                          <li>✅ No task limits</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>vs Make.com</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Better for developers</li>
                          <li>✅ More flexible pricing</li>
                          <li>✅ JavaScript execution</li>
                          <li>✅ Database integration</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>vs Microsoft Power Automate</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Cross-platform</li>
                          <li>✅ Better API support</li>
                          <li>✅ Community-driven</li>
                          <li>✅ Fair pricing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Core Capabilities</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 500+ pre-built integrations</li>
                        <li>• Visual workflow editor</li>
                          <li>• JavaScript code execution</li>
                          <li>• HTTP request handling</li>
                          <li>• Database operations</li>
                          <li>• File processing</li>
                      </ul>
                    </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Advanced Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Conditional logic and branching</li>
                          <li>• Error handling and retries</li>
                          <li>• Webhook triggers</li>
                          <li>• Scheduled executions</li>
                          <li>• Data transformation</li>
                          <li>• Workflow templates</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Real-world Use Cases */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Real-World Use Cases</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>E-commerce Automation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Sync orders from Shopify to accounting software, update inventory, and send customer notifications.
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Shopify → QuickBooks → Email
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Lead Management</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Capture leads from forms, enrich with data, and distribute to sales team.
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Typeform → Clearbit → Salesforce
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Synchronization</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Keep customer data in sync across multiple platforms and databases.
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          HubSpot ↔ Supabase ↔ Mailchimp
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Content Management</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Automatically publish content across social media and backup to cloud storage.
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          RSS → Twitter → Google Drive
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Demo Links */}
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Try n8n Now</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a
                        href="https://demo.n8n.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === 'gradient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-lg block text-center transition-colors`}
                      >
                        <div className="font-semibold mb-1">Interactive Demo</div>
                        <div className="text-sm opacity-90">Try n8n without signing up</div>
                      </a>
                      <a
                        href="https://n8n.io/workflows"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === 'gradient' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white p-4 rounded-lg block text-center transition-colors`}
                      >
                        <div className="font-semibold mb-1">Workflow Templates</div>
                        <div className="text-sm opacity-90">Browse 1000+ templates</div>
                      </a>
                    </div>
                  </div>

                  {/* Pricing Guide */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Pricing Guide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Free</h4>
                        <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>$0</div>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 5,000 workflow executions</li>
                          <li>• 2 active workflows</li>
                          <li>• Community support</li>
                      </ul>
                        <div className={`mt-3 text-xs ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} font-medium`}>
                          Perfect for learning
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50 border-blue-500' : 'bg-white dark:bg-gray-800 border-blue-500'} p-4 rounded-lg border-2 text-center relative`}>
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white text-xs px-3 py-1 rounded-full`}>
                          Recommended
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Starter</h4>
                        <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-2`}>$20/mo</div>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 2,500 workflow executions</li>
                          <li>• Unlimited active workflows</li>
                          <li>• Email support</li>
                        </ul>
                        <div className={`mt-3 text-xs ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                          Great for small businesses
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Pro</h4>
                        <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'} mb-2`}>$50/mo</div>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 10,000 workflow executions</li>
                          <li>• Priority support</li>
                          <li>• Advanced features</li>
                        </ul>
                        <div className={`mt-3 text-xs ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'} font-medium`}>
                          For growing teams
                        </div>
                      </div>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Set Up n8n Cloud</h2>
                  
                  {/* Account Registration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Account Registration Walkthrough</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm`}>1</div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Visit n8n.cloud</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Go to <a href="https://n8n.cloud" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">n8n.cloud</a> and click "Get Started for Free"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm`}>2</div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Create Account</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Enter your email, create a secure password, and agree to terms of service
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm`}>3</div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Verify Email</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Check your email for verification link and click to activate your account
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Workspace Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Workspace Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Workspace Naming</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Choose a descriptive name</li>
                          <li>• Use company or project name</li>
                          <li>• Avoid special characters</li>
                          <li>• Keep it professional</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Region Selection</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Choose closest region</li>
                          <li>• Consider data residency</li>
                          <li>• US East, US West, EU</li>
                          <li>• Affects latency</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Team Invitation Process */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Team Invitation Process</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>User Roles Explained:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-800'} p-3 rounded text-center`}>
                            <div className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-1`}>Owner</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Full access, billing</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-800'} p-3 rounded text-center`}>
                            <div className={`font-semibold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-1`}>Admin</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Manage users, workflows</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-800'} p-3 rounded text-center`}>
                            <div className={`font-semibold ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'} mb-1`}>Member</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Create, edit workflows</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Invitation Steps:</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Go to Settings → Users</li>
                          <li>2. Click "Invite User"</li>
                          <li>3. Enter email address</li>
                          <li>4. Select appropriate role</li>
                          <li>5. Send invitation</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Security Settings Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Enable 2FA</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Go to Account Settings</li>
                          <li>2. Click "Security"</li>
                          <li>3. Enable Two-Factor Auth</li>
                          <li>4. Scan QR with authenticator app</li>
                          <li>5. Enter verification code</li>
                        </ol>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Key Management</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Create API keys for automation</li>
                          <li>• Set appropriate permissions</li>
                          <li>• Rotate keys regularly</li>
                          <li>• Store securely</li>
                          <li>• Monitor usage</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Billing Setup */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Billing Setup and Plan Selection</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Free Tier Limitations:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 5,000 workflow executions per month</li>
                          <li>• 2 active workflows maximum</li>
                          <li>• Community support only</li>
                          <li>• No advanced features</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>When to Upgrade:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Hitting execution limits</li>
                          <li>• Need more active workflows</li>
                          <li>• Require email support</li>
                          <li>• Want advanced features</li>
                          <li>• Production use cases</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'n8n-step-3',
              title: 'First Workflow',
              description: 'Create your first automation workflow',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>First Workflow</h2>
                  
                  {/* Hello World Workflow */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>"Hello World" Workflow Tutorial</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Let's create your first workflow with three simple nodes: Manual Trigger → Set Node → Email Node
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 ${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">1</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Manual Trigger</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Start workflow manually
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">2</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Set Node</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Add custom data
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 ${theme === 'gradient' ? 'bg-purple-500' : 'bg-purple-600'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">3</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Email Node</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Send email notification
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5 Starter Templates */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>5 Essential Starter Templates</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Webhook to Email</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Receive webhook data and send email notifications
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Webhook Trigger → Email Node
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Schedule Data Sync</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Daily sync between two databases or APIs
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Cron Trigger → HTTP Request → Database
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3. Slack Notification</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Monitor RSS feed and post updates to Slack
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          RSS Trigger → Slack Node
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>4. File Processing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Process files from Google Drive and save to database
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Google Drive → Function → Database
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>5. CRM Integration</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Sync new contacts from forms to CRM system
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Form Trigger → HubSpot/Salesforce
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Node Connection Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Node Connection Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Do's</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Connect nodes in logical order</li>
                          <li>• Use descriptive node names</li>
                          <li>• Test each connection individually</li>
                          <li>• Add notes for complex logic</li>
                          <li>• Group related nodes together</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Don'ts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Create circular dependencies</li>
                          <li>• Skip error handling nodes</li>
                          <li>• Use default node names</li>
                          <li>• Create overly complex flows</li>
                          <li>• Ignore data validation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Testing & Debugging Guide */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Testing & Debugging Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3 Testing Methods:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-800'} p-3 rounded`}>
                            <h5 className={`font-semibold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-1`}>Test Workflow</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Run entire workflow with sample data
                            </p>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-800'} p-3 rounded`}>
                            <h5 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-1`}>Execute Node</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Test individual nodes in isolation
                            </p>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-800'} p-3 rounded`}>
                            <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'} mb-1`}>View Executions</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Review execution history and logs
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Common Beginner Mistakes */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Common Beginner Mistakes to Avoid</h3>
                    <div className="space-y-3">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Not Validating Data</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Always check if required fields exist and have expected data types before processing.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Hardcoding Credentials</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Use n8n's credential system instead of hardcoding API keys or passwords in nodes.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3. No Error Handling</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Add error handling nodes to gracefully handle failures and prevent workflow crashes.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>4. Overly Complex First Workflows</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Start simple with 2-3 nodes, then gradually add complexity as you learn.
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
          id: 'workflows',
          title: '🔧 Workflows',
          description: 'Build and manage complex workflows',
          steps: [
            {
              id: 'n8n-step-4',
              title: 'Workflow Logic',
              description: 'Add conditions and branching logic',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Workflow Logic</h2>
                  
                  {/* Conditional Branching Tutorial */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Conditional Branching Tutorial</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Learn to create smart workflows that make decisions based on data using IF, Switch, and Code nodes.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>IF Node</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Simple true/false conditions
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                            Best for: Basic conditions
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Switch Node</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Multiple condition branches
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                            Best for: Multiple options
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Code Node</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Custom JavaScript logic
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                            Best for: Complex logic
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email Priority Routing Example */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Real Example: Email Priority Routing</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Route incoming emails based on priority: High → Slack alert, Medium → Email + Queue, Low → Daily digest
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">!</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>High Priority</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Instant Slack notification + Email
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">~</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Medium Priority</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Email + Add to queue
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">-</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Low Priority</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Daily digest summary
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Transformation Examples */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Data Transformation Examples</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>String Operations</h4>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                          <p><code className="bg-gray-600 px-1 rounded">name.toUpperCase()</code> - Convert to uppercase</p>
                          <p><code className="bg-gray-600 px-1 rounded">email.split('@')[0]</code> - Extract username</p>
                          <p><code className="bg-gray-600 px-1 rounded">text.substring(0, 100)</code> - Truncate text</p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Date Operations</h4>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                          <p><code className="bg-gray-600 px-1 rounded">new Date().toISOString()</code> - Current date</p>
                          <p><code className="bg-gray-600 px-1 rounded">date.getTime()</code> - Unix timestamp</p>
                          <p><code className="bg-gray-600 px-1 rounded">date.toLocaleDateString()</code> - Format date</p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Number Operations</h4>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                          <p><code className="bg-gray-600 px-1 rounded">price * 1.1</code> - Add 10% tax</p>
                          <p><code className="bg-gray-600 px-1 rounded">Math.round(value)</code> - Round number</p>
                          <p><code className="bg-gray-600 px-1 rounded">total.toFixed(2)</code> - 2 decimal places</p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Array Operations</h4>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                          <p><code className="bg-gray-600 px-1 rounded">items.length</code> - Count items</p>
                          <p><code className="bg-gray-600 px-1 rounded">tags.join(', ')</code> - Join array</p>
                          <p><code className="bg-gray-600 px-1 rounded">users[0].name</code> - First item</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loop & Iteration Patterns */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Loop & Iteration Patterns</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Split in Batches</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Process large datasets in smaller chunks to avoid memory issues
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                            Batch size: 100 items
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Item Lists</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            Process each item in an array individually through the workflow
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                            One item per execution
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Common Loop Use Cases:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Process customer records from CSV files</li>
                          <li>• Send personalized emails to subscriber lists</li>
                          <li>• Update multiple database records</li>
                          <li>• Generate reports for each department</li>
                          <li>• Sync data across multiple platforms</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Error Handling Strategies */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Error Handling Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Try-Catch Pattern</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Wrap risky operations</li>
                          <li>• Define fallback actions</li>
                          <li>• Log error details</li>
                          <li>• Continue workflow execution</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Retry Logic</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Automatic retry on failure</li>
                          <li>• Exponential backoff</li>
                          <li>• Maximum retry attempts</li>
                          <li>• Different retry strategies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Performance Optimization Tips */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Performance Optimization Tips</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">⚡</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Minimize Nodes</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Combine operations in single nodes when possible
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">📊</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Batch Operations</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Process multiple items together
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">🎯</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Filter Early</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Filter data as early as possible in workflow
                          </p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Additional Performance Tips:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use HTTP Request node instead of multiple API-specific nodes when possible</li>
                          <li>• Cache frequently accessed data using Set node</li>
                          <li>• Avoid unnecessary data transformations</li>
                          <li>• Use parallel execution for independent operations</li>
                          <li>• Monitor execution times and optimize bottlenecks</li>
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
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced n8n features and optimization',
          steps: [
            {
              id: 'n8n-step-6',
              title: 'Custom Functions',
              description: 'Write custom JavaScript functions',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Functions</h2>
                  
                  {/* JavaScript Function Writing Guide */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>JavaScript Function Writing Guide</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Learn to write powerful custom JavaScript functions in n8n Code nodes to extend workflow capabilities beyond built-in nodes.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Basic Structure</h4>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                            <p>• Access input data with <code className="bg-gray-600 px-1 rounded">items</code></p>
                            <p>• Return data with <code className="bg-gray-600 px-1 rounded">return items</code></p>
                            <p>• Use <code className="bg-gray-600 px-1 rounded">console.log()</code> for debugging</p>
                            <p>• Handle errors with try-catch blocks</p>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Available APIs</h4>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                            <p>• <code className="bg-gray-600 px-1 rounded">$node</code> - Current node info</p>
                            <p>• <code className="bg-gray-600 px-1 rounded">$workflow</code> - Workflow data</p>
                            <p>• <code className="bg-gray-600 px-1 rounded">$execution</code> - Execution context</p>
                            <p>• <code className="bg-gray-600 px-1 rounded">$json</code> - JSON utilities</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Function Template */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Basic Function Template</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Standard Template</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// Process each input item
for (const item of items) {
  try {
    // Your custom logic here
    const data = item.json;
    
    // Transform data
    const result = {
      originalData: data,
      processedAt: new Date().toISOString(),
      // Add your transformations
    };
    
    // Update item
    item.json = result;
    
  } catch (error) {
    console.error('Processing error:', error);
    item.json = { error: error.message };
  }
}

return items;`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Common Utility Functions Library */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Common Utility Functions Library</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Validation</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-2 rounded overflow-x-auto`}>
{`// Email validation
function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

// Phone number validation
function isValidPhone(phone) {
  return /^\\+?[1-9]\\d{1,14}$/.test(phone);
}

// Required fields check
function hasRequiredFields(obj, fields) {
  return fields.every(field => 
    obj[field] !== undefined && obj[field] !== null
  );
}`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Text Processing</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-2 rounded overflow-x-auto`}>
{`// Clean text
function cleanText(text) {
  return text.trim()
    .replace(/\\s+/g, ' ')
    .replace(/[^\\w\\s]/gi, '');
}

// Extract mentions
function extractMentions(text) {
  return text.match(/@\\w+/g) || [];
}

// Generate slug
function generateSlug(text) {
  return text.toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, '-');
}`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Date Utilities</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-2 rounded overflow-x-auto`}>
{`// Format date
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

// Add days to date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Array Operations</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-2 rounded overflow-x-auto`}>
{`// Remove duplicates
function removeDuplicates(arr, key) {
  return arr.filter((item, index, self) => 
    index === self.findIndex(t => t[key] === item[key])
  );
}

// Group by property
function groupBy(arr, key) {
  return arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Code Editor Best Practices</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Best Practices</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use clear, descriptive variable names</li>
                            <li>• Add comments for complex logic</li>
                            <li>• Validate input data before processing</li>
                            <li>• Use consistent code formatting</li>
                            <li>• Break complex functions into smaller ones</li>
                            <li>• Handle edge cases and null values</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Avoid These</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Hardcoding sensitive data</li>
                            <li>• Modifying global variables</li>
                            <li>• Ignoring error handling</li>
                            <li>• Using synchronous blocking operations</li>
                            <li>• Creating infinite loops</li>
                            <li>• Accessing undefined properties</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Function Testing Methods */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Function Testing Methods</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">1</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Unit Testing</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Test individual functions with sample data
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">2</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Integration Testing</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Test functions within complete workflows
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">3</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Edge Case Testing</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Test with empty, null, and invalid data
                          </p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Testing Checklist:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Test with realistic data volumes</li>
                          <li>• Verify error handling works correctly</li>
                          <li>• Check performance with large datasets</li>
                          <li>• Validate output format and structure</li>
                          <li>• Test all conditional branches</li>
                          <li>• Verify memory usage stays reasonable</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Security Considerations */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Security Considerations for Custom Code</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Protection</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Never log sensitive data</li>
                            <li>• Sanitize user inputs</li>
                            <li>• Use environment variables for secrets</li>
                            <li>• Encrypt sensitive data in transit</li>
                            <li>• Validate all external data</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Code Security</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Avoid eval() and similar functions</li>
                            <li>• Use strict mode ('use strict')</li>
                            <li>• Validate function parameters</li>
                            <li>• Limit resource consumption</li>
                            <li>• Handle timeouts gracefully</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Security Best Practices:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Regular code reviews for custom functions</li>
                          <li>• Use n8n's credential system for API keys</li>
                          <li>• Implement proper error handling without exposing internals</li>
                          <li>• Monitor function execution for anomalies</li>
                          <li>• Keep custom code minimal and focused</li>
                          <li>• Document security assumptions and requirements</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Function Examples */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-4`}>Advanced Function Examples</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Rate Limiter</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// Rate limiter with exponential backoff
class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  async canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(now);
    return true;
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'n8n-step-7',
              title: 'Workflow Optimization',
              description: 'Optimize performance and efficiency',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Workflow Optimization</h2>
                  
                  {/* Performance Optimization Guide */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Performance Optimization Strategies</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Optimize your n8n workflows for maximum efficiency, speed, and resource utilization with these proven strategies.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">⚡</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Execution Speed</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Reduce workflow execution time
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">💾</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Memory Usage</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Optimize memory consumption
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">🔄</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Resource Efficiency</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Minimize resource consumption
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Memory Usage Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Memory Usage Optimization</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Processing</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Process data in smaller chunks</li>
                            <li>• Use streaming for large datasets</li>
                            <li>• Clear unused variables in code nodes</li>
                            <li>• Avoid storing large objects in memory</li>
                            <li>• Use pagination for API calls</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Node Optimization</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Minimize data passed between nodes</li>
                            <li>• Use Set node to filter unnecessary fields</li>
                            <li>• Combine multiple operations in single nodes</li>
                            <li>• Remove debug nodes in production</li>
                            <li>• Use Function nodes efficiently</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Memory Management Best Practices:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Monitor workflow memory usage in execution logs</li>
                          <li>• Set appropriate batch sizes for bulk operations</li>
                          <li>• Use database queries instead of loading all data</li>
                          <li>• Implement proper garbage collection in custom code</li>
                          <li>• Consider workflow splitting for memory-intensive tasks</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Execution Time Reduction */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Execution Time Reduction Techniques</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Parallel Processing</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use parallel execution for independent tasks</li>
                            <li>• Implement concurrent API calls</li>
                            <li>• Split workflows into parallel branches</li>
                            <li>• Use Wait node for synchronization</li>
                            <li>• Optimize branch conditions</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Node Efficiency</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use HTTP Request instead of specific API nodes</li>
                            <li>• Cache frequently accessed data</li>
                            <li>• Minimize database queries</li>
                            <li>• Use bulk operations when possible</li>
                            <li>• Optimize conditional logic</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Speed Optimization Tips:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Profile workflow execution to identify bottlenecks</li>
                          <li>• Use indexes on database queries</li>
                          <li>• Implement request caching for external APIs</li>
                          <li>• Optimize JSON parsing and data transformations</li>
                          <li>• Consider using webhooks instead of polling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring and Analytics Setup */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Monitoring and Analytics Setup</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">📊</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Metrics</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Track execution time, memory usage, success rates
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">🔍</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Tracking</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Monitor failures, timeouts, and bottlenecks
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">📈</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Usage Analytics</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Analyze workflow patterns and optimization opportunities
                          </p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Monitoring Implementation:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Set up n8n execution logging and retention policies</li>
                          <li>• Create custom metrics dashboards for key workflows</li>
                          <li>• Implement alerting for performance degradation</li>
                          <li>• Use external monitoring tools (Grafana, DataDog, etc.)</li>
                          <li>• Regular performance reviews and optimization cycles</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Scaling Strategies */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Scaling Strategies for High-Volume Workflows</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Horizontal Scaling</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Split workflows by data type or source</li>
                            <li>• Use multiple n8n instances for load distribution</li>
                            <li>• Implement queue-based processing</li>
                            <li>• Load balance across multiple workers</li>
                            <li>• Use external task queues (Redis, RabbitMQ)</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Vertical Scaling</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Optimize server resources (CPU, RAM)</li>
                            <li>• Tune n8n configuration parameters</li>
                            <li>• Use faster storage (SSD, NVMe)</li>
                            <li>• Optimize database connections</li>
                            <li>• Implement connection pooling</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Enterprise Scaling Considerations:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Consider n8n Cloud Enterprise for managed scaling</li>
                          <li>• Implement proper backup and disaster recovery</li>
                          <li>• Use container orchestration (Kubernetes, Docker Swarm)</li>
                          <li>• Set up proper logging and monitoring infrastructure</li>
                          <li>• Plan for peak load scenarios and auto-scaling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Optimization Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Workflow Optimization Checklist</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Performance Checklist</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Profile workflow execution times</li>
                            <li>□ Optimize memory usage patterns</li>
                            <li>□ Implement parallel processing where possible</li>
                            <li>□ Cache frequently accessed data</li>
                            <li>□ Minimize external API calls</li>
                            <li>□ Use efficient data structures</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-2`}>📊 Monitoring Checklist</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>□ Set up execution logging</li>
                            <li>□ Create performance dashboards</li>
                            <li>□ Configure alerting for failures</li>
                            <li>□ Track resource utilization</li>
                            <li>□ Monitor error rates and patterns</li>
                            <li>□ Regular performance reviews</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Optimization Workflow:</h4>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={`${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white px-2 py-1 rounded text-xs`}>1. Measure</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</span>
                          <span className={`${theme === 'gradient' ? 'bg-green-500' : 'bg-green-600'} text-white px-2 py-1 rounded text-xs`}>2. Analyze</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</span>
                          <span className={`${theme === 'gradient' ? 'bg-purple-500' : 'bg-purple-600'} text-white px-2 py-1 rounded text-xs`}>3. Optimize</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</span>
                          <span className={`${theme === 'gradient' ? 'bg-yellow-500' : 'bg-yellow-600'} text-white px-2 py-1 rounded text-xs`}>4. Validate</span>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>What are Webhooks?</h2>
                  
                  {/* HTTP Protocol Explanation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Understanding HTTP Callbacks</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Webhooks are HTTP callbacks that allow applications to communicate with each other in real-time when specific events occur.
                      </p>
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                          <div className="font-semibold">1. Event Occurs</div>
                          <div className="text-xs">User action, system trigger</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                          <div className="font-semibold">2. HTTP POST</div>
                          <div className="text-xs">Send data payload</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                        <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                          <div className="font-semibold">3. Process</div>
                          <div className="text-xs">Handle in n8n</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Webhook vs API Polling Comparison */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Webhooks vs API Polling</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Webhooks (Push)</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time data delivery</li>
                          <li>• Efficient resource usage</li>
                          <li>• Event-driven architecture</li>
                          <li>• Immediate response to changes</li>
                          <li>• Lower server load</li>
                          <li>• No rate limiting concerns</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ API Polling (Pull)</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Delayed data updates</li>
                          <li>• Wasteful API calls</li>
                          <li>• Higher resource consumption</li>
                          <li>• Potential rate limiting</li>
                          <li>• Increased server costs</li>
                          <li>• Missed events between polls</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Real-world Webhook Examples */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Real-World Webhook Examples</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>E-commerce</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Shopify sends webhooks when orders are created, updated, or fulfilled
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Order placed → Webhook → Update inventory
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Payments</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Stripe sends webhooks for payment success, failure, or disputes
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Payment complete → Webhook → Send receipt
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Git Repositories</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          GitHub sends webhooks for code pushes, pull requests, and issues
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Code push → Webhook → Deploy to staging
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Communication</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Discord sends webhooks for new messages, member joins, or reactions
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          New message → Webhook → Moderate content
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Ecosystem Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Webhook Ecosystem Overview</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">📤</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Webhook Providers</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Services that send webhooks (GitHub, Stripe, Shopify)
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">🔄</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Webhook Processors</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Tools that receive and process webhooks (n8n, Zapier)
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                            <span className="text-white font-bold">📥</span>
                          </div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Webhook Consumers</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Applications that act on webhook data (databases, APIs)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Webhook Simulator */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Try Webhooks Yourself</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Use these tools to test and understand webhook behavior before implementing in n8n:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                          href="https://webhook.site"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${theme === 'gradient' ? 'bg-cyan-600 hover:bg-cyan-700' : 'bg-cyan-600 hover:bg-cyan-700'} text-white p-4 rounded-lg block text-center transition-colors`}
                        >
                          <div className="font-semibold mb-1">Webhook.site</div>
                          <div className="text-sm opacity-90">Instantly receive and inspect webhooks</div>
                        </a>
                        <a
                          href="https://requestbin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${theme === 'gradient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-lg block text-center transition-colors`}
                        >
                          <div className="font-semibold mb-1">RequestBin</div>
                          <div className="text-sm opacity-90">Collect and debug HTTP requests</div>
                        </a>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Quick Test Steps:</h4>
                        <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>1. Visit webhook.site and copy your unique URL</li>
                          <li>2. Configure any service to send webhooks to that URL</li>
                          <li>3. Trigger an event and watch the webhook data appear</li>
                          <li>4. Analyze the payload structure and headers</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-2',
              title: 'Webhook Security',
              description: 'Understand authentication and verification',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Webhook Security</h2>
                  
                  {/* Signature Verification Guide */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Signature Verification</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Webhook signatures ensure that incoming requests are authentic and haven't been tampered with.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>How It Works</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Service generates HMAC signature</li>
                            <li>2. Signature sent in HTTP header</li>
                            <li>3. n8n verifies signature matches</li>
                            <li>4. Request processed if valid</li>
                          </ol>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Common Headers</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <code className="bg-gray-600 px-1 rounded">X-Hub-Signature-256</code> (GitHub)</li>
                            <li>• <code className="bg-gray-600 px-1 rounded">Stripe-Signature</code> (Stripe)</li>
                            <li>• <code className="bg-gray-600 px-1 rounded">X-Shopify-Hmac-Sha256</code> (Shopify)</li>
                            <li>• <code className="bg-gray-600 px-1 rounded">X-Signature</code> (Custom)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Authentication Methods Comparison */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Authentication Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🔐</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>HMAC Signatures</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Cryptographic hash verification
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-green-600 text-green-200' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'} px-2 py-1 rounded`}>
                          Most Secure
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🔑</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Keys</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Simple token-based auth
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-yellow-600 text-yellow-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'} px-2 py-1 rounded`}>
                          Moderate Security
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🌐</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>IP Whitelisting</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Network-level filtering
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-red-600 text-red-200' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'} px-2 py-1 rounded`}>
                          Basic Security
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* HTTPS and Encryption Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>HTTPS and Encryption Best Practices</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ HTTPS Requirements</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Always use HTTPS endpoints</li>
                            <li>• Valid SSL/TLS certificates</li>
                            <li>• TLS 1.2 or higher</li>
                            <li>• Strong cipher suites</li>
                            <li>• Certificate pinning (advanced)</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Security Risks</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• HTTP endpoints (unencrypted)</li>
                            <li>• Self-signed certificates</li>
                            <li>• Weak encryption protocols</li>
                            <li>• Exposed webhook URLs</li>
                            <li>• Missing signature verification</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>n8n Cloud Security:</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          n8n Cloud automatically provides HTTPS endpoints with valid certificates. All webhook URLs use the format: <code className="bg-gray-600 px-1 rounded">https://[instance].app.n8n.cloud/webhook/[path]</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rate Limiting Strategies */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Rate Limiting and DDoS Protection</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Rate Limiting Types</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Requests per minute/hour</li>
                            <li>• Concurrent connections</li>
                            <li>• Payload size limits</li>
                            <li>• IP-based throttling</li>
                            <li>• User-agent filtering</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Protection Methods</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• CloudFlare proxy protection</li>
                            <li>• Web Application Firewall (WAF)</li>
                            <li>• Geographic IP blocking</li>
                            <li>• Request pattern analysis</li>
                            <li>• Automated blacklisting</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Implementation in n8n:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use Switch node for rate limiting logic</li>
                          <li>• Store request counts in database or memory</li>
                          <li>• Implement exponential backoff responses</li>
                          <li>• Log suspicious activity patterns</li>
                          <li>• Set up alerting for abuse attempts</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Security Vulnerability Prevention */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Common Security Vulnerabilities</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>⚠️ Vulnerabilities</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Replay attacks</li>
                            <li>• Man-in-the-middle attacks</li>
                            <li>• Injection attacks</li>
                            <li>• Cross-site scripting (XSS)</li>
                            <li>• Data exposure in logs</li>
                            <li>• Timing attacks</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>🛡️ Prevention</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Timestamp validation</li>
                            <li>• HTTPS enforcement</li>
                            <li>• Input sanitization</li>
                            <li>• Content Security Policy</li>
                            <li>• Secure logging practices</li>
                            <li>• Constant-time comparisons</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Security Checklist:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>□ Implement signature verification for all webhooks</li>
                          <li>□ Use HTTPS endpoints with valid certificates</li>
                          <li>□ Set up rate limiting and DDoS protection</li>
                          <li>□ Validate and sanitize all incoming data</li>
                          <li>□ Implement proper error handling without data leakage</li>
                          <li>□ Monitor and log security events</li>
                          <li>□ Regular security audits and penetration testing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-3',
              title: 'Create Webhook Endpoint',
              description: 'Set up your first webhook receiver',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Create Webhook Endpoint</h2>
                  
                  {/* n8n Webhook Node Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>n8n Webhook Node Setup</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Follow this step-by-step guide to create your first webhook endpoint in n8n.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Step 1: Add Webhook Node</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Create new workflow in n8n</li>
                            <li>2. Search for "Webhook" in node panel</li>
                            <li>3. Drag Webhook node to canvas</li>
                            <li>4. Configure HTTP method (GET/POST)</li>
                          </ol>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Step 2: Configure Path</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Set webhook path (e.g., "/github")</li>
                            <li>2. Choose authentication method</li>
                            <li>3. Configure response options</li>
                            <li>4. Save and activate workflow</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Endpoint URL Management */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Endpoint URL Management</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>URL Structure</h4>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                            <p><strong>Production:</strong></p>
                            <code className="bg-gray-600 px-2 py-1 rounded block">
                              https://[instance].app.n8n.cloud/webhook/[path]
                            </code>
                            <p><strong>Test:</strong></p>
                            <code className="bg-gray-600 px-2 py-1 rounded block">
                              https://[instance].app.n8n.cloud/webhook-test/[path]
                            </code>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Best Practices</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use descriptive path names</li>
                            <li>• Include version in path (/v1/github)</li>
                            <li>• Keep URLs secret when possible</li>
                            <li>• Use different paths per service</li>
                            <li>• Document all endpoint URLs</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payload Structure Design */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Payload Structure Design</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Design your webhook payload structure to handle different types of incoming data efficiently.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Common Payload Types</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>JSON:</strong> Most common, easy to parse</li>
                            <li>• <strong>Form Data:</strong> HTML form submissions</li>
                            <li>• <strong>XML:</strong> Legacy systems, SOAP APIs</li>
                            <li>• <strong>Plain Text:</strong> Simple notifications</li>
                            <li>• <strong>Binary:</strong> File uploads, images</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Validation</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Validate required fields</li>
                            <li>• Check data types and formats</li>
                            <li>• Sanitize input data</li>
                            <li>• Handle missing or null values</li>
                            <li>• Implement schema validation</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Example JSON Payload:</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`{
  "event": "order.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "order_id": "ORD-123456",
    "customer": {
      "id": "CUST-789",
      "email": "customer@example.com"
    },
    "total": 99.99,
    "currency": "USD"
  },
  "metadata": {
    "source": "web",
    "version": "1.0"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Testing with ngrok */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Local Testing with ngrok</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Test webhooks locally before deploying to production using ngrok to create secure tunnels.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Setup Steps</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>1. Install ngrok: <code className="bg-gray-600 px-1 rounded">npm install -g ngrok</code></li>
                            <li>2. Start local n8n instance</li>
                            <li>3. Run: <code className="bg-gray-600 px-1 rounded">ngrok http 5678</code></li>
                            <li>4. Copy public URL from ngrok</li>
                            <li>5. Use URL in webhook configurations</li>
                          </ol>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Test webhooks without deployment</li>
                            <li>• Debug issues in real-time</li>
                            <li>• Secure HTTPS tunneling</li>
                            <li>• Inspect request details</li>
                            <li>• Iterate quickly during development</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Endpoint Documentation Templates */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Endpoint Documentation</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Document your webhook endpoints for team collaboration and external integrations.
                      </p>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Documentation Template:</h4>
                        <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                          <p><strong>Endpoint:</strong> <code className="bg-gray-600 px-1 rounded">POST /webhook/orders</code></p>
                          <p><strong>Purpose:</strong> Receives order creation notifications</p>
                          <p><strong>Authentication:</strong> HMAC-SHA256 signature required</p>
                          <p><strong>Headers:</strong></p>
                          <ul className="ml-4 space-y-1">
                            <li>• <code className="bg-gray-600 px-1 rounded">Content-Type: application/json</code></li>
                            <li>• <code className="bg-gray-600 px-1 rounded">X-Signature: sha256=...</code></li>
                          </ul>
                          <p><strong>Expected Payload:</strong> JSON with order details</p>
                          <p><strong>Response:</strong> 200 OK with confirmation message</p>
                          <p><strong>Error Handling:</strong> Returns 400 for invalid data</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Documentation Tools</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Swagger/OpenAPI specs</li>
                            <li>• Postman collections</li>
                            <li>• README files</li>
                            <li>• Wiki pages</li>
                            <li>• API documentation generators</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>What to Include</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Endpoint URLs and methods</li>
                            <li>• Authentication requirements</li>
                            <li>• Payload examples</li>
                            <li>• Response formats</li>
                            <li>• Error codes and messages</li>
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
          id: 'setup',
          title: '⚙️ Setup',
            description: 'Configure and test webhook endpoints',
          steps: [
            {
              id: 'webhook-step-4',
              title: 'Test Webhooks',
              description: 'Test and debug webhook implementations',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {/* Introduction */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🧪 Webhook Testing & Debugging</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Thorough testing is essential for reliable webhook implementations. Learn how to test webhooks locally, 
                      debug common issues, and validate your webhook endpoints before deploying to production.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🔧</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Local Testing</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Test webhooks on your local machine
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🔍</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Payload Inspection</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Analyze incoming webhook data
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🐛</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Debug Issues</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Identify and fix common problems
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">✅</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Validation</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Verify webhook functionality
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testing Tools */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🛠️ Webhook Testing Tools</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Online Testing Tools</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Webhook.site</div>
                                <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Instantly receive webhooks</div>
                              </div>
                              <a href="https://webhook.site" target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-600 text-sm`}>Visit</a>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>RequestBin</div>
                                <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Collect HTTP requests</div>
                              </div>
                              <a href="https://requestbin.com" target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-600 text-sm`}>Visit</a>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>ngrok</div>
                                <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Secure tunnels to localhost</div>
                              </div>
                              <a href="https://ngrok.com" target="_blank" rel="noopener noreferrer" className={`text-blue-500 hover:text-blue-600 text-sm`}>Visit</a>
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💻 Local Testing Tools</h4>
                          <div className="space-y-3">
                            <div>
                              <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>curl</div>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Command-line HTTP client</div>
                            </div>
                            <div>
                              <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Postman</div>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>API development environment</div>
                            </div>
                            <div>
                              <div className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Insomnia</div>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>REST API client</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testing Workflow */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🔄 Step-by-Step Testing Workflow</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1️⃣ Setup Test Environment</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Start local n8n instance</li>
                            <li>• Install ngrok: <code className="bg-gray-600 px-1 rounded">npm i -g ngrok</code></li>
                            <li>• Run: <code className="bg-gray-600 px-1 rounded">ngrok http 5678</code></li>
                            <li>• Copy the public HTTPS URL</li>
                          </ol>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2️⃣ Configure Webhook</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Create new n8n workflow</li>
                            <li>• Add Webhook node</li>
                            <li>• Set path (e.g., "/test")</li>
                            <li>• Use ngrok URL + path</li>
                          </ol>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3️⃣ Send Test Requests</h4>
                          <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use curl or Postman</li>
                            <li>• Send POST with JSON data</li>
                            <li>• Check n8n execution log</li>
                            <li>• Verify data processing</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Examples */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>📋 Practical Test Examples</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Basic curl Test</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                            <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`curl -X POST \\
  https://abc123.ngrok.io/webhook/test \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "test",
    "timestamp": "2024-01-15T10:30:00Z",
    "data": {
      "message": "Hello n8n!"
    }
  }'`}
                            </pre>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🧪 Advanced Test Script</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                            <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`#!/bin/bash
# webhook-test.sh

WEBHOOK_URL="https://abc123.ngrok.io/webhook/test"

# Test 1: Valid payload
echo "Testing valid payload..."
curl -X POST $WEBHOOK_URL \\
  -H "Content-Type: application/json" \\
  -d '{"event":"order.created","id":"123"}'

# Test 2: Invalid payload
echo "Testing invalid payload..."
curl -X POST $WEBHOOK_URL \\
  -H "Content-Type: application/json" \\
  -d '{"invalid": true}'

# Test 3: Missing headers
echo "Testing missing headers..."
curl -X POST $WEBHOOK_URL \\
  -d '{"event":"test"}'`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Debugging Common Issues */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🐛 Common Issues & Solutions</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>❌ Connection Issues</h4>
                          <div className="space-y-2">
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Problem:</strong> "Connection refused" or timeout
                            </div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Solutions:</strong>
                              <ul className="ml-4 mt-1">
                                <li>• Check if n8n is running</li>
                                <li>• Verify ngrok tunnel is active</li>
                                <li>• Test URL in browser first</li>
                                <li>• Check firewall settings</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚠️ Authentication Errors</h4>
                          <div className="space-y-2">
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Problem:</strong> 401 Unauthorized or 403 Forbidden
                            </div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Solutions:</strong>
                              <ul className="ml-4 mt-1">
                                <li>• Verify authentication method</li>
                                <li>• Check API keys/signatures</li>
                                <li>• Validate header format</li>
                                <li>• Test without auth first</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📝 Payload Issues</h4>
                          <div className="space-y-2">
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Problem:</strong> Data not parsing correctly
                            </div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Solutions:</strong>
                              <ul className="ml-4 mt-1">
                                <li>• Validate JSON syntax</li>
                                <li>• Check Content-Type header</li>
                                <li>• Inspect raw payload data</li>
                                <li>• Test with simple payload</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Workflow Errors</h4>
                          <div className="space-y-2">
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Problem:</strong> Workflow not executing
                            </div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>Solutions:</strong>
                              <ul className="ml-4 mt-1">
                                <li>• Check workflow is active</li>
                                <li>• Review execution logs</li>
                                <li>• Test individual nodes</li>
                                <li>• Verify node connections</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testing Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>✅ Pre-Production Testing Checklist</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Functional Tests</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>☐ Webhook receives data correctly</li>
                            <li>☐ Payload parsing works as expected</li>
                            <li>☐ Authentication validates properly</li>
                            <li>☐ Workflow executes completely</li>
                            <li>☐ Response returns correctly</li>
                            <li>☐ Error handling works</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Performance Tests</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>☐ Response time under 5 seconds</li>
                            <li>☐ Handle multiple concurrent requests</li>
                            <li>☐ Large payload processing</li>
                            <li>☐ Memory usage acceptable</li>
                            <li>☐ No memory leaks detected</li>
                            <li>☐ Retry logic functions properly</li>
                          </ul>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Testing Best Practices:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Test with realistic data volumes and formats</li>
                          <li>• Simulate network failures and timeouts</li>
                          <li>• Test edge cases and malformed data</li>
                          <li>• Verify logging and monitoring work correctly</li>
                          <li>• Document test cases and expected outcomes</li>
                          <li>• Automate repetitive tests where possible</li>
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
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {/* Introduction */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔄 Webhook Retry Logic Implementation</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Webhook delivery failures are inevitable in distributed systems. Network issues, server downtime, or temporary service outages can cause webhooks to fail. 
                      Implementing robust retry logic ensures your webhooks are eventually delivered, maintaining data consistency and system reliability.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Detect Failures</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Identify when webhooks fail to deliver
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Apply Strategy</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Use exponential backoff or linear retry
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Dead Letter Queue</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Handle permanently failed webhooks
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Retry Strategies */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>📋 Retry Strategies</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Linear Backoff</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Fixed delay between retries. Simple but can overwhelm recovering services.
                          </p>
                          <div className="space-y-2">
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'}`}>Retry Schedule:</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              • 1st retry: 30 seconds<br/>
                              • 2nd retry: 30 seconds<br/>
                              • 3rd retry: 30 seconds<br/>
                              • 4th retry: 30 seconds
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Exponential Backoff</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Increasing delay between retries. Gives services time to recover.
                          </p>
                          <div className="space-y-2">
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'}`}>Retry Schedule:</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              • 1st retry: 30 seconds<br/>
                              • 2nd retry: 60 seconds<br/>
                              • 3rd retry: 120 seconds<br/>
                              • 4th retry: 240 seconds
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* n8n Implementation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>⚙️ n8n Retry Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Built-in Retry Settings</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Configure retry behavior in n8n workflow settings:
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                            <div className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {`// Workflow Settings → Error Handling
{
  "retryOnFail": {
    "enabled": true,
    "maxTries": 3,
    "waitBetweenTries": 1000
  }
}`}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded`}>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Max Tries</div>
                              <div className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>3 attempts</div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded`}>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Wait Time</div>
                              <div className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>1000ms</div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded`}>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Time</div>
                              <div className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>~3 seconds</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Custom Retry Logic with Code</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Implement advanced retry logic using JavaScript functions:
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                          <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Custom retry function with exponential backoff
async function retryWebhook(url, payload, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        return { success: true, attempt };
      }
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(\`Client error: \${response.status}\`);
      }
      
      throw new Error(\`Server error: \${response.status}\`);
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error; // Final attempt failed
      }
      
      // Exponential backoff: 2^attempt * 1000ms
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dead Letter Queue */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>💀 Dead Letter Queue Implementation</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        When webhooks fail permanently (after all retries), store them in a dead letter queue for manual review and reprocessing.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Database Storage</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                            <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`CREATE TABLE failed_webhooks (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'failed'
);`}
                            </pre>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Reprocessing Logic</h4>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                            <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Reprocess failed webhooks
async function reprocessFailedWebhooks() {
  const failed = await db.query(
    'SELECT * FROM failed_webhooks WHERE status = $1',
    ['failed']
  );
  
  for (const webhook of failed.rows) {
    try {
      await retryWebhook(webhook.url, webhook.payload);
      await db.query(
        'UPDATE failed_webhooks SET status = $1 WHERE id = $2',
        ['resolved', webhook.id]
      );
    } catch (error) {
      console.log(\`Still failing: \${webhook.id}\`);
    }
  }
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>💡 Retry Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Do This</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use exponential backoff for server errors</li>
                          <li>• Don't retry client errors (4xx)</li>
                          <li>• Set reasonable maximum retry limits</li>
                          <li>• Log all retry attempts for debugging</li>
                          <li>• Implement jitter to avoid thundering herd</li>
                          <li>• Use dead letter queues for failed webhooks</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Avoid This</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Infinite retry loops</li>
                          <li>• Retrying too frequently</li>
                          <li>• Ignoring HTTP status codes</li>
                          <li>• Not logging retry attempts</li>
                          <li>• Retrying on authentication errors</li>
                          <li>• Overwhelming downstream services</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Retry Success */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>📊 Monitoring Retry Success</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>95%</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Success Rate</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>2.3</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Avg Attempts</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>45s</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Avg Delay</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>12</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>DLQ Items</div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Key Metrics to Track:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Overall webhook success rate (target: &gt;95%)</li>
                          <li>• Average number of retry attempts per webhook</li>
                          <li>• Time to successful delivery (including retries)</li>
                          <li>• Dead letter queue size and growth rate</li>
                          <li>• Retry success rate by attempt number</li>
                          <li>• Common failure reasons and patterns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-6',
              title: 'Rate Limiting',
              description: 'Handle rate limits and throttling',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {/* Introduction */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🚦 Webhook Rate Limiting & Throttling</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Rate limiting prevents your webhooks from overwhelming external services and ensures fair resource usage. 
                      It's essential for maintaining system stability, respecting API limits, and providing consistent performance under high load.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Identify Limits</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Understand API rate limits
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Implement Throttling</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Control request frequency
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Queue Management</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Handle overflow gracefully
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">4</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Monitor Performance</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Track usage and adjust limits
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rate Limiting Strategies */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 Rate Limiting Strategies</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🪣 Token Bucket</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Allows bursts of traffic up to bucket capacity, then enforces steady rate.
                          </p>
                          <div className="space-y-2">
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'}`}>Configuration:</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              • Bucket size: 100 tokens<br/>
                              • Refill rate: 10 tokens/second<br/>
                              • Burst capacity: 100 requests<br/>
                              • Sustained rate: 10 req/sec
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌊 Sliding Window</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Tracks requests in a rolling time window for smooth rate enforcement.
                          </p>
                          <div className="space-y-2">
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'}`}>Configuration:</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              • Window size: 60 seconds<br/>
                              • Max requests: 600<br/>
                              • Average rate: 10 req/sec<br/>
                              • Smooth distribution
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⏱️ Fixed Window</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Simple counter that resets at fixed intervals. Easy to implement but allows traffic spikes.
                          </p>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            • Window: 1 minute<br/>
                            • Max: 600 requests<br/>
                            • Reset: Every minute
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎚️ Adaptive Rate Limiting</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Dynamically adjusts limits based on system load and response times.
                          </p>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            • Base rate: 10 req/sec<br/>
                            • Max rate: 50 req/sec<br/>
                            • Adjusts based on latency
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* n8n Implementation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>⚙️ n8n Rate Limiting Implementation</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Built-in Rate Limiting</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Configure rate limits in HTTP Request nodes:
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                            <div className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                              {`// HTTP Request Node Settings
{
  "options": {
    "batching": {
      "batch": {
        "batchSize": 10,
        "batchInterval": 1000
      }
    }
  }
}`}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded`}>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Batch Size</div>
                              <div className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>10 requests</div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded`}>
                              <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Interval</div>
                              <div className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>1000ms</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Custom Rate Limiter with Code</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Implement sophisticated rate limiting using JavaScript:
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                          <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// Token bucket rate limiter
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }
  
  consume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
  
  refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

// Usage in n8n workflow
const rateLimiter = new TokenBucket(100, 10); // 100 capacity, 10/sec refill

if (rateLimiter.consume()) {
  // Proceed with webhook
  return items;
} else {
  // Rate limit exceeded, queue for later
  throw new Error('Rate limit exceeded');
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Monitoring */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>📊 Performance Monitoring</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>847</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Requests/min</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>234ms</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Avg Response</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>23</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Queue Size</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} mb-1`}>98.7%</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Success Rate</div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-4 rounded-lg`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Key Performance Indicators:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Requests per minute/hour (throughput)</li>
                          <li>• Average response time and percentiles (P95, P99)</li>
                          <li>• Queue size and processing time</li>
                          <li>• Rate limit hit frequency and duration</li>
                          <li>• Error rates by endpoint and error type</li>
                          <li>• Resource utilization (CPU, memory, network)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-7',
              title: 'Monitoring & Logs',
              description: 'Monitor webhook performance and debug issues',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {/* Introduction */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📊 Webhook Monitoring & Logging</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Effective monitoring and logging are crucial for maintaining reliable webhook systems. They provide visibility into webhook performance, 
                      help identify issues quickly, and enable proactive optimization of your automation workflows.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">📈</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Metrics</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Track response times and throughput
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🔍</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Tracking</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Monitor failures and debug issues
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">🚨</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Alerts & Notifications</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Get notified of critical issues
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">📋</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Audit Trails</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Maintain comprehensive logs
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Logging Strategies */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📝 Logging Best Practices</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Structured Logging</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Use consistent, searchable log formats with structured data (JSON).
                          </p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-xs`}>
                            <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "webhook_id": "wh_abc123",
  "event": "webhook_received",
  "source": "github.com",
  "payload_size": 1024,
  "processing_time_ms": 150,
  "status": "success"
}`}
                            </pre>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Log Levels</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Use appropriate log levels for different types of events.
                          </p>
                          <div className="space-y-2">
                            <div className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>ERROR: Failed webhook delivery</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`}>WARN: Retry attempt #3</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`}>INFO: Webhook processed successfully</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>DEBUG: Payload validation details</div>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Essential Log Data Points</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className={`font-medium ${theme === 'gradient' ? 'text-gray-200' : 'text-gray-800 dark:text-gray-200'} mb-2`}>Request Data:</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Unique request ID</li>
                              <li>• Source IP and user agent</li>
                              <li>• HTTP method and headers</li>
                              <li>• Payload size and content type</li>
                              <li>• Authentication details</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className={`font-medium ${theme === 'gradient' ? 'text-gray-200' : 'text-gray-800 dark:text-gray-200'} mb-2`}>Processing Data:</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Processing start/end times</li>
                              <li>• Workflow execution path</li>
                              <li>• Database operations performed</li>
                              <li>• External API calls made</li>
                              <li>• Response status and data</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* n8n Monitoring Setup */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>⚙️ n8n Monitoring Implementation</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Built-in Execution Logging</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Enable detailed execution logging in n8n settings:
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                          <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// n8n Environment Variables
N8N_LOG_LEVEL=debug
N8N_LOG_OUTPUT=console,file
N8N_LOG_FILE_LOCATION=/var/log/n8n/
N8N_METRICS_ENABLE=true
N8N_DIAGNOSTICS_ENABLED=true`}
                          </pre>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Custom Logging in Workflows</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Add comprehensive logging to your webhook workflows:
                        </p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded font-mono text-sm`}>
                          <pre className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
{`// JavaScript Function Node - Enhanced Logging
const logData = {
  timestamp: new Date().toISOString(),
  webhook_id: $node["Webhook"].json.headers['x-webhook-id'],
  event_type: $json.action || 'unknown',
  source: $json.repository?.full_name || 'unknown',
  payload_size: JSON.stringify($json).length,
  processing_start: Date.now()
};

// Log webhook receipt
console.log('WEBHOOK_RECEIVED', JSON.stringify(logData));

// Process webhook data here...
const processedData = processWebhookData($json);

// Log processing completion
console.log('WEBHOOK_PROCESSED', JSON.stringify({
  ...logData,
  processing_time_ms: Date.now() - logData.processing_start,
  records_processed: processedData.length,
  status: 'success'
}));

return processedData;`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Dashboard */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>📊 Monitoring Dashboard</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-1`}>1,247</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Webhooks Today</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-1`}>98.2%</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Success Rate</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'} mb-1`}>156ms</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Avg Response</div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-1`}>3</div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Active Alerts</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Recent Webhook Activity</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>GitHub Push</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`}>✓ 2s ago</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Stripe Payment</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`}>✓ 15s ago</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Discord Message</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>✗ 1m ago</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Shopify Order</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`}>✓ 3m ago</span>
                            </div>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Error Summary</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Timeout Errors</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>12 today</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Auth Failures</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>3 today</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Rate Limits</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`}>7 today</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Payload Issues</span>
                              <span className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>2 today</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alerting & Notifications */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🚨 Alerting & Notifications</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔴 Critical Alerts</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Webhook endpoint down</li>
                            <li>• Success rate &lt; 90%</li>
                            <li>• Response time &gt; 5s</li>
                            <li>• Dead letter queue full</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🟡 Warning Alerts</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Success rate &lt; 95%</li>
                            <li>• Response time &gt; 2s</li>
                            <li>• High retry rate</li>
                            <li>• Queue size growing</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔵 Info Alerts</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Traffic spike detected</li>
                            <li>• New webhook source</li>
                            <li>• Deployment completed</li>
                            <li>• Maintenance scheduled</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Notification Channels</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded text-center`}>
                            <div className={`text-2xl mb-2`}>📧</div>
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Email</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Critical & Warnings</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded text-center`}>
                            <div className={`text-2xl mb-2`}>💬</div>
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Slack</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>All alerts</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded text-center`}>
                            <div className={`text-2xl mb-2`}>📱</div>
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SMS</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Critical only</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700/50'} p-3 rounded text-center`}>
                            <div className={`text-2xl mb-2`}>🔔</div>
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>PagerDuty</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Critical escalation</div>
                          </div>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>What is Supabase?</h2>
                  
                  {/* What is Supabase */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>What is Supabase? (Think of it as your app's brain!)</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Supabase is like having a super-smart assistant for your app that handles all the "behind-the-scenes" work. Instead of building everything from scratch, Supabase gives you a ready-made database, user accounts, and real-time features - all in one place!
                    </p>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-100 dark:bg-blue-800/30'} p-4 rounded-lg mb-4`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-700 dark:text-blue-300'} mb-2`}>🔍 Simple Analogy</h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Think of Supabase like a Swiss Army knife for building apps. Instead of buying separate tools (database, authentication, storage), you get everything in one package that works together perfectly.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Core Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• PostgreSQL database</li>
                          <li>• Real-time subscriptions</li>
                          <li>• Authentication & authorization</li>
                          <li>• Auto-generated APIs</li>
                          <li>• File storage</li>
                          <li>• Edge functions</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Why Choose Supabase</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Open source & transparent</li>
                          <li>• SQL-based (PostgreSQL)</li>
                          <li>• Built-in real-time features</li>
                          <li>• Generous free tier</li>
                          <li>• Easy to migrate</li>
                          <li>• No vendor lock-in</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Supabase vs Competitors */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Supabase vs Competitors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>vs Firebase</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ SQL database (vs NoSQL)</li>
                          <li>✅ Open source</li>
                          <li>✅ More predictable pricing</li>
                          <li>✅ Better for complex queries</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>vs PlanetScale</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ More features included</li>
                          <li>✅ Real-time subscriptions</li>
                          <li>✅ Built-in authentication</li>
                          <li>✅ File storage included</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>vs Neon</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>✅ Full BaaS platform</li>
                          <li>✅ Authentication included</li>
                          <li>✅ Real-time features</li>
                          <li>✅ Dashboard & tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Pricing Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Free</h4>
                        <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>$0</div>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Up to 500MB database</li>
                          <li>• 2 projects</li>
                          <li>• 50,000 monthly users</li>
                          <li>• 1GB file storage</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50 border-blue-500' : 'bg-white dark:bg-gray-800 border-blue-500'} p-4 rounded-lg border-2 text-center relative`}>
                        <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white text-xs px-3 py-1 rounded-full`}>
                          Most Popular
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Pro</h4>
                        <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-2`}>$25/mo</div>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 8GB database</li>
                          <li>• Unlimited projects</li>
                          <li>• 100,000 monthly users</li>
                          <li>• 100GB file storage</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Team</h4>
                        <div className={`text-2xl font-bold ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'} mb-2`}>$599/mo</div>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 500GB database</li>
                          <li>• Advanced features</li>
                          <li>• Priority support</li>
                          <li>• SOC2 compliance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-2',
              title: 'Database Setup',
              description: 'Create and configure your first database',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Database Setup & Project Creation</h2>
                  
                  {/* Project Creation Steps */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 Create Your First Supabase Project (5 minutes)</h3>
                    <div className={`${theme === 'gradient' ? 'bg-yellow-600/20' : 'bg-yellow-100 dark:bg-yellow-900/30'} p-3 rounded-lg mb-4`}>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-200'} font-medium`}>
                        💡 Don't worry! This is completely free to start, and you won't need a credit card.
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm`}>1</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Visit Supabase & Create Account</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            1. Open <a href="https://app.supabase.com" className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">app.supabase.com</a> in a new tab<br/>
                            2. Click "Sign Up" (you can use GitHub, Google, or email)<br/>
                            3. Verify your email if prompted
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'} p-2 rounded italic`}>
                            💡 Tip: Using GitHub login is fastest and most secure!
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm`}>2</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Create Your Organization</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            1. You'll see "Create a new organization" screen<br/>
                            2. Enter any name (like "My First Project" or your company name)<br/>
                            3. Choose "Free Plan" - perfect for learning and small projects<br/>
                            4. Click "Create organization"
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'} p-2 rounded italic`}>
                            💡 You can always upgrade later when you need more features
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm`}>3</div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>Launch Your Database Project</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                            1. Click "New Project" button<br/>
                            2. <strong>Project Name:</strong> Something descriptive like "n8n-automation-db"<br/>
                            3. <strong>Database Password:</strong> Choose a strong password (save this!)<br/>
                            4. <strong>Region:</strong> Pick the one closest to you (faster speed)<br/>
                            5. Click "Create new project"
                          </p>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-red-600/20 text-red-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'} p-2 rounded`}>
                            ⚠️ Important: Save your database password somewhere safe! You'll need it later.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-3 rounded-lg mt-4`}>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-200'} font-medium`}>
                        🎉 Great! Your project will take 1-2 minutes to set up. You'll see a progress screen while it's being created.
                      </p>
                    </div>
                  </div>

                  {/* SQL Editor Introduction */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📝 Create Your First Table (Don't worry, we'll walk you through it!)</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-600/20' : 'bg-blue-100 dark:bg-blue-900/30'} p-3 rounded-lg mb-4`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-200'} font-medium`}>
                          🤔 What's a table? Think of it like a super-organized Excel spreadsheet that will store all your automation data!
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Step-by-Step: Using the SQL Editor</h4>
                        <ol className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-2`}>
                          <li><strong>1.</strong> In your Supabase dashboard, look for "SQL Editor" in the left sidebar and click it</li>
                          <li><strong>2.</strong> You'll see a big text box where you can type commands</li>
                          <li><strong>3.</strong> Copy the code below and paste it into that text box</li>
                          <li><strong>4.</strong> Click the "RUN" button (it's usually big and blue/green)</li>
                          <li><strong>5.</strong> You should see "Success. No rows returned" - that means it worked! 🎉</li>
                        </ol>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✂️ Copy This Code (with explanation):</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700/30'} p-3 rounded mb-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>What this does:</strong> Creates a table called "workflows" to store your n8n automation data. Each row will be one workflow with info like name, status, and settings.
                          </p>
                        </div>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- 🏗️ Create our main table to store workflow information
CREATE TABLE workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,        -- Unique ID for each workflow
  name TEXT NOT NULL,                                  -- Name of the workflow (required)
  description TEXT,                                    -- Optional description
  status TEXT DEFAULT 'inactive'                       -- Is it running? (active/inactive/error)
    CHECK (status IN ('active', 'inactive', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),   -- When was it created?
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),   -- When was it last changed?
  config JSONB DEFAULT '{}'::jsonb                     -- Settings and configuration
);

-- 🔒 Add security (only you can see your workflows)
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- ⚡ Make searches super fast with indexes
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_created_at ON workflows(created_at DESC);`}
                        </pre>
                        <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-3 rounded mt-3`}>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-200'}`}>
                            💡 Don't understand all the code? That's totally fine! The important part is that you now have a place to store your automation data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Details */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Get Connection Details</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        In your Supabase dashboard, go to Settings → API to find:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API URL</h4>
                          <code className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-2 rounded block`}>
                            https://your-project.supabase.co
                          </code>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Service Role Key</h4>
                          <code className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-2 rounded block`}>
                            eyJhbGci...
                          </code>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🗃️ Master CRUD Operations (The 4 Things You Do With Data)</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-600/20' : 'bg-blue-100 dark:bg-blue-900/30'} p-4 rounded-lg mb-6`}>
                    <h4 className={`font-medium ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🤔 What is CRUD?</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      CRUD stands for the 4 basic things you can do with any data: <strong>C</strong>reate (add new), <strong>R</strong>ead (get existing), <strong>U</strong>pdate (change existing), <strong>D</strong>elete (remove). It's like managing files on your computer!
                    </p>
                  </div>
                  
                  {/* CRUD Basics */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>The 4 CRUD Operations (with real examples!)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📝 Create (POST) - Add New Stuff</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>Like adding a new contact to your phone - you're creating a brand new workflow record!</p>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`POST /rest/v1/workflows
{
  "name": "Email Automation",
  "status": "active",
  "config": {"trigger": "signup"}
}`}
                        </pre>
                      </div>
                                              <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>👀 Read (GET) - Look Up Existing</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>Like searching your contacts to find someone - you're looking for workflows that already exist!</p>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`GET /rest/v1/workflows?status=eq.active
&select=*&order=created_at.desc
&limit=10`}
                        </pre>
                      </div>
                                              <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✏️ Update (PATCH) - Edit Existing</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>Like editing a contact's phone number - you're changing something that's already there!</p>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`PATCH /rest/v1/workflows?id=eq.123
{
  "status": "inactive",
  "updated_at": "now()"
}`}
                        </pre>
                      </div>
                                              <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🗑️ Delete (DELETE) - Remove Forever</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>Like deleting a contact from your phone - it's gone forever (so be careful!)</p>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`DELETE /rest/v1/workflows
?id=eq.123`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* n8n Integration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>n8n Supabase Node Configuration</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Configure the Supabase node in n8n for database operations:
                      </p>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Connection Setup</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Host:</span>
                            <code className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 px-2 py-1 rounded`}>your-project.supabase.co</code>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Service Role Key:</span>
                            <code className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 px-2 py-1 rounded`}>eyJhbGci...</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Query Examples */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Advanced Query Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Filtering & Sorting</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// Get active workflows created in last 24 hours
GET /rest/v1/workflows?
  status=eq.active&
  created_at=gte.2024-01-01T00:00:00Z&
  select=id,name,status,created_at&
  order=created_at.desc&
  limit=20`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>JSON Queries</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// Query JSONB config field
GET /rest/v1/workflows?
  config->>trigger=eq.signup&
  config->>priority=eq.high`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-4',
              title: 'Real-time Features',
              description: 'Implement real-time subscriptions',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Real-time Subscriptions</h2>
                  
                  {/* Real-time Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Real-time Database Changes</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Set up real-time listeners for database changes in your n8n workflows.
                    </p>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Enable Real-time</h4>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Enable real-time for your table
ALTER PUBLICATION supabase_realtime ADD TABLE workflows;

-- In n8n, use Webhook to listen for changes
// Subscribe to all changes
supabase
  .channel('workflow-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'workflows' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()`}
                      </pre>
                    </div>
                  </div>

                  {/* Webhook Integration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>n8n Webhook Integration</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Use Database Webhooks to trigger n8n workflows on data changes:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Create n8n Webhook</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Add Webhook Trigger node</li>
                            <li>• Copy webhook URL</li>
                            <li>• Set HTTP method to POST</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Configure Supabase</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Go to Database → Webhooks</li>
                            <li>• Add new webhook</li>
                            <li>• Enter n8n webhook URL</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Events */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Event Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">+</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>INSERT</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Triggered when new records are added
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">~</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>UPDATE</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Triggered when records are modified
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className={`w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold">-</span>
                        </div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>DELETE</h4>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Triggered when records are deleted
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Row Level Security (RLS)</h2>
                  
                  {/* RLS Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Fine-grained Access Control</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Implement database-level security that restricts which rows users can access, modify, or delete.
                    </p>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Enable RLS</h4>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Enable RLS on table
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Without policies, no rows are accessible!
-- You must create policies to allow access`}
                      </pre>
                    </div>
                  </div>

                  {/* Policy Examples */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>RLS Policy Examples</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>User-specific Access</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Users can only see their own workflows
CREATE POLICY "Users can view own workflows" ON workflows
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own workflows
CREATE POLICY "Users can insert own workflows" ON workflows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own workflows
CREATE POLICY "Users can update own workflows" ON workflows
  FOR UPDATE USING (auth.uid() = user_id);`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Role-based Access</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Admins can see all workflows
CREATE POLICY "Admins can view all workflows" ON workflows
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Team members can see team workflows
CREATE POLICY "Team access to workflows" ON workflows
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM user_teams 
      WHERE user_id = auth.uid()
    )
  );`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* RLS Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>RLS Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Do's</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Test policies thoroughly</li>
                          <li>• Use indexes on RLS columns</li>
                          <li>• Keep policies simple</li>
                          <li>• Document policy logic</li>
                          <li>• Use auth.uid() for user context</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>❌ Don'ts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Don't bypass RLS in triggers</li>
                          <li>• Avoid complex subqueries</li>
                          <li>• Don't forget UPDATE policies</li>
                          <li>• Avoid security through obscurity</li>
                          <li>• Don't disable RLS in production</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-6',
              title: 'Functions & Triggers',
              description: 'Create database functions and triggers',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Database Functions & Triggers</h2>
                  
                  {/* Functions Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Database Functions</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Create reusable database functions for complex logic and automation.
                    </p>
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Auto-update Timestamp Function</h4>
                      <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';`}
                      </pre>
                    </div>
                  </div>

                  {/* Triggers */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Database Triggers</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Auto-update Trigger</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Create trigger for auto-updating timestamps
CREATE TRIGGER update_workflows_updated_at 
  BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Validation Trigger</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Function to validate workflow config
CREATE OR REPLACE FUNCTION validate_workflow_config()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure config has required fields
  IF NOT (NEW.config ? 'trigger') THEN
    RAISE EXCEPTION 'Workflow config must include trigger field';
  END IF;
  
  -- Validate trigger type
  IF NOT (NEW.config->>'trigger' IN ('manual', 'webhook', 'schedule')) THEN
    RAISE EXCEPTION 'Invalid trigger type: %', NEW.config->>'trigger';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create validation trigger
CREATE TRIGGER validate_workflow_before_insert_update
  BEFORE INSERT OR UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION validate_workflow_config();`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Edge Functions */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Supabase Edge Functions</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Create serverless functions that run close to your users:
                      </p>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Deploy Edge Function</h4>
                        <pre className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// functions/workflow-processor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { workflow_id, action } = await req.json()
  
  // Process workflow logic here
  const result = await processWorkflow(workflow_id, action)
  
  return new Response(
    JSON.stringify({ success: true, result }),
    { headers: { "Content-Type": "application/json" } }
  )
})

// Deploy with: supabase functions deploy workflow-processor`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-7',
              title: 'Performance Optimization',
              description: 'Optimize queries and database performance',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Optimization</h2>
                  
                  {/* Indexing Strategy */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Database Indexing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Basic Indexes</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Index frequently queried columns
CREATE INDEX idx_workflows_status 
  ON workflows(status);

-- Composite index for complex queries
CREATE INDEX idx_workflows_user_created 
  ON workflows(user_id, created_at DESC);

-- Partial index for active workflows
CREATE INDEX idx_active_workflows 
  ON workflows(created_at) 
  WHERE status = 'active';`}
                        </pre>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>JSON Indexes</h4>
                        <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`-- Index JSON fields for faster queries
CREATE INDEX idx_workflows_config_trigger 
  ON workflows USING GIN ((config->>'trigger'));

-- Index specific JSON paths
CREATE INDEX idx_workflows_config_priority 
  ON workflows ((config->>'priority'))
  WHERE config ? 'priority';`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Query Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Query Optimization Tips</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Efficient API Calls</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2 font-medium`}>❌ Inefficient</p>
                            <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// Don't select all columns
GET /rest/v1/workflows

// No filtering
GET /rest/v1/workflows?limit=1000`}
                            </pre>
                          </div>
                          <div>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2 font-medium`}>✅ Efficient</p>
                            <pre className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} bg-gray-900 p-3 rounded overflow-x-auto`}>
{`// Select only needed columns
GET /rest/v1/workflows?select=id,name,status

// Use proper filtering
GET /rest/v1/workflows?status=eq.active&limit=50`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Pooling */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Connection & Caching</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Connection Pooling</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use connection pooling in n8n</li>
                          <li>• Set appropriate pool sizes</li>
                          <li>• Monitor connection usage</li>
                          <li>• Close idle connections</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Caching Strategy</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cache frequently accessed data</li>
                          <li>• Use Redis for session data</li>
                          <li>• Implement query result caching</li>
                          <li>• Set appropriate TTL values</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Performance Monitoring</h3>
                    <div className="space-y-4">
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        Monitor your database performance in Supabase dashboard:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Query Performance</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Monitor slow queries and execution times
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Resource Usage</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Track CPU, memory, and disk usage
                          </p>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Metrics</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Monitor API response times and errors
                          </p>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📅 Schedule Planning (Smart Timing is Everything!)</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-600/20' : 'bg-blue-100 dark:bg-blue-900/30'} p-4 rounded-lg mb-6`}>
                    <h4 className={`font-medium ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🤔 Why Schedule Planning Matters</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-blue-200' : 'text-blue-700 dark:text-blue-200'}`}>
                      Just like you wouldn't schedule 10 meetings at the same time, you shouldn't run all your automations simultaneously! Smart scheduling prevents server overload, ensures reliable execution, and optimizes performance.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🌍 Time Zone Considerations (Avoid the Global Headache!)</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-yellow-600/20' : 'bg-yellow-100 dark:bg-yellow-900/30'} p-3 rounded-lg mb-4`}>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-200'} font-medium`}>
                        🚨 Critical Rule: Servers usually run in UTC time! Your 9 AM might be 2 PM server time.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Best Practice: Use UTC</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Set all schedules in UTC</li>
                          <li>• Consistent across regions</li>
                          <li>• No daylight saving issues</li>
                          <li>• Easy to debug problems</li>
                        </ul>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-green-600/20 text-green-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'} p-2 rounded mt-2`}>
                          Example: 14:00 UTC = 9 AM EST
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Common Mistake: Local Time</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Jobs run at wrong times</li>
                          <li>• Breaks during time changes</li>
                          <li>• Different for each user</li>
                          <li>• Confusing to troubleshoot</li>
                        </ul>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-red-600/20 text-red-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'} p-2 rounded mt-2`}>
                          "Why did my job run at 3 AM?!"
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-cyan-600/20' : 'bg-cyan-100 dark:bg-cyan-900/30'} p-3 rounded-lg mt-4`}>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-cyan-200' : 'text-cyan-800 dark:text-cyan-200'} font-medium`}>
                        🛠️ Quick Tip: Use <a href="https://www.timeanddate.com/worldclock/converter.html" target="_blank" rel="noopener noreferrer" className="underline">World Clock Converter</a> to convert your local time to UTC!
                      </p>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>⚖️ Load Distribution (Spread the Love!)</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚫 Don't Do This (Server Meltdown!):</h4>
                        <div className={`${theme === 'gradient' ? 'bg-red-600/20' : 'bg-red-100 dark:bg-red-900/30'} p-3 rounded mb-2`}>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-red-300' : 'text-red-700 dark:text-red-300'} font-mono`}>
                            ❌ All jobs at: 0 9 * * * (9:00 AM)
                          </div>
                        </div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          This means ALL your automations will try to run at exactly 9:00 AM, potentially crashing your server!
                        </p>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Do This Instead (Smooth Operation!):</h4>
                        <div className="space-y-2">
                          <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'} font-mono mb-1`}>
                              ✅ Email reports: 5 9 * * *  (9:05 AM)
                            </div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'} font-mono mb-1`}>
                              ✅ Data backup: 15 9 * * *  (9:15 AM)
                            </div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'} font-mono mb-1`}>
                              ✅ Social posts: 30 9 * * *  (9:30 AM)
                            </div>
                          </div>
                        </div>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mt-2`}>
                          Now your jobs are spread out every 15 minutes - much better for server performance!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🎯 Ready-to-Use Schedule Templates</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💼 Business Hours</h4>
                        <div className="space-y-2">
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 9 * * 1-5</div>
                            <div className="mt-1">Morning standup emails</div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 17 * * 1-5</div>
                            <div className="mt-1">End-of-day reports</div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 12 * * 1-5</div>
                            <div className="mt-1">Lunch break reminders</div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛒 E-commerce</h4>
                        <div className="space-y-2">
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 6 * * *</div>
                            <div className="mt-1">Inventory sync</div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 10 * * *</div>
                            <div className="mt-1">Abandoned cart emails</div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 20 * * *</div>
                            <div className="mt-1">Order processing</div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📱 Social Media</h4>
                        <div className="space-y-2">
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 17 * * 2,4</div>
                            <div className="mt-1">Instagram posts (Tue/Thu)</div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 19 * * 1,3,5</div>
                            <div className="mt-1">Twitter threads (MWF)</div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">0 9 * * 6</div>
                            <div className="mt-1">Weekly LinkedIn posts</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>📋 Schedule Planning Checklist</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Before You Schedule:</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Convert all times to UTC</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Check server resource usage patterns</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Plan for peak traffic times</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Consider user time zones for notifications</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>During Setup:</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Spread jobs across different minutes</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Test with a single execution first</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Add descriptive names and notes</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Set up monitoring/alerts</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🛠️ Helpful Planning Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a
                        href="https://crontab.guru"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === 'gradient' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-4 rounded-lg block text-center transition-colors`}
                      >
                        <div className="font-semibold mb-1">⏰ Crontab Guru</div>
                        <div className="text-sm opacity-90">Test your cron expressions</div>
                      </a>
                      <a
                        href="https://www.timeanddate.com/worldclock/converter.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${theme === 'gradient' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white p-4 rounded-lg block text-center transition-colors`}
                      >
                        <div className="font-semibold mb-1">🌍 Time Zone Converter</div>
                        <div className="text-sm opacity-90">Convert times to UTC</div>
                      </a>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Your First Cron Job (Let's Build Something Amazing!)</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-4 rounded-lg mb-6`}>
                    <h4 className={`font-medium ${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-200'} mb-2`}>🎯 What We're Building</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-green-700 dark:text-green-200'}`}>
                      We'll create a "Good Morning Report" automation that sends you a daily email at 9 AM with the weather, your calendar events, and motivational quote. Perfect for starting your day informed and inspired!
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📋 Step-by-Step Tutorial</h3>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mr-3`}>1</div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Create New Workflow in n8n</h4>
                        </div>
                        <div className="ml-11">
                          <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Open your n8n dashboard</li>
                            <li>• Click "New Workflow" button</li>
                            <li>• Name it "Daily Morning Report"</li>
                            <li>• Save the workflow (Ctrl+S)</li>
                          </ul>
                          <div className={`mt-3 text-xs ${theme === 'gradient' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'} p-2 rounded`}>
                            💡 Tip: Use descriptive names so you can find workflows easily later!
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold mr-3`}>2</div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Add the Cron Trigger</h4>
                        </div>
                        <div className="ml-11">
                          <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            <li>• Delete the default "Manual Trigger" node</li>
                            <li>• Click the "+" button to add a new node</li>
                            <li>• Search for "Cron" in the trigger section</li>
                            <li>• Select "Schedule Trigger"</li>
                          </ul>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700/50'} p-3 rounded mb-3`}>
                            <h5 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Configure the Schedule:</h5>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-1`}>
                              <div><strong>Mode:</strong> Custom</div>
                              <div><strong>Expression:</strong> <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">0 9 * * *</code></div>
                              <div className="text-xs opacity-75">(This means: every day at 9:00 AM)</div>
                            </div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'} p-2 rounded`}>
                            ⚠️ Remember: n8n uses UTC time! If you want 9 AM local time, convert to UTC first.
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold mr-3`}>3</div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Get Weather Data</h4>
                        </div>
                        <div className="ml-11">
                          <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            <li>• Add new node: "HTTP Request"</li>
                            <li>• Connect it to the Cron trigger</li>
                            <li>• Configure the HTTP Request:</li>
                          </ul>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700/50'} p-3 rounded mb-3`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-1`}>
                              <div><strong>Method:</strong> GET</div>
                              <div><strong>URL:</strong> api.openweathermap.org/data/2.5/weather?q=YourCity&appid=YOUR_API_KEY&units=metric</div>
                            </div>
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-cyan-600/20 text-cyan-300' : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'} p-2 rounded`}>
                            🔑 Get a free API key from OpenWeatherMap (takes 2 minutes!)
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold mr-3`}>4</div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Send the Email</h4>
                        </div>
                        <div className="ml-11">
                          <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            <li>• Add final node: "Send Email" (Gmail/Outlook/SMTP)</li>
                            <li>• Connect it to the HTTP Request node</li>
                            <li>• Configure email settings:</li>
                          </ul>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-gray-100 dark:bg-gray-700/50'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} space-y-1`}>
                              <div><strong>To:</strong> your-email@gmail.com</div>
                              <div><strong>Subject:</strong> "Good Morning Report ☀️"</div>
                              <div><strong>Body:</strong> Include weather data and daily motivation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🧪 Testing Your Workflow</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔍 Manual Test First</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Click on the Cron trigger node</li>
                          <li>• Click "Execute Node" to test</li>
                          <li>• Check each node for green checkmarks</li>
                          <li>• Look for error messages in red</li>
                        </ul>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>▶️ Activate the Workflow</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Toggle the "Active" switch in top-right</li>
                          <li>• The workflow will now run automatically!</li>
                          <li>• Check "Executions" tab to see run history</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🚨 Troubleshooting Guide</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Common Issues</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <div><strong>API Key Error:</strong> Double-check your OpenWeatherMap API key</div>
                          <div><strong>Wrong Time:</strong> Convert your local time to UTC</div>
                          <div><strong>Email Not Sending:</strong> Check email provider settings</div>
                          <div><strong>No Data:</strong> Verify HTTP request URL is correct</div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Quick Fixes</h4>
                        <div className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <div><strong>Check Executions:</strong> View detailed error logs</div>
                          <div><strong>Test Step by Step:</strong> Execute each node individually</div>
                          <div><strong>Use Manual Trigger:</strong> Test before activating cron</div>
                          <div><strong>Check Credentials:</strong> Verify all API keys and passwords</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cron-step-4',
              title: 'Job Dependencies',
              description: 'Handle job dependencies and sequences',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔗 Job Dependencies (Building Smart Workflows!)</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-600/20' : 'bg-purple-100 dark:bg-purple-900/30'} p-4 rounded-lg mb-6`}>
                    <h4 className={`font-medium ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-800 dark:text-purple-200'} mb-2`}>🎯 What Are Job Dependencies?</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-purple-200' : 'text-purple-700 dark:text-purple-200'}`}>
                      Think of job dependencies like a recipe - you need to boil water before adding pasta, then drain before adding sauce. In automation, some tasks must happen in the right order for everything to work perfectly!
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🏗️ Sequential Workflows (One After Another)</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📊 Real Example: Daily Report Pipeline</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold`}>1</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>6:00 AM:</strong> Backup database (30 minutes)
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold`}>2</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>6:30 AM:</strong> Generate reports from backup (45 minutes)
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold`}>3</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>7:15 AM:</strong> Email reports to team (5 minutes)
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold`}>4</div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>7:20 AM:</strong> Upload to dashboard (10 minutes)
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-yellow-600/20' : 'bg-yellow-100 dark:bg-yellow-900/30'} p-3 rounded-lg`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-200'} font-medium`}>
                          💡 Key Insight: Each job waits for the previous one to finish before starting. If Step 1 fails, the whole chain stops!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔄 Conditional Workflows (Smart Decisions)</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎛️ IF-THEN Logic Examples</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'} font-medium`}>
                              ✅ IF backup succeeds → THEN generate reports
                            </div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-red-600/20' : 'bg-red-100 dark:bg-red-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-red-300' : 'text-red-700 dark:text-red-300'} font-medium`}>
                              ❌ IF backup fails → THEN send error alert instead
                            </div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-blue-600/20' : 'bg-blue-100 dark:bg-blue-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'} font-medium`}>
                              📊 IF weekend → THEN run full report, ELSE run summary
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 How to Build This in n8n</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use <strong>IF</strong> nodes to check conditions</li>
                          <li>• Use <strong>Switch</strong> nodes for multiple paths</li>
                          <li>• Use <strong>Merge</strong> nodes to combine results</li>
                          <li>• Set up <strong>error handling</strong> for failed paths</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>📡 Data Passing Between Jobs</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>✅ Good Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Store results in variables</li>
                          <li>• Use descriptive variable names</li>
                          <li>• Keep data lightweight</li>
                          <li>• Validate data before passing</li>
                        </ul>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-green-600/20 text-green-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'} p-2 rounded mt-2`}>
                          Example: userId, reportDate, fileURL
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} mb-2`}>❌ Common Mistakes</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Passing huge data objects</li>
                          <li>• Using unclear variable names</li>
                          <li>• Not checking if data exists</li>
                          <li>• Hardcoding temporary values</li>
                        </ul>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-red-600/20 text-red-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'} p-2 rounded mt-2`}>
                          "Why is my workflow so slow?"
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🗺️ Dependency Mapping Strategies</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Planning Your Dependencies</h4>
                        <div className="space-y-2">
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Step 1:</strong> List all your tasks
                          </div>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Step 2:</strong> Identify which tasks need data from others
                          </div>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Step 3:</strong> Draw the flow (Task A → Task B → Task C)
                          </div>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <strong>Step 4:</strong> Add error handling for each step
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⏱️ Timing Considerations</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className={`text-lg ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} font-bold`}>5-15 min</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Simple data tasks</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'} font-bold`}>30-60 min</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>File processing</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'} font-bold`}>1-4 hours</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Heavy computations</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🚨 Failure Handling Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔄 Retry Logic</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Retry failed API calls (3 times max)</li>
                          <li>• Use exponential backoff delays</li>
                          <li>• Log each retry attempt</li>
                          <li>• Set maximum retry limits</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🚪 Fallback Plans</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use backup data sources</li>
                          <li>• Send notifications on failure</li>
                          <li>• Skip non-critical steps</li>
                          <li>• Save partial results</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>🎯 Hands-On Example: E-commerce Order Pipeline</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛒 Complete Order Flow</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>0 2 * * *</span>
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Process pending orders</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>0 3 * * *</span>
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Update inventory levels</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>0 4 * * *</span>
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Send shipping notifications</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs ${theme === 'gradient' ? 'text-cyan-400' : 'text-cyan-600'} font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded`}>0 5 * * *</span>
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Generate daily sales report</span>
                          </div>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🛡️ Error Handling (Building Bulletproof Workflows!)</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-red-600/20' : 'bg-red-100 dark:bg-red-900/30'} p-4 rounded-lg mb-6`}>
                    <h4 className={`font-medium ${theme === 'gradient' ? 'text-red-200' : 'text-red-800 dark:text-red-200'} mb-2`}>🚨 Why Error Handling Matters</h4>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-red-200' : 'text-red-700 dark:text-red-200'}`}>
                      Think of error handling like wearing a seatbelt - you hope you'll never need it, but when something goes wrong, it saves the day! Without proper error handling, one failed API call can crash your entire automation chain.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔄 Retry Mechanisms (Never Give Up!)</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Smart Retry Strategies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-3 rounded text-center`}>
                            <div className={`text-lg ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'} font-bold`}>1st Try</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`}>Immediate</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-yellow-600/20' : 'bg-yellow-100 dark:bg-yellow-900/30'} p-3 rounded text-center`}>
                            <div className={`text-lg ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700 dark:text-yellow-300'} font-bold`}>2nd Try</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`}>Wait 5 seconds</div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-red-600/20' : 'bg-red-100 dark:bg-red-900/30'} p-3 rounded text-center`}>
                            <div className={`text-lg ${theme === 'gradient' ? 'text-red-300' : 'text-red-700 dark:text-red-300'} font-bold`}>3rd Try</div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>Wait 15 seconds</div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-yellow-600/20' : 'bg-yellow-100 dark:bg-yellow-900/30'} p-3 rounded-lg`}>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-200'} font-medium`}>
                          💡 Pro Tip: Use exponential backoff - wait longer between each retry. This prevents overwhelming servers that might be temporarily down!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🎭 Try-Catch Patterns (Graceful Failures)</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 n8n Implementation Examples</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-blue-600/20' : 'bg-blue-100 dark:bg-blue-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'} font-medium mb-1`}>
                              ✅ TRY: Send important email
                            </div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`}>
                              CATCH: Log error + send backup notification via Slack
                            </div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-purple-600/20' : 'bg-purple-100 dark:bg-purple-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700 dark:text-purple-300'} font-medium mb-1`}>
                              ✅ TRY: Process payment
                            </div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-purple-400' : 'text-purple-600'}`}>
                              CATCH: Queue for manual review + notify finance team
                            </div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-orange-600/20' : 'bg-orange-100 dark:bg-orange-900/30'} p-3 rounded`}>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-orange-300' : 'text-orange-700 dark:text-orange-300'} font-medium mb-1`}>
                              ✅ TRY: Fetch live data
                            </div>
                            <div className={`text-xs ${theme === 'gradient' ? 'text-orange-400' : 'text-orange-600'}`}>
                              CATCH: Use cached data + alert admin
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛠️ Setting Up Try-Catch in n8n</h4>
                        <ol className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li><strong>1.</strong> Add your main workflow nodes normally</li>
                          <li><strong>2.</strong> Right-click → "Add Error Trigger"</li>
                          <li><strong>3.</strong> Connect error nodes to handle failures</li>
                          <li><strong>4.</strong> Set up logging and notifications</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🔄 Fallback Strategies (Plan B, C, and D!)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'} mb-2`}>🎯 Data Fallbacks</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Primary API → Backup API</li>
                          <li>• Live data → Cached data</li>
                          <li>• Real-time → Historical average</li>
                          <li>• External → Local database</li>
                        </ul>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-green-600/20 text-green-300' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'} p-2 rounded mt-2`}>
                          Always have a backup plan!
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'} mb-2`}>📢 Notification Fallbacks</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Email → Slack → SMS</li>
                          <li>• Push notification → In-app alert</li>
                          <li>• Webhook → Direct API call</li>
                          <li>• Automated → Manual queue</li>
                        </ul>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-blue-600/20 text-blue-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'} p-2 rounded mt-2`}>
                          Make sure the message gets through!
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📊 Logging & Monitoring (Know What Went Wrong)</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 What to Log</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`}>Success Events</div>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Timestamp</li>
                              <li>• Records processed</li>
                              <li>• Execution time</li>
                              <li>• Data quality metrics</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`}>Warning Events</div>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Slow responses</li>
                              <li>• Missing data</li>
                              <li>• Rate limit warnings</li>
                              <li>• Unusual patterns</li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <div className={`text-sm font-medium ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>Error Events</div>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Error message</li>
                              <li>• Stack trace</li>
                              <li>• Input data</li>
                              <li>• Recovery actions</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎚️ Alert Severity Levels</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-green-500`}></div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>INFO:</strong> Job completed successfully
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-yellow-500`}></div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>WARNING:</strong> Job succeeded but with issues
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-red-500`}></div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>ERROR:</strong> Job failed, needs attention
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full bg-purple-500`}></div>
                            <div className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <strong>CRITICAL:</strong> System-wide failure, wake someone up!
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>🎯 Real-World Error Handling Example</h3>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💰 E-commerce Order Processing</h4>
                      <div className="space-y-3">
                        <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-green-100 dark:bg-green-900/30'} p-3 rounded`}>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-green-300' : 'text-green-700 dark:text-green-300'} font-medium mb-1`}>
                            ✅ TRY: Process credit card payment
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`}>
                            SUCCESS: Send confirmation email + update inventory
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-yellow-600/20' : 'bg-yellow-100 dark:bg-yellow-900/30'} p-3 rounded`}>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700 dark:text-yellow-300'} font-medium mb-1`}>
                            ⚠️ RETRY: Payment gateway timeout (3 attempts)
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            Wait 5s, 15s, 45s between attempts
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-red-600/20' : 'bg-red-100 dark:bg-red-900/30'} p-3 rounded`}>
                          <div className={`text-sm ${theme === 'gradient' ? 'text-red-300' : 'text-red-700 dark:text-red-300'} font-medium mb-1`}>
                            ❌ CATCH: All retries failed
                          </div>
                          <div className={`text-xs ${theme === 'gradient' ? 'text-red-400' : 'text-red-600'}`}>
                            ACTIONS: Hold order + notify finance team + email customer about delay
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>✅ Error Handling Checklist</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Before Deployment:</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Set up retry logic for API calls</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Add error triggers to critical nodes</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Configure fallback data sources</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Test failure scenarios manually</span>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>For Monitoring:</h4>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Set up error logging</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Configure alert notifications</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Create error dashboards</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Document recovery procedures</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cron-step-6',
              title: 'Job Monitoring',
              description: 'Monitor job execution and performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Job Monitoring (Your Digital Oversight System! 📊)</h3>
                    <p className="text-lg opacity-90">
                      Think of job monitoring like having a security guard for your automation factory. Just as a security guard watches over a building 24/7, 
                      monitoring systems watch over your cron jobs to ensure they're running smoothly, catch problems early, and provide insights for optimization.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Monitor Cron Jobs?
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🚨 Early Problem Detection:</strong> Catch failures before customers notice</p>
                        <p><strong>📈 Performance Insights:</strong> Understand resource usage patterns</p>
                        <p><strong>🔍 Debugging Support:</strong> Detailed logs for troubleshooting</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📊 Business Intelligence:</strong> Track automation effectiveness</p>
                        <p><strong>🛡️ Security Monitoring:</strong> Detect unusual job behavior</p>
                        <p><strong>💰 Cost Optimization:</strong> Identify resource-heavy jobs</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🔧 Essential Monitoring Components</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">1. 📝 Execution Logging</h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># n8n workflow execution log example</div>
                            <div>2024-01-15 08:00:01 [INFO] Starting workflow: daily-report-generator</div>
                            <div>2024-01-15 08:00:02 [INFO] Fetching data from API: /sales/yesterday</div>
                            <div>2024-01-15 08:00:05 [INFO] Processing 247 records</div>
                            <div>2024-01-15 08:00:08 [INFO] Generating PDF report</div>
                            <div>2024-01-15 08:00:12 [INFO] Sending email to: team@company.com</div>
                            <div>2024-01-15 08:00:15 [SUCCESS] Workflow completed in 14.2 seconds</div>
                          </div>
                        </div>
                        <p className="text-sm mt-2 opacity-80">
                          <strong>Key Metrics to Log:</strong> Start/end times, data volumes, API response times, memory usage, error messages
                        </p>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">2. 🎯 Health Checks & Alerts</h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Health check configuration</div>
                            <div>ALERT_CONDITIONS:</div>
                            <div>  - job_duration_exceeds: 300s  # 5 minutes</div>
                            <div>  - failure_rate_above: 5%      # Error threshold</div>
                            <div>  - memory_usage_above: 80%     # Resource limit</div>
                            <div>  - no_execution_for: 24h       # Missing runs</div>
                            <div></div>
                            <div>NOTIFICATION_CHANNELS:</div>
                            <div>  - slack: #alerts-automation</div>
                            <div>  - email: admin@company.com</div>
                            <div>  - webhook: https://status.company.com/update</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">3. 📊 Performance Metrics Dashboard</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-green-600">98.5%</div>
                            <div className="text-sm">Success Rate</div>
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-blue-600">2.3s</div>
                            <div className="text-sm">Avg Duration</div>
                          </div>
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded text-center">
                            <div className="text-2xl font-bold text-purple-600">1,247</div>
                            <div className="text-sm">Runs Today</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🛠️ Implementing Monitoring in n8n</h4>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-300/30">
                      <h5 className="font-semibold mb-3">Step-by-Step Monitoring Setup:</h5>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                          <div>
                            <strong>Enable Workflow Logging:</strong>
                            <p className="opacity-80 mt-1">Settings → Logging → Enable execution logging with "Detailed" level</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                          <div>
                            <strong>Add Monitoring Nodes:</strong>
                            <p className="opacity-80 mt-1">Insert "HTTP Request" nodes to send status updates to monitoring services</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                          <div>
                            <strong>Configure Error Handlers:</strong>
                            <p className="opacity-80 mt-1">Add "Error Trigger" nodes to capture and report failures immediately</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
                          <div>
                            <strong>Set Up Dashboards:</strong>
                            <p className="opacity-80 mt-1">Use tools like Grafana, DataDog, or custom dashboards to visualize metrics</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🚨 Common Monitoring Patterns</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Warning Signals</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• Jobs taking 50% longer than usual</li>
                          <li>• Increased memory usage patterns</li>
                          <li>• Unusual API response times</li>
                          <li>• Growing log file sizes</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300/30">
                        <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">🔥 Critical Alerts</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• Job failures or timeouts</li>
                          <li>• Missing scheduled executions</li>
                          <li>• Database connection errors</li>
                          <li>• Security or authentication issues</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-300/30">
                    <h4 className="text-xl font-semibold mb-3">🏆 Monitoring Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>📱 Smart Alerting:</strong> Alert on trends, not just failures</p>
                        <p><strong>📈 Baseline Metrics:</strong> Establish normal performance patterns</p>
                        <p><strong>🔄 Regular Reviews:</strong> Weekly monitoring health checks</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🎯 Actionable Alerts:</strong> Include context and next steps</p>
                        <p><strong>📊 Historical Data:</strong> Keep 90+ days of execution history</p>
                        <p><strong>🚀 Proactive Monitoring:</strong> Monitor business metrics, not just technical ones</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🎯</span>
                      Monitoring Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up execution logging with appropriate detail level</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Configure health checks for all critical workflows</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement error handling and notification workflows</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create monitoring dashboard with key metrics</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test alert systems with simulated failures</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Document monitoring procedures and runbooks</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cron-step-7',
              title: 'Scaling Jobs',
              description: 'Scale cron jobs for high-load scenarios',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Scaling Jobs (Building Your Automation Empire! 🏗️)</h3>
                    <p className="text-lg opacity-90">
                      Think of scaling cron jobs like expanding a successful restaurant chain. You start with one location that works perfectly, 
                      then you need to figure out how to serve thousands of customers across multiple locations without losing quality or speed. 
                      That's exactly what we're doing with your automation workflows!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-lg border border-orange-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 When Do You Need to Scale?
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>📈 Growing Data Volume:</strong> Processing millions vs thousands of records</p>
                        <p><strong>⏰ Time Constraints:</strong> Jobs taking longer than available windows</p>
                        <p><strong>🔄 Increased Frequency:</strong> Need to run every minute vs hourly</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🌍 Global Operations:</strong> Multiple time zones and regions</p>
                        <p><strong>🚀 Business Growth:</strong> More customers, more automations needed</p>
                        <p><strong>⚡ Performance Issues:</strong> Resource limitations affecting other systems</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🏗️ Scaling Strategies</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">1. 🔀 Horizontal Scaling (Multiple Workers)</h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like having multiple cashiers instead of one super-fast cashier. Spread the work across multiple n8n instances.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-cyan-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Load balancer configuration</div>
                            <div>WORKER_INSTANCES:</div>
                            <div>  - n8n-worker-1: processes orders</div>
                            <div>  - n8n-worker-2: handles notifications</div>
                            <div>  - n8n-worker-3: manages reports</div>
                            <div></div>
                            <div>QUEUE_SYSTEM:</div>
                            <div>  - Redis/Bull for job distribution</div>
                            <div>  - Each worker picks up available jobs</div>
                            <div>  - Automatic failover if worker goes down</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">2. ⬆️ Vertical Scaling (Bigger Resources)</h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like upgrading from a bicycle to a sports car. Give your existing n8n instance more power.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-center">
                            <div className="text-lg font-bold text-blue-600">CPU</div>
                            <div className="text-sm">2→8 cores</div>
                            <div className="text-xs opacity-70">4x processing power</div>
                          </div>
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded text-center">
                            <div className="text-lg font-bold text-green-600">RAM</div>
                            <div className="text-sm">4GB→16GB</div>
                            <div className="text-xs opacity-70">Handle larger datasets</div>
                          </div>
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded text-center">
                            <div className="text-lg font-bold text-purple-600">Storage</div>
                            <div className="text-sm">SSD upgrade</div>
                            <div className="text-xs opacity-70">Faster I/O operations</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <h5 className="font-semibold mb-2">3. 🧩 Micro-Jobs (Breaking Down Tasks)</h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like having an assembly line instead of one person building the entire car. Break big jobs into smaller, manageable pieces.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Before: One massive job</div>
                            <div>daily-report-job:</div>
                            <div>  - fetch 1M customer records</div>
                            <div>  - calculate metrics for all</div>
                            <div>  - generate report</div>
                            <div>  - send to 10,000 users</div>
                            <div></div>
                            <div># After: Multiple focused jobs</div>
                            <div>data-fetcher: fetches data every hour</div>
                            <div>metric-calculator: processes batches of 1000</div>
                            <div>report-generator: creates report from pre-calculated data</div>
                            <div>email-sender: sends in batches of 100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🛠️ Implementation Techniques</h4>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-300/30">
                      <h5 className="font-semibold mb-3">Advanced Scaling Patterns:</h5>
                      <div className="space-y-4">
                        
                        <div className="border-l-4 border-blue-400 pl-4">
                          <h6 className="font-semibold text-blue-600 dark:text-blue-400">🔄 Queue-Based Processing</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Use Redis or RabbitMQ to create job queues. Workers pick up jobs as they become available, 
                            automatically balancing load and providing fault tolerance.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-400 pl-4">
                          <h6 className="font-semibold text-green-600 dark:text-green-400">📦 Batch Processing</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Instead of processing one record at a time, process 100 or 1000 records together. 
                            This reduces overhead and dramatically improves throughput.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-purple-400 pl-4">
                          <h6 className="font-semibold text-purple-600 dark:text-purple-400">⚡ Async Operations</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Use webhooks and async patterns instead of waiting for long-running operations. 
                            Start a process, get a callback when it's done.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-orange-400 pl-4">
                          <h6 className="font-semibold text-orange-600 dark:text-orange-400">🌍 Geographic Distribution</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Deploy n8n instances in different regions to reduce latency and comply with data locality requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">📊 Performance Optimization</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🚀 Speed Boosters</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Database connection pooling</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>API response caching</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Parallel API calls</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Optimized database queries</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Memory-efficient data processing</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                        <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">⚠️ Common Bottlenecks</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>Sequential API calls (use parallel)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>Loading all data into memory</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>Inefficient database queries</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>No error handling or retries</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>Blocking operations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🏭 Real-World Scaling Examples</h4>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold mb-2">📧 Email Campaign Platform</h5>
                        <p className="text-sm opacity-80 mb-2">
                          <strong>Challenge:</strong> Send 1 million personalized emails daily
                        </p>
                        <p className="text-sm opacity-80">
                          <strong>Solution:</strong> 10 worker instances, each handles 100K emails. Redis queue distributes work. 
                          Each worker sends 1000 emails at a time with 2-second delays to respect rate limits.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold mb-2">🛒 E-commerce Order Processing</h5>
                        <p className="text-sm opacity-80 mb-2">
                          <strong>Challenge:</strong> Process thousands of orders during flash sales
                        </p>
                        <p className="text-sm opacity-80">
                          <strong>Solution:</strong> Separate workflows for different stages: order validation, inventory check, 
                          payment processing, fulfillment. Each runs independently and communicates via webhooks.
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold mb-2">📊 Analytics Pipeline</h5>
                        <p className="text-sm opacity-80 mb-2">
                          <strong>Challenge:</strong> Process terabytes of user data for real-time insights
                        </p>
                        <p className="text-sm opacity-80">
                          <strong>Solution:</strong> Micro-batching every 5 minutes, distributed across 20 workers. 
                          Data partitioned by region and time. Pre-aggregated results stored for quick dashboard queries.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 p-6 rounded-lg border border-indigo-300/30">
                    <h4 className="text-xl font-semibold mb-3">🎯 Scaling Action Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>1. 📊 Measure First:</strong> Identify actual bottlenecks before scaling</p>
                        <p><strong>2. 🎯 Start Small:</strong> Scale one component at a time</p>
                        <p><strong>3. 🧪 Test Thoroughly:</strong> Load test scaled solutions</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>4. 📈 Monitor Always:</strong> Track performance during and after scaling</p>
                        <p><strong>5. 🔄 Iterate:</strong> Continuously optimize based on real usage</p>
                        <p><strong>6. 💰 Cost-Optimize:</strong> Balance performance with infrastructure costs</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🚀</span>
                      Scaling Readiness Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Performance monitoring and metrics collection in place</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Identified specific bottlenecks and resource constraints</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Workflows designed with modular, scalable architecture</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Database and API endpoints optimized for high load</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Error handling and retry logic implemented</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Load testing environment and procedures ready</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Budget and infrastructure plan approved</span>
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
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Alert Types (Your Digital Early Warning System! 🚨)</h3>
                    <p className="text-lg opacity-90">
                      Think of alert types like different smoke detectors in your house. You have different sensors for kitchen smoke, 
                      bedroom fire, and carbon monoxide - each designed to catch specific problems and respond appropriately. 
                      In n8n, different alert types help you monitor various aspects of your workflows with precision.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Different Alert Types Matter
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🎛️ Right Response:</strong> Match alert urgency to the actual problem</p>
                        <p><strong>📱 Proper Channels:</strong> Send critical alerts to phone, info to email</p>
                        <p><strong>⏰ Smart Timing:</strong> Immediate for failures, batched for reports</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>👥 Right People:</strong> Route alerts to the right team members</p>
                        <p><strong>🧠 Clear Context:</strong> Include relevant information for quick action</p>
                        <p><strong>📊 Better Tracking:</strong> Categorize and analyze alert patterns</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🔔 Core Alert Types</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300/30">
                        <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
                          🚨 Critical Alerts
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like fire alarms - immediate attention required! These alerts indicate system failures or security breaches.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-red-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Critical alert examples</div>
                            <div>❌ Workflow execution failed</div>
                            <div>🔒 Authentication errors</div>
                            <div>💾 Database connection lost</div>
                            <div>🌐 API service unavailable</div>
                            <div>💰 Payment processing failures</div>
                            <div>🛡️ Security breach detected</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm">
                          <strong>Response Time:</strong> Immediate (SMS + Phone Call) | <strong>Audience:</strong> On-call team + Management
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          ⚠️ Warning Alerts
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like car dashboard warning lights - something needs attention soon, but not immediately critical.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Warning alert examples</div>
                            <div>⏱️ Workflow taking longer than usual</div>
                            <div>📈 High memory usage (80%+)</div>
                            <div>🔄 Increased retry attempts</div>
                            <div>📊 Data quality issues detected</div>
                            <div>💸 Monthly budget threshold reached</div>
                            <div>⚡ API rate limit approaching</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Response Time:</strong> Within hours (Email + Slack) | <strong>Audience:</strong> Operations team
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          ℹ️ Informational Alerts
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like friendly notifications - good to know information that helps with planning and optimization.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Informational alert examples</div>
                            <div>✅ Daily workflow completed successfully</div>
                            <div>📊 Weekly performance summary</div>
                            <div>🎯 Monthly goals achieved</div>
                            <div>🔄 Scheduled maintenance completed</div>
                            <div>📈 Usage analytics report ready</div>
                            <div>🎉 Milestone reached (1000 workflows!)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Response Time:</strong> Daily digest (Email) | <strong>Audience:</strong> All stakeholders
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          ✅ Success Alerts
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Like completion notifications - confirming that important processes finished successfully.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Success alert examples</div>
                            <div>🎯 Critical workflow completed</div>
                            <div>💾 Backup process finished</div>
                            <div>📤 Reports delivered successfully</div>
                            <div>🔄 Data sync completed</div>
                            <div>🚀 Deployment successful</div>
                            <div>💰 Payment processed successfully</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Response Time:</strong> Immediate confirmation | <strong>Audience:</strong> Process owners
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎛️ Alert Severity Matrix</h4>
                    
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-600">
                              <th className="text-left p-2">Severity</th>
                              <th className="text-left p-2">Response Time</th>
                              <th className="text-left p-2">Channel</th>
                              <th className="text-left p-2">Example</th>
                            </tr>
                          </thead>
                          <tbody className="space-y-2">
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">CRITICAL</span></td>
                              <td className="p-2">Immediate</td>
                              <td className="p-2">SMS + Call</td>
                              <td className="p-2">Payment system down</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">HIGH</span></td>
                              <td className="p-2">15 minutes</td>
                              <td className="p-2">Slack + Email</td>
                              <td className="p-2">API errors increasing</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">MEDIUM</span></td>
                              <td className="p-2">1 hour</td>
                              <td className="p-2">Email</td>
                              <td className="p-2">Performance degraded</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">LOW</span></td>
                              <td className="p-2">4 hours</td>
                              <td className="p-2">Dashboard</td>
                              <td className="p-2">Usage metrics updated</td>
                            </tr>
                            <tr>
                              <td className="p-2"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">INFO</span></td>
                              <td className="p-2">Daily digest</td>
                              <td className="p-2">Email summary</td>
                              <td className="p-2">Daily report completed</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-300/30">
                    <h4 className="text-xl font-semibold mb-3">🎯 Smart Alert Classification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🤖 Auto-Classification:</strong> Use keywords and context to auto-assign severity</p>
                        <p><strong>📊 Business Impact:</strong> Consider revenue &amp; customer impact when setting levels</p>
                        <p><strong>⏰ Time Sensitivity:</strong> Factor in time-critical vs. batch processes</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>👥 Team Structure:</strong> Align alert types with team responsibilities</p>
                        <p><strong>🔄 Regular Review:</strong> Adjust classifications based on real incidents</p>
                        <p><strong>📈 Escalation Rules:</strong> Auto-escalate if not acknowledged in time</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🎯</span>
                      Alert Types Setup Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Define critical vs warning vs info alert categories</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Map alert types to appropriate notification channels</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set response time expectations for each alert type</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Assign responsible teams/individuals for each category</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create alert templates with consistent formatting</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test alert routing and delivery for each type</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'alert-step-2',
              title: 'Alert Channels',
              description: 'Configure notification channels',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Alert Channels (Your Communication Network! 📡)</h3>
                    <p className="text-lg opacity-90">
                      Think of alert channels like a fire station's communication system. When there's an emergency, they don't just rely on one phone - 
                      they have radios, sirens, lights, and multiple phone lines to ensure the message gets through to the right people at the right time. 
                      Your n8n alerts need the same multi-channel approach!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-lg border border-blue-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Multiple Alert Channels Matter
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🔄 Redundancy:</strong> If Slack is down, emails still get through</p>
                        <p><strong>⚡ Speed:</strong> SMS for critical alerts, email for detailed info</p>
                        <p><strong>📱 Context:</strong> Match channel to user preference and location</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>👥 Reach:</strong> Different teams prefer different channels</p>
                        <p><strong>📊 Tracking:</strong> Monitor which channels are most effective</p>
                        <p><strong>🎛️ Control:</strong> Easy to disable/enable channels per alert type</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">📡 Popular Alert Channels</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          💬 Slack/Teams/Discord
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Perfect for team collaboration and real-time discussion around incidents.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Slack webhook example</div>
                            <div>POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL</div>
                            <div>{`{`}</div>
                            <div>  "channel": "#alerts-automation",</div>
                            <div>  "username": "n8n-monitor",</div>
                            <div>  "text": "🚨 CRITICAL: Payment workflow failed",</div>
                            <div>  "attachments": [{`{`}</div>
                            <div>    "color": "danger",</div>
                            <div>    "fields": [{`{"title": "Error", "value": "API timeout"}`}]</div>
                            <div>  {`}`}]</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Best For:</strong> Team alerts, collaboration, non-critical notifications | <strong>Response Time:</strong> Near real-time
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300/30">
                        <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
                          📱 SMS/Text Messages
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          The nuclear option - for when you absolutely need immediate attention, no matter where someone is.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-red-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># SMS via Twilio example</div>
                            <div>POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json</div>
                            <div>Authorization: Basic [base64 credentials]</div>
                            <div>Content-Type: application/x-www-form-urlencoded</div>
                            <div></div>
                            <div>To=+1234567890</div>
                            <div>From=+0987654321</div>
                            <div>Body=🚨 CRITICAL: Payment system down. Immediate action required!</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 rounded text-sm">
                          <strong>Best For:</strong> Critical alerts, on-call rotations, after-hours emergencies | <strong>Response Time:</strong> Seconds
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          📧 Email
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Great for detailed information, documentation, and non-urgent notifications that need context.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Email alert template</div>
                            <div>Subject: [WARNING] n8n Workflow Performance Alert</div>
                            <div>To: ops-team@company.com</div>
                            <div></div>
                            <div>Workflow: daily-sales-report</div>
                            <div>Issue: Execution time increased 300% (normal: 2min, current: 8min)</div>
                            <div>Started: 2024-01-15 14:30:00 UTC</div>
                            <div>Logs: https://n8n.company.com/workflow/12345</div>
                            <div></div>
                            <div>Suggested Actions:</div>
                            <div>- Check API response times</div>
                            <div>- Review recent data volume changes</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Best For:</strong> Detailed reports, documentation, daily digests | <strong>Response Time:</strong> Minutes to hours
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          🔗 Webhooks
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Send alerts to other systems like PagerDuty, custom dashboards, or trigger automated responses.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Webhook to incident management system</div>
                            <div>POST https://api.pagerduty.com/incidents</div>
                            <div>Authorization: Token token=YOUR_API_KEY</div>
                            <div>Content-Type: application/json</div>
                            <div></div>
                            <div>{`{`}</div>
                            <div>  "incident": {`{`}</div>
                            <div>    "type": "incident",</div>
                            <div>    "title": "n8n Workflow Failure",</div>
                            <div>    "service": {`{"id": "SERVICE_ID", "type": "service_reference"}`},</div>
                            <div>    "urgency": "high"</div>
                            <div>  {`}`}</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Best For:</strong> System integrations, automated responses, incident management | <strong>Response Time:</strong> Immediate
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          📞 Phone Calls
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          The ultimate escalation - automated voice calls for when everything else has failed.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Voice call via Twilio</div>
                            <div>POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Calls.json</div>
                            <div></div>
                            <div>To=+1234567890</div>
                            <div>From=+0987654321</div>
                            <div>Url=https://your-server.com/voice-alert.xml</div>
                            <div></div>
                            <div># voice-alert.xml (TwiML)</div>
                            <div>&lt;Response&gt;</div>
                            <div>  &lt;Say voice="alice"&gt;Critical alert: Payment system is down. Please check immediately.&lt;/Say&gt;</div>
                            <div>  &lt;Say voice="alice"&gt;Press 1 to acknowledge, or stay on the line to repeat.&lt;/Say&gt;</div>
                            <div>&lt;/Response&gt;</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Best For:</strong> Critical system failures, final escalation step | <strong>Response Time:</strong> Immediate
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎛️ Channel Selection Strategy</h4>
                    
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-600">
                              <th className="text-left p-2">Alert Level</th>
                              <th className="text-left p-2">Primary Channel</th>
                              <th className="text-left p-2">Secondary Channel</th>
                              <th className="text-left p-2">Escalation (if no response)</th>
                            </tr>
                          </thead>
                          <tbody className="space-y-2">
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">CRITICAL</span></td>
                              <td className="p-2">SMS + Phone Call</td>
                              <td className="p-2">Slack</td>
                              <td className="p-2">Manager phone call (15 min)</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs">HIGH</span></td>
                              <td className="p-2">Slack</td>
                              <td className="p-2">Email</td>
                              <td className="p-2">SMS (1 hour)</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">MEDIUM</span></td>
                              <td className="p-2">Email</td>
                              <td className="p-2">Slack</td>
                              <td className="p-2">Manager email (4 hours)</td>
                            </tr>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="p-2"><span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">LOW</span></td>
                              <td className="p-2">Dashboard</td>
                              <td className="p-2">Daily email digest</td>
                              <td className="p-2">Weekly review</td>
                            </tr>
                            <tr>
                              <td className="p-2"><span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">INFO</span></td>
                              <td className="p-2">Dashboard</td>
                              <td className="p-2">Weekly email summary</td>
                              <td className="p-2">None</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-300/30">
                    <h4 className="text-xl font-semibold mb-3">🎯 Channel Configuration Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🔄 Test Regularly:</strong> Monthly test of all alert channels to ensure they work</p>
                        <p><strong>🎛️ Easy Toggles:</strong> Quick way to disable channels during maintenance</p>
                        <p><strong>📊 Track Delivery:</strong> Monitor which channels successfully deliver alerts</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>⏰ Time-Aware:</strong> Different channels for business hours vs after-hours</p>
                        <p><strong>👥 Role-Based:</strong> Different channels for different team roles</p>
                        <p><strong>🔧 Graceful Fallback:</strong> If primary channel fails, automatically try secondary</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">📡</span>
                      Alert Channels Setup Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Configure Slack/Teams webhooks for team notifications</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up SMS service (Twilio, AWS SNS) for critical alerts</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Configure email templates for different alert types</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create webhooks for external monitoring systems</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test all channels with sample alerts</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Document escalation paths and fallback procedures</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up monitoring for the alert channels themselves</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Alert Rules (Your Smart Decision Engine! 🧠)</h3>
                    <p className="text-lg opacity-90">
                      Think of alert rules like the brain of a seasoned emergency dispatcher. When a 911 call comes in, they quickly assess: 
                      "Is this really an emergency? What resources are needed? Who should respond?" Alert rules do the same for your workflows - 
                      intelligently deciding when, how, and to whom alerts should be sent.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg border border-green-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Smart Alert Rules Matter
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🎛️ Reduce Noise:</strong> Only alert when it truly matters</p>
                        <p><strong>⚡ Faster Response:</strong> Right alert to right person immediately</p>
                        <p><strong>🧠 Context Aware:</strong> Include relevant information automatically</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📊 Pattern Recognition:</strong> Learn from historical incidents</p>
                        <p><strong>⏰ Time Intelligence:</strong> Different rules for different times</p>
                        <p><strong>🔄 Self-Healing:</strong> Automatically attempt fixes before alerting</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎯 Core Alert Rule Types</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          🔍 Condition-Based Rules
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Rules that trigger when specific conditions are met - like "if workflow fails 3 times in a row" or "if execution time exceeds 5 minutes."
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Condition-based alert rule examples</div>
                            <div>IF workflow_status = "failed" AND retry_count &gt; 2</div>
                            <div>  THEN send_alert(severity="critical", channel="sms")</div>
                            <div></div>
                            <div>IF execution_time &gt; 300 seconds AND workflow_type = "payment"</div>
                            <div>  THEN send_alert(severity="high", channel="slack")</div>
                            <div></div>
                            <div>IF error_message CONTAINS "database timeout"</div>
                            <div>  THEN send_alert(severity="medium", team="database")</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Best For:</strong> Technical failures, performance issues, system errors
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          ⏰ Time-Based Rules
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Rules that consider timing patterns - like "workflow hasn't run in expected timeframe" or "unusual activity during off-hours."
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Time-based alert rule examples</div>
                            <div>IF last_successful_run &gt; 25 hours AND expected_frequency = "daily"</div>
                            <div>  THEN send_alert(severity="high", message="Daily workflow overdue")</div>
                            <div></div>
                            <div>IF current_time BETWEEN "22:00" AND "06:00" AND activity_level &gt; normal</div>
                            <div>  THEN send_alert(severity="medium", message="Unusual after-hours activity")</div>
                            <div></div>
                            <div>IF day_of_week = "Sunday" AND workflow_runs &gt; 0</div>
                            <div>  THEN send_alert(severity="low", message="Unexpected weekend activity")</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Best For:</strong> Scheduled workflow monitoring, unusual activity detection
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                        <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center">
                          📊 Threshold Rules
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Rules based on metrics crossing defined thresholds - like "CPU usage above 80%" or "more than 100 failed workflows per hour."
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-orange-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Threshold-based alert rule examples</div>
                            <div>IF cpu_usage &gt; 80% FOR 5 minutes</div>
                            <div>  THEN send_alert(severity="high", message="High CPU usage detected")</div>
                            <div></div>
                            <div>IF failed_workflows_per_hour &gt; 50</div>
                            <div>  THEN send_alert(severity="critical", message="High failure rate")</div>
                            <div></div>
                            <div>IF memory_usage &gt; 90% AND system_load &gt; 5.0</div>
                            <div>  THEN send_alert(severity="critical", action="scale_resources")</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-sm">
                          <strong>Best For:</strong> Performance monitoring, resource management, capacity planning
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          🔗 Composite Rules
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Complex rules that combine multiple conditions and data sources - the most powerful but require careful design.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Composite alert rule examples</div>
                            <div>IF (workflow_fails = true) AND (error_type = "API_timeout") </div>
                            <div>   AND (external_service_status = "degraded")</div>
                            <div>   AND (time_since_last_alert &gt; 30_minutes)</div>
                            <div>  THEN send_alert(severity="medium", message="Likely external service issue")</div>
                            <div></div>
                            <div>IF business_hours AND payment_workflow_fails AND transaction_volume &gt; 1000</div>
                            <div>  THEN send_alert(severity="critical", escalate_immediately=true)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Best For:</strong> Business-critical scenarios, complex incident correlation
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🛠️ Building Effective Alert Rules</h4>
                    
                    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-300/30">
                      <h5 className="font-semibold mb-3">Step-by-Step Rule Creation:</h5>
                      <div className="space-y-4">
                        
                        <div className="border-l-4 border-blue-400 pl-4">
                          <h6 className="font-semibold text-blue-600 dark:text-blue-400">1. 🎯 Define the Problem</h6>
                          <p className="text-sm opacity-80 mt-1">
                            What specific situation requires attention? Be precise: "Payment workflow takes longer than 2 minutes" 
                            vs. "Things are slow."
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-400 pl-4">
                          <h6 className="font-semibold text-green-600 dark:text-green-400">2. 📊 Set Clear Thresholds</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Use data to set realistic thresholds. If normal execution is 30 seconds, alerting at 35 seconds 
                            creates noise. Alert at 2-3x normal (60-90 seconds).
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-yellow-400 pl-4">
                          <h6 className="font-semibold text-yellow-600 dark:text-yellow-400">3. ⏰ Add Time Context</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Include duration: "CPU &gt; 80% for 5 minutes" prevents alerts for brief spikes. 
                            Consider business hours, weekends, maintenance windows.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-red-400 pl-4">
                          <h6 className="font-semibold text-red-600 dark:text-red-400">4. 🎛️ Define Actions</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Specify exactly what happens: which channel, what message, who gets notified, 
                            any automatic remediation attempts.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">💡 Rule Design Patterns</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">✅ Good Rule Examples</h5>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                            <strong>Specific &amp; Actionable:</strong><br/>
                            "If payment API returns 500 errors &gt; 5% for 2 minutes, alert payment team via Slack"
                          </div>
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                            <strong>Business Context:</strong><br/>
                            "If order processing workflow fails during business hours, page on-call immediately"
                          </div>
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                            <strong>Progressive Escalation:</strong><br/>
                            "Start with Slack, escalate to SMS after 15 minutes without acknowledgment"
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300/30">
                        <h5 className="font-semibold text-red-800 dark:text-red-200 mb-3">❌ Poor Rule Examples</h5>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                            <strong>Too Vague:</strong><br/>
                            "Alert when something goes wrong" - What? When? How?
                          </div>
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                            <strong>Too Sensitive:</strong><br/>
                            "Alert on any workflow taking &gt; 1 second" - Creates alert fatigue
                          </div>
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                            <strong>No Context:</strong><br/>
                            "Send email when error occurs" - To whom? What should they do?
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-300/30">
                    <h4 className="text-xl font-semibold mb-3">🔧 Advanced Rule Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🤖 Machine Learning:</strong> Rules that adapt based on historical patterns</p>
                        <p><strong>🔄 Auto-Remediation:</strong> Attempt fixes before alerting humans</p>
                        <p><strong>📊 Correlation:</strong> Connect related events across different workflows</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🎭 Conditional Logic:</strong> Different rules for different contexts</p>
                        <p><strong>⏰ Snoozing:</strong> Temporarily disable rules during maintenance</p>
                        <p><strong>📈 Adaptive Thresholds:</strong> Thresholds that change based on trends</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🧠</span>
                      Alert Rules Setup Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Define clear, specific conditions for each alert rule</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set realistic thresholds based on historical data</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Include time-based conditions to prevent false positives</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Specify exact actions: channels, recipients, messages</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test rules with historical scenarios</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Document business context and reasoning for each rule</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up rule performance monitoring and optimization</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'alert-step-4',
              title: 'Threshold Management',
              description: 'Set up effective alert thresholds',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Threshold Management (Your Smart Tripwire System! ⚖️)</h3>
                    <p className="text-lg opacity-90">
                      Think of alert thresholds like the smoke detector in your kitchen. Set it too sensitive and it goes off every time you make toast. 
                      Set it too high and you might not notice a real fire until it's too late. Perfect threshold management is about finding that 
                      "Goldilocks zone" - not too sensitive, not too lenient, but just right for catching real problems without false alarms.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-lg border border-yellow-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Smart Thresholds Are Critical
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🎛️ Reduce Alert Fatigue:</strong> Only alert when action is truly needed</p>
                        <p><strong>⚡ Faster Response:</strong> Clear signals lead to immediate action</p>
                        <p><strong>📊 Better Data:</strong> Meaningful thresholds create valuable metrics</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🧠 Pattern Learning:</strong> Thresholds improve with historical data</p>
                        <p><strong>💰 Cost Effective:</strong> Prevent unnecessary escalations and investigations</p>
                        <p><strong>🔄 Self-Improving:</strong> Dynamic thresholds adapt to changing conditions</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">📏 Core Threshold Types</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          ⏱️ Time-Based Thresholds
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Monitor execution duration, response times, and processing delays.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Execution Time Thresholds</div>
                            <div>Normal execution: 30-60 seconds</div>
                            <div>Warning threshold: 120 seconds (2x normal)</div>
                            <div>Critical threshold: 300 seconds (5x normal)</div>
                            <div></div>
                            <div># Dynamic threshold calculation</div>
                            <div>baseline = average_execution_time_last_30_days</div>
                            <div>warning = baseline * 2</div>
                            <div>critical = baseline * 4</div>
                            <div>emergency = baseline * 8</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Best For:</strong> Performance monitoring, SLA compliance, user experience tracking
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          📊 Volume-Based Thresholds
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Monitor data processing volumes, API calls, and system throughput.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># API Rate Thresholds</div>
                            <div>Normal: 100-500 requests/minute</div>
                            <div>Warning: 800 requests/minute (80% of limit)</div>
                            <div>Critical: 950 requests/minute (95% of limit)</div>
                            <div></div>
                            <div># Data Processing Volume</div>
                            <div>IF (records_processed &gt; daily_average * 3) THEN</div>
                            <div>  ALERT "Unusual data volume detected"</div>
                            <div>  INCLUDE current_volume, average_volume, percentage_increase</div>
                            <div>END IF</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Best For:</strong> Rate limiting, capacity planning, anomaly detection
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">⚖️</span>
                      Threshold Management Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Collect 2-4 weeks of baseline performance data</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Calculate 95th &amp; 99th percentiles for key metrics</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up different thresholds for business hours vs off-hours</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test threshold effectiveness and tune based on false positives</span>
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
          description: 'Advanced alerting strategies',
          steps: [
            {
              id: 'alert-step-5',
              title: 'Alert Fatigue Prevention',
              description: 'Prevent alert overload and fatigue',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Alert Fatigue Prevention (Your Mental Health Guardian! 🧠💚)</h3>
                    <p className="text-lg opacity-90">
                      Think of alert fatigue like a car alarm that goes off so often that everyone ignores it - even when there's an actual break-in. 
                      When your team gets bombarded with too many alerts, they start ignoring ALL alerts, including the critical ones. 
                      Smart alert fatigue prevention is about being the "good neighbor" who only calls for help when it really matters.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-6 rounded-lg border border-red-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🚨 The Alert Fatigue Problem
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>😵 Overwhelm:</strong> Too many alerts create decision paralysis</p>
                        <p><strong>🔇 Desensitization:</strong> Teams start ignoring all alerts</p>
                        <p><strong>⏰ Delayed Response:</strong> Real issues get lost in the noise</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>😰 Stress:</strong> Constant alerts create burnout</p>
                        <p><strong>💰 Wasted Resources:</strong> Time spent on false positives</p>
                        <p><strong>🎯 Lost Trust:</strong> Alert system loses credibility</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎛️ Smart Alert Reduction Strategies</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          📊 Alert Correlation &amp; Grouping
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Group related alerts together instead of sending 50 individual notifications.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Instead of 50 individual alerts:</div>
                            <div>❌ "Database connection failed - Workflow A"</div>
                            <div>❌ "Database connection failed - Workflow B"</div>
                            <div>❌ "Database connection failed - Workflow C"</div>
                            <div>❌ ... (47 more alerts)</div>
                            <div></div>
                            <div># Send ONE grouped alert:</div>
                            <div>✅ "DATABASE OUTAGE: 50 workflows affected"</div>
                            <div>   Duration: 15 minutes</div>
                            <div>   Affected: WorkflowA, WorkflowB, WorkflowC... (+47)</div>
                            <div>   Impact: Payment processing halted</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Result:</strong> 50 alerts → 1 meaningful alert with context
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          ⏱️ Time-Based Alert Suppression
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Use intelligent timing to prevent alert storms and give systems time to recover.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Alert Suppression Rules</div>
                            <div>IF (alert_type == "connection_timeout") THEN</div>
                            <div>  IF (last_alert_time &lt; 5_minutes_ago) THEN</div>
                            <div>    suppress_alert = true</div>
                            <div>    increment_suppressed_count++</div>
                            <div>  ELSE</div>
                            <div>    send_alert("Connection issues continue")</div>
                            <div>    include_suppressed_count_in_message</div>
                            <div>  END IF</div>
                            <div>END IF</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Result:</strong> Prevents alert storms while keeping teams informed
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          🧠 Intelligent Alert Prioritization
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Use business context to determine what really needs immediate attention.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Business Impact Scoring</div>
                            <div>function calculateAlertPriority(workflow, error) {`{`}</div>
                            <div>  let priority = 0</div>
                            <div>  </div>
                            <div>  // Business hours boost</div>
                            <div>  if (isBusinessHours()) priority += 2</div>
                            <div>  </div>
                            <div>  // Revenue impact</div>
                            <div>  if (workflow.tags.includes("revenue")) priority += 3</div>
                            <div>  if (workflow.tags.includes("customer-facing")) priority += 2</div>
                            <div>  </div>
                            <div>  // Error severity</div>
                            <div>  if (error.type === "data_loss") priority += 5</div>
                            <div>  if (error.type === "security") priority += 4</div>
                            <div>  </div>
                            <div>  return priority</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Result:</strong> High-impact issues get immediate attention, low-impact issues can wait
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🔄 Self-Healing &amp; Auto-Remediation
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Automatically fix common issues before they require human intervention.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Auto-remediation example</div>
                            <div>ON workflow_failure {`{`}</div>
                            <div>  IF (error_type == "rate_limit_exceeded") {`{`}</div>
                            <div>    wait(60_seconds)</div>
                            <div>    retry_workflow()</div>
                            <div>    log("Auto-retry attempted for rate limit")</div>
                            <div>    </div>
                            <div>    IF (retry_successful) {`{`}</div>
                            <div>      send_info_alert("Workflow recovered automatically")</div>
                            <div>    {`}`} ELSE {`{`}</div>
                            <div>      send_critical_alert("Auto-recovery failed")</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Result:</strong> Many issues resolve themselves, reducing alert volume by 60-80%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 p-6 rounded-lg border border-indigo-300/30">
                    <h4 className="text-xl font-semibold mb-3">📈 Alert Fatigue Metrics &amp; Monitoring</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>📊 Alert Volume Trends:</strong> Track alerts per day/hour/team member</p>
                        <p><strong>⏱️ Response Time Degradation:</strong> Monitor if teams are responding slower</p>
                        <p><strong>🎯 False Positive Rate:</strong> Track percentage of actionable vs noise alerts</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>✅ Resolution Rates:</strong> How many alerts lead to actual fixes</p>
                        <p><strong>😤 Team Feedback:</strong> Regular surveys on alert usefulness</p>
                        <p><strong>🔇 Acknowledgment Rates:</strong> How many alerts get acknowledged vs ignored</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🧠</span>
                      Alert Fatigue Prevention Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement alert correlation &amp; grouping for related incidents</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up time-based alert suppression to prevent storms</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create business-impact scoring for alert prioritization</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement auto-remediation for common, fixable issues</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Monitor alert fatigue metrics &amp; team feedback</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Regular alert hygiene reviews to eliminate noise</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'alert-step-6',
              title: 'Escalation Policies',
              description: 'Implement smart escalation workflows',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Escalation Policies (Your Emergency Response Plan! 🚨📋)</h3>
                    <p className="text-lg opacity-90">
                      Think of escalation policies like a hospital's emergency response protocol. When a patient arrives, there's a clear chain of escalation: 
                      Nurse → Doctor → Specialist → Department Head → Hospital Director. Each level knows when to escalate and who to contact. 
                      Your alert system needs the same structured, automated escalation to ensure critical issues never fall through the cracks.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Escalation Policies Are Critical
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🛡️ Safety Net:</strong> Ensures critical issues are never ignored</p>
                        <p><strong>⚡ Speed:</strong> Automatic escalation reduces response delays</p>
                        <p><strong>📋 Clear Responsibility:</strong> Everyone knows their role in emergencies</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🔄 Failsafe:</strong> Backup contacts when primary responders unavailable</p>
                        <p><strong>📊 Appropriate Response:</strong> Right level of urgency for each issue</p>
                        <p><strong>💰 Business Protection:</strong> Prevents costly outages from being missed</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎭 Core Escalation Types</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          ⏰ Time-Based Escalation
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Automatically escalate if no acknowledgment or resolution within specified timeframes.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Time-based escalation flow</div>
                            <div>CRITICAL Alert → Dev Team (immediate)</div>
                            <div>├─ No response in 15 min → Lead Developer</div>
                            <div>├─ No response in 30 min → Engineering Manager</div>
                            <div>├─ No response in 45 min → CTO + CEO</div>
                            <div>└─ No response in 60 min → All hands + external support</div>
                            <div></div>
                            <div>WARNING Alert → Dev Team (immediate)</div>
                            <div>├─ No response in 2 hours → Lead Developer</div>
                            <div>├─ No response in 8 hours → Engineering Manager</div>
                            <div>└─ No response in 24 hours → Weekly review</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Best For:</strong> Ensuring response SLAs, preventing ignored alerts
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          📊 Severity-Based Escalation
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Different escalation paths based on issue severity and business impact.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Severity escalation matrix</div>
                            <div>P0 (Critical - Revenue Impact):</div>
                            <div>  → On-call engineer (SMS + Call)</div>
                            <div>  → Backup on-call (15 min)</div>
                            <div>  → Engineering manager (30 min)</div>
                            <div>  → CTO + CEO (45 min)</div>
                            <div></div>
                            <div>P1 (High - Service Degradation):</div>
                            <div>  → Primary team (Slack + Email)</div>
                            <div>  → Team lead (2 hours)</div>
                            <div>  → Manager (8 hours)</div>
                            <div></div>
                            <div>P2 (Medium - Minor Impact):</div>
                            <div>  → Team (Email only)</div>
                            <div>  → Lead (next business day)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Best For:</strong> Matching response urgency to business impact
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          👥 Role-Based Escalation
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Route alerts to specific roles/teams based on the type of issue.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Role-based routing</div>
                            <div>Database Issues:</div>
                            <div>  Primary: Database Team</div>
                            <div>  Escalate: Database Admin → CTO</div>
                            <div></div>
                            <div>API/Integration Issues:</div>
                            <div>  Primary: Backend Team</div>
                            <div>  Escalate: API Lead → Engineering Manager</div>
                            <div></div>
                            <div>Security Issues:</div>
                            <div>  Primary: Security Team + CISO</div>
                            <div>  Escalate: Legal + CEO (immediately)</div>
                            <div></div>
                            <div>Payment/Financial Issues:</div>
                            <div>  Primary: Finance Team + Payment Team</div>
                            <div>  Escalate: CFO + CEO (30 min)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Best For:</strong> Specialized expertise, compliance requirements
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🌍 Follow-the-Sun Escalation
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Route alerts to different teams based on time zones and business hours.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Follow-the-sun schedule</div>
                            <div>00:00-08:00 UTC: APAC Team (Sydney/Tokyo)</div>
                            <div>  Primary: APAC On-call</div>
                            <div>  Escalate: APAC Lead → Global CTO</div>
                            <div></div>
                            <div>08:00-16:00 UTC: EMEA Team (London/Berlin)</div>
                            <div>  Primary: EMEA On-call</div>
                            <div>  Escalate: EMEA Lead → Global CTO</div>
                            <div></div>
                            <div>16:00-00:00 UTC: Americas Team (SF/NYC)</div>
                            <div>  Primary: Americas On-call</div>
                            <div>  Escalate: Americas Lead → Global CTO</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Best For:</strong> Global teams, 24/7 coverage, timezone optimization
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🔧 Implementation Best Practices</h4>
                    
                    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-300/30">
                      <h5 className="font-semibold mb-3">🛠️ Escalation Policy Design:</h5>
                      
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-400 pl-4">
                          <h6 className="font-semibold text-blue-600 dark:text-blue-400">1. 📋 Document Everything</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Clear escalation trees, contact information, and responsibilities. 
                            Make it easy to find who to call at 3 AM.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-green-400 pl-4">
                          <h6 className="font-semibold text-green-600 dark:text-green-400">2. 🔄 Multiple Contact Methods</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Don't rely on just email or Slack. Use SMS, calls, and push notifications 
                            for critical escalations.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-yellow-400 pl-4">
                          <h6 className="font-semibold text-yellow-600 dark:text-yellow-400">3. 🧪 Test Regularly</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Monthly escalation drills ensure the process works when you need it. 
                            Include testing backup contacts and after-hours scenarios.
                          </p>
                        </div>
                        
                        <div className="border-l-4 border-red-400 pl-4">
                          <h6 className="font-semibold text-red-600 dark:text-red-400">4. 📊 Track &amp; Optimize</h6>
                          <p className="text-sm opacity-80 mt-1">
                            Monitor escalation effectiveness: response times, resolution rates, 
                            and feedback from teams to continuously improve.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-300/30">
                    <h4 className="text-xl font-semibold mb-3">📱 n8n Escalation Implementation</h4>
                    <div className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono text-sm overflow-x-auto">
                      <div className="space-y-1">
                        <div># n8n escalation workflow example</div>
                        <div>1. Trigger: Workflow failure detected</div>
                        <div>2. Wait 15 minutes for acknowledgment</div>
                        <div>3. If no ACK → Send to backup on-call</div>
                        <div>4. Wait 30 minutes for resolution</div>
                        <div>5. If unresolved → Escalate to manager</div>
                        <div>6. Continue until resolved or max level reached</div>
                        <div></div>
                        <div># Implementation nodes:</div>
                        <div>- Wait Node (for timing)</div>
                        <div>- IF Node (check acknowledgment status)</div>
                        <div>- Webhook Node (send escalation alerts)</div>
                        <div>- Set Node (track escalation level)</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🚨</span>
                      Escalation Policies Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Define clear escalation triggers &amp; timing rules</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create severity-based escalation paths</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up role-based routing for specialized issues</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement follow-the-sun coverage for 24/7 operations</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Document all contact information &amp; backup contacts</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test escalation policies monthly with drills</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Monitor &amp; optimize escalation effectiveness</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'alert-step-7',
              title: 'Alert Analytics',
              description: 'Analyze alert patterns and optimize',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Alert Analytics (Your Intelligence Dashboard! 📊🔍)</h3>
                    <p className="text-lg opacity-90">
                      Think of alert analytics like a fitness tracker for your alerting system. Just as a fitness tracker tells you which exercises 
                      are working, how your health is trending, and where to improve, alert analytics show you which alerts are valuable, 
                      what patterns are emerging, and how to optimize your entire monitoring strategy for maximum effectiveness.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Alert Analytics Are Essential
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>📈 Continuous Improvement:</strong> Data-driven optimization of alert quality</p>
                        <p><strong>🎛️ Reduce Noise:</strong> Identify and eliminate useless alerts</p>
                        <p><strong>⚡ Faster Response:</strong> Understand response patterns to improve speed</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>💰 Cost Optimization:</strong> Focus resources on high-value alerts</p>
                        <p><strong>🔮 Predictive Insights:</strong> Spot trends before they become problems</p>
                        <p><strong>📊 Performance Tracking:</strong> Measure alert system effectiveness</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">📊 Core Analytics Metrics</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          📈 Alert Volume &amp; Trends
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Track alert frequency patterns to identify noise sources and peak periods.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Key volume metrics to track</div>
                            <div>Daily Alert Count: 150 (↑12% from last week)</div>
                            <div>Hourly Peak: 45 alerts (14:00-15:00 UTC)</div>
                            <div>Weekend Volume: 23% of weekday average</div>
                            <div>Top Alert Sources:</div>
                            <div>  1. API timeouts: 32%</div>
                            <div>  2. Database slow queries: 18%</div>
                            <div>  3. Memory usage warnings: 15%</div>
                            <div>  4. Failed authentication: 12%</div>
                            <div></div>
                            <div># Alert storm detection</div>
                            <div>IF (alerts_per_hour &gt; 3x_daily_average) THEN</div>
                            <div>  flag_as_alert_storm = true</div>
                            <div>  investigate_root_cause = true</div>
                            <div>END IF</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Insight:</strong> Helps identify patterns, peak periods, and potential alert storms
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          🎯 Alert Quality Metrics
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Measure how useful and actionable your alerts are to the receiving teams.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Quality metrics dashboard</div>
                            <div>Actionable Alert Rate: 73% (Target: &gt;80%)</div>
                            <div>False Positive Rate: 27% (Target: &lt;20%)</div>
                            <div>Alert Resolution Rate: 89% (Target: &gt;85%)</div>
                            <div>Average Time to Acknowledge: 8.5 min (Target: &lt;10 min)</div>
                            <div>Average Time to Resolve: 42 min (Target: &lt;60 min)</div>
                            <div></div>
                            <div># Quality scoring algorithm</div>
                            <div>quality_score = (</div>
                            <div>  (actionable_rate * 0.4) +</div>
                            <div>  ((100 - false_positive_rate) * 0.3) +</div>
                            <div>  (resolution_rate * 0.2) +</div>
                            <div>  (response_speed_score * 0.1)</div>
                            <div>)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Insight:</strong> Identifies which alerts provide real value vs noise
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          ⚡ Response Performance Analytics
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Analyze team response patterns to optimize escalation and improve reaction times.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Response analytics</div>
                            <div>Team Performance Summary:</div>
                            <div>Backend Team:</div>
                            <div>  Avg Response: 6.2 min (↓2.1 min vs last month)</div>
                            <div>  Resolution Rate: 94%</div>
                            <div>  Peak Response Hours: 09:00-17:00 UTC</div>
                            <div></div>
                            <div>Frontend Team:</div>
                            <div>  Avg Response: 12.7 min (↑1.3 min vs last month)</div>
                            <div>  Resolution Rate: 87%</div>
                            <div>  Slower Response: 18:00-09:00 UTC</div>
                            <div></div>
                            <div># Alert fatigue indicators</div>
                            <div>Response_degradation = current_month_avg / previous_month_avg</div>
                            <div>IF (response_degradation &gt; 1.2) THEN alert_fatigue_risk = HIGH</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Insight:</strong> Reveals team performance trends and potential fatigue signals
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🔮 Predictive Alert Intelligence
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Use historical data to predict and prevent issues before they trigger alerts.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Predictive patterns identified</div>
                            <div>Pattern 1: Database Cascade Failures</div>
                            <div>  Trigger: Memory usage &gt; 85% for 20+ minutes</div>
                            <div>  Prediction: 89% chance of connection timeouts in next 30 min</div>
                            <div>  Recommendation: Scale database or restart services</div>
                            <div></div>
                            <div>Pattern 2: API Rate Limit Storm</div>
                            <div>  Trigger: Request volume increases 200% in 10 min</div>
                            <div>  Prediction: 76% chance of rate limit alerts</div>
                            <div>  Recommendation: Enable auto-scaling or throttling</div>
                            <div></div>
                            <div># Machine learning model</div>
                            <div>confidence_threshold = 0.75</div>
                            <div>IF (prediction_confidence &gt; confidence_threshold) THEN</div>
                            <div>  send_preventive_alert()</div>
                            <div>  suggest_remediation_action()</div>
                            <div>END IF</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Insight:</strong> Enables proactive issue prevention before problems occur
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">📋 Alert Analytics Dashboard</h4>
                    
                    <div className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 p-6 rounded-lg border border-gray-300/30">
                      <h5 className="font-semibold mb-3">🖥️ Essential Dashboard Widgets:</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div className="border-l-4 border-green-400 pl-3">
                            <strong className="text-green-600 dark:text-green-400">📊 Volume Trends</strong>
                            <p className="opacity-80 mt-1">Hourly/daily/weekly alert volume with trend analysis</p>
                          </div>
                          <div className="border-l-4 border-blue-400 pl-3">
                            <strong className="text-blue-600 dark:text-blue-400">🎯 Quality Scores</strong>
                            <p className="opacity-80 mt-1">Alert effectiveness metrics and quality ratings</p>
                          </div>
                          <div className="border-l-4 border-purple-400 pl-3">
                            <strong className="text-purple-600 dark:text-purple-400">⚡ Response Times</strong>
                            <p className="opacity-80 mt-1">Team performance and response time analytics</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="border-l-4 border-yellow-400 pl-3">
                            <strong className="text-yellow-600 dark:text-yellow-400">🔍 Top Issues</strong>
                            <p className="opacity-80 mt-1">Most frequent alerts and their resolution patterns</p>
                          </div>
                          <div className="border-l-4 border-red-400 pl-3">
                            <strong className="text-red-600 dark:text-red-400">🚨 Escalation Paths</strong>
                            <p className="opacity-80 mt-1">Escalation effectiveness and bottleneck analysis</p>
                          </div>
                          <div className="border-l-4 border-indigo-400 pl-3">
                            <strong className="text-indigo-600 dark:text-indigo-400">🔮 Predictions</strong>
                            <p className="opacity-80 mt-1">AI-powered insights and preventive recommendations</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 p-6 rounded-lg border border-indigo-300/30">
                    <h4 className="text-xl font-semibold mb-3">🔧 Optimization Recommendations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🎛️ Alert Tuning:</strong> Adjust thresholds based on false positive analysis</p>
                        <p><strong>📊 Channel Optimization:</strong> Route alerts to most effective channels</p>
                        <p><strong>⏰ Timing Improvements:</strong> Optimize escalation timing based on response data</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>👥 Team Balancing:</strong> Redistribute load based on performance metrics</p>
                        <p><strong>🔄 Process Refinement:</strong> Streamline workflows with highest resolution rates</p>
                        <p><strong>🧠 ML Enhancement:</strong> Continuously improve predictive capabilities</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">📊</span>
                      Alert Analytics Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up alert volume tracking &amp; trend analysis</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement alert quality scoring &amp; metrics</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Track team response performance &amp; patterns</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Build comprehensive analytics dashboard</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement predictive analytics &amp; ML models</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create automated optimization recommendations</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Schedule regular analytics reviews &amp; improvements</span>
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
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Discord Bot Basics (Your Digital Assistant Foundation! 🤖✨)</h3>
                    <p className="text-lg opacity-90">
                      Think of a Discord bot like a helpful digital assistant that never sleeps. Just like a hotel concierge who can answer questions, 
                      make reservations, and handle requests 24/7, a Discord bot can automate tasks, moderate your server, and engage with your community 
                      around the clock. Understanding the fundamentals is key to building powerful, reliable automation.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-6 rounded-lg border border-purple-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Discord Bots Are Game-Changers
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🕰️ 24/7 Availability:</strong> Never sleep, always ready to help</p>
                        <p><strong>⚡ Instant Response:</strong> Handle multiple requests simultaneously</p>
                        <p><strong>🎛️ Automation:</strong> Reduce repetitive tasks for moderators</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📊 Data Collection:</strong> Track server analytics and user behavior</p>
                        <p><strong>🎮 Enhanced UX:</strong> Create interactive experiences and games</p>
                        <p><strong>🔧 Customization:</strong> Tailor functionality to your community's needs</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🏗️ Core Discord Bot Architecture</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          🧠 Bot Brain (Application Logic)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          The core intelligence that processes commands, makes decisions, and executes actions.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Bot architecture components</div>
                            <div>Bot Instance</div>
                            <div>├── Event Listeners (message, user join, etc.)</div>
                            <div>├── Command Handlers (/ping, /help, /kick)</div>
                            <div>├── Database Connections (user data, settings)</div>
                            <div>├── External APIs (weather, music, etc.)</div>
                            <div>└── Background Tasks (moderation, announcements)</div>
                            <div></div>
                            <div># Example bot flow</div>
                            <div>User types "/weather NYC"</div>
                            <div>→ Bot receives command event</div>
                            <div>→ Parse command &amp; arguments</div>
                            <div>→ Call weather API</div>
                            <div>→ Format response</div>
                            <div>→ Send reply to user</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Key Features:</strong> Command processing, event handling, data management
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          🔗 Discord Gateway (Real-time Connection)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          WebSocket connection that receives real-time events from Discord servers.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Gateway event types</div>
                            <div>MESSAGE_CREATE     → New message posted</div>
                            <div>GUILD_MEMBER_ADD   → User joins server</div>
                            <div>GUILD_MEMBER_REMOVE → User leaves server</div>
                            <div>MESSAGE_REACTION_ADD → User adds reaction</div>
                            <div>VOICE_STATE_UPDATE  → User joins/leaves voice</div>
                            <div>PRESENCE_UPDATE     → User status changes</div>
                            <div></div>
                            <div># Connection management</div>
                            <div>bot.on('ready', () =&gt; {`{`}</div>
                            <div>  console.log('Bot is online!')</div>
                            <div>  bot.user.setActivity('Helping users')</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Key Features:</strong> Real-time events, presence updates, voice activity
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          🌐 Discord API (REST Endpoints)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          HTTP API for sending messages, managing servers, and performing actions.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Common API endpoints</div>
                            <div>POST /channels/{`{channel_id}`}/messages  → Send message</div>
                            <div>PATCH /guilds/{`{guild_id}`}/members/{`{user_id}`} → Modify member</div>
                            <div>DELETE /channels/{`{channel_id}`}/messages/{`{message_id}`} → Delete message</div>
                            <div>PUT /guilds/{`{guild_id}`}/bans/{`{user_id}`} → Ban user</div>
                            <div></div>
                            <div># API rate limits</div>
                            <div>Global: 50 requests per second</div>
                            <div>Per Route: Varies (5-30 requests per 5 seconds)</div>
                            <div>Message Creation: 5 messages per 5 seconds</div>
                            <div></div>
                            <div># Rate limit handling</div>
                            <div>if (rateLimitHit) {`{`}</div>
                            <div>  await wait(retryAfter * 1000)</div>
                            <div>  retryRequest()</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Key Features:</strong> Message sending, server management, rate limiting
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🔐 Authentication &amp; Permissions
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Bot tokens and permission system that control what your bot can do.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Bot token format</div>
                            <div>Bot Token: "Bot MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FMQ.ZnCjm1XVW7vRze4b7Cq4se7kKWs"</div>
                            <div>           ^^^ Never share this! Keep it secret!</div>
                            <div></div>
                            <div># Essential permissions</div>
                            <div>SEND_MESSAGES        → Send messages in channels</div>
                            <div>READ_MESSAGE_HISTORY → Read previous messages</div>
                            <div>MANAGE_MESSAGES      → Delete/pin messages</div>
                            <div>KICK_MEMBERS         → Kick users from server</div>
                            <div>BAN_MEMBERS          → Ban users from server</div>
                            <div>MANAGE_ROLES         → Assign/remove roles</div>
                            <div></div>
                            <div># Permission checking</div>
                            <div>if (!member.hasPermission('KICK_MEMBERS')) {`{`}</div>
                            <div>  return message.reply('Insufficient permissions!')</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Security:</strong> Never expose bot tokens, use least-privilege permissions
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🛠️ Popular Bot Development Libraries</h4>
                    
                    <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-300/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="space-y-3">
                          <h6 className="font-semibold text-indigo-600 dark:text-indigo-400">🟨 JavaScript/Node.js</h6>
                          <div className="text-sm space-y-2">
                            <p><strong>discord.js:</strong> Most popular, feature-rich library</p>
                            <p><strong>Eris:</strong> Lightweight, performance-focused</p>
                            <p><strong>discord.io:</strong> Simple, beginner-friendly</p>
                          </div>
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded text-sm">
                            <strong>Best For:</strong> Rapid development, large community, extensive documentation
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h6 className="font-semibold text-blue-600 dark:text-blue-400">🐍 Python</h6>
                          <div className="text-sm space-y-2">
                            <p><strong>discord.py:</strong> Pythonic, async/await support</p>
                            <p><strong>hikari:</strong> Modern, type-safe approach</p>
                            <p><strong>nextcord:</strong> Community fork with active development</p>
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded text-sm">
                            <strong>Best For:</strong> Data science integration, ML features, clean syntax
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🤖</span>
                      Discord Bot Basics Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Understand bot architecture: Gateway, REST API, &amp; permissions</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Learn about Discord's event system &amp; real-time messaging</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Understand rate limiting &amp; best practices for API usage</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Choose appropriate development library (discord.js, discord.py, etc.)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Plan bot security: token management &amp; permission strategy</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Design bot functionality &amp; user interaction flows</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-2',
              title: 'Bot Setup',
              description: 'Create and configure your Discord bot',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Bot Setup (Your Digital Workshop! 🔧🚀)</h3>
                    <p className="text-lg opacity-90">
                      Think of bot setup like opening a new business - you need the right permits, tools, and workspace before you can serve customers. 
                      Creating a Discord bot involves getting permissions from Discord, setting up your development environment, and configuring 
                      your bot's identity and capabilities. This foundation determines everything your bot can do!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-lg border border-blue-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Bot Setup Essentials
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>🏗️ Discord Application:</strong> Official registration with Discord</p>
                        <p><strong>🔑 Bot Token:</strong> Authentication credentials for your bot</p>
                        <p><strong>🛡️ Permissions:</strong> Define what your bot can &amp; cannot do</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>💻 Development Environment:</strong> Code editor, Node.js/Python setup</p>
                        <p><strong>📦 Dependencies:</strong> Discord libraries and helpful packages</p>
                        <p><strong>🚀 Hosting:</strong> Where your bot will run 24/7</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🏗️ Step-by-Step Bot Creation</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          1️⃣ Create Discord Application
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Register your bot with Discord to get official permissions and credentials.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Step 1: Go to Discord Developer Portal</div>
                            <div>URL: https://discord.com/developers/applications</div>
                            <div></div>
                            <div># Step 2: Create New Application</div>
                            <div>1. Click "New Application"</div>
                            <div>2. Enter bot name (e.g., "MyAwesomeBot")</div>
                            <div>3. Accept Terms of Service</div>
                            <div>4. Click "Create"</div>
                            <div></div>
                            <div># Step 3: Configure Application</div>
                            <div>- Add description &amp; icon</div>
                            <div>- Set public bot (if others can invite)</div>
                            <div>- Configure OAuth2 settings</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Result:</strong> Official Discord application with unique Application ID
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          2️⃣ Create Bot User &amp; Get Token
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Generate the bot user and obtain the secret token for authentication.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Navigate to Bot section</div>
                            <div>1. Click "Bot" in left sidebar</div>
                            <div>2. Click "Add Bot"</div>
                            <div>3. Confirm "Yes, do it!"</div>
                            <div></div>
                            <div># Configure Bot Settings</div>
                            <div>✅ Username: MyAwesomeBot</div>
                            <div>✅ Public Bot: ON (others can invite)</div>
                            <div>✅ Require OAuth2 Code Grant: OFF</div>
                            <div>✅ Presence Intent: ON</div>
                            <div>✅ Server Members Intent: ON</div>
                            <div>✅ Message Content Intent: ON</div>
                            <div></div>
                            <div># Copy Bot Token (KEEP SECRET!)</div>
                            <div>Token: "MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FMQ.ZnCjm1XVW7vRze4b7Cq4se7kKWs"</div>
                            <div>⚠️  Never share this token publicly!</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Security:</strong> Store token in environment variables, never commit to code
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          3️⃣ Set Bot Permissions
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Configure what your bot can do in Discord servers.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Essential Permissions Checklist</div>
                            <div>✅ View Channels</div>
                            <div>✅ Send Messages</div>
                            <div>✅ Send Messages in Threads</div>
                            <div>✅ Embed Links</div>
                            <div>✅ Attach Files</div>
                            <div>✅ Read Message History</div>
                            <div>✅ Add Reactions</div>
                            <div></div>
                            <div># Moderation Permissions (if needed)</div>
                            <div>□ Manage Messages (delete/pin)</div>
                            <div>□ Kick Members</div>
                            <div>□ Ban Members</div>
                            <div>□ Manage Roles</div>
                            <div>□ Manage Channels</div>
                            <div></div>
                            <div># Admin Permissions (use carefully!)</div>
                            <div>□ Administrator (gives ALL permissions)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Best Practice:</strong> Only grant permissions your bot actually needs
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          4️⃣ Generate Invite Link
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Create a link that server owners can use to add your bot.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Go to OAuth2 → URL Generator</div>
                            <div>1. Select "bot" scope</div>
                            <div>2. Select required permissions</div>
                            <div>3. Copy generated URL</div>
                            <div></div>
                            <div># Example invite URL</div>
                            <div>https://discord.com/api/oauth2/authorize</div>
                            <div>?client_id=123456789012345678</div>
                            <div>&amp;permissions=274877906944</div>
                            <div>&amp;scope=bot</div>
                            <div></div>
                            <div># Share this URL with server owners</div>
                            <div>- They click the link</div>
                            <div>- Select their server</div>
                            <div>- Authorize permissions</div>
                            <div>- Bot joins their server!</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Note:</strong> Users need "Manage Server" permission to add bots
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">💻 Development Environment Setup</h4>
                    
                    <div className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 p-6 rounded-lg border border-gray-300/30">
                      <h5 className="font-semibold mb-3">🛠️ Essential Tools &amp; Setup:</h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h6 className="font-semibold text-blue-600 dark:text-blue-400">🟨 JavaScript/Node.js Setup</h6>
                          <div className="bg-gray-900 p-3 rounded text-sm text-blue-400 font-mono">
                            <div className="space-y-1">
                              <div># Install Node.js (v16+)</div>
                              <div>npm init -y</div>
                              <div>npm install discord.js</div>
                              <div>npm install dotenv</div>
                              <div></div>
                              <div># Create .env file</div>
                              <div>DISCORD_TOKEN=your_bot_token_here</div>
                              <div>CLIENT_ID=your_client_id_here</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h6 className="font-semibold text-green-600 dark:text-green-400">🐍 Python Setup</h6>
                          <div className="bg-gray-900 p-3 rounded text-sm text-green-400 font-mono">
                            <div className="space-y-1">
                              <div># Install Python (3.8+)</div>
                              <div>pip install discord.py</div>
                              <div>pip install python-dotenv</div>
                              <div></div>
                              <div># Create .env file</div>
                              <div>DISCORD_TOKEN=your_bot_token_here</div>
                              <div>CLIENT_ID=your_client_id_here</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-300/30">
                    <h4 className="text-xl font-semibold mb-3">🔒 Security Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🔑 Token Security:</strong> Never share or commit bot tokens to code repositories</p>
                        <p><strong>📁 Environment Variables:</strong> Use .env files for sensitive configuration</p>
                        <p><strong>🛡️ Minimal Permissions:</strong> Only grant permissions your bot actually needs</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🔄 Token Rotation:</strong> Regenerate tokens if compromised</p>
                        <p><strong>👥 Access Control:</strong> Limit who has access to bot credentials</p>
                        <p><strong>📊 Monitoring:</strong> Track bot usage and watch for suspicious activity</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🔧</span>
                      Bot Setup Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create Discord Application in Developer Portal</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Generate bot user &amp; copy bot token securely</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Configure bot permissions &amp; intents appropriately</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Generate invite link with correct permissions</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up development environment (Node.js/Python)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Install Discord library &amp; configure environment variables</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test basic bot connection &amp; invite to test server</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Slash Commands (Your Bot's Voice! ⚡🎯)</h3>
                    <p className="text-lg opacity-90">
                      Think of slash commands like a restaurant menu - they give users a clear, organized way to order exactly what they want. 
                      Instead of typing random messages and hoping your bot understands, slash commands provide a structured interface with 
                      autocomplete, validation, and clear options. They're the modern, professional way to interact with Discord bots!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Slash Commands Are Superior
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>📝 Auto-complete:</strong> Users see available options as they type</p>
                        <p><strong>✅ Validation:</strong> Discord validates input before sending</p>
                        <p><strong>🎛️ Rich Options:</strong> Support for different input types</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🔒 Permissions:</strong> Built-in permission control per command</p>
                        <p><strong>🌐 Global/Guild:</strong> Commands can be server-specific or global</p>
                        <p><strong>📱 Mobile Friendly:</strong> Consistent experience across all platforms</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🏗️ Slash Command Anatomy</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          📋 Command Structure &amp; Components
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Every slash command has a name, description, and optional parameters with validation.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Basic command structure</div>
                            <div>/commandname parameter1 parameter2</div>
                            <div></div>
                            <div># Example commands</div>
                            <div>/ping                          → Simple command</div>
                            <div>/weather city:london          → Command with required parameter</div>
                            <div>/ban user:@baduser reason:spam → Multiple parameters</div>
                            <div>/poll question:"Best pizza?" options:"Pepperoni,Cheese,Supreme"</div>
                            <div></div>
                            <div># Command definition example</div>
                            <div>Command: {`{`}</div>
                            <div>  name: "weather",</div>
                            <div>  description: "Get weather for a city",</div>
                            <div>  options: [{`{`}</div>
                            <div>    name: "city",</div>
                            <div>    description: "City name",</div>
                            <div>    type: STRING,</div>
                            <div>    required: true</div>
                            <div>  {`}`}]</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Key Features:</strong> Name, description, parameters with types &amp; validation
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          🎛️ Parameter Types &amp; Options
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Discord supports various input types with built-in validation and user-friendly pickers.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Available parameter types</div>
                            <div>STRING      → Text input (most common)</div>
                            <div>INTEGER     → Whole numbers</div>
                            <div>BOOLEAN     → True/false toggle</div>
                            <div>USER        → User picker with autocomplete</div>
                            <div>CHANNEL     → Channel picker</div>
                            <div>ROLE        → Role picker</div>
                            <div>MENTIONABLE → User/role picker</div>
                            <div>NUMBER      → Decimal numbers</div>
                            <div>ATTACHMENT  → File upload</div>
                            <div></div>
                            <div># Parameter options</div>
                            <div>required: true/false    → Must be provided</div>
                            <div>choices: [...]          → Predefined options</div>
                            <div>min_value/max_value     → Numeric limits</div>
                            <div>min_length/max_length   → String length limits</div>
                            <div>autocomplete: true      → Dynamic suggestions</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Benefits:</strong> Type safety, input validation, user-friendly pickers
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          💻 Command Registration (JavaScript)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Register slash commands with Discord's API during bot startup.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div>// Command definition</div>
                            <div>const commands = [{`{`}</div>
                            <div>  name: 'ping',</div>
                            <div>  description: 'Replies with Pong!'</div>
                            <div>{`}`}, {`{`}</div>
                            <div>  name: 'user',</div>
                            <div>  description: 'Get user info',</div>
                            <div>  options: [{`{`}</div>
                            <div>    name: 'target',</div>
                            <div>    description: 'User to get info about',</div>
                            <div>    type: ApplicationCommandOptionType.User,</div>
                            <div>    required: true</div>
                            <div>  {`}`}]</div>
                            <div>{`}`}]</div>
                            <div></div>
                            <div>// Register commands</div>
                            <div>const rest = new REST().setToken(token)</div>
                            <div>await rest.put(</div>
                            <div>  Routes.applicationCommands(clientId),</div>
                            <div>  {`{ body: commands }`}</div>
                            <div>)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Registration:</strong> Commands appear in Discord within 1 hour globally
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          ⚡ Command Handling &amp; Responses
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Handle command interactions and send appropriate responses to users.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div>// Handle slash command interactions</div>
                            <div>client.on('interactionCreate', async interaction =&gt; {`{`}</div>
                            <div>  if (!interaction.isChatInputCommand()) return</div>
                            <div></div>
                            <div>  if (interaction.commandName === 'ping') {`{`}</div>
                            <div>    await interaction.reply('Pong! 🏓')</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  if (interaction.commandName === 'user') {`{`}</div>
                            <div>    const target = interaction.options.getUser('target')</div>
                            <div>    await interaction.reply(</div>
                            <div>      'User: ' + target.tag + ', ID: ' + target.id</div>
                            <div>    )</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div>// Response types</div>
                            <div>interaction.reply()           → Public response</div>
                            <div>interaction.reply({`{ ephemeral: true }`}) → Private response</div>
                            <div>interaction.deferReply()     → "Bot is thinking..."</div>
                            <div>interaction.editReply()     → Update deferred response</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Response Types:</strong> Immediate, deferred, ephemeral (private), embeds
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎮 Advanced Command Features</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/30">
                        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center">
                          🔄 Subcommands &amp; Groups
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Organize related commands into groups for better user experience.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-indigo-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Subcommand structure</div>
                            <div>/music play song:despacito</div>
                            <div>/music pause</div>
                            <div>/music queue</div>
                            <div>/music volume level:50</div>
                            <div></div>
                            <div># Subcommand group structure</div>
                            <div>/settings user timezone:EST</div>
                            <div>/settings user language:en</div>
                            <div>/settings server prefix:!</div>
                            <div>/settings server autorole:@member</div>
                            <div></div>
                            <div># Command definition with subcommands</div>
                            <div>name: "music",</div>
                            <div>description: "Music player commands",</div>
                            <div>options: [{`{`}</div>
                            <div>  name: "play",</div>
                            <div>  description: "Play a song",</div>
                            <div>  type: ApplicationCommandOptionType.Subcommand</div>
                            <div>{`}`}]</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-300/30">
                        <h5 className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center">
                          🎯 Autocomplete &amp; Dynamic Options
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Provide dynamic suggestions based on user input for enhanced UX.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-teal-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div>// Autocomplete handler</div>
                            <div>client.on('interactionCreate', async interaction =&gt; {`{`}</div>
                            <div>  if (interaction.isAutocomplete()) {`{`}</div>
                            <div>    const focusedValue = interaction.options.getFocused()</div>
                            <div>    </div>
                            <div>    // Filter suggestions based on user input</div>
                            <div>    const choices = songs.filter(song =&gt;</div>
                            <div>      song.name.toLowerCase().includes(focusedValue.toLowerCase())</div>
                            <div>    ).slice(0, 25) // Max 25 suggestions</div>
                            <div></div>
                            <div>    await interaction.respond(</div>
                            <div>      choices.map(song =&gt; ({`{ name: song.name, value: song.id }`}))</div>
                            <div>    )</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-lg border border-orange-300/30">
                    <h4 className="text-xl font-semibold mb-3">🛠️ Best Practices for Slash Commands</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>📝 Clear Naming:</strong> Use descriptive, intuitive command names</p>
                        <p><strong>📖 Good Descriptions:</strong> Explain what each command does clearly</p>
                        <p><strong>🎛️ Logical Parameters:</strong> Order from required to optional</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>⚡ Fast Responses:</strong> Acknowledge commands within 3 seconds</p>
                        <p><strong>🔒 Permission Checks:</strong> Validate user permissions before execution</p>
                        <p><strong>❌ Error Handling:</strong> Provide helpful error messages</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">⚡</span>
                      Slash Commands Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Design command structure with clear names &amp; descriptions</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Define parameters with appropriate types &amp; validation</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Register commands with Discord API (global or guild-specific)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement command handlers with proper error handling</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Add autocomplete for dynamic options where beneficial</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test commands thoroughly with various input scenarios</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement permission checks &amp; user-friendly responses</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-4',
              title: 'Event Handling',
              description: 'Handle Discord events and interactions',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Event Handling (Your Bot's Nervous System! 🧠⚡)</h3>
                    <p className="text-lg opacity-90">
                      Think of event handling like a security guard monitoring multiple cameras - your bot watches for specific activities 
                      and reacts instantly when something important happens. Every message, member join, reaction, or voice channel change 
                      triggers an event. Smart event handling is what makes your bot feel alive and responsive to your community!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 rounded-lg border border-cyan-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Event Handling Is Crucial
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>⚡ Real-time Response:</strong> React instantly to server activity</p>
                        <p><strong>🎯 Targeted Actions:</strong> Respond only to relevant events</p>
                        <p><strong>📊 Data Collection:</strong> Track user behavior and server statistics</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🛡️ Automated Moderation:</strong> Instant response to rule violations</p>
                        <p><strong>🎉 User Experience:</strong> Welcome messages, role assignments</p>
                        <p><strong>🔄 Workflow Triggers:</strong> Start complex processes from simple events</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎭 Core Discord Events</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          💬 Message Events (Most Common)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Listen to message activity for commands, moderation, and chat features.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Message event types</div>
                            <div>messageCreate    → New message posted</div>
                            <div>messageUpdate    → Message edited</div>
                            <div>messageDelete    → Message deleted</div>
                            <div>messageReactionAdd → Reaction added to message</div>
                            <div>messageReactionRemove → Reaction removed</div>
                            <div></div>
                            <div># Basic message event handler</div>
                            <div>client.on('messageCreate', async message =&gt; {`{`}</div>
                            <div>  // Ignore bot messages</div>
                            <div>  if (message.author.bot) return</div>
                            <div></div>
                            <div>  // Auto-moderation example</div>
                            <div>  if (message.content.includes('spam')) {`{`}</div>
                            <div>    await message.delete()</div>
                            <div>    await message.author.send('Please avoid spam!')</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Command detection</div>
                            <div>  if (message.content.startsWith('!ping')) {`{`}</div>
                            <div>    await message.reply('Pong! 🏓')</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Use Cases:</strong> Chat commands, auto-moderation, keyword responses
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          👥 Member Events (Server Management)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Handle user joining, leaving, and role changes for community management.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Member event types</div>
                            <div>guildMemberAdd    → User joins server</div>
                            <div>guildMemberRemove → User leaves/kicked/banned</div>
                            <div>guildMemberUpdate → Role/nickname changes</div>
                            <div>userUpdate       → User profile changes</div>
                            <div></div>
                            <div># Welcome new members</div>
                            <div>client.on('guildMemberAdd', async member =&gt; {`{`}</div>
                            <div>  const welcomeChannel = member.guild.channels.cache</div>
                            <div>    .find(ch =&gt; ch.name === 'welcome')</div>
                            <div></div>
                            <div>  if (welcomeChannel) {`{`}</div>
                            <div>    await welcomeChannel.send(</div>
                            <div>      'Welcome ' + member.user.tag + ' to ' + member.guild.name + '! 🎉'</div>
                            <div>    )</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Auto-assign roles</div>
                            <div>  const memberRole = member.guild.roles.cache</div>
                            <div>    .find(role =&gt; role.name === 'Member')</div>
                            <div>  if (memberRole) {`{`}</div>
                            <div>    await member.roles.add(memberRole)</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Use Cases:</strong> Welcome messages, auto-roles, departure notifications
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          🎵 Voice Events &amp; Activity
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Monitor voice channel activity for music bots and community engagement.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Voice event types</div>
                            <div>voiceStateUpdate → User joins/leaves/mutes in voice</div>
                            <div>presenceUpdate  → User status/activity changes</div>
                            <div></div>
                            <div># Voice channel monitoring</div>
                            <div>client.on('voiceStateUpdate', async (oldState, newState) =&gt; {`{`}</div>
                            <div>  const member = newState.member</div>
                            <div></div>
                            <div>  // User joined voice channel</div>
                            <div>  if (!oldState.channel &amp;&amp; newState.channel) {`{`}</div>
                            <div>    console.log(member.user.tag + ' joined ' + newState.channel.name)</div>
                            <div>    </div>
                            <div>    // Auto-assign voice role</div>
                            <div>    const voiceRole = member.guild.roles.cache</div>
                            <div>      .find(role =&gt; role.name === 'In Voice')</div>
                            <div>    if (voiceRole) await member.roles.add(voiceRole)</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // User left voice channel</div>
                            <div>  if (oldState.channel &amp;&amp; !newState.channel) {`{`}</div>
                            <div>    console.log(member.user.tag + ' left voice')</div>
                            <div>    </div>
                            <div>    // Remove voice role</div>
                            <div>    const voiceRole = member.guild.roles.cache</div>
                            <div>      .find(role =&gt; role.name === 'In Voice')</div>
                            <div>    if (voiceRole) await member.roles.remove(voiceRole)</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Use Cases:</strong> Music bot controls, voice activity roles, AFK detection
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          ⚛️ Interaction Events (Modern Discord)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Handle slash commands, buttons, menus, and modals for rich user interactions.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Interaction event types</div>
                            <div>interactionCreate → All interactions (slash, buttons, etc.)</div>
                            <div></div>
                            <div># Universal interaction handler</div>
                            <div>client.on('interactionCreate', async interaction =&gt; {`{`}</div>
                            <div>  // Slash commands</div>
                            <div>  if (interaction.isChatInputCommand()) {`{`}</div>
                            <div>    const {`{ commandName }`} = interaction</div>
                            <div>    </div>
                            <div>    if (commandName === 'poll') {`{`}</div>
                            <div>      // Handle poll slash command</div>
                            <div>      await handlePollCommand(interaction)</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Button interactions</div>
                            <div>  if (interaction.isButton()) {`{`}</div>
                            <div>    const {`{ customId }`} = interaction</div>
                            <div>    </div>
                            <div>    if (customId.startsWith('vote_')) {`{`}</div>
                            <div>      // Handle poll vote buttons</div>
                            <div>      await handleVoteButton(interaction)</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Select menu interactions</div>
                            <div>  if (interaction.isStringSelectMenu()) {`{`}</div>
                            <div>    await handleSelectMenu(interaction)</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Use Cases:</strong> Slash commands, interactive menus, confirmation dialogs
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🔧 Event Handling Best Practices</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/30">
                        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center">
                          ⚡ Performance &amp; Efficiency
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-indigo-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Performance tips</div>
                            <div></div>
                            <div>// ✅ Good: Early returns to avoid processing</div>
                            <div>client.on('messageCreate', async message =&gt; {`{`}</div>
                            <div>  if (message.author.bot) return // Skip bot messages</div>
                            <div>  if (!message.content.startsWith('!')) return // Skip non-commands</div>
                            <div>  </div>
                            <div>  // Process command...</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div>// ✅ Good: Async/await for non-blocking operations</div>
                            <div>client.on('guildMemberAdd', async member =&gt; {`{`}</div>
                            <div>  try {`{`}</div>
                            <div>    await sendWelcomeMessage(member)</div>
                            <div>    await assignDefaultRole(member)</div>
                            <div>  {`}`} catch (error) {`{`}</div>
                            <div>    console.error('Welcome process failed:', error)</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div>// ❌ Avoid: Blocking operations in event handlers</div>
                            <div>// Don't use sleep() or synchronous file operations</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-300/30">
                        <h5 className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center">
                          🛡️ Error Handling &amp; Resilience
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-teal-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Robust error handling</div>
                            <div></div>
                            <div>client.on('messageCreate', async message =&gt; {`{`}</div>
                            <div>  try {`{`}</div>
                            <div>    // Your event logic here</div>
                            <div>    await processMessage(message)</div>
                            <div>  {`}`} catch (error) {`{`}</div>
                            <div>    console.error('Message processing error:', error)</div>
                            <div>    </div>
                            <div>    // Don't crash the bot, log &amp; continue</div>
                            <div>    await logError(error, {`{ event: 'messageCreate', messageId: message.id }`})</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div># Rate limit handling</div>
                            <div>const rateLimiter = new Map()</div>
                            <div></div>
                            <div>client.on('messageCreate', async message =&gt; {`{`}</div>
                            <div>  const userId = message.author.id</div>
                            <div>  const now = Date.now()</div>
                            <div>  </div>
                            <div>  // Check rate limit (max 5 commands per minute)</div>
                            <div>  const userLimits = rateLimiter.get(userId) || []</div>
                            <div>  const recentCommands = userLimits.filter(time =&gt; now - time &lt; 60000)</div>
                            <div>  </div>
                            <div>  if (recentCommands.length &gt;= 5) {`{`}</div>
                            <div>    await message.reply('⏱️ Please slow down! Try again in a minute.')</div>
                            <div>    return</div>
                            <div>  {`}`}</div>
                            <div>  </div>
                            <div>  rateLimiter.set(userId, [...recentCommands, now])</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 p-6 rounded-lg border border-pink-300/30">
                    <h4 className="text-xl font-semibold mb-3">🎯 Event Handler Organization</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>📁 Separate Files:</strong> One file per event type for large bots</p>
                        <p><strong>🏷️ Clear Naming:</strong> Descriptive function names (handleWelcome, processCommand)</p>
                        <p><strong>⚡ Modular Design:</strong> Reusable functions for common operations</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📊 Logging:</strong> Track event frequency and performance</p>
                        <p><strong>🔧 Configuration:</strong> Use settings for feature toggles</p>
                        <p><strong>🧪 Testing:</strong> Test event handlers with mock data</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🧠</span>
                      Event Handling Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up core event listeners (message, member, interaction)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement error handling &amp; try-catch blocks</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Add rate limiting to prevent spam &amp; abuse</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create modular functions for reusable event logic</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test event handlers with various scenarios</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Add logging for debugging &amp; monitoring</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Optimize performance with early returns &amp; efficient code</span>
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
          description: 'Advanced bot features',
          steps: [
            {
              id: 'discord-step-5',
              title: 'Moderation Features',
              description: 'Implement moderation and admin tools',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Moderation Features (Your Digital Sheriff! 🛡️⚖️)</h3>
                    <p className="text-lg opacity-90">
                      Think of moderation features like a smart security system for your community - they automatically enforce rules, 
                      protect members from harmful content, and maintain order while you sleep. A well-designed moderation bot acts as 
                      your 24/7 digital assistant sheriff, handling routine enforcement so human moderators can focus on complex situations 
                      that require judgment and empathy.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Automated Moderation Is Essential
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>⚡ Instant Response:</strong> Catch violations in milliseconds</p>
                        <p><strong>🕰️ 24/7 Coverage:</strong> Never sleep, always vigilant</p>
                        <p><strong>⚖️ Consistent Rules:</strong> Apply policies fairly to everyone</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📊 Data Tracking:</strong> Log incidents for pattern analysis</p>
                        <p><strong>🎯 Precision Targeting:</strong> Configurable rules &amp; thresholds</p>
                        <p><strong>💪 Scale Support:</strong> Handle large communities efficiently</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🛡️ Core Moderation Systems</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          🔍 Auto-Moderation (Content Filtering)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Automatically detect and handle inappropriate content before it causes harm.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Content filtering system</div>
                            <div>const badWords = ['spam', 'scam', 'hack']</div>
                            <div>const linkRegex = /(https?:\\/\\/[^\\s]+)/g</div>
                            <div>const mentionSpamLimit = 5</div>
                            <div></div>
                            <div>client.on('messageCreate', async message =&gt; {`{`}</div>
                            <div>  if (message.author.bot) return</div>
                            <div></div>
                            <div>  const content = message.content.toLowerCase()</div>
                            <div>  const member = message.member</div>
                            <div></div>
                            <div>  // Check for banned words</div>
                            <div>  if (badWords.some(word =&gt; content.includes(word))) {`{`}</div>
                            <div>    await message.delete()</div>
                            <div>    await message.channel.send(</div>
                            <div>      message.author + ', please keep chat appropriate! ⚠️'</div>
                            <div>    )</div>
                            <div>    await logModAction('Word Filter', member, 'Inappropriate language')</div>
                            <div>    return</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Check for link spam (non-mods only)</div>
                            <div>  if (!member.permissions.has('MANAGE_MESSAGES')) {`{`}</div>
                            <div>    const links = content.match(linkRegex)</div>
                            <div>    if (links &amp;&amp; links.length &gt; 2) {`{`}</div>
                            <div>      await message.delete()</div>
                            <div>      await warnUser(member, 'Link spam detected')</div>
                            <div>      return</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Check for mention spam</div>
                            <div>  if (message.mentions.users.size &gt; mentionSpamLimit) {`{`}</div>
                            <div>    await message.delete()</div>
                            <div>    await timeoutUser(member, 5 * 60 * 1000, 'Mention spam')</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Features:</strong> Word filtering, link control, mention spam protection
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          ⚖️ Warning &amp; Strike System
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Progressive discipline system that escalates consequences based on violation history.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Warning system with escalation</div>
                            <div>async function warnUser(member, reason) {`{`}</div>
                            <div>  const userId = member.id</div>
                            <div>  const guildId = member.guild.id</div>
                            <div></div>
                            <div>  // Get current warning count</div>
                            <div>  const warnings = await getWarnings(userId, guildId)</div>
                            <div>  const newWarningCount = warnings.length + 1</div>
                            <div></div>
                            <div>  // Add new warning to database</div>
                            <div>  await addWarning({`{`}</div>
                            <div>    userId,</div>
                            <div>    guildId,</div>
                            <div>    reason,</div>
                            <div>    moderatorId: 'bot',</div>
                            <div>    timestamp: new Date()</div>
                            <div>  {`}`})</div>
                            <div></div>
                            <div>  // Escalate based on warning count</div>
                            <div>  switch (newWarningCount) {`{`}</div>
                            <div>    case 1:</div>
                            <div>      await member.send('⚠️ Warning 1/3: ' + reason)</div>
                            <div>      break</div>
                            <div>    case 2:</div>
                            <div>      await member.send('⚠️ Warning 2/3: ' + reason)</div>
                            <div>      await timeoutUser(member, 10 * 60 * 1000, 'Second warning')</div>
                            <div>      break</div>
                            <div>    case 3:</div>
                            <div>      await member.send('🚫 Final warning: ' + reason)</div>
                            <div>      await timeoutUser(member, 60 * 60 * 1000, 'Final warning')</div>
                            <div>      break</div>
                            <div>    default:</div>
                            <div>      await member.kick('Exceeded warning limit')</div>
                            <div>      break</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  await logModAction('Warning', member, reason, newWarningCount)</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Features:</strong> Progressive discipline, warning tracking, automatic escalation
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          🔨 Moderation Commands
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Slash commands for moderators to take manual action when needed.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Moderation slash commands</div>
                            <div>const moderationCommands = [{`{`}</div>
                            <div>  name: 'ban',</div>
                            <div>  description: 'Ban a user from the server',</div>
                            <div>  options: [{`{`}</div>
                            <div>    name: 'user',</div>
                            <div>    description: 'User to ban',</div>
                            <div>    type: ApplicationCommandOptionType.User,</div>
                            <div>    required: true</div>
                            <div>  {`}`}, {`{`}</div>
                            <div>    name: 'reason',</div>
                            <div>    description: 'Reason for ban',</div>
                            <div>    type: ApplicationCommandOptionType.String</div>
                            <div>  {`}`}]</div>
                            <div>{`}`}, {`{`}</div>
                            <div>  name: 'timeout',</div>
                            <div>  description: 'Timeout a user',</div>
                            <div>  options: [{`{`}</div>
                            <div>    name: 'user',</div>
                            <div>    type: ApplicationCommandOptionType.User,</div>
                            <div>    required: true</div>
                            <div>  {`}`}, {`{`}</div>
                            <div>    name: 'duration',</div>
                            <div>    description: 'Timeout duration in minutes',</div>
                            <div>    type: ApplicationCommandOptionType.Integer,</div>
                            <div>    required: true,</div>
                            <div>    choices: [</div>
                            <div>      {`{ name: '5 minutes', value: 5 }`},</div>
                            <div>      {`{ name: '30 minutes', value: 30 }`},</div>
                            <div>      {`{ name: '1 hour', value: 60 }`},</div>
                            <div>      {`{ name: '24 hours', value: 1440 }`}</div>
                            <div>    ]</div>
                            <div>  {`}`}]</div>
                            <div>{`}`}]</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Commands:</strong> /ban, /kick, /timeout, /warn, /clear, /lockdown
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🔐 Permission &amp; Role Management
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Automatically assign roles and manage permissions based on user behavior.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Auto-role system</div>
                            <div>client.on('guildMemberAdd', async member =&gt; {`{`}</div>
                            <div>  try {`{`}</div>
                            <div>    // Basic member role</div>
                            <div>    const memberRole = member.guild.roles.cache</div>
                            <div>      .find(role =&gt; role.name === 'Member')</div>
                            <div>    if (memberRole) {`{`}</div>
                            <div>      await member.roles.add(memberRole)</div>
                            <div>    {`}`}</div>
                            <div></div>
                            <div>    // Account age verification (prevent raids)</div>
                            <div>    const accountAge = Date.now() - member.user.createdTimestamp</div>
                            <div>    const sevenDays = 7 * 24 * 60 * 60 * 1000</div>
                            <div></div>
                            <div>    if (accountAge &lt; sevenDays) {`{`}</div>
                            <div>      const newAccountRole = member.guild.roles.cache</div>
                            <div>        .find(role =&gt; role.name === 'New Account')</div>
                            <div>      if (newAccountRole) {`{`}</div>
                            <div>        await member.roles.add(newAccountRole)</div>
                            <div>      {`}`}</div>
                            <div>      </div>
                            <div>      // Alert moderators about new account</div>
                            <div>      const modChannel = member.guild.channels.cache</div>
                            <div>        .find(ch =&gt; ch.name === 'mod-alerts')</div>
                            <div>      if (modChannel) {`{`}</div>
                            <div>        await modChannel.send(</div>
                            <div>          '🚨 New account joined: ' + member.user.tag + ' ' +</div>
                            <div>          '(Created: ' + new Date(member.user.createdTimestamp).toDateString() + ')'</div>
                            <div>        )</div>
                            <div>      {`}`}</div>
                            <div>    {`}`}</div>
                            <div>  {`}`} catch (error) {`{`}</div>
                            <div>    console.error('Auto-role error:', error)</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Features:</strong> Auto-roles, account age checks, raid protection
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">📊 Advanced Moderation Features</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/30">
                        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center">
                          🚨 Raid &amp; Spam Protection
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-indigo-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Anti-raid system</div>
                            <div>const joinTracker = new Map()</div>
                            <div>const RAID_THRESHOLD = 10 // joins per minute</div>
                            <div></div>
                            <div>client.on('guildMemberAdd', async member =&gt; {`{`}</div>
                            <div>  const now = Date.now()</div>
                            <div>  const guildId = member.guild.id</div>
                            <div></div>
                            <div>  // Track recent joins</div>
                            <div>  const recentJoins = joinTracker.get(guildId) || []</div>
                            <div>  const filteredJoins = recentJoins.filter(time =&gt; now - time &lt; 60000)</div>
                            <div>  filteredJoins.push(now)</div>
                            <div>  joinTracker.set(guildId, filteredJoins)</div>
                            <div></div>
                            <div>  // Check for raid</div>
                            <div>  if (filteredJoins.length &gt;= RAID_THRESHOLD) {`{`}</div>
                            <div>    await activateRaidMode(member.guild)</div>
                            <div>    await alertModerators(member.guild, 'Possible raid detected!')</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div>async function activateRaidMode(guild) {`{`}</div>
                            <div>  // Increase verification level</div>
                            <div>  await guild.setVerificationLevel('HIGH')</div>
                            <div>  // Lock down channels temporarily</div>
                            <div>  // Notify moderators</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-300/30">
                        <h5 className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center">
                          📋 Moderation Logging &amp; Analytics
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-teal-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Comprehensive mod logging</div>
                            <div>async function logModAction(action, target, reason, extra = '') {`{`}</div>
                            <div>  const logChannel = target.guild.channels.cache</div>
                            <div>    .find(ch =&gt; ch.name === 'mod-log')</div>
                            <div></div>
                            <div>  if (!logChannel) return</div>
                            <div></div>
                            <div>  const embed = new EmbedBuilder()</div>
                            <div>    .setTitle('🛡️ Moderation Action: ' + action)</div>
                            <div>    .setColor(getActionColor(action))</div>
                            <div>    .addFields(</div>
                            <div>      {`{ name: 'Target', value: 'username (user_id)', inline: true }`},</div>
                            <div>      {`{ name: 'Reason', value: reason || 'No reason provided', inline: true }`},</div>
                            <div>      {`{ name: 'Timestamp', value: 'ISO_timestamp', inline: true }`}</div>
                            <div>    )</div>
                            <div>    .setTimestamp()</div>
                            <div></div>
                            <div>  if (extra) embed.addFields({`{ name: 'Additional Info', value: extra }`})</div>
                            <div></div>
                            <div>  await logChannel.send({`{ embeds: [embed] }`})</div>
                            <div>  </div>
                            <div>  // Also save to database for analytics</div>
                            <div>  await saveModerationAction({`{`}</div>
                            <div>    action,</div>
                            <div>    targetId: target.id,</div>
                            <div>    guildId: target.guild.id,</div>
                            <div>    reason,</div>
                            <div>    timestamp: new Date()</div>
                            <div>  {`}`})</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-lg border border-orange-300/30">
                    <h4 className="text-xl font-semibold mb-3">🎯 Moderation Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>📋 Clear Rules:</strong> Document all automated actions &amp; thresholds</p>
                        <p><strong>👥 Human Oversight:</strong> Always allow moderator appeals &amp; overrides</p>
                        <p><strong>📊 Regular Review:</strong> Analyze logs to adjust automation rules</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>⚖️ Proportional Response:</strong> Match punishment severity to violation</p>
                        <p><strong>📝 Transparency:</strong> Log all actions for accountability</p>
                        <p><strong>🔄 Continuous Improvement:</strong> Update filters based on new threats</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🛡️</span>
                      Moderation Features Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up auto-moderation for inappropriate content &amp; spam</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement progressive warning system with escalation</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Create moderation slash commands for manual actions</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Add auto-role assignment &amp; permission management</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement raid protection &amp; suspicious activity detection</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up comprehensive moderation logging &amp; analytics</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test all moderation features in controlled environment</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-6',
              title: 'Database Integration',
              description: 'Connect bot to database for persistence',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Database Integration (Your Bot's Memory Bank! 🧠💾)</h3>
                    <p className="text-lg opacity-90">
                      Think of database integration like giving your bot a permanent memory - instead of forgetting everything when it restarts, 
                      it can remember user preferences, track statistics, store custom settings, and maintain persistent data across sessions. 
                      This transforms your bot from a simple responder into an intelligent system that learns and grows with your community!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-lg border border-green-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Database Integration Is Crucial
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>💾 Persistent Storage:</strong> Data survives bot restarts &amp; updates</p>
                        <p><strong>📊 Analytics &amp; Insights:</strong> Track user behavior &amp; server trends</p>
                        <p><strong>🎛️ Custom Settings:</strong> Per-server &amp; per-user configuration</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📈 Progress Tracking:</strong> XP systems, achievements, streaks</p>
                        <p><strong>🛡️ Moderation History:</strong> Warnings, bans, &amp; appeal records</p>
                        <p><strong>🔄 Complex Features:</strong> Economy, games, &amp; advanced automation</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🏗️ Database Architecture &amp; Setup</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          🐘 PostgreSQL Setup (Recommended)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Professional-grade database perfect for Discord bots with complex data needs.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Install PostgreSQL client</div>
                            <div>npm install pg</div>
                            <div>npm install @types/pg  # For TypeScript</div>
                            <div></div>
                            <div># Database connection setup</div>
                            <div>const {`{ Pool }`} = require('pg')</div>
                            <div></div>
                            <div>const pool = new Pool({`{`}</div>
                            <div>  user: process.env.DB_USER,</div>
                            <div>  host: process.env.DB_HOST,</div>
                            <div>  database: process.env.DB_NAME,</div>
                            <div>  password: process.env.DB_PASSWORD,</div>
                            <div>  port: process.env.DB_PORT || 5432,</div>
                            <div>  ssl: process.env.NODE_ENV === 'production' ? {`{ rejectUnauthorized: false }`} : false</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div># Test connection</div>
                            <div>pool.connect((err, client, release) =&gt; {`{`}</div>
                            <div>  if (err) {`{`}</div>
                            <div>    console.error('Database connection failed:', err.stack)</div>
                            <div>  {`}`} else {`{`}</div>
                            <div>    console.log('✅ Database connected successfully!')</div>
                            <div>    release()</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Best For:</strong> Large bots, complex queries, high performance requirements
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          📋 Essential Database Tables
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Core table structure for typical Discord bot functionality.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div>-- Core tables for Discord bot</div>
                            <div></div>
                            <div>-- Guilds (servers)</div>
                            <div>CREATE TABLE guilds (</div>
                            <div>  guild_id BIGINT PRIMARY KEY,</div>
                            <div>  name VARCHAR(100) NOT NULL,</div>
                            <div>  prefix VARCHAR(10) DEFAULT '!',</div>
                            <div>  welcome_channel BIGINT,</div>
                            <div>  mod_log_channel BIGINT,</div>
                            <div>  auto_mod_enabled BOOLEAN DEFAULT true,</div>
                            <div>  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                            <div>)</div>
                            <div></div>
                            <div>-- Users</div>
                            <div>CREATE TABLE users (</div>
                            <div>  user_id BIGINT PRIMARY KEY,</div>
                            <div>  username VARCHAR(32) NOT NULL,</div>
                            <div>  discriminator VARCHAR(4),</div>
                            <div>  avatar_url TEXT,</div>
                            <div>  experience INT DEFAULT 0,</div>
                            <div>  level INT DEFAULT 1,</div>
                            <div>  coins INT DEFAULT 0,</div>
                            <div>  last_daily TIMESTAMP,</div>
                            <div>  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                            <div>)</div>
                            <div></div>
                            <div>-- Warnings/Moderation</div>
                            <div>CREATE TABLE warnings (</div>
                            <div>  id SERIAL PRIMARY KEY,</div>
                            <div>  user_id BIGINT NOT NULL,</div>
                            <div>  guild_id BIGINT NOT NULL,</div>
                            <div>  moderator_id BIGINT NOT NULL,</div>
                            <div>  reason TEXT NOT NULL,</div>
                            <div>  active BOOLEAN DEFAULT true,</div>
                            <div>  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                            <div>)</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Tables:</strong> guilds, users, warnings, commands, economy, levels
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          ⚡ Database Helper Functions
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Reusable functions for common database operations in your bot.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># User management functions</div>
                            <div>class UserDatabase {`{`}</div>
                            <div>  // Get or create user</div>
                            <div>  static async getUser(userId) {`{`}</div>
                            <div>    const query = 'SELECT * FROM users WHERE user_id = $1'</div>
                            <div>    const result = await pool.query(query, [userId])</div>
                            <div>    </div>
                            <div>    if (result.rows.length === 0) {`{`}</div>
                            <div>      return await this.createUser(userId)</div>
                            <div>    {`}`}</div>
                            <div>    </div>
                            <div>    return result.rows[0]</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Create new user</div>
                            <div>  static async createUser(userId, userData = {`{}`}) {`{`}</div>
                            <div>    const query = `</div>
                            <div>      INSERT INTO users (user_id, username, discriminator, avatar_url)</div>
                            <div>      VALUES ($1, $2, $3, $4)</div>
                            <div>      RETURNING *</div>
                            <div>    `</div>
                            <div>    const values = [</div>
                            <div>      userId,</div>
                            <div>      userData.username || 'Unknown',</div>
                            <div>      userData.discriminator || '0000',</div>
                            <div>      userData.avatarURL || null</div>
                            <div>    ]</div>
                            <div>    </div>
                            <div>    const result = await pool.query(query, values)</div>
                            <div>    return result.rows[0]</div>
                            <div>  {`}`}</div>
                            <div></div>
                            <div>  // Add experience points</div>
                            <div>  static async addExperience(userId, xp) {`{`}</div>
                            <div>    const query = `</div>
                            <div>      UPDATE users </div>
                            <div>      SET experience = experience + $2,</div>
                            <div>          level = FLOOR(SQRT(experience + $2) / 10) + 1</div>
                            <div>      WHERE user_id = $1</div>
                            <div>      RETURNING *</div>
                            <div>    `</div>
                            <div>    const result = await pool.query(query, [userId, xp])</div>
                            <div>    return result.rows[0]</div>
                            <div>  {`}`}</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Functions:</strong> User CRUD, XP system, guild settings, moderation data
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          🔄 Real-time Data Integration
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Integrate database operations seamlessly with Discord events.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Event-driven database updates</div>
                            <div>client.on('messageCreate', async message =&gt; {`{`}</div>
                            <div>  if (message.author.bot) return</div>
                            <div></div>
                            <div>  try {`{`}</div>
                            <div>    // Update user data &amp; add XP</div>
                            <div>    const user = await UserDatabase.getUser(message.author.id)</div>
                            <div>    const oldLevel = user.level</div>
                            <div>    </div>
                            <div>    // Add random XP (15-25 per message)</div>
                            <div>    const xpGain = Math.floor(Math.random() * 11) + 15</div>
                            <div>    const updatedUser = await UserDatabase.addExperience(</div>
                            <div>      message.author.id,</div>
                            <div>      xpGain</div>
                            <div>    )</div>
                            <div></div>
                            <div>    // Check for level up</div>
                            <div>    if (updatedUser.level &gt; oldLevel) {`{`}</div>
                            <div>      await message.reply(</div>
                            <div>        '🎉 Congratulations! You have reached level ' + updatedUser.level + '!'</div>
                            <div>      )</div>
                            <div>      </div>
                            <div>      // Give level-up rewards</div>
                            <div>      await UserDatabase.addCoins(message.author.id, updatedUser.level * 100)</div>
                            <div>    {`}`}</div>
                            <div></div>
                            <div>    // Log command usage</div>
                            <div>    if (message.content.startsWith('!')) {`{`}</div>
                            <div>      await logCommandUsage(</div>
                            <div>        message.author.id,</div>
                            <div>        message.guild.id,</div>
                            <div>        message.content.split(' ')[0]</div>
                            <div>      )</div>
                            <div>    {`}`}</div>
                            <div></div>
                            <div>  {`}`} catch (error) {`{`}</div>
                            <div>    console.error('Database error:', error)</div>
                            <div>  {`}`}</div>
                            <div>{`}`})</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Integration:</strong> Automatic XP tracking, level-ups, command logging
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🎮 Advanced Database Features</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/30">
                        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center">
                          💰 Economy System Implementation
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-indigo-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Complete economy system</div>
                            <div>class EconomySystem {`{`}</div>
                            <div>  // Daily coin collection</div>
                            <div>  static async claimDaily(userId) {`{`}</div>
                            <div>    const user = await UserDatabase.getUser(userId)</div>
                            <div>    const now = new Date()</div>
                            <div>    const lastDaily = new Date(user.last_daily)</div>
                            <div>    const timeDiff = now - lastDaily</div>
                            <div>    const oneDay = 24 * 60 * 60 * 1000</div>
                            <div></div>
                            <div>    if (timeDiff &lt; oneDay) {`{`}</div>
                            <div>      const remaining = oneDay - timeDiff</div>
                            <div>      const hours = Math.floor(remaining / (60 * 60 * 1000))</div>
                            <div>      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))</div>
                            <div>      return {`{ success: false, message: 'Wait ' + hours + 'h ' + minutes + 'm' }`}</div>
                            <div>    {`}`}</div>
                            <div></div>
                            <div>    // Calculate daily reward</div>
                            <div>    const baseReward = 100</div>
                            <div>    const levelBonus = user.level * 10</div>
                            <div>    const totalReward = baseReward + levelBonus</div>
                            <div></div>
                            <div>    // Update database</div>
                            <div>    const query = `</div>
                            <div>      UPDATE users </div>
                            <div>      SET coins = coins + $2, last_daily = CURRENT_TIMESTAMP</div>
                            <div>      WHERE user_id = $1</div>
                            <div>      RETURNING coins</div>
                            <div>    `</div>
                            <div>    const result = await pool.query(query, [userId, totalReward])</div>
                            <div></div>
                            <div>    return {`{`}</div>
                            <div>      success: true,</div>
                            <div>      reward: totalReward,</div>
                            <div>      newBalance: result.rows[0].coins</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-300/30">
                        <h5 className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center">
                          📊 Analytics &amp; Reporting
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-teal-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Server analytics dashboard</div>
                            <div>class Analytics {`{`}</div>
                            <div>  static async getServerStats(guildId) {`{`}</div>
                            <div>    const queries = await Promise.all([</div>
                            <div>      // Total members</div>
                            <div>      pool.query('SELECT COUNT(*) as count FROM users WHERE guild_id = $1', [guildId]),</div>
                            <div>      </div>
                            <div>      // Messages this week</div>
                            <div>      pool.query(`</div>
                            <div>        SELECT COUNT(*) as count FROM messages </div>
                            <div>        WHERE guild_id = $1 AND created_at &gt; CURRENT_DATE - INTERVAL '7 days'</div>
                            <div>      `, [guildId]),</div>
                            <div>      </div>
                            <div>      // Most active users</div>
                            <div>      pool.query(`</div>
                            <div>        SELECT user_id, username, experience, level </div>
                            <div>        FROM users WHERE guild_id = $1 </div>
                            <div>        ORDER BY experience DESC LIMIT 10</div>
                            <div>      `, [guildId]),</div>
                            <div>      </div>
                            <div>      // Moderation actions this month</div>
                            <div>      pool.query(`</div>
                            <div>        SELECT COUNT(*) as count FROM warnings </div>
                            <div>        WHERE guild_id = $1 AND created_at &gt; CURRENT_DATE - INTERVAL '30 days'</div>
                            <div>      `, [guildId])</div>
                            <div>    ])</div>
                            <div></div>
                            <div>    return {`{`}</div>
                            <div>      totalMembers: queries[0].rows[0].count,</div>
                            <div>      weeklyMessages: queries[1].rows[0].count,</div>
                            <div>      topUsers: queries[2].rows,</div>
                            <div>      monthlyModerations: queries[3].rows[0].count</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}</div>
                            <div>{`}`}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-lg border border-purple-300/30">
                    <h4 className="text-xl font-semibold mb-3">🛠️ Database Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🔒 Security:</strong> Use parameterized queries to prevent SQL injection</p>
                        <p><strong>📦 Connection Pooling:</strong> Reuse connections for better performance</p>
                        <p><strong>🗂️ Indexing:</strong> Add indexes on frequently queried columns</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🔄 Backup Strategy:</strong> Regular automated backups &amp; recovery testing</p>
                        <p><strong>📊 Monitoring:</strong> Track query performance &amp; connection health</p>
                        <p><strong>🧹 Cleanup:</strong> Regular maintenance to remove old data</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">💾</span>
                      Database Integration Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up database (PostgreSQL/MySQL/SQLite) &amp; connection pooling</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Design &amp; create essential tables (users, guilds, warnings)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement database helper functions &amp; utilities</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Integrate database operations with Discord events</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Add user progression system (XP, levels, achievements)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement economy features (coins, daily rewards, shop)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up analytics, monitoring, &amp; backup strategies</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-7',
              title: 'Bot Deployment',
              description: 'Deploy and scale your Discord bot',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={`space-y-6 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Bot Deployment (Launch Your Digital Workforce! 🚀🌐)</h3>
                    <p className="text-lg opacity-90">
                      Think of bot deployment like opening your business to the public - you need reliable infrastructure, monitoring systems, 
                      and scalable hosting to serve your community 24/7. Proper deployment ensures your bot stays online, handles traffic 
                      spikes gracefully, and can be updated seamlessly without disrupting your users. This is where your bot transforms 
                      from a development project into a production-ready service!
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg border border-blue-300/30">
                    <h4 className="text-xl font-semibold mb-3 flex items-center">
                      🎯 Why Professional Deployment Matters
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p><strong>⚡ 99.9% Uptime:</strong> Reliable service your community can count on</p>
                        <p><strong>📈 Auto-scaling:</strong> Handle growth without performance issues</p>
                        <p><strong>🔄 Zero-downtime Updates:</strong> Deploy new features seamlessly</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>📊 Real-time Monitoring:</strong> Catch issues before users notice</p>
                        <p><strong>🔐 Security &amp; Compliance:</strong> Protect user data &amp; bot tokens</p>
                        <p><strong>💰 Cost Optimization:</strong> Scale resources based on actual usage</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🌐 Hosting Platform Options</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-300/30">
                        <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          🚀 Heroku (Beginner-Friendly)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Perfect for getting started with minimal configuration - deploy directly from Git.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Heroku deployment setup</div>
                            <div></div>
                            <div># 1. Install Heroku CLI</div>
                            <div>npm install -g heroku</div>
                            <div></div>
                            <div># 2. Login &amp; create app</div>
                            <div>heroku login</div>
                            <div>heroku create your-bot-name</div>
                            <div></div>
                            <div># 3. Set environment variables</div>
                            <div>heroku config:set DISCORD_TOKEN=your_bot_token</div>
                            <div>heroku config:set DATABASE_URL=your_database_url</div>
                            <div>heroku config:set NODE_ENV=production</div>
                            <div></div>
                            <div># 4. Create Procfile</div>
                            <div>echo "worker: node index.js" &gt; Procfile</div>
                            <div></div>
                            <div># 5. Deploy</div>
                            <div>git add .</div>
                            <div>git commit -m "Deploy bot"</div>
                            <div>git push heroku main</div>
                            <div></div>
                            <div># 6. Scale worker (enable bot)</div>
                            <div>heroku ps:scale worker=1</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm">
                          <strong>Pros:</strong> Easy setup, free tier, automatic deployments | <strong>Cons:</strong> Can be expensive at scale
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-300/30">
                        <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                          ☁️ DigitalOcean (Great Balance)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Affordable VPS hosting with excellent performance &amp; developer experience.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-blue-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># DigitalOcean droplet setup</div>
                            <div></div>
                            <div># 1. Create droplet (Ubuntu 20.04)</div>
                            <div># Choose: $5/month basic droplet for small bots</div>
                            <div></div>
                            <div># 2. Connect via SSH</div>
                            <div>ssh root@your_droplet_ip</div>
                            <div></div>
                            <div># 3. Install Node.js &amp; PM2</div>
                            <div>curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -</div>
                            <div>apt-get install -y nodejs</div>
                            <div>npm install -g pm2</div>
                            <div></div>
                            <div># 4. Clone your bot repository</div>
                            <div>git clone https://github.com/yourusername/your-bot.git</div>
                            <div>cd your-bot</div>
                            <div>npm install --production</div>
                            <div></div>
                            <div># 5. Create ecosystem file</div>
                            <div>cat &gt; ecosystem.config.js &lt;&lt; EOF</div>
                            <div>module.exports = {`{`}</div>
                            <div>  apps: [{`{`}</div>
                            <div>    name: 'discord-bot',</div>
                            <div>    script: 'index.js',</div>
                            <div>    instances: 1,</div>
                            <div>    autorestart: true,</div>
                            <div>    watch: false,</div>
                            <div>    max_memory_restart: '1G',</div>
                            <div>    env: {`{`}</div>
                            <div>      NODE_ENV: 'production'</div>
                            <div>    {`}`}</div>
                            <div>  {`}`}]</div>
                            <div>{`}`}</div>
                            <div>EOF</div>
                            <div></div>
                            <div># 6. Start with PM2</div>
                            <div>pm2 start ecosystem.config.js</div>
                            <div>pm2 save</div>
                            <div>pm2 startup</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
                          <strong>Pros:</strong> Full control, cost-effective, excellent support | <strong>Cons:</strong> Requires more setup
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-300/30">
                        <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center">
                          🐳 Docker Deployment (Professional)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Containerized deployment for consistent environments &amp; easy scaling.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-purple-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Dockerfile for Discord bot</div>
                            <div>FROM node:18-alpine</div>
                            <div></div>
                            <div># Set working directory</div>
                            <div>WORKDIR /app</div>
                            <div></div>
                            <div># Copy package files</div>
                            <div>COPY package*.json ./</div>
                            <div></div>
                            <div># Install dependencies</div>
                            <div>RUN npm ci --only=production &amp;&amp; npm cache clean --force</div>
                            <div></div>
                            <div># Copy application code</div>
                            <div>COPY . .</div>
                            <div></div>
                            <div># Create non-root user</div>
                            <div>RUN addgroup -g 1001 -S nodejs</div>
                            <div>RUN adduser -S discordbot -u 1001</div>
                            <div>USER discordbot</div>
                            <div></div>
                            <div># Start the bot</div>
                            <div>CMD ["node", "index.js"]</div>
                            <div></div>
                            <div># Build &amp; run commands</div>
                            <div>docker build -t my-discord-bot .</div>
                            <div>docker run -d \\</div>
                            <div>  --name discord-bot \\</div>
                            <div>  --restart unless-stopped \\</div>
                            <div>  -e DISCORD_TOKEN=$DISCORD_TOKEN \\</div>
                            <div>  -e DATABASE_URL=$DATABASE_URL \\</div>
                            <div>  my-discord-bot</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 rounded text-sm">
                          <strong>Pros:</strong> Consistent environments, easy scaling, portable | <strong>Cons:</strong> Learning curve
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300/30">
                        <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                          ☁️ AWS/Google Cloud (Enterprise)
                        </h5>
                        <p className="text-sm opacity-80 mb-3">
                          Cloud platforms for large-scale bots with advanced requirements.
                        </p>
                        <div className="bg-gray-900 p-4 rounded-lg text-yellow-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># AWS Lambda serverless deployment</div>
                            <div></div>
                            <div># package.json - add serverless</div>
                            <div>"scripts": {`{`}</div>
                            <div>  "deploy": "serverless deploy"</div>
                            <div>{`}`}</div>
                            <div></div>
                            <div># serverless.yml</div>
                            <div>service: discord-bot</div>
                            <div>provider:</div>
                            <div>  name: aws</div>
                            <div>  runtime: nodejs18.x</div>
                            <div>  region: us-east-1</div>
                            <div>  environment:</div>
                            <div>    DISCORD_TOKEN: ${`{env:DISCORD_TOKEN}`}</div>
                            <div>    DATABASE_URL: ${`{env:DATABASE_URL}`}</div>
                            <div></div>
                            <div>functions:</div>
                            <div>  discordBot:</div>
                            <div>    handler: index.handler</div>
                            <div>    events:</div>
                            <div>      - schedule: rate(1 minute)  # Keep alive</div>
                            <div></div>
                            <div># Deploy command</div>
                            <div>npm run deploy</div>
                            <div></div>
                            <div># Note: Lambda requires special bot architecture</div>
                            <div># Consider ECS or EC2 for traditional Discord bots</div>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
                          <strong>Pros:</strong> Massive scale, advanced features, pay-per-use | <strong>Cons:</strong> Complex setup, cost at scale
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">🔧 Production Configuration</h4>
                    
                    <div className="space-y-6">
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-300/30">
                        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center">
                          📊 Monitoring &amp; Logging
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-indigo-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># Production logging setup</div>
                            <div>const winston = require('winston')</div>
                            <div></div>
                            <div>const logger = winston.createLogger({`{`}</div>
                            <div>  level: process.env.LOG_LEVEL || 'info',</div>
                            <div>  format: winston.format.combine(</div>
                            <div>    winston.format.timestamp(),</div>
                            <div>    winston.format.errors({`{ stack: true }`}),</div>
                            <div>    winston.format.json()</div>
                            <div>  ),</div>
                            <div>  transports: [</div>
                            <div>    new winston.transports.File({`{ filename: 'error.log', level: 'error' }`}),</div>
                            <div>    new winston.transports.File({`{ filename: 'combined.log' }`}),</div>
                            <div>    new winston.transports.Console({`{`}</div>
                            <div>      format: winston.format.simple()</div>
                            <div>    {`}`})</div>
                            <div>  ]</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div># Health check endpoint</div>
                            <div>const express = require('express')</div>
                            <div>const app = express()</div>
                            <div></div>
                            <div>app.get('/health', (req, res) =&gt; {`{`}</div>
                            <div>  res.json({`{`}</div>
                            <div>    status: 'healthy',</div>
                            <div>    uptime: process.uptime(),</div>
                            <div>    memory: process.memoryUsage(),</div>
                            <div>    timestamp: new Date().toISOString()</div>
                            <div>  {`}`})</div>
                            <div>{`}`})</div>
                            <div></div>
                            <div>app.listen(process.env.PORT || 3000)</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-300/30">
                        <h5 className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center">
                          🔄 CI/CD Pipeline
                        </h5>
                        <div className="bg-gray-900 p-4 rounded-lg text-teal-400 font-mono text-sm overflow-x-auto">
                          <div className="space-y-1">
                            <div># GitHub Actions workflow (.github/workflows/deploy.yml)</div>
                            <div>name: Deploy Discord Bot</div>
                            <div></div>
                            <div>on:</div>
                            <div>  push:</div>
                            <div>    branches: [main]</div>
                            <div></div>
                            <div>jobs:</div>
                            <div>  test:</div>
                            <div>    runs-on: ubuntu-latest</div>
                            <div>    steps:</div>
                            <div>      - uses: actions/checkout@v3</div>
                            <div>      - uses: actions/setup-node@v3</div>
                            <div>        with:</div>
                            <div>          node-version: '18'</div>
                            <div>      - run: npm ci</div>
                            <div>      - run: npm test</div>
                            <div>      - run: npm run lint</div>
                            <div></div>
                            <div>  deploy:</div>
                            <div>    needs: test</div>
                            <div>    runs-on: ubuntu-latest</div>
                            <div>    steps:</div>
                            <div>      - uses: actions/checkout@v3</div>
                            <div>      - name: Deploy to production</div>
                            <div>        run: |</div>
                            <div>          # Your deployment script here</div>
                            <div>          docker build -t discord-bot .</div>
                            <div>          docker push your-registry/discord-bot:latest</div>
                            <div>        env:</div>
                            <div>          DISCORD_TOKEN: ${`{secrets.DISCORD_TOKEN}`}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border border-red-300/30">
                    <h4 className="text-xl font-semibold mb-3">🛡️ Security &amp; Best Practices</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><strong>🔐 Environment Variables:</strong> Never commit secrets to code repositories</p>
                        <p><strong>🔄 Regular Updates:</strong> Keep dependencies &amp; Node.js versions current</p>
                        <p><strong>📊 Rate Limiting:</strong> Implement proper rate limiting to avoid API limits</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>🚨 Error Handling:</strong> Graceful error recovery &amp; logging</p>
                        <p><strong>📋 Monitoring:</strong> Track uptime, performance, &amp; error rates</p>
                        <p><strong>💾 Backups:</strong> Regular database &amp; configuration backups</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-300/30">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span className="mr-2">🚀</span>
                      Bot Deployment Implementation Checklist
                    </h4>
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Choose hosting platform based on needs &amp; budget</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up environment variables &amp; secure configuration</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Configure production logging &amp; error handling</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Implement health checks &amp; monitoring endpoints</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Set up CI/CD pipeline for automated deployments</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Configure backup strategies &amp; disaster recovery</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Test deployment thoroughly &amp; monitor performance</span>
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