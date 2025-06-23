import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Rocket, 
  Server, 
  Cloud, 
  Globe, 
  Monitor,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  Building,
  Container,
  Settings,
  Shield,
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

const N8nDeploy: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('cloud');
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
    { id: 'cloud', name: 'n8n Cloud', icon: '☁️' },
    { id: 'docker', name: 'Docker', icon: '🐳' },
    { id: 'kubernetes', name: 'Kubernetes', icon: '⚙️' },
    { id: 'aws', name: 'AWS', icon: '🔶' },
    { id: 'gcp', name: 'Google Cloud', icon: '🌐' },
    { id: 'azure', name: 'Azure', icon: '🔷' },
    { id: 'selfhosted', name: 'Self-Hosted', icon: '🏠' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    cloud: [
      {
        id: 'create-cloud-account',
        title: 'Create n8n Cloud account',
        description: 'Sign up for n8n Cloud and verify your email',
        completed: false
      },
      {
        id: 'configure-workspace',
        title: 'Configure cloud workspace',
        description: 'Set up your workspace settings and preferences',
        completed: false
      },
      {
        id: 'upload-workflows',
        title: 'Upload workflows',
        description: 'Import your n8n workflows to the cloud platform',
        completed: false
      },
      {
        id: 'setup-credentials',
        title: 'Configure cloud credentials',
        description: 'Set up secure credential management',
        completed: false
      },
      {
        id: 'test-execution',
        title: 'Test workflow execution',
        description: 'Run test executions to ensure everything works',
        completed: false
      },
      {
        id: 'setup-monitoring',
        title: 'Enable cloud monitoring',
        description: 'Configure monitoring and alerting features',
        completed: false
      }
    ],
    docker: [
      {
        id: 'install-docker',
        title: 'Install Docker',
        description: 'Install Docker engine on your target system',
        completed: false
      },
      {
        id: 'prepare-dockerfile',
        title: 'Prepare Dockerfile',
        description: 'Create optimized Dockerfile for n8n deployment',
        completed: false
      },
      {
        id: 'configure-volumes',
        title: 'Configure persistent volumes',
        description: 'Set up data persistence for workflows and credentials',
        completed: false
      },
      {
        id: 'setup-networking',
        title: 'Configure container networking',
        description: 'Set up proper network configuration and ports',
        completed: false
      },
      {
        id: 'deploy-container',
        title: 'Deploy n8n container',
        description: 'Launch the n8n container with proper configuration',
        completed: false
      },
      {
        id: 'setup-backup',
        title: 'Configure container backups',
        description: 'Set up automated backup strategies',
        completed: false
      }
    ],
    kubernetes: [
      {
        id: 'prepare-cluster',
        title: 'Prepare Kubernetes cluster',
        description: 'Ensure cluster is ready for n8n deployment',
        completed: false
      },
      {
        id: 'create-namespace',
        title: 'Create dedicated namespace',
        description: 'Set up isolated namespace for n8n resources',
        completed: false
      },
      {
        id: 'configure-secrets',
        title: 'Configure Kubernetes secrets',
        description: 'Set up secure credential management',
        completed: false
      },
      {
        id: 'deploy-manifests',
        title: 'Deploy Kubernetes manifests',
        description: 'Apply deployment, service, and ingress manifests',
        completed: false
      },
      {
        id: 'setup-ingress',
        title: 'Configure ingress controller',
        description: 'Set up external access and load balancing',
        completed: false
      },
      {
        id: 'configure-scaling',
        title: 'Configure auto-scaling',
        description: 'Set up horizontal pod autoscaling',
        completed: false
      }
    ],
    aws: [
      {
        id: 'setup-aws-account',
        title: 'Set up AWS account',
        description: 'Configure AWS account and IAM permissions',
        completed: false
      },
      {
        id: 'configure-vpc',
        title: 'Configure VPC networking',
        description: 'Set up secure VPC with proper subnets',
        completed: false
      },
      {
        id: 'setup-rds',
        title: 'Set up RDS database',
        description: 'Configure managed PostgreSQL database',
        completed: false
      },
      {
        id: 'deploy-ecs-fargate',
        title: 'Deploy to ECS Fargate',
        description: 'Launch n8n on serverless container platform',
        completed: false
      },
      {
        id: 'configure-alb',
        title: 'Configure Application Load Balancer',
        description: 'Set up load balancing and SSL termination',
        completed: false
      },
      {
        id: 'setup-cloudwatch',
        title: 'Set up CloudWatch monitoring',
        description: 'Configure comprehensive monitoring and logging',
        completed: false
      }
    ],
    gcp: [
      {
        id: 'setup-gcp-project',
        title: 'Set up GCP project',
        description: 'Create and configure Google Cloud project',
        completed: false
      },
      {
        id: 'configure-iam',
        title: 'Configure IAM permissions',
        description: 'Set up proper service accounts and permissions',
        completed: false
      },
      {
        id: 'setup-cloud-sql',
        title: 'Set up Cloud SQL',
        description: 'Configure managed PostgreSQL database',
        completed: false
      },
      {
        id: 'deploy-cloud-run',
        title: 'Deploy to Cloud Run',
        description: 'Launch n8n on serverless container platform',
        completed: false
      },
      {
        id: 'configure-load-balancer',
        title: 'Configure load balancer',
        description: 'Set up Google Cloud Load Balancer',
        completed: false
      },
      {
        id: 'setup-monitoring',
        title: 'Set up Cloud Monitoring',
        description: 'Configure monitoring and alerting',
        completed: false
      }
    ],
    azure: [
      {
        id: 'setup-azure-subscription',
        title: 'Set up Azure subscription',
        description: 'Configure Azure account and resource groups',
        completed: false
      },
      {
        id: 'configure-vnet',
        title: 'Configure virtual network',
        description: 'Set up secure virtual network infrastructure',
        completed: false
      },
      {
        id: 'setup-azure-database',
        title: 'Set up Azure Database',
        description: 'Configure managed PostgreSQL database',
        completed: false
      },
      {
        id: 'deploy-container-instances',
        title: 'Deploy to Container Instances',
        description: 'Launch n8n on Azure Container Instances',
        completed: false
      },
      {
        id: 'configure-app-gateway',
        title: 'Configure Application Gateway',
        description: 'Set up load balancing and SSL termination',
        completed: false
      },
      {
        id: 'setup-azure-monitor',
        title: 'Set up Azure Monitor',
        description: 'Configure comprehensive monitoring solution',
        completed: false
      }
    ],
    selfhosted: [
      {
        id: 'prepare-infrastructure',
        title: 'Prepare server infrastructure',
        description: 'Set up physical or virtual server environment',
        completed: false
      },
      {
        id: 'install-dependencies',
        title: 'Install system dependencies',
        description: 'Install Node.js, npm, and other required packages',
        completed: false
      },
      {
        id: 'setup-database',
        title: 'Set up local database',
        description: 'Install and configure PostgreSQL or SQLite',
        completed: false
      },
      {
        id: 'configure-reverse-proxy',
        title: 'Configure reverse proxy',
        description: 'Set up Nginx or Apache for SSL and routing',
        completed: false
      },
      {
        id: 'deploy-n8n',
        title: 'Deploy n8n application',
        description: 'Install and configure n8n on your server',
        completed: false
      },
      {
        id: 'setup-backup-strategy',
        title: 'Set up backup strategy',
        description: 'Configure automated backups and recovery',
        completed: false
      }
    ]
  };

  const learningPaths: { [key: string]: LearningPath } = {
    cloud: {
      id: 'cloud',
      title: 'n8n Cloud Deployment',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Deploy and manage n8n agents in n8n Cloud',
      sections: [
        {
          id: 'foundation',
          title: '☁️ Foundation',
          description: 'Setup n8n Cloud deployment basics',
          steps: [
            {
              id: 'cloud-step-1',
              title: 'Cloud Account Setup',
              description: 'Create and configure your n8n Cloud account',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">🔑 Create Your n8n Cloud Account</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Sign Up Process
                      </h4>
                      <p className="mb-3">Start by creating your n8n Cloud account with these steps:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• Visit <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">n8n.cloud</span></li>
                        <li>• Click <strong>"Start for Free"</strong> or <strong>"Sign Up"</strong></li>
                        <li>• Enter your email address and create a secure password</li>
                        <li>• Verify your email through the confirmation link</li>
                        <li>• Complete your profile with your name and organization details</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Account Verification & Security
                      </h4>
                      <p className="mb-3">Secure your account with proper verification:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Email Verification:</strong> Check your inbox and click the verification link</li>
                        <li>• <strong>Two-Factor Authentication (2FA):</strong> Enable 2FA for enhanced security</li>
                        <li>• <strong>Profile Settings:</strong> Complete your profile information</li>
                        <li>• <strong>Billing Information:</strong> Add payment method for paid features</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Subscription Management
                      </h4>
                      <p className="mb-3">Choose the right plan for your needs:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-blue-500 pl-3">
                          <strong>Starter Plan (Free):</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• 5,000 workflow executions/month</li>
                            <li>• 2 active workflows</li>
                            <li>• Community support</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Pro Plan ($20/month):</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• 10,000 workflow executions/month</li>
                            <li>• Unlimited workflows</li>
                            <li>• Priority support</li>
                            <li>• Advanced features</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Account Migration & Data Import
                      </h4>
                      <p className="mb-3">If migrating from self-hosted n8n:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• Export your workflows from existing n8n instance</li>
                        <li>• Use the n8n CLI tool: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">n8n export:workflow --all</code></li>
                        <li>• Backup your credentials and environment variables</li>
                        <li>• Document custom nodes and dependencies</li>
                        <li>• Plan migration timeline with minimal downtime</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">⚠️</span> Security Best Practices
                      </h4>
                      <ul className="space-y-2">
                        <li>• Use a strong, unique password with password manager</li>
                        <li>• Enable two-factor authentication immediately</li>
                        <li>• Regularly review account activity and access logs</li>
                        <li>• Use separate accounts for different environments (dev/prod)</li>
                        <li>• Keep backup access codes in a secure location</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Completion Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ Account created and email verified</li>
                        <li>□ Two-factor authentication enabled</li>
                        <li>□ Profile information completed</li>
                        <li>□ Subscription plan selected</li>
                        <li>□ Billing information added (if applicable)</li>
                        <li>□ Security settings configured</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cloud-step-2',
              title: 'Workspace Configuration',
              description: 'Configure your cloud workspace settings',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">⚙️ Configure Your n8n Cloud Workspace</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Workspace Settings Optimization
                      </h4>
                      <p className="mb-3">Configure your workspace for optimal performance:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Workspace Name:</strong> Choose a descriptive name for your organization</li>
                        <li>• <strong>Timezone:</strong> Set correct timezone for scheduling workflows</li>
                        <li>• <strong>Execution Settings:</strong> Configure timeout and retry policies</li>
                        <li>• <strong>Data Retention:</strong> Set execution history retention period</li>
                        <li>• <strong>Webhook URL:</strong> Note your unique webhook domain</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Environment Variable Management
                      </h4>
                      <p className="mb-3">Set up secure environment variables for your workflows:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Accessing Environment Variables:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. Navigate to Settings → Environment Variables</li>
                            <li>2. Click "Add Variable" button</li>
                            <li>3. Enter variable name and value</li>
                            <li>4. Save and apply changes</li>
                          </ol>
                        </div>
                        <div className="space-y-2">
                          <p><strong>Common Environment Variables:</strong></p>
                          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm">
                            <div>DATABASE_URL=postgresql://user:pass@host:5432/db</div>
                            <div>API_BASE_URL=https://api.yourservice.com</div>
                            <div>ENCRYPTION_KEY=your-secure-encryption-key</div>
                            <div>WEBHOOK_URL=https://yourinstance.app.n8n.cloud/webhook</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Resource Allocation & Performance
                      </h4>
                      <p className="mb-3">Optimize your workspace resource allocation:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Execution Concurrency:</strong> Set maximum concurrent executions</li>
                        <li>• <strong>Memory Limits:</strong> Configure memory allocation per workflow</li>
                        <li>• <strong>Timeout Settings:</strong> Set appropriate execution timeouts</li>
                        <li>• <strong>Queue Management:</strong> Configure execution queue settings</li>
                        <li>• <strong>Error Handling:</strong> Set global error handling preferences</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Team Permissions & Role Management
                      </h4>
                      <p className="mb-3">Set up proper team access and permissions:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>User Roles:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Owner:</strong> Full access to all features and settings</li>
                            <li>• <strong>Admin:</strong> Manage workflows, credentials, and users</li>
                            <li>• <strong>Editor:</strong> Create and edit workflows</li>
                            <li>• <strong>Viewer:</strong> Read-only access to workflows</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Adding Team Members:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. Go to Settings → Team</li>
                            <li>2. Click "Invite User"</li>
                            <li>3. Enter email and select role</li>
                            <li>4. Send invitation</li>
                            <li>5. User accepts invitation via email</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">5️⃣</span> Backup & Recovery Setup
                      </h4>
                      <p className="mb-3">Configure automatic backup and recovery:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Automatic Backups:</strong> Enable daily workflow backups</li>
                        <li>• <strong>Export Schedule:</strong> Set up regular data exports</li>
                        <li>• <strong>Recovery Testing:</strong> Test backup restoration process</li>
                        <li>• <strong>Data Export:</strong> Use built-in export functionality</li>
                        <li>• <strong>Version Control:</strong> Consider Git integration for workflows</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Workspace Configuration Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ Workspace name and timezone configured</li>
                        <li>□ Environment variables set up</li>
                        <li>□ Resource allocation optimized</li>
                        <li>□ Team members invited with appropriate roles</li>
                        <li>□ Backup and recovery configured</li>
                        <li>□ Security settings reviewed</li>
                        <li>□ Webhook URLs documented</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'deployment',
          title: '🚀 Deployment',
          description: 'Deploy your agents to the cloud',
          steps: [
            {
              id: 'cloud-step-3',
              title: 'Agent Upload',
              description: 'Upload and configure your n8n agents',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">📤 Upload and Configure n8n Workflows</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Workflow Import & Export
                      </h4>
                      <p className="mb-3">Import your existing workflows to n8n Cloud:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Single Workflow Import:</strong> Copy/paste JSON or use import button</li>
                        <li>• <strong>Bulk Import:</strong> Use the import feature for multiple workflows</li>
                        <li>• <strong>Git Integration:</strong> Connect with Git repository for version control</li>
                        <li>• <strong>Template Gallery:</strong> Browse and use community templates</li>
                        <li>• <strong>JSON Format:</strong> Ensure workflows are in correct n8n JSON format</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Bulk Migration Strategies
                      </h4>
                      <p className="mb-3">Efficiently migrate multiple workflows:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Export from Self-Hosted:</strong>
                          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm mt-2">
                            <div># Export all workflows</div>
                            <div>n8n export:workflow --all --output=workflows.json</div>
                            <div># Export specific workflow</div>
                            <div>n8n export:workflow --id=1 --output=my-workflow.json</div>
                          </div>
                        </div>
                        <div>
                          <strong>Import to Cloud:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. Navigate to Workflows section in n8n Cloud</li>
                            <li>2. Click "Import" button</li>
                            <li>3. Upload JSON file or paste workflow content</li>
                            <li>4. Review and adjust node configurations</li>
                            <li>5. Activate imported workflows</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Workflow Dependency Management
                      </h4>
                      <p className="mb-3">Handle workflow dependencies and custom nodes:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Custom Nodes:</strong> Check if custom nodes are available in Cloud</li>
                        <li>• <strong>Node Dependencies:</strong> Verify all required nodes are installed</li>
                        <li>• <strong>Credentials Mapping:</strong> Map credentials from old to new system</li>
                        <li>• <strong>Environment Variables:</strong> Update environment variable references</li>
                        <li>• <strong>File References:</strong> Convert local file paths to cloud storage</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Version Control Integration
                      </h4>
                      <p className="mb-3">Set up version control for your workflows:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>Git Integration Setup:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. Go to Settings → Git</li>
                            <li>2. Connect your GitHub/GitLab repository</li>
                            <li>3. Configure branch strategy (main/dev)</li>
                            <li>4. Set up automatic sync options</li>
                            <li>5. Configure commit message templates</li>
                          </ol>
                        </div>
                        <div>
                          <strong>Best Practices:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Use descriptive commit messages</li>
                            <li>• Implement branching strategy for environments</li>
                            <li>• Regular backup commits for workflow changes</li>
                            <li>• Tag important releases</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">5️⃣</span> Workflow Validation & Testing
                      </h4>
                      <p className="mb-3">Ensure workflows work correctly in cloud environment:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Test Execution:</strong> Run test executions for each workflow</li>
                        <li>• <strong>Credential Verification:</strong> Verify all credentials work correctly</li>
                        <li>• <strong>Webhook Testing:</strong> Test webhook URLs and endpoints</li>
                        <li>• <strong>Schedule Verification:</strong> Confirm cron schedules work as expected</li>
                        <li>• <strong>Error Handling:</strong> Test error scenarios and recovery</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Agent Upload Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ All workflows exported from source system</li>
                        <li>□ Workflows successfully imported to n8n Cloud</li>
                        <li>□ Dependencies and custom nodes verified</li>
                        <li>□ Credentials properly mapped and configured</li>
                        <li>□ Version control integration set up</li>
                        <li>□ Test executions completed successfully</li>
                        <li>□ Webhook URLs updated in external systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cloud-step-4',
              title: 'Environment Variables',
              description: 'Configure secure environment variables',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">🔒 Secure Environment Variables Configuration</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Secure Credential Management
                      </h4>
                      <p className="mb-3">Set up and manage credentials securely in n8n Cloud:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Credential Types:</strong> API keys, OAuth tokens, database connections</li>
                        <li>• <strong>Encryption:</strong> All credentials encrypted at rest and in transit</li>
                        <li>• <strong>Access Control:</strong> Team-based permission management</li>
                        <li>• <strong>Audit Logging:</strong> Track credential usage and access</li>
                        <li>• <strong>Rotation Policy:</strong> Regular credential rotation schedules</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Environment-Specific Configuration
                      </h4>
                      <p className="mb-3">Configure environment variables for different deployment stages:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Development Environment:</strong>
                          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm mt-2">
                            <div>N8N_ENVIRONMENT=development</div>
                            <div>DB_HOST=dev-database.example.com</div>
                            <div>API_BASE_URL=https://api-dev.example.com</div>
                            <div>LOG_LEVEL=debug</div>
                            <div>WEBHOOK_URL=https://dev-n8n.example.com/webhook</div>
                          </div>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-3">
                          <strong>Production Environment:</strong>
                          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm mt-2">
                            <div>N8N_ENVIRONMENT=production</div>
                            <div>DB_HOST=prod-database.example.com</div>
                            <div>API_BASE_URL=https://api.example.com</div>
                            <div>LOG_LEVEL=info</div>
                            <div>WEBHOOK_URL=https://n8n.example.com/webhook</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Secret Rotation & Management
                      </h4>
                      <p className="mb-3">Implement automatic secret rotation and management:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Rotation Schedule:</strong> Set automatic rotation intervals</li>
                        <li>• <strong>Version Management:</strong> Keep track of secret versions</li>
                        <li>• <strong>Zero-Downtime Updates:</strong> Update secrets without service interruption</li>
                        <li>• <strong>Rollback Capability:</strong> Quick rollback to previous versions</li>
                        <li>• <strong>Expiration Alerts:</strong> Notifications before secrets expire</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Credential Sharing & Inheritance
                      </h4>
                      <p className="mb-3">Manage credential sharing across workflows and teams:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>Sharing Levels:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Personal:</strong> Only available to the creator</li>
                            <li>• <strong>Team:</strong> Shared with specific team members</li>
                            <li>• <strong>Organization:</strong> Available to entire organization</li>
                            <li>• <strong>Workflow-Specific:</strong> Bound to specific workflows</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Best Practices:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. Use least privilege principle</li>
                            <li>2. Group related credentials by service</li>
                            <li>3. Document credential purposes and usage</li>
                            <li>4. Regular access reviews and cleanup</li>
                            <li>5. Monitor credential usage patterns</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">5️⃣</span> Security Auditing & Compliance
                      </h4>
                      <p className="mb-3">Implement comprehensive security auditing:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Access Logs:</strong> Track who accessed which credentials when</li>
                        <li>• <strong>Usage Monitoring:</strong> Monitor credential usage in workflows</li>
                        <li>• <strong>Compliance Reports:</strong> Generate reports for security audits</li>
                        <li>• <strong>Anomaly Detection:</strong> Alert on unusual credential access patterns</li>
                        <li>• <strong>Integration Security:</strong> Verify third-party service connections</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-cyan-50 dark:bg-cyan-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">🔧</span> Common Environment Variables
                      </h4>
                      <p className="mb-3">Essential environment variables for n8n Cloud:</p>
                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm">
                        <div># Database Configuration</div>
                        <div>DB_TYPE=postgresdb</div>
                        <div>DB_POSTGRESDB_HOST=your-db-host</div>
                        <div>DB_POSTGRESDB_PORT=5432</div>
                        <div>DB_POSTGRESDB_DATABASE=n8n</div>
                        <div>DB_POSTGRESDB_USER=n8n_user</div>
                        <div>DB_POSTGRESDB_PASSWORD=secure_password</div>
                        <div># </div>
                        <div># Security Settings</div>
                        <div>N8N_ENCRYPTION_KEY=your-encryption-key</div>
                        <div>N8N_USER_MANAGEMENT_JWT_SECRET=jwt-secret</div>
                        <div># </div>
                        <div># Webhook Configuration</div>
                        <div>WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook</div>
                        <div>N8N_PROTOCOL=https</div>
                        <div>N8N_HOST=your-instance.app.n8n.cloud</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Environment Variables Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ All credentials migrated to n8n Cloud credentials system</li>
                        <li>□ Environment-specific variables configured</li>
                        <li>□ Secret rotation schedule established</li>
                        <li>□ Team access permissions configured</li>
                        <li>□ Security auditing enabled</li>
                        <li>□ Backup of credential configurations</li>
                        <li>□ Monitoring and alerting set up</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'management',
          title: '📊 Management',
          description: 'Monitor and manage deployed agents',
          steps: [
            {
              id: 'cloud-step-5',
              title: 'Agent Monitoring',
              description: 'Set up monitoring and alerting',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">📊 Comprehensive Agent Monitoring Setup</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Monitoring Dashboard Setup
                      </h4>
                      <p className="mb-3">Configure comprehensive monitoring dashboards for your n8n Cloud instance:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Real-time Metrics:</strong> View live workflow execution statistics</li>
                        <li>• <strong>Performance Graphs:</strong> Execution time trends and throughput metrics</li>
                        <li>• <strong>Resource Usage:</strong> Memory, CPU, and storage utilization</li>
                        <li>• <strong>Custom Dashboards:</strong> Create team-specific monitoring views</li>
                        <li>• <strong>Mobile Access:</strong> Monitor from mobile devices with responsive design</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Real-time Execution Tracking
                      </h4>
                      <p className="mb-3">Monitor workflow executions in real-time:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Execution Status Tracking:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Running:</strong> Currently executing workflows</li>
                            <li>• <strong>Success:</strong> Successfully completed executions</li>
                            <li>• <strong>Failed:</strong> Failed executions with error details</li>
                            <li>• <strong>Waiting:</strong> Workflows waiting for triggers</li>
                            <li>• <strong>Cancelled:</strong> Manually cancelled executions</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Key Metrics to Monitor:</strong>
                          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm mt-2">
                            <div>• Total Executions: 1,234</div>
                            <div>• Success Rate: 98.5%</div>
                            <div>• Average Execution Time: 2.3s</div>
                            <div>• Active Workflows: 45</div>
                            <div>• Queue Length: 3</div>
                            <div>• Error Rate: 1.5%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Performance Metrics & Analytics
                      </h4>
                      <p className="mb-3">Analyze performance metrics and optimize workflows:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Execution Time Analysis:</strong> Identify slow-running workflows</li>
                        <li>• <strong>Resource Consumption:</strong> Memory and CPU usage per workflow</li>
                        <li>• <strong>Throughput Metrics:</strong> Executions per hour/day/month</li>
                        <li>• <strong>Error Patterns:</strong> Common failure points and causes</li>
                        <li>• <strong>Trend Analysis:</strong> Historical performance trends</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Error Tracking & Alerting
                      </h4>
                      <p className="mb-3">Set up comprehensive error tracking and alerting system:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>Alert Configuration:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. Go to Settings → Alerts & Notifications</li>
                            <li>2. Configure alert thresholds (error rate, execution time)</li>
                            <li>3. Set up notification channels (email, Slack, webhooks)</li>
                            <li>4. Define escalation policies for critical errors</li>
                            <li>5. Test alert configurations</li>
                          </ol>
                        </div>
                        <div>
                          <strong>Alert Types:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Execution Failures:</strong> Immediate alerts for failed workflows</li>
                            <li>• <strong>Performance Degradation:</strong> Alerts for slow executions</li>
                            <li>• <strong>Resource Limits:</strong> Warnings for resource consumption</li>
                            <li>• <strong>Quota Warnings:</strong> Alerts when approaching usage limits</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">5️⃣</span> Custom Monitoring Integrations
                      </h4>
                      <p className="mb-3">Integrate with external monitoring and observability tools:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Webhook Integration:</strong> Send metrics to external systems</li>
                        <li>• <strong>API Access:</strong> Programmatic access to monitoring data</li>
                        <li>• <strong>Third-party Tools:</strong> Integration with Datadog, New Relic, etc.</li>
                        <li>• <strong>Custom Dashboards:</strong> Build dashboards in Grafana or similar</li>
                        <li>• <strong>Log Aggregation:</strong> Forward logs to centralized logging systems</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-cyan-50 dark:bg-cyan-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">📈</span> Monitoring Best Practices
                      </h4>
                      <p className="mb-3">Essential monitoring practices for production environments:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Baseline Establishment:</strong> Establish normal performance baselines</li>
                        <li>• <strong>Proactive Monitoring:</strong> Monitor trends, not just incidents</li>
                        <li>• <strong>Alert Fatigue Prevention:</strong> Tune alerts to reduce false positives</li>
                        <li>• <strong>Regular Reviews:</strong> Weekly/monthly monitoring reviews</li>
                        <li>• <strong>Documentation:</strong> Document monitoring procedures and runbooks</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Agent Monitoring Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ Monitoring dashboard configured and accessible</li>
                        <li>□ Real-time execution tracking enabled</li>
                        <li>□ Performance metrics and analytics set up</li>
                        <li>□ Error tracking and alerting configured</li>
                        <li>□ Notification channels tested</li>
                        <li>□ Custom monitoring integrations implemented</li>
                        <li>□ Monitoring procedures documented</li>
                        <li>□ Team trained on monitoring tools</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cloud-step-6',
              title: 'Scaling Configuration',
              description: 'Configure auto-scaling for your agents',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">📈 Auto-Scaling Strategy Implementation</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Auto-Scaling Strategy
                      </h4>
                      <p className="mb-3">Implement intelligent auto-scaling for your n8n Cloud workloads:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Execution-Based Scaling:</strong> Scale based on workflow execution volume</li>
                        <li>• <strong>Queue-Based Scaling:</strong> Scale when execution queue length increases</li>
                        <li>• <strong>Resource-Based Scaling:</strong> Scale based on CPU/memory usage</li>
                        <li>• <strong>Time-Based Scaling:</strong> Predictive scaling for known traffic patterns</li>
                        <li>• <strong>Custom Metrics:</strong> Scale based on business-specific metrics</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Resource Limit Configuration
                      </h4>
                      <p className="mb-3">Configure resource limits and quotas for optimal performance:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Scaling Configuration:</strong>
                          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm mt-2">
                            <div># Execution Limits</div>
                            <div>MAX_CONCURRENT_EXECUTIONS=50</div>
                            <div>MIN_CONCURRENT_EXECUTIONS=5</div>
                            <div># </div>
                            <div># Queue Thresholds</div>
                            <div>SCALE_UP_QUEUE_SIZE=10</div>
                            <div>SCALE_DOWN_QUEUE_SIZE=2</div>
                            <div># </div>
                            <div># Resource Limits</div>
                            <div>MAX_MEMORY_PER_EXECUTION=512MB</div>
                            <div>MAX_EXECUTION_TIME=300s</div>
                          </div>
                        </div>
                        <div>
                          <strong>Resource Allocation Strategies:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Conservative:</strong> Gradual scaling with higher thresholds</li>
                            <li>• <strong>Aggressive:</strong> Fast scaling with lower thresholds</li>
                            <li>• <strong>Balanced:</strong> Moderate scaling with optimized thresholds</li>
                            <li>• <strong>Custom:</strong> Tailored scaling based on specific needs</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Load Balancing Optimization
                      </h4>
                      <p className="mb-3">Optimize load balancing for distributed workflow execution:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Round Robin:</strong> Distribute executions evenly across instances</li>
                        <li>• <strong>Least Connections:</strong> Route to instances with fewer active executions</li>
                        <li>• <strong>Weighted Distribution:</strong> Route based on instance capacity</li>
                        <li>• <strong>Sticky Sessions:</strong> Route related executions to same instance</li>
                        <li>• <strong>Health-Based Routing:</strong> Avoid unhealthy instances</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Scaling Trigger Configuration
                      </h4>
                      <p className="mb-3">Configure intelligent scaling triggers and policies:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>Scaling Triggers:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. <strong>CPU Utilization:</strong> Scale when CPU {'>'}70% for 5 minutes</li>
                            <li>2. <strong>Memory Usage:</strong> Scale when memory {'>'}80% for 3 minutes</li>
                            <li>3. <strong>Queue Length:</strong> Scale when queue {'>'}10 items for 2 minutes</li>
                            <li>4. <strong>Execution Rate:</strong> Scale when rate {'>'}100 executions/minute</li>
                            <li>5. <strong>Error Rate:</strong> Scale up if error rate {'>'} 5%</li>
                          </ol>
                        </div>
                        <div>
                          <strong>Scaling Policies:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Scale Up:</strong> Add 25% more capacity, max 2 instances at once</li>
                            <li>• <strong>Scale Down:</strong> Remove 20% capacity, max 1 instance at once</li>
                            <li>• <strong>Cooldown:</strong> Wait 5 minutes between scaling actions</li>
                            <li>• <strong>Warmup:</strong> 2-minute warmup period for new instances</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">5️⃣</span> Cost Optimization for Scaling
                      </h4>
                      <p className="mb-3">Optimize costs while maintaining performance:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Predictive Scaling:</strong> Pre-scale based on historical patterns</li>
                        <li>• <strong>Scheduled Scaling:</strong> Scale up/down at specific times</li>
                        <li>• <strong>Spot Instance Integration:</strong> Use lower-cost instances when available</li>
                        <li>• <strong>Right-Sizing:</strong> Optimize instance sizes for workloads</li>
                        <li>• <strong>Cost Monitoring:</strong> Track and alert on scaling costs</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-cyan-50 dark:bg-cyan-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">📊</span> Scaling Metrics & Monitoring
                      </h4>
                      <p className="mb-3">Key metrics to monitor for scaling effectiveness:</p>
                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm">
                        <div>• Instance Count: Current/Min/Max</div>
                        <div>• CPU Utilization: 65% average</div>
                        <div>• Memory Usage: 70% average</div>
                        <div>• Queue Length: 3 items average</div>
                        <div>• Scaling Events: 5 up, 3 down (24h)</div>
                        <div>• Response Time: 1.2s average</div>
                        <div>• Cost per Execution: $0.05</div>
                        <div>• Efficiency Rating: 92%</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Scaling Configuration Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ Auto-scaling strategy defined and implemented</li>
                        <li>□ Resource limits and quotas configured</li>
                        <li>□ Load balancing optimization completed</li>
                        <li>□ Scaling triggers and policies set up</li>
                        <li>□ Cost optimization measures implemented</li>
                        <li>□ Scaling metrics monitoring enabled</li>
                        <li>□ Scaling policies tested under load</li>
                        <li>□ Cost tracking and alerting configured</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cloud-step-7',
              title: 'Backup & Recovery',
              description: 'Implement backup and disaster recovery',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <h3 className="text-xl font-bold mb-4">🔄 Backup & Disaster Recovery Implementation</h3>
                  
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">1️⃣</span> Automated Backup Scheduling
                      </h4>
                      <p className="mb-3">Set up automated backup strategies for your n8n Cloud environment:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Daily Backups:</strong> Automatic daily backups of workflows and data</li>
                        <li>• <strong>Incremental Backups:</strong> Efficient incremental backup strategy</li>
                        <li>• <strong>Cross-Region Backups:</strong> Backups stored in multiple regions</li>
                        <li>• <strong>Retention Policies:</strong> Configurable backup retention periods</li>
                        <li>• <strong>Backup Encryption:</strong> All backups encrypted at rest and in transit</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">2️⃣</span> Disaster Recovery Procedures
                      </h4>
                      <p className="mb-3">Implement comprehensive disaster recovery procedures:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Recovery Time Objectives (RTO):</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Partial Outage:</strong> 15 minutes maximum downtime</li>
                            <li>• <strong>Regional Outage:</strong> 2 hours maximum downtime</li>
                            <li>• <strong>Complete Disaster:</strong> 24 hours maximum downtime</li>
                            <li>• <strong>Data Recovery:</strong> 4 hours maximum recovery time</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-3">
                          <strong>Recovery Point Objectives (RPO):</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Workflow Data:</strong> Maximum 5 minutes data loss</li>
                            <li>• <strong>Execution History:</strong> Maximum 1 hour data loss</li>
                            <li>• <strong>Configuration:</strong> Maximum 15 minutes data loss</li>
                            <li>• <strong>Credentials:</strong> No data loss acceptable</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">3️⃣</span> Data Retention Policy Configuration
                      </h4>
                      <p className="mb-3">Configure comprehensive data retention policies:</p>
                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded font-mono text-sm">
                        <div># Backup Retention Policy</div>
                        <div>DAILY_BACKUPS_RETENTION=30d</div>
                        <div>WEEKLY_BACKUPS_RETENTION=12w</div>
                        <div>MONTHLY_BACKUPS_RETENTION=12m</div>
                        <div>YEARLY_BACKUPS_RETENTION=7y</div>
                        <div># </div>
                        <div># Execution History</div>
                        <div>EXECUTION_HISTORY_RETENTION=90d</div>
                        <div>ERROR_LOGS_RETENTION=180d</div>
                        <div>AUDIT_LOGS_RETENTION=2555d</div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">4️⃣</span> Backup Testing & Validation
                      </h4>
                      <p className="mb-3">Implement regular backup testing and validation procedures:</p>
                      <div className="space-y-3">
                        <div className="border-l-4 border-orange-500 pl-3">
                          <strong>Testing Schedule:</strong>
                          <ol className="text-sm mt-1 space-y-1 ml-4">
                            <li>1. <strong>Daily:</strong> Automated backup integrity checks</li>
                            <li>2. <strong>Weekly:</strong> Sample restore testing</li>
                            <li>3. <strong>Monthly:</strong> Full recovery drill simulation</li>
                            <li>4. <strong>Quarterly:</strong> Complete disaster recovery test</li>
                            <li>5. <strong>Annually:</strong> Business continuity validation</li>
                          </ol>
                        </div>
                        <div>
                          <strong>Validation Metrics:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• <strong>Backup Success Rate:</strong> 99.9% target</li>
                            <li>• <strong>Recovery Time:</strong> Within RTO targets</li>
                            <li>• <strong>Data Integrity:</strong> 100% data consistency</li>
                            <li>• <strong>Restoration Success:</strong> 99.5% success rate</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">5️⃣</span> Recovery Time Optimization
                      </h4>
                      <p className="mb-3">Optimize recovery times for faster business continuity:</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Hot Standby:</strong> Maintain warm standby environments</li>
                        <li>• <strong>Parallel Processing:</strong> Multi-threaded recovery operations</li>
                        <li>• <strong>Prioritized Recovery:</strong> Critical workflows first</li>
                        <li>• <strong>Automated Failover:</strong> Automatic failover to backup systems</li>
                        <li>• <strong>Health Monitoring:</strong> Continuous health checks during recovery</li>
                      </ul>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-cyan-50 dark:bg-cyan-900/20'}`}>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">📋</span> Emergency Response Procedures
                      </h4>
                      <p className="mb-3">Documented emergency response procedures:</p>
                      <div className="space-y-2">
                        <div className="border-l-4 border-cyan-500 pl-3">
                          <strong>Emergency Contacts:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Primary Technical Lead: +1-xxx-xxx-xxxx</li>
                            <li>• Secondary Technical Lead: +1-xxx-xxx-xxxx</li>
                            <li>• Business Continuity Manager: +1-xxx-xxx-xxxx</li>
                            <li>• Executive Sponsor: +1-xxx-xxx-xxxx</li>
                          </ul>
                        </div>
                        <div className="border-l-4 border-green-500 pl-3">
                          <strong>Communication Channels:</strong>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Emergency Slack Channel: #emergency-response</li>
                            <li>• Email Distribution List: emergency@company.com</li>
                            <li>• SMS Alert System: Configured for critical alerts</li>
                            <li>• Status Page: status.company.com</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <h4 className="font-semibold mb-2">✅ Backup & Recovery Checklist</h4>
                      <ul className="space-y-1">
                        <li>□ Automated backup scheduling configured</li>
                        <li>□ Disaster recovery procedures documented</li>
                        <li>□ Data retention policies implemented</li>
                        <li>□ Backup testing schedule established</li>
                        <li>□ Recovery time optimization completed</li>
                        <li>□ Emergency response procedures documented</li>
                        <li>□ Communication channels established</li>
                        <li>□ Full disaster recovery test conducted</li>
                        <li>□ Team trained on recovery procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    docker: {
      id: 'docker',
      title: 'Docker Deployment',
      icon: <Container className="h-5 w-5" />,
      description: 'Deploy n8n agents using Docker containers',
      sections: [
        {
          id: 'foundation',
          title: '🐳 Foundation',
          description: 'Docker deployment basics',
          steps: [
            {
              id: 'docker-step-1',
              title: 'Docker Setup',
              description: 'Install and configure Docker environment',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Docker Engine Installation & Configuration</h2>
                  
                  {/* Docker Installation Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Docker Installation Process</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">1. Install</div>
                        <div className="text-xs">Docker Engine</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">2. Configure</div>
                        <div className="text-xs">Security Settings</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">3. Optimize</div>
                        <div className="text-xs">Performance</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Complete Docker installation process: Install Docker Engine, configure security and networking, optimize performance settings for n8n deployment.
                    </p>
                  </div>

                  {/* Platform-Specific Installation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Platform-Specific Installation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🐧 Linux (Ubuntu/Debian)</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Update package index
sudo apt update

# Install prerequisites
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🪟 Windows</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded mb-2`}>
                          <p className="mb-2">1. Download Docker Desktop for Windows</p>
                          <p className="mb-2">2. Enable WSL 2 Backend</p>
                          <p className="mb-2">3. Install and restart system</p>
                          <p className="mb-2">4. Configure resource limits</p>
                        </div>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# PowerShell - Verify installation
docker --version
docker-compose --version`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🍎 macOS</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded mb-2`}>
                          <p className="mb-2">1. Download Docker Desktop for Mac</p>
                          <p className="mb-2">2. Install .dmg package</p>
                          <p className="mb-2">3. Start Docker Desktop</p>
                          <p className="mb-2">4. Configure preferences</p>
                        </div>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Terminal - Verify installation
docker --version
docker-compose --version

# Alternative: Homebrew
brew install --cask docker`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Docker Compose Setup */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Docker Compose Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Basic n8n Docker Compose Setup</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme123
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  n8n_data:`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Essential Commands</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono space-y-1`}>
                            <div># Start n8n</div>
                            <div>docker-compose up -d</div>
                            <div></div>
                            <div># View logs</div>
                            <div>docker-compose logs -f n8n</div>
                            <div></div>
                            <div># Stop n8n</div>
                            <div>docker-compose down</div>
                            <div></div>
                            <div># Update n8n</div>
                            <div>docker-compose pull && docker-compose up -d</div>
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Advanced Configuration</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Custom timezone configuration</li>
                            <li>• SSL certificate mounting</li>
                            <li>• Database integration</li>
                            <li>• Resource limits and constraints</li>
                            <li>• Health check implementation</li>
                            <li>• Logging configuration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Container Security */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Container Security Hardening</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>User Privileges</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Run as non-root user
user: "1000:1000"

# Drop capabilities
cap_drop:
  - ALL
cap_add:
  - CHOWN
  - SETGID
  - SETUID

# No new privileges
security_opt:
  - no-new-privileges:true`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Network Security</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Custom network
networks:
  n8n_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

# Firewall rules
iptables -A INPUT -p tcp --dport 5678 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 5678 -j DROP`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Resource Limits</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Resource constraints
deploy:
  resources:
    limits:
      memory: 2G
      cpus: '1.0'
    reservations:
      memory: 512M
      cpus: '0.25'

# Ulimits
ulimits:
  nofile: 65536
  nproc: 4096`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>File System Security</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Read-only root filesystem
read_only: true

# Temporary filesystems
tmpfs:
  - /tmp:noexec,nosuid,size=100m
  - /var/tmp:noexec,nosuid,size=50m

# Volume permissions
volumes:
  - n8n_data:/home/node/.n8n:Z`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Performance Optimization</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Docker Engine</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-ulimits": {
    "nofile": {
      "Hard": 64000,
      "Name": "nofile",
      "Soft": 64000
    }
  }
}`}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Memory Management</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Set appropriate memory limits</li>
                            <li>• Configure swap accounting</li>
                            <li>• Monitor memory usage patterns</li>
                            <li>• Optimize garbage collection</li>
                            <li>• Use memory-efficient base images</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Storage Optimization</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use SSD storage for volumes</li>
                            <li>• Configure proper volume drivers</li>
                            <li>• Implement log rotation</li>
                            <li>• Regular container cleanup</li>
                            <li>• Optimize image layers</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification & Testing */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Docker Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Docker Engine installed and running</li>
                      <li>□ Docker Compose installed and configured</li>
                      <li>□ Security hardening implemented</li>
                      <li>□ Performance optimization configured</li>
                      <li>□ Resource limits set appropriately</li>
                      <li>□ Network configuration tested</li>
                      <li>□ Container logs configured</li>
                      <li>□ Health checks implemented</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'docker-step-2',
              title: 'Container Configuration',
              description: 'Configure n8n Docker containers',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>n8n Container Configuration & Optimization</h2>
                  
                  {/* Dockerfile Creation Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Optimized Dockerfile Creation</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">1. Base Image</div>
                        <div className="text-xs">Multi-stage build</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">2. Dependencies</div>
                        <div className="text-xs">Layer optimization</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">3. Security</div>
                        <div className="text-xs">Scanning & hardening</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create production-ready n8n containers with multi-stage builds, optimized layers, and comprehensive security scanning.
                    </p>
                  </div>

                  {/* Custom Dockerfile Implementation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Multi-Stage Dockerfile Implementation</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Production-Ready n8n Dockerfile</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Stage 1: Build dependencies
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \\
    python3 \\
    make \\
    g++ \\
    libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies with clean cache
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build n8n with optimizations
RUN npm run build && \\
    npm prune --production

# Stage 3: Production runtime
FROM node:18-alpine AS runtime

# Create non-root user
RUN addgroup -g 1000 n8n && \\
    adduser -u 1000 -G n8n -s /bin/sh -D n8n

# Install security updates only
RUN apk update && \\
    apk upgrade && \\
    apk add --no-cache \\
        tini \\
        su-exec && \\
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /home/node

# Copy application from builder
COPY --from=builder --chown=n8n:n8n /app/dist ./
COPY --from=builder --chown=n8n:n8n /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV N8N_USER_FOLDER=/home/node/.n8n

# Create data directory
RUN mkdir -p /home/node/.n8n && \\
    chown -R n8n:n8n /home/node

# Switch to non-root user
USER n8n

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:5678/healthz || exit 1

# Expose port
EXPOSE 5678

# Use tini as init system
ENTRYPOINT ["/sbin/tini", "--"]

# Start n8n
CMD ["node", "n8n"]`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Container Image Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Container Image Optimization</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Layer Optimization</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# .dockerignore
node_modules
.git
.gitignore
README.md
.env
.env.local
*.log
coverage/
.nyc_output
docs/

# Minimize layers
RUN apk update && \\
    apk upgrade && \\
    apk add --no-cache package1 package2 && \\
    rm -rf /var/cache/apk/*`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Size Reduction</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Use Alpine Linux base images</li>
                          <li>• Remove development dependencies</li>
                          <li>• Compress assets and remove unused files</li>
                          <li>• Use multi-stage builds</li>
                          <li>• Implement proper .dockerignore</li>
                          <li>• Clean package manager caches</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Build Caching</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Build with cache
docker build --cache-from n8n:latest -t n8n:new .

# BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \\
    npm ci --only=production

# Registry cache
docker buildx build \\
  --cache-from type=registry,ref=myregistry/n8n:cache \\
  --cache-to type=registry,ref=myregistry/n8n:cache \\
  -t n8n:latest .`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Performance Tuning</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Optimize Node.js memory settings</li>
                          <li>• Configure proper timezone</li>
                          <li>• Set appropriate file descriptors</li>
                          <li>• Use production NODE_ENV</li>
                          <li>• Enable compression middleware</li>
                          <li>• Configure proper logging levels</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Advanced Container Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Custom n8n Configuration</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# n8n.config.js
module.exports = {
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    database: 'n8n',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true
  },
  executions: {
    mode: 'queue',
    timeout: 300,
    maxTimeout: 3600
  },
  queue: {
    bull: {
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD
      }
    }
  }
}`}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Environment Variables</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Production environment
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=\${BASIC_AUTH_USER}
N8N_BASIC_AUTH_PASSWORD=\${BASIC_AUTH_PASSWORD}
N8N_HOST=\${HOST:-0.0.0.0}
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_SSL_KEY=/certs/privkey.pem
N8N_SSL_CERT=/certs/fullchain.pem
WEBHOOK_URL=https://\${DOMAIN}/
N8N_METRICS=true
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console,file
N8N_LOG_FILE_LOCATION=/var/log/n8n.log
NODE_ENV=production
TZ=\${TIMEZONE:-UTC}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Scanning */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Container Security Scanning</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Vulnerability Scanning</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Trivy scanning
trivy image n8n:latest

# Snyk scanning
snyk container test n8n:latest

# Docker Scout
docker scout cves n8n:latest

# Clair scanning
clair-scanner --ip localhost n8n:latest`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Compliance Checks</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• CIS Docker Benchmark compliance</li>
                          <li>• NIST cybersecurity framework</li>
                          <li>• PCI DSS requirements</li>
                          <li>• SOC 2 compliance checks</li>
                          <li>• GDPR data protection</li>
                          <li>• ISO 27001 security standards</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Automated Testing</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# CI/CD integration
- name: Security Scan
  run: |
    docker build -t n8n:test .
    trivy image --exit-code 1 n8n:test
    
# Container structure test
container-structure-test test \\
  --image n8n:latest \\
  --config container-test.yaml

# Hadolint Dockerfile linting
hadolint Dockerfile`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Build Automation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Build Automation & CI/CD</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>GitHub Actions Workflow</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# .github/workflows/docker-build.yml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
          
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            myregistry/n8n:latest
            myregistry/n8n:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          
      - name: Security scan
        run: |
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
            aquasec/trivy image myregistry/n8n:latest`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification & Testing */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Container Configuration Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Optimized Dockerfile created with multi-stage builds</li>
                      <li>□ Container image optimization implemented</li>
                      <li>□ Build caching strategies configured</li>
                      <li>□ Security scanning integrated</li>
                      <li>□ Environment variables properly configured</li>
                      <li>□ Health checks implemented</li>
                      <li>□ Non-root user configured</li>
                      <li>□ CI/CD pipeline set up for automated builds</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    kubernetes: {
      id: 'kubernetes',
      title: 'Kubernetes Deployment',
      icon: <Settings className="h-5 w-5" />,
      description: 'Deploy n8n agents on Kubernetes clusters',
      sections: [
        {
          id: 'foundation',
          title: '⚙️ Foundation',
          description: 'Kubernetes deployment basics',
          steps: [
            {
              id: 'k8s-step-1',
              title: 'Cluster Setup',
              description: 'Prepare Kubernetes cluster for n8n',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Kubernetes Cluster Setup & Configuration</h2>
                  
                  {/* Cluster Setup Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Kubernetes Cluster Architecture</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">1. Control Plane</div>
                        <div className="text-xs">API Server, etcd</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">2. Worker Nodes</div>
                        <div className="text-xs">kubelet, Pods</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">3. Networking</div>
                        <div className="text-xs">CNI, Services</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Complete Kubernetes cluster setup: Configure control plane components, deploy worker nodes, implement networking, and establish security policies for n8n deployment.
                    </p>
                  </div>

                  {/* Cluster Installation Methods */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Cluster Installation Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚙️ kubeadm (Self-Managed)</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Install prerequisites
sudo apt update && sudo apt install -y \\
  apt-transport-https ca-certificates curl

# Add Kubernetes signing key
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# Add Kubernetes repository
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Install Kubernetes components
sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Initialize cluster
sudo kubeadm init --pod-network-cidr=10.244.0.0/16`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>☁️ Managed Services</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded mb-2`}>
                          <p className="mb-2"><strong>AWS EKS:</strong></p>
                          <p className="mb-1">• Fully managed control plane</p>
                          <p className="mb-1">• Auto-scaling and updates</p>
                          <p className="mb-1">• Integrated with AWS services</p>
                          <p className="mb-2"><strong>GKE:</strong></p>
                          <p className="mb-1">• Google-managed Kubernetes</p>
                          <p className="mb-1">• Auto-pilot mode available</p>
                          <p className="mb-2"><strong>AKS:</strong></p>
                          <p className="mb-1">• Azure-managed Kubernetes</p>
                          <p className="mb-1">• Integrated Azure AD</p>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🧪 Local Development</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Install minikube
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube /usr/local/bin/

# Start cluster
minikube start --driver=docker \\
  --memory=4096 --cpus=2

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# Alternative: Kind (Kubernetes in Docker)
kind create cluster --config=kind-config.yaml

# Alternative: k3s (Lightweight)
curl -sfL https://get.k3s.io | sh -`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cluster Networking Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Container Network Interface (CNI) Setup</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Flannel CNI (Simple)</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Apply Flannel CNI
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Verify CNI installation
kubectl get pods -n kube-flannel

# Check node status
kubectl get nodes -o wide`}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Calico CNI (Advanced)</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Install Calico operator
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/tigera-operator.yaml

# Apply custom resource
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/custom-resources.yaml

# Verify Calico installation
kubectl get pods -n calico-system`}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Network Policy Configuration</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: n8n-network-policy
  namespace: n8n
spec:
  podSelector:
    matchLabels:
      app: n8n
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 5678
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: database
    ports:
    - protocol: TCP
      port: 5432
  - to: {}
    ports:
    - protocol: TCP
      port: 443
    - protocol: TCP
      port: 80`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cluster Security Hardening */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Cluster Security Hardening</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>RBAC Configuration</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: n8n-service-account
  namespace: n8n
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: n8n
  name: n8n-role
rules:
- apiGroups: [""]
  resources: ["secrets", "configmaps"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "update"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: n8n-role-binding
  namespace: n8n
subjects:
- kind: ServiceAccount
  name: n8n-service-account
  namespace: n8n
roleRef:
  kind: Role
  name: n8n-role
  apiGroup: rbac.authorization.k8s.io`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Pod Security Standards</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Enable Pod Security Standards
kubectl label namespace n8n \\
  pod-security.kubernetes.io/enforce=restricted \\
  pod-security.kubernetes.io/audit=restricted \\
  pod-security.kubernetes.io/warn=restricted

# Pod Security Context
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  fsGroup: 1000
  seccompProfile:
    type: RuntimeDefault
  capabilities:
    drop:
    - ALL
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Admission Controllers</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Enable essential admission controllers
--enable-admission-plugins=NodeRestriction,ResourceQuota,PodSecurityPolicy,LimitRanger,ServiceAccount,DefaultStorageClass,MutatingAdmissionWebhook,ValidatingAdmissionWebhook

# Install OPA Gatekeeper for policy enforcement
kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.14/deploy/gatekeeper.yaml

# Example constraint template
apiVersion: templates.gatekeeper.sh/v1beta1
kind: ConstraintTemplate
metadata:
  name: k8srequiredsecuritycontext`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Secrets Management</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Enable encryption at rest
--encryption-provider-config=/etc/kubernetes/encryption.yaml

# External Secrets Operator
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets-system --create-namespace

# Sealed Secrets for GitOps
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.24.0/controller.yaml`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Planning */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Cluster Resource Planning</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Node Sizing</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded`}>
                            <p className="mb-1"><strong>Control Plane:</strong></p>
                            <p className="mb-1">• 2 vCPU, 2GB RAM (min)</p>
                            <p className="mb-1">• 4 vCPU, 4GB RAM (prod)</p>
                            <p className="mb-2"><strong>Worker Nodes:</strong></p>
                            <p className="mb-1">• 2 vCPU, 4GB RAM (small)</p>
                            <p className="mb-1">• 4 vCPU, 8GB RAM (medium)</p>
                            <p className="mb-1">• 8 vCPU, 16GB RAM (large)</p>
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Storage Planning</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• etcd: 20GB SSD minimum</li>
                            <li>• Container images: 50GB per node</li>
                            <li>• n8n data: 10GB+ persistent storage</li>
                            <li>• Logs: 5-10GB per node</li>
                            <li>• Backup storage: 2x data size</li>
                            <li>• Performance: SSD recommended</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Network Requirements</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Pod CIDR: /16 or larger</li>
                            <li>• Service CIDR: /12 typical</li>
                            <li>• Node-to-node: 1Gbps+</li>
                            <li>• Internet access for images</li>
                            <li>• Load balancer IPs</li>
                            <li>• Firewall: ports 6443, 2379-2380</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cluster Monitoring Setup */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Cluster Monitoring & Observability</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Prometheus & Grafana Stack</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Install kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install with custom values
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \\
  --namespace monitoring \\
  --create-namespace \\
  --values prometheus-values.yaml

# Access Grafana dashboard
kubectl port-forward -n monitoring svc/kube-prometheus-stack-grafana 3000:80

# Key monitoring metrics:
# - Node CPU/Memory/Disk usage
# - Pod resource consumption
# - API server latency
# - etcd performance
# - Network throughput
# - Storage IOPS and latency`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Essential Dashboards</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Kubernetes Cluster Overview</li>
                            <li>• Node Exporter Full</li>
                            <li>• Kubernetes Pod Monitoring</li>
                            <li>• etcd Performance</li>
                            <li>• Ingress Controller Metrics</li>
                            <li>• Persistent Volume Usage</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Alerting Rules</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Node down or unreachable</li>
                            <li>• High CPU/Memory usage</li>
                            <li>• Pod crash looping</li>
                            <li>• Disk space running low</li>
                            <li>• API server errors</li>
                            <li>• Certificate expiration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification & Testing */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Cluster Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Kubernetes cluster installed and accessible</li>
                      <li>□ CNI plugin configured and pods networking</li>
                      <li>□ RBAC and security policies implemented</li>
                      <li>□ Pod Security Standards enforced</li>
                      <li>□ Resource planning completed</li>
                      <li>□ Monitoring and alerting configured</li>
                      <li>□ Cluster security hardening applied</li>
                      <li>□ High availability verified (if multi-node)</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    aws: {
      id: 'aws',
      title: 'AWS Deployment',
      icon: <Building className="h-5 w-5" />,
      description: 'Deploy n8n agents on Amazon Web Services',
      sections: [
        {
          id: 'foundation',
          title: '🔶 Foundation',
          description: 'AWS deployment basics',
          steps: [
            {
              id: 'aws-step-1',
              title: 'AWS Account Setup',
              description: 'Configure AWS account and IAM permissions',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AWS Account Setup & Configuration</h2>
                  
                  {/* AWS Setup Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>AWS Account Foundation</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">1. Account</div>
                        <div className="text-xs">Setup & Billing</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">2. IAM</div>
                        <div className="text-xs">Users & Policies</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-4 py-2 rounded-lg text-center`}>
                        <div className="font-semibold">3. Security</div>
                        <div className="text-xs">MFA & Hardening</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Complete AWS account setup: Create and configure AWS account, implement IAM security, set up billing and cost monitoring for n8n deployment.
                    </p>
                  </div>

                  {/* Account Creation & Billing */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>AWS Account Creation & Billing Setup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏢 Account Setup</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                          <li>• Create AWS account at aws.amazon.com</li>
                          <li>• Verify email and phone number</li>
                          <li>• Add payment method (credit card)</li>
                          <li>• Choose support plan (Basic/Developer)</li>
                          <li>• Enable AWS Organizations (if multi-account)</li>
                          <li>• Set up account alias for easy login</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💳 Billing Configuration</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Set up billing alerts
aws budgets create-budget \\
  --account-id 123456789012 \\
  --budget '{
    "BudgetName": "n8n-monthly-budget",
    "BudgetLimit": {
      "Amount": "50.0",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }'
  
# Enable detailed billing
aws organizations enable-aws-service-access \\
  --service-principal billingconductor.amazonaws.com`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Cost Management</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Enable Cost Explorer</li>
                          <li>• Set up billing alerts ($10, $25, $50)</li>
                          <li>• Configure cost allocation tags</li>
                          <li>• Enable AWS Trusted Advisor</li>
                          <li>• Set up AWS Budgets notifications</li>
                          <li>• Review AWS Free Tier usage</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* IAM Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>IAM Users, Roles & Policies</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>n8n Deployment IAM Policy</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:*",
        "ecr:*",
        "rds:*",
        "ec2:*",
        "elasticloadbalancing:*",
        "iam:PassRole",
        "logs:*",
        "cloudwatch:*",
        "secretsmanager:*",
        "ssm:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:AttachRolePolicy",
        "iam:CreateInstanceProfile",
        "iam:AddRoleToInstanceProfile"
      ],
      "Resource": [
        "arn:aws:iam::*:role/n8n-*",
        "arn:aws:iam::*:instance-profile/n8n-*"
      ]
    }
  ]
}`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create IAM User</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Create IAM user for n8n deployment
aws iam create-user --user-name n8n-deployer

# Create access key
aws iam create-access-key --user-name n8n-deployer

# Attach policy to user
aws iam attach-user-policy \\
  --user-name n8n-deployer \\
  --policy-arn arn:aws:iam::ACCOUNT:policy/N8nDeploymentPolicy

# Enable MFA (recommended)
aws iam create-virtual-mfa-device \\
  --virtual-mfa-device-name n8n-deployer-mfa`}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>ECS Task Role</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Create ECS task execution role
aws iam create-role \\
  --role-name n8n-ecs-task-execution-role \\
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }]
  }'

# Attach required policies
aws iam attach-role-policy \\
  --role-name n8n-ecs-task-execution-role \\
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AWS CLI & SDK Setup */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>AWS CLI & SDK Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>AWS CLI Installation</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Linux/macOS
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows (PowerShell)
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify installation
aws --version

# Configure credentials
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Configuration Profiles</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# ~/.aws/config
[default]
region = us-east-1
output = json

[profile n8n-dev]
region = us-east-1
output = json

[profile n8n-prod]
region = us-east-1
output = json

# ~/.aws/credentials
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY

[n8n-dev]
aws_access_key_id = DEV_ACCESS_KEY
aws_secret_access_key = DEV_SECRET_KEY

# Use specific profile
aws --profile n8n-prod sts get-caller-identity`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Environment Variables</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Export for current session
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1

# For production deployment
export AWS_PROFILE=n8n-prod
export AWS_DEFAULT_REGION=us-east-1

# Verify configuration
aws sts get-caller-identity
aws configure list`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>AWS SDK Integration</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Install AWS SDK for your language</li>
                          <li>• Configure credential providers</li>
                          <li>• Set up IAM roles for EC2/Lambda</li>
                          <li>• Enable AWS X-Ray tracing</li>
                          <li>• Configure retry and timeout settings</li>
                          <li>• Implement proper error handling</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Security Hardening */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>Account Security Hardening</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Root Account Security</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Enable MFA on root account</li>
                          <li>• Use hardware MFA device</li>
                          <li>• Delete root access keys</li>
                          <li>• Set strong root password</li>
                          <li>• Lock away root credentials</li>
                          <li>• Monitor root account usage</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>CloudTrail & Monitoring</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono mb-2`}>
                          {`# Enable CloudTrail
aws cloudtrail create-trail \\
  --name n8n-security-trail \\
  --s3-bucket-name n8n-cloudtrail-logs \\
  --include-global-service-events \\
  --is-multi-region-trail

# Start logging
aws cloudtrail start-logging \\
  --name n8n-security-trail

# Enable GuardDuty
aws guardduty create-detector \\
  --enable \\
  --finding-publishing-frequency FIFTEEN_MINUTES`}
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Password & Access Policies</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Enforce strong password policy</li>
                          <li>• Require MFA for all users</li>
                          <li>• Implement least privilege access</li>
                          <li>• Regular access key rotation</li>
                          <li>• Monitor unused credentials</li>
                          <li>• Set up access analyzer</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Cost Monitoring & Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>Cost Monitoring & Optimization</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Budget & Alerts Configuration</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create cost budget with notifications
aws budgets create-budget \\
  --account-id $(aws sts get-caller-identity --query Account --output text) \\
  --budget '{
    "BudgetName": "n8n-production-budget",
    "BudgetLimit": {
      "Amount": "100.0",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
      "TagKey": ["Project"],
      "TagValue": ["n8n"]
    }
  }' \\
  --notifications-with-subscribers '[
    {
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 80,
        "ThresholdType": "PERCENTAGE"
      },
      "Subscribers": [{
        "SubscriptionType": "EMAIL",
        "Address": "admin@yourcompany.com"
      }]
    }
  ]'

# Set up billing alarms
aws cloudwatch put-metric-alarm \\
  --alarm-name "n8n-billing-alarm" \\
  --alarm-description "Alert when n8n costs exceed $50" \\
  --metric-name EstimatedCharges \\
  --namespace AWS/Billing \\
  --statistic Maximum \\
  --period 86400 \\
  --threshold 50 \\
  --comparison-operator GreaterThanThreshold`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Cost Optimization Tools</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• AWS Cost Explorer for analysis</li>
                            <li>• AWS Trusted Advisor recommendations</li>
                            <li>• Reserved Instance planning</li>
                            <li>• Spot Instance opportunities</li>
                            <li>• Resource right-sizing</li>
                            <li>• Automated cost reports</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>n8n Specific Optimization</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Use Fargate Spot for dev/test</li>
                            <li>• RDS Aurora Serverless for low usage</li>
                            <li>• S3 Intelligent Tiering for logs</li>
                            <li>• CloudWatch log retention policies</li>
                            <li>• ECS auto-scaling configuration</li>
                            <li>• Resource tagging for tracking</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification & Testing */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ AWS Account Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ AWS account created and billing configured</li>
                      <li>□ IAM users and roles created with proper policies</li>
                      <li>□ AWS CLI installed and configured</li>
                      <li>□ MFA enabled on root and admin accounts</li>
                      <li>□ CloudTrail and GuardDuty enabled</li>
                      <li>□ Cost monitoring and budgets configured</li>
                      <li>□ Security policies and password requirements set</li>
                      <li>□ Account access tested and verified</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-2',
              title: 'VPC Configuration',
              description: 'Set up Virtual Private Cloud and networking',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>VPC Configuration for n8n Agent Deployment</h2>
                  
                  {/* VPC Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>💰 Business-Ready n8n Network Architecture</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">Public Subnet</div>
                        <div className="text-xs">Load Balancer</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">Private Subnet</div>
                        <div className="text-xs">n8n Agents</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">DB Subnet</div>
                        <div className="text-xs">PostgreSQL</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Create a production-ready VPC with multi-AZ subnets for high availability, security, and scalability of your n8n automation business.
                    </p>
                  </div>

                  {/* VPC Creation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Create n8n Production VPC</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>VPC with Business-Grade CIDR</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create VPC for n8n business operations
aws ec2 create-vpc \\
  --cidr-block 10.0.0.0/16 \\
  --enable-dns-hostnames \\
  --enable-dns-support \\
  --tag-specifications 'ResourceType=vpc,Tags=[
    {Key=Name,Value=n8n-production-vpc},
    {Key=Project,Value=n8n-automation},
    {Key=Environment,Value=production},
    {Key=CostCenter,Value=automation-business}
  ]'

# Enable VPC Flow Logs for security monitoring
aws ec2 create-flow-logs \\
  --resource-type VPC \\
  --resource-ids vpc-XXXXXX \\
  --traffic-type ALL \\
  --log-destination-type cloud-watch-logs \\
  --log-group-name /aws/vpc/flowlogs \\
  --deliver-logs-permission-arn arn:aws:iam::ACCOUNT:role/flowlogsRole`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Internet Gateway</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Create Internet Gateway for public access
aws ec2 create-internet-gateway \\
  --tag-specifications 'ResourceType=internet-gateway,Tags=[
    {Key=Name,Value=n8n-igw}
  ]'

# Attach to VPC
aws ec2 attach-internet-gateway \\
  --internet-gateway-id igw-XXXXXX \\
  --vpc-id vpc-XXXXXX`}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>NAT Gateway</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# Allocate Elastic IP for NAT
aws ec2 allocate-address --domain vpc

# Create NAT Gateway for private subnet internet access
aws ec2 create-nat-gateway \\
  --subnet-id subnet-XXXXXX \\
  --allocation-id eipalloc-XXXXXX \\
  --tag-specifications 'ResourceType=nat-gateway,Tags=[
    {Key=Name,Value=n8n-nat-gateway}
  ]'`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-AZ Subnet Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Multi-AZ Subnet Architecture</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Public Subnets (Load Balancers)</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Public Subnet AZ-1 (us-east-1a)
aws ec2 create-subnet \\
  --vpc-id vpc-XXXXXX \\
  --cidr-block 10.0.1.0/24 \\
  --availability-zone us-east-1a \\
  --map-public-ip-on-launch \\
  --tag-specifications 'ResourceType=subnet,Tags=[
    {Key=Name,Value=n8n-public-subnet-1a},
    {Key=Type,Value=Public},
    {Key=Tier,Value=LoadBalancer}
  ]'

# Public Subnet AZ-2 (us-east-1b) - High Availability
aws ec2 create-subnet \\
  --vpc-id vpc-XXXXXX \\
  --cidr-block 10.0.2.0/24 \\
  --availability-zone us-east-1b \\
  --map-public-ip-on-launch \\
  --tag-specifications 'ResourceType=subnet,Tags=[
    {Key=Name,Value=n8n-public-subnet-1b},
    {Key=Type,Value=Public},
    {Key=Tier,Value=LoadBalancer}
  ]'`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Private Subnets (n8n Agents)</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Private Subnet AZ-1 (n8n agents)
aws ec2 create-subnet \\
  --vpc-id vpc-XXXXXX \\
  --cidr-block 10.0.10.0/24 \\
  --availability-zone us-east-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[
    {Key=Name,Value=n8n-private-app-1a},
    {Key=Type,Value=Private},
    {Key=Tier,Value=Application}
  ]'

# Private Subnet AZ-2 (n8n agents)
aws ec2 create-subnet \\
  --vpc-id vpc-XXXXXX \\
  --cidr-block 10.0.11.0/24 \\
  --availability-zone us-east-1b \\
  --tag-specifications 'ResourceType=subnet,Tags=[
    {Key=Name,Value=n8n-private-app-1b},
    {Key=Type,Value=Private},
    {Key=Tier,Value=Application}
  ]'`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Database Subnets (PostgreSQL)</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Database Subnet AZ-1
aws ec2 create-subnet \\
  --vpc-id vpc-XXXXXX \\
  --cidr-block 10.0.20.0/24 \\
  --availability-zone us-east-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[
    {Key=Name,Value=n8n-db-subnet-1a},
    {Key=Type,Value=Database},
    {Key=Tier,Value=Data}
  ]'

# Database Subnet AZ-2
aws ec2 create-subnet \\
  --vpc-id vpc-XXXXXX \\
  --cidr-block 10.0.21.0/24 \\
  --availability-zone us-east-1b \\
  --tag-specifications 'ResourceType=subnet,Tags=[
    {Key=Name,Value=n8n-db-subnet-1b},
    {Key=Type,Value=Database},
    {Key=Tier,Value=Data}
  ]'`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Tables Configuration */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Route Tables & Traffic Flow</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Public Route Table</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Create public route table
aws ec2 create-route-table \\
  --vpc-id vpc-XXXXXX \\
  --tag-specifications 'ResourceType=route-table,Tags=[
    {Key=Name,Value=n8n-public-rt}
  ]'

# Add internet gateway route
aws ec2 create-route \\
  --route-table-id rtb-XXXXXX \\
  --destination-cidr-block 0.0.0.0/0 \\
  --gateway-id igw-XXXXXX

# Associate with public subnets
aws ec2 associate-route-table \\
  --subnet-id subnet-public-1a \\
  --route-table-id rtb-XXXXXX`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Private Route Table</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Create private route table
aws ec2 create-route-table \\
  --vpc-id vpc-XXXXXX \\
  --tag-specifications 'ResourceType=route-table,Tags=[
    {Key=Name,Value=n8n-private-rt}
  ]'

# Add NAT gateway route for internet access
aws ec2 create-route \\
  --route-table-id rtb-XXXXXX \\
  --destination-cidr-block 0.0.0.0/0 \\
  --nat-gateway-id nat-XXXXXX

# Associate with private subnets
aws ec2 associate-route-table \\
  --subnet-id subnet-private-1a \\
  --route-table-id rtb-XXXXXX`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Benefits */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>💼 Revenue-Generating Network Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Client Isolation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Separate subnets per client</li>
                          <li>• Secure multi-tenant architecture</li>
                          <li>• Compliance-ready network</li>
                          <li>• Premium service offering</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ High Availability</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 99.9% uptime SLA</li>
                          <li>• Multi-AZ redundancy</li>
                          <li>• Zero-downtime deployments</li>
                          <li>• Enterprise reliability</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Scalability</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Auto-scaling ready</li>
                          <li>• Support 1000+ workflows</li>
                          <li>• Easy client onboarding</li>
                          <li>• Recurring revenue model</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* VPC Endpoints for Cost Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>💰 Cost-Optimized VPC Endpoints</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create S3 Gateway Endpoint (Free)</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# S3 Gateway Endpoint - No data transfer charges
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-XXXXXX \\
  --service-name com.amazonaws.us-east-1.s3 \\
  --vpc-endpoint-type Gateway \\
  --route-table-ids rtb-private-XXXXXX \\
  --policy-document '{
    "Statement": [{
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::n8n-workflows/*",
        "arn:aws:s3:::n8n-backups/*"
      ]
    }]
  }'`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Interface Endpoints</h4>
                          <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                            {`# CloudWatch Logs endpoint
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-XXXXXX \\
  --service-name com.amazonaws.us-east-1.logs \\
  --vpc-endpoint-type Interface \\
  --subnet-ids subnet-private-1a subnet-private-1b

# ECR endpoints for container images
aws ec2 create-vpc-endpoint \\
  --vpc-id vpc-XXXXXX \\
  --service-name com.amazonaws.us-east-1.ecr.dkr \\
  --vpc-endpoint-type Interface`}
                          </div>
                        </div>
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Cost Savings</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Reduce NAT Gateway costs by 60%</li>
                            <li>• Free S3 data transfer</li>
                            <li>• Lower CloudWatch charges</li>
                            <li>• Improved security & performance</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ VPC Configuration Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ VPC created with proper CIDR (10.0.0.0/16)</li>
                      <li>□ Multi-AZ public subnets for load balancers</li>
                      <li>□ Multi-AZ private subnets for n8n agents</li>
                      <li>□ Multi-AZ database subnets for RDS</li>
                      <li>□ Internet Gateway attached</li>
                      <li>□ NAT Gateway configured for private internet access</li>
                      <li>□ Route tables properly associated</li>
                      <li>□ VPC endpoints configured for cost optimization</li>
                      <li>□ Flow logs enabled for security monitoring</li>
                      <li>□ Resource tags applied for billing tracking</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-3',
              title: 'Security Groups',
              description: 'Configure security groups and access rules',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Security Groups for n8n Agent Protection</h2>
                  
                  {/* Security Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🔒 Enterprise-Grade Security Architecture</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-600' : 'bg-red-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">ALB SG</div>
                        <div className="text-xs">80/443 Only</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">n8n SG</div>
                        <div className="text-xs">5678 from ALB</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">DB SG</div>
                        <div className="text-xs">5432 from n8n</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Multi-layered security groups protecting your n8n automation business with zero-trust network access and compliance-ready configuration.
                    </p>
                  </div>

                  {/* Load Balancer Security Group */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>Application Load Balancer Security</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create ALB Security Group</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create security group for Application Load Balancer
aws ec2 create-security-group \\
  --group-name n8n-alb-sg \\
  --description "n8n Application Load Balancer Security Group" \\
  --vpc-id vpc-XXXXXX \\
  --tag-specifications 'ResourceType=security-group,Tags=[
    {Key=Name,Value=n8n-alb-sg},
    {Key=Purpose,Value=LoadBalancer},
    {Key=Project,Value=n8n-automation}
  ]'

# Allow HTTP traffic (redirect to HTTPS)
aws ec2 authorize-security-group-ingress \\
  --group-id sg-XXXXXX \\
  --protocol tcp \\
  --port 80 \\
  --cidr 0.0.0.0/0 \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[
    {Key=Name,Value=HTTP-redirect}
  ]'

# Allow HTTPS traffic (secure client access)
aws ec2 authorize-security-group-ingress \\
  --group-id sg-XXXXXX \\
  --protocol tcp \\
  --port 443 \\
  --cidr 0.0.0.0/0 \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[
    {Key=Name,Value=HTTPS-secure}
  ]'`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Professional HTTPS certificates</li>
                            <li>• Client trust & credibility</li>
                            <li>• Google SEO ranking boost</li>
                            <li>• Compliance requirements met</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🛡️ Security Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Automatic HTTP to HTTPS redirect</li>
                            <li>• DDoS protection via CloudFront</li>
                            <li>• WAF integration ready</li>
                            <li>• Rate limiting capability</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* n8n Application Security Group */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>n8n Application Security</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>n8n Agent Security Group</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create security group for n8n application
aws ec2 create-security-group \\
  --group-name n8n-app-sg \\
  --description "n8n Application Security Group" \\
  --vpc-id vpc-XXXXXX \\
  --tag-specifications 'ResourceType=security-group,Tags=[
    {Key=Name,Value=n8n-app-sg},
    {Key=Purpose,Value=Application},
    {Key=Project,Value=n8n-automation}
  ]'

# Allow traffic from ALB on n8n port (5678)
aws ec2 authorize-security-group-ingress \\
  --group-id sg-n8n-app \\
  --protocol tcp \\
  --port 5678 \\
  --source-group sg-alb-XXXXXX \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[
    {Key=Name,Value=n8n-web-interface}
  ]'

# Allow webhook traffic from ALB (port 5678 for webhooks)
aws ec2 authorize-security-group-ingress \\
  --group-id sg-n8n-app \\
  --protocol tcp \\
  --port 5678 \\
  --source-group sg-alb-XXXXXX \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[
    {Key=Name,Value=n8n-webhook-traffic}
  ]'`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Database Security Group */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Database Security (PostgreSQL)</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>RDS PostgreSQL Security Group</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create security group for PostgreSQL database
aws ec2 create-security-group \\
  --group-name n8n-db-sg \\
  --description "n8n PostgreSQL Database Security Group" \\
  --vpc-id vpc-XXXXXX \\
  --tag-specifications 'ResourceType=security-group,Tags=[
    {Key=Name,Value=n8n-db-sg},
    {Key=Purpose,Value=Database},
    {Key=Project,Value=n8n-automation}
  ]'

# Allow PostgreSQL traffic from n8n application only
aws ec2 authorize-security-group-ingress \\
  --group-id sg-db-XXXXXX \\
  --protocol tcp \\
  --port 5432 \\
  --source-group sg-n8n-app \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[
    {Key=Name,Value=postgresql-access},
    {Key=Source,Value=n8n-application}
  ]'

# Optional: Allow access from bastion for database administration
aws ec2 authorize-security-group-ingress \\
  --group-id sg-db-XXXXXX \\
  --protocol tcp \\
  --port 5432 \\
  --source-group sg-bastion \\
  --tag-specifications 'ResourceType=security-group-rule,Tags=[
    {Key=Name,Value=admin-access}
  ]'`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔐 Zero Trust Access</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Database isolated in private subnets</li>
                            <li>• Only n8n application can connect</li>
                            <li>• No direct internet access</li>
                            <li>• Encrypted connections required</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Business Protection</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Client data protection</li>
                            <li>• GDPR/CCPA compliance</li>
                            <li>• SOC 2 audit readiness</li>
                            <li>• Enterprise client requirements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Security Features */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Advanced Security Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>WAF Integration</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Create WAF for additional protection
aws wafv2 create-web-acl \\
  --name n8n-waf \\
  --scope REGIONAL \\
  --default-action Allow={} \\
  --rules '[
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {"Block": {}},
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ]'`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Network ACLs</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Create restrictive Network ACL for database subnet
aws ec2 create-network-acl \\
  --vpc-id vpc-XXXXXX \\
  --tag-specifications 'ResourceType=network-acl,Tags=[
    {Key=Name,Value=n8n-db-nacl}
  ]'

# Allow only PostgreSQL from application subnet
aws ec2 create-network-acl-entry \\
  --network-acl-id acl-XXXXXX \\
  --rule-number 100 \\
  --protocol tcp \\
  --port-range From=5432,To=5432 \\
  --cidr-block 10.0.10.0/24 \\
  --rule-action allow`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>VPC Flow Logs Analysis</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Monitor all network traffic</li>
                          <li>• Detect unusual access patterns</li>
                          <li>• Automated security alerts</li>
                          <li>• Compliance audit trails</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Security Group Automation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Automated rule updates</li>
                          <li>• Least privilege access</li>
                          <li>• Regular security reviews</li>
                          <li>• Client-specific isolation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Security Best Practices */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🏆 Enterprise Security Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Client Segmentation</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Separate security groups per client</li>
                          <li>• Isolated network segments</li>
                          <li>• Custom compliance rules</li>
                          <li>• Premium security offerings</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Monitoring & Alerts</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Real-time security monitoring</li>
                          <li>• Automated threat detection</li>
                          <li>• Client security reports</li>
                          <li>• SLA compliance tracking</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Regular Reviews</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Monthly security group audits</li>
                          <li>• Unused rule cleanup</li>
                          <li>• Access pattern analysis</li>
                          <li>• Continuous improvement</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Security Groups Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ ALB security group allows HTTP (80) and HTTPS (443)</li>
                      <li>□ n8n app security group allows traffic from ALB only</li>
                      <li>□ Database security group allows PostgreSQL from app only</li>
                      <li>□ No security group allows unrestricted access (0.0.0.0/0)</li>
                      <li>□ Bastion host configured for secure administration</li>
                      <li>□ WAF configured for additional protection</li>
                      <li>□ Network ACLs provide subnet-level protection</li>
                      <li>□ VPC Flow Logs enabled for monitoring</li>
                      <li>□ All security groups properly tagged</li>
                      <li>□ Security group rules documented and reviewed</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'infrastructure',
          title: '🏗️ Infrastructure',
          description: 'Set up AWS infrastructure components',
          steps: [
            {
              id: 'aws-step-4',
              title: 'RDS Database Setup',
              description: 'Configure managed PostgreSQL database',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>RDS PostgreSQL Database for n8n Business</h2>
                  
                  {/* Database Overview */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>💰 Business-Grade PostgreSQL Database</h3>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-600' : 'bg-green-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">Multi-AZ</div>
                        <div className="text-xs">99.95% Uptime</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-600' : 'bg-blue-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">Encrypted</div>
                        <div className="text-xs">AES-256</div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600'}`}>→</div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-600' : 'bg-purple-500'} text-white px-3 py-2 rounded-lg text-center`}>
                        <div className="font-semibold text-sm">Automated</div>
                        <div className="text-xs">Backups</div>
                      </div>
                    </div>
                    <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Enterprise-ready PostgreSQL with automatic backups, multi-AZ deployment, and performance monitoring for your n8n automation business.
                    </p>
                  </div>

                  {/* DB Subnet Group */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Database Subnet Group Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create DB Subnet Group</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create DB subnet group for Multi-AZ deployment
aws rds create-db-subnet-group \\
  --db-subnet-group-name n8n-db-subnet-group \\
  --db-subnet-group-description "n8n PostgreSQL Database Subnet Group" \\
  --subnet-ids subnet-db-1a subnet-db-1b \\
  --tags Key=Name,Value=n8n-db-subnet-group \\
         Key=Project,Value=n8n-automation \\
         Key=Environment,Value=production

# Verify subnet group creation
aws rds describe-db-subnet-groups \\
  --db-subnet-group-name n8n-db-subnet-group`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏗️ High Availability</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Multi-AZ deployment across 2 zones</li>
                            <li>• Automatic failover in &lt; 60 seconds</li>
                            <li>• Synchronous data replication</li>
                            <li>• 99.95% availability SLA</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Enterprise client confidence</li>
                            <li>• Premium service offerings</li>
                            <li>• Reduced downtime costs</li>
                            <li>• SLA compliance guarantees</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parameter Group */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>Performance-Optimized Parameter Group</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>n8n Optimized Parameters</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create parameter group optimized for n8n workloads
aws rds create-db-parameter-group \\
  --db-parameter-group-name n8n-postgres15-params \\
  --db-parameter-group-family postgres15 \\
  --description "n8n Optimized PostgreSQL 15 Parameters"

# Optimize for n8n workflow performance
aws rds modify-db-parameter-group \\
  --db-parameter-group-name n8n-postgres15-params \\
  --parameters "ParameterName=shared_preload_libraries,ParameterValue=pg_stat_statements,ApplyMethod=pending-reboot" \\
               "ParameterName=max_connections,ParameterValue=200,ApplyMethod=pending-reboot" \\
               "ParameterName=work_mem,ParameterValue=16MB,ApplyMethod=immediate" \\
               "ParameterName=effective_cache_size,ParameterValue=1GB,ApplyMethod=immediate" \\
               "ParameterName=checkpoint_timeout,ParameterValue=15min,ApplyMethod=immediate" \\
               "ParameterName=wal_buffers,ParameterValue=16MB,ApplyMethod=pending-reboot"

# Enable query logging for optimization
aws rds modify-db-parameter-group \\
  --db-parameter-group-name n8n-postgres15-params \\
  --parameters "ParameterName=log_statement,ParameterValue=mod,ApplyMethod=immediate" \\
               "ParameterName=log_min_duration_statement,ParameterValue=1000,ApplyMethod=immediate"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Performance Tuning</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Increased connection pool (200)</li>
                            <li>• Optimized memory allocation</li>
                            <li>• Enhanced query performance</li>
                            <li>• Workflow execution monitoring</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Revenue Impact</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Support 10x more workflows</li>
                            <li>• Faster client automations</li>
                            <li>• Reduced server costs</li>
                            <li>• Premium performance tier</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RDS Instance Creation */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>Create Production RDS Instance</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Business-Grade PostgreSQL Instance</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create production PostgreSQL instance for n8n
aws rds create-db-instance \\
  --db-instance-identifier n8n-postgres-prod \\
  --db-instance-class db.t3.medium \\
  --engine postgres \\
  --engine-version 15.4 \\
  --master-username n8nadmin \\
  --master-user-password 'YourSecurePassword123!' \\
  --allocated-storage 100 \\
  --max-allocated-storage 1000 \\
  --storage-type gp3 \\
  --storage-encrypted \\
  --db-subnet-group-name n8n-db-subnet-group \\
  --vpc-security-group-ids sg-n8n-db \\
  --db-parameter-group-name n8n-postgres15-params \\
  --backup-retention-period 7 \\
  --backup-window "03:00-04:00" \\
  --maintenance-window "sun:04:00-sun:05:00" \\
  --multi-az \\
  --auto-minor-version-upgrade \\
  --copy-tags-to-snapshot \\
  --deletion-protection \\
  --enable-performance-insights \\
  --performance-insights-retention-period 7 \\
  --monitoring-interval 60 \\
  --monitoring-role-arn arn:aws:iam::ACCOUNT:role/rds-monitoring-role \\
  --tags Key=Name,Value=n8n-postgres-production \\
         Key=Project,Value=n8n-automation \\
         Key=Environment,Value=production \\
         Key=CostCenter,Value=automation-business \\
         Key=BackupRequired,Value=true`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Monitor Instance Creation</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Monitor database creation progress
aws rds describe-db-instances \\
  --db-instance-identifier n8n-postgres-prod \\
  --query 'DBInstances[0].DBInstanceStatus'

# Get database endpoint when ready
aws rds describe-db-instances \\
  --db-instance-identifier n8n-postgres-prod \\
  --query 'DBInstances[0].Endpoint.Address' \\
  --output text

# Test connectivity (from n8n instance)
psql -h n8n-postgres-prod.XXXXXX.us-east-1.rds.amazonaws.com \\
     -U n8nadmin \\
     -d postgres \\
     -c "SELECT version();"

# Create n8n database
psql -h n8n-postgres-prod.XXXXXX.us-east-1.rds.amazonaws.com \\
     -U n8nadmin \\
     -d postgres \\
     -c "CREATE DATABASE n8n;"

# Create dedicated n8n user (best practice)
psql -h n8n-postgres-prod.XXXXXX.us-east-1.rds.amazonaws.com \\
     -U n8nadmin \\
     -d postgres \\
     -c "CREATE USER n8nuser WITH PASSWORD 'N8nSecurePass123!';"

psql -h n8n-postgres-prod.XXXXXX.us-east-1.rds.amazonaws.com \\
     -U n8nadmin \\
     -d postgres \\
     -c "GRANT ALL PRIVILEGES ON DATABASE n8n TO n8nuser;"`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security & Encryption */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🔒 Enterprise Security & Compliance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Database Security Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          <li>• AES-256 encryption at rest</li>
                          <li>• SSL/TLS encryption in transit</li>
                          <li>• Private subnet isolation</li>
                          <li>• Security group restrictions</li>
                          <li>• Deletion protection enabled</li>
                          <li>• Automated security patches</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Compliance Benefits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          <li>• GDPR data protection compliance</li>
                          <li>• SOC 2 Type II requirements</li>
                          <li>• HIPAA eligible infrastructure</li>
                          <li>• PCI DSS Level 1 compliance</li>
                          <li>• Enterprise audit requirements</li>
                          <li>• Client data sovereignty</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>SSL Connection Setup</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Download RDS CA certificate
wget https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem

# Test SSL connection
psql "host=n8n-postgres-prod.XXXXXX.us-east-1.rds.amazonaws.com \\
      port=5432 \\
      dbname=n8n \\
      user=n8nuser \\
      password=N8nSecurePass123! \\
      sslmode=require \\
      sslcert=client-cert.pem \\
      sslkey=client-key.pem \\
      sslrootcert=us-east-1-bundle.pem"`}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Backup & Recovery</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-2 rounded font-mono`}>
                          {`# Create manual snapshot for deployment milestone
aws rds create-db-snapshot \\
  --db-instance-identifier n8n-postgres-prod \\
  --db-snapshot-identifier n8n-prod-initial-setup

# Test point-in-time recovery capability
aws rds describe-db-instances \\
  --db-instance-identifier n8n-postgres-prod \\
  --query 'DBInstances[0].EarliestRestorableTime'`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Optimization */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-cyan-50 dark:bg-cyan-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-cyan-200 dark:border-cyan-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-cyan-600 dark:text-cyan-400 mb-4`}>💰 Cost Optimization Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💵 Reserved Instances</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 1-year term: 40% savings</li>
                          <li>• 3-year term: 60% savings</li>
                          <li>• All upfront: Maximum discount</li>
                          <li>• No upfront: Lower savings</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Right-Sizing</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Start with db.t3.medium</li>
                          <li>• Monitor CPU & memory usage</li>
                          <li>• Scale up when &gt; 80% usage</li>
                          <li>• Consider Aurora Serverless</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Auto-Scaling Storage</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Start with 100GB storage</li>
                          <li>• Auto-scale to 1TB max</li>
                          <li>• GP3 storage for cost efficiency</li>
                          <li>• Monitor storage metrics</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Monthly Cost Estimate</h4>
                      <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                        {`# Production RDS Cost Breakdown (us-east-1)
db.t3.medium (Multi-AZ):     ~$85/month
100GB GP3 storage:           ~$12/month  
7-day automated backups:     ~$3/month
Performance Insights:        ~$7/month
Data transfer (estimated):   ~$15/month
-----------------------------------------
Total estimated cost:        ~$122/month

# With 1-year Reserved Instance:
Reserved Instance discount:   -$34/month
Final cost:                  ~$88/month

# Revenue potential with this setup:
Support 50+ clients:         $2,500+/month
ROI on database costs:       2,800%+`}
                      </div>
                    </div>
                  </div>

                  {/* Verification Checklist */}
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ RDS Database Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ DB subnet group created across multiple AZs</li>
                      <li>□ Custom parameter group with n8n optimizations</li>
                      <li>□ RDS instance created with Multi-AZ deployment</li>
                      <li>□ Encryption enabled (at rest and in transit)</li>
                      <li>□ Security groups restrict access to n8n only</li>
                      <li>□ Automated backups configured (7 days)</li>
                      <li>□ Performance Insights enabled</li>
                      <li>□ n8n database and user created</li>
                      <li>□ SSL connectivity tested and verified</li>
                      <li>□ Cost optimization settings applied</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-5',
              title: 'ECS Cluster Creation',
              description: 'Set up Elastic Container Service cluster',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>ECS Cluster for Scalable n8n Business</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 Fargate Serverless Container Platform</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create Production ECS Cluster</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
{`# Create ECS cluster for n8n automation business
aws ecs create-cluster \\
  --cluster-name n8n-production-cluster \\
  --capacity-providers FARGATE FARGATE_SPOT \\
  --default-capacity-provider-strategy \\
    capacityProvider=FARGATE,weight=1,base=1 \\
    capacityProvider=FARGATE_SPOT,weight=4 \\
  --tags key=Name,value=n8n-production-cluster \\
         key=Project,value=n8n-automation \\
         key=Environment,value=production

# Enable Container Insights for monitoring
aws ecs put-account-setting \\
  --name containerInsights \\
  --value enabled

# Create log group for cluster logs
aws logs create-log-group \\
  --log-group-name /ecs/n8n-cluster \\
  --retention-in-days 30`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Optimization</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Fargate Spot: 70% cost savings</li>
                            <li>• Pay only for running containers</li>
                            <li>• Auto-scaling based on demand</li>
                            <li>• No idle server costs</li>
                            <li>• Estimated: $20-50/month per client</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Business Revenue</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Handle 1000+ concurrent workflows</li>
                            <li>• Instant client onboarding</li>
                            <li>• Multi-tenant architecture</li>
                            <li>• Revenue: $50-500/client/month</li>
                            <li>• Scalable to $75,000+/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ ECS Cluster Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ ECS cluster created with Fargate capacity</li>
                      <li>□ Fargate Spot enabled for 70% cost savings</li>
                      <li>□ Container Insights monitoring enabled</li>
                      <li>□ Log groups configured for debugging</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-6',
              title: 'Load Balancer Configuration',
              description: 'Configure Application Load Balancer',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Application Load Balancer for Business Traffic</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🌐 Professional Client Access</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create Application Load Balancer</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create target group for n8n containers
aws elbv2 create-target-group \\
  --name n8n-targets \\
  --protocol HTTP \\
  --port 5678 \\
  --vpc-id vpc-XXXXXX \\
  --target-type ip \\
  --health-check-path /healthz \\
  --health-check-interval-seconds 30 \\
  --healthy-threshold-count 2 \\
  --unhealthy-threshold-count 5

# Create Application Load Balancer
aws elbv2 create-load-balancer \\
  --name n8n-production-alb \\
  --subnets subnet-public-1a subnet-public-1b \\
  --security-groups sg-n8n-alb \\
  --scheme internet-facing \\
  --type application \\
  --ip-address-type ipv4

# Create HTTPS listener (production)
aws elbv2 create-listener \\
  --load-balancer-arn arn:aws:elasticloadbalancing:... \\
  --protocol HTTPS \\
  --port 443 \\
  --certificates CertificateArn=arn:aws:acm:... \\
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...

# HTTP to HTTPS redirect
aws elbv2 create-listener \\
  --load-balancer-arn arn:aws:elasticloadbalancing:... \\
  --protocol HTTP \\
  --port 80 \\
  --default-actions Type=redirect,RedirectConfig='{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Enterprise Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• SSL termination with ACM certificates</li>
                            <li>• Multi-AZ high availability</li>
                            <li>• Health checks and failover</li>
                            <li>• Professional domain setup</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Custom domain per client: $200+/month</li>
                            <li>• Browser security indicators</li>
                            <li>• Fast global content delivery</li>
                            <li>• Professional client appearance</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Load Balancer Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Target group created for n8n containers</li>
                      <li>□ ALB deployed across multiple AZs</li>
                      <li>□ HTTPS listener with SSL certificate</li>
                      <li>□ HTTP to HTTPS redirect configured</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'deployment',
          title: '🚀 Deployment',
          description: 'Deploy n8n to AWS',
          steps: [
            {
              id: 'aws-step-7',
              title: 'Container Image Build',
              description: 'Build and push Docker image to ECR',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Container Image Build & ECR Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📦 ECR Container Registry Setup</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create ECR Repository & Build Pipeline</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create ECR repository for n8n images
aws ecr create-repository \\
  --repository-name n8n-production \\
  --image-scanning-configuration scanOnPush=true \\
  --encryption-configuration encryptionType=AES256

# Get login token and authenticate Docker
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin \\
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build optimized n8n image for business use
docker build -t n8n-business . -f Dockerfile.production

# Tag for ECR
docker tag n8n-business:latest \\
  123456789012.dkr.ecr.us-east-1.amazonaws.com/n8n-production:latest

# Push to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/n8n-production:latest`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Deployment Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Automated vulnerability scanning</li>
                            <li>• Immutable image versions</li>
                            <li>• Fast container startup times</li>
                            <li>• Blue/green deployments ready</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Impact</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Consistent client environments</li>
                            <li>• Rapid scaling capabilities</li>
                            <li>• Version rollback in seconds</li>
                            <li>• Multi-client isolation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Container Image Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ ECR repository created with scanning enabled</li>
                      <li>□ Production Dockerfile optimized</li>
                      <li>□ Docker authentication configured</li>
                      <li>□ Image built and pushed to ECR</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-8',
              title: 'ECS Service Deployment',
              description: 'Deploy n8n service on ECS Fargate',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>ECS Service Deployment for n8n Business</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>⚙️ Production ECS Service</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Deploy n8n Service with Auto-Scaling</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create ECS service for n8n production
aws ecs create-service \\
  --cluster n8n-production-cluster \\
  --service-name n8n-service \\
  --task-definition n8n-production:1 \\
  --desired-count 2 \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1a,subnet-private-1b],securityGroups=[sg-n8n-app],assignPublicIp=DISABLED}" \\
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=n8n,containerPort=5678 \\
  --enable-execute-command

# Configure auto scaling
aws application-autoscaling register-scalable-target \\
  --service-namespace ecs \\
  --scalable-dimension ecs:service:DesiredCount \\
  --resource-id service/n8n-production-cluster/n8n-service \\
  --min-capacity 1 \\
  --max-capacity 20

# Create auto scaling policy
aws application-autoscaling put-scaling-policy \\
  --service-namespace ecs \\
  --scalable-dimension ecs:service:DesiredCount \\
  --resource-id service/n8n-production-cluster/n8n-service \\
  --policy-name n8n-cpu-scaling \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-scaling-policy-configuration "TargetValue=70.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization}"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Revenue Scaling</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Auto-scale 1-20 containers</li>
                            <li>• Handle 1000+ workflows</li>
                            <li>• Support 100+ clients</li>
                            <li>• Monthly revenue: $75,000+</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Deployment Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Zero-downtime deployments</li>
                            <li>• Health check monitoring</li>
                            <li>• Automatic failover</li>
                            <li>• Rolling updates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ ECS Service Deployment Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ ECS service created and running</li>
                      <li>□ Auto-scaling configured (1-20 tasks)</li>
                      <li>□ Load balancer integration working</li>
                      <li>□ Health checks passing</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-9',
              title: 'SSL Certificate Setup',
              description: 'Configure SSL certificates with ACM',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>SSL Certificate Setup with ACM</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🔐 Professional SSL Certificates</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Request & Validate SSL Certificate</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Request SSL certificate for your business domain
aws acm request-certificate \\
  --domain-name yourbusiness.com \\
  --subject-alternative-names "*.yourbusiness.com" "n8n.yourbusiness.com" \\
  --validation-method DNS \\
  --tags Key=Name,Value=yourbusiness-ssl Key=Project,Value=n8n-automation

# Get validation DNS records
aws acm describe-certificate \\
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/... \\
  --query 'Certificate.DomainValidationOptions[*].ResourceRecord'

# Add DNS validation records to your domain
# Route53 example:
aws route53 change-resource-record-sets \\
  --hosted-zone-id Z1234567890ABC \\
  --change-batch '{"Changes":[{"Action":"CREATE","ResourceRecordSet":{"Name":"_validation.yourbusiness.com","Type":"CNAME","TTL":300,"ResourceRecords":[{"Value":"validation-string.acm-validations.aws."}]}}]}'

# Wait for certificate validation
aws acm wait certificate-validated \\
  --certificate-arn arn:aws:acm:us-east-1:123456789012:certificate/...`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Business Credibility</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Professional green lock icon</li>
                            <li>• Client trust and confidence</li>
                            <li>• Browser security warnings eliminated</li>
                            <li>• Enterprise compliance requirements</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Revenue Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Charge premium rates with SSL</li>
                            <li>• Custom domain per client: $200+/month</li>
                            <li>• Enterprise client acquisition</li>
                            <li>• Professional service positioning</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ SSL Certificate Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ ACM certificate requested</li>
                      <li>□ DNS validation records added</li>
                      <li>□ Certificate validated and issued</li>
                      <li>□ Load balancer configured with SSL</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'monitoring',
          title: '📊 Monitoring',
          description: 'Set up monitoring and observability',
          steps: [
            {
              id: 'aws-step-10',
              title: 'CloudWatch Setup',
              description: 'Configure comprehensive monitoring with CloudWatch',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>CloudWatch Monitoring & Business Intelligence</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>📊 Revenue & Performance Monitoring</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Configure Business Metrics Dashboard</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create custom metrics for business KPIs
aws cloudwatch put-metric-data \\
  --namespace "N8N/Business" \\
  --metric-data MetricName=WorkflowExecutions,Value=1,Unit=Count \\
               MetricName=ClientRevenue,Value=500,Unit=None \\
               MetricName=ActiveClients,Value=1,Unit=Count

# Create business dashboard
aws cloudwatch put-dashboard \\
  --dashboard-name "N8N-Business-Dashboard" \\
  --dashboard-body file://dashboard-config.json

# Set up revenue tracking alarms
aws cloudwatch put-metric-alarm \\
  --alarm-name "Low-Revenue-Alert" \\
  --alarm-description "Alert when daily revenue drops below threshold" \\
  --metric-name ClientRevenue \\
  --namespace N8N/Business \\
  --statistic Sum \\
  --period 86400 \\
  --threshold 1000 \\
  --comparison-operator LessThanThreshold \\
  --evaluation-periods 1`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Metrics</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Client workflow execution tracking</li>
                            <li>• Revenue per client monitoring</li>
                            <li>• System uptime guarantees</li>
                            <li>• Performance SLA tracking</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Business Value</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Proactive issue resolution</li>
                            <li>• Client satisfaction monitoring</li>
                            <li>• Capacity planning for growth</li>
                            <li>• Cost optimization insights</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ CloudWatch Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Business metrics dashboard created</li>
                      <li>□ Revenue tracking alarms configured</li>
                      <li>□ System performance monitoring active</li>
                      <li>□ Client SLA monitoring setup</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-11',
              title: 'Auto Scaling Configuration',
              description: 'Set up auto scaling policies and alarms',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Auto Scaling for Business Growth</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>⚡ Revenue-Driven Auto Scaling</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Scale Resources Based on Client Demand</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create scaling policy for high demand periods
aws application-autoscaling put-scaling-policy \\
  --service-namespace ecs \\
  --scalable-dimension ecs:service:DesiredCount \\
  --resource-id service/n8n-production-cluster/n8n-service \\
  --policy-name n8n-high-demand-scaling \\
  --policy-type StepScaling \\
  --step-scaling-policy-configuration '{"AdjustmentType":"ChangeInCapacity","StepAdjustments":[{"MetricIntervalLowerBound":0,"MetricIntervalUpperBound":50,"ScalingAdjustment":2},{"MetricIntervalLowerBound":50,"ScalingAdjustment":4}],"MinAdjustmentMagnitude":1,"Cooldown":300}'

# Create alarms for business-critical scaling
aws cloudwatch put-metric-alarm \\
  --alarm-name "N8N-High-CPU-Scale-Up" \\
  --alarm-description "Scale up when CPU exceeds 70%" \\
  --metric-name CPUUtilization \\
  --namespace AWS/ECS \\
  --statistic Average \\
  --period 300 \\
  --threshold 70 \\
  --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 2 \\
  --alarm-actions arn:aws:autoscaling:us-east-1:123456789012:scalingPolicy:...

# Revenue-based scaling (custom metric)
aws cloudwatch put-metric-alarm \\
  --alarm-name "N8N-High-Workflow-Volume" \\
  --alarm-description "Scale up when workflow volume indicates more clients" \\
  --metric-name WorkflowExecutions \\
  --namespace N8N/Business \\
  --statistic Sum \\
  --period 900 \\
  --threshold 1000 \\
  --comparison-operator GreaterThanThreshold \\
  --evaluation-periods 1`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Efficiency</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Pay only for actual usage</li>
                            <li>• Scale down during quiet hours</li>
                            <li>• Maximize profit margins</li>
                            <li>• Predictable monthly costs</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Business Growth</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Handle traffic spikes automatically</li>
                            <li>• Support unlimited client growth</li>
                            <li>• Maintain SLA during peak loads</li>
                            <li>• Scale to $100K+ monthly revenue</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Auto Scaling Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ CPU-based scaling policies configured</li>
                      <li>□ Custom business metric alarms setup</li>
                      <li>□ Scale-up and scale-down policies balanced</li>
                      <li>□ Cost monitoring and alerts active</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-12',
              title: 'Backup Strategy',
              description: 'Implement backup and disaster recovery',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Enterprise Backup & Disaster Recovery</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🛡️ Business Continuity Protection</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Comprehensive Backup Strategy</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Set up cross-region RDS backup
aws rds modify-db-instance \\
  --db-instance-identifier n8n-postgres-prod \\
  --backup-retention-period 30 \\
  --backup-window "03:00-04:00" \\
  --delete-automated-backups false

# Create manual backup before major updates
aws rds create-db-snapshot \\
  --db-snapshot-identifier n8n-manual-backup-$(date +%Y%m%d) \\
  --db-instance-identifier n8n-postgres-prod

# Set up ECS service backup using AWS Backup
aws backup create-backup-plan \\
  --backup-plan BackupPlanName=N8N-Enterprise-Backup \\
              Rules='[{"RuleName":"DailyBackups","TargetBackupVault":"default","ScheduleExpression":"cron(0 5 ? * * *)","StartWindowMinutes":480,"CompletionWindowMinutes":10080,"Lifecycle":{"DeleteAfterDays":35}}]'

# Create disaster recovery in secondary region
aws cloudformation create-stack \\
  --stack-name n8n-disaster-recovery \\
  --template-url https://s3.amazonaws.com/templates/n8n-dr-template.yaml \\
  --region us-west-2 \\
  --parameters ParameterKey=PrimaryRegion,ParameterValue=us-east-1`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Enterprise SLA</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 99.99% uptime guarantee</li>
                            <li>• 30-day backup retention</li>
                            <li>• 4-hour RTO (Recovery Time)</li>
                            <li>• 15-minute RPO (Data Loss)</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Business Protection</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Protect $100K+ monthly revenue</li>
                            <li>• Client data sovereignty</li>
                            <li>• Compliance requirements met</li>
                            <li>• Insurance-grade protection</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Backup Strategy Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Daily automated database backups</li>
                      <li>□ Manual backup procedures documented</li>
                      <li>□ Cross-region disaster recovery setup</li>
                      <li>□ Recovery procedures tested and verified</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    gcp: {
      id: 'gcp',
      title: 'Google Cloud Deployment',
      icon: <Globe className="h-5 w-5" />,
      description: 'Deploy n8n agents on Google Cloud Platform',
      sections: [
        {
          id: 'foundation',
          title: '🌐 Foundation',
          description: 'GCP deployment basics',
          steps: [
            {
              id: 'gcp-step-1',
              title: 'GCP Project Setup',
              description: 'Create and configure Google Cloud project',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google Cloud Project Setup for n8n Business</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🌍 Enterprise Google Cloud Foundation</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create & Configure GCP Project</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Create new project for n8n automation business
gcloud projects create n8n-automation-business --name="N8N Automation Business"

# Set the project as active
gcloud config set project n8n-automation-business

# Enable required APIs for n8n deployment
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable monitoring.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com

# Set up billing (required for production resources)
gcloud billing projects link n8n-automation-business --billing-account=BILLING_ACCOUNT_ID

# Verify project setup
gcloud config list
gcloud services list --enabled`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Global infrastructure presence</li>
                            <li>• Enterprise-grade security</li>
                            <li>• Pay-as-you-scale pricing</li>
                            <li>• 99.99% uptime SLA</li>
                            <li>• Advanced machine learning integration</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Optimization</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• $300 free credits for new accounts</li>
                            <li>• Sustained use discounts</li>
                            <li>• Preemptible instances: 80% savings</li>
                            <li>• Per-second billing precision</li>
                            <li>• Estimated monthly cost: $50-120</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>📈 Revenue Potential on GCP</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Starter Package</h4>
                        <p className={`text-2xl font-bold text-green-600 ${theme === 'gradient' ? 'text-green-400' : ''}`}>$2,500/mo</p>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>10 clients × $250/month</p>
                      </div>
                      <div className="text-center">
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Growth Package</h4>
                        <p className={`text-2xl font-bold text-green-600 ${theme === 'gradient' ? 'text-green-400' : ''}`}>$25,000/mo</p>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>50 clients × $500/month</p>
                      </div>
                      <div className="text-center">
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Enterprise Package</h4>
                        <p className={`text-2xl font-bold text-green-600 ${theme === 'gradient' ? 'text-green-400' : ''}`}>$100,000/mo</p>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>100 clients × $1,000/month</p>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ GCP Project Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Google Cloud CLI installed and configured</li>
                      <li>□ New GCP project created for n8n business</li>
                      <li>□ All required APIs enabled</li>
                      <li>□ Billing account linked and active</li>
                      <li>□ Project permissions verified</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-2',
              title: 'IAM Configuration',
              description: 'Set up Identity and Access Management',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>IAM Configuration for Secure n8n Business</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🔐 Enterprise Security & Access Management</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create Service Accounts & Roles</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create service account for n8n application
gcloud iam service-accounts create n8n-app-service \\
  --display-name="N8N Application Service Account" \\
  --description="Service account for n8n automation platform"

# Create service account for Cloud SQL access
gcloud iam service-accounts create n8n-db-service \\
  --display-name="N8N Database Service Account" \\
  --description="Service account for Cloud SQL database access"

# Create service account for monitoring and logging
gcloud iam service-accounts create n8n-monitoring-service \\
  --display-name="N8N Monitoring Service Account" \\
  --description="Service account for monitoring and logging"

# Grant necessary roles to n8n app service account
gcloud projects add-iam-policy-binding n8n-automation-business \\
  --member="serviceAccount:n8n-app-service@n8n-automation-business.iam.gserviceaccount.com" \\
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding n8n-automation-business \\
  --member="serviceAccount:n8n-app-service@n8n-automation-business.iam.gserviceaccount.com" \\
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding n8n-automation-business \\
  --member="serviceAccount:n8n-app-service@n8n-automation-business.iam.gserviceaccount.com" \\
  --role="roles/artifactregistry.reader"

# Grant roles for database service account
gcloud projects add-iam-policy-binding n8n-automation-business \\
  --member="serviceAccount:n8n-db-service@n8n-automation-business.iam.gserviceaccount.com" \\
  --role="roles/cloudsql.admin"

# Create and download service account keys
gcloud iam service-accounts keys create n8n-app-key.json \\
  --iam-account=n8n-app-service@n8n-automation-business.iam.gserviceaccount.com

gcloud iam service-accounts keys create n8n-db-key.json \\
  --iam-account=n8n-db-service@n8n-automation-business.iam.gserviceaccount.com`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Security Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Least privilege access principle</li>
                            <li>• Automated credential rotation</li>
                            <li>• Fine-grained permission control</li>
                            <li>• Enterprise audit trail</li>
                            <li>• SOC 2 & ISO 27001 compliance</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Value</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Enterprise client trust</li>
                            <li>• Compliance requirements met</li>
                            <li>• Reduced security breach risk</li>
                            <li>• Premium service positioning</li>
                            <li>• Insurance cost reductions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>⚠️ Security Best Practices</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Key Management</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Store service account keys securely</li>
                          <li>• Use Google Secret Manager for sensitive data</li>
                          <li>• Rotate keys every 90 days</li>
                          <li>• Never commit keys to version control</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Access Control</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Enable 2FA for all admin accounts</li>
                          <li>• Use IAM conditions for time-based access</li>
                          <li>• Regular access reviews and audits</li>
                          <li>• Implement organization policies</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ IAM Configuration Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Service accounts created for each component</li>
                      <li>□ Minimum required roles assigned</li>
                      <li>□ Service account keys generated and secured</li>
                      <li>□ IAM policies tested and verified</li>
                      <li>□ Audit logging enabled</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-3',
              title: 'VPC Network Setup',
              description: 'Configure Virtual Private Cloud networking',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>VPC Network Setup for Scalable n8n Architecture</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🌐 Enterprise Virtual Private Cloud</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create Multi-Region VPC Network</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create custom VPC network for n8n business
gcloud compute networks create n8n-vpc \\
  --subnet-mode custom \\
  --bgp-routing-mode global \\
  --description="N8N automation business VPC"

# Create subnet for Cloud Run services (primary region)
gcloud compute networks subnets create n8n-subnet-primary \\
  --network n8n-vpc \\
  --range 10.1.0.0/16 \\
  --region us-central1 \\
  --description="Primary subnet for n8n services"

# Create subnet for Cloud SQL (primary region)
gcloud compute networks subnets create n8n-db-subnet-primary \\
  --network n8n-vpc \\
  --range 10.2.0.0/16 \\
  --region us-central1 \\
  --description="Database subnet for Cloud SQL"

# Create subnet for disaster recovery (secondary region)
gcloud compute networks subnets create n8n-subnet-dr \\
  --network n8n-vpc \\
  --range 10.10.0.0/16 \\
  --region us-east1 \\
  --description="Disaster recovery subnet"

# Create firewall rules for n8n traffic
gcloud compute firewall-rules create n8n-allow-http \\
  --network n8n-vpc \\
  --allow tcp:80,tcp:443 \\
  --source-ranges 0.0.0.0/0 \\
  --description="Allow HTTP/HTTPS traffic to n8n"

gcloud compute firewall-rules create n8n-allow-internal \\
  --network n8n-vpc \\
  --allow tcp:5678,tcp:5432 \\
  --source-ranges 10.0.0.0/8 \\
  --description="Allow internal n8n and database traffic"

# Configure NAT gateway for outbound internet access
gcloud compute routers create n8n-router \\
  --network n8n-vpc \\
  --region us-central1

gcloud compute routers nats create n8n-nat \\
  --router n8n-router \\
  --region us-central1 \\
  --nat-all-subnet-ip-ranges \\
  --auto-allocate-nat-external-ips`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Security Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Private IP address ranges</li>
                            <li>• Isolated network segments</li>
                            <li>• Custom firewall rules</li>
                            <li>• VPC-native networking</li>
                            <li>• Network security monitoring</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Business Scalability</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Multi-region deployment ready</li>
                            <li>• Support 1000+ client instances</li>
                            <li>• Global load balancing capable</li>
                            <li>• Auto-scaling infrastructure</li>
                            <li>• Revenue growth to $500K+/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ VPC Network Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Custom VPC network created</li>
                      <li>□ Subnets configured for services and database</li>
                      <li>□ Firewall rules configured for security</li>
                      <li>□ NAT gateway setup for outbound access</li>
                      <li>□ Multi-region architecture prepared</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'infrastructure',
          title: '🏗️ Infrastructure',
          description: 'Set up GCP infrastructure components',
          steps: [
            {
              id: 'gcp-step-4',
              title: 'Cloud SQL Setup',
              description: 'Configure managed PostgreSQL database',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cloud SQL Setup for Enterprise n8n Database</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🗄️ High-Performance PostgreSQL Database</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Create Production Cloud SQL Instance</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create Cloud SQL PostgreSQL instance for n8n
gcloud sql instances create n8n-postgres-prod \\
  --database-version=POSTGRES_15 \\
  --tier=db-custom-2-8192 \\
  --region=us-central1 \\
  --network=n8n-vpc \\
  --no-assign-ip \\
  --storage-type=SSD \\
  --storage-size=100GB \\
  --storage-auto-increase \\
  --storage-auto-increase-limit=1000 \\
  --backup-start-time=03:00 \\
  --backup-location=us \\
  --retained-backups-count=30 \\
  --enable-bin-log \\
  --maintenance-window-day=SUN \\
  --maintenance-window-hour=04 \\
  --maintenance-release-channel=production \\
  --deletion-protection

# Create database for n8n
gcloud sql databases create n8n \\
  --instance=n8n-postgres-prod \\
  --charset=UTF8 \\
  --collation=en_US.UTF8

# Create dedicated user for n8n application
gcloud sql users create n8nuser \\
  --instance=n8n-postgres-prod \\
  --password=SecureN8nPassword123!

# Configure high availability (for production)
gcloud sql instances patch n8n-postgres-prod \\
  --availability-type=REGIONAL \\
  --backup-start-time=03:00

# Set up private IP for VPC connection
gcloud sql instances patch n8n-postgres-prod \\
  --network=n8n-vpc \\
  --no-assign-ip

# Create SSL certificates for secure connection
gcloud sql ssl-certs create n8n-client-cert \\
  --instance=n8n-postgres-prod

# Get connection details
gcloud sql instances describe n8n-postgres-prod \\
  --format="value(connectionName,ipAddresses[0].ipAddress)"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Enterprise Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 99.95% availability SLA</li>
                            <li>• Automated backups & patching</li>
                            <li>• Regional high availability</li>
                            <li>• Point-in-time recovery</li>
                            <li>• Encryption at rest & in transit</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Business Value</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Handle 10,000+ workflows/day</li>
                            <li>• Support 500+ concurrent clients</li>
                            <li>• Zero-maintenance operations</li>
                            <li>• Cost: ~$200/month</li>
                            <li>• Revenue potential: $50K+/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Cloud SQL Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ PostgreSQL instance created with HA</li>
                      <li>□ n8n database and user configured</li>
                      <li>□ VPC private IP connectivity setup</li>
                      <li>□ SSL certificates generated</li>
                      <li>□ Automated backups configured</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-5',
              title: 'Container Registry',
              description: 'Set up Artifact Registry for container images',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Artifact Registry for n8n Container Images</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>📦 Enterprise Container Registry</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Setup Artifact Registry & Build Pipeline</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create Artifact Registry repository
gcloud artifacts repositories create n8n-images \\
  --repository-format=docker \\
  --location=us-central1 \\
  --description="N8N container images for production deployment"

# Configure Docker authentication
gcloud auth configure-docker us-central1-docker.pkg.dev

# Create optimized Dockerfile for n8n business
cat > Dockerfile.production << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent

FROM node:18-alpine
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER node
EXPOSE 5678
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
EOF

# Build and tag n8n image for production
docker build -f Dockerfile.production -t n8n-business:latest .
docker tag n8n-business:latest \\
  us-central1-docker.pkg.dev/n8n-automation-business/n8n-images/n8n-app:latest

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/n8n-automation-business/n8n-images/n8n-app:latest

# Verify image was pushed successfully
gcloud artifacts docker images list \\
  us-central1-docker.pkg.dev/n8n-automation-business/n8n-images`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Security Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Vulnerability scanning enabled</li>
                            <li>• Image signing & verification</li>
                            <li>• Access control with IAM</li>
                            <li>• Immutable image tags</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Rapid deployment to clients</li>
                            <li>• Consistent environments</li>
                            <li>• Version rollback capability</li>
                            <li>• Multi-client isolation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Container Registry Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Artifact Registry repository created</li>
                      <li>□ Docker authentication configured</li>
                      <li>□ Production Dockerfile optimized</li>
                      <li>□ Image built and pushed successfully</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-6',
              title: 'Load Balancer Configuration',
              description: 'Configure Google Cloud Load Balancer',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google Cloud Load Balancer for Global n8n Access</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🌍 Global Load Balancing for Enterprise Clients</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Setup Global HTTP(S) Load Balancer</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create global load balancer for n8n business
gcloud compute addresses create n8n-global-ip \\
  --global \\
  --description="Global IP for n8n automation business"

# Create backend service for Cloud Run
gcloud compute backend-services create n8n-backend \\
  --global \\
  --protocol=HTTP \\
  --health-checks-region=us-central1 \\
  --description="Backend service for n8n Cloud Run"

# Create URL map for routing
gcloud compute url-maps create n8n-url-map \\
  --default-service=n8n-backend \\
  --description="URL map for n8n routing"

# Create SSL certificate for custom domain
gcloud compute ssl-certificates create n8n-ssl-cert \\
  --domains=yourbusiness.com,n8n.yourbusiness.com \\
  --global \\
  --description="SSL certificate for n8n business domain"

# Create HTTPS proxy
gcloud compute target-https-proxies create n8n-https-proxy \\
  --url-map=n8n-url-map \\
  --ssl-certificates=n8n-ssl-cert \\
  --description="HTTPS proxy for n8n"

# Create forwarding rule
gcloud compute forwarding-rules create n8n-https-rule \\
  --global \\
  --target-https-proxy=n8n-https-proxy \\
  --address=n8n-global-ip \\
  --ports=443

# Get the external IP
gcloud compute addresses describe n8n-global-ip \\
  --global \\
  --format="value(address)"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Global Performance</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Edge locations worldwide</li>
                            <li>• Sub-100ms latency globally</li>
                            <li>• Automatic SSL termination</li>
                            <li>• CDN integration ready</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Business Impact</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Premium global service tier</li>
                            <li>• Enterprise client satisfaction</li>
                            <li>• Custom domain per client: $300+/month</li>
                            <li>• Scalable to global markets</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Load Balancer Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Global IP address reserved</li>
                      <li>□ Backend service configured</li>
                      <li>□ SSL certificate provisioned</li>
                      <li>□ HTTPS proxy and forwarding rule setup</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'deployment',
          title: '🚀 Deployment',
          description: 'Deploy n8n to Google Cloud',
          steps: [
            {
              id: 'gcp-step-7',
              title: 'Container Image Build',
              description: 'Build and push Docker image to Artifact Registry',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Container Image Build Pipeline for Production</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🏗️ Automated CI/CD Pipeline</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Cloud Build Integration</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create Cloud Build configuration
cat > cloudbuild.yaml << 'EOF'
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-f', 'Dockerfile.production', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/n8n-images/n8n-app:$BUILD_ID', '.']
  
  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/n8n-images/n8n-app:$BUILD_ID']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args: 
      - 'run'
      - 'deploy'
      - 'n8n-service'
      - '--image=us-central1-docker.pkg.dev/$PROJECT_ID/n8n-images/n8n-app:$BUILD_ID'
      - '--region=us-central1'
      - '--platform=managed'
      - '--memory=2Gi'
      - '--cpu=1'
      - '--max-instances=100'
      - '--allow-unauthenticated'

options:
  logging: CLOUD_LOGGING_ONLY
EOF

# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml .

# Create build trigger for automated deployments
gcloud builds triggers create github \\
  --repo-name=n8n-automation-business \\
  --repo-owner=your-username \\
  --branch-pattern="^main$" \\
  --build-config=cloudbuild.yaml \\
  --description="Automated n8n deployment trigger"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Automation Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Automated builds on git push</li>
                            <li>• Zero-downtime deployments</li>
                            <li>• Version rollback in seconds</li>
                            <li>• Built-in security scanning</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Business Speed</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Deploy updates in under 5 minutes</li>
                            <li>• Instant client onboarding</li>
                            <li>• Scale to 1000+ instances</li>
                            <li>• Developer productivity boost</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Build Pipeline Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Cloud Build configuration created</li>
                      <li>□ Automated build pipeline setup</li>
                      <li>□ GitHub trigger configured</li>
                      <li>□ Build tested and verified</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-8',
              title: 'Cloud Run Deployment',
              description: 'Deploy n8n service on Cloud Run',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cloud Run Deployment for Serverless n8n</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>☁️ Serverless Production Deployment</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Deploy n8n to Cloud Run</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Deploy n8n service to Cloud Run
gcloud run deploy n8n-production \\
  --image=us-central1-docker.pkg.dev/n8n-automation-business/n8n-images/n8n-app:latest \\
  --region=us-central1 \\
  --platform=managed \\
  --memory=4Gi \\
  --cpu=2 \\
  --min-instances=1 \\
  --max-instances=1000 \\
  --concurrency=80 \\
  --timeout=900 \\
  --port=5678 \\
  --set-env-vars="N8N_HOST=0.0.0.0,N8N_PORT=5678,N8N_PROTOCOL=https,N8N_BASIC_AUTH_ACTIVE=true" \\
  --set-cloudsql-instances=n8n-automation-business:us-central1:n8n-postgres-prod \\
  --vpc-connector=n8n-connector \\
  --vpc-egress=private-ranges-only \\
  --service-account=n8n-app-service@n8n-automation-business.iam.gserviceaccount.com \\
  --allow-unauthenticated

# Configure custom domain mapping
gcloud run domain-mappings create \\
  --service=n8n-production \\
  --domain=n8n.yourbusiness.com \\
  --region=us-central1

# Set up traffic allocation for blue-green deployments
gcloud run services update-traffic n8n-production \\
  --to-latest \\
  --region=us-central1

# Get service URL
gcloud run services describe n8n-production \\
  --region=us-central1 \\
  --format="value(status.url)"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Efficiency</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Pay only for requests served</li>
                            <li>• Scale to zero when idle</li>
                            <li>• No server management costs</li>
                            <li>• Est. cost: $0.10 per 1000 requests</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Business Scale</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Handle 1M+ requests/month</li>
                            <li>• Support 1000+ concurrent clients</li>
                            <li>• Auto-scale to demand</li>
                            <li>• Revenue potential: $200K+/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Cloud Run Deployment Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ n8n service deployed to Cloud Run</li>
                      <li>□ Custom domain configured</li>
                      <li>□ VPC connector setup for database access</li>
                      <li>□ Service scaling configured</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-9',
              title: 'SSL Certificate Setup',
              description: 'Configure managed SSL certificates',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google-Managed SSL Certificates</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔐 Enterprise SSL Automation</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Automatic SSL Certificate Management</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create managed SSL certificate for domain
gcloud compute ssl-certificates create n8n-business-ssl \\
  --domains=yourbusiness.com,n8n.yourbusiness.com,*.yourbusiness.com \\
  --global \\
  --description="Managed SSL certificate for n8n business"

# Verify certificate status
gcloud compute ssl-certificates describe n8n-business-ssl \\
  --global \\
  --format="value(name,managed.status,managed.domainStatus)"

# Update load balancer to use SSL certificate
gcloud compute target-https-proxies update n8n-https-proxy \\
  --ssl-certificates=n8n-business-ssl \\
  --global-ssl-certificates

# Test SSL configuration
curl -I https://n8n.yourbusiness.com
openssl s_client -connect n8n.yourbusiness.com:443 -servername n8n.yourbusiness.com`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Enterprise Features</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Automatic certificate renewal</li>
                            <li>• Multi-domain support</li>
                            <li>• Google-managed infrastructure</li>
                            <li>• Zero maintenance required</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Value</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Professional client trust</li>
                            <li>• SEO ranking benefits</li>
                            <li>• Browser security compliance</li>
                            <li>• Enterprise credibility boost</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ SSL Certificate Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Managed SSL certificate created</li>
                      <li>□ Domain validation completed</li>
                      <li>□ Load balancer SSL integration tested</li>
                      <li>□ HTTPS redirect verified</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'monitoring',
          title: '📊 Monitoring',
          description: 'Set up monitoring and observability',
          steps: [
            {
              id: 'gcp-step-10',
              title: 'Cloud Monitoring Setup',
              description: 'Configure monitoring and alerting',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cloud Monitoring & Business Intelligence</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📊 Enterprise Monitoring Dashboard</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Setup Revenue & Performance Monitoring</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Create custom metrics for business KPIs
gcloud logging metrics create n8n_workflow_executions \\
  --description="Track n8n workflow executions for business metrics" \\
  --log-filter='resource.type="cloud_run_revision" AND jsonPayload.message:"workflow executed"'

# Create alerting policy for business critical metrics
gcloud alpha monitoring policies create --policy-from-file=- <<EOF
{
  "displayName": "N8N Business Revenue Alert",
  "conditions": [
    {
      "displayName": "Low workflow execution volume",
      "conditionThreshold": {
        "filter": "metric.type=\"logging.googleapis.com/user/n8n_workflow_executions\"",
        "comparison": "COMPARISON_LESS_THAN",
        "thresholdValue": 100
      }
    }
  ],
  "notificationChannels": ["projects/n8n-automation-business/notificationChannels/EMAIL_CHANNEL_ID"],
  "enabled": true
}
EOF

# Create dashboard for business metrics
gcloud logging sinks create n8n-business-metrics \\
  bigquery.googleapis.com/projects/n8n-automation-business/datasets/n8n_analytics \\
  --log-filter='resource.type="cloud_run_revision" AND (jsonPayload.workflow_id!="" OR jsonPayload.client_id!="")'

# Set up uptime monitoring for client SLA
gcloud monitoring uptime create \\
  --display-name="N8N Production Uptime" \\
  --http-check-path="/healthz" \\
  --monitored-resource-type="uptime_url" \\
  --hostname="n8n.yourbusiness.com" \\
  --timeout=10s \\
  --check-interval=60s`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Business Insights</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Real-time revenue tracking</li>
                            <li>• Client usage analytics</li>
                            <li>• Performance SLA monitoring</li>
                            <li>• Cost optimization alerts</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Proactive Management</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Automated incident response</li>
                            <li>• Predictive scaling alerts</li>
                            <li>• Client satisfaction tracking</li>
                            <li>• Business growth forecasting</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Monitoring Setup Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Custom business metrics created</li>
                      <li>□ Revenue tracking alerts configured</li>
                      <li>□ Uptime monitoring active</li>
                      <li>□ Performance dashboards deployed</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-11',
              title: 'Auto Scaling Configuration',
              description: 'Set up Cloud Run auto scaling',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cloud Run Auto Scaling for Business Growth</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>⚡ Intelligent Auto Scaling</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Configure Revenue-Driven Scaling</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Update Cloud Run service with advanced scaling configuration
gcloud run services update n8n-production \\
  --region=us-central1 \\
  --min-instances=2 \\
  --max-instances=1000 \\
  --concurrency=100 \\
  --cpu-throttling \\
  --memory=2Gi \\
  --cpu=1000m \\
  --execution-environment=gen2

# Configure auto scaling based on business metrics
gcloud run services replace-traffic n8n-production \\
  --to-latest=100 \\
  --region=us-central1

# Set up custom scaling triggers
cat > scaling-policy.yaml << 'EOF'
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  annotations:
    run.googleapis.com/cpu-throttling: "true"
    autoscaling.knative.dev/minScale: "2"
    autoscaling.knative.dev/maxScale: "1000"
    autoscaling.knative.dev/target: "80"
    autoscaling.knative.dev/targetUtilizationPercentage: "70"
EOF

# Apply scaling configuration
kubectl apply -f scaling-policy.yaml

# Monitor scaling performance
gcloud run services describe n8n-production \\
  --region=us-central1 \\
  --format="value(status.traffic,spec.template.metadata.annotations)"'`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Optimization</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Scale to zero during idle periods</li>
                            <li>• Pay only for actual usage</li>
                            <li>• Automatic resource optimization</li>
                            <li>• Predictable monthly costs</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Business Scaling</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Handle viral traffic spikes</li>
                            <li>• Support unlimited client growth</li>
                            <li>• Maintain SLA during peak loads</li>
                            <li>• Revenue scaling to $1M+/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Auto Scaling Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Cloud Run scaling limits configured</li>
                      <li>□ Concurrency and CPU settings optimized</li>
                      <li>□ Custom scaling triggers implemented</li>
                      <li>□ Performance monitoring active</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-12',
              title: 'Backup and Recovery',
              description: 'Implement backup and disaster recovery',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Enterprise Backup & Disaster Recovery</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🛡️ Business Continuity Protection</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Multi-Region Backup Strategy</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-3 rounded font-mono`}>
                          {`# Configure automated Cloud SQL backups
gcloud sql instances patch n8n-postgres-prod \\
  --backup-start-time=02:00 \\
  --backup-location=us \\
  --retained-backups-count=30 \\
  --enable-point-in-time-recovery

# Create cross-region backup for disaster recovery
gcloud sql instances create n8n-postgres-replica \\
  --master-instance-name=n8n-postgres-prod \\
  --replica-type=READ \\
  --region=us-east1 \\
  --availability-type=ZONAL

# Create Cloud Storage bucket for application backups
gsutil mb -p n8n-automation-business -c STANDARD -l us-central1 gs://n8n-business-backups

# Set up versioning and lifecycle policies
gsutil versioning set on gs://n8n-business-backups
gsutil lifecycle set lifecycle.json gs://n8n-business-backups

# Backup application configurations
cat > backup-script.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="n8n-backup-$DATE"

# Export Cloud Run service configuration
gcloud run services describe n8n-production --region=us-central1 --format=export > $BACKUP_DIR/service-config.yaml

# Backup environment variables and secrets
kubectl get secret n8n-secrets -o yaml > $BACKUP_DIR/secrets-backup.yaml

# Upload to Cloud Storage
gsutil -m cp -r $BACKUP_DIR gs://n8n-business-backups/
EOF

chmod +x backup-script.sh

# Schedule automated backups with Cloud Scheduler
gcloud scheduler jobs create http backup-n8n-config \\
  --schedule="0 3 * * *" \\
  --uri="https://us-central1-n8n-automation-business.cloudfunctions.net/backup-function" \\
  --http-method=POST \\
  --description="Daily backup of n8n configuration"`}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Enterprise Protection</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 30-day automated backups</li>
                            <li>• Point-in-time recovery</li>
                            <li>• Cross-region replication</li>
                            <li>• 99.9% data durability SLA</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Assurance</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• &lt; 4 hour recovery time</li>
                            <li>• Client data protection guarantee</li>
                            <li>• Insurance compliance ready</li>
                            <li>• Revenue protection: $500K+/month</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>⚡ Disaster Recovery Plan</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Recovery Time Objectives (RTO)</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Database restoration: &lt; 2 hours</li>
                          <li>• Application deployment: &lt; 30 minutes</li>
                          <li>• DNS propagation: &lt; 15 minutes</li>
                          <li>• Full service restoration: &lt; 4 hours total</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                    <h4 className="font-semibold mb-2">✅ Backup & Recovery Checklist</h4>
                    <ul className="space-y-1">
                      <li>□ Automated database backups configured</li>
                      <li>□ Cross-region replica setup</li>
                      <li>□ Application configuration backups scheduled</li>
                      <li>□ Disaster recovery plan tested</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    azure: {
      id: 'azure',
      title: 'Azure Deployment',
      icon: <Shield className="h-5 w-5" />,
      description: 'Deploy n8n agents on Microsoft Azure',
      sections: [
        {
          id: 'foundation',
          title: '🔷 Foundation',
          description: 'Azure deployment basics',
          steps: [
            {
              id: 'azure-step-1',
              title: 'Azure Subscription Setup',
              description: 'Configure Azure subscription and resource groups',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-8">
                  <div className={`text-center mb-6`}>
                    <h2 className={`text-3xl font-bold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔷 Microsoft Azure Foundation Setup</h2>
                    <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Building Your Enterprise n8n Automation Platform on Azure</p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🏢 Why Choose Microsoft Azure for Your n8n Business?</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Microsoft Azure is the world's second-largest cloud platform, powering 95% of Fortune 500 companies. For your n8n automation business, 
                        Azure provides enterprise-grade security, global reach, and seamless integration with Microsoft's business ecosystem that many 
                        enterprise clients already use.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌍 Global Enterprise Reach</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• 60+ regions worldwide</li>
                            <li>• Government & compliance certifications</li>
                            <li>• Enterprise customer trust</li>
                            <li>• Fortune 500 client base</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Enterprise Security First</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Zero Trust security model</li>
                            <li>• Azure AD integration</li>
                            <li>• Advanced threat protection</li>
                            <li>• Compliance: GDPR, HIPAA, SOC</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Integration</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Microsoft 365 ecosystem</li>
                            <li>• Teams & SharePoint integration</li>
                            <li>• Power Platform compatibility</li>
                            <li>• Enterprise customer familiarity</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🚀 Setting Up Your Azure Subscription for n8n Business</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Step-by-Step Azure Account Creation</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                          {`# Install Azure CLI (Command Line Interface)
# For Windows (PowerShell as Administrator):
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\\AzureCLI.msi
Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'

# For macOS:
brew update && brew install azure-cli

# For Linux (Ubuntu/Debian):
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure and set up your subscription
az login
az account list --output table

# Create a new resource group for your n8n business
az group create \\
  --name "rg-n8n-automation-business" \\
  --location "East US" \\
  --tags Environment=Production Project=N8N-Business

# Register required resource providers for n8n deployment
az provider register --namespace Microsoft.ContainerInstance
az provider register --namespace Microsoft.ContainerRegistry
az provider register --namespace Microsoft.DBforPostgreSQL
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.Network
az provider register --namespace Microsoft.Storage

# Verify registrations
az provider list --query "[?registrationState=='Registered'].namespace" --output table`}
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-yellow-800/30' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-600' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-4 mb-4`}>
                          <h5 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>💡 Educational Note: Understanding Azure Resource Groups</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-300'}`}>
                            Azure Resource Groups are logical containers that hold related resources for your application. Think of them as project folders 
                            that help you organize, manage, and bill resources together. For your n8n business, this means you can easily track costs, 
                            apply security policies, and manage permissions for all your automation infrastructure in one place.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>💰 Azure Pricing Strategy for Your n8n Business</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Understanding Azure's pricing model is crucial for your n8n automation business profitability. Azure uses a pay-as-you-go model 
                        with various cost optimization opportunities.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💵 Estimated Monthly Costs</h4>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Container Instances (2-4 GB)</span>
                                <span className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>$50-150</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Azure Database for PostgreSQL</span>
                                <span className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>$200-400</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Application Gateway + SSL</span>
                                <span className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>$20-80</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Storage & Backup</span>
                                <span className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>$10-30</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-green-100 dark:bg-green-800'} p-3 rounded border border-green-500`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm font-semibold ${theme === 'gradient' ? 'text-green-300' : 'text-green-700'}`}>Total Infrastructure Cost</span>
                                <span className={`font-bold text-lg ${theme === 'gradient' ? 'text-green-400' : 'text-green-700'}`}>$280-660/mo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📈 Revenue Potential</h4>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Starter: 10 clients × $300/mo</span>
                                <span className={`font-semibold text-green-600`}>$3,000</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Growth: 50 clients × $500/mo</span>
                                <span className={`font-semibold text-green-600`}>$25,000</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-3 rounded border`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600'}`}>Enterprise: 100 clients × $1000/mo</span>
                                <span className={`font-semibold text-green-600`}>$100,000</span>
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-blue-100 dark:bg-blue-800'} p-3 rounded border border-blue-500`}>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm font-semibold ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700'}`}>Profit Margin (after costs)</span>
                                <span className={`font-bold text-lg ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-700'}`}>90-95%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>🎯 Business Strategy: Positioning Your Azure n8n Service</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        Azure's enterprise focus gives you a significant advantage when targeting business clients. Here's how to leverage Azure's 
                        reputation and capabilities for your n8n automation business:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏢 Target Enterprise Clients</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Companies already using Microsoft 365</li>
                            <li>• Enterprises with Azure infrastructure</li>
                            <li>• Organizations requiring compliance</li>
                            <li>• Businesses needing hybrid cloud solutions</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Competitive Advantages</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• "Enterprise-grade Microsoft Azure"</li>
                            <li>• Seamless Microsoft ecosystem integration</li>
                            <li>• Government & compliance certifications</li>
                            <li>• Premium support and SLAs</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Azure Foundation Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Azure CLI installed and configured</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Azure subscription active and verified</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Resource group created for n8n business</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Required resource providers registered</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Billing alerts configured</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Cost management policies set</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Business strategy documented</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Target client list prepared</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-2',
              title: 'Service Principal Setup',
              description: 'Create and configure service principals for authentication',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <div className={`text-center mb-6`}>
                    <h2 className={`text-3xl font-bold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔐 Azure Service Principal & Identity Management</h2>
                    <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Secure Authentication for Your Enterprise n8n Platform</p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>📚 Understanding Azure Service Principals</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-300'}`}>
                        <strong>What is a Service Principal?</strong> Think of an Azure Service Principal as a "digital identity" for your n8n automation application. 
                        Just like you have credentials to log into Azure, your n8n service needs its own set of credentials to access Azure resources securely. 
                        This is crucial for enterprise clients who require strict security controls and audit trails.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Why Service Principals Matter for Your Business</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>Enterprise Security:</strong> Meet corporate security requirements</li>
                            <li>• <strong>Audit Compliance:</strong> Track exactly what your app does</li>
                            <li>• <strong>Principle of Least Privilege:</strong> Only access what's needed</li>
                            <li>• <strong>Automated Operations:</strong> No human intervention required</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Value for Your Clients</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>Premium Positioning:</strong> "Enterprise-grade security"</li>
                            <li>• <strong>Compliance Ready:</strong> SOC 2, ISO 27001 aligned</li>
                            <li>• <strong>Risk Reduction:</strong> No shared user credentials</li>
                            <li>• <strong>Professional Trust:</strong> Meets IT department standards</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🛠️ Creating Service Principals for n8n Business</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Step 1: Create the Service Principal Application</h4>
                        <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                          {`# Create a service principal for your n8n automation business
az ad sp create-for-rbac \\
  --name "sp-n8n-automation-business" \\
  --role "Contributor" \\
  --scopes "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-automation-business" \\
  --description "Service Principal for N8N Automation Business Platform"

# This will output important credentials - SAVE THESE SECURELY:
# {
#   "appId": "12345678-1234-1234-1234-123456789012",      # Client ID
#   "displayName": "sp-n8n-automation-business",
#   "password": "super-secret-password-here",              # Client Secret
#   "tenant": "87654321-4321-4321-4321-210987654321"      # Tenant ID
# }

# Create additional service principals for different environments
az ad sp create-for-rbac \\
  --name "sp-n8n-production" \\
  --role "Contributor" \\
  --scopes "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-production"`}
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-yellow-800/30' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-600' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-4 mb-4`}>
                          <h5 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>⚠️ Security Best Practice: Credential Management</h5>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-300'}`}>
                            <strong>Never commit these credentials to version control!</strong> Store them in Azure Key Vault or your password manager immediately. 
                            For production environments, consider using Managed Identities instead of service principals where possible, as they eliminate 
                            the need to manage credentials entirely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Service Principal Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Service principal created with descriptive name</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Credentials saved securely (never in code)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Minimal required permissions assigned</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Multiple environments configured</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Audit logging enabled</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Client isolation architecture planned</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Automated provisioning script tested</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Security documentation prepared for clients</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-3',
              title: 'Virtual Network Configuration',
              description: 'Set up virtual network and security groups',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🌐 Azure Virtual Network Architecture</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🏗️ Understanding Azure Virtual Networks</h3>
                    <p className={`${theme === 'gradient' ? 'text-purple-200' : 'text-purple-800 dark:text-purple-300'} mb-4`}>
                      Azure Virtual Network (VNet) is like creating your own private network in the cloud. For your n8n automation business, 
                      this provides enterprise-level security, isolation, and control that your corporate clients expect and demand.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create Virtual Network for n8n business
az network vnet create \\
  --resource-group rg-n8n-automation-business \\
  --name vnet-n8n-business \\
  --address-prefix 10.0.0.0/16 \\
  --subnet-name subnet-n8n-app \\
  --subnet-prefix 10.0.1.0/24 \\
  --location "East US"

# Create additional subnets for database and gateway
az network vnet subnet create \\
  --resource-group rg-n8n-automation-business \\
  --vnet-name vnet-n8n-business \\
  --name subnet-n8n-database \\
  --address-prefix 10.0.2.0/24

az network vnet subnet create \\
  --resource-group rg-n8n-automation-business \\
  --vnet-name vnet-n8n-business \\
  --name subnet-application-gateway \\
  --address-prefix 10.0.3.0/24

# Create Network Security Group for enhanced security
az network nsg create \\
  --resource-group rg-n8n-automation-business \\
  --name nsg-n8n-business

# Configure security rules for n8n application
az network nsg rule create \\
  --resource-group rg-n8n-automation-business \\
  --nsg-name nsg-n8n-business \\
  --name allow-https \\
  --protocol tcp \\
  --priority 1000 \\
  --destination-port-range 443 \\
  --access allow

az network nsg rule create \\
  --resource-group rg-n8n-automation-business \\
  --nsg-name nsg-n8n-business \\
  --name allow-http \\
  --protocol tcp \\
  --priority 1001 \\
  --destination-port-range 80 \\
  --access allow`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Enterprise Security Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Private IP address space</li>
                          <li>• Network segmentation for compliance</li>
                          <li>• Controlled internet access</li>
                          <li>• Integration with on-premise networks</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Business Value</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Meet enterprise networking requirements</li>
                          <li>• Support hybrid cloud architectures</li>
                          <li>• Enable premium security positioning</li>
                          <li>• Scalable to global deployments</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Virtual Network Setup Checklist</h4>
                    <ul className="space-y-2">
                      <li>□ Virtual network created with proper addressing</li>
                      <li>□ Subnets configured for application and database</li>
                      <li>□ Network security groups configured</li>
                      <li>□ Security rules tested and verified</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'infrastructure',
          title: '🏗️ Infrastructure',
          description: 'Set up Azure infrastructure components',
          steps: [
            {
              id: 'azure-step-4',
              title: 'Azure Database Setup',
              description: 'Configure Azure Database for PostgreSQL',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🗄️ Azure Database for PostgreSQL Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>💾 Enterprise Database Foundation</h3>
                    <p className={`${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-300'} mb-4`}>
                      Azure Database for PostgreSQL provides enterprise-grade database hosting with built-in high availability, security, 
                      and backup features. Your n8n automation business clients expect this level of data protection and performance.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create Azure Database for PostgreSQL server
az postgres server create \\
  --resource-group rg-n8n-automation-business \\
  --name psql-n8n-business \\
  --location "East US" \\
  --admin-user n8nadmin \\
  --admin-password "SecurePassword123!" \\
  --sku-name GP_Gen5_2 \\
  --version 13 \\
  --storage-size 102400 \\
  --backup-retention 35 \\
  --geo-redundant-backup Enabled

# Create firewall rule for Azure services
az postgres server firewall-rule create \\
  --resource-group rg-n8n-automation-business \\
  --server psql-n8n-business \\
  --name AllowAzureServices \\
  --start-ip-address 0.0.0.0 \\
  --end-ip-address 0.0.0.0

# Create n8n database
az postgres db create \\
  --resource-group rg-n8n-automation-business \\
  --server-name psql-n8n-business \\
  --name n8n_production

# Configure SSL enforcement for security
az postgres server update \\
  --resource-group rg-n8n-automation-business \\
  --name psql-n8n-business \\
  --ssl-enforcement Enabled

# Set up point-in-time recovery (business critical)
az postgres server configuration set \\
  --resource-group rg-n8n-automation-business \\
  --server-name psql-n8n-business \\
  --name log_statement \\
  --value all`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Enterprise Security</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• SSL encryption enforced</li>
                          <li>• Azure AD authentication</li>
                          <li>• Advanced threat protection</li>
                          <li>• VNet integration ready</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📈 Business Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• 35-day backup retention</li>
                          <li>• Geo-redundant backups</li>
                          <li>• 99.99% availability SLA</li>
                          <li>• Point-in-time recovery</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Optimization</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Start with GP_Gen5_2 tier</li>
                          <li>• Scale up as business grows</li>
                          <li>• Reserved instances for savings</li>
                          <li>• Monitor usage patterns</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Database Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li>□ PostgreSQL server created and configured</li>
                        <li>□ SSL enforcement enabled</li>
                        <li>□ Firewall rules configured</li>
                        <li>□ Database created for n8n</li>
                      </ul>
                      <ul className="space-y-2">
                        <li>□ Backup retention set to 35 days</li>
                        <li>□ Geo-redundant backup enabled</li>
                        <li>□ Monitoring configured</li>
                        <li>□ Connection string secured</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-5',
              title: 'Container Registry Setup',
              description: 'Set up Azure Container Registry',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📦 Azure Container Registry Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🏢 Enterprise Container Management</h3>
                    <p className={`${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-300'} mb-4`}>
                      Azure Container Registry (ACR) is your private Docker registry in Azure. For your n8n automation business, 
                      this provides secure, enterprise-grade container image storage with geo-replication and integrated security scanning.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create Azure Container Registry
az acr create \\
  --resource-group rg-n8n-automation-business \\
  --name acrn8nbusiness \\
  --sku Premium \\
  --location "East US" \\
  --admin-enabled true

# Enable vulnerability scanning (Premium feature)
az acr task create \\
  --registry acrn8nbusiness \\
  --name security-scan \\
  --image n8n:{{.Run.ID}} \\
  --context /dev/null \\
  --schedule "0 2 * * *"

# Set up geo-replication for business continuity
az acr replication create \\
  --registry acrn8nbusiness \\
  --location "West US 2"

# Configure network access rules
az acr network-rule add \\
  --name acrn8nbusiness \\
  --vnet-name vnet-n8n-business \\
  --subnet subnet-n8n-app

# Get login credentials for container deployment
az acr credential show --name acrn8nbusiness

# Login to ACR for image management
az acr login --name acrn8nbusiness`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Security Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Private registry with RBAC</li>
                          <li>• Image vulnerability scanning</li>
                          <li>• Content trust and signing</li>
                          <li>• Network access controls</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌍 Business Benefits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Global geo-replication</li>
                          <li>• Fast image pulls worldwide</li>
                          <li>• Enterprise compliance ready</li>
                          <li>• Automated security scanning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Container Registry Checklist</h4>
                    <ul className="space-y-2">
                      <li>□ ACR created with Premium SKU</li>
                      <li>□ Admin access enabled</li>
                      <li>□ Geo-replication configured</li>
                      <li>□ Network access rules set</li>
                      <li>□ Security scanning enabled</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-6',
              title: 'Application Gateway Setup',
              description: 'Configure Application Gateway for load balancing',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🌐 Azure Application Gateway Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>⚖️ Enterprise Load Balancing & SSL Termination</h3>
                    <p className={`${theme === 'gradient' ? 'text-purple-200' : 'text-purple-800 dark:text-purple-300'} mb-4`}>
                      Azure Application Gateway provides enterprise-grade load balancing, SSL termination, and Web Application Firewall (WAF) protection. 
                      Essential for professional n8n deployments serving multiple enterprise clients.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create public IP for Application Gateway
az network public-ip create \\
  --resource-group rg-n8n-automation-business \\
  --name pip-appgw-n8n \\
  --allocation-method Static \\
  --sku Standard \\
  --dns-name n8n-business-gateway

# Create Application Gateway with WAF
az network application-gateway create \\
  --name appgw-n8n-business \\
  --resource-group rg-n8n-automation-business \\
  --vnet-name vnet-n8n-business \\
  --subnet subnet-application-gateway \\
  --capacity 2 \\
  --sku WAF_v2 \\
  --http-settings-cookie-based-affinity Disabled \\
  --frontend-port 443 \\
  --http-settings-port 5678 \\
  --http-settings-protocol Http \\
  --public-ip-address pip-appgw-n8n \\
  --priority 100

# Configure SSL certificate (use Key Vault certificate)
az network application-gateway ssl-cert create \\
  --gateway-name appgw-n8n-business \\
  --resource-group rg-n8n-automation-business \\
  --name ssl-cert-n8n \\
  --key-vault-secret-id "https://kv-n8n-business.vault.azure.net/secrets/ssl-certificate"

# Enable Web Application Firewall for security
az network application-gateway waf-config set \\
  --gateway-name appgw-n8n-business \\
  --resource-group rg-n8n-automation-business \\
  --enabled true \\
  --firewall-mode Prevention \\
  --rule-set-type OWASP \\
  --rule-set-version 3.2

# Configure health probe for n8n backend
az network application-gateway probe create \\
  --gateway-name appgw-n8n-business \\
  --resource-group rg-n8n-automation-business \\
  --name health-probe-n8n \\
  --protocol Http \\
  --host-name-from-http-settings \\
  --path /healthz \\
  --interval 30 \\
  --timeout 120 \\
  --threshold 3`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🛡️ Security Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Web Application Firewall (WAF)</li>
                          <li>• SSL termination with Key Vault</li>
                          <li>• DDoS protection</li>
                          <li>• OWASP Top 10 protection</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Performance Benefits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Auto-scaling load balancing</li>
                          <li>• Health monitoring & failover</li>
                          <li>• Cookie-based session affinity</li>
                          <li>• Global availability</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Application Gateway Checklist</h4>
                    <ul className="space-y-2">
                      <li>□ Application Gateway created with WAF_v2 SKU</li>
                      <li>□ SSL certificate configured via Key Vault</li>
                      <li>□ WAF rules enabled and configured</li>
                      <li>□ Health probes configured for backend</li>
                      <li>□ Load balancing rules tested</li>
                    </ul>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'deployment',
          title: '🚀 Deployment',
          description: 'Deploy n8n to Azure',
          steps: [
            {
              id: 'azure-step-7',
              title: 'Container Image Build',
              description: 'Build and push Docker image to ACR',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Azure container build content</div>
            },
            {
              id: 'azure-step-8',
              title: 'Container Instances Deployment',
              description: 'Deploy n8n on Azure Container Instances',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Azure Container Instances n8n Deployment</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>⚡ Serverless n8n Production Deployment</h3>
                    <p className={`${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-300'} mb-4`}>
                      Azure Container Instances provides the perfect serverless container platform for your n8n automation business. 
                      Pay only for what you use, auto-scale based on demand, and provide enterprise clients with guaranteed performance.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create n8n container instance with enterprise configuration
az container create \\
  --resource-group rg-n8n-automation-business \\
  --name aci-n8n-business \\
  --image acrn8nbusiness.azurecr.io/n8n:latest \\
  --cpu 2 \\
  --memory 4 \\
  --restart-policy Always \\
  --ports 5678 \\
  --protocol TCP \\
  --location "East US" \\
  --vnet vnet-n8n-business \\
  --subnet subnet-n8n-app \\
  --registry-login-server acrn8nbusiness.azurecr.io \\
  --registry-username acrn8nbusiness \\
  --registry-password $(az acr credential show --name acrn8nbusiness --query "passwords[0].value" -o tsv) \\
  --environment-variables \\
    N8N_BASIC_AUTH_ACTIVE=true \\
    N8N_BASIC_AUTH_USER=admin \\
    N8N_BASIC_AUTH_PASSWORD=EnterprisePassword123! \\
    DB_TYPE=postgresdb \\
    DB_POSTGRESDB_HOST=psql-n8n-business.postgres.database.azure.com \\
    DB_POSTGRESDB_PORT=5432 \\
    DB_POSTGRESDB_DATABASE=n8n_production \\
    DB_POSTGRESDB_USER=n8nadmin@psql-n8n-business \\
    DB_POSTGRESDB_PASSWORD=SecurePassword123! \\
    N8N_HOST=n8n-business.yourdomain.com \\
    N8N_PORT=5678 \\
    N8N_PROTOCOL=https \\
    WEBHOOK_URL=https://n8n-business.yourdomain.com/ \\
    GENERIC_TIMEZONE=America/New_York \\
    N8N_METRICS=true \\
    N8N_LOG_LEVEL=info

# Configure health probe for Application Gateway
az container exec \\
  --resource-group rg-n8n-automation-business \\
  --name aci-n8n-business \\
  --exec-command "/bin/sh -c 'echo \"Health check endpoint ready\" > /app/healthz'"

# Set up container group with multiple instances for high availability
az container create \\
  --resource-group rg-n8n-automation-business \\
  --name aci-n8n-business-ha \\
  --image acrn8nbusiness.azurecr.io/n8n:latest \\
  --cpu 2 \\
  --memory 4 \\
  --restart-policy Always \\
  --ports 5678 \\
  --location "West US 2" \\
  --environment-variables ENVIRONMENT=standby

# Configure container insights for monitoring
az monitor diagnostic-settings create \\
  --name container-insights \\
  --resource "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-automation-business/providers/Microsoft.ContainerInstance/containerGroups/aci-n8n-business" \\
  --workspace "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-automation-business/providers/Microsoft.OperationalInsights/workspaces/law-n8n-business" \\
  --logs '[{"category": "ContainerInstanceLog", "enabled": true}]' \\
  --metrics '[{"category": "AllMetrics", "enabled": true}]'`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Efficiency</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Pay-per-second billing</li>
                          <li>• No idle resource costs</li>
                          <li>• Automatic scaling</li>
                          <li>• 90%+ cost savings vs VMs</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Enterprise Features</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• VNet integration</li>
                          <li>• Private registry access</li>
                          <li>• Environment variables</li>
                          <li>• Health monitoring</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Business Scale</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Instant deployment</li>
                          <li>• Global availability</li>
                          <li>• Multi-region failover</li>
                          <li>• Client isolation ready</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Container Deployment Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li>□ Container instance created with proper resources</li>
                        <li>□ Database connection configured</li>
                        <li>□ Environment variables set</li>
                        <li>□ VNet integration enabled</li>
                      </ul>
                      <ul className="space-y-2">
                        <li>□ Health monitoring configured</li>
                        <li>□ Multi-region deployment ready</li>
                        <li>□ Application Gateway integration tested</li>
                        <li>□ n8n accessible and functional</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-9',
              title: 'Key Vault Integration',
              description: 'Configure Azure Key Vault for secrets management',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Key Vault integration content</div>
            }
          ]
        },
        {
          id: 'monitoring',
          title: '📊 Monitoring',
          description: 'Set up monitoring and observability',
          steps: [
            {
              id: 'azure-step-10',
              title: 'Azure Monitor Setup',
              description: 'Configure comprehensive monitoring with Azure Monitor',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📊 Azure Monitor & Business Intelligence</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>📈 Revenue-Focused Monitoring Strategy</h3>
                    <p className={`${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-300'} mb-4`}>
                      Azure Monitor provides comprehensive observability for your n8n automation business. Track not just technical metrics, 
                      but business KPIs that help you optimize pricing, detect growth opportunities, and ensure enterprise-level SLAs.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create Log Analytics workspace for centralized logging
az monitor log-analytics workspace create \\
  --resource-group rg-n8n-automation-business \\
  --workspace-name law-n8n-business \\
  --location "East US" \\
  --sku PerGB2018

# Create Application Insights for n8n performance monitoring
az monitor app-insights component create \\
  --app n8n-business-insights \\
  --location "East US" \\
  --resource-group rg-n8n-automation-business \\
  --workspace law-n8n-business

# Set up custom metrics for business KPIs
az monitor metrics alert create \\
  --name "High Workflow Execution Rate" \\
  --resource-group rg-n8n-automation-business \\
  --scopes "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-automation-business" \\
  --condition "count > 1000" \\
  --description "Alert when workflow executions exceed capacity"

# Configure revenue-tracking alerts
az monitor metrics alert create \\
  --name "Low Client Activity" \\
  --resource-group rg-n8n-automation-business \\
  --condition "count < 10" \\
  --description "Alert when client activity drops below threshold"

# Set up automated scaling triggers
az monitor autoscale create \\
  --resource-group rg-n8n-automation-business \\
  --resource "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-automation-business/providers/Microsoft.ContainerInstance/containerGroups/aci-n8n-business" \\
  --min-count 1 \\
  --max-count 10 \\
  --count 2

# Create business dashboard for client reporting
az portal dashboard create \\
  --resource-group rg-n8n-automation-business \\
  --name "N8N Business Dashboard" \\
  --input-path ./n8n-business-dashboard.json`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Business Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Workflow execution revenue</li>
                          <li>• Client usage patterns</li>
                          <li>• Resource cost optimization</li>
                          <li>• Growth trend analysis</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Technical Monitoring</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Application performance</li>
                          <li>• Database performance</li>
                          <li>• Container health status</li>
                          <li>• Network latency tracking</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Client Reporting</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Automated SLA reports</li>
                          <li>• Usage analytics dashboards</li>
                          <li>• Performance benchmarks</li>
                          <li>• Cost transparency reports</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Monitoring Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li>□ Log Analytics workspace configured</li>
                        <li>□ Application Insights enabled</li>
                        <li>□ Business KPI alerts created</li>
                        <li>□ Auto-scaling rules configured</li>
                      </ul>
                      <ul className="space-y-2">
                        <li>□ Custom dashboards created</li>
                        <li>□ Client reporting automated</li>
                        <li>□ Performance baselines established</li>
                        <li>□ Cost monitoring alerts set</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-11',
              title: 'Auto Scaling Configuration',
              description: 'Set up auto scaling for container instances',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Azure auto scaling content</div>
            },
            {
              id: 'azure-step-12',
              title: 'Backup and Recovery',
              description: 'Implement backup and disaster recovery strategy',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🛡️ Azure Backup & Disaster Recovery</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-red-800/30' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-600' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-red-600 dark:text-red-400 mb-4`}>🚨 Enterprise Business Continuity</h3>
                    <p className={`${theme === 'gradient' ? 'text-red-200' : 'text-red-800 dark:text-red-300'} mb-4`}>
                      For your n8n automation business serving enterprise clients, data protection and business continuity are non-negotiable. 
                      Azure Backup provides enterprise-grade protection with &lt; 4 hour recovery time objectives (RTO) and near-zero data loss.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create Recovery Services vault for backups
az backup vault create \\
  --resource-group rg-n8n-automation-business \\
  --name rsv-n8n-business \\
  --location "East US" \\
  --storage-model-type GeoRedundant

# Configure database backup policy (35-day retention)
az backup policy create \\
  --resource-group rg-n8n-automation-business \\
  --vault-name rsv-n8n-business \\
  --policy policy-n8n-database \\
  --workload-type SQLDataBase \\
  --retention-daily-count 35 \\
  --retention-weekly-count 12 \\
  --retention-monthly-count 12 \\
  --retention-yearly-count 5

# Enable automated backups for PostgreSQL
az postgres server configuration set \\
  --resource-group rg-n8n-automation-business \\
  --server-name psql-n8n-business \\
  --name backup_retention_days \\
  --value 35

# Create backup for container registry images
az acr replication create \\
  --registry acrn8nbusiness \\
  --location "West Europe"

# Set up cross-region disaster recovery
az container create \\
  --resource-group rg-n8n-automation-business \\
  --name aci-n8n-dr \\
  --image acrn8nbusiness.azurecr.io/n8n:latest \\
  --location "West US 2" \\
  --restart-policy Never \\
  --environment-variables ENVIRONMENT=disaster-recovery

# Configure automated failover testing
az monitor scheduled-query-rule create \\
  --name "DR Test Monthly" \\
  --resource-group rg-n8n-automation-business \\
  --scopes "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/rg-n8n-automation-business" \\
  --condition "count > 0" \\
  --description "Monthly disaster recovery test execution"`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-red-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Business Protection</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• &lt; 4 hour recovery time (RTO)</li>
                          <li>• &lt; 15 min data loss (RPO)</li>
                          <li>• Cross-region redundancy</li>
                          <li>• Automated failover testing</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-red-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Client Assurance</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-red-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Enterprise SLA compliance</li>
                          <li>• Audit trail documentation</li>
                          <li>• Disaster recovery reports</li>
                          <li>• Business continuity guarantee</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Backup & Recovery Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li>□ Recovery Services vault configured</li>
                        <li>□ Database backup policies set</li>
                        <li>□ Cross-region replication enabled</li>
                        <li>□ Container image backups automated</li>
                      </ul>
                      <ul className="space-y-2">
                        <li>□ Disaster recovery procedures documented</li>
                        <li>□ Failover testing automated</li>
                        <li>□ Recovery time objectives verified</li>
                        <li>□ Client communication plan ready</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    selfhosted: {
      id: 'selfhosted',
      title: 'Self-Hosted Deployment',
      icon: <Server className="h-5 w-5" />,
      description: 'Deploy n8n agents on your own infrastructure',
      sections: [
        {
          id: 'foundation',
          title: '🏠 Foundation',
          description: 'Self-hosted deployment basics',
          steps: [
            {
              id: 'selfhosted-step-1',
              title: 'Server Preparation',
              description: 'Prepare physical or virtual server infrastructure',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-8">
                  <div className={`text-center mb-6`}>
                    <h2 className={`text-3xl font-bold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🏠 Self-Hosted Server Preparation</h2>
                    <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Building Your Own n8n Automation Server from Scratch</p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🎯 Why Choose Self-Hosted n8n?</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-300'}`}>
                        <strong>Complete Control &amp; Maximum Profit:</strong> Self-hosting n8n gives you 100% control over your automation platform. 
                        You own the infrastructure, data, and can customize everything. Perfect for beginners who want to start small and scale 
                        without monthly cloud fees eating into profits.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Cost Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• No monthly cloud fees</li>
                            <li>• One-time hardware investment</li>
                            <li>• Keep 100% of client revenue</li>
                            <li>• Scale without cost increases</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔒 Security &amp; Privacy</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Complete data ownership</li>
                            <li>• No third-party data access</li>
                            <li>• Custom security policies</li>
                            <li>• Local compliance control</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Performance</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Dedicated resources</li>
                            <li>• No network latency</li>
                            <li>• Custom performance tuning</li>
                            <li>• Unlimited workflow executions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🖥️ Server Hardware Requirements (Beginner Guide)</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-300'}`}>
                        <strong>Don't worry - you don't need expensive hardware!</strong> n8n can run on almost anything, from a Raspberry Pi to a powerful dedicated server. 
                        Here's what we recommend for different business sizes:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏠 Starter Setup ($200-500)</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>CPU:</strong> 2 cores (Intel i3 or AMD equivalent)</li>
                            <li>• <strong>RAM:</strong> 4GB minimum, 8GB recommended</li>
                            <li>• <strong>Storage:</strong> 100GB SSD</li>
                            <li>• <strong>Perfect for:</strong> 1-5 clients, learning</li>
                            <li>• <strong>Examples:</strong> Mini PC, old laptop, Raspberry Pi 4</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Growth Setup ($500-1500)</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>CPU:</strong> 4-6 cores (Intel i5/i7 or AMD Ryzen 5)</li>
                            <li>• <strong>RAM:</strong> 16GB recommended</li>
                            <li>• <strong>Storage:</strong> 500GB SSD</li>
                            <li>• <strong>Perfect for:</strong> 5-25 clients</li>
                            <li>• <strong>Examples:</strong> Desktop PC, NUC, small server</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Professional Setup ($1500+)</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• <strong>CPU:</strong> 8+ cores (Intel Xeon or AMD EPYC)</li>
                            <li>• <strong>RAM:</strong> 32GB+ with ECC</li>
                            <li>• <strong>Storage:</strong> 1TB+ NVMe SSD with RAID</li>
                            <li>• <strong>Perfect for:</strong> 25+ clients, enterprise</li>
                            <li>• <strong>Examples:</strong> Dedicated server, workstation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>📋 Step-by-Step Server Setup Process</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-purple-200' : 'text-purple-800 dark:text-purple-300'}`}>
                        <strong>Follow these steps in order - we'll make it super easy!</strong> This guide assumes you're starting from scratch. 
                        Don't worry if you're not technical - we'll explain everything step by step.
                      </p>
                      
                      <div className="space-y-6">
                        <div className={`${theme === 'gradient' ? 'bg-purple-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Step 1: Choose Your Server Option</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>🏠 Physical Server (Recommended for Beginners)</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>✅ <strong>Old laptop/desktop:</strong> Perfect starting point</li>
                                <li>✅ <strong>Mini PC:</strong> Intel NUC, Beelink, ASUS PN series</li>
                                <li>✅ <strong>Raspberry Pi 4:</strong> 8GB model for learning</li>
                                <li>✅ <strong>Dedicated server:</strong> For serious business</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>☁️ VPS Alternative (If No Physical Server)</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• <strong>DigitalOcean:</strong> $20/month droplet</li>
                                <li>• <strong>Linode:</strong> $10/month shared CPU</li>
                                <li>• <strong>Hetzner:</strong> €4.15/month CX21</li>
                                <li>• <strong>Vultr:</strong> $12/month regular performance</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-purple-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Step 2: Check Your Internet Connection</h4>
                          <p className={`${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Your internet connection is crucial for a self-hosted n8n server since clients will access it remotely.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>📊 Minimum Requirements</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• <strong>Upload Speed:</strong> 10 Mbps minimum</li>
                                <li>• <strong>Download Speed:</strong> 25 Mbps minimum</li>
                                <li>• <strong>Static IP:</strong> Highly recommended</li>
                                <li>• <strong>Uptime:</strong> 99.5%+ reliability</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>🔧 Test Your Connection</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Visit speedtest.net to check speeds</li>
                                <li>• Contact ISP for static IP pricing</li>
                                <li>• Consider business internet for better SLA</li>
                                <li>• Document your external IP address</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-purple-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Step 3: Prepare Your Physical Space</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>🏠 Physical Setup</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Dedicated shelf or desk space</li>
                                <li>• Good ventilation for cooling</li>
                                <li>• Stable power with UPS backup</li>
                                <li>• Ethernet cable to router/modem</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>🔌 Power &amp; Connectivity</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• UPS (Uninterruptible Power Supply)</li>
                                <li>• Wired ethernet (avoid WiFi if possible)</li>
                                <li>• Surge protector</li>
                                <li>• Monitor, keyboard, mouse for setup</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>💡 Beginner-Friendly Tips &amp; Tricks</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${theme === 'gradient' ? 'bg-orange-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Start Small, Scale Smart</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-orange-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Begin with an old laptop or mini PC</li>
                            <li>• Test with 1-2 clients first</li>
                            <li>• Upgrade hardware as business grows</li>
                            <li>• Document what works for easy scaling</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-orange-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🛡️ Business Continuity Planning</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-orange-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Keep spare hardware if possible</li>
                            <li>• Plan backup internet connection</li>
                            <li>• Document your entire setup</li>
                            <li>• Consider a backup server for critical clients</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Server Preparation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Hardware selected and acquired</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Internet speed tested (10+ Mbps upload)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Static IP address obtained (optional but recommended)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Physical workspace prepared</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>UPS backup power configured</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Ethernet connection established</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Backup plan documented</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Ready to install operating system</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-2',
              title: 'Operating System Setup',
              description: 'Configure Ubuntu/CentOS with security hardening',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <div className={`text-center mb-6`}>
                    <h2 className={`text-3xl font-bold mb-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🐧 Operating System Setup &amp; Security</h2>
                    <p className={`text-lg ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Installing Ubuntu Server - The Perfect Foundation for n8n</p>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🎯 Why Ubuntu Server? (Beginner Explanation)</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-300'}`}>
                        <strong>Ubuntu Server is perfect for beginners!</strong> It's free, stable, secure, and has tons of online tutorials. 
                        Most importantly, it's what most professional developers use, so you'll find solutions to any problems you encounter. 
                        Plus, it runs great on both old computers and new servers.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🆓 Cost Benefits</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Completely free to use</li>
                            <li>• No licensing fees ever</li>
                            <li>• Free security updates</li>
                            <li>• No usage restrictions</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🛡️ Security &amp; Stability</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Built-in firewall (UFW)</li>
                            <li>• Automatic security updates</li>
                            <li>• 5 years of support</li>
                            <li>• Proven in enterprise environments</li>
                          </ul>
                        </div>
                        <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎓 Beginner Friendly</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• Massive online community</li>
                            <li>• Thousands of tutorials</li>
                            <li>• Easy package management</li>
                            <li>• Great for learning Linux</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>💿 Step 1: Download &amp; Create Installation Media</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-300'}`}>
                        <strong>Don't worry - this is easier than it sounds!</strong> We'll walk you through creating a bootable USB drive that you can use to install Ubuntu on your server.
                      </p>
                      
                      <div className="space-y-6">
                        <div className={`${theme === 'gradient' ? 'bg-green-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>What You'll Need:</h4>
                          <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            <li>• USB flash drive (8GB minimum, 16GB recommended)</li>
                            <li>• Another computer to create the installation media</li>
                            <li>• Internet connection to download Ubuntu</li>
                            <li>• About 30 minutes of your time</li>
                          </ul>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-green-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Step-by-Step Instructions:</h4>
                          <div className="space-y-3">
                            <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-green-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>1. Download Ubuntu Server 22.04 LTS</h5>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                Visit ubuntu.com/download/server and download Ubuntu Server 22.04.3 LTS. This is the "Long Term Support" version - perfect for business use. File size is about 1.4GB.
                              </p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-green-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>2. Download Balena Etcher (Free Tool)</h5>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                Go to balena.io/etcher and download this free tool. It makes creating bootable USB drives super easy - just point, click, and wait!
                              </p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-green-600/20' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-green-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>3. Create Bootable USB</h5>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                Open Etcher, select your Ubuntu ISO file, select your USB drive, and click "Flash". It'll take about 5-10 minutes. ⚠️ This will erase everything on the USB drive!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>⚙️ Step 2: Install Ubuntu Server</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-purple-200' : 'text-purple-800 dark:text-purple-300'}`}>
                        <strong>Time for the installation!</strong> This part might look intimidating, but Ubuntu's installer is very user-friendly. 
                        We'll guide you through each screen so you know exactly what to choose.
                      </p>
                      
                      <div className="space-y-6">
                        <div className={`${theme === 'gradient' ? 'bg-purple-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Boot from USB &amp; Start Installation</h4>
                          <ol className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                            <li>Insert the USB drive into your server computer</li>
                            <li>Turn on the computer and press F12, F2, or Delete key repeatedly to access BIOS/Boot Menu</li>
                            <li>Select "Boot from USB" or your USB drive name</li>
                            <li>You'll see the Ubuntu installer start - choose "Install Ubuntu Server"</li>
                          </ol>
                        </div>

                        <div className={`${theme === 'gradient' ? 'bg-purple-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                          <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Important Installation Choices</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>✅ Recommended Settings</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• <strong>Language:</strong> English</li>
                                <li>• <strong>Keyboard:</strong> US (or your layout)</li>
                                <li>• <strong>Network:</strong> Use DHCP (automatic)</li>
                                <li>• <strong>Disk:</strong> Use entire disk</li>
                                <li>• <strong>Username:</strong> n8nuser (or similar)</li>
                                <li>• <strong>SSH:</strong> ✅ Install OpenSSH server</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className={`font-semibold ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-700 dark:text-gray-300'} mb-2`}>🔐 Security Settings</h5>
                              <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• <strong>Password:</strong> Strong, unique password</li>
                                <li>• <strong>Full name:</strong> Your business name</li>
                                <li>• <strong>Server name:</strong> n8n-server</li>
                                <li>• <strong>Snapd:</strong> ❌ Skip snap packages</li>
                                <li>• <strong>Updates:</strong> ✅ Install security updates</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>🔧 Step 3: First Boot &amp; Basic Configuration</h3>
                    <div className="space-y-4">
                      <p className={`${theme === 'gradient' ? 'text-orange-200' : 'text-orange-800 dark:text-orange-300'}`}>
                        <strong>Congratulations! Ubuntu is installed.</strong> Now let's do some basic setup to make your server secure and ready for n8n. 
                        Don't worry - these commands might look scary, but just copy and paste them exactly.
                      </p>
                      
                      <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                        {`# First login after installation
# Username: n8nuser (or whatever you chose)
# Password: (the password you set during installation)

# Update the system (this is VERY important for security)
sudo apt update && sudo apt upgrade -y

# Install essential tools for n8n deployment
sudo apt install -y curl wget git vim ufw htop unzip

# Set up automatic security updates (keeps your server secure)
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Choose "Yes" when prompted

# Check system information
uname -a                    # Shows kernel version
cat /etc/os-release        # Shows Ubuntu version
df -h                      # Shows disk space
free -h                    # Shows memory usage
ip addr show               # Shows network configuration

# Create a directory for n8n files
mkdir -p ~/n8n-data
cd ~/n8n-data`}
                      </div>

                      <div className={`${theme === 'gradient' ? 'bg-yellow-800/30' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-600' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-4`}>
                        <h5 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>💡 Beginner Tips for Command Line</h5>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-300'}`}>
                          <li>• <strong>Copy &amp; Paste:</strong> Right-click to paste commands in terminal</li>
                          <li>• <strong>sudo:</strong> This means "run as administrator" - you'll need it for system changes</li>
                          <li>• <strong>-y flag:</strong> Automatically says "yes" to installation prompts</li>
                          <li>• <strong>Take your time:</strong> Let each command finish before running the next one</li>
                          <li>• <strong>If stuck:</strong> Ctrl+C cancels the current command</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Operating System Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Ubuntu Server 22.04 LTS downloaded</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Bootable USB drive created</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Ubuntu installed with SSH enabled</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>System updated with latest security patches</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Essential tools installed</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Automatic security updates configured</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>n8n data directory created</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Server accessible via SSH (if needed)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-3',
              title: 'Firewall Configuration',
              description: 'Set up firewall rules and security policies',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔥 Enterprise Firewall Security Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-red-800/30' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-600' : 'border-red-200 dark:border-red-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-red-600 dark:text-red-400 mb-4`}>🛡️ Why Firewall Security is Critical for Business Success</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>Your n8n automation server will handle sensitive client data, API keys, and business workflows worth thousands of dollars.</strong> 
                      A single security breach could destroy your reputation and cost you $50K+ in damages. This firewall setup creates an impenetrable 
                      digital fortress around your automation empire.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 Business Impact of Poor Security</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Data Breach:</strong> $4.45M average cost per incident</li>
                        <li>• <strong>Client Loss:</strong> 80% of clients leave after security incidents</li>
                        <li>• <strong>Legal Liability:</strong> GDPR fines up to $20M or 4% revenue</li>
                        <li>• <strong>Downtime Cost:</strong> $5,600 per minute for automation services</li>
                        <li>• <strong>Reputation Damage:</strong> 3-5 years to rebuild trust</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🔧 Understanding UFW (Uncomplicated Firewall)</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      UFW is Ubuntu's default firewall management tool. Think of it as a digital bouncer for your server - it decides who gets in and who gets blocked. 
                      It's "uncomplicated" because it simplifies the complex iptables system into easy commands that beginners can understand.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# STEP 1: Reset firewall to clean state (removes all existing rules)
# This ensures we start fresh without conflicting rules
sudo ufw --force reset

# STEP 2: Set secure defaults
# DENY INCOMING = Block all incoming connections by default (fortress mode)
# ALLOW OUTGOING = Let your server make outbound connections (for updates, API calls)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# STEP 3: Allow SSH access (CRITICAL - don't lock yourself out!)
# SSH (Secure Shell) is how you remotely control your server
# Port 22 is the standard SSH port
sudo ufw allow ssh
sudo ufw allow 22

# STEP 4: Allow n8n web interface access
# Port 5678 is n8n's default port for the web interface
# Your clients will access n8n through this port
sudo ufw allow 5678

# STEP 5: Prepare for web server (future-proofing)
# Port 80 = HTTP (insecure web traffic)
# Port 443 = HTTPS (secure web traffic with SSL)
sudo ufw allow 80
sudo ufw allow 443

# STEP 6: Activate the firewall
# --force flag prevents interactive confirmation
sudo ufw --force enable

# STEP 7: Verify configuration
# This shows all active rules and their status
sudo ufw status verbose`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-yellow-800/30' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-600' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-yellow-600 dark:text-yellow-400 mb-4`}>⚠️ Advanced Security: IP-Specific SSH Access</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      For maximum security, restrict SSH access to only YOUR IP address. This prevents brute force attacks from random hackers worldwide. 
                      Only do this if you have a static IP address, or you'll lock yourself out!
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# ADVANCED: Lock SSH to your specific IP address
# First, find your public IP address
curl ifconfig.me

# Example output: 203.0.113.10 (this is YOUR public IP)

# Remove the general SSH rule
sudo ufw delete allow ssh
sudo ufw delete allow 22

# Add IP-specific SSH rule (replace with YOUR actual IP)
sudo ufw allow from 203.0.113.10 to any port 22

# For additional security, also allow from your office/backup location
sudo ufw allow from 198.51.100.5 to any port 22

# Verify the change
sudo ufw status numbered`}
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-red-900/30' : 'bg-red-100 dark:bg-red-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">🚨 WARNING: IP Lockout Prevention</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Only use IP restrictions if you have a STATIC IP address</li>
                        <li>• Test SSH access from your IP before removing general rules</li>
                        <li>• Have a console/VNC backup access method</li>
                        <li>• Document your IP restrictions for team members</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🔍 Firewall Monitoring &amp; Troubleshooting</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Monitor firewall activity in real-time
sudo tail -f /var/log/ufw.log

# Check which services are listening on which ports
sudo netstat -tlnp
sudo ss -tlnp

# Test specific port connectivity from another machine
# Run this from your LOCAL computer, not the server
telnet YOUR_SERVER_IP 5678
nc -zv YOUR_SERVER_IP 5678

# View detailed firewall rules with numbers
sudo ufw status numbered

# Delete specific rules by number (if needed)
sudo ufw delete 3

# Temporarily disable firewall (for troubleshooting)
sudo ufw disable

# Re-enable firewall
sudo ufw enable

# Reset firewall completely (nuclear option)
sudo ufw --force reset`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>✅ Professional Firewall Validation Checklist</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ UFW status shows "active"</li>
                          <li>□ Default incoming policy: deny</li>
                          <li>□ Default outgoing policy: allow</li>
                          <li>□ SSH port 22 accessible from your IP</li>
                          <li>□ n8n port 5678 accessible externally</li>
                          <li>□ HTTP port 80 open for future use</li>
                          <li>□ HTTPS port 443 open for future use</li>
                          <li>□ No unnecessary ports exposed</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Client access to n8n interface confirmed</li>
                          <li>□ Team SSH access documented &amp; tested</li>
                          <li>□ Backup access methods established</li>
                          <li>□ Security policy documented</li>
                          <li>□ Firewall rules reviewed with team</li>
                          <li>□ Incident response plan created</li>
                          <li>□ Regular security audit scheduled</li>
                          <li>□ Compliance requirements met</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`mt-4 ${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎯 Success Metrics</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Security Score:</strong> 95%+ (use online security scanners)</li>
                        <li>• <strong>Port Exposure:</strong> Only 4 ports open (22, 80, 443, 5678)</li>
                        <li>• <strong>Attack Surface:</strong> Minimized to essential services only</li>
                        <li>• <strong>Response Time:</strong> &lt; 1 second for legitimate connections</li>
                        <li>• <strong>Uptime:</strong> 99.9%+ availability for client access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'installation',
          title: '📦 Installation',
          description: 'Install required dependencies and n8n',
          steps: [
            {
              id: 'selfhosted-step-4',
              title: 'Node.js Installation',
              description: 'Install Node.js and npm package manager',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚡ Node.js Installation Guide</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🎯 What is Node.js &amp; Why Do We Need It?</h3>
                    <p className={`${theme === 'gradient' ? 'text-green-200' : 'text-green-800 dark:text-green-300'} mb-4`}>
                      <strong>Simple explanation:</strong> Node.js is like the engine that runs n8n. Think of it like how you need Java to run Java programs, 
                      or how you need a web browser to view websites. n8n is built with Node.js, so we need to install it first before we can run n8n.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Install Node.js 18 LTS (Long Term Support) - Perfect for n8n
# We'll use NodeSource repository for the latest stable version

# Download and add NodeSource signing key
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Add NodeSource repository
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

# Update package list and install Node.js
sudo apt update
sudo apt install -y nodejs

# Verify installation (you should see version numbers)
node --version          # Should show v18.x.x
npm --version          # Should show 9.x.x or higher

# Install essential build tools for n8n dependencies
sudo apt install -y build-essential python3-dev

# Update npm to latest version
sudo npm install -g npm@latest

# Verify everything is working
node -e "console.log('Node.js is working!')"
npm -v`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Why Node.js 18 LTS?</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Officially supported by n8n</li>
                          <li>• Long Term Support (stable)</li>
                          <li>• Best performance for n8n</li>
                          <li>• Security updates until 2025</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-green-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 What We Just Installed</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Node.js runtime engine</li>
                          <li>• npm package manager</li>
                          <li>• Build tools for native modules</li>
                          <li>• Python development headers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-5',
              title: 'Database Setup',
              description: 'Install and configure PostgreSQL or SQLite',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🗄️ Database Setup - PostgreSQL for n8n</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🎯 Why PostgreSQL? (Beginner Friendly Explanation)</h3>
                    <p className={`${theme === 'gradient' ? 'text-blue-200' : 'text-blue-800 dark:text-blue-300'} mb-4`}>
                      <strong>Think of a database like a super-organized filing cabinet.</strong> n8n needs a place to store your workflows, execution history, 
                      and settings. PostgreSQL is like having a professional, industrial-strength filing system that can handle millions of documents 
                      without losing anything. It's free, reliable, and perfect for business use.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏆 Why PostgreSQL vs SQLite?</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Better for multiple clients</li>
                          <li>• Handles high traffic workflows</li>
                          <li>• Professional backup options</li>
                          <li>• No file size limitations</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💼 Business Benefits</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Used by major companies</li>
                          <li>• Excellent performance</li>
                          <li>• Strong data integrity</li>
                          <li>• Easy to backup &amp; restore</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🛠️ Installing &amp; Configuring PostgreSQL</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Install PostgreSQL 14 (perfect for n8n)
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service and enable it to start on boot
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user to configure database
sudo -u postgres psql

# Inside PostgreSQL prompt, create database and user for n8n
-- Create a database specifically for n8n
CREATE DATABASE n8n_db;

-- Create a user for n8n with a secure password
CREATE USER n8n_user WITH PASSWORD 'your_secure_password_here';

-- Grant all privileges on n8n database to n8n user
GRANT ALL PRIVILEGES ON DATABASE n8n_db TO n8n_user;

-- Exit PostgreSQL prompt
\\q

# Test the connection (you should be able to connect)
psql -h localhost -U n8n_user -d n8n_db

# If connection works, exit with:
\\q

# Optional: Configure PostgreSQL for better performance
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add these settings for better n8n performance:
# shared_buffers = 256MB
# effective_cache_size = 1GB
# maintenance_work_mem = 64MB
# checkpoint_completion_target = 0.9
# wal_buffers = 16MB

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql`}
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-yellow-800/30' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-yellow-600' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-4`}>
                      <h5 className={`font-semibold text-yellow-600 dark:text-yellow-400 mb-2`}>🔐 Important Security Notes</h5>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-yellow-200' : 'text-yellow-800 dark:text-yellow-300'}`}>
                        <li>• <strong>Replace 'your_secure_password_here'</strong> with a strong password (16+ characters)</li>
                        <li>• <strong>Write down your password</strong> in a secure place - you'll need it for n8n configuration</li>
                        <li>• <strong>Never use simple passwords</strong> like 'password123' for production servers</li>
                        <li>• <strong>Database connection string:</strong> postgresql://n8n_user:your_password@localhost:5432/n8n_db</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ Database Setup Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>PostgreSQL installed and running</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>n8n_db database created</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>n8n_user created with secure password</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Database permissions granted</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Connection tested successfully</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>PostgreSQL auto-start enabled</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Performance settings optimized</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Connection string documented</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-6',
              title: 'n8n Installation',
              description: 'Install n8n application and configure basic settings',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-8">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 n8n Installation &amp; Configuration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🎯 Installing n8n - The Final Step!</h3>
                    <p className={`${theme === 'gradient' ? 'text-purple-200' : 'text-purple-800 dark:text-purple-300'} mb-4`}>
                      <strong>We're almost there!</strong> Now that we have Node.js and PostgreSQL ready, it's time to install n8n itself. 
                      This is the exciting part where your automation server comes to life and you can start building workflows for your clients.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Install n8n globally using npm
sudo npm install -g n8n

# Create a system user for n8n (security best practice)
sudo useradd --system --shell /bin/bash --home /var/lib/n8n --create-home n8n

# Create directories for n8n data and configuration
sudo mkdir -p /var/lib/n8n/.n8n
sudo chown -R n8n:n8n /var/lib/n8n

# Create environment configuration file
sudo nano /var/lib/n8n/.env

# Add these settings to the .env file:
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n_db
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=your_secure_password_here

N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_admin_password

N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://your-server-ip:5678/

GENERIC_TIMEZONE=America/New_York
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=file

# Set proper permissions
sudo chown n8n:n8n /var/lib/n8n/.env
sudo chmod 600 /var/lib/n8n/.env

# Test n8n installation
sudo -u n8n -i
cd /var/lib/n8n
n8n start

# If it starts successfully, press Ctrl+C to stop it
# We'll set up a proper service next`}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-purple-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔐 Security Configuration</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Dedicated system user</li>
                          <li>• Basic authentication enabled</li>
                          <li>• Environment variables secured</li>
                          <li>• PostgreSQL database connection</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-purple-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Network Configuration</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-purple-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Listens on all interfaces (0.0.0.0)</li>
                          <li>• Default port 5678</li>
                          <li>• Webhook URL configured</li>
                          <li>• Ready for reverse proxy</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>⚙️ Create System Service (Auto-Start n8n)</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create systemd service file for n8n
sudo nano /etc/systemd/system/n8n.service

# Add this content to the service file:
[Unit]
Description=n8n - Workflow Automation Tool
After=network.target postgresql.service

[Service]
Type=simple
User=n8n
WorkingDirectory=/var/lib/n8n
EnvironmentFile=/var/lib/n8n/.env
ExecStart=/usr/bin/n8n start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# Save and exit the editor (Ctrl+X, Y, Enter)

# Reload systemd and enable n8n service
sudo systemctl daemon-reload
sudo systemctl enable n8n
sudo systemctl start n8n

# Check if n8n is running
sudo systemctl status n8n

# View n8n logs (useful for troubleshooting)
sudo journalctl -u n8n -f

# Test your n8n installation
# Open a web browser and go to: http://your-server-ip:5678
# You should see the n8n login page!`}
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-green-700/30' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎉 Congratulations! Your n8n Server is Ready!</h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                        If everything worked correctly, you now have a professional n8n automation server running! Here's what you can do next:
                      </p>
                      <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>✅ <strong>Access n8n:</strong> http://your-server-ip:5678</li>
                        <li>✅ <strong>Login:</strong> Use the admin credentials you set</li>
                        <li>✅ <strong>Create workflows:</strong> Start building automations</li>
                        <li>✅ <strong>Add clients:</strong> Begin your automation business</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-5 rounded-lg`}>
                    <h4 className="font-semibold mb-3">✅ n8n Installation Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>n8n installed globally via npm</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>System user 'n8n' created</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Environment configuration complete</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Database connection configured</span>
                        </li>
                      </ul>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Systemd service created and enabled</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>n8n service running successfully</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Web interface accessible</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Admin login working</span>
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
          id: 'configuration',
          title: '⚙️ Configuration',
          description: 'Configure n8n for production use',
          steps: [
            {
              id: 'selfhosted-step-7',
              title: 'Reverse Proxy Setup',
              description: 'Configure Nginx or Apache for SSL and routing',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🌐 Enterprise Nginx Reverse Proxy Setup</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🚀 Why Reverse Proxy is Essential for Professional n8n</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>A reverse proxy transforms your raw n8n installation into a professional, enterprise-grade service.</strong> Without it, 
                      clients access your server as "yourserver.com:5678" (amateur). With it, they access "yourcompany.com" (professional). 
                      This single change can increase your perceived value by 300% and justify 5x higher pricing.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 Business Benefits of Reverse Proxy</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Professional URLs:</strong> yourcompany.com vs yourserver.com:5678</li>
                        <li>• <strong>SSL Termination:</strong> Handle HTTPS encryption efficiently</li>
                        <li>• <strong>Load Balancing:</strong> Scale to multiple n8n instances later</li>
                        <li>• <strong>Security Layer:</strong> Hide internal services &amp; ports</li>
                        <li>• <strong>Caching:</strong> Improve performance by 40-60%</li>
                        <li>• <strong>Custom Headers:</strong> Add security &amp; tracking headers</li>
                        <li>• <strong>Domain Flexibility:</strong> Host multiple services on one server</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🔧 Understanding Nginx &amp; Reverse Proxies</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Think of Nginx as a professional receptionist for your digital office. When clients visit your website, Nginx greets them, 
                      handles their requests, and forwards them to the right service (n8n) behind the scenes. The client never knows about the 
                      internal complexity - they just see a smooth, professional experience.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# STEP 1: Install Nginx web server
# Nginx is the world's most popular web server, used by 40%+ of websites
sudo apt update
sudo apt install -y nginx

# STEP 2: Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# STEP 3: Verify Nginx is running
sudo systemctl status nginx
curl http://localhost

# You should see "Welcome to nginx!" page

# STEP 4: Create n8n site configuration
# This tells Nginx how to handle requests for your domain
sudo nano /etc/nginx/sites-available/n8n`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>📝 Professional Nginx Configuration</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      This configuration is battle-tested by thousands of production deployments. Each line serves a specific purpose 
                      for handling n8n's unique requirements including WebSocket connections, large file uploads, and long-running workflows.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Add this EXACT configuration to /etc/nginx/sites-available/n8n
# Replace 'your-domain.com' with your actual domain name

server {
    # Listen on port 80 for HTTP traffic
    listen 80;
    listen [::]:80;
    
    # Your domain name (replace with your actual domain)
    server_name your-domain.com www.your-domain.com;
    
    # Increase client body size for large file uploads
    client_max_body_size 100M;
    
    # Main location block - handles all requests
    location / {
        # Forward requests to n8n running on port 5678
        proxy_pass http://localhost:5678;
        
        # Essential headers for proper functionality
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket support (crucial for n8n real-time features)
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long-running workflows
        proxy_connect_timeout 60s;
        proxy_send_timeout 86400s;
        proxy_read_timeout 86400s;
        
        # Buffer settings for performance
        proxy_buffering off;
        proxy_request_buffering off;
    }
    
    # Handle webhook endpoints specifically
    location /webhook/ {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # No timeout for webhooks
        proxy_read_timeout 0;
        proxy_send_timeout 0;
    }
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>⚙️ Activation &amp; Testing</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# STEP 5: Enable the site configuration
# This creates a symbolic link to activate your configuration
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/

# STEP 6: Remove default site (optional but recommended)
sudo rm /etc/nginx/sites-enabled/default

# STEP 7: Test configuration for syntax errors
# This is CRITICAL - never restart without testing!
sudo nginx -t

# Expected output: "syntax is ok" and "test is successful"

# STEP 8: Restart Nginx to apply changes
sudo systemctl restart nginx

# STEP 9: Verify Nginx is running with new config
sudo systemctl status nginx

# STEP 10: Test the proxy
# Replace 'your-domain.com' with your actual domain
curl -H "Host: your-domain.com" http://localhost

# You should see n8n's login page HTML`}
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/20'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">🚨 Common Configuration Errors</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>502 Bad Gateway:</strong> n8n service not running or wrong port</li>
                        <li>• <strong>404 Not Found:</strong> server_name doesn't match your domain</li>
                        <li>• <strong>413 Request Entity Too Large:</strong> Add client_max_body_size</li>
                        <li>• <strong>WebSocket errors:</strong> Missing proxy_set_header Upgrade</li>
                        <li>• <strong>Timeout errors:</strong> Increase proxy_read_timeout</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-indigo-800/30' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-indigo-600' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-indigo-600 dark:text-indigo-400 mb-4`}>🔍 Advanced Troubleshooting &amp; Monitoring</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Monitor Nginx access logs in real-time
sudo tail -f /var/log/nginx/access.log

# Monitor Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration without restarting
sudo nginx -t

# Reload configuration without downtime
sudo nginx -s reload

# Check which sites are enabled
ls -la /etc/nginx/sites-enabled/

# View current Nginx configuration
sudo nginx -T

# Test specific domain resolution
curl -v http://your-domain.com

# Check port listening
sudo netstat -tlnp | grep :80
sudo ss -tlnp | grep :80

# Nginx performance status (enable status module)
curl http://localhost/nginx_status

# Check file permissions
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-teal-800/30' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-teal-600' : 'border-teal-200 dark:border-teal-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-teal-600 dark:text-teal-400 mb-4`}>✅ Professional Reverse Proxy Validation</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Nginx running without errors</li>
                          <li>□ Site configuration enabled</li>
                          <li>□ Domain resolves to server IP</li>
                          <li>□ HTTP requests reach n8n</li>
                          <li>□ WebSocket connections work</li>
                          <li>□ File uploads function properly</li>
                          <li>□ Security headers present</li>
                          <li>□ No 5xx errors in logs</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Professional URL accessible to clients</li>
                          <li>□ Brand consistency maintained</li>
                          <li>□ No technical details exposed</li>
                          <li>□ Mobile-friendly access</li>
                          <li>□ Fast loading times (&lt; 2 seconds)</li>
                          <li>□ Webhook endpoints functional</li>
                          <li>□ Team access documented</li>
                          <li>□ Backup proxy plan ready</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`mt-4 ${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎯 Success Metrics</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Response Time:</strong> &lt; 200ms for static content</li>
                        <li>• <strong>Availability:</strong> 99.9%+ uptime for client access</li>
                        <li>• <strong>Throughput:</strong> 1000+ concurrent connections</li>
                        <li>• <strong>Security Score:</strong> A+ rating on SSL Labs</li>
                        <li>• <strong>Professional Image:</strong> Clean URLs, no port numbers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-8',
              title: 'SSL Certificate Configuration',
              description: 'Set up SSL certificates with Let\'s Encrypt',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔒 Enterprise SSL Certificate with Let's Encrypt</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🛡️ Why SSL is Non-Negotiable for Business Success</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>SSL certificates are the difference between looking like a legitimate business and a potential scam.</strong> 
                      Without HTTPS, browsers show "Not Secure" warnings that scare away 85% of potential clients. With SSL, you get 
                      the green lock icon that screams "professional and trustworthy."
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 Business Impact of SSL</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Trust Factor:</strong> 82% higher conversion rates with HTTPS</li>
                        <li>• <strong>SEO Ranking:</strong> Google prioritizes HTTPS sites</li>
                        <li>• <strong>Legal Compliance:</strong> Required for GDPR &amp; SOC2</li>
                        <li>• <strong>API Integrations:</strong> Most services require HTTPS webhooks</li>
                        <li>• <strong>Enterprise Sales:</strong> Fortune 500 won't use HTTP services</li>
                        <li>• <strong>Insurance:</strong> Cyber insurance requires SSL encryption</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🚀 Let's Encrypt: Free Enterprise-Grade SSL</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Let's Encrypt provides the same level of encryption as $500/year commercial certificates, but completely free. 
                      It's trusted by 300+ million websites including Netflix, Shopify, and WordPress.com. The only difference? 
                      Commercial certificates last 1-2 years, while Let's Encrypt renews every 90 days (automatically).
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# STEP 1: Install Snapd (modern package manager)
# Snapd ensures we get the latest Certbot version
sudo apt update
sudo apt install -y snapd

# STEP 2: Install Certbot via Snap
# This gets the official Let's Encrypt client
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot

# STEP 3: Create system-wide Certbot command
# This allows running 'certbot' from anywhere
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# STEP 4: Verify Certbot installation
certbot --version
# Should show: certbot 2.x.x`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🎯 Automated SSL Certificate Installation</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      The Nginx plugin automatically detects your site configuration, obtains the certificate, and modifies your 
                      Nginx config to use HTTPS. It even sets up automatic HTTP to HTTPS redirects. This is enterprise automation at its finest.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# STEP 5: Get SSL certificate with automatic Nginx configuration
# Replace 'your-domain.com' with your actual domain
# The --nginx plugin handles everything automatically
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# During the process, Certbot will ask:
# 1. Email address (for renewal notifications)
# 2. Terms of service agreement (type 'Y')
# 3. Email sharing with EFF (type 'N' for privacy)
# 4. Redirect HTTP to HTTPS (choose option 2: Redirect)

# STEP 6: Verify SSL certificate is working
curl -I https://your-domain.com
# Should show: HTTP/2 200 and SSL certificate info

# STEP 7: Test SSL configuration
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
# Should get A+ rating`}
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/20'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Common SSL Installation Issues</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Domain not pointing to server:</strong> Update DNS A record first</li>
                        <li>• <strong>Port 80 blocked:</strong> Check firewall &amp; cloud provider rules</li>
                        <li>• <strong>Nginx not running:</strong> Start Nginx before running Certbot</li>
                        <li>• <strong>Rate limits:</strong> Let's Encrypt allows 5 failures per hour</li>
                        <li>• <strong>Multiple domains:</strong> Add all with -d flag: -d domain1.com -d www.domain1.com</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>🔄 Automatic SSL Renewal Setup</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Let's Encrypt certificates expire every 90 days for security. But don't worry - Certbot automatically sets up 
                      renewal cron jobs that run twice daily. Your certificates will renew automatically without any manual intervention.
                    </p>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# STEP 8: Test automatic renewal (dry run)
# This simulates renewal without actually renewing
sudo certbot renew --dry-run

# Expected output: "Congratulations, all simulated renewals succeeded"

# STEP 9: Check renewal timer status
sudo systemctl status snap.certbot.renew.timer

# STEP 10: View renewal logs
sudo journalctl -u snap.certbot.renew.service

# STEP 11: Manual renewal (if needed)
sudo certbot renew

# STEP 12: Force renewal for testing
sudo certbot renew --force-renewal

# STEP 13: Check certificate expiration dates
sudo certbot certificates

# STEP 14: Set up email notifications
# Certbot automatically emails you 30, 14, and 1 day before expiration`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-800/30' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-600' : 'border-red-200 dark:border-red-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-red-600 dark:text-red-400 mb-4`}>🔧 Advanced SSL Configuration &amp; Security</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Enhanced SSL Security Headers (add to Nginx config)
sudo nano /etc/nginx/sites-available/n8n

# Add these headers to the server block:
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

# Test configuration and reload
sudo nginx -t
sudo systemctl reload nginx

# Check SSL Labs score again - should be A+
# https://www.ssllabs.com/ssltest/

# Set up OCSP stapling for faster SSL handshakes
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/your-domain.com/chain.pem;
resolver 8.8.8.8 8.8.4.4 valid=86400s;

# Enable HTTP/2 for better performance
listen 443 ssl http2;`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-teal-800/30' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-teal-600' : 'border-teal-200 dark:border-teal-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-teal-600 dark:text-teal-400 mb-4`}>✅ Professional SSL Validation Checklist</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ HTTPS loads without certificate errors</li>
                          <li>□ HTTP automatically redirects to HTTPS</li>
                          <li>□ SSL Labs score is A or A+</li>
                          <li>□ Certificate covers all domain variations</li>
                          <li>□ Auto-renewal test passes</li>
                          <li>□ Security headers properly configured</li>
                          <li>□ OCSP stapling enabled</li>
                          <li>□ HTTP/2 protocol active</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Green lock icon shows in all browsers</li>
                          <li>□ No "Not Secure" warnings anywhere</li>
                          <li>□ Client confidence &amp; trust established</li>
                          <li>□ Webhook endpoints accept HTTPS calls</li>
                          <li>□ Mobile devices connect securely</li>
                          <li>□ Search engines index HTTPS version</li>
                          <li>□ Compliance requirements met</li>
                          <li>□ Insurance &amp; audit ready</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`mt-4 ${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎯 SSL Success Metrics</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>SSL Labs Score:</strong> A+ rating with perfect scores</li>
                        <li>• <strong>Handshake Time:</strong> &lt; 100ms for SSL negotiation</li>
                        <li>• <strong>Browser Compatibility:</strong> 99.9%+ browser support</li>
                        <li>• <strong>Renewal Success:</strong> 100% automatic renewal rate</li>
                        <li>• <strong>Security Headers:</strong> All critical headers present</li>
                        <li>• <strong>Client Trust:</strong> No security warnings ever</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-9',
              title: 'Environment Variables',
              description: 'Configure production environment variables and secrets',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚙️ Enterprise Environment Variables &amp; Configuration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🔐 Secure Configuration for Production Success</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>Environment variables are the secret sauce that transforms a basic n8n installation into a production-ready automation powerhouse.</strong> 
                      These settings control security, performance, database connections, and webhook endpoints. Poor configuration here can cost you 
                      thousands in security breaches or lost client data.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 Business Impact of Proper Configuration</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Security:</strong> Prevents $4.45M average data breach costs</li>
                        <li>• <strong>Performance:</strong> 60% faster workflows with proper DB config</li>
                        <li>• <strong>Reliability:</strong> 99.9% uptime vs 95% with default settings</li>
                        <li>• <strong>Scalability:</strong> Handle 10x more concurrent workflows</li>
                        <li>• <strong>Client Trust:</strong> Professional authentication &amp; branding</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>📝 Complete Production Environment Configuration</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create secure environment file
sudo nano /opt/n8n/.env

# ============= AUTHENTICATION & SECURITY =============
# Enable basic authentication to protect your n8n instance
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=SuperSecure123!@#

# ============= HOST & DOMAIN CONFIGURATION =============
# Your domain name (replace with actual domain)
N8N_HOST=your-domain.com
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-domain.com/

# ============= DATABASE CONNECTION =============
# PostgreSQL database configuration for production
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8nuser
DB_POSTGRESDB_PASSWORD=your-secure-db-password

# ============= PERFORMANCE OPTIMIZATION =============
# Increase limits for enterprise workflows
N8N_PAYLOAD_SIZE_MAX=104857600
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_ON_PROGRESS=false

# ============= EMAIL CONFIGURATION =============
# SMTP settings for notifications (optional)
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=your-email@domain.com
N8N_SMTP_PASS=your-app-password
N8N_SMTP_SENDER=your-email@domain.com

# ============= SECURITY HEADERS =============
# Additional security for production
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
N8N_DEFAULT_BINARY_DATA_MODE=filesystem
N8N_BINARY_DATA_TTL=24

# ============= LOGGING & MONITORING =============
# Enhanced logging for production monitoring
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console,file
N8N_LOG_FILE_LOCATION=/opt/n8n/logs/n8n.log`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>🔒 Security &amp; File Permissions</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create logs directory
sudo mkdir -p /opt/n8n/logs

# Set proper ownership
sudo chown -R n8nuser:n8nuser /opt/n8n

# Set secure file permissions
sudo chmod 600 /opt/n8n/.env
sudo chmod 755 /opt/n8n/logs

# Verify permissions
ls -la /opt/n8n/
# .env should show: -rw------- (only owner can read/write)

# Test environment file loading
sudo -u n8nuser cat /opt/n8n/.env | head -5

# Generate secure passwords
openssl rand -base64 32  # For database password
openssl rand -base64 24  # For basic auth password`}
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-yellow-900/30' : 'bg-yellow-100 dark:bg-yellow-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">🚨 Security Best Practices</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Use strong passwords (min 20 characters)</li>
                        <li>• Never commit .env files to version control</li>
                        <li>• Rotate passwords every 90 days</li>
                        <li>• Use different passwords for each environment</li>
                        <li>• Monitor failed authentication attempts</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>✅ Configuration Validation Checklist</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ .env file created with 600 permissions</li>
                          <li>□ All required variables set</li>
                          <li>□ Database connection variables correct</li>
                          <li>□ Domain &amp; HTTPS URLs configured</li>
                          <li>□ Authentication enabled &amp; working</li>
                          <li>□ Performance limits increased</li>
                          <li>□ Logging directory created</li>
                          <li>□ File ownership set to n8nuser</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Professional domain configured</li>
                          <li>□ Client-facing URLs clean &amp; branded</li>
                          <li>□ Security measures active</li>
                          <li>□ Performance optimized for scale</li>
                          <li>□ Backup-friendly configuration</li>
                          <li>□ Monitoring &amp; logging enabled</li>
                          <li>□ Production-ready settings applied</li>
                          <li>□ Team access properly configured</li>
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
          id: 'operations',
          title: '🔧 Operations',
          description: 'Set up operational processes',
          steps: [
            {
              id: 'selfhosted-step-10',
              title: 'Service Management',
              description: 'Configure systemd services for automatic startup',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔧 Enterprise Service Management &amp; Auto-Start</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-indigo-800/30' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-indigo-600' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-indigo-600 dark:text-indigo-400 mb-4`}>🚀 Why Professional Service Management Matters</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>Your n8n automation service needs to run 24/7 without manual intervention.</strong> Enterprise clients expect 99.9% uptime. 
                      Systemd service management ensures your n8n automatically starts on boot, restarts if it crashes, and provides professional 
                      logging and monitoring capabilities. This is the difference between a hobby project and a $100K/year automation business.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 Business Benefits of Systemd Management</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Automatic Recovery:</strong> Service restarts in &lt; 10 seconds if crashed</li>
                        <li>• <strong>Boot Persistence:</strong> Survives server reboots &amp; maintenance</li>
                        <li>• <strong>Resource Limits:</strong> Prevent runaway processes from crashing server</li>
                        <li>• <strong>Professional Logging:</strong> Centralized logs for debugging &amp; auditing</li>
                        <li>• <strong>Health Monitoring:</strong> Integration with monitoring systems</li>
                        <li>• <strong>SLA Compliance:</strong> Meet enterprise uptime requirements</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>📝 Production-Grade Systemd Service Configuration</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create enterprise systemd service file
sudo nano /etc/systemd/system/n8n.service

# Add this production-ready configuration:
[Unit]
Description=n8n Workflow Automation Platform
Documentation=https://docs.n8n.io
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=n8nuser
Group=n8nuser
WorkingDirectory=/opt/n8n
ExecStart=/usr/bin/node /opt/n8n/packages/cli/bin/n8n
EnvironmentFile=/opt/n8n/.env

# Restart configuration for maximum uptime
Restart=always
RestartSec=10
StartLimitInterval=350
StartLimitBurst=10

# Resource limits for stability
LimitNOFILE=65536
LimitNPROC=32768

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/n8n

# Logging configuration
StandardOutput=journal
StandardError=journal
SyslogIdentifier=n8n

[Install]
WantedBy=multi-user.target`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>⚙️ Service Activation &amp; Management</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Reload systemd to recognize new service
sudo systemctl daemon-reload

# Enable service to start automatically on boot
sudo systemctl enable n8n

# Start the n8n service
sudo systemctl start n8n

# Check service status and health
sudo systemctl status n8n

# Expected output should show:
# Active: active (running)
# Main PID: [process ID]

# Test service restart capability
sudo systemctl restart n8n
sudo systemctl status n8n

# View real-time logs
sudo journalctl -u n8n -f

# View last 100 log entries
sudo journalctl -u n8n -n 100

# Check if service starts on boot
sudo systemctl is-enabled n8n
# Should return: enabled

# Test auto-restart after crash simulation
sudo kill -9 $(pgrep -f "n8n")
sleep 15
sudo systemctl status n8n
# Should show service restarted automatically`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>🔍 Advanced Service Monitoring &amp; Troubleshooting</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Comprehensive service health check
systemctl show n8n --property=ActiveState,LoadState,SubState

# Check service dependencies
systemctl list-dependencies n8n

# View service resource usage
systemctl show n8n --property=CPUUsageNSec,MemoryCurrent

# Service failure analysis
sudo journalctl -u n8n --since "1 hour ago" --grep="ERROR|FATAL"

# Service performance metrics
sudo journalctl -u n8n --since today | grep -E "(started|stopped|restarted)"

# Check service file syntax
sudo systemd-analyze verify /etc/systemd/system/n8n.service

# View service startup time
systemd-analyze blame | grep n8n

# Set up service monitoring alerts
sudo systemctl edit n8n
# Add failure notifications:
[Service]
OnFailure=failure-notification@%i.service

# Manual service control commands
sudo systemctl stop n8n      # Stop service
sudo systemctl start n8n     # Start service  
sudo systemctl restart n8n   # Restart service
sudo systemctl reload n8n    # Reload config (if supported)

# Disable service (for maintenance)
sudo systemctl disable n8n
sudo systemctl mask n8n      # Prevent accidental start`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>✅ Service Management Validation Checklist</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Service file created &amp; loaded</li>
                          <li>□ Service enabled for auto-start</li>
                          <li>□ Service currently running</li>
                          <li>□ Environment variables loaded</li>
                          <li>□ Auto-restart working after crash</li>
                          <li>□ Logs accessible via journalctl</li>
                          <li>□ Resource limits configured</li>
                          <li>□ Security hardening applied</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ 24/7 availability established</li>
                          <li>□ Automatic recovery from failures</li>
                          <li>□ Professional logging for debugging</li>
                          <li>□ Enterprise uptime SLA achievable</li>
                          <li>□ Maintenance procedures documented</li>
                          <li>□ Monitoring integration ready</li>
                          <li>□ Team access to service management</li>
                          <li>□ Client confidence in reliability</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`mt-4 ${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎯 Service Management Success Metrics</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Uptime:</strong> 99.9%+ service availability</li>
                        <li>• <strong>Recovery Time:</strong> &lt; 10 seconds after failure</li>
                        <li>• <strong>Boot Time:</strong> Automatic start within 30 seconds</li>
                        <li>• <strong>Resource Usage:</strong> Stable memory &amp; CPU consumption</li>
                        <li>• <strong>Log Quality:</strong> Clear, actionable error messages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-11',
              title: 'Backup Strategy',
              description: 'Implement automated backup and recovery procedures',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>💾 Enterprise Backup Strategy &amp; Data Protection</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>🛡️ Why Backup Strategy Can Make or Break Your Business</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>Your n8n workflows represent thousands of hours of work and potentially millions in revenue-generating automation.</strong> 
                      A single hardware failure, human error, or cyber attack can destroy everything in minutes. Professional backup strategy 
                      is the difference between a minor inconvenience and losing your entire business overnight.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 Cost of Data Loss vs Backup Investment</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Data Recovery Service:</strong> $1,500-$15,000 per incident</li>
                        <li>• <strong>Business Downtime:</strong> $5,600 per minute for automation services</li>
                        <li>• <strong>Client Contract Loss:</strong> 70% of clients leave after data loss</li>
                        <li>• <strong>Reputation Damage:</strong> 3-5 years to rebuild trust</li>
                        <li>• <strong>Legal Liability:</strong> Potential lawsuits for client data loss</li>
                        <li>• <strong>Backup Cost:</strong> $0-50/month for enterprise protection</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>📝 Professional Automated Backup Script</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create enterprise backup script
sudo nano /opt/n8n/backup.sh

#!/bin/bash
# n8n Enterprise Backup Script
# Backs up database, workflows, and configuration files

set -e  # Exit on any error

# Configuration
BACKUP_DIR="/opt/n8n/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
LOG_FILE="/opt/n8n/logs/backup.log"
EMAIL_ALERTS="admin@yourdomain.com"

# Create backup directory
mkdir -p $BACKUP_DIR
mkdir -p /opt/n8n/logs

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

log "Starting backup process..."

# Stop n8n service for consistent backup
log "Stopping n8n service..."
systemctl stop n8n

# Backup PostgreSQL database with compression
log "Backing up PostgreSQL database..."
sudo -u postgres pg_dump -Fc n8n > $BACKUP_DIR/n8n_db_$DATE.dump
gzip $BACKUP_DIR/n8n_db_$DATE.dump

# Backup n8n application files
log "Backing up n8n files..."
tar -czf $BACKUP_DIR/n8n_files_$DATE.tar.gz \
    --exclude='/opt/n8n/backups' \
    --exclude='/opt/n8n/logs' \
    /opt/n8n/

# Backup system configuration
log "Backing up system configuration..."
tar -czf $BACKUP_DIR/n8n_config_$DATE.tar.gz \
    /etc/nginx/sites-available/n8n \
    /etc/systemd/system/n8n.service \
    /etc/letsencrypt/live/ \
    --ignore-failed-read

# Restart n8n service
log "Restarting n8n service..."
systemctl start n8n

# Verify service is running
if systemctl is-active --quiet n8n; then
    log "n8n service restarted successfully"
else
    log "ERROR: n8n service failed to restart!"
    echo "n8n backup failed - service not running" | mail -s "CRITICAL: n8n Backup Failure" $EMAIL_ALERTS
    exit 1
fi

# Cleanup old backups
log "Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.dump.gz" -mtime +$RETENTION_DAYS -delete

# Calculate backup sizes
DB_SIZE=$(du -h $BACKUP_DIR/n8n_db_$DATE.dump.gz | cut -f1)
FILES_SIZE=$(du -h $BACKUP_DIR/n8n_files_$DATE.tar.gz | cut -f1)
CONFIG_SIZE=$(du -h $BACKUP_DIR/n8n_config_$DATE.tar.gz | cut -f1)

log "Backup completed successfully!"
log "Database backup: $DB_SIZE"
log "Files backup: $FILES_SIZE"
log "Config backup: $CONFIG_SIZE"

# Send success notification
echo "n8n backup completed successfully on $(date). DB: $DB_SIZE, Files: $FILES_SIZE" | \
mail -s "n8n Backup Success" $EMAIL_ALERTS

exit 0`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>⚙️ Backup Automation &amp; Scheduling</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Make backup script executable
sudo chmod +x /opt/n8n/backup.sh

# Test backup script manually
sudo /opt/n8n/backup.sh

# Set up automated daily backups
sudo crontab -e

# Add these cron jobs for comprehensive backup strategy:
# Daily full backup at 2:00 AM
0 2 * * * /opt/n8n/backup.sh

# Weekly backup verification at 3:00 AM Sunday
0 3 * * 0 /opt/n8n/verify-backup.sh

# Monthly cleanup of very old logs
0 4 1 * * find /opt/n8n/logs -name "*.log" -mtime +90 -delete

# Hourly quick database backup (business hours only)
0 9-17 * * 1-5 sudo -u postgres pg_dump n8n | gzip > /opt/n8n/backups/hourly_$(date +%H).sql.gz

# Install mail utilities for notifications
sudo apt install -y mailutils postfix

# Configure postfix for email notifications
sudo dpkg-reconfigure postfix
# Choose: Internet Site
# System mail name: yourdomain.com

# Test email notifications
echo "Backup system test" | mail -s "n8n Backup Test" admin@yourdomain.com

# View cron jobs
sudo crontab -l

# Check cron logs
sudo tail -f /var/log/cron.log`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🔄 Disaster Recovery &amp; Restoration Procedures</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create disaster recovery script
sudo nano /opt/n8n/restore.sh

#!/bin/bash
# n8n Disaster Recovery Script
# Usage: ./restore.sh BACKUP_DATE

if [ $# -eq 0 ]; then
    echo "Usage: $0 BACKUP_DATE (format: YYYYMMDD_HHMMSS)"
    echo "Available backups:"
    ls -la /opt/n8n/backups/
    exit 1
fi

BACKUP_DATE=$1
BACKUP_DIR="/opt/n8n/backups"

# Stop n8n service
systemctl stop n8n

# Restore database
echo "Restoring database from backup..."
sudo -u postgres dropdb n8n --if-exists
sudo -u postgres createdb n8n
sudo -u postgres createuser n8nuser --if-not-exists
gunzip -c $BACKUP_DIR/n8n_db_$BACKUP_DATE.dump.gz | sudo -u postgres pg_restore -d n8n

# Restore application files
echo "Restoring application files..."
rm -rf /opt/n8n.backup
mv /opt/n8n /opt/n8n.backup
mkdir -p /opt/n8n
tar -xzf $BACKUP_DIR/n8n_files_$BACKUP_DATE.tar.gz -C /

# Restore system configuration
echo "Restoring system configuration..."
tar -xzf $BACKUP_DIR/n8n_config_$BACKUP_DATE.tar.gz -C /

# Set proper permissions
chown -R n8nuser:n8nuser /opt/n8n
chmod 600 /opt/n8n/.env

# Reload systemd and restart services
systemctl daemon-reload
systemctl restart nginx
systemctl start n8n

echo "Disaster recovery completed!"
echo "Please verify n8n is working properly."

# Make restore script executable
sudo chmod +x /opt/n8n/restore.sh

# Test restoration process (with a recent backup)
# sudo /opt/n8n/restore.sh 20241215_020001

# Create backup verification script
sudo nano /opt/n8n/verify-backup.sh

#!/bin/bash
# Verify backup integrity
LATEST_DB=$(ls -t /opt/n8n/backups/n8n_db_*.dump.gz | head -1)
LATEST_FILES=$(ls -t /opt/n8n/backups/n8n_files_*.tar.gz | head -1)

echo "Verifying database backup..."
gunzip -t $LATEST_DB && echo "Database backup OK" || echo "Database backup CORRUPTED"

echo "Verifying files backup..."
tar -tzf $LATEST_FILES > /dev/null && echo "Files backup OK" || echo "Files backup CORRUPTED"

sudo chmod +x /opt/n8n/verify-backup.sh`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-800/30' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-600' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-red-600 dark:text-red-400 mb-4`}>✅ Enterprise Backup Validation Checklist</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Backup script created &amp; executable</li>
                          <li>□ Daily automated backups scheduled</li>
                          <li>□ Database backups compressed &amp; verified</li>
                          <li>□ File backups include all critical data</li>
                          <li>□ Configuration backups captured</li>
                          <li>□ Restoration script tested successfully</li>
                          <li>□ Email notifications working</li>
                          <li>□ Old backups cleaned up automatically</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ RPO (Recovery Point) &lt; 24 hours</li>
                          <li>□ RTO (Recovery Time) &lt; 4 hours</li>
                          <li>□ Business continuity plan documented</li>
                          <li>□ Client data protection guaranteed</li>
                          <li>□ Compliance requirements met</li>
                          <li>□ Team trained on restoration process</li>
                          <li>□ Backup monitoring &amp; alerting active</li>
                          <li>□ Insurance coverage verified</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`mt-4 ${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎯 Backup Success Metrics</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Backup Success Rate:</strong> 99.9%+ automated completion</li>
                        <li>• <strong>Recovery Testing:</strong> Monthly successful restoration tests</li>
                        <li>• <strong>Data Integrity:</strong> 0% backup corruption rate</li>
                        <li>• <strong>Storage Efficiency:</strong> 70%+ compression ratio</li>
                        <li>• <strong>Alert Response:</strong> &lt; 15 minutes notification delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'selfhosted-step-12',
              title: 'Monitoring Setup',
              description: 'Set up monitoring and alerting with Prometheus/Grafana',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-3xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📊 Enterprise Monitoring &amp; Performance Optimization</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-teal-800/30' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-teal-600' : 'border-teal-200 dark:border-teal-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-teal-600 dark:text-teal-400 mb-4`}>🎯 Why Enterprise Monitoring is Your Competitive Advantage</h3>
                    <p className={`${theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      <strong>You can't optimize what you don't measure.</strong> Enterprise monitoring transforms your n8n from a black box into a transparent, 
                      optimized revenue machine. Real-time visibility into performance, errors, and resource usage lets you prevent problems before 
                      they impact clients and optimize workflows for maximum profitability.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg mb-4`}>
                      <h4 className="font-semibold mb-2">💰 ROI of Professional Monitoring</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Prevent Downtime:</strong> Save $5,600/minute in lost revenue</li>
                        <li>• <strong>Performance Optimization:</strong> 40-60% faster workflow execution</li>
                        <li>• <strong>Proactive Problem Solving:</strong> Fix issues before clients notice</li>
                        <li>• <strong>Resource Optimization:</strong> Reduce server costs by 30-50%</li>
                        <li>• <strong>SLA Compliance:</strong> Meet enterprise 99.9% uptime guarantees</li>
                        <li>• <strong>Business Intelligence:</strong> Data-driven pricing &amp; optimization</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-blue-600' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-blue-600 dark:text-blue-400 mb-4`}>🛠️ Professional Monitoring Stack Installation</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Install comprehensive monitoring tools
sudo apt update
sudo apt install -y htop iotop nethogs sysstat ncdu tree

# Install advanced system monitoring
sudo apt install -y netdata prometheus-node-exporter

# Start netdata for real-time dashboard
sudo systemctl enable netdata
sudo systemctl start netdata

# Configure UFW for netdata (optional - for remote access)
sudo ufw allow 19999

# Install PostgreSQL monitoring extensions
sudo apt install -y postgresql-contrib

# Enable PostgreSQL statistics
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"

# Configure PostgreSQL for monitoring
sudo nano /etc/postgresql/*/main/postgresql.conf
# Add these lines:
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = all
pg_stat_statements.max = 10000

# Restart PostgreSQL
sudo systemctl restart postgresql

# Install log analysis tools
sudo apt install -y logwatch fail2ban

# Configure fail2ban for SSH protection
sudo systemctl enable fail2ban
sudo systemctl start fail2ban`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-green-800/30' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-green-600' : 'border-green-200 dark:border-green-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-green-600 dark:text-green-400 mb-4`}>📈 Comprehensive Monitoring Dashboard</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create enterprise monitoring script
sudo nano /opt/n8n/monitor.sh

#!/bin/bash
# n8n Enterprise Monitoring Dashboard
# Provides comprehensive system and application metrics

clear
echo "=============================================="
echo "           n8n Enterprise Monitor"
echo "=============================================="
echo "Generated: $(date)"
echo ""

# System Health Overview
echo "🖥️  SYSTEM HEALTH"
echo "----------------------------------------"
echo "Uptime: $(uptime -p)"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
echo "Disk Usage: $(df /opt/n8n | tail -1 | awk '{print $5}')"
echo ""

# n8n Service Status
echo "🚀 n8n SERVICE STATUS"
echo "----------------------------------------"
if systemctl is-active --quiet n8n; then
    echo "Status: ✅ RUNNING"
    echo "PID: $(pgrep -f n8n)"
    echo "Memory: $(ps -p $(pgrep -f n8n) -o rss= | awk '{print int($1/1024)"MB"}')"
    echo "CPU: $(ps -p $(pgrep -f n8n) -o %cpu= | awk '{print $1"%"}')"
else
    echo "Status: ❌ STOPPED"
fi

# Check n8n health endpoint
echo "Health Check: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:5678/healthz)"
echo ""

# Database Performance
echo "🗄️  DATABASE PERFORMANCE"
echo "----------------------------------------"
DB_SIZE=$(sudo -u postgres psql -t -c "SELECT pg_size_pretty(pg_database_size('n8n'));" | xargs)
DB_CONNECTIONS=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'n8n';" | xargs)
echo "Database Size: $DB_SIZE"
echo "Active Connections: $DB_CONNECTIONS"
echo "Slow Queries: $(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_statements WHERE mean_time > 1000;" | xargs)"
echo ""

# Nginx Performance
echo "🌐 WEB SERVER PERFORMANCE"
echo "----------------------------------------"
if systemctl is-active --quiet nginx; then
    echo "Nginx Status: ✅ RUNNING"
    echo "Active Connections: $(curl -s localhost/nginx_status 2>/dev/null | grep 'Active connections' | awk '{print $3}' || echo 'N/A')"
else
    echo "Nginx Status: ❌ STOPPED"
fi
echo ""

# Disk Space Analysis
echo "💾 STORAGE ANALYSIS"
echo "----------------------------------------"
echo "n8n Directory: $(du -sh /opt/n8n 2>/dev/null | cut -f1)"
echo "Backup Directory: $(du -sh /opt/n8n/backups 2>/dev/null | cut -f1)"
echo "Log Directory: $(du -sh /opt/n8n/logs 2>/dev/null | cut -f1)"
echo "Available Space: $(df -h /opt/n8n | tail -1 | awk '{print $4}')"
echo ""

# Network Performance
echo "🌍 NETWORK PERFORMANCE"
echo "----------------------------------------"
echo "SSL Certificate Expiry: $(echo | openssl s_client -servername localhost -connect localhost:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)"
echo "DNS Resolution: $(dig +short your-domain.com | head -1 || echo 'Failed')"
echo ""

# Recent Errors
echo "⚠️  RECENT ERRORS (Last 24h)"
echo "----------------------------------------"
ERROR_COUNT=$(sudo journalctl -u n8n --since "24 hours ago" | grep -i error | wc -l)
echo "n8n Errors: $ERROR_COUNT"
if [ $ERROR_COUNT -gt 0 ]; then
    echo "Latest Error:"
    sudo journalctl -u n8n --since "24 hours ago" | grep -i error | tail -1
fi
echo ""

# Performance Recommendations
echo "💡 OPTIMIZATION RECOMMENDATIONS"
echo "----------------------------------------"
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | xargs)
if (( $(echo "$LOAD_AVG > 2.0" | bc -l) )); then
    echo "⚠️  High CPU load detected - consider upgrading server"
fi

MEM_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEM_USAGE -gt 80 ]; then
    echo "⚠️  High memory usage - consider adding more RAM"
fi

DISK_USAGE=$(df /opt/n8n | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Low disk space - cleanup old logs and backups"
fi

echo "=============================================="

# Make script executable
sudo chmod +x /opt/n8n/monitor.sh`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-purple-800/30' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-purple-600' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-purple-600 dark:text-purple-400 mb-4`}>🔔 Advanced Alerting &amp; Notification System</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Create intelligent alerting script
sudo nano /opt/n8n/alerts.sh

#!/bin/bash
# n8n Enterprise Alerting System
# Monitors critical metrics and sends alerts

EMAIL="admin@yourdomain.com"
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Function to send alerts
send_alert() {
    local subject="$1"
    local message="$2"
    local severity="$3"
    
    # Email alert
    echo "$message" | mail -s "$subject" "$EMAIL"
    
    # Slack alert (if configured)
    if [ ! -z "$SLACK_WEBHOOK" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$severity: $subject\n$message\"}" \
            "$SLACK_WEBHOOK"
    fi
    
    # Log alert
    echo "$(date): $severity - $subject" >> /opt/n8n/logs/alerts.log
}

# Check n8n service health
if ! systemctl is-active --quiet n8n; then
    send_alert "CRITICAL: n8n Service Down" \
        "n8n automation service has stopped running. Immediate attention required." \
        "🚨 CRITICAL"
fi

# Check disk space
DISK_USAGE=$(df /opt/n8n | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    send_alert "WARNING: Low Disk Space" \
        "Disk usage is at $DISK_USAGE%. Consider cleaning up old files." \
        "⚠️ WARNING"
fi

# Check memory usage
MEM_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEM_USAGE -gt 90 ]; then
    send_alert "WARNING: High Memory Usage" \
        "Memory usage is at $MEM_USAGE%. Server may need more RAM." \
        "⚠️ WARNING"
fi

# Check SSL certificate expiry
SSL_DAYS=$(echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | \
    openssl x509 -noout -dates | grep notAfter | cut -d= -f2 | xargs -I {} date -d {} +%s)
CURRENT_DATE=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($SSL_DAYS - $CURRENT_DATE) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
    send_alert "WARNING: SSL Certificate Expiring" \
        "SSL certificate expires in $DAYS_UNTIL_EXPIRY days. Renewal needed." \
        "⚠️ WARNING"
fi

# Check recent errors
ERROR_COUNT=$(sudo journalctl -u n8n --since "1 hour ago" | grep -i error | wc -l)
if [ $ERROR_COUNT -gt 10 ]; then
    send_alert "WARNING: High Error Rate" \
        "Detected $ERROR_COUNT errors in the last hour. Investigation needed." \
        "⚠️ WARNING"
fi

# Check database connection
if ! sudo -u postgres psql -d n8n -c "SELECT 1;" > /dev/null 2>&1; then
    send_alert "CRITICAL: Database Connection Failed" \
        "Cannot connect to PostgreSQL database. Service may be down." \
        "🚨 CRITICAL"
fi

# Make alerts script executable
sudo chmod +x /opt/n8n/alerts.sh

# Set up automated monitoring
sudo crontab -e
# Add these monitoring cron jobs:

# Run monitoring dashboard every 15 minutes
*/15 * * * * /opt/n8n/monitor.sh > /opt/n8n/logs/monitor_$(date +\%Y\%m\%d_\%H\%M).log

# Run alerts every 5 minutes
*/5 * * * * /opt/n8n/alerts.sh

# Generate daily performance report
0 6 * * * /opt/n8n/daily-report.sh

# Weekly system health summary
0 8 * * 1 /opt/n8n/weekly-summary.sh`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-orange-800/30' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-orange-600' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6 mb-6`}>
                    <h3 className={`font-semibold text-xl text-orange-600 dark:text-orange-400 mb-4`}>📊 Performance Optimization Toolkit</h3>
                    
                    <div className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} p-4 rounded font-mono mb-4`}>
                      {`# Real-time performance monitoring commands
# Use these for immediate system analysis

# TOP 10 system performance commands:

# 1. Interactive system monitor
htop

# 2. Real-time I/O monitoring
sudo iotop -o

# 3. Network bandwidth per process
sudo nethogs

# 4. Disk usage analysis
ncdu /opt/n8n

# 5. PostgreSQL activity monitoring
sudo -u postgres psql -c "
SELECT pid, usename, application_name, state, query_start, query 
FROM pg_stat_activity 
WHERE datname = 'n8n' AND state != 'idle' 
ORDER BY query_start;"

# 6. n8n process detailed analysis
ps aux | grep n8n
pmap $(pgrep -f n8n)

# 7. System resource trending
vmstat 1 10

# 8. Network connections analysis
ss -tuln | grep :5678
netstat -an | grep :5678

# 9. Log analysis for performance issues
sudo journalctl -u n8n --since "1 hour ago" | grep -E "(slow|timeout|error)"

# 10. Database performance analysis
sudo -u postgres psql -d n8n -c "
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"

# Performance optimization commands:

# Optimize PostgreSQL for n8n
sudo -u postgres psql -d n8n -c "VACUUM ANALYZE;"
sudo -u postgres psql -d n8n -c "REINDEX DATABASE n8n;"

# Clear system caches (if safe to do)
sync && echo 3 | sudo tee /proc/sys/vm/drop_caches

# Monitor file descriptor usage
lsof -p $(pgrep -f n8n) | wc -l

# Check for memory leaks
valgrind --tool=memcheck --leak-check=yes node /opt/n8n/packages/cli/bin/n8n

# Analyze n8n workflow performance via API
curl -X GET "http://localhost:5678/rest/executions" \
  -H "accept: application/json" \
  -u "admin:your-password"

# System tuning for production
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'net.core.rmem_max=16777216' | sudo tee -a /etc/sysctl.conf
echo 'net.core.wmem_max=16777216' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p`}
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-red-800/30' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-red-600' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-xl text-red-600 dark:text-red-400 mb-4`}>✅ Enterprise Monitoring Validation Checklist</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">🔧 Technical Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ Real-time monitoring dashboard active</li>
                          <li>□ Automated alerting system configured</li>
                          <li>□ Performance metrics being collected</li>
                          <li>□ Database monitoring enabled</li>
                          <li>□ SSL certificate monitoring active</li>
                          <li>□ Log analysis tools functional</li>
                          <li>□ Resource optimization scripts ready</li>
                          <li>□ Historical data retention configured</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'} p-4 rounded-lg`}>
                        <h4 className="font-semibold mb-2">💼 Business Validation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>□ 24/7 proactive monitoring coverage</li>
                          <li>□ SLA compliance tracking active</li>
                          <li>□ Client impact minimization protocols</li>
                          <li>□ Performance optimization ROI tracked</li>
                          <li>□ Business intelligence reporting ready</li>
                          <li>□ Team alert response procedures trained</li>
                          <li>□ Enterprise dashboard accessibility</li>
                          <li>□ Competitive advantage metrics visible</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={`mt-4 ${theme === 'gradient' ? 'bg-green-900/30' : 'bg-green-100 dark:bg-green-900/20'} p-4 rounded-lg`}>
                      <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🎯 Monitoring Success Metrics</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>MTTR (Mean Time to Recovery):</strong> &lt; 15 minutes</li>
                        <li>• <strong>MTBF (Mean Time Between Failures):</strong> &gt; 720 hours</li>
                        <li>• <strong>Performance Optimization:</strong> 40%+ improvement after monitoring</li>
                        <li>• <strong>Alert Accuracy:</strong> &lt; 5% false positive rate</li>
                        <li>• <strong>Monitoring Coverage:</strong> 99.9%+ system visibility</li>
                        <li>• <strong>Business Impact:</strong> Measurable revenue protection &amp; optimization</li>
                      </ul>
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
    // Check if tab is already open
    if (openTabs.find(tab => tab.id === step.id)) {
      setActiveTab(step.id);
      return;
    }

    // Create new tab
    const newTab = {
      id: step.id,
      title: step.title,
      content: step.content
    };

    setOpenTabs([...openTabs, newTab]);
    setActiveTab(step.id);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  const currentLearningPath = learningPaths[activeApp];
  
  const totalSteps = currentLearningPath ? currentLearningPath.sections.reduce((total, section) => total + section.steps.length, 0) : 0;

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
            Deploy Workflows
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Deploy your n8n workflows to production environments
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
          <Rocket className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
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
                  Deployment Checklist
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

export default N8nDeploy;