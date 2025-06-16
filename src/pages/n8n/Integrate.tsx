import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Plug, 
  Database, 
  Webhook, 
  Cloud, 
  MessageSquare,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  CreditCard,
  Brain,
  Zap,
  RefreshCw,
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

interface LearningPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const N8nIntegrate: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('supabase');
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
    { id: 'supabase', name: 'Supabase', icon: '🗄️' },
    { id: 'stripe', name: 'Stripe', icon: '💳' },
    { id: 'discord', name: 'Discord', icon: '💬' },
    { id: 'openai', name: 'OpenAI', icon: '🧠' },
    { id: 'zapier', name: 'Zapier', icon: '⚡' },
    { id: 'make', name: 'Make', icon: '🔄' },
    { id: 'webhooks', name: 'Webhooks', icon: '🔗' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    supabase: [
      {
        id: 'setup-supabase-project',
        title: 'Set up Supabase project',
        description: 'Create and configure your Supabase project',
        completed: false
      },
      {
        id: 'configure-database-schema',
        title: 'Configure database schema',
        description: 'Design and implement database tables for n8n agents',
        completed: false
      },
      {
        id: 'setup-supabase-credentials',
        title: 'Set up Supabase credentials',
        description: 'Configure API keys and connection strings in n8n',
        completed: false
      },
      {
        id: 'test-database-connection',
        title: 'Test database connection',
        description: 'Verify n8n can connect to Supabase successfully',
        completed: false
      },
      {
        id: 'implement-row-level-security',
        title: 'Implement Row Level Security',
        description: 'Set up RLS policies for secure data access',
        completed: false
      },
      {
        id: 'setup-realtime-subscriptions',
        title: 'Set up real-time subscriptions',
        description: 'Configure real-time data sync between n8n and Supabase',
        completed: false
      }
    ],
    stripe: [
      {
        id: 'create-stripe-account',
        title: 'Create Stripe account',
        description: 'Set up your Stripe account and verify business details',
        completed: false
      },
      {
        id: 'configure-stripe-api-keys',
        title: 'Configure Stripe API keys',
        description: 'Add Stripe API keys to n8n credentials',
        completed: false
      },
      {
        id: 'setup-payment-intents',
        title: 'Set up Payment Intents',
        description: 'Configure Payment Intent workflows in n8n',
        completed: false
      },
      {
        id: 'implement-webhooks',
        title: 'Implement Stripe webhooks',
        description: 'Set up webhook endpoints for payment events',
        completed: false
      },
      {
        id: 'test-payment-flows',
        title: 'Test payment flows',
        description: 'Run test transactions to verify integration',
        completed: false
      },
      {
        id: 'setup-subscription-management',
        title: 'Set up subscription management',
        description: 'Configure recurring payment and subscription workflows',
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
        description: 'Set appropriate permissions and scopes for your bot',
        completed: false
      },
      {
        id: 'setup-discord-credentials',
        title: 'Set up Discord credentials',
        description: 'Add bot token and credentials to n8n',
        completed: false
      },
      {
        id: 'implement-message-workflows',
        title: 'Implement message workflows',
        description: 'Create workflows for sending and receiving Discord messages',
        completed: false
      },
      {
        id: 'setup-slash-commands',
        title: 'Set up slash commands',
        description: 'Configure Discord slash commands integration',
        completed: false
      },
      {
        id: 'test-bot-functionality',
        title: 'Test bot functionality',
        description: 'Verify all Discord bot features work correctly',
        completed: false
      }
    ],
    openai: [
      {
        id: 'setup-openai-account',
        title: 'Set up OpenAI account',
        description: 'Create OpenAI account and generate API key',
        completed: false
      },
      {
        id: 'configure-openai-credentials',
        title: 'Configure OpenAI credentials',
        description: 'Add OpenAI API key to n8n credentials',
        completed: false
      },
      {
        id: 'implement-chat-completion',
        title: 'Implement chat completion',
        description: 'Set up GPT chat completion workflows',
        completed: false
      },
      {
        id: 'configure-prompt-templates',
        title: 'Configure prompt templates',
        description: 'Create reusable prompt templates for consistent results',
        completed: false
      },
      {
        id: 'setup-function-calling',
        title: 'Set up function calling',
        description: 'Implement OpenAI function calling capabilities',
        completed: false
      },
      {
        id: 'implement-content-moderation',
        title: 'Implement content moderation',
        description: 'Add OpenAI moderation for safe content handling',
        completed: false
      }
    ],
    zapier: [
      {
        id: 'setup-zapier-account',
        title: 'Set up Zapier account',
        description: 'Create and configure your Zapier account',
        completed: false
      },
      {
        id: 'create-zapier-webhooks',
        title: 'Create Zapier webhooks',
        description: 'Set up webhook triggers and actions in Zapier',
        completed: false
      },
      {
        id: 'configure-n8n-endpoints',
        title: 'Configure n8n endpoints',
        description: 'Set up n8n webhook endpoints for Zapier integration',
        completed: false
      },
      {
        id: 'map-data-between-platforms',
        title: 'Map data between platforms',
        description: 'Configure data transformation between n8n and Zapier',
        completed: false
      },
      {
        id: 'test-automation-flows',
        title: 'Test automation flows',
        description: 'Verify end-to-end automation between n8n and Zapier',
        completed: false
      },
      {
        id: 'setup-error-handling',
        title: 'Set up error handling',
        description: 'Implement robust error handling for failed integrations',
        completed: false
      }
    ],
    make: [
      {
        id: 'setup-make-account',
        title: 'Set up Make account',
        description: 'Create and configure your Make (formerly Integromat) account',
        completed: false
      },
      {
        id: 'create-make-scenarios',
        title: 'Create Make scenarios',
        description: 'Build scenarios in Make to connect with n8n',
        completed: false
      },
      {
        id: 'configure-http-modules',
        title: 'Configure HTTP modules',
        description: 'Set up HTTP modules for n8n webhook communication',
        completed: false
      },
      {
        id: 'implement-data-mapping',
        title: 'Implement data mapping',
        description: 'Configure data transformation between Make and n8n',
        completed: false
      },
      {
        id: 'setup-scheduling',
        title: 'Set up scheduling',
        description: 'Configure scheduled triggers and execution timing',
        completed: false
      },
      {
        id: 'test-scenario-execution',
        title: 'Test scenario execution',
        description: 'Verify Make scenarios execute correctly with n8n',
        completed: false
      }
    ],
    webhooks: [
      {
        id: 'design-webhook-structure',
        title: 'Design webhook structure',
        description: 'Plan webhook payload structure and endpoints',
        completed: false
      },
      {
        id: 'setup-webhook-endpoints',
        title: 'Set up webhook endpoints',
        description: 'Configure n8n webhook trigger nodes',
        completed: false
      },
      {
        id: 'implement-webhook-security',
        title: 'Implement webhook security',
        description: 'Add authentication and signature verification',
        completed: false
      },
      {
        id: 'configure-payload-validation',
        title: 'Configure payload validation',
        description: 'Set up data validation for incoming webhook data',
        completed: false
      },
      {
        id: 'setup-retry-mechanisms',
        title: 'Set up retry mechanisms',
        description: 'Implement retry logic for failed webhook deliveries',
        completed: false
      },
      {
        id: 'test-webhook-delivery',
        title: 'Test webhook delivery',
        description: 'Verify webhook endpoints receive and process data correctly',
        completed: false
      }
    ]
  };

  const learningPaths: { [key: string]: LearningPath } = {
    supabase: {
      id: 'supabase',
      title: 'n8n + Supabase Integration',
      icon: <Database className="h-5 w-5" />,
      description: 'Connect n8n agents to Supabase for database operations',
      sections: [
        {
          id: 'foundation',
          title: '🗄️ Foundation',
          description: 'Setup Supabase integration basics',
          steps: [
            {
              id: 'supabase-step-1',
              title: 'Agent Database Design',
              description: 'Design database schema for n8n agents',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent database design content</div>
            },
            {
              id: 'supabase-step-2',
              title: 'Setup Credentials',
              description: 'Configure Supabase credentials in n8n',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Supabase credentials setup content</div>
            }
          ]
        },
        {
          id: 'operations',
          title: '🔧 Operations',
          description: 'Agent data operations',
          steps: [
            {
              id: 'supabase-step-3',
              title: 'Agent Data CRUD',
              description: 'Create, read, update, delete agent data',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent CRUD operations content</div>
            },
            {
              id: 'supabase-step-4',
              title: 'Real-time Agent Updates',
              description: 'Handle real-time agent state changes',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Real-time agent updates content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced agent-database patterns',
          steps: [
            {
              id: 'supabase-step-5',
              title: 'Agent Authentication',
              description: 'Implement Row Level Security for agents',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent authentication content</div>
            },
            {
              id: 'supabase-step-6',
              title: 'Agent Triggers',
              description: 'Create database triggers for agent events',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent triggers content</div>
            },
            {
              id: 'supabase-step-7',
              title: 'Agent Analytics',
              description: 'Track and analyze agent performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent analytics content</div>
            }
          ]
        }
      ]
    },
    stripe: {
      id: 'stripe',
      title: 'n8n + Stripe Integration',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Connect n8n agents to Stripe for payment processing',
      sections: [
        {
          id: 'foundation',
          title: '💳 Foundation',
          description: 'Setup Stripe payment integration',
          steps: [
            {
              id: 'stripe-step-1',
              title: 'Agent Payment Flows',
              description: 'Design payment workflows for agents',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent payment flows content</div>
            },
            {
              id: 'stripe-step-2',
              title: 'Stripe API Setup',
              description: 'Configure Stripe API keys in n8n',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Stripe API setup content</div>
            }
          ]
        },
        {
          id: 'processing',
          title: '💰 Processing',
          description: 'Handle payment operations',
          steps: [
            {
              id: 'stripe-step-3',
              title: 'Agent Payment Processing',
              description: 'Process payments through agent workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent payment processing content</div>
            },
            {
              id: 'stripe-step-4',
              title: 'Subscription Management',
              description: 'Handle recurring payments and subscriptions',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Subscription management content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced payment features',
          steps: [
            {
              id: 'stripe-step-5',
              title: 'Payment Webhooks',
              description: 'Handle Stripe webhooks in agent workflows',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Payment webhooks content</div>
            },
            {
              id: 'stripe-step-6',
              title: 'Dispute Handling',
              description: 'Automate dispute and chargeback management',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Dispute handling content</div>
            },
            {
              id: 'stripe-step-7',
              title: 'Payment Analytics',
              description: 'Track and analyze payment metrics',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Payment analytics content</div>
            }
          ]
        }
      ]
    },
    discord: {
      id: 'discord',
      title: 'n8n + Discord Integration',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Connect n8n agents to Discord for communication',
      sections: [
        {
          id: 'foundation',
          title: '💬 Foundation',
          description: 'Setup Discord bot integration',
          steps: [
            {
              id: 'discord-step-1',
              title: 'Agent Discord Design',
              description: 'Plan Discord bot interactions for agents',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent Discord design content</div>
            },
            {
              id: 'discord-step-2',
              title: 'Bot Setup',
              description: 'Create and configure Discord bot',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Discord bot setup content</div>
            }
          ]
        },
        {
          id: 'interaction',
          title: '🤖 Interaction',
          description: 'Agent-Discord communication',
          steps: [
            {
              id: 'discord-step-3',
              title: 'Agent Commands',
              description: 'Create Discord commands for agent control',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent commands content</div>
            },
            {
              id: 'discord-step-4',
              title: 'Agent Notifications',
              description: 'Send agent updates to Discord channels',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent notifications content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced Discord features',
          steps: [
            {
              id: 'discord-step-5',
              title: 'Interactive Components',
              description: 'Create buttons and forms for agent control',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Interactive components content</div>
            },
            {
              id: 'discord-step-6',
              title: 'Voice Integration',
              description: 'Integrate agent with Discord voice channels',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Voice integration content</div>
            },
            {
              id: 'discord-step-7',
              title: 'Server Management',
              description: 'Automate Discord server moderation with agents',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Server management content</div>
            }
          ]
        }
      ]
    },
    openai: {
      id: 'openai',
      title: 'n8n + OpenAI Integration',
      icon: <Brain className="h-5 w-5" />,
      description: 'Connect n8n agents to OpenAI for AI capabilities',
      sections: [
        {
          id: 'foundation',
          title: '🧠 Foundation',
          description: 'Setup OpenAI integration',
          steps: [
            {
              id: 'openai-step-1',
              title: 'AI Agent Design',
              description: 'Design AI-powered agent workflows',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>AI agent design content</div>
            },
            {
              id: 'openai-step-2',
              title: 'OpenAI API Setup',
              description: 'Configure OpenAI credentials and models',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>OpenAI API setup content</div>
            }
          ]
        },
        {
          id: 'processing',
          title: '🤖 Processing',
          description: 'AI-powered agent operations',
          steps: [
            {
              id: 'openai-step-3',
              title: 'Text Generation',
              description: 'Generate text content with agent workflows',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Text generation content</div>
            },
            {
              id: 'openai-step-4',
              title: 'Data Analysis',
              description: 'Analyze data using AI in agent workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data analysis content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced AI features',
          steps: [
            {
              id: 'openai-step-5',
              title: 'Function Calling',
              description: 'Implement OpenAI function calling in agents',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Function calling content</div>
            },
            {
              id: 'openai-step-6',
              title: 'Agent Conversations',
              description: 'Create conversational AI agents',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent conversations content</div>
            },
            {
              id: 'openai-step-7',
              title: 'Custom Models',
              description: 'Fine-tune models for specific agent tasks',
              estimated_time: '50 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom models content</div>
            }
          ]
        }
      ]
    },
    zapier: {
      id: 'zapier',
      title: 'n8n + Zapier Integration',
      icon: <Zap className="h-5 w-5" />,
      description: 'Connect n8n agents to Zapier for workflow automation',
      sections: [
        {
          id: 'foundation',
          title: '⚡ Foundation',
          description: 'Setup Zapier integration',
          steps: [
            {
              id: 'zapier-step-1',
              title: 'Agent-Zapier Bridge',
              description: 'Design bridge between n8n agents and Zapier',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent-Zapier bridge content</div>
            },
            {
              id: 'zapier-step-2',
              title: 'Zapier Webhooks',
              description: 'Setup webhooks for Zapier integration',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Zapier webhooks content</div>
            }
          ]
        },
        {
          id: 'automation',
          title: '🔄 Automation',
          description: 'Cross-platform automation',
          steps: [
            {
              id: 'zapier-step-3',
              title: 'Trigger Zapier from Agents',
              description: 'Send agent data to trigger Zapier workflows',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Trigger Zapier content</div>
            },
            {
              id: 'zapier-step-4',
              title: 'Receive from Zapier',
              description: 'Handle data from Zapier in agent workflows',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Receive from Zapier content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced cross-platform features',
          steps: [
            {
              id: 'zapier-step-5',
              title: 'Complex Workflows',
              description: 'Create complex multi-platform workflows',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Complex workflows content</div>
            },
            {
              id: 'zapier-step-6',
              title: 'Error Handling',
              description: 'Handle errors across n8n and Zapier',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error handling content</div>
            },
            {
              id: 'zapier-step-7',
              title: 'Performance Optimization',
              description: 'Optimize performance across platforms',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance optimization content</div>
            }
          ]
        }
      ]
    },
    make: {
      id: 'make',
      title: 'n8n + Make Integration',
      icon: <RefreshCw className="h-5 w-5" />,
      description: 'Connect n8n agents to Make (formerly Integromat)',
      sections: [
        {
          id: 'foundation',
          title: '🔄 Foundation',
          description: 'Setup Make integration',
          steps: [
            {
              id: 'make-step-1',
              title: 'Agent-Make Design',
              description: 'Design integration between n8n agents and Make',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent-Make design content</div>
            },
            {
              id: 'make-step-2',
              title: 'Make API Setup',
              description: 'Configure Make API connection',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Make API setup content</div>
            }
          ]
        },
        {
          id: 'scenarios',
          title: '🎯 Scenarios',
          description: 'Make scenario integration',
          steps: [
            {
              id: 'make-step-3',
              title: 'Trigger Make Scenarios',
              description: 'Trigger Make scenarios from n8n agents',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Trigger Make scenarios content</div>
            },
            {
              id: 'make-step-4',
              title: 'Data Exchange',
              description: 'Exchange data between n8n and Make',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data exchange content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced Make features',
          steps: [
            {
              id: 'make-step-5',
              title: 'Hybrid Workflows',
              description: 'Create hybrid n8n-Make workflows',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Hybrid workflows content</div>
            },
            {
              id: 'make-step-6',
              title: 'Advanced Routing',
              description: 'Implement complex routing between platforms',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Advanced routing content</div>
            },
            {
              id: 'make-step-7',
              title: 'Monitoring & Debug',
              description: 'Monitor and debug cross-platform workflows',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Monitoring debug content</div>
            }
          ]
        }
      ]
    },
    webhooks: {
      id: 'webhooks',
      title: 'n8n + Webhooks Integration',
      icon: <Webhook className="h-5 w-5" />,
      description: 'Connect n8n agents using webhooks for real-time communication',
      sections: [
        {
          id: 'foundation',
          title: '🔗 Foundation',
          description: 'Setup webhook integration',
          steps: [
            {
              id: 'webhook-step-1',
              title: 'Agent Webhook Design',
              description: 'Design webhook patterns for agent communication',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent webhook design content</div>
            },
            {
              id: 'webhook-step-2',
              title: 'Webhook Endpoints',
              description: 'Create webhook endpoints for agents',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook endpoints content</div>
            }
          ]
        },
        {
          id: 'communication',
          title: '📡 Communication',
          description: 'Agent webhook communication',
          steps: [
            {
              id: 'webhook-step-3',
              title: 'Send Agent Data',
              description: 'Send agent data via webhooks',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Send agent data content</div>
            },
            {
              id: 'webhook-step-4',
              title: 'Receive Agent Events',
              description: 'Handle incoming webhook events for agents',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Receive agent events content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced webhook features',
          steps: [
            {
              id: 'webhook-step-5',
              title: 'Webhook Security',
              description: 'Secure agent webhooks with authentication',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook security content</div>
            },
            {
              id: 'webhook-step-6',
              title: 'Retry & Reliability',
              description: 'Implement retry logic for reliable delivery',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Retry reliability content</div>
            },
            {
              id: 'webhook-step-7',
              title: 'Webhook Analytics',
              description: 'Monitor and analyze webhook performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Webhook analytics content</div>
            }
          ]
        }
      ]
    }
  };

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



  const currentLearningPath = learningPaths[activeApp] || learningPaths.supabase;
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
      case 'database-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Database Integration Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Step 1: Obtain Database Credentials
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Get your Supabase connection details from the project dashboard.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Step 2: Configure n8n Connection
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Add credentials in n8n and test the connection.
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
      case 'payment-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Payment Integration Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Step 1: Set Up Stripe Account
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Create and configure your Stripe account for payments.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'webhook-config':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Webhook Configuration
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Webhook className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Webhook configuration interface would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'discord-config':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Discord Integration
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Discord bot configuration interface would be embedded here
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
            Integrate External Services
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Connect your n8n agents to databases, payment processors, and communication platforms
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
          <Plug className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
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

export default N8nIntegrate;