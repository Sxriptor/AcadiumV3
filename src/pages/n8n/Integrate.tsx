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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">🗄️ Agent Database Architecture</h3>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        Design a robust database schema that supports your n8n agents' data storage, workflow state management, and performance tracking.
                      </p>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Core Tables Structure</h4>
                        <div className="text-sm space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="font-mono text-green-600 dark:text-green-400">agents</p>
                            <p className="text-gray-600 dark:text-gray-400">• id (uuid, primary key)</p>
                            <p className="text-gray-600 dark:text-gray-400">• name (text, not null)</p>
                            <p className="text-gray-600 dark:text-gray-400">• workflow_id (text, not null)</p>
                            <p className="text-gray-600 dark:text-gray-400">• status (enum: active, paused, error)</p>
                            <p className="text-gray-600 dark:text-gray-400">• created_at (timestamp)</p>
                            <p className="text-gray-600 dark:text-gray-400">• updated_at (timestamp)</p>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="font-mono text-green-600 dark:text-green-400">agent_executions</p>
                            <p className="text-gray-600 dark:text-gray-400">• id (uuid, primary key)</p>
                            <p className="text-gray-600 dark:text-gray-400">• agent_id (uuid, foreign key)</p>
                            <p className="text-gray-600 dark:text-gray-400">• execution_id (text, not null)</p>
                            <p className="text-gray-600 dark:text-gray-400">• status (enum: running, success, failed)</p>
                            <p className="text-gray-600 dark:text-gray-400">• start_time (timestamp)</p>
                            <p className="text-gray-600 dark:text-gray-400">• end_time (timestamp)</p>
                            <p className="text-gray-600 dark:text-gray-400">• data (jsonb)</p>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <p className="font-mono text-green-600 dark:text-green-400">agent_metrics</p>
                            <p className="text-gray-600 dark:text-gray-400">• id (uuid, primary key)</p>
                            <p className="text-gray-600 dark:text-gray-400">• agent_id (uuid, foreign key)</p>
                            <p className="text-gray-600 dark:text-gray-400">• metric_type (text)</p>
                            <p className="text-gray-600 dark:text-gray-400">• value (numeric)</p>
                            <p className="text-gray-600 dark:text-gray-400">• recorded_at (timestamp)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">📊 Schema Best Practices</h4>
                      <ul className="space-y-2 text-green-700 dark:text-green-300">
                        <li>• Use UUIDs for primary keys to avoid collisions</li>
                        <li>• Add indexes on frequently queried columns (agent_id, status, created_at)</li>
                        <li>• Use JSONB for flexible data storage with proper indexing</li>
                        <li>• Implement proper foreign key constraints</li>
                        <li>• Add check constraints for enum values</li>
                        <li>• Use timestamps with timezone for consistency</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">🚀 Migration Script Example</h4>
                      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-green-400 text-sm">
{`-- Create agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  workflow_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'error')),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agents executions table
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  execution_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed')),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  data JSONB DEFAULT '{}',
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at);
CREATE INDEX idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX idx_agent_executions_status ON agent_executions(status);`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-2',
              title: 'Setup Credentials',
              description: 'Configure Supabase credentials in n8n',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🔐 Supabase Credentials Setup</h3>
                      <p className="text-purple-700 dark:text-purple-300 mb-4">
                        Securely configure your Supabase project credentials in n8n for seamless database integration.
                      </p>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Step-by-Step Setup</h4>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 dark:text-gray-200">Get Supabase Project URL</p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">Go to Settings → API in your Supabase dashboard</p>
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2">
                                <code className="text-sm text-blue-600 dark:text-blue-400">https://your-project.supabase.co</code>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 dark:text-gray-200">Copy API Keys</p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">Get both anon/public key and service_role key</p>
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2 space-y-1">
                                <div><span className="text-xs text-gray-500">Public Key:</span> <code className="text-sm text-green-600 dark:text-green-400">eyJ...</code></div>
                                <div><span className="text-xs text-gray-500">Service Key:</span> <code className="text-sm text-red-600 dark:text-red-400">eyJ...</code></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 dark:text-gray-200">Add to n8n Credentials</p>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">Create new Supabase credential in n8n</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">️ n8n Configuration</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">In n8n Credentials Manager:</h5>
                          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>1. Click "Credentials" in the main menu</li>
                            <li>2. Click "Add Credential"</li>
                            <li>3. Search for "Supabase" and select it</li>
                            <li>4. Fill in the credential details:</li>
                          </ol>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded mt-3 space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Host:</span>
                                <div className="font-mono text-blue-600 dark:text-blue-400">your-project.supabase.co</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Database:</span>
                                <div className="font-mono text-blue-600 dark:text-blue-400">postgres</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Port:</span>
                                <div className="font-mono text-blue-600 dark:text-blue-400">5432</div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">SSL:</span>
                                <div className="font-mono text-green-600 dark:text-green-400">enabled</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-200 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">⚠️ Security Best Practices</h4>
                      <ul className="space-y-2 text-amber-700 dark:text-amber-300">
                        <li>• Never commit API keys to version control</li>
                        <li>• Use environment variables for sensitive credentials</li>
                        <li>• Regularly rotate your service role keys</li>
                        <li>• Use the anon key for public operations only</li>
                        <li>• Enable Row Level Security (RLS) on all tables</li>
                        <li>• Monitor API usage and set up alerts</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">✅ Connection Test</h4>
                      <p className="text-green-700 dark:text-green-300 mb-3">Test your connection with this simple n8n workflow:</p>
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <pre className="text-green-400 text-sm">
{`// Simple connection test query
SELECT version(), current_database(), current_user;

// Expected result:
// - PostgreSQL version information
// - Database name: postgres  
// - User: authenticated user`}
                        </pre>
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
          description: 'Agent data operations',
          steps: [
            {
              id: 'supabase-step-3',
              title: 'Agent Data CRUD',
              description: 'Create, read, update, delete agent data',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">🔄 Agent CRUD Operations</h3>
                      <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                        Implement comprehensive Create, Read, Update, Delete operations for your n8n agents using Supabase.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">C</span>
                            Create Agent
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                            <pre className="text-gray-800 dark:text-gray-200">
{`INSERT INTO agents (
  name,
  workflow_id,
  status,
  config
) VALUES (
  'Customer Support Bot',
  'wf_12345',
  'active',
  '{"response_time": 30}'
)`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">R</span>
                            Read Agent
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                            <pre className="text-gray-800 dark:text-gray-200">
{`SELECT 
  id,
  name,
  status,
  created_at,
  config
FROM agents 
WHERE status = 'active'
ORDER BY created_at DESC`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">U</span>
                            Update Agent
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                            <pre className="text-gray-800 dark:text-gray-200">
{`UPDATE agents SET
  status = 'paused',
  updated_at = NOW()
WHERE id = $1
RETURNING *`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                            <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">D</span>
                            Delete Agent
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                            <pre className="text-gray-800 dark:text-gray-200">
{`DELETE FROM agents
WHERE id = $1 
AND status != 'running'
RETURNING id, name`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">🎯 n8n Workflow Examples</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">1. Create Agent Workflow</h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p>• Trigger: HTTP Request or Form submission</p>
                            <p>• Validate: Check required fields (name, workflow_id)</p>
                            <p>• Insert: Add new agent to Supabase</p>
                            <p>• Response: Return agent ID and status</p>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">2. Batch Update Workflow</h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p>• Trigger: Schedule or webhook</p>
                            <p>• Query: Get agents by status or condition</p>
                            <p>• Process: Loop through agents</p>
                            <p>• Update: Modify status or configuration</p>
                            <p>• Log: Record operation results</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">⚡ Performance Optimization</h4>
                      <ul className="space-y-2 text-orange-700 dark:text-orange-300">
                        <li>• Use prepared statements to prevent SQL injection</li>
                        <li>• Implement connection pooling for high-volume operations</li>
                        <li>• Add proper indexes on frequently queried columns</li>
                        <li>• Use transactions for multi-table operations</li>
                        <li>• Implement soft deletes instead of hard deletes</li>
                        <li>• Cache frequently accessed agent data</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🛡️ Error Handling Patterns</h4>
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <pre className="text-green-400 text-sm">
{`// n8n Error Handling Example
try {
  const result = await supabase
    .from('agents')
    .insert(agentData)
    .select();
    
  if (result.error) {
    throw new Error(result.error.message);
  }
  
  return result.data;
} catch (error) {
  console.error('Agent creation failed:', error);
  // Send to error tracking service
  // Return appropriate error response
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-4',
              title: 'Real-time Agent Updates',
              description: 'Handle real-time agent state changes',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-cyan-50 dark:bg-cyan-900/30 p-6 rounded-lg border border-cyan-200 dark:border-cyan-700">
                      <h3 className="text-xl font-bold text-cyan-800 dark:text-cyan-200 mb-4">⚡ Real-time Agent Monitoring</h3>
                      <p className="text-cyan-700 dark:text-cyan-300 mb-4">
                        Set up real-time subscriptions to monitor agent status changes, execution updates, and performance metrics instantly.
                      </p>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Real-time Subscription Setup</h4>
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">1. Enable Realtime on Tables</h5>
                            <div className="bg-gray-900 p-3 rounded text-sm">
                              <pre className="text-green-400">
{`-- Enable realtime for agents table
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_metrics;`}
                              </pre>
</div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">2. n8n Webhook Trigger Setup</h5>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                              <p>• Create webhook trigger node in n8n</p>
                              <p>• Configure endpoint URL for real-time updates</p>
                              <p>• Set up authentication for secure connections</p>
                              <p>• Add data transformation for incoming events</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-violet-50 dark:bg-violet-900/30 p-6 rounded-lg border border-violet-200 dark:border-violet-700">
                      <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-3">🔄 Event Types & Handling</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">+</span>
                            INSERT Events
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>• New agent created</p>
                            <p>• New execution started</p>
                            <p>• Metric recorded</p>
                            <p>• Trigger notifications</p>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">~</span>
                            UPDATE Events
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>• Agent status change</p>
                            <p>• Execution completed</p>
                            <p>• Configuration updated</p>
                            <p>• Update dashboards</p>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                            <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">-</span>
                            DELETE Events
                          </h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p>• Agent removed</p>
                            <p>• Cleanup triggered</p>
                            <p>• Archive old data</p>
                            <p>• Send alerts</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-50 dark:bg-teal-900/30 p-6 rounded-lg border border-teal-200 dark:border-teal-700">
                      <h4 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">🎯 Real-time Workflow Examples</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Agent Status Monitor</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400">
{`// n8n Workflow: Agent Status Monitor
Trigger: Supabase Realtime (agents table)
↓
Filter: status = 'error'
↓
Discord Notification: Send alert to team
↓
Create Ticket: Auto-create support ticket
↓
Log: Record incident for analysis`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Performance Metrics Dashboard</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400">
{`// n8n Workflow: Live Dashboard Updates
Trigger: Supabase Realtime (agent_metrics table)
↓
Transform: Calculate averages and trends
↓
WebSocket: Push to live dashboard
↓
Threshold Check: Compare against limits
↓
Alert: Notify if thresholds exceeded`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 dark:bg-pink-900/30 p-6 rounded-lg border border-pink-200 dark:border-pink-700">
                      <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-3">🔧 Connection Management</h4>
                      <ul className="space-y-2 text-pink-700 dark:text-pink-300">
                        <li>• Implement connection pooling for multiple subscriptions</li>
                        <li>• Add reconnection logic for dropped connections</li>
                        <li>• Use heartbeat pings to maintain connection health</li>
                        <li>• Implement exponential backoff for failed connections</li>
                        <li>• Monitor connection metrics and performance</li>
                        <li>• Set up graceful shutdown procedures</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📊 Monitoring & Debugging</h4>
                      <div className="bg-gray-900 p-4 rounded-lg">
                        <pre className="text-green-400 text-sm">
{`// Real-time connection monitoring
const monitorConnection = {
  events_received: 0,
  connection_uptime: Date.now(),
  last_heartbeat: Date.now(),
  error_count: 0,
  reconnect_attempts: 0
};

// Log real-time events for debugging
supabase
  .channel('agents-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'agents' },
    (payload) => {
      console.log('Real-time event:', payload);
      monitorConnection.events_received++;
    }
  )
  .subscribe();`}
                        </pre>
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
          description: 'Advanced agent-database patterns',
          steps: [
            {
              id: 'supabase-step-5',
              title: 'Agent Authentication',
              description: 'Implement Row Level Security for agents',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-rose-50 dark:bg-rose-900/30 p-6 rounded-lg border border-rose-200 dark:border-rose-700">
                      <h3 className="text-xl font-bold text-rose-800 dark:text-rose-200 mb-4">🔐 Row Level Security (RLS) for Agents</h3>
                      <p className="text-rose-700 dark:text-rose-300 mb-4">
                        Implement robust authentication and authorization system to secure your n8n agents with Supabase Row Level Security.
                      </p>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Enable RLS on Tables</h4>
                        <div className="bg-gray-900 p-4 rounded-lg text-sm">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {`-- Enable RLS on all agent-related tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;

-- Create user roles
CREATE ROLE agent_admin;
CREATE ROLE agent_user;
CREATE ROLE agent_readonly;`}
                          </pre>
                        </div>
                            </div>
                          </div>
                          
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🛡️ RLS Policy Examples</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Admin Full Access Policy</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`-- Admin can access all agents
CREATE POLICY "admin_all_access" ON agents
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);`}
                          </pre>
                        </div>
                          </div>
                          
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">User Own Agents Policy</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`-- Users can only access their own agents
CREATE POLICY "user_own_agents" ON agents
FOR ALL USING (
  auth.uid() = user_id
);`}
                            </pre>
                      </div>
                    </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Team Shared Access Policy</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`-- Team members can access shared agents
CREATE POLICY "team_shared_access" ON agents
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
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🔑 JWT Token Management</h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <div className="space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">n8n Workflow: Token Authentication</h5>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <p>1. Validate incoming JWT token</p>
                              <p>2. Extract user role and permissions</p>
                              <p>3. Set Supabase auth context</p>
                              <p>4. Execute database operations</p>
                              <p>5. Return filtered results based on RLS</p>
                            </div>
                          </div>
                          
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Function Node: JWT Validation
const jwt = $input.first().headers.authorization?.replace('Bearer ', '');

try {
  const decoded = await verifyJWT(jwt);
  
  // Set auth context for Supabase
  const supabase = createClient(url, key, {
    global: {
      headers: {
        Authorization: \`Bearer \${jwt}\`
      }
    }
  });
  
  return { supabase, user: decoded };
} catch (error) {
  throw new Error('Invalid authentication token');
}`}
                          </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">🔐 Security Best Practices</h4>
                      <ul className="space-y-2 text-green-700 dark:text-green-300">
                        <li>• Always use HTTPS for token transmission</li>
                        <li>• Implement token refresh mechanisms</li>
                        <li>• Use short-lived access tokens (15-60 minutes)</li>
                        <li>• Store refresh tokens securely (HttpOnly cookies)</li>
                        <li>• Implement proper logout and token revocation</li>
                        <li>• Monitor for suspicious authentication patterns</li>
                        <li>• Use rate limiting on authentication endpoints</li>
                        <li>• Implement multi-factor authentication where needed</li>
                      </ul>
                        </div>
                        </div>
                        </div>
              )
            },
            {
              id: 'supabase-step-6',
              title: 'Agent Triggers',
              description: 'Create database triggers for agent events',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                      <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-4">⚡ Database Triggers for Agent Automation</h3>
                      <p className="text-orange-700 dark:text-orange-300 mb-4">
                        Set up intelligent database triggers that automatically respond to agent events and maintain data consistency.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Trigger Types</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">BEFORE</span>
                              <span className="text-gray-600 dark:text-gray-400">Data validation &amp; preprocessing</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">AFTER</span>
                              <span className="text-gray-600 dark:text-gray-400">Notifications &amp; side effects</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">INSTEAD OF</span>
                              <span className="text-gray-600 dark:text-gray-400">Custom logic replacement</span>
                            </div>
                      </div>
                    </div>

                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Event Types</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">INSERT</span>
                              <span className="text-gray-600 dark:text-gray-400">New agent created</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">UPDATE</span>
                              <span className="text-gray-600 dark:text-gray-400">Status &amp; config changes</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">DELETE</span>
                              <span className="text-gray-600 dark:text-gray-400">Agent cleanup</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">🔧 Trigger Function Examples</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Auto-update timestamp trigger</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to agents table
CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();`}
                          </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Agent status change notification</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`-- Function to notify status changes
CREATE OR REPLACE FUNCTION notify_agent_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    -- Webhook notification to n8n
    PERFORM http_post(
      'https://your-n8n-instance.com/webhook/agent-status',
      json_build_object(
        'agent_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'timestamp', NOW()
      )::text,
      'application/json'
    );
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER agent_status_change_notify
  AFTER UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION notify_agent_status_change();`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-violet-50 dark:bg-violet-900/30 p-6 rounded-lg border border-violet-200 dark:border-violet-700">
                      <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-3">🎯 Advanced Trigger Patterns</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Audit Trail Trigger</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`-- Create audit table
CREATE TABLE agent_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO agent_audit (
    table_name,
    record_id,
    action,
    old_values,
    new_values,
    changed_by
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) END,
    auth.uid()
  );
  
  RETURN CASE TG_OP
    WHEN 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$ language 'plpgsql';`}
                            </pre>
                          </div>
                        </div>
                          </div>
                        </div>

                    <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-200 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">⚠️ Trigger Best Practices</h4>
                      <ul className="space-y-2 text-amber-700 dark:text-amber-300">
                        <li>• Keep trigger functions lightweight and fast</li>
                        <li>• Use AFTER triggers for notifications to avoid blocking</li>
                        <li>• Implement proper error handling in trigger functions</li>
                        <li>• Avoid complex business logic in triggers</li>
                        <li>• Use conditional logic to prevent unnecessary executions</li>
                        <li>• Monitor trigger performance and execution times</li>
                        <li>• Test triggers thoroughly in development environment</li>
                        <li>• Document trigger behavior for team understanding</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-7',
              title: 'Agent Analytics',
              description: 'Track and analyze agent performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">📊 Agent Performance Analytics</h3>
                      <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                        Build comprehensive analytics system to monitor, analyze and optimize your n8n agents' performance and efficiency.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">95.2%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.3s</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,247</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Daily Executions</div>
                        </div>
                            </div>
                          </div>
                          
                    <div className="bg-cyan-50 dark:bg-cyan-900/30 p-6 rounded-lg border border-cyan-200 dark:border-cyan-700">
                      <h4 className="font-semibold text-cyan-800 dark:text-cyan-200 mb-3">📈 Analytics Tables Structure</h4>
                      <div className="bg-gray-900 p-4 rounded-lg text-sm">
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {`-- Agent performance metrics table
CREATE TABLE agent_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  metric_date DATE NOT NULL,
  total_executions INTEGER DEFAULT 0,
  successful_executions INTEGER DEFAULT 0,
  failed_executions INTEGER DEFAULT 0,
  avg_execution_time INTERVAL,
  min_execution_time INTERVAL,
  max_execution_time INTERVAL,
  total_processing_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX idx_performance_agent_date ON agent_performance_metrics(agent_id, metric_date);
CREATE INDEX idx_performance_date ON agent_performance_metrics(metric_date);

-- Agent usage patterns table
CREATE TABLE agent_usage_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  hour_of_day INTEGER CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  execution_count INTEGER DEFAULT 0,
  avg_response_time INTERVAL,
  peak_usage_indicator BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                        </pre>
                            </div>
                          </div>
                          
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">🎯 Analytics Workflows</h4>
                      <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Daily Performance Report</h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p>• <strong>Trigger:</strong> Schedule daily at midnight</p>
                            <p>• <strong>Data Collection:</strong> Aggregate previous day's executions</p>
                            <p>• <strong>Calculations:</strong> Success rates, response times, error patterns</p>
                            <p>• <strong>Storage:</strong> Save metrics to performance table</p>
                            <p>• <strong>Notifications:</strong> Send summary to team dashboard</p>
                            </div>
                          </div>
                          
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Real-time Performance Monitor</h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p>• <strong>Trigger:</strong> Agent execution completion</p>
                            <p>• <strong>Processing:</strong> Calculate rolling averages</p>
                            <p>• <strong>Thresholds:</strong> Check against performance limits</p>
                            <p>• <strong>Alerts:</strong> Notify if anomalies detected</p>
                            <p>• <strong>Dashboard:</strong> Update live performance widgets</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">📊 Analytics Queries</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Top Performing Agents</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`SELECT 
  a.name,
  a.id,
  pm.successful_executions,
  pm.total_executions,
  ROUND(
    (pm.successful_executions::FLOAT / pm.total_executions * 100), 2
  ) as success_rate,
  pm.avg_execution_time
FROM agents a
JOIN agent_performance_metrics pm ON a.id = pm.agent_id
WHERE pm.metric_date = CURRENT_DATE - INTERVAL '1 day'
ORDER BY success_rate DESC, avg_execution_time ASC
LIMIT 10;`}
                          </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Usage Pattern Analysis</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`SELECT 
  hour_of_day,
  SUM(execution_count) as total_executions,
  AVG(avg_response_time) as avg_response,
  COUNT(DISTINCT agent_id) as active_agents
FROM agent_usage_patterns
WHERE updated_at >= NOW() - INTERVAL '7 days'
GROUP BY hour_of_day
ORDER BY hour_of_day;`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🚨 Alert Configurations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Performance Alerts</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Success rate drops below 90%</li>
                            <li>• Average response time &gt; 5 seconds</li>
                            <li>• Error rate increases by 50%</li>
                            <li>• No executions for 2+ hours</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Capacity Alerts</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Execution queue length &gt; 100</li>
                            <li>• Memory usage &gt; 80%</li>
                            <li>• Database connections &gt; 90%</li>
                            <li>• API rate limit approaching</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">📋 Dashboard Implementation</h4>
                      <div className="bg-gray-900 p-4 rounded-lg text-sm">
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {`// n8n Workflow: Analytics Dashboard Data
// This workflow runs every 5 minutes to update dashboard

Trigger: Schedule (*/5 * * * *)
↓
Supabase Query: Get real-time metrics
↓
Transform: Calculate KPIs and trends
↓
WebSocket Push: Update live dashboard
↓
Cache: Store results for quick access
↓
Log: Record dashboard update metrics

// Key Metrics to Track:
- Agent uptime percentage
- Execution success rates
- Response time distributions  
- Error frequency and types
- Resource utilization trends
- User satisfaction scores`}
                            </pre>
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
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">💳 Agent Payment Workflow Architecture</h3>
                      <p className="text-emerald-700 dark:text-emerald-300 mb-4">
                        Design comprehensive payment workflows that enable your n8n agents to handle various payment scenarios automatically.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">One-time Payments</h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>• Product purchases and service fees</p>
                            <p>• Event tickets and bookings</p>
                            <p>• Digital downloads and licenses</p>
                            <p>• Consultation and service payments</p>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Recurring Payments</h4>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>• Monthly/annual subscriptions</p>
                            <p>• SaaS service billing</p>
                            <p>• Membership fees</p>
                            <p>• Usage-based billing</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🔄 Payment Flow Patterns</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Standard Payment Flow</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Workflow: Standard Payment Processing
Trigger: HTTP Request (Payment initiated)
↓
Validate: Check payment data and amount
↓
Stripe: Create Payment Intent
↓
Response: Return client secret to frontend
↓
Webhook: Listen for payment completion
↓
Update: Record successful payment
↓
Notify: Send confirmation email/SMS`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Subscription Flow</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Workflow: Subscription Management
Trigger: HTTP Request (Subscription signup)
↓
Stripe: Create Customer
↓
Stripe: Create Subscription
↓
Database: Store subscription details
↓
Schedule: Set up billing cycle monitoring
↓
Notify: Welcome email with subscription details`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🎯 Agent Payment Triggers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Automated Triggers</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Form submission with payment</li>
                            <li>• E-commerce cart checkout</li>
                            <li>• Service booking confirmation</li>
                            <li>• Subscription renewal dates</li>
                            <li>• Usage threshold exceeded</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Manual Triggers</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Admin payment processing</li>
                            <li>• Custom invoicing</li>
                            <li>• Refund requests</li>
                            <li>• Payment plan setup</li>
                            <li>• Dispute resolution</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">💰 Pricing Strategy Integration</h4>
                      <div className="bg-gray-900 p-4 rounded-lg text-sm">
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {`// n8n Function: Dynamic Pricing Calculator
const calculatePrice = (basePrice, userTier, discount) => {
  let finalPrice = basePrice;
  
  // Apply tier-based pricing
  const tierMultipliers = {
    'basic': 1.0,
    'premium': 0.9,
    'enterprise': 0.8
  };
  
  finalPrice *= tierMultipliers[userTier] || 1.0;
  
  // Apply discount if valid
  if (discount && discount.active) {
    finalPrice *= (1 - discount.percentage / 100);
  }
  
  // Minimum price enforcement
  return Math.max(finalPrice, 0.50); // $0.50 minimum
};

// Usage in n8n workflow
const price = calculatePrice(29.99, 'premium', { active: true, percentage: 15 });
// Result: $22.94 (30% tier discount + 15% promo)`}
                          </pre>
                        </div>
                      </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🛡️ Payment Security Considerations</h4>
                      <ul className="space-y-2 text-red-700 dark:text-red-300">
                        <li>• Never store credit card information in n8n workflows</li>
                        <li>• Always use Stripe's secure vault for payment methods</li>
                        <li>• Implement proper webhook signature verification</li>
                        <li>• Use HTTPS for all payment-related endpoints</li>
                        <li>• Implement rate limiting on payment endpoints</li>
                        <li>• Log all payment attempts for audit purposes</li>
                        <li>• Set up fraud detection rules in Stripe dashboard</li>
                        <li>• Monitor for suspicious payment patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'stripe-step-2',
              title: 'Stripe API Setup',
              description: 'Configure Stripe API keys in n8n',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🔑 Stripe API Configuration</h3>
                      <p className="text-purple-700 dark:text-purple-300 mb-4">
                        Set up secure Stripe API integration in n8n with proper credential management and environment separation.
                      </p>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Step 1: Get Stripe API Keys</h4>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2"><strong>1. Log into Stripe Dashboard:</strong></p>
                            <p>• Go to <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">dashboard.stripe.com</span></p>
                            <p>• Navigate to Developers → API keys</p>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2"><strong>2. Copy Required Keys:</strong></p>
                            <div className="bg-gray-900 p-3 rounded">
                              <pre className="text-green-400 whitespace-pre-wrap">
                                {`Test Keys (for development):
• Publishable key: pk_test_...
• Secret key: sk_test_...

Live Keys (for production):
• Publishable key: pk_live_...
• Secret key: sk_live_...`}
                              </pre>
                            </div>
                          </div>
                        </div>
                            </div>
                          </div>
                          
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🔐 n8n Credential Setup</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Create Stripe Credentials in n8n</h5>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>1. In n8n, go to Settings → Credentials</p>
                            <p>2. Click "Create Credential" → Search for "Stripe"</p>
                            <p>3. Add your credentials:</p>
                          </div>
                          
                          <div className="bg-gray-900 p-3 rounded text-sm mt-3">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`n8n Stripe Credential Configuration:
┌─────────────────────────────────────────┐
│ Credential Name: Stripe Test/Live       │
│ Secret Key: sk_test_... or sk_live_...  │
│ Webhook Secret: whsec_... (optional)    │
└─────────────────────────────────────────┘`}
                            </pre>
                            </div>
                          </div>
                          
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Environment Variables (Alternative)</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`# Add to n8n environment variables
STRIPE_SECRET_KEY_TEST=sk_test_your_key_here
STRIPE_SECRET_KEY_LIVE=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Access in n8n workflows
const stripeKey = process.env.STRIPE_SECRET_KEY_TEST;`}
                          </pre>
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">✅ Test Connection</h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">n8n Test Workflow</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {`// n8n Function Node: Test Stripe Connection
const stripe = require('stripe')(credentials.stripe.secretKey);

try {
  // Test API connection
  const account = await stripe.accounts.retrieve();
  
  return {
    status: 'success',
    account_id: account.id,
    country: account.country,
    currency: account.default_currency,
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled
  };
} catch (error) {
  return {
    status: 'error',
    message: error.message,
    type: error.type
  };
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/30 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">🌐 Webhook Configuration</h4>
                      <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Set up Webhook Endpoint</h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <p>1. In Stripe Dashboard → Developers → Webhooks</p>
                            <p>2. Click "Add endpoint"</p>
                            <p>3. Use your n8n webhook URL:</p>
                          </div>
                          
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`Webhook URL Examples:
https://your-n8n-instance.com/webhook/stripe-events
https://app.n8n.cloud/webhook/YOUR_UUID

Essential Events to Listen For:
• payment_intent.succeeded
• payment_intent.payment_failed
• invoice.payment_succeeded
• invoice.payment_failed
• customer.subscription.created
• customer.subscription.updated
• customer.subscription.deleted`}
                          </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🔒 Security Best Practices</h4>
                      <ul className="space-y-2 text-red-700 dark:text-red-300">
                        <li>• <strong>Never expose secret keys:</strong> Keep them in n8n credentials, not in workflow code</li>
                        <li>• <strong>Use test keys in development:</strong> Always test with test keys before going live</li>
                        <li>• <strong>Rotate keys regularly:</strong> Generate new keys periodically for security</li>
                        <li>• <strong>Webhook signature verification:</strong> Always verify webhook signatures</li>
                        <li>• <strong>Restrict key permissions:</strong> Use restricted API keys when possible</li>
                        <li>• <strong>Monitor API usage:</strong> Set up alerts for unusual API activity</li>
                        <li>• <strong>Log all transactions:</strong> Keep detailed logs for audit purposes</li>
                      </ul>
                          </div>

                    <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🛠️ Quick Setup Checklist</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium text-gray-800 dark:text-gray-200">Stripe Dashboard:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Account created &amp; verified</li>
                            <li>☐ Test API keys copied</li>
                            <li>☐ Webhook endpoint configured</li>
                            <li>☐ Essential events selected</li>
                          </ul>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-medium text-gray-800 dark:text-gray-200">n8n Configuration:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Stripe credentials created</li>
                            <li>☐ Connection tested successfully</li>
                            <li>☐ Webhook workflow created</li>
                            <li>☐ Security measures implemented</li>
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
          id: 'processing',
          title: '⚡ Processing',
          description: 'Handle payment operations',
          steps: [
            {
              id: 'stripe-step-3',
              title: 'Agent Payment Processing',
              description: 'Process payments through agent workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">💳 Agent Payment Processing Engine</h3>
                      <p className="text-green-700 dark:text-green-300 mb-4">
                        Build robust payment processing workflows that handle complex payment scenarios through n8n agents automatically.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">$1.2M+</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Processed Monthly</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.8%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">&lt;2s</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Processing</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🚀 Complete Payment Workflow</h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">n8n Payment Processing Workflow</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {`// n8n Workflow: Complete Payment Processing
1. HTTP Trigger: Receive payment request
   ↓
2. Data Validation: Validate amount, currency, customer
   ↓
3. Fraud Check: Screen for suspicious activity
   ↓
4. Stripe Payment Intent: Create payment intent
   ↓
5. Customer Management: Create/update customer record
   ↓
6. Payment Confirmation: Process payment method
   ↓
7. Database Update: Record transaction details
   ↓
8. Receipt Generation: Create and send receipt
   ↓
9. Notification System: Send confirmations
   ↓
10. Analytics Tracking: Log payment metrics`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">💰 Payment Intent Creation</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Basic Payment Intent</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Function Node: Create Payment Intent
const stripe = require('stripe')(credentials.stripe.secretKey);
const { amount, currency, customerId, metadata } = $input.first().json;

try {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency || 'usd',
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      order_id: metadata.orderId,
      user_id: metadata.userId,
      product_type: metadata.productType
    },
    description: \`Payment for \${metadata.productType}\`
  });

  return {
    status: 'success',
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency
  };
} catch (error) {
  return {
    status: 'error',
    message: error.message,
    code: error.code
  };
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🚨 Error Handling &amp; Recovery</h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Comprehensive Error Handling</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {`// n8n Error Handling Workflow
try {
  const result = await processPayment(paymentData);
  return result;
} catch (error) {
  
  const errorHandling = {
    'card_declined': {
      action: 'retry_with_different_card',
      user_message: 'Your card was declined. Please try a different payment method.',
      retry_count: 3
    },
    'insufficient_funds': {
      action: 'suggest_lower_amount', 
      user_message: 'Insufficient funds. Please check your account balance.',
      retry_count: 1
    },
    'expired_card': {
      action: 'request_card_update',
      user_message: 'Your card has expired. Please update your payment method.',
      retry_count: 0
    }
  };
  
  const errorType = error.code || 'generic_error';
  const handling = errorHandling[errorType];
  
  return {
    status: 'error',
    error_code: errorType,
    user_message: handling.user_message,
    retry_allowed: handling.retry_count > 0,
    suggested_action: handling.action
  };
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'stripe-step-4',
              title: 'Subscription Management',
              description: 'Handle recurring payments and subscriptions',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">🔄 Subscription Management System</h3>
                      <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                        Build intelligent subscription management workflows that handle the complete lifecycle of recurring payments, from signup to cancellation, with automated billing and customer communication.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$847K</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Recurring Revenue</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">94.2%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Retention Rate</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3,421</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">📋 Subscription Lifecycle Management</h4>
                      <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Complete Subscription Journey</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-sm font-bold text-blue-800 dark:text-blue-200">1</div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">Subscription Creation</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer chooses plan and payment method</p>
                            </div>
                          </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-sm font-bold text-green-800 dark:text-green-200">2</div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">Automated Billing</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Recurring charges processed automatically</p>
                            </div>
                          </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm font-bold text-purple-800 dark:text-purple-200">3</div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">Usage Tracking</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Monitor service usage and limits</p>
                                </div>
                            </div>
                          </div>
                          
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold text-yellow-800 dark:text-yellow-200">4</div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">Plan Changes</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Upgrade, downgrade, or modify plans</p>
                            </div>
                          </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center text-sm font-bold text-orange-800 dark:text-orange-200">5</div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">Dunning Management</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle failed payments gracefully</p>
                        </div>
                      </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center text-sm font-bold text-red-800 dark:text-red-200">6</div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-gray-200">Cancellation & Retention</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Handle cancellations and win-back campaigns</p>
                    </div>
                        </div>
                        </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 Smart Plan Management</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Dynamic Pricing Strategies</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="font-medium text-gray-700 dark:text-gray-300">Tier-Based Pricing</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Basic: $9.99/month - Core features</li>
                                <li>• Pro: $29.99/month - Advanced tools</li>
                                <li>• Enterprise: $99.99/month - Full suite</li>
                                <li>• Custom: Quote-based - Tailored solutions</li>
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <p className="font-medium text-gray-700 dark:text-gray-300">Usage-Based Components</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• API calls: $0.01 per 100 requests</li>
                                <li>• Storage: $0.10 per GB/month</li>
                                <li>• Bandwidth: $0.05 per GB transferred</li>
                                <li>• Users: $5.00 per additional user</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">n8n Subscription Creation Workflow</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Workflow: Create Subscription
Trigger: HTTP Request (Plan selection)
↓
Validate: Check plan availability and pricing
↓
Stripe Customer: Create or retrieve customer
↓
Payment Method: Attach payment method to customer
↓
Stripe Subscription: Create subscription with selected plan
↓
Database: Store subscription details and preferences
↓
Welcome Email: Send onboarding sequence
↓
Provision Access: Grant access to subscribed features
↓
Analytics: Track subscription conversion metrics`}
                              </pre>
                            </div>
                          </div>
                          </div>
                        </div>
                        
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-200 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">🔄 Automated Billing Workflows</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Billing Cycle Automation</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pre-Billing Actions</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Calculate usage charges 3 days before billing</li>
                                <li>• Send upcoming billing notifications</li>
                                <li>• Verify payment method validity</li>
                                <li>• Apply any pending plan changes</li>
                                <li>• Process promotional credits or discounts</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Post-Billing Actions</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Send payment confirmation receipts</li>
                                <li>• Update service access and quotas</li>
                                <li>• Reset usage counters for new period</li>
                                <li>• Generate and send detailed invoices</li>
                                <li>• Update customer billing history</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Failed Payment Recovery</h5>
                            <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Smart Dunning Process
Payment Failed Event Received
↓
Wait 1 Day → Retry Payment Attempt #1
↓
If Failed: Send friendly reminder email
↓
Wait 3 Days → Retry Payment Attempt #2  
↓
If Failed: Send urgent payment notice + offer help
↓
Wait 7 Days → Final retry + restrict service access
↓
If Failed: Cancel subscription + send retention offer
↓
30 Days Later: Send win-back campaign`}
                            </pre>
                          </div>
                        </div>
                          </div>
                        </div>
                        
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">📊 Customer Communication System</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Automated Notifications</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• <strong>Welcome Series:</strong> Onboarding emails for new subscribers</li>
                            <li>• <strong>Billing Reminders:</strong> Upcoming payment notifications</li>
                            <li>• <strong>Payment Confirmations:</strong> Successful transaction receipts</li>
                            <li>• <strong>Usage Alerts:</strong> Approaching plan limits warnings</li>
                            <li>• <strong>Plan Changes:</strong> Upgrade/downgrade confirmations</li>
                            <li>• <strong>Renewal Notices:</strong> Annual plan renewal reminders</li>
                          </ul>
                          </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Retention Campaigns</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• <strong>Cancellation Prevention:</strong> Exit intent surveys and offers</li>
                            <li>• <strong>Win-back Campaigns:</strong> Special offers for cancelled customers</li>
                            <li>• <strong>Upgrade Promotions:</strong> Feature-based upgrade suggestions</li>
                            <li>• <strong>Loyalty Rewards:</strong> Long-term subscriber benefits</li>
                            <li>• <strong>Re-engagement:</strong> Inactive user activation campaigns</li>
                            <li>• <strong>Referral Programs:</strong> Subscriber-driven growth incentives</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">⚡ Advanced Subscription Features</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Proration and Plan Changes</h5>
                          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <p><strong>Immediate Upgrades:</strong> Grant access instantly, prorate charges for remaining period</p>
                            <p><strong>Scheduled Downgrades:</strong> Process at next billing cycle to avoid refunds</p>
                            <p><strong>Mid-cycle Changes:</strong> Calculate prorated amounts and adjust next invoice</p>
                            <p><strong>Trial Extensions:</strong> Extend trial periods for sales prospects</p>
                            </div>
                          </div>
                          
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Subscription Analytics Dashboard</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">$45,230</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Monthly MRR</div>
                          </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-green-600 dark:text-green-400">2.3%</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Churn Rate</div>
                        </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-purple-600 dark:text-purple-400">$89</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Revenue</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-orange-600 dark:text-orange-400">18.5</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Months LTV</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎯 Implementation Checklist</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Technical Setup:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Configure Stripe Products and Prices</li>
                            <li>☐ Set up subscription webhooks</li>
                            <li>☐ Implement usage tracking system</li>
                            <li>☐ Create customer portal integration</li>
                            <li>☐ Build plan comparison interface</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Business Logic:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Define pricing strategy and tiers</li>
                            <li>☐ Set up automated email sequences</li>
                            <li>☐ Create dunning management workflows</li>
                            <li>☐ Implement retention campaigns</li>
                            <li>☐ Build analytics and reporting dashboards</li>
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
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced payment features',
          steps: [
            {
              id: 'stripe-step-5',
              title: 'Payment Webhooks',
              description: 'Handle Stripe webhook events in agents',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">🔗 Advanced Payment Webhook System</h3>
                      <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                        Build a bulletproof webhook system that handles all Stripe events reliably, with automatic retry logic, event deduplication, and comprehensive monitoring for your n8n agents.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.97%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Webhook Reliability</div>
                            </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">&lt;500ms</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Processing Time</div>
                          </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Event Monitoring</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">🎯 Critical Webhook Events</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Payment Events</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• <strong>payment_intent.succeeded:</strong> Payment completed successfully</li>
                            <li>• <strong>payment_intent.payment_failed:</strong> Payment attempt failed</li>
                            <li>• <strong>payment_intent.requires_action:</strong> 3D Secure required</li>
                            <li>• <strong>payment_method.attached:</strong> New payment method added</li>
                            <li>• <strong>charge.dispute.created:</strong> Customer disputed charge</li>
                          </ul>
                        </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Subscription Events</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• <strong>customer.subscription.created:</strong> New subscription started</li>
                            <li>• <strong>customer.subscription.updated:</strong> Plan or billing changed</li>
                            <li>• <strong>customer.subscription.deleted:</strong> Subscription cancelled</li>
                            <li>• <strong>invoice.payment_succeeded:</strong> Recurring payment processed</li>
                            <li>• <strong>invoice.payment_failed:</strong> Billing issue occurred</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🔧 n8n Webhook Processing Workflow</h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Complete Webhook Handler</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {`// n8n Webhook Processing Workflow
1. Webhook Trigger: Receive Stripe event
   ↓
2. Signature Verification: Validate webhook authenticity
   ↓
3. Event Deduplication: Check if event already processed
   ↓
4. Event Type Router: Route to specific handler
   ↓
5. Business Logic: Process event-specific actions
   ↓
6. Database Update: Record event and update records
   ↓
7. External Notifications: Send emails/SMS if needed
   ↓
8. Response Logging: Log success/failure details
   ↓
9. Monitoring Alert: Send alerts for critical events
   ↓
10. Acknowledgment: Return 200 OK to Stripe`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🛡️ Webhook Security Implementation</h4>
                      <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Signature Verification Function</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Function: Verify Stripe Webhook Signature
const crypto = require('crypto');

function verifyStripeSignature(payload, signature, secret) {
  const elements = signature.split(',');
  let timestamp, signatures = [];
  
  elements.forEach(element => {
    const [key, value] = element.split('=');
    if (key === 't') timestamp = value;
    if (key === 'v1') signatures.push(value);
  });
  
  // Check timestamp (within 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - timestamp > 300) {
    throw new Error('Webhook timestamp too old');
  }
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(timestamp + '.' + payload)
    .digest('hex');
  
  const isValid = signatures.some(sig => 
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature), 
      Buffer.from(sig)
    )
  );
  
  if (!isValid) {
    throw new Error('Invalid webhook signature');
  }
  
  return true;
}`}
                          </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Event Deduplication Strategy</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• <strong>Event ID Tracking:</strong> Store processed event IDs in database</li>
                            <li>• <strong>Idempotency Keys:</strong> Use Stripe's idempotency for API calls</li>
                            <li>• <strong>Time Window:</strong> Keep event IDs for 30 days minimum</li>
                            <li>• <strong>Redis Cache:</strong> Fast lookup for recent events</li>
                            <li>• <strong>Cleanup Jobs:</strong> Periodic cleanup of old event records</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-200 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">🔄 Retry Logic & Error Handling</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Exponential Backoff Strategy</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Retry Schedule</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Attempt 1: Immediate</li>
                                <li>• Attempt 2: 30 seconds later</li>
                                <li>• Attempt 3: 2 minutes later</li>
                                <li>• Attempt 4: 8 minutes later</li>
                                <li>• Attempt 5: 32 minutes later</li>
                                <li>• Final: Dead letter queue</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Error Categories</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• <span className="text-green-600">Transient:</span> Network, timeout</li>
                                <li>• <span className="text-yellow-600">Rate Limit:</span> API limits hit</li>
                                <li>• <span className="text-red-600">Permanent:</span> Invalid data</li>
                                <li>• <span className="text-blue-600">Business:</span> Logic errors</li>
                                <li>• <span className="text-purple-600">Security:</span> Auth failures</li>
                              </ul>
                            </div>
                            </div>
                          </div>
                          
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Dead Letter Queue Management</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Dead Letter Queue Handler
Failed Event Processing:
↓
Store in Dead Letter Queue with:
• Original event data
• Error details and stack trace  
• Retry attempt count
• Failure timestamp
• Processing context
↓
Daily Review Process:
• Analyze failure patterns
• Fix systemic issues
• Manually reprocess valid events
• Update monitoring rules`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">📊 Webhook Monitoring & Alerting</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Real-time Monitoring Dashboard</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-green-600 dark:text-green-400">1,247</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Events Today</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">99.8%</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-yellow-600 dark:text-yellow-400">3</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">In Retry Queue</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-red-600 dark:text-red-400">0</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Failed Events</div>
                          </div>
                        </div>
                      </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Critical Alert Conditions</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• <strong>High Failure Rate:</strong> &gt;5% failures in 15 minutes → Immediate Slack alert</li>
                            <li>• <strong>Processing Delays:</strong> &gt;2 minute average processing time → Engineering alert</li>
                            <li>• <strong>Dead Letter Growth:</strong> &gt;10 events in queue → Daily review trigger</li>
                            <li>• <strong>Security Issues:</strong> Invalid signatures detected → Security team alert</li>
                            <li>• <strong>Volume Anomalies:</strong> 50% deviation from normal → Monitoring alert</li>
                          </ul>
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'stripe-step-6',
              title: 'Dispute Handling',
              description: 'Manage payment disputes and chargebacks',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">⚖️ Advanced Dispute Management System</h3>
                      <p className="text-red-700 dark:text-red-300 mb-4">
                        Build an intelligent dispute management system that automatically handles chargebacks, gathers evidence, and protects your business revenue through n8n automation workflows.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">73%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$47K</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Protected Monthly</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.2hrs</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-200 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">🚨 Dispute Types & Response Strategy</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Fraud Disputes</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• <strong>Unauthorized:</strong> Card used without permission</li>
                            <li>• <strong>Fraudulent:</strong> Customer claims they didn't make purchase</li>
                            <li>• <strong>Response Strategy:</strong> Provide transaction evidence, IP logs, delivery confirmation</li>
                            <li>• <strong>Win Rate:</strong> 65% with proper documentation</li>
                            <li>• <strong>Timeline:</strong> 7-10 days to respond</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Service Disputes</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• <strong>Not Received:</strong> Customer claims no delivery</li>
                            <li>• <strong>Not as Described:</strong> Product/service differs from listing</li>
                            <li>• <strong>Response Strategy:</strong> Show delivery proof, feature documentation, communication logs</li>
                            <li>• <strong>Win Rate:</strong> 82% with complete evidence</li>
                            <li>• <strong>Timeline:</strong> 7 days to respond</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">🤖 n8n Automated Dispute Response</h4>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Complete Dispute Workflow</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                          <pre className="text-green-400 whitespace-pre-wrap">
                            {`// n8n Dispute Management Workflow
1. Webhook Trigger: charge.dispute.created
   ↓
2. Dispute Classification: Analyze dispute reason
   ↓
3. Evidence Collection: Gather transaction data
   ↓
4. Customer Lookup: Retrieve customer history
   ↓
5. Risk Assessment: Calculate win probability
   ↓
6. Auto-Response: Submit evidence if high confidence
   ↓
7. Manual Review: Flag complex cases for review
   ↓
8. Documentation: Create dispute case file
   ↓
9. Tracking: Monitor dispute status updates
   ↓
10. Outcome Analysis: Learn from results`}
                          </pre>
                        </div>
                      </div>
                    </div>
                        
                    <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
                      <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">📋 Evidence Collection System</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Automated Evidence Gathering</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Evidence</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Payment confirmation details</li>
                                <li>• Customer IP address and location</li>
                                <li>• Device fingerprint information</li>
                                <li>• Authentication logs (3D Secure)</li>
                                <li>• Previous successful transactions</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Service Evidence</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Delivery/download confirmations</li>
                                <li>• Customer service communications</li>
                                <li>• Usage logs and activity data</li>
                                <li>• Terms of service acceptance</li>
                                <li>• Refund policy acknowledgment</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Evidence Compilation Function</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Function: Compile Dispute Evidence
async function compileEvidence(chargeId, disputeReason) {
  const evidence = {
    receipt: await getReceiptUrl(chargeId),
    customerCommunication: await getCustomerEmails(chargeId),
    shippingDocumentation: await getShippingProof(chargeId),
    serviceDocumentation: await getServiceLogs(chargeId),
    duplicateChargeDocumentation: null,
    refundPolicy: 'https://yoursite.com/refund-policy',
    refundPolicyDisclosure: 'Displayed at checkout',
    customerSignature: await getOrderSignature(chargeId),
    uncategorizedText: generateDisputeNarrative(chargeId, disputeReason)
  };
  
  // Add dispute-specific evidence
  if (disputeReason === 'fraudulent') {
    evidence.accessActivityLog = await getAccountActivity(chargeId);
    evidence.billingAddress = await getBillingAddress(chargeId);
    evidence.customerSignature = await getDigitalSignature(chargeId);
  }
  
  return evidence;
}`}
                          </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🎯 Smart Response Strategy</h4>
                      <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Risk-Based Response Decision</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Decision Logic: Should We Fight This Dispute?
function shouldFightDispute(disputeAmount, evidence, customerHistory) {
  let score = 0;
  
  // Evidence strength scoring
  if (evidence.receipt) score += 20;
  if (evidence.deliveryConfirmation) score += 25;
  if (evidence.customerCommunication) score += 15;
  if (evidence.ipAddressMatch) score += 10;
  if (evidence.previousSuccessfulPayments > 0) score += 15;
  
  // Customer history factor
  if (customerHistory.disputeCount === 0) score += 15;
  if (customerHistory.disputeCount > 2) score -= 30;
  
  // Financial consideration
  const fightingCost = 15; // USD chargeback fee
  if (disputeAmount < fightingCost * 2) score -= 20;
  
  // Decision matrix
  if (score >= 70) return 'AUTO_FIGHT';
  if (score >= 40) return 'MANUAL_REVIEW'; 
  return 'ACCEPT_DISPUTE';
}`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Response Templates by Category</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <p className="font-medium text-gray-700 dark:text-gray-300">Fraud Response</p>
                              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                "Transaction verified through multiple security checks including IP verification, device fingerprinting, and 3D Secure authentication. Customer has history of successful payments."
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="font-medium text-gray-700 dark:text-gray-300">Service Response</p>
                              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                "Service delivered as described with confirmation receipt. Customer acknowledged terms at purchase. Support logs show no issues reported prior to dispute."
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">📊 Dispute Analytics & Prevention</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Dispute Prevention Dashboard</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-red-600 dark:text-red-400">2.1%</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Dispute Rate</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-green-600 dark:text-green-400">$8,450</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Won This Month</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">14</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Active Cases</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-purple-600 dark:text-purple-400">6.2hrs</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Prevention Strategies</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                            <li>• <strong>Clear Billing Descriptors:</strong> Use recognizable business name on statements</li>
                            <li>• <strong>Proactive Communication:</strong> Send delivery/access confirmations immediately</li>
                            <li>• <strong>Customer Service Excellence:</strong> Resolve issues before they become disputes</li>
                            <li>• <strong>Fraud Detection:</strong> Block suspicious transactions proactively</li>
                            <li>• <strong>Clear Policies:</strong> Transparent refund and service terms</li>
                            <li>• <strong>Documentation:</strong> Keep detailed records of all customer interactions</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">✅ Dispute Management Checklist</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Setup & Configuration:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Configure dispute webhook endpoints</li>
                            <li>☐ Set up evidence collection workflows</li>
                            <li>☐ Create response templates</li>
                            <li>☐ Implement risk scoring system</li>
                            <li>☐ Set up monitoring and alerts</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Operational Excellence:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Train team on dispute types</li>
                            <li>☐ Establish escalation procedures</li>
                            <li>☐ Review and optimize response rates</li>
                            <li>☐ Implement prevention strategies</li>
                            <li>☐ Regular performance analysis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'stripe-step-7',
              title: 'Payment Analytics',
              description: 'Build payment analytics and reporting',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">📊 Advanced Payment Analytics Dashboard</h3>
                      <p className="text-blue-700 dark:text-blue-300 mb-4">
                        Build comprehensive payment analytics and reporting systems that provide deep insights into revenue patterns, customer behavior, and business performance through automated n8n workflows.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">$127K</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,847</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Transactions</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">$44.60</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">97.3%</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border border-emerald-200 dark:border-emerald-700">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">📈 Revenue Analytics Pipeline</h4>
                      <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">n8n Revenue Tracking Workflow</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Revenue Analytics Pipeline
1. Payment Webhook: Capture successful payments
   ↓
2. Data Enrichment: Add customer and product details
   ↓
3. Revenue Calculation: Calculate net revenue after fees
   ↓
4. Time Series Storage: Store with timestamp for trending
   ↓
5. Cohort Analysis: Group by customer acquisition date
   ↓
6. Geographic Analysis: Analyze by customer location
   ↓
7. Product Performance: Track revenue by product/plan
   ↓
8. Dashboard Update: Push to analytics dashboard
   ↓
9. Alert System: Notify on revenue anomalies
   ↓
10. Report Generation: Create automated reports`}
                            </pre>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Key Revenue Metrics</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Growth Metrics</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Monthly Recurring Revenue (MRR)</li>
                                <li>• Annual Recurring Revenue (ARR)</li>
                                <li>• Revenue Growth Rate</li>
                                <li>• Customer Acquisition Cost (CAC)</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Metrics</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Customer Lifetime Value (CLV)</li>
                                <li>• Average Order Value (AOV)</li>
                                <li>• Purchase Frequency</li>
                                <li>• Customer Retention Rate</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Operational Metrics</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Payment Success Rate</li>
                                <li>• Churn Rate</li>
                                <li>• Refund Rate</li>
                                <li>• Processing Fees</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                      <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🎯 Customer Behavior Analytics</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Purchase Pattern Analysis</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Behavioral Segments</p>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">High Value Customers</span>
                                  <span className="text-sm font-bold text-green-600 dark:text-green-400">23%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Regular Customers</span>
                                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">45%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Occasional Buyers</span>
                                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">32%</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Timing</p>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Peak Hours</span>
                                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">2-4 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Best Days</span>
                                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Tue-Thu</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Seasonal Peak</span>
                                  <span className="text-sm font-bold text-red-600 dark:text-red-400">Q4</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Customer Segmentation Function</h5>
                          <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Function: Customer Segmentation
function segmentCustomer(customerData) {
  const { totalSpent, orderCount, daysSinceFirst, avgOrderValue } = customerData;
  
  // High Value: >$500 spent, >5 orders, <365 days
  if (totalSpent > 500 && orderCount > 5 && daysSinceFirst < 365) {
    return {
      segment: 'HIGH_VALUE',
      priority: 'VIP',
      recommendedActions: ['personal_outreach', 'exclusive_offers', 'loyalty_program']
    };
  }
  
  // Regular: >$100 spent, >2 orders, active in last 90 days
  if (totalSpent > 100 && orderCount > 2 && daysSinceFirst < 90) {
    return {
      segment: 'REGULAR',
      priority: 'STANDARD',
      recommendedActions: ['email_campaigns', 'product_recommendations', 'seasonal_offers']
    };
  }
  
  // At Risk: No purchase in 180+ days
  if (daysSinceFirst > 180) {
    return {
      segment: 'AT_RISK',
      priority: 'RETENTION',
      recommendedActions: ['win_back_campaign', 'special_discount', 'survey_feedback']
    };
  }
  
  return {
    segment: 'OCCASIONAL',
    priority: 'GROWTH',
    recommendedActions: ['nurture_sequence', 'social_proof', 'limited_offers']
  };
}`}
                          </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/30 p-6 rounded-lg border border-amber-200 dark:border-amber-700">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3">📊 Automated Reporting System</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Executive Dashboard Reports</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Daily Reports</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Revenue vs. target tracking</li>
                                <li>• Transaction volume and success rates</li>
                                <li>• Top performing products/plans</li>
                                <li>• Payment method performance</li>
                                <li>• Geographic revenue distribution</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Weekly Reports</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Customer acquisition and churn</li>
                                <li>• Cohort analysis and retention</li>
                                <li>• Revenue trends and forecasting</li>
                                <li>• Failed payment analysis</li>
                                <li>• Competitive benchmarking</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Automated Report Generation</h5>
                        <div className="bg-gray-900 p-3 rounded text-sm">
                            <pre className="text-green-400 whitespace-pre-wrap">
                              {`// n8n Automated Report Workflow
Schedule: Daily at 8 AM
↓
Data Collection: Gather payment data from last 24 hours
↓
Calculations: Compute key metrics and comparisons
↓
Visualization: Generate charts and graphs
↓
Report Assembly: Create PDF/HTML report
↓
Distribution: Email to stakeholders
↓
Dashboard Update: Push to real-time dashboard
↓
Alerts: Flag any anomalies or targets missed
↓
Archive: Store report for historical analysis`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg border border-red-200 dark:border-red-700">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">🚨 Revenue Intelligence & Alerts</h4>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Smart Alert System</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Revenue Alerts</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Daily revenue drops &gt;20%</li>
                                <li>• Monthly target at risk</li>
                                <li>• Unusual payment patterns</li>
                                <li>• High-value customer churn</li>
                                <li>• Refund rate spikes</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Opportunity Alerts</p>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Revenue growth acceleration</li>
                                <li>• New customer segments emerging</li>
                                <li>• Product performance breakouts</li>
                                <li>• Geographic expansion opportunities</li>
                                <li>• Upsell/cross-sell potential</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Revenue Forecasting</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-green-600 dark:text-green-400">$156K</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Next Month</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">$1.8M</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Next Quarter</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-purple-600 dark:text-purple-400">89%</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                              <div className="font-bold text-lg text-orange-600 dark:text-orange-400">+23%</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">YoY Growth</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎯 Implementation Roadmap</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Phase 1: Foundation</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Set up data collection workflows</li>
                            <li>☐ Create basic revenue tracking</li>
                            <li>☐ Implement customer segmentation</li>
                            <li>☐ Build core metrics dashboard</li>
                            <li>☐ Configure basic alerts</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Phase 2: Advanced Analytics</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>☐ Add predictive analytics</li>
                            <li>☐ Implement cohort analysis</li>
                            <li>☐ Create automated reports</li>
                            <li>☐ Build forecasting models</li>
                            <li>☐ Optimize alert system</li>
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
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🎨 Discord Bot Architecture Design</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Create a comprehensive Discord bot architecture that integrates seamlessly with your n8n agents for 
                    automated community management, user engagement, and workflow automation.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🏗️ Step 1: Bot Purpose & Scope Definition</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Define Bot Functions:</strong></p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded border-l-4 border-blue-500`}>
                          <p className="font-medium text-blue-600 dark:text-blue-400">Core Functions</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• User registration & verification</li>
                            <li>• Automated responses & FAQs</li>
                            <li>• Role management & permissions</li>
                            <li>• Content moderation</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded border-l-4 border-green-500`}>
                          <p className="font-medium text-green-600 dark:text-green-400">Agent Integration</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Workflow trigger notifications</li>
                            <li>• Status updates & monitoring</li>
                            <li>• Data collection & analytics</li>
                            <li>• Cross-platform automation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎯 Step 2: Command Structure Planning</h4>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                      {`Discord Bot Command Structure:

┌─ Admin Commands (/admin)
│  ├─ /admin setup - Configure bot settings
│  ├─ /admin monitor - View n8n agent status  
│  └─ /admin logs - Access execution logs
│
├─ User Commands (/agent)
│  ├─ /agent status - Check workflow status
│  ├─ /agent trigger [workflow] - Manual trigger
│  └─ /agent help - Command documentation
│
└─ Automation Commands (/auto)
   ├─ /auto schedule [workflow] - Schedule execution
   ├─ /auto stop [workflow] - Stop running workflow
   └─ /auto report - Generate status report`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">⚙️ Step 3: Permission & Role Design</h4>
                    
                    <div className="space-y-3">
                      <p className="text-sm">Design a hierarchical permission system for bot interactions:</p>
                      <div className="space-y-2">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded flex items-center space-x-3`}>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-red-600 dark:text-red-400">Admin Role</p>
                            <p className="text-sm">Full bot control, n8n workflow management, server settings</p>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded flex items-center space-x-3`}>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-yellow-600 dark:text-yellow-400">Moderator Role</p>
                            <p className="text-sm">Limited workflow control, status monitoring, user management</p>
                          </div>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded flex items-center space-x-3`}>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-green-600 dark:text-green-400">User Role</p>
                            <p className="text-sm">Basic commands, status queries, help documentation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Planning Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Bot purpose and scope documented</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Command structure planned and organized</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Permission hierarchy designed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Integration points with n8n identified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>User experience flow mapped</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-2',
              title: 'Bot Setup',
              description: 'Create and configure Discord bot',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🤖 Discord Bot Creation & Configuration</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Set up a professional Discord bot with proper permissions, security, and n8n integration capabilities 
                    for automated workflow management and community engagement.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🏗️ Step 1: Discord Developer Portal Setup</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Create Discord Application:</strong></p>
                      <p>• Go to <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://discord.com/developers/applications</span></p>
                      <p>• Click "New Application" and name your bot (e.g., "N8N-Agent-Bot")</p>
                      <p>• Add description: "Automated workflow management and community engagement"</p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`Discord Application Configuration:

┌─ General Information
│  ├─ Name: N8N-Agent-Bot
│  ├─ Description: Automated workflow management
│  ├─ App Icon: Upload bot avatar (256x256 PNG)
│  └─ Tags: automation, workflows, integration
│
└─ OAuth2 Settings  
   ├─ Client ID: [Generated automatically]
   ├─ Client Secret: [Keep secure]
   └─ Redirect URLs: Add if using OAuth flows`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔑 Step 2: Bot Token Generation</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Navigate to Bot Section:</strong></p>
                      <p>• Click "Bot" in left sidebar of your application</p>
                      <p>• Click "Add Bot" to create bot user</p>
                      <p>• Configure bot settings and generate token</p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-red-600/20 border-red-500' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600'} border-l-4 p-4 mt-4`}>
                        <p className="font-semibold text-red-700 dark:text-red-400">🚨 Security Critical</p>
                        <p className="text-sm mt-1">Never share your bot token publicly. Store it securely in environment variables.</p>
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`Bot Configuration Settings:

┌─ Bot Settings
│  ├─ Username: n8n-agent-bot
│  ├─ Public Bot: ✅ (Allow others to add)
│  ├─ Require OAuth2 Code Grant: ❌
│  ├─ Bot Permissions: Administrator
│  └─ Token: [Click Reset Token to generate]
│
├─ Privileged Gateway Intents
│  ├─ Presence Intent: ✅ (For user status)
│  ├─ Server Members Intent: ✅ (For member management)
│  └─ Message Content Intent: ✅ (For message processing)
│
└─ Environment Variables
   ├─ DISCORD_BOT_TOKEN=your_bot_token_here
   ├─ DISCORD_CLIENT_ID=your_client_id_here
   └─ DISCORD_GUILD_ID=your_server_id_here`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔗 Step 3: Bot Invitation & Permissions</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Generate Invitation URL:</strong></p>
                      <p>• Go to OAuth2 → URL Generator</p>
                      <p>• Select "bot" and "applications.commands" scopes</p>
                      <p>• Configure required permissions for n8n integration</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded border-l-4 border-blue-500`}>
                          <p className="font-medium text-blue-600 dark:text-blue-400">Essential Permissions</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Send Messages</li>
                            <li>• Use Slash Commands</li>
                            <li>• Read Message History</li>
                            <li>• Manage Messages</li>
                            <li>• Embed Links</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded border-l-4 border-green-500`}>
                          <p className="font-medium text-green-600 dark:text-green-400">Advanced Permissions</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>• Manage Roles</li>
                            <li>• Kick Members</li>
                            <li>• Ban Members</li>
                            <li>• Manage Channels</li>
                            <li>• View Audit Log</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔗 Step 4: n8n Credential Configuration</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Add Discord Credentials in n8n:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`n8n Discord Credential Setup:

1. Go to n8n → Credentials → Add Credential
2. Search for "Discord" 
3. Configure credential fields:

┌─ Discord Bot Credential
│  ├─ Credential Name: Discord Bot Production
│  ├─ Bot Token: [Paste your bot token]
│  ├─ Test Connection: ✅ Verify connection
│  └─ Save: Store credential securely
│
└─ Test Configuration
   ├─ Create simple test workflow
   ├─ Add Discord node
   ├─ Select your credential
   └─ Send test message to verify setup`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Setup Completion Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Discord application created with proper settings</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Bot token generated and stored securely</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Bot invited to server with correct permissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>n8n Discord credentials configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Connection tested successfully</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Environment variables documented</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
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
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">⚡ Discord Slash Commands for n8n Agents</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Create powerful slash commands that allow Discord users to interact with n8n workflows directly, 
                    providing real-time control and monitoring of automated processes through your Discord server.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🏗️ Step 1: Command Registration & Structure</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Register Slash Commands:</strong></p>
                      <p>Create a comprehensive command system for n8n workflow management through Discord.</p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`n8n Discord Command Registration Workflow:

1. Command Registration Trigger
   ├─ Manual Trigger: Run once to register commands
   └─ Discord API: Register slash commands

2. Register Agent Status Command
   ├─ Command: /agent-status
   ├─ Description: "Check n8n workflow status"
   ├─ Options: workflow_name (optional)
   └─ Permissions: @everyone

3. Register Workflow Control Commands  
   ├─ /workflow-start [name] - Start workflow
   ├─ /workflow-stop [name] - Stop workflow  
   ├─ /workflow-trigger [name] - Manual trigger
   └─ /workflow-logs [name] - View execution logs

4. Register Admin Commands
   ├─ /admin-monitor - Full system status
   ├─ /admin-restart [workflow] - Restart workflow
   └─ /admin-config - Configuration management`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🤖 Step 2: Command Handler Implementation</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Create Command Processing Workflow:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`Discord Command Handler n8n Workflow:

┌─ Webhook Trigger (Discord Slash Commands)
│  ├─ Endpoint: /webhook/discord-commands
│  ├─ Method: POST
│  └─ Authentication: Discord signature verification
│
├─ Command Router (Switch Node)
│  ├─ /agent-status → Agent Status Handler
│  ├─ /workflow-start → Workflow Starter
│  ├─ /workflow-stop → Workflow Stopper
│  ├─ /admin-monitor → Admin Dashboard
│  └─ default → Help Message
│
├─ Permission Checker (Function Node)
│  ├─ Check user roles and permissions
│  ├─ Validate command access level
│  └─ Return authorization status
│
└─ Response Formatter (Discord Reply)
   ├─ Format response message
   ├─ Add embeds and buttons
   └─ Send reply to Discord`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎮 Step 3: Interactive Command Examples</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-blue-500`}>
                        <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Agent Status Command</p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm font-mono`}>
                          {`/agent-status data-processor

Response:
📊 Workflow Status: data-processor
🟢 Status: Running
⏱️ Last Execution: 2 min ago
📈 Success Rate: 98.5%
🔄 Next Run: 15 min
[Stop] [Restart] [View Logs]`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-green-500`}>
                        <p className="font-medium text-green-600 dark:text-green-400 mb-2">Workflow Control</p>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm font-mono`}>
                          {`/workflow-start email-automation

Response:
🚀 Starting Workflow...
✅ Email Automation Started
📧 Processing 47 pending emails
⏱️ Estimated completion: 3 min
[Monitor Progress] [Stop if Needed]`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔧 Step 4: Advanced Command Features</h4>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                        <p className="font-medium mb-2">Auto-Complete & Validation:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Dynamic workflow name suggestions</li>
                          <li>• Parameter validation before execution</li>
                          <li>• Real-time permission checking</li>
                          <li>• Context-aware command availability</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                        <p className="font-medium mb-2">Error Handling & Feedback:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Graceful error messages with solutions</li>
                          <li>• Command usage hints and examples</li>
                          <li>• Automatic retry suggestions</li>
                          <li>• Help command with detailed documentation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Command Implementation Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Slash commands registered in Discord</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Command handler workflow created</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Permission system implemented</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Interactive responses with buttons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Error handling and validation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Commands tested with different user roles</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-4',
              title: 'Agent Notifications',
              description: 'Send agent updates to Discord channels',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">📢 Automated Discord Notifications for n8n Agents</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Create a sophisticated notification system that keeps your Discord community informed about 
                    n8n workflow executions, system status changes, and important alerts in real-time.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🚨 Step 1: Notification Channel Setup</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Create Dedicated Channels:</strong></p>
                      <p>Organize notifications into specific channels for different types of updates.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded border-l-4 border-green-500`}>
                          <p className="font-medium text-green-600 dark:text-green-400">Success Notifications</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>📊 #workflow-success</li>
                            <li>💰 #payment-completed</li>
                            <li>📧 #email-sent</li>
                            <li>✅ #data-processed</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-3 rounded border-l-4 border-red-500`}>
                          <p className="font-medium text-red-600 dark:text-red-400">Alert Notifications</p>
                          <ul className="text-sm mt-2 space-y-1">
                            <li>🚨 #workflow-errors</li>
                            <li>⚠️ #system-alerts</li>
                            <li>🔄 #retry-notifications</li>
                            <li>🚫 #failed-processes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎨 Step 2: Rich Embed Notifications</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Design Notification Templates:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`Discord Embed Notification Template:

Success Notification Example:
┌─ Discord Embed
│  ├─ Title: "✅ Workflow Completed Successfully"
│  ├─ Color: Green (#00ff00)
│  ├─ Description: "Data processing workflow finished"
│  ├─ Fields:
│  │   ├─ Workflow: "customer-data-sync"
│  │   ├─ Duration: "2m 34s"
│  │   ├─ Records: "1,247 processed"
│  │   └─ Next Run: "In 1 hour"
│  ├─ Thumbnail: Workflow icon/logo
│  ├─ Footer: "Automated by n8n • timestamp"
│  └─ Actions: [View Details] [Schedule Next]

Error Notification Example:
┌─ Discord Embed  
│  ├─ Title: "❌ Workflow Error Detected"
│  ├─ Color: Red (#ff0000)
│  ├─ Description: "API connection failed"
│  ├─ Fields:
│  │   ├─ Workflow: "email-automation"
│  │   ├─ Error: "Connection timeout (5000ms)"
│  │   ├─ Node: "Gmail API Call"
│  │   └─ Retry: "Automatic in 5 minutes"
│  └─ Actions: [Retry Now] [View Logs] [Disable]`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">⚡ Step 3: Smart Notification Filtering</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Implement Intelligent Filtering:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`n8n Notification Filter Logic:

┌─ Notification Filter Workflow
│  ├─ Input: Workflow execution data
│  ├─ Priority Assessment:
│  │   ├─ Critical: Immediate notification
│  │   ├─ High: 5-minute batch
│  │   ├─ Medium: Hourly summary
│  │   └─ Low: Daily digest
│  │
│  ├─ Frequency Control:
│  │   ├─ Rate limiting: Max 10/minute
│  │   ├─ Duplicate detection: 15-minute window
│  │   └─ Quiet hours: 11pm - 7am
│  │
│  └─ Channel Routing:
│      ├─ Success → #workflow-success
│      ├─ Errors → #workflow-errors  
│      ├─ Admin alerts → #admin-only
│      └─ System status → #status-updates`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔔 Step 4: Interactive Notification Actions</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded`}>
                        <p className="font-medium mb-2">Success Actions:</p>
                        <ul className="text-sm space-y-1">
                          <li>🔍 View detailed execution log</li>
                          <li>📊 Open workflow dashboard</li>
                          <li>⏭️ Trigger next workflow</li>
                          <li>📋 Copy execution summary</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded`}>
                        <p className="font-medium mb-2">Error Actions:</p>
                        <ul className="text-sm space-y-1">
                          <li>🔄 Retry failed execution</li>
                          <li>🛠️ Edit workflow settings</li>
                          <li>⏸️ Pause workflow temporarily</li>
                          <li>👥 Notify team members</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Notification System Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Dedicated notification channels created</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Rich embed templates designed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Smart filtering and rate limiting</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Interactive action buttons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Channel permissions configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Notification testing completed</span>
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
          description: 'Advanced Discord features',
          steps: [
            {
              id: 'discord-step-5',
              title: 'Interactive Components',
              description: 'Create buttons and forms for agent control',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🎮 Interactive Discord Components for n8n Workflow Control</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Build sophisticated interactive Discord interfaces using buttons, select menus, and modal forms 
                    that provide intuitive workflow control and real-time interaction with your n8n automation systems.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔘 Step 1: Button Components for Workflow Control</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Design Interactive Button Layouts:</strong></p>
                      <p>Create dynamic button interfaces that adapt based on workflow states and user permissions.</p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`Discord Button Component Architecture:

Status Dashboard Example:
┌─ Workflow Status Embed
│  ├─ Title: "📊 Production Workflows Dashboard"
│  ├─ Description: Real-time n8n workflow monitoring
│  └─ Action Rows:
│      ├─ Row 1: Primary Controls
│      │   ├─ [▶️ Start All] - Start all workflows
│      │   ├─ [⏸️ Pause All] - Pause all workflows
│      │   └─ [🔄 Refresh] - Update status display
│      │
│      ├─ Row 2: Individual Workflow Controls  
│      │   ├─ [📧 Email Bot] - Toggle email automation
│      │   ├─ [💰 Payment] - Toggle payment processing
│      │   └─ [📊 Analytics] - Toggle data collection
│      │
│      └─ Row 3: Administrative
│          ├─ [📋 View Logs] - Open execution logs
│          ├─ [⚙️ Settings] - Configuration panel
│          └─ [🚨 Alerts] - Alert management

Workflow-Specific Controls:
┌─ Individual Workflow Card
│  ├─ Status: 🟢 Running | 🔴 Stopped | 🟡 Warning
│  ├─ Last Run: "2 minutes ago"
│  ├─ Success Rate: "98.5%"
│  └─ Actions:
│      ├─ [▶️/⏸️] - Start/Stop toggle
│      ├─ [🔄] - Manual trigger
│      ├─ [⚙️] - Quick settings
│      └─ [📈] - Performance metrics`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Step 2: Select Menu & Dropdown Interfaces</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Advanced Selection Controls:</strong></p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-blue-500`}>
                          <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Workflow Selection Menu</p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm font-mono`}>
                            {`Select Workflow to Monitor:
└─ 📧 Email Automation (Active)
└─ 💰 Payment Processing (Paused)  
└─ 📊 Data Analytics (Running)
└─ 🔔 Notification System (Active)
└─ 🔄 Backup Workflows (Scheduled)

[Select] [Cancel]`}
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-green-500`}>
                          <p className="font-medium text-green-600 dark:text-green-400 mb-2">Action Selection Menu</p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm font-mono`}>
                            {`Choose Action for "Email Automation":
└─ ▶️ Start Workflow
└─ ⏸️ Pause Workflow
└─ 🔄 Trigger Manual Run
└─ ⚙️ Modify Settings
└─ 📋 View Execution History
└─ 🗑️ Delete Workflow

[Execute] [Cancel]`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📝 Step 3: Modal Forms for Configuration</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Advanced Configuration Modals:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`n8n Workflow Configuration Modal:

┌─ Modal: "⚙️ Configure Email Automation"
│  ├─ Title: "Email Workflow Settings"
│  ├─ Form Fields:
│  │   ├─ Schedule: [Dropdown] Every 15 minutes
│  │   ├─ Email Template: [Select] Welcome Series
│  │   ├─ Recipient List: [Text] subscribers@list.com
│  │   ├─ Send Limit: [Number] 100 per hour
│  │   ├─ Retry Count: [Number] 3 attempts
│  │   └─ Priority: [Radio] Normal | High | Critical
│  │
│  ├─ Advanced Options: [Checkbox] Show advanced
│  │   ├─ Custom Headers: [Text Area]
│  │   ├─ Webhook URL: [Text] https://...
│  │   └─ Error Handler: [Select] Slack notification
│  │
│  └─ Actions:
│      ├─ [💾 Save Changes] - Apply configuration
│      ├─ [🧪 Test Settings] - Validate setup
│      └─ [❌ Cancel] - Discard changes

Modal Response Handling:
┌─ Form Submission Workflow
│  ├─ Validate input data
│  ├─ Update n8n workflow settings  
│  ├─ Test configuration changes
│  ├─ Send confirmation message
│  └─ Update dashboard display`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔄 Step 4: Real-time Component State Management</h4>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                        <p className="font-medium mb-2">Dynamic Button States:</p>
                        <ul className="text-sm space-y-1">
                          <li>• ▶️ → ⏸️ Start/Stop button state synchronization</li>
                          <li>• 🔄 Loading indicators during workflow execution</li>
                          <li>• ❌ Disabled states for unauthorized actions</li>
                          <li>• 🔔 Badge notifications for state changes</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                        <p className="font-medium mb-2">Component Interaction Flow:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Click button → Show loading state → Execute action</li>
                          <li>• Update n8n → Refresh component → Show result</li>
                          <li>• Error handling → Show error state → Retry option</li>
                          <li>• Success confirmation → Update UI → Log action</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Interactive Components Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Button components for workflow control</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Select menus for option selection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Modal forms for configuration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Real-time state synchronization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Error handling and validation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>User experience testing completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-6',
              title: 'Voice Integration',
              description: 'Integrate agent with Discord voice channels',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🎤 Discord Voice Channel Integration with n8n Agents</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Create advanced voice-enabled Discord bots that can join voice channels, process audio commands, 
                    and provide audio feedback for n8n workflow automation with speech recognition and synthesis.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔊 Step 1: Voice Channel Connection Setup</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Bot Voice Capabilities Configuration:</strong></p>
                      <p>Set up your Discord bot to join, manage, and interact with voice channels for workflow automation.</p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`Discord Voice Integration Architecture:

Bot Voice Permissions Required:
┌─ Voice Channel Permissions
│  ├─ Connect - Join voice channels
│  ├─ Speak - Play audio/TTS responses
│  ├─ Use Voice Activity - Voice commands
│  ├─ Priority Speaker - Override others when needed
│  └─ Move Members - Manage users in channels

Voice Connection Workflow:
┌─ n8n Voice Bot Controller
│  ├─ Trigger: Voice command detected
│  ├─ Action: Join specified voice channel
│  ├─ Process: Audio stream analysis
│  ├─ Response: Execute workflow based on command
│  └─ Feedback: Provide audio confirmation

Channel Management Commands:
├─ /voice join [channel] - Bot joins voice channel
├─ /voice leave - Bot disconnects from voice
├─ /voice status - Show current voice status
├─ /voice commands - List available voice commands
└─ /voice settings - Configure voice behavior`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎙️ Step 2: Speech Recognition & Voice Commands</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Voice Command Processing System:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`Voice Command Recognition Workflow:

Speech-to-Text Processing:
┌─ Audio Input Stream
│  ├─ Capture: Discord voice channel audio
│  ├─ Filter: Noise reduction and cleanup  
│  ├─ Convert: Audio to text (OpenAI Whisper)
│  ├─ Parse: Extract command and parameters
│  └─ Execute: Trigger corresponding n8n workflow

Voice Command Examples:
├─ "Agent, start email automation"
│   └─ Triggers: Email workflow activation
├─ "Agent, check payment status"  
│   └─ Triggers: Payment system status check
├─ "Agent, pause all workflows"
│   └─ Triggers: Bulk workflow pause operation
├─ "Agent, send daily report"
│   └─ Triggers: Report generation and distribution
└─ "Agent, show server statistics"
    └─ Triggers: System metrics collection

Command Processing Logic:
┌─ Voice Command Parser (n8n Function Node)
│  ├─ Wake Word Detection: "Agent" or "Hey N8N"
│  ├─ Intent Recognition: Classify command type
│  ├─ Parameter Extraction: Get workflow names/params
│  ├─ Permission Validation: Check user authorization
│  ├─ Workflow Execution: Trigger appropriate action
│  └─ Response Generation: Prepare audio feedback`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔊 Step 3: Text-to-Speech Response System</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Dynamic Audio Response Generation:</strong></p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-blue-500`}>
                          <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Success Responses</p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm`}>
                            <p>"Email automation has been started successfully. Currently processing 47 pending messages."</p>
                            <br />
                            <p>"Payment status check complete. All systems operational with 99.8% uptime."</p>
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-red-500`}>
                          <p className="font-medium text-red-600 dark:text-red-400 mb-2">Error Responses</p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm`}>
                            <p>"Sorry, I couldn't start the email workflow due to an API connection error. Please check the settings."</p>
                            <br />
                            <p>"I don't have permission to execute that command. Please contact an administrator."</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`TTS Response Generation Pipeline:

┌─ Response Builder (n8n Function)
│  ├─ Input: Workflow execution result
│  ├─ Template: Select appropriate response template
│  ├─ Personalization: Add user name and context
│  ├─ Data Integration: Include relevant metrics
│  └─ Output: Formatted response text

┌─ Audio Generation (OpenAI TTS/ElevenLabs)
│  ├─ Text Input: Generated response text
│  ├─ Voice Selection: Professional/friendly tone
│  ├─ Speed & Pitch: Optimized for clarity
│  ├─ Format: High-quality audio for Discord
│  └─ Delivery: Stream to voice channel

┌─ Audio Enhancement
│  ├─ Noise Gate: Clean audio output
│  ├─ Compression: Consistent volume levels
│  ├─ EQ: Clear speech frequencies
│  └─ Limiting: Prevent audio clipping`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🎵 Step 4: Advanced Voice Features</h4>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                        <p className="font-medium mb-2">Smart Voice Controls:</p>
                        <ul className="text-sm space-y-1">
                          <li>• 🎯 Multi-user voice command queuing</li>
                          <li>• 🔇 Automatic noise suppression and filtering</li>
                          <li>• 📊 Voice analytics and command success tracking</li>
                          <li>• 🔄 Conversation context and command chaining</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                        <p className="font-medium mb-2">Audio Notification System:</p>
                        <ul className="text-sm space-y-1">
                          <li>• 🔔 Workflow completion audio alerts</li>
                          <li>• ⚠️ Error notifications with diagnostic information</li>
                          <li>• 📈 Scheduled status reports and summaries</li>
                          <li>• 🎼 Custom audio themes for different workflow types</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`Advanced Voice Integration Features:

Voice Command Chains:
"Agent, start email automation, then run analytics, 
and notify me when both are complete"

Multi-Step Confirmations:
User: "Agent, delete all test workflows"
Bot: "This will delete 5 test workflows. Say 'confirm' to proceed"
User: "Confirm"
Bot: "Deletion completed. 5 workflows removed."

Voice-Activated Dashboard:
"Agent, give me the daily summary"
→ Plays audio report with key metrics
→ Optionally posts visual summary to text channel`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Voice Integration Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Voice channel connection and permissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Speech-to-text integration configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Voice command processing workflow</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Text-to-speech response system</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Audio quality optimization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Voice commands tested with multiple users</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'discord-step-7',
              title: 'Server Management',
              description: 'Automate Discord server moderation with agents',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-4">🛡️ Automated Discord Server Management with n8n Agents</h3>
                  
                  <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    Build intelligent server management automation that handles moderation, user engagement, 
                    analytics, and community growth through sophisticated n8n workflows integrated with Discord.
                  </p>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'} p-4 rounded-lg mb-6`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🔨 Step 1: Automated Moderation System</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Intelligent Content Moderation:</strong></p>
                      <p>Create a comprehensive moderation system that automatically handles rule violations and maintains community standards.</p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`Automated Moderation Workflow:

Message Monitoring Pipeline:
┌─ Discord Message Trigger
│  ├─ Capture: All server messages in real-time
│  ├─ Filter: Exclude bot messages and moderators  
│  ├─ Analyze: Content, links, attachments, user history
│  └─ Route: To appropriate moderation workflow

Content Analysis System:
┌─ Multi-Layer Analysis (n8n Function Nodes)
│  ├─ Spam Detection: Repeated messages, rate limits
│  ├─ Toxicity Check: AI-powered sentiment analysis
│  ├─ Link Validation: Malicious URL detection
│  ├─ Image Scanning: NSFW and inappropriate content
│  ├─ Language Filter: Profanity and hate speech
│  └─ Scam Detection: Phishing and fraud patterns

Automated Actions:
├─ Level 1: Warning + Message deletion
├─ Level 2: Temporary timeout (5-60 minutes)
├─ Level 3: Role restrictions (24 hours)
├─ Level 4: Temporary ban (1-7 days)
└─ Level 5: Permanent ban + report to admins

Moderation Escalation:
┌─ Human Review Queue
│  ├─ Borderline cases → Moderator review
│  ├─ Repeat offenders → Admin notification
│  ├─ Severe violations → Immediate escalation
│  └─ Appeal system → Structured review process`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">👥 Step 2: Member Management & Onboarding</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Automated User Journey Management:</strong></p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-green-500`}>
                          <p className="font-medium text-green-600 dark:text-green-400 mb-2">New Member Workflow</p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm`}>
                            <ul className="space-y-1">
                              <li>🎉 Welcome message with server rules</li>
                              <li>🎯 Automatic role assignment based on verification</li>
                              <li>📚 Guided tour of important channels</li>
                              <li>💬 Introduction prompt and ice-breakers</li>
                              <li>📊 Add to engagement tracking system</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-white dark:bg-gray-700'} p-4 rounded border-l-4 border-blue-500`}>
                          <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Role Progression System</p>
                          <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded text-sm`}>
                            <ul className="space-y-1">
                              <li>⭐ Activity-based role upgrades</li>
                              <li>🏆 Achievement badges and recognition</li>
                              <li>🎖️ Contribution tracking and rewards</li>
                              <li>📈 Engagement metrics monitoring</li>
                              <li>🔄 Automatic role adjustments</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm mt-4`}>
                        {`Member Lifecycle Management:

User Verification Process:
┌─ New Member Detection
│  ├─ Send welcome DM with verification instructions
│  ├─ Assign @Unverified role (limited channel access)
│  ├─ Start 24-hour verification timer
│  └─ Monitor for verification completion

Verification Steps:
├─ React to welcome message ✅
├─ Read and accept server rules 📋
├─ Complete profile (optional) 👤
├─ Join introduction channel 💬
└─ Pass basic activity check (24h) ⏰

Post-Verification Actions:
├─ Remove @Unverified role
├─ Assign @Member role + channel access
├─ Send server guide and resources
├─ Add to activity tracking system
└─ Enable reputation system participation

Engagement Automation:
┌─ Activity Monitoring
│  ├─ Message count and quality tracking
│  ├─ Voice channel participation
│  ├─ Reaction patterns and interactions
│  ├─ Helper behavior and support given
│  └─ Event participation and attendance`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📊 Step 3: Community Analytics & Insights</h4>
                    
                    <div className="space-y-3">
                      <p className="mb-2"><strong>1. Comprehensive Server Analytics Dashboard:</strong></p>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`Analytics Collection & Reporting:

Real-time Metrics Dashboard:
┌─ Member Statistics
│  ├─ Total Members: 1,247 (+12 this week)
│  ├─ Active Members: 834 (67% engagement)
│  ├─ New Joins: 23 (last 7 days)
│  ├─ Member Retention: 89% (30-day)
│  └─ Top Contributors: @user1, @user2, @user3

Channel Activity Analysis:
├─ Most Active Channels:
│   ├─ #general: 1,234 messages/week
│   ├─ #help: 456 messages/week
│   └─ #announcements: 12 messages/week
├─ Peak Activity Times:
│   ├─ Weekdays: 6-9 PM UTC
│   └─ Weekends: 2-6 PM UTC
└─ Engagement Trends:
    ├─ Voice Chat: +15% this month
    ├─ Reactions: +8% this month
    └─ Thread Creation: +22% this month

Automated Reports:
┌─ Daily Summary (sent to #staff-analytics)
│  ├─ Member count changes
│  ├─ Moderation actions taken
│  ├─ Top messages and interactions
│  └─ Issues requiring attention

┌─ Weekly Deep Dive (sent to admins)
│  ├─ Growth rate analysis
│  ├─ Engagement pattern insights
│  ├─ Community health metrics
│  └─ Recommendations for improvement`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-purple-50 dark:bg-purple-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">🚀 Step 4: Community Growth Automation</h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                          <p className="font-medium mb-2">Engagement Boosting:</p>
                          <ul className="text-sm space-y-1">
                            <li>🎯 Automated conversation starters</li>
                            <li>🎲 Daily questions and polls</li>
                            <li>🏆 Weekly challenges and contests</li>
                            <li>📅 Event scheduling and reminders</li>
                            <li>🎉 Member milestone celebrations</li>
                          </ul>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg`}>
                          <p className="font-medium mb-2">Content Management:</p>
                          <ul className="text-sm space-y-1">
                            <li>📝 Automated content posting schedule</li>
                            <li>📚 Resource sharing and curation</li>
                            <li>🔄 Cross-posting from other platforms</li>
                            <li>📊 Content performance tracking</li>
                            <li>💡 AI-generated discussion topics</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded-lg font-mono text-sm`}>
                        {`Community Growth Strategies:

Retention Optimization:
┌─ Member Engagement Workflow
│  ├─ Identify inactive members (7+ days)
│  ├─ Send personalized re-engagement DM
│  ├─ Suggest relevant channels and content
│  ├─ Invite to upcoming events
│  └─ Track response and adjust approach

Community Events Automation:
├─ Weekly events scheduling
├─ Reminder notifications (24h, 1h, 15m)
├─ Attendance tracking and follow-up
├─ Event feedback collection
└─ Success metrics and improvement suggestions

Recognition & Rewards System:
┌─ Achievement Tracking
│  ├─ Helpful member badges
│  ├─ Milestone celebrations (join anniversary)
│  ├─ Contribution leaderboards
│  ├─ Special role assignments
│  └─ Community spotlight features`}
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-green-50 dark:bg-green-900/20'} p-4 rounded-lg`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">📋 Server Management Checklist</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Automated moderation system deployed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Member onboarding workflow active</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Role progression system configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Analytics dashboard operational</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Community growth automation enabled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Escalation procedures tested</span>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Agent Design</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>AI Agent Architecture</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">1. Input</div>
                        <div className="text-xs">Receive data</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">2. AI Process</div>
                        <div className="text-xs">Smart analysis</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">3. Action</div>
                        <div className="text-xs">Execute tasks</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      AI agents combine OpenAI's intelligence with n8n's automation power to create smart workflows that understand context and make decisions.
                    </p>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Core AI Capabilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Text Processing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Natural language understanding</li>
                          <li>• Content analysis</li>
                          <li>• Sentiment detection</li>
                          <li>• Language translation</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Decision Making</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Context-aware reasoning</li>
                          <li>• Data-driven choices</li>
                          <li>• Risk assessment</li>
                          <li>• Priority evaluation</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Content Creation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Generate text content</li>
                          <li>• Create summaries</li>
                          <li>• Write code snippets</li>
                          <li>• Compose emails</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Agent Design Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Content Analyzer Agent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Analyzes incoming content for sentiment, topics, and key insights
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Webhook → OpenAI Analysis → Database → Notifications
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Smart Email Assistant</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Drafts personalized email responses based on context and tone
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Email Trigger → AI Draft → Human Review → Send
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3. Data Intelligence Agent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Processes data and generates insights and recommendations
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Scheduled Trigger → Data Fetch → AI Analysis → Report
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Getting Started</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Design Phase:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Define agent purpose</li>
                          <li>☐ Map input/output</li>
                          <li>☐ Choose OpenAI model</li>
                          <li>☐ Design prompts</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Implementation:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Create n8n workflow</li>
                          <li>☐ Add OpenAI nodes</li>
                          <li>☐ Test with sample data</li>
                          <li>☐ Deploy to production</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'openai-step-2',
              title: 'OpenAI API Setup',
              description: 'Configure OpenAI credentials and models',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>OpenAI API Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>API Key Configuration</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Set up your OpenAI API credentials in n8n to enable AI-powered workflow automation with GPT models.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">1</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Get API Key</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Add to n8n</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Test Connection</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Step-by-Step Setup</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Get Your OpenAI API Key</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Go to platform.openai.com</li>
                          <li>• Sign in to your OpenAI account</li>
                          <li>• Navigate to API Keys section</li>
                          <li>• Click "Create new secret key"</li>
                          <li>• Copy the key (save it securely)</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Add Credentials to n8n</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Open n8n workflow editor</li>
                          <li>• Go to Settings → Credentials</li>
                          <li>• Click "Add Credential"</li>
                          <li>• Select "OpenAI API"</li>
                          <li>• Paste your API key and save</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Model Selection Guide</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>GPT-4</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Most capable model for complex reasoning and analysis
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Best for: Complex analysis, coding, detailed content
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>GPT-3.5 Turbo</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Fast and cost-effective for most automation tasks
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Best for: Text processing, summaries, simple tasks
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Setup Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Account Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Create OpenAI account</li>
                          <li>☐ Add payment method</li>
                          <li>☐ Generate API key</li>
                          <li>☐ Set usage limits</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">n8n Integration:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Add OpenAI credentials</li>
                          <li>☐ Test connection</li>
                          <li>☐ Choose default model</li>
                          <li>☐ Create first workflow</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Text Generation</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>AI Content Generation</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Generate high-quality text content automatically using OpenAI in your n8n workflows for blogs, emails, social media, and more.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">📝</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📧</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Emails</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">📱</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Social Media</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Content Generation Workflows</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Blog Post Generator</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Automatically generate blog posts from topics, keywords, or research data
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Trigger → Topic Research → OpenAI Generate → Format → Publish
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Email Campaign Creator</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Generate personalized email content based on customer data and campaign goals
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Customer Data → AI Personalization → Email Template → Send
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Prompt Engineering Tips</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Content Structure</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Define clear content type and purpose</li>
                          <li>• Specify target audience and tone</li>
                          <li>• Include key points or outline</li>
                          <li>• Set word count or length requirements</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Quality Enhancement</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Add context and background information</li>
                          <li>• Request specific formatting or style</li>
                          <li>• Include examples of desired output</li>
                          <li>• Ask for multiple variations to choose from</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Configure OpenAI node in workflow</li>
                          <li>☐ Create content generation prompts</li>
                          <li>☐ Set up input data sources</li>
                          <li>☐ Define output formatting</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Optimization:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Test with sample content</li>
                          <li>☐ Refine prompts for better results</li>
                          <li>☐ Add quality control checks</li>
                          <li>☐ Monitor generation costs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'openai-step-4',
              title: 'Data Analysis',
              description: 'Analyze data using AI in agent workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Data Analysis</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>AI-Powered Data Insights</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Leverage OpenAI to automatically analyze data, extract insights, and generate actionable reports from your business data.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">📊</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Data Insights</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📈</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Trend Analysis</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🎯</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Recommendations</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Analysis Workflows</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Sales Data Analyzer</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Analyze sales trends, identify patterns, and generate insights for business decisions
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Sales Data → AI Analysis → Insights Report → Action Items
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Customer Behavior Analysis</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Understand customer patterns and preferences to improve targeting and engagement
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          User Data → Behavior Analysis → Segmentation → Personalization
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Analysis Types</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Descriptive Analysis</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Summarize historical data patterns</li>
                          <li>• Identify key metrics and KPIs</li>
                          <li>• Generate executive summaries</li>
                          <li>• Create data narratives</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Predictive Insights</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Forecast future trends</li>
                          <li>• Identify potential opportunities</li>
                          <li>• Risk assessment and mitigation</li>
                          <li>• Scenario planning recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Data Preparation:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Connect data sources</li>
                          <li>☐ Clean and format data</li>
                          <li>☐ Define analysis objectives</li>
                          <li>☐ Set up data validation</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Analysis Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Configure OpenAI analysis prompts</li>
                          <li>☐ Set up automated reporting</li>
                          <li>☐ Test analysis accuracy</li>
                          <li>☐ Schedule regular analysis runs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Function Calling</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Advanced OpenAI Function Calling</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Enable OpenAI to call external functions and APIs directly, creating intelligent agents that can take actions and interact with your systems.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔧</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Function Calls</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Real Actions</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🤖</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Smart Agents</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Function Call Examples</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Database Operations</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Allow AI to query, insert, or update database records based on natural language requests
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          User Request → AI Analysis → Function Call → Database Action
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Integrations</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Connect AI to external APIs for weather, stock prices, or any third-party service
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          AI Decision → API Call → Data Processing → Response
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Function Definition</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Function Schema</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Define function name and description</li>
                          <li>• Specify required and optional parameters</li>
                          <li>• Set parameter types and validation</li>
                          <li>• Document expected return values</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Implementation Tips</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Keep functions focused and specific</li>
                          <li>• Add proper error handling</li>
                          <li>• Include validation for all inputs</li>
                          <li>• Return structured data formats</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Security Considerations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Access Control</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Validate all function parameters</li>
                          <li>• Implement proper authentication</li>
                          <li>• Limit function capabilities</li>
                          <li>• Log all function calls</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Best Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use least privilege principle</li>
                          <li>• Sanitize all inputs</li>
                          <li>• Monitor function usage</li>
                          <li>• Set rate limits and quotas</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Function Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Define function schemas</li>
                          <li>☐ Implement function logic</li>
                          <li>☐ Add error handling</li>
                          <li>☐ Test function calls</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Integration:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Configure OpenAI function calling</li>
                          <li>☐ Set up security measures</li>
                          <li>☐ Monitor function performance</li>
                          <li>☐ Document function usage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'openai-step-6',
              title: 'Agent Conversations',
              description: 'Create conversational AI agents',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Agent Conversations</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Conversational AI Agents</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Build intelligent conversational agents that maintain context, remember previous interactions, and provide natural, human-like responses.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">💬</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Natural Chat</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🧠</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Context Memory</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🎯</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Goal-Oriented</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Conversation Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Customer Support Agent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Handle support tickets with context-aware responses and escalation capabilities
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          User Query → Context Check → AI Response → Action/Escalation
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Sales Assistant Agent</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Guide prospects through the sales process with personalized recommendations
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Lead Info → Qualification → Product Match → Proposal → Follow-up
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Context Management</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Conversation Memory</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Store conversation history in database</li>
                          <li>• Track user preferences and context</li>
                          <li>• Maintain session state across interactions</li>
                          <li>• Reference previous conversations</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Personality Design</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Define agent personality and tone</li>
                          <li>• Set response style and vocabulary</li>
                          <li>• Create consistent brand voice</li>
                          <li>• Add humor or professional tone</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Advanced Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Multi-turn Conversations</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Handle complex multi-step dialogs</li>
                          <li>• Ask clarifying questions</li>
                          <li>• Guide users through processes</li>
                          <li>• Maintain conversation flow</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Intent Recognition</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Identify user goals and intents</li>
                          <li>• Route to appropriate workflows</li>
                          <li>• Handle multiple intents per message</li>
                          <li>• Escalate when needed</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Conversation Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Design conversation flows</li>
                          <li>☐ Set up context storage</li>
                          <li>☐ Define agent personality</li>
                          <li>☐ Create response templates</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Enhancement:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Add intent recognition</li>
                          <li>☐ Implement escalation rules</li>
                          <li>☐ Test conversation quality</li>
                          <li>☐ Monitor agent performance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'openai-step-7',
              title: 'Custom Models',
              description: 'Fine-tune models for specific agent tasks',
              estimated_time: '50 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Models</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Custom AI Model Integration</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Fine-tune and deploy custom OpenAI models for specialized use cases, or integrate with other AI providers for diverse capabilities.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔬</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Fine-tuning</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚙️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Custom Models</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Multi-Provider</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Fine-tuning Process</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Preparation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Prepare high-quality training data specific to your domain and use case
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Raw Data → Cleaning → Formatting → Validation → Upload
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Model Training</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Configure training parameters and monitor the fine-tuning process
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Base Model → Training Job → Validation → Custom Model
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Use Cases</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Domain-Specific Models</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Medical/Healthcare AI assistants</li>
                          <li>• Legal document analysis</li>
                          <li>• Financial report generation</li>
                          <li>• Technical documentation writing</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Brand-Specific Training</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Company-specific tone and voice</li>
                          <li>• Product knowledge integration</li>
                          <li>• Internal process automation</li>
                          <li>• Customer service optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Alternative AI Providers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Provider Options</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Anthropic Claude for reasoning</li>
                          <li>• Google PaLM for efficiency</li>
                          <li>• Cohere for embeddings</li>
                          <li>• Hugging Face open models</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Integration Benefits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cost optimization strategies</li>
                          <li>• Redundancy and reliability</li>
                          <li>• Specialized model capabilities</li>
                          <li>• Performance comparison</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Model Development:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Collect training data</li>
                          <li>☐ Prepare data format</li>
                          <li>☐ Configure fine-tuning job</li>
                          <li>☐ Validate model performance</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Deployment:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Deploy custom model</li>
                          <li>☐ Test model integration</li>
                          <li>☐ Monitor model performance</li>
                          <li>☐ Set up model versioning</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Agent-Zapier Bridge</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>n8n-Zapier Integration Bridge</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Connect your n8n AI agents with Zapier's 5000+ app ecosystem, enabling seamless data flow between platforms and automated workflows.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🌉</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bridge Connection</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Real-time Sync</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Bi-directional</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Integration Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>CRM Data Sync</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Automatically sync lead data between n8n AI analysis and CRM systems like Salesforce, HubSpot
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          n8n Lead Analysis → Zapier → CRM Update → Follow-up Actions
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Social Media Automation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Generate content in n8n and automatically post to social platforms via Zapier connections
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          AI Content Creation → Zapier → Multi-Platform Posting → Analytics
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Bridge Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Keys Setup</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Generate n8n webhook URLs</li>
                          <li>• Configure Zapier API connections</li>
                          <li>• Set up authentication tokens</li>
                          <li>• Test connection stability</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Mapping</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Map n8n output fields to Zapier inputs</li>
                          <li>• Handle data type conversions</li>
                          <li>• Set up error handling and retries</li>
                          <li>• Configure data validation rules</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Bridge Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Create n8n webhook endpoints</li>
                          <li>☐ Set up Zapier zap triggers</li>
                          <li>☐ Configure authentication</li>
                          <li>☐ Map data fields</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Testing:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Test data flow both directions</li>
                          <li>☐ Verify error handling</li>
                          <li>☐ Monitor performance</li>
                          <li>☐ Document integration process</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'zapier-step-2',
              title: 'Zapier Webhooks',
              description: 'Setup webhooks for Zapier integration',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Zapier Webhooks</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Webhook Communication Setup</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Configure secure webhook connections between n8n and Zapier for instant data transmission and real-time automation triggers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔗</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Webhook URLs</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔒</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Secure Transfer</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Instant Triggers</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Webhook Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>n8n Webhook Setup</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Create webhook nodes in n8n to receive data from Zapier and trigger automated workflows
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Add Webhook Node → Configure URL → Set Method → Test Connection
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Zapier Webhook Actions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Set up Zapier webhooks to send data to n8n endpoints when specific triggers occur
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Trigger Event → Format Data → Send Webhook → n8n Processing
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Webhook Security</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Authentication Methods</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• API key authentication</li>
                          <li>• Webhook signature verification</li>
                          <li>• IP address whitelisting</li>
                          <li>• HTTPS encryption enforcement</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Validation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Payload structure validation</li>
                          <li>• Data type checking</li>
                          <li>• Required field verification</li>
                          <li>• Malformed data handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Testing & Debugging</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Testing Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use webhook.site for testing</li>
                          <li>• Postman for manual testing</li>
                          <li>• n8n webhook test button</li>
                          <li>• Zapier webhook logs</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Common Issues</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Timeout errors and retries</li>
                          <li>• Data format mismatches</li>
                          <li>• Authentication failures</li>
                          <li>• Rate limiting issues</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Webhook Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Create webhook URLs in n8n</li>
                          <li>☐ Configure Zapier webhook actions</li>
                          <li>☐ Set up authentication</li>
                          <li>☐ Test webhook connectivity</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Security & Monitoring:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Implement security measures</li>
                          <li>☐ Set up error handling</li>
                          <li>☐ Monitor webhook performance</li>
                          <li>☐ Document webhook endpoints</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Trigger Zapier</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Outbound Zapier Triggers</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Send data from n8n workflows to trigger Zapier automations, enabling your AI agents to initiate actions across thousands of connected apps.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🚀</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Outbound Triggers</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📤</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Data Push</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Chain Automation</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Trigger Scenarios</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Lead Qualification Complete</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          When n8n AI completes lead analysis, trigger Zapier to update CRM and notify sales team
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          AI Analysis Complete → n8n HTTP Request → Zapier Trigger → CRM + Slack
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Content Generation Ready</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          After AI content creation, trigger social media posting and email campaign workflows
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Content Generated → Format Data → Zapier Trigger → Social + Email
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>HTTP Request Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Request Setup</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use HTTP Request node in n8n</li>
                          <li>• Set method to POST</li>
                          <li>• Add Zapier webhook URL</li>
                          <li>• Configure headers and authentication</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Formatting</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Structure payload as JSON</li>
                          <li>• Map n8n variables to Zapier fields</li>
                          <li>• Include timestamp and metadata</li>
                          <li>• Add error context information</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Trigger Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Add HTTP Request node</li>
                          <li>☐ Configure Zapier webhook URL</li>
                          <li>☐ Set up data payload</li>
                          <li>☐ Test trigger connection</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Monitoring:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Monitor trigger success rates</li>
                          <li>☐ Set up error notifications</li>
                          <li>☐ Log trigger events</li>
                          <li>☐ Track downstream actions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'zapier-step-4',
              title: 'Receive from Zapier',
              description: 'Handle data from Zapier in agent workflows',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Receive from Zapier</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Inbound Data Processing</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Configure n8n to receive and process data from Zapier workflows, enabling your AI agents to respond to external events and triggers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">📥</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Inbound Data</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚙️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Auto Processing</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🎯</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Smart Routing</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Reception Workflows</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Form Submission Processing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Receive form data from Zapier and automatically process with AI for lead qualification or support
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Form Submit → Zapier → n8n Webhook → AI Analysis → CRM Update
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Social Media Mentions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Monitor social mentions via Zapier and trigger AI sentiment analysis and response workflows
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Social Mention → Zapier → n8n → Sentiment AI → Response Generation
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Data Processing</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Transformation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Parse incoming JSON payloads</li>
                          <li>• Extract relevant data fields</li>
                          <li>• Transform data formats as needed</li>
                          <li>• Validate data integrity</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Routing Logic</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Route data based on content type</li>
                          <li>• Apply conditional logic for processing</li>
                          <li>• Handle different data sources</li>
                          <li>• Implement fallback mechanisms</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Error Handling</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Detection</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Invalid data format detection</li>
                          <li>• Missing required fields checking</li>
                          <li>• Processing timeout handling</li>
                          <li>• API connection failures</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Recovery Actions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Retry failed operations</li>
                          <li>• Send error notifications</li>
                          <li>• Log errors for debugging</li>
                          <li>• Fallback to manual processing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Webhook Reception:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Set up webhook endpoints</li>
                          <li>☐ Configure data parsing</li>
                          <li>☐ Implement routing logic</li>
                          <li>☐ Test data reception</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Processing & Monitoring:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Add error handling</li>
                          <li>☐ Set up monitoring</li>
                          <li>☐ Create response workflows</li>
                          <li>☐ Document data flows</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Complex Workflows</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Multi-Platform Automation Orchestration</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Build sophisticated workflows that span across n8n AI agents and Zapier's ecosystem, creating powerful automation chains with conditional logic and parallel processing.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Complex Logic</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Parallel Processing</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🌐</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Multi-Platform</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Advanced Workflow Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Multi-Stage Lead Processing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Complex lead qualification workflow with AI analysis, scoring, routing, and multi-channel follow-up
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Lead → AI Score → Branch Logic → CRM + Email + Slack + Calendar
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Content Distribution Pipeline</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          AI content creation with automatic formatting, approval workflow, and multi-platform publishing
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          AI Content → Approval → Format → Social + Blog + Email + Analytics
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Conditional Logic & Branching</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Decision Trees</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• AI-powered decision making</li>
                          <li>• Multi-condition branching logic</li>
                          <li>• Dynamic routing based on data</li>
                          <li>• Fallback and error paths</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Parallel Execution</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Simultaneous multi-platform actions</li>
                          <li>• Race conditions and synchronization</li>
                          <li>• Merge results from parallel branches</li>
                          <li>• Timeout and completion handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Workflow Optimization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Strategies</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Minimize API calls with batching</li>
                          <li>• Use webhooks for real-time triggers</li>
                          <li>• Implement smart caching strategies</li>
                          <li>• Optimize data transformation steps</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Scalability Patterns</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Queue systems for high volume</li>
                          <li>• Rate limiting and throttling</li>
                          <li>• Load balancing across instances</li>
                          <li>• Resource monitoring and alerting</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Workflow Design:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Map out complex workflow logic</li>
                          <li>☐ Design conditional branches</li>
                          <li>☐ Plan parallel execution paths</li>
                          <li>☐ Define error handling flows</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Optimization:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Implement performance monitoring</li>
                          <li>☐ Test complex scenarios</li>
                          <li>☐ Optimize resource usage</li>
                          <li>☐ Document workflow architecture</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'zapier-step-6',
              title: 'Error Handling',
              description: 'Handle errors across n8n and Zapier',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Error Handling</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Cross-Platform Error Management</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Implement robust error handling across n8n and Zapier integrations with graceful degradation, automated recovery, and comprehensive monitoring.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">⚠️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Error Detection</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Auto Recovery</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">📊</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Error Types & Detection</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Connection Failures</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Handle API timeouts, network issues, and service outages with intelligent retry mechanisms
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Timeout → Exponential Backoff → Retry → Fallback → Alert
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Validation Errors</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Catch malformed data, missing fields, and type mismatches before they break workflows
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Validation → Error Log → Data Cleanup → Retry/Skip
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Recovery Strategies</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Retry Mechanisms</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Exponential backoff with jitter</li>
                          <li>• Maximum retry limits per operation</li>
                          <li>• Different retry strategies per error type</li>
                          <li>• Circuit breaker patterns</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Graceful Degradation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Fallback to alternative services</li>
                          <li>• Partial workflow completion</li>
                          <li>• Queue failed operations for later</li>
                          <li>• Manual intervention workflows</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Monitoring & Alerting</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Tracking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Centralized error logging</li>
                          <li>• Error categorization and trends</li>
                          <li>• Performance impact analysis</li>
                          <li>• Root cause identification</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Alert Systems</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time error notifications</li>
                          <li>• Severity-based escalation</li>
                          <li>• Team assignment and routing</li>
                          <li>• Integration with monitoring tools</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Prevention</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Input validation at all entry points</li>
                          <li>• Rate limiting and throttling</li>
                          <li>• Health checks and monitoring</li>
                          <li>• Comprehensive testing strategies</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Documentation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Error handling procedures</li>
                          <li>• Troubleshooting guides</li>
                          <li>• Recovery time objectives</li>
                          <li>• Post-incident analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Error Handling Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Implement error detection</li>
                          <li>☐ Configure retry mechanisms</li>
                          <li>☐ Set up fallback strategies</li>
                          <li>☐ Create error logging system</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Monitoring & Recovery:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Configure monitoring dashboards</li>
                          <li>☐ Set up alert notifications</li>
                          <li>☐ Test recovery procedures</li>
                          <li>☐ Document error responses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            },
            {
              id: 'zapier-step-7',
              title: 'Performance Optimization',
              description: 'Optimize performance across platforms',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Optimization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Cross-Platform Performance Optimization</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Optimize performance across n8n and Zapier integrations with smart caching, efficient data flow, and resource management for maximum speed and reliability.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Speed Optimization</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">💾</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Resource Efficiency</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">📊</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Performance Strategies</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>API Call Optimization</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Reduce API calls through batching, caching, and intelligent request scheduling
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Batch Requests → Cache Results → Smart Scheduling → Rate Limiting
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Data Flow Optimization</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Streamline data transformation and minimize payload sizes across platforms
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Compress Data → Selective Fields → Efficient Parsing → Stream Processing
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Caching & Memory Management</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Smart Caching</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Multi-level caching strategies</li>
                          <li>• Time-based cache invalidation</li>
                          <li>• Context-aware cache keys</li>
                          <li>• Cache hit rate optimization</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Memory Efficiency</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Stream processing for large datasets</li>
                          <li>• Memory pool management</li>
                          <li>• Garbage collection optimization</li>
                          <li>• Resource cleanup automation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Scalability Patterns</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Horizontal Scaling</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Load balancing across instances</li>
                          <li>• Distributed workflow execution</li>
                          <li>• Auto-scaling based on demand</li>
                          <li>• Resource allocation optimization</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Queue Management</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Priority-based task queuing</li>
                          <li>• Dead letter queue handling</li>
                          <li>• Queue size monitoring</li>
                          <li>• Backpressure management</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>Performance Monitoring</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Metrics Collection</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Response time tracking</li>
                          <li>• Throughput measurements</li>
                          <li>• Resource utilization monitoring</li>
                          <li>• Error rate analysis</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Threshold-based alerting</li>
                          <li>• Performance degradation detection</li>
                          <li>• Capacity planning insights</li>
                          <li>• Automated optimization triggers</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Performance Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Implement caching strategies</li>
                          <li>☐ Optimize API call patterns</li>
                          <li>☐ Set up resource monitoring</li>
                          <li>☐ Configure scaling policies</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Monitoring & Optimization:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Deploy performance monitoring</li>
                          <li>☐ Set up alerting thresholds</li>
                          <li>☐ Test under load conditions</li>
                          <li>☐ Document optimization results</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Agent-Make Integration Design</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔄 n8n + Make Integration Architecture</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Design a powerful integration between n8n AI agents and Make (formerly Integromat) to leverage both platforms' 
                      strengths - n8n's flexible workflow automation with Make's extensive app ecosystem and visual automation tools.
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">n8n Agents</div>
                        <div className="text-xs">Smart Processing</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>⇄</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">Make Scenarios</div>
                        <div className="text-xs">App Ecosystem</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Integration Patterns</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Trigger Pattern</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          n8n agents trigger Make scenarios for complex app integrations
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          n8n Processing → Webhook → Make Scenario → App Actions
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📥 Data Sync Pattern</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Bi-directional data synchronization between platforms
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Make Data Collection → HTTP → n8n Analysis → Results Back
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Use Case Examples</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>E-commerce Order Processing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Make collects orders from multiple channels, n8n analyzes for fraud/priority, Make fulfills via appropriate channels
                        </p>
                        <ul className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'} list-disc list-inside`}>
                          <li>Make: Shopify + WooCommerce + Amazon order collection</li>
                          <li>n8n: AI fraud detection + priority scoring + inventory check</li>
                          <li>Make: Fulfill via ShipStation + send notifications via Klaviyo</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Lead Qualification Pipeline</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Make captures leads from multiple sources, n8n scores and enriches, Make routes to appropriate sales tools
                        </p>
                        <ul className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'} list-disc list-inside`}>
                          <li>Make: Lead capture from forms + LinkedIn + cold outreach</li>
                          <li>n8n: AI scoring + data enrichment + qualification</li>
                          <li>Make: Route to HubSpot/Salesforce + trigger follow-up sequences</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Design Planning Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Architecture Design:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Map data flow between platforms</li>
                          <li>☐ Identify trigger points and patterns</li>
                          <li>☐ Plan error handling and fallbacks</li>
                          <li>☐ Design authentication strategy</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Integration Points:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Define webhook endpoints</li>
                          <li>☐ Plan data transformation needs</li>
                          <li>☐ Set up monitoring and logging</li>
                          <li>☐ Document integration dependencies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'make-step-2',
              title: 'Make API Setup',
              description: 'Configure Make API connection',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Make API Setup & Configuration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔑 Make API Connection Setup</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Configure secure API connections between n8n and Make to enable seamless data exchange and workflow automation 
                      across both platforms using HTTP modules and webhook integrations.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔐</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">API Keys</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔗</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">HTTP Modules</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🎯</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Webhooks</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Step-by-Step API Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>1. Make Account & API Access</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Sign up for Make account at <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">make.com</span></li>
                          <li>• Navigate to Profile Settings → API</li>
                          <li>• Generate API token for n8n integration</li>
                          <li>• Note your organization ID for API calls</li>
                          <li>• Set up webhook URLs for incoming triggers</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>2. n8n HTTP Request Configuration</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`n8n HTTP Request Node Setup:

URL: https://hook.make.com/[your-webhook-id]
Method: POST
Headers:
  Content-Type: application/json
  Authorization: Bearer [your-api-token]

Body (JSON):
{
  "trigger": "n8n_agent_execution",
  "data": "{{ $json }}",
  "timestamp": "{{ new Date().toISOString() }}",
  "agent_id": "{{ $node['Agent ID'].json.id }}"
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Make Scenario Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>HTTP Module Setup in Make</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Trigger:</strong> Webhooks → Custom webhook</li>
                          <li>• <strong>URL:</strong> Copy webhook URL to n8n</li>
                          <li>• <strong>Data Structure:</strong> JSON with agent data</li>
                          <li>• <strong>Filters:</strong> Add conditions for specific triggers</li>
                          <li>• <strong>Actions:</strong> Connect to target applications</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Reverse Integration (Make → n8n)</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Make HTTP Module Configuration:

URL: https://[your-n8n-instance]/webhook/make-trigger
Method: POST
Headers:
  Content-Type: application/json
  X-Make-Source: webhook

Body:
{
  "scenario_id": "{{scenario.id}}",
  "execution_id": "{{execution.id}}",
  "data": {{bundle}},
  "timestamp": "{{now}}"
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Authentication & Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Security Best Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Store API tokens in environment variables</li>
                          <li>• Use HTTPS for all API communications</li>
                          <li>• Implement webhook signature verification</li>
                          <li>• Set up IP whitelist restrictions</li>
                          <li>• Regularly rotate API tokens</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Rate Limiting</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Make API: 60 requests/minute</li>
                          <li>• Implement exponential backoff</li>
                          <li>• Queue requests during high volume</li>
                          <li>• Monitor API usage in dashboards</li>
                          <li>• Set up alerts for rate limit approaching</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Testing & Validation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Connection Testing:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Test n8n → Make webhook delivery</li>
                          <li>☐ Verify Make → n8n response handling</li>
                          <li>☐ Check authentication token validity</li>
                          <li>☐ Validate data format compatibility</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Error Handling:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Configure retry mechanisms</li>
                          <li>☐ Set up error logging and alerts</li>
                          <li>☐ Test timeout scenarios</li>
                          <li>☐ Implement graceful degradation</li>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Trigger Make Scenarios from n8n</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🚀 Automated Scenario Triggering</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Set up intelligent triggers that activate Make scenarios based on n8n agent processing results, enabling 
                      complex multi-platform workflows that leverage both systems' capabilities.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Event-Driven Triggers</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Agent processing completion</li>
                          <li>• Specific data conditions met</li>
                          <li>• Error threshold exceeded</li>
                          <li>• Schedule-based activation</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Conditional Logic</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Data value thresholds</li>
                          <li>• Agent execution status</li>
                          <li>• Time-based conditions</li>
                          <li>• Multi-factor decision trees</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>n8n Trigger Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>HTTP Request Node Setup</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`// n8n Workflow: Trigger Make Scenario
If Node: Check conditions
  ├─ condition: {{ $node["Agent Processing"].json.success === true }}
  └─ condition: {{ $node["Agent Processing"].json.confidence > 0.8 }}

HTTP Request Node:
  URL: https://hook.make.com/[scenario-webhook-id]
  Method: POST
  Headers:
    Content-Type: application/json
    X-Trigger-Source: n8n-agent

  Body:
  {
    "trigger_type": "agent_completion",
    "agent_data": "{{ $node['Agent Processing'].json }}",
    "metadata": {
      "workflow_id": "{{ $workflow.id }}",
      "execution_id": "{{ $execution.id }}",
      "timestamp": "{{ new Date().toISOString() }}"
    }
  }`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Make Scenario Response Handling</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Response Processing in n8n</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Success Response:</strong> Continue workflow with Make data</li>
                          <li>• <strong>Error Response:</strong> Trigger fallback scenario</li>
                          <li>• <strong>Timeout:</strong> Retry with exponential backoff</li>
                          <li>• <strong>Logging:</strong> Store execution results for analysis</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Async Scenario Handling</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`// For long-running Make scenarios
1. n8n triggers Make scenario
2. Make returns immediate response with execution_id
3. Make processes scenario asynchronously
4. Make sends completion webhook back to n8n
5. n8n continues workflow with final results

n8n Webhook Response Handler:
{
  "execution_id": "{{make.execution_id}}",
  "status": "completed",
  "results": "{{make.scenario_output}}",
  "processing_time": "{{make.duration}}"
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Trigger Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Configure webhook URLs in Make</li>
                          <li>☐ Set up conditional logic in n8n</li>
                          <li>☐ Test trigger reliability</li>
                          <li>☐ Implement error handling</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Response Management:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Handle sync/async responses</li>
                          <li>☐ Set up timeout mechanisms</li>
                          <li>☐ Log execution results</li>
                          <li>☐ Monitor scenario performance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'make-step-4',
              title: 'Data Exchange',
              description: 'Exchange data between n8n and Make',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>n8n ↔ Make Data Exchange</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔄 Bi-directional Data Flow</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Implement seamless data exchange between n8n AI agents and Make scenarios, ensuring data integrity, 
                      proper formatting, and efficient synchronization across platforms.
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">n8n Agent Data</div>
                        <div className="text-xs">Processing Results</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>⇄</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">Make App Data</div>
                        <div className="text-xs">External Sources</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Data Transformation Patterns</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>n8n → Make Data Mapping</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`// n8n Function Node
const makeData = {
  customer: {
    id: $json.user_id,
    email: $json.email,
    name: $json.full_name
  },
  analysis: {
    score: $json.ai_score,
    confidence: $json.confidence,
    tags: $json.categories
  },
  metadata: {
    processed_at: new Date().toISOString(),
    workflow: $workflow.name
  }
};

return { json: makeData };`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Make → n8n Data Structure</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`// Make HTTP Module Output
{
  "source": "make_scenario",
  "scenario_id": "{{scenario.id}}",
  "data": {
    "crm_contact": "{{salesforce.contact}}",
    "email_sent": "{{mailchimp.campaign}}",
    "social_posted": "{{twitter.tweet}}"
  },
  "execution": {
    "started": "{{execution.start}}",
    "completed": "{{execution.end}}",
    "status": "success"
  }
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Data Synchronization Strategies</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Real-time Sync</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Immediate data exchange triggered by events for time-sensitive operations
                        </p>
                        <ul className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'} list-disc list-inside`}>
                          <li>Webhook-triggered immediate processing</li>
                          <li>Live data updates across platforms</li>
                          <li>Instant notification delivery</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Batch Processing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Scheduled bulk data exchanges for efficiency and rate limit management
                        </p>
                        <ul className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'} list-disc list-inside`}>
                          <li>Hourly/daily data synchronization</li>
                          <li>Bulk record processing</li>
                          <li>Resource-efficient operations</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Conflict Resolution</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Handle data conflicts when same records are modified in both platforms
                        </p>
                        <ul className={`text-xs ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'} list-disc list-inside`}>
                          <li>Timestamp-based resolution</li>
                          <li>Priority-based merge strategies</li>
                          <li>Manual review queue for conflicts</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Data Validation & Quality</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Validation Rules</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Required field verification</li>
                          <li>• Data type validation</li>
                          <li>• Format standardization</li>
                          <li>• Business rule enforcement</li>
                          <li>• Duplicate detection</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Handling</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Invalid data quarantine</li>
                          <li>• Automatic data cleansing</li>
                          <li>• Notification on failures</li>
                          <li>• Retry mechanisms with backoff</li>
                          <li>• Manual review workflows</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Data Exchange Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Data Mapping:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Map field relationships</li>
                          <li>☐ Define transformation rules</li>
                          <li>☐ Set up validation schemas</li>
                          <li>☐ Test data flow both directions</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Quality Control:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Implement data validation</li>
                          <li>☐ Set up error monitoring</li>
                          <li>☐ Create data quality reports</li>
                          <li>☐ Monitor sync performance</li>
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
          description: 'Advanced Make features',
          steps: [
            {
              id: 'make-step-5',
              title: 'Hybrid Workflows',
              description: 'Create hybrid n8n-Make workflows',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Hybrid n8n-Make Workflows</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🔗 Advanced Hybrid Architecture</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Design sophisticated workflows that seamlessly combine n8n's AI processing capabilities with Make's extensive 
                      app ecosystem, creating powerful automation pipelines that leverage the best of both platforms.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🧠</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">AI Processing</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">n8n Agents</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Orchestration</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Hybrid Logic</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🌐</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">App Ecosystem</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Make Scenarios</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Workflow Design Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Sequential Processing Pattern</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Hybrid Sequential Workflow:

1. Make: Data Collection (CRM + Email + Social)
   ↓ Webhook trigger
2. n8n: AI Analysis & Enrichment
   ├─ Lead scoring with OpenAI
   ├─ Sentiment analysis
   └─ Risk assessment
   ↓ HTTP request
3. Make: Action Execution
   ├─ Update CRM with scores
   ├─ Trigger email sequences
   └─ Schedule follow-up tasks

Benefits: Deep AI processing + Extensive app support`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔄 Parallel Processing Pattern</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Hybrid Parallel Workflow:

Trigger: New customer signup
    ↓
Split Processing:
├─ n8n Branch: AI Onboarding
│  ├─ Generate personalized content
│  ├─ Analyze user preferences
│  └─ Create custom workflow
└─ Make Branch: System Setup
   ├─ Create accounts in all tools
   ├─ Set up billing/subscriptions
   └─ Configure integrations
    ↓
Merge: Combine results → Send welcome package`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>State Management & Coordination</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Shared State Storage</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Database for workflow state</li>
                          <li>• Redis for temporary data</li>
                          <li>• Webhook queues for handoffs</li>
                          <li>• Status tracking across platforms</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Recovery</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cross-platform retry logic</li>
                          <li>• State rollback mechanisms</li>
                          <li>• Alternative pathway routing</li>
                          <li>• Manual intervention queues</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Architecture:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Design workflow handoff points</li>
                          <li>☐ Set up shared state storage</li>
                          <li>☐ Configure error recovery</li>
                          <li>☐ Plan monitoring strategy</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Testing:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Test end-to-end workflows</li>
                          <li>☐ Validate error scenarios</li>
                          <li>☐ Performance benchmarking</li>
                          <li>☐ Load testing with real data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'make-step-6',
              title: 'Advanced Routing',
              description: 'Implement complex routing between platforms',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Advanced Routing & Orchestration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 Intelligent Routing Systems</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Implement sophisticated routing logic that dynamically determines the optimal path for data processing 
                      based on real-time conditions, load balancing, and business rules across n8n and Make platforms.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🧭</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Smart Routing</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Conditional Logic</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">⚖️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Load Balancing</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Resource Optimization</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">🤖</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">AI Optimization</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Machine Learning</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Dynamic Routing Strategies</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎛️ Content-Based Routing</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`n8n Router Node Configuration:

// Content Analysis Routing
const routingLogic = {
  'text_analysis': {
    condition: 'data.type === "text" && data.length > 1000',
    destination: 'make_nlp_scenario',
    priority: 'high'
  },
  'image_processing': {
    condition: 'data.type === "image" && data.size > 5MB',
    destination: 'n8n_vision_agent',
    priority: 'medium'
  },
  'simple_automation': {
    condition: 'data.complexity_score < 3',
    destination: 'make_basic_scenario',
    priority: 'low'
  }
};`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Performance-Based Routing</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Make Router Module Setup:

Performance Monitoring:
├─ n8n_response_time: {{ avgResponseTime }}
├─ make_queue_length: {{ currentQueue }}
├─ system_load: {{ cpuUsage }}
└─ api_rate_limits: {{ remaining }}

Routing Decision:
if (n8n_response_time < 2000 && system_load < 70%) {
  route_to: "n8n_primary_agent"
} else if (make_queue_length < 50) {
  route_to: "make_fallback_scenario"
} else {
  route_to: "queue_for_retry"
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Adaptive Routing with ML</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Learning Algorithm</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Track success rates per route</li>
                          <li>• Analyze processing times</li>
                          <li>• Monitor error patterns</li>
                          <li>• Adjust weights dynamically</li>
                          <li>• A/B test routing strategies</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Optimization Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Throughput maximization</li>
                          <li>• Latency minimization</li>
                          <li>• Cost optimization</li>
                          <li>• Resource utilization</li>
                          <li>• Quality score maintenance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Advanced Use Cases</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🏢 Enterprise Content Pipeline</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Route content based on complexity, urgency, and compliance requirements
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          Legal docs → n8n compliance check → Make approval workflow
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛒 Smart E-commerce Routing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          Dynamic order routing based on inventory, shipping zones, and customer priority
                        </p>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                          VIP orders → n8n priority scoring → Make expedited fulfillment
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Routing Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Setup:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Define routing criteria</li>
                          <li>☐ Set up monitoring endpoints</li>
                          <li>☐ Configure fallback routes</li>
                          <li>☐ Implement circuit breakers</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Optimization:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Baseline performance metrics</li>
                          <li>☐ A/B test routing strategies</li>
                          <li>☐ Implement learning algorithms</li>
                          <li>☐ Set up automated adjustments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'make-step-7',
              title: 'Monitoring & Debug',
              description: 'Monitor and debug cross-platform workflows',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring & Debug Infrastructure</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🔍 Unified Monitoring Dashboard</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Build comprehensive monitoring systems that provide real-time visibility into your hybrid n8n-Make 
                      workflows with advanced debugging capabilities, performance tracking, and intelligent alerting.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📊</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Real-time Metrics</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Performance KPIs</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">🐛</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Debug Tools</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Error Tracking</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🚨</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Smart Alerts</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Proactive Monitoring</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">📈</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Analytics</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Trend Analysis</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Cross-Platform Monitoring Setup</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📡 n8n Monitoring Configuration</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`n8n Webhook Monitor Setup:

// Global execution monitor
n8n.workflows.on('execution.started', (data) => {
  const monitoring = {
    execution_id: data.executionId,
    workflow_id: data.workflowId,
    timestamp: new Date(),
    platform: 'n8n',
    status: 'started',
    input_data: data.inputData,
    trigger_source: data.trigger
  };
  
  // Send to centralized monitoring
  fetch('https://monitor.example.com/api/executions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(monitoring)
  });
});`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 Make Scenario Monitoring</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Make HTTP Module for Monitoring:

URL: https://monitor.example.com/api/scenario-events
Method: POST
Headers:
  Content-Type: application/json
  X-Monitor-Source: make

Body:
{
  "scenario_id": "{{scenario.id}}",
  "execution_id": "{{execution.id}}",
  "timestamp": "{{now}}",
  "status": "{{execution.status}}",
  "processing_time": "{{execution.duration}}",
  "data_size": "{{size(bundle)}}",
  "error_details": "{{ifempty(execution.error, null)}}"
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Key Performance Indicators (KPIs)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Average execution time</li>
                          <li>• Throughput (executions/hour)</li>
                          <li>• Success rate percentage</li>
                          <li>• Queue length & wait times</li>
                          <li>• Resource utilization</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Error Tracking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Error frequency & patterns</li>
                          <li>• Failure categorization</li>
                          <li>• Retry attempt tracking</li>
                          <li>• Recovery time metrics</li>
                          <li>• Root cause analysis</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Business Impact</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Cost per execution</li>
                          <li>• ROI tracking</li>
                          <li>• User satisfaction scores</li>
                          <li>• Process efficiency gains</li>
                          <li>• Compliance adherence</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Advanced Debug & Troubleshooting</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔍 Debug Mode Configuration</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Debug Environment Variables:

# Enable detailed logging
N8N_LOG_LEVEL=debug
N8N_DEBUG_WEBHOOK_REQUESTS=true
MAKE_DEBUG_MODE=1

# Capture execution traces
N8N_EXECUTION_DATA_SAVE_ON_ERROR=all
N8N_EXECUTION_DATA_SAVE_ON_SUCCESS=all
N8N_EXECUTION_DATA_SAVE_MANUAL_EXECUTIONS=true

# Performance profiling
N8N_METRICS_ENABLE=true
N8N_DIAGNOSTICS_ENABLE=true`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🚨 Intelligent Alerting System</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Alert Configuration Examples:

// High error rate alert
{
  "name": "High Error Rate",
  "condition": "error_rate > 5% over 10 minutes",
  "severity": "critical",
  "channels": ["slack", "email", "pagerduty"],
  "actions": ["auto_scale", "fallback_route"]
}

// Performance degradation
{
  "name": "Slow Processing",
  "condition": "avg_execution_time > 30s for 5 minutes",
  "severity": "warning", 
  "channels": ["slack"],
  "actions": ["resource_scale_up"]
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Troubleshooting Playbook</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Common Issues & Solutions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Webhook timeouts:</strong> Increase timeout limits</li>
                          <li>• <strong>Rate limiting:</strong> Implement backoff strategies</li>
                          <li>• <strong>Memory issues:</strong> Optimize data processing</li>
                          <li>• <strong>Authentication failures:</strong> Token rotation</li>
                          <li>• <strong>Network errors:</strong> Retry with exponential backoff</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Debug Tools</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Postman:</strong> API endpoint testing</li>
                          <li>• <strong>n8n Debug Mode:</strong> Step-by-step execution</li>
                          <li>• <strong>Make DevTools:</strong> Scenario debugging</li>
                          <li>• <strong>Log Aggregation:</strong> Centralized analysis</li>
                          <li>• <strong>Performance Profilers:</strong> Bottleneck identification</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Monitoring Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Infrastructure:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Set up centralized logging</li>
                          <li>☐ Configure monitoring dashboards</li>
                          <li>☐ Implement alerting systems</li>
                          <li>☐ Create debug environments</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Operations:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Define KPI baselines</li>
                          <li>☐ Create troubleshooting runbooks</li>
                          <li>☐ Set up automated recovery</li>
                          <li>☐ Train team on debug tools</li>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Agent Webhook Design</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 Webhook Architecture for AI Agents</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Design robust webhook patterns that enable seamless communication between n8n AI agents and external systems, 
                      ensuring reliable data flow and event-driven automation with proper error handling and scalability.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🔗</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Event-Driven</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Real-time Communication</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🛡️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Secure</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Authentication & Validation</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Scalable</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">High Throughput</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Webhook Design Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📤 Outbound Agent Events</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Agent Event Webhook Structure:

POST /webhook/agent-events
Content-Type: application/json
X-Agent-Signature: sha256=...

{
  "event_id": "evt_agent_12345",
  "event_type": "agent.task.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "agent_id": "agent_ai_assistant_001",
  "workflow_id": "wf_customer_support",
  "data": {
    "task_result": "Customer query resolved",
    "confidence_score": 0.95,
    "processing_time_ms": 1250,
    "tokens_used": 450
  },
  "metadata": {
    "user_id": "user_123",
    "session_id": "sess_abc789"
  }
}`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📥 Inbound Agent Triggers</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`External System → Agent Trigger:

POST /webhook/agent-trigger/customer-inquiry
Content-Type: application/json
Authorization: Bearer <api_token>

{
  "trigger_id": "trig_customer_12345",
  "source_system": "zendesk",
  "priority": "high",
  "customer_data": {
    "name": "John Doe",
    "email": "john@example.com",
    "tier": "premium",
    "issue_category": "billing"
  },
  "context": {
    "previous_interactions": 3,
    "sentiment": "frustrated",
    "urgency_score": 8
  }
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Event Types & Use Cases</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Agent Lifecycle Events</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>agent.started:</strong> Agent begins execution</li>
                          <li>• <strong>agent.completed:</strong> Task finished successfully</li>
                          <li>• <strong>agent.failed:</strong> Task encountered error</li>
                          <li>• <strong>agent.timeout:</strong> Execution time exceeded</li>
                          <li>• <strong>agent.paused:</strong> Waiting for input</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Business Events</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>customer.inquiry:</strong> New support request</li>
                          <li>• <strong>lead.qualified:</strong> Sales lead scored</li>
                          <li>• <strong>content.generated:</strong> AI content created</li>
                          <li>• <strong>alert.triggered:</strong> System alert raised</li>
                          <li>• <strong>analysis.completed:</strong> Data analysis done</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Design Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Event Structure:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Unique event IDs for deduplication</li>
                          <li>☐ Timestamp for ordering & debugging</li>
                          <li>☐ Event types for routing & filtering</li>
                          <li>☐ Structured data payloads</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Reliability:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Idempotency support</li>
                          <li>☐ Retry logic with backoff</li>
                          <li>☐ Dead letter queues</li>
                          <li>☐ Monitoring & alerting</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-2',
              title: 'Webhook Endpoints',
              description: 'Create webhook endpoints for agents',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Webhook Endpoints Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔧 n8n Webhook Configuration</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Create and configure webhook endpoints in n8n to receive external events and trigger AI agent workflows. 
                      Set up both incoming and outgoing webhooks with proper authentication and data validation.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📨</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Incoming</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Trigger Workflows</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">📤</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Outgoing</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Send Events</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔒</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Secure</div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Authenticated</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Incoming Webhook Setup</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>1. Create Webhook Trigger Node</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`n8n Webhook Node Configuration:

Node Type: Webhook (Trigger)
HTTP Method: POST
Path: /agent-trigger/{agent_type}
Response Code: 200
Response Data: {"status": "received", "timestamp": "{{new Date().toISOString()}}"}

Authentication:
├─ Header Auth: X-API-Key
├─ Query Auth: api_key
└─ Basic Auth: username/password

Validation:
├─ Required Headers: Content-Type, X-Event-Type
├─ JSON Schema validation
└─ Rate limiting: 100 req/min`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>2. Data Processing & Validation</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Validate Payload:

// Validate incoming webhook data
const payload = $json.body;
const headers = $json.headers;

// Check required fields
const required = ['event_type', 'timestamp', 'data'];
const missing = required.filter(field => !payload[field]);

if (missing.length > 0) {
  throw new Error(\`Missing required fields: \${missing.join(', ')}\`);
}

// Validate event type
const validTypes = ['customer.inquiry', 'lead.qualified', 'alert.triggered'];
if (!validTypes.includes(payload.event_type)) {
  throw new Error('Invalid event type');
}

return {
  validated: true,
  event_id: payload.event_id || \`evt_\${Date.now()}\`,
  ...payload
};`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Outgoing Webhook Setup</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>HTTP Request Node Configuration</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Outgoing Webhook Configuration:

URL: {{$node["Environment"].json["webhook_url"]}}
Method: POST
Headers:
  Content-Type: application/json
  X-Event-Source: n8n-agent
  X-Signature: {{$binary.createHmac('sha256', $env.WEBHOOK_SECRET).update(JSON.stringify($json)).digest('hex')}}
  User-Agent: n8n-webhook/1.0

Body:
{
  "event_id": "{{$json.event_id}}",
  "event_type": "{{$json.event_type}}",
  "timestamp": "{{$json.timestamp}}",
  "source": {
    "workflow_id": "{{$workflow.id}}",
    "execution_id": "{{$execution.id}}",
    "node_name": "{{$node.name}}"
  },
  "data": {{$json}}
}

Retry Logic:
├─ Max Retries: 3
├─ Backoff: Exponential (1s, 2s, 4s)
└─ Timeout: 10 seconds`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Common Webhook Endpoints</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Agent Triggers</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <code>/webhook/customer-support</code></li>
                          <li>• <code>/webhook/lead-qualification</code></li>
                          <li>• <code>/webhook/content-generation</code></li>
                          <li>• <code>/webhook/data-analysis</code></li>
                          <li>• <code>/webhook/alert-processing</code></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Status & Control</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <code>/webhook/health-check</code></li>
                          <li>• <code>/webhook/agent-status</code></li>
                          <li>• <code>/webhook/pause-agent</code></li>
                          <li>• <code>/webhook/resume-agent</code></li>
                          <li>• <code>/webhook/metrics</code></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Endpoint Configuration Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Security:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Authentication method configured</li>
                          <li>☐ HTTPS enforced for production</li>
                          <li>☐ Request signature validation</li>
                          <li>☐ Rate limiting implemented</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Reliability:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Input validation & sanitization</li>
                          <li>☐ Error handling & logging</li>
                          <li>☐ Idempotency support</li>
                          <li>☐ Monitoring & health checks</li>
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
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Send Agent Data via Webhooks</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📤 Agent Data Transmission</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Configure n8n workflows to send AI agent results, progress updates, and events to external systems 
                      through webhooks with proper data formatting, error handling, and delivery confirmation.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🤖</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Agent Results</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">📊</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Progress Updates</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">⚠️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Error Events</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">📋</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status Changes</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Webhook Data Payload Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Task Completion Webhook</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Task Completion Payload:

{
  "event_type": "agent.task.completed",
  "event_id": "{{$json.task_id}}_complete",
  "timestamp": "{{new Date().toISOString()}}",
  "agent": {
    "id": "{{$json.agent_id}}",
    "name": "{{$json.agent_name}}",
    "version": "1.0.0"
  },
  "task": {
    "id": "{{$json.task_id}}",
    "type": "{{$json.task_type}}",
    "started_at": "{{$json.start_time}}",
    "completed_at": "{{new Date().toISOString()}}",
    "duration_ms": "{{Date.now() - new Date($json.start_time).getTime()}}"
  },
  "result": {
    "status": "success",
    "confidence": "{{$json.confidence_score}}",
    "output": "{{$json.result}}",
    "tokens_used": "{{$json.token_count}}",
    "cost_estimate": "{{$json.estimated_cost}}"
  },
  "metadata": {
    "workflow_id": "{{$workflow.id}}",
    "execution_id": "{{$execution.id}}",
    "user_id": "{{$json.user_id}}"
  }
}`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📈 Progress Update Webhook</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Progress Update Function Node:

// Calculate progress percentage
const totalSteps = $json.workflow_steps.length;
const completedSteps = $json.workflow_steps.filter(step => step.completed).length;
const progressPercent = Math.round((completedSteps / totalSteps) * 100);

return {
  "event_type": "agent.progress.update",
  "event_id": \`\${$json.task_id}_progress_\${Date.now()}\`,
  "timestamp": new Date().toISOString(),
  "progress": {
    "percentage": progressPercent,
    "current_step": $json.current_step,
    "total_steps": totalSteps,
    "completed_steps": completedSteps,
    "estimated_completion": new Date(Date.now() + $json.estimated_remaining_ms).toISOString()
  },
  "status": "in_progress",
  "last_action": $json.last_completed_action
};`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Delivery Patterns & Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Immediate Delivery</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time event streaming</li>
                          <li>• Critical alerts & errors</li>
                          <li>• User interaction responses</li>
                          <li>• Status change notifications</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Batched Delivery</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Analytics & metrics data</li>
                          <li>• Bulk progress updates</li>
                          <li>• Scheduled reports</li>
                          <li>• Cost optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Data Structure:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Consistent event schema</li>
                          <li>☐ Unique event identifiers</li>
                          <li>☐ Timestamp standardization</li>
                          <li>☐ Data validation rules</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Delivery Reliability:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Delivery confirmation tracking</li>
                          <li>☐ Retry logic for failures</li>
                          <li>☐ Dead letter queue setup</li>
                          <li>☐ Performance monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-4',
              title: 'Receive Agent Events',
              description: 'Handle incoming webhook events for agents',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Receive Agent Events</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>📥 Incoming Event Processing</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Handle incoming webhook events from external systems to trigger AI agent workflows, process user requests, 
                      and respond to system alerts with automated intelligence and proper event routing.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">🎯</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Event Routing</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔍</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Data Validation</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🚀</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Auto-Response</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">⚡</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Real-time Processing</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Event Processing Workflow</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔍 Event Classification & Routing</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Switch Node - Event Router:

// Route based on event type
const eventType = $json.event_type;
const priority = $json.priority || 'normal';

switch(eventType) {
  case 'customer.inquiry':
    return priority === 'urgent' ? 
      {route: 'priority_support_agent'} : 
      {route: 'standard_support_agent'};
      
  case 'lead.qualified':
    return {route: 'sales_agent', 
            lead_score: $json.data.score};
            
  case 'content.request':
    return {route: 'content_generation_agent',
            content_type: $json.data.type};
            
  case 'alert.system':
    return {route: 'monitoring_agent',
            severity: $json.data.severity};
            
  default:
    return {route: 'general_processing_agent'};
}`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Data Enrichment & Context</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Enrich Event Data:

// Enrich incoming event with context
const baseEvent = $json;
const userId = baseEvent.user_id;

// Fetch user context if available
let userContext = {};
if (userId) {
  // This would typically fetch from your database
  userContext = {
    tier: 'premium',
    interaction_history: 15,
    last_interaction: '2024-01-10',
    preferences: ['email', 'urgent_only']
  };
}

// Add timestamps and tracking
const enrichedEvent = {
  ...baseEvent,
  received_at: new Date().toISOString(),
  processing_id: \`proc_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
  user_context: userContext,
  enrichment_version: '1.0'
};

return enrichedEvent;`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Common Event Types & Responses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Customer Support Events</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>ticket.created:</strong> Auto-categorize & assign</li>
                          <li>• <strong>chat.message:</strong> AI response generation</li>
                          <li>• <strong>escalation.needed:</strong> Human handoff trigger</li>
                          <li>• <strong>satisfaction.low:</strong> Manager notification</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Business Process Events</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>order.placed:</strong> Fraud analysis & approval</li>
                          <li>• <strong>user.signup:</strong> Onboarding sequence start</li>
                          <li>• <strong>payment.failed:</strong> Retry logic & notification</li>
                          <li>• <strong>content.requested:</strong> AI generation pipeline</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Response Patterns</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📤 Immediate Response</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`HTTP Response Node:

Status Code: 200
Headers:
  Content-Type: application/json
  X-Processed-By: n8n-agent

Response Body:
{
  "status": "received",
  "event_id": "{{$json.event_id}}",
  "processing_id": "{{$json.processing_id}}",
  "estimated_completion": "{{new Date(Date.now() + 30000).toISOString()}}",
  "acknowledgment": {
    "received_at": "{{$json.received_at}}",
    "assigned_agent": "{{$json.assigned_agent}}",
    "priority": "{{$json.priority}}"
  }
}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Event Handling Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Processing:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Event validation & sanitization</li>
                          <li>☐ Routing logic implementation</li>
                          <li>☐ Context enrichment setup</li>
                          <li>☐ Error handling & logging</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Response:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Immediate acknowledgment</li>
                          <li>☐ Progress tracking setup</li>
                          <li>☐ Completion notification</li>
                          <li>☐ Failure recovery mechanism</li>
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
          description: 'Advanced webhook features',
          steps: [
            {
              id: 'webhook-step-5',
              title: 'Webhook Security',
              description: 'Secure agent webhooks with authentication',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Webhook Security & Authentication</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🔒 Enterprise Security Framework</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Implement comprehensive security measures for webhook endpoints including authentication, authorization, 
                      signature verification, rate limiting, and attack prevention to protect AI agent workflows.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔐</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Authentication</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">✍️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Signatures</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">🚦</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Rate Limiting</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🛡️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Protection</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Authentication Methods</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔑 API Key Authentication</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Validate API Key:

// Check API key from header or query
const apiKey = $json.headers['x-api-key'] || $json.query.api_key;

if (!apiKey) {
  throw new Error('Missing API key');
}

// Validate against stored keys (use environment variables)
const validKeys = process.env.WEBHOOK_API_KEYS?.split(',') || [];
const isValidKey = validKeys.includes(apiKey);

if (!isValidKey) {
  throw new Error('Invalid API key');
}

// Check key permissions (if implemented)
const keyPermissions = {
  'key_premium_001': ['customer.inquiry', 'lead.qualified'],
  'key_basic_002': ['content.request']
};

const eventType = $json.body.event_type;
const allowedEvents = keyPermissions[apiKey] || [];

if (!allowedEvents.includes(eventType)) {
  throw new Error('API key not authorized for this event type');
}

return { authenticated: true, api_key: apiKey };`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>✍️ HMAC Signature Verification</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Verify HMAC Signature:

const crypto = require('crypto');

// Get signature from header
const receivedSignature = $json.headers['x-webhook-signature'];
const payload = JSON.stringify($json.body);
const secret = process.env.WEBHOOK_SECRET;

if (!receivedSignature || !secret) {
  throw new Error('Missing signature or secret');
}

// Calculate expected signature
const expectedSignature = 'sha256=' + 
  crypto.createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

// Secure comparison to prevent timing attacks
const signatureBuffer = Buffer.from(receivedSignature);
const expectedBuffer = Buffer.from(expectedSignature);

if (signatureBuffer.length !== expectedBuffer.length) {
  throw new Error('Invalid signature length');
}

const isValid = crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

if (!isValid) {
  throw new Error('Invalid webhook signature');
}

return { signature_verified: true };`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Rate Limiting & Protection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Rate Limiting Strategy</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Per API Key:</strong> 100 req/min</li>
                          <li>• <strong>Per IP:</strong> 200 req/min</li>
                          <li>• <strong>Global:</strong> 10,000 req/min</li>
                          <li>• <strong>Burst handling:</strong> 150% for 30s</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Attack Prevention</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Request size:</strong> Max 1MB payload</li>
                          <li>• <strong>Timeout:</strong> 30s processing limit</li>
                          <li>• <strong>IP blocking:</strong> Auto-ban suspicious IPs</li>
                          <li>• <strong>Content validation:</strong> JSON schema check</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Security Best Practices</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔍 Input Validation & Sanitization</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Input Validation:

const payload = $json.body;

// Validate required fields
const requiredFields = ['event_type', 'timestamp', 'data'];
const missingFields = requiredFields.filter(field => !payload[field]);

if (missingFields.length > 0) {
  throw new Error(\`Missing required fields: \${missingFields.join(', ')}\`);
}

// Sanitize string inputs
const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\\w+=/gi, '');
};

// Recursively sanitize object
const sanitizeObject = (obj) => {
  if (typeof obj === 'string') return sanitize(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object' && obj !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitize(key)] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
};

return sanitizeObject(payload);`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Security Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Authentication:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ API key validation implemented</li>
                          <li>☐ HMAC signature verification</li>
                          <li>☐ Bearer token support (if needed)</li>
                          <li>☐ Permission-based access control</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Protection:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Rate limiting configured</li>
                          <li>☐ Input validation & sanitization</li>
                          <li>☐ Request size limits set</li>
                          <li>☐ Security monitoring enabled</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-6',
              title: 'Retry & Reliability',
              description: 'Implement retry logic for reliable delivery',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Retry & Reliability</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔄 Robust Delivery System</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Build resilient webhook delivery systems with intelligent retry mechanisms, exponential backoff, 
                      dead letter queues, and comprehensive failure recovery to ensure no agent event is lost.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🔄</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Auto Retry</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">📈</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Backoff Strategy</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">💀</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Dead Letter Queue</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🎯</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Circuit Breaker</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Retry Strategy Implementation</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⏰ Exponential Backoff Logic</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Retry with Backoff:

const attempt = $json.retry_attempt || 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 second

if (attempt >= maxRetries) {
  // Send to dead letter queue
  return {
    action: 'dead_letter',
    webhook_data: $json.original_payload,
    final_error: $json.last_error,
    attempts: attempt
  };
}

// Calculate backoff delay: 1s, 2s, 4s, 8s, 16s
const delay = baseDelay * Math.pow(2, attempt);
const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
const finalDelay = delay + jitter;

return {
  action: 'retry',
  delay_ms: finalDelay,
  retry_attempt: attempt + 1,
  next_retry_at: new Date(Date.now() + finalDelay).toISOString(),
  webhook_data: $json.original_payload
};`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 n8n Wait & Retry Workflow</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`n8n Retry Workflow Design:

1. HTTP Request Node
   ├─ URL: Target webhook endpoint
   ├─ Timeout: 30 seconds
   ├─ On Success: → Complete
   └─ On Error: → Error Handler

2. Error Handler Function
   ├─ Check error type (timeout, 5xx, network)
   ├─ Calculate retry delay
   ├─ Update retry attempt counter
   └─ Route to appropriate action

3. Wait Node (Dynamic)
   ├─ Wait time: {{$json.delay_ms}}
   └─ Continue to: Retry HTTP Request

4. Dead Letter Queue
   ├─ Store failed webhook data
   ├─ Log error details
   ├─ Send alert notification
   └─ Create manual review task`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Error Classification & Handling</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Retryable Errors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>5xx:</strong> Server errors</li>
                          <li>• <strong>429:</strong> Rate limiting</li>
                          <li>• <strong>Timeout:</strong> Network issues</li>
                          <li>• <strong>DNS:</strong> Resolution failures</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Non-Retryable Errors</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>4xx:</strong> Client errors</li>
                          <li>• <strong>401/403:</strong> Auth failures</li>
                          <li>• <strong>400:</strong> Bad requests</li>
                          <li>• <strong>404:</strong> Not found</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Special Handling</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Rate limits:</strong> Honor Retry-After</li>
                          <li>• <strong>Circuit break:</strong> Temp disable endpoint</li>
                          <li>• <strong>Graceful degr:</strong> Fallback endpoints</li>
                          <li>• <strong>Monitoring:</strong> Alert on patterns</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Dead Letter Queue Management</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💀 DLQ Processing Workflow</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Dead Letter Queue Handler:

// Store failed webhook for manual review
const dlqEntry = {
  webhook_id: $json.webhook_id,
  original_payload: $json.webhook_data,
  endpoint_url: $json.target_url,
  failure_reason: $json.final_error,
  retry_attempts: $json.attempts,
  failed_at: new Date().toISOString(),
  status: 'pending_review'
};

// Save to database for tracking
await supabase
  .from('webhook_failures')
  .insert(dlqEntry);

// Send alert to operations team
await sendSlackAlert({
  channel: '#ops-alerts',
  message: \`🚨 Webhook delivery failed after \${$json.attempts} attempts\\nEndpoint: \${$json.target_url}\\nError: \${$json.final_error}\`,
  webhook_id: $json.webhook_id
});

// Create manual review task
await createTask({
  title: 'Review Failed Webhook Delivery',
  priority: 'high',
  assignee: 'ops-team',
  webhook_id: $json.webhook_id
});`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Reliability Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Retry Logic:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Exponential backoff implemented</li>
                          <li>☐ Jitter added to prevent thundering herd</li>
                          <li>☐ Maximum retry limit configured</li>
                          <li>☐ Error classification logic</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Failure Management:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Dead letter queue setup</li>
                          <li>☐ Failed webhook tracking</li>
                          <li>☐ Alert system configured</li>
                          <li>☐ Manual review process</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webhook-step-7',
              title: 'Webhook Analytics',
              description: 'Monitor and analyze webhook performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Webhook Analytics & Monitoring</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📊 Comprehensive Webhook Analytics</h3>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                      Monitor webhook performance, track delivery metrics, analyze agent communication patterns, 
                      and gain insights into your automation workflows with real-time dashboards and alerts.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">📈</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Performance Metrics</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">✅</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Success Rates</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">⏱️</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Response Times</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border text-center`}>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">🚨</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Error Tracking</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Key Performance Indicators</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📊 Metrics Collection Workflow</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Function Node - Collect Webhook Metrics:

const webhookStart = Date.now();
const eventData = $json;

// After webhook processing
const processingTime = Date.now() - webhookStart;

const metrics = {
  webhook_id: eventData.webhook_id,
  endpoint: eventData.endpoint_url,
  event_type: eventData.event_type,
  status: eventData.success ? 'success' : 'failed',
  response_time_ms: processingTime,
  payload_size_bytes: JSON.stringify(eventData).length,
  http_status: eventData.http_status || 200,
  retry_attempts: eventData.retry_count || 0,
  timestamp: new Date().toISOString(),
  user_agent: eventData.user_agent,
  source_ip: eventData.source_ip
};

// Store in analytics database
await supabase
  .from('webhook_analytics')
  .insert(metrics);

return metrics;`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📈 Real-time Dashboard Queries</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Analytics SQL Queries:

-- Success rate by endpoint (last 24h)
SELECT 
  endpoint,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
  ROUND(COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM webhook_analytics 
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY endpoint
ORDER BY total_requests DESC;

-- Average response time trends
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(response_time_ms) as avg_response_time,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time
FROM webhook_analytics 
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour;`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Alert & Notification System</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>High latency:</strong> P95 &gt; 5 seconds</li>
                          <li>• <strong>Low success rate:</strong> &lt; 95% in 10 min</li>
                          <li>• <strong>Volume spikes:</strong> &gt; 200% normal traffic</li>
                          <li>• <strong>Error bursts:</strong> &gt; 10 errors/minute</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Business Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Agent failures:</strong> Critical agent errors</li>
                          <li>• <strong>Revenue impact:</strong> Payment webhook failures</li>
                          <li>• <strong>SLA breaches:</strong> Customer-facing delays</li>
                          <li>• <strong>Security events:</strong> Suspicious patterns</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Advanced Analytics Features</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Predictive Analytics</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Trend Analysis Function:

// Predict potential issues based on trends
const analyzeWebhookTrends = async () => {
  const last24h = await getMetrics('24h');
  const last7d = await getMetrics('7d');
  
  const trends = {
    error_rate_trend: calculateTrend(last24h.error_rates, last7d.error_rates),
    latency_trend: calculateTrend(last24h.avg_latency, last7d.avg_latency),
    volume_trend: calculateTrend(last24h.request_count, last7d.request_count)
  };
  
  // Predict issues
  const predictions = [];
  
  if (trends.error_rate_trend > 0.1) {
    predictions.push({
      type: 'error_rate_increase',
      severity: 'warning',
      eta: '2-4 hours',
      recommendation: 'Check endpoint health'
    });
  }
  
  return predictions;
};`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Custom Report Generation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Daily Summary:</strong> Key metrics & highlights</li>
                          <li>• <strong>Weekly Trends:</strong> Performance patterns</li>
                          <li>• <strong>Monthly Business Impact:</strong> ROI analysis</li>
                          <li>• <strong>Custom Dashboards:</strong> Stakeholder-specific views</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-4`}>Analytics Implementation Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Data Collection:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Metrics collection workflow</li>
                          <li>☐ Data retention policies</li>
                          <li>☐ Privacy compliance (GDPR)</li>
                          <li>☐ Performance impact minimal</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">Monitoring & Alerts:</p>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>☐ Real-time dashboard setup</li>
                          <li>☐ Alert thresholds configured</li>
                          <li>☐ Notification channels active</li>
                          <li>☐ Escalation procedures defined</li>
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