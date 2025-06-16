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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cloud account setup content</div>
            },
            {
              id: 'cloud-step-2',
              title: 'Workspace Configuration',
              description: 'Configure your cloud workspace settings',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Workspace configuration content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent upload content</div>
            },
            {
              id: 'cloud-step-4',
              title: 'Environment Variables',
              description: 'Configure secure environment variables',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Environment variables content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Agent monitoring content</div>
            },
            {
              id: 'cloud-step-6',
              title: 'Scaling Configuration',
              description: 'Configure auto-scaling for your agents',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Scaling configuration content</div>
            },
            {
              id: 'cloud-step-7',
              title: 'Backup & Recovery',
              description: 'Implement backup and disaster recovery',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Backup & recovery content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Docker setup content</div>
            },
            {
              id: 'docker-step-2',
              title: 'Container Configuration',
              description: 'Configure n8n Docker containers',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Container configuration content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cluster setup content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>AWS account setup content</div>
            },
            {
              id: 'aws-step-2',
              title: 'VPC Configuration',
              description: 'Set up Virtual Private Cloud and networking',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>VPC configuration content</div>
            },
            {
              id: 'aws-step-3',
              title: 'Security Groups',
              description: 'Configure security groups and access rules',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Security groups content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>RDS setup content</div>
            },
            {
              id: 'aws-step-5',
              title: 'ECS Cluster Creation',
              description: 'Set up Elastic Container Service cluster',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>ECS cluster content</div>
            },
            {
              id: 'aws-step-6',
              title: 'Load Balancer Configuration',
              description: 'Configure Application Load Balancer',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Load balancer content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Container image content</div>
            },
            {
              id: 'aws-step-8',
              title: 'ECS Service Deployment',
              description: 'Deploy n8n service on ECS Fargate',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>ECS deployment content</div>
            },
            {
              id: 'aws-step-9',
              title: 'SSL Certificate Setup',
              description: 'Configure SSL certificates with ACM',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>SSL certificate content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>CloudWatch setup content</div>
            },
            {
              id: 'aws-step-11',
              title: 'Auto Scaling Configuration',
              description: 'Set up auto scaling policies and alarms',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Auto scaling content</div>
            },
            {
              id: 'aws-step-12',
              title: 'Backup Strategy',
              description: 'Implement backup and disaster recovery',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Backup strategy content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>GCP project setup content</div>
            },
            {
              id: 'gcp-step-2',
              title: 'IAM Configuration',
              description: 'Set up Identity and Access Management',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>IAM configuration content</div>
            },
            {
              id: 'gcp-step-3',
              title: 'VPC Network Setup',
              description: 'Configure Virtual Private Cloud networking',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>VPC network content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cloud SQL setup content</div>
            },
            {
              id: 'gcp-step-5',
              title: 'Container Registry',
              description: 'Set up Artifact Registry for container images',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Container registry content</div>
            },
            {
              id: 'gcp-step-6',
              title: 'Load Balancer Configuration',
              description: 'Configure Google Cloud Load Balancer',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>GCP load balancer content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>GCP container build content</div>
            },
            {
              id: 'gcp-step-8',
              title: 'Cloud Run Deployment',
              description: 'Deploy n8n service on Cloud Run',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cloud Run deployment content</div>
            },
            {
              id: 'gcp-step-9',
              title: 'SSL Certificate Setup',
              description: 'Configure managed SSL certificates',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>GCP SSL certificate content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cloud Monitoring setup content</div>
            },
            {
              id: 'gcp-step-11',
              title: 'Auto Scaling Configuration',
              description: 'Set up Cloud Run auto scaling',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>GCP auto scaling content</div>
            },
            {
              id: 'gcp-step-12',
              title: 'Backup and Recovery',
              description: 'Implement backup and disaster recovery',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>GCP backup content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Azure subscription setup content</div>
            },
            {
              id: 'azure-step-2',
              title: 'Service Principal Setup',
              description: 'Create and configure service principals for authentication',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Service principal content</div>
            },
            {
              id: 'azure-step-3',
              title: 'Virtual Network Configuration',
              description: 'Set up virtual network and security groups',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Virtual network content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Azure Database setup content</div>
            },
            {
              id: 'azure-step-5',
              title: 'Container Registry Setup',
              description: 'Set up Azure Container Registry',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Container registry content</div>
            },
            {
              id: 'azure-step-6',
              title: 'Application Gateway Setup',
              description: 'Configure Application Gateway for load balancing',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Application Gateway content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Container Instances deployment content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Azure Monitor setup content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Azure backup content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Server preparation content</div>
            },
            {
              id: 'selfhosted-step-2',
              title: 'Operating System Setup',
              description: 'Configure Ubuntu/CentOS with security hardening',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>OS setup content</div>
            },
            {
              id: 'selfhosted-step-3',
              title: 'Firewall Configuration',
              description: 'Set up firewall rules and security policies',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Firewall configuration content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Node.js installation content</div>
            },
            {
              id: 'selfhosted-step-5',
              title: 'Database Setup',
              description: 'Install and configure PostgreSQL or SQLite',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Database setup content</div>
            },
            {
              id: 'selfhosted-step-6',
              title: 'n8n Installation',
              description: 'Install n8n application and configure basic settings',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>n8n installation content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Reverse proxy content</div>
            },
            {
              id: 'selfhosted-step-8',
              title: 'SSL Certificate Configuration',
              description: 'Set up SSL certificates with Let\'s Encrypt',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>SSL certificate content</div>
            },
            {
              id: 'selfhosted-step-9',
              title: 'Environment Variables',
              description: 'Configure production environment variables and secrets',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Environment variables content</div>
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
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Service management content</div>
            },
            {
              id: 'selfhosted-step-11',
              title: 'Backup Strategy',
              description: 'Implement automated backup and recovery procedures',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Backup strategy content</div>
            },
            {
              id: 'selfhosted-step-12',
              title: 'Monitoring Setup',
              description: 'Set up monitoring and alerting with Prometheus/Grafana',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Monitoring setup content</div>
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