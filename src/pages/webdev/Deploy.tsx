import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Rocket, 
  Globe, 
  Server, 
  Cloud, 
  Terminal, 
  ChevronRight,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Settings,
  Minus,
  Plus,
  Monitor,
  Zap,
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

interface DeploymentPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const WebDevDeploy: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('netlify');
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
    { id: 'netlify', name: 'Netlify', icon: '🌐' },
    { id: 'vercel', name: 'Vercel', icon: '▲' },
    { id: 'aws', name: 'AWS', icon: '🔶' },
    { id: 'gcp', name: 'Google Cloud', icon: '☁️' },
    { id: 'azure', name: 'Azure', icon: '🔷' },
    { id: 'docker', name: 'Docker', icon: '🐳' },
    { id: 'ci-cd', name: 'CI/CD', icon: '🔄' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    netlify: [
      {
        id: 'prepare-netlify-build',
        title: 'Prepare Netlify build',
        description: 'Configure build settings and scripts for Netlify',
        completed: false
      },
      {
        id: 'setup-netlify-env',
        title: 'Set up environment variables',
        description: 'Configure environment variables in Netlify dashboard',
        completed: false
      },
      {
        id: 'configure-netlify-domain',
        title: 'Configure custom domain',
        description: 'Set up custom domain and SSL on Netlify',
        completed: false
      },
      {
        id: 'setup-netlify-forms',
        title: 'Set up Netlify Forms',
        description: 'Configure form handling and submissions',
        completed: false
      },
      {
        id: 'configure-redirects',
        title: 'Configure redirects and rewrites',
        description: 'Set up URL redirects and SPA routing',
        completed: false
      },
      {
        id: 'test-netlify-deployment',
        title: 'Test deployment',
        description: 'Verify all features work correctly on Netlify',
        completed: false
      }
    ],
    vercel: [
      {
        id: 'setup-vercel-project',
        title: 'Set up Vercel project',
        description: 'Create and configure Vercel project settings',
        completed: false
      },
      {
        id: 'configure-vercel-build',
        title: 'Configure build settings',
        description: 'Set up build commands and output directory',
        completed: false
      },
      {
        id: 'setup-vercel-env',
        title: 'Set up environment variables',
        description: 'Configure environment variables in Vercel',
        completed: false
      },
      {
        id: 'configure-vercel-domains',
        title: 'Configure domains',
        description: 'Set up custom domains and SSL certificates',
        completed: false
      },
      {
        id: 'setup-vercel-functions',
        title: 'Set up serverless functions',
        description: 'Deploy and configure Vercel Functions',
        completed: false
      },
      {
        id: 'optimize-vercel-performance',
        title: 'Optimize performance',
        description: 'Configure Edge Network and caching strategies',
        completed: false
      }
    ],
    aws: [
      {
        id: 'setup-aws-account',
        title: 'Set up AWS account',
        description: 'Create AWS account and configure billing',
        completed: false
      },
      {
        id: 'configure-s3-hosting',
        title: 'Configure S3 static hosting',
        description: 'Set up S3 bucket for static website hosting',
        completed: false
      },
      {
        id: 'setup-cloudfront-cdn',
        title: 'Set up CloudFront CDN',
        description: 'Configure CloudFront distribution for global delivery',
        completed: false
      },
      {
        id: 'configure-route53-dns',
        title: 'Configure Route 53 DNS',
        description: 'Set up DNS records and custom domain',
        completed: false
      },
      {
        id: 'setup-ssl-certificate',
        title: 'Set up SSL certificate',
        description: 'Configure SSL/TLS certificate with ACM',
        completed: false
      },
      {
        id: 'implement-ci-cd-pipeline',
        title: 'Implement CI/CD pipeline',
        description: 'Set up CodePipeline or GitHub Actions for AWS',
        completed: false
      }
    ],
    gcp: [
      {
        id: 'setup-gcp-project',
        title: 'Set up GCP project',
        description: 'Create Google Cloud project and enable billing',
        completed: false
      },
      {
        id: 'configure-cloud-storage',
        title: 'Configure Cloud Storage',
        description: 'Set up Cloud Storage bucket for static hosting',
        completed: false
      },
      {
        id: 'setup-cloud-cdn',
        title: 'Set up Cloud CDN',
        description: 'Configure Cloud CDN for global content delivery',
        completed: false
      },
      {
        id: 'configure-cloud-dns',
        title: 'Configure Cloud DNS',
        description: 'Set up DNS records and custom domain',
        completed: false
      },
      {
        id: 'setup-ssl-managed-certificate',
        title: 'Set up SSL managed certificate',
        description: 'Configure Google-managed SSL certificate',
        completed: false
      },
      {
        id: 'implement-cloud-build',
        title: 'Implement Cloud Build',
        description: 'Set up automated build and deployment pipeline',
        completed: false
      }
    ],
    azure: [
      {
        id: 'setup-azure-account',
        title: 'Set up Azure account',
        description: 'Create Azure account and configure subscription',
        completed: false
      },
      {
        id: 'configure-static-web-apps',
        title: 'Configure Static Web Apps',
        description: 'Set up Azure Static Web Apps service',
        completed: false
      },
      {
        id: 'setup-azure-cdn',
        title: 'Set up Azure CDN',
        description: 'Configure CDN for global content delivery',
        completed: false
      },
      {
        id: 'configure-custom-domain',
        title: 'Configure custom domain',
        description: 'Set up custom domain with Azure DNS',
        completed: false
      },
      {
        id: 'setup-ssl-certificate',
        title: 'Set up SSL certificate',
        description: 'Configure SSL certificate and HTTPS',
        completed: false
      },
      {
        id: 'implement-github-actions',
        title: 'Implement GitHub Actions',
        description: 'Set up CI/CD pipeline with GitHub Actions',
        completed: false
      }
    ],
    docker: [
      {
        id: 'create-dockerfile',
        title: 'Create Dockerfile',
        description: 'Write Dockerfile for containerizing your application',
        completed: false
      },
      {
        id: 'build-docker-image',
        title: 'Build Docker image',
        description: 'Build and test your Docker container locally',
        completed: false
      },
      {
        id: 'setup-docker-compose',
        title: 'Set up Docker Compose',
        description: 'Configure multi-container setup with Docker Compose',
        completed: false
      },
      {
        id: 'optimize-docker-image',
        title: 'Optimize Docker image',
        description: 'Reduce image size and improve build performance',
        completed: false
      },
      {
        id: 'setup-container-registry',
        title: 'Set up container registry',
        description: 'Push images to Docker Hub or cloud registry',
        completed: false
      },
      {
        id: 'deploy-to-production',
        title: 'Deploy to production',
        description: 'Deploy containers to production environment',
        completed: false
      }
    ],
    'ci-cd': [
      {
        id: 'choose-ci-cd-platform',
        title: 'Choose CI/CD platform',
        description: 'Select GitHub Actions, GitLab CI, or Jenkins',
        completed: false
      },
      {
        id: 'setup-build-pipeline',
        title: 'Set up build pipeline',
        description: 'Configure automated build and test pipeline',
        completed: false
      },
      {
        id: 'implement-testing-stage',
        title: 'Implement testing stage',
        description: 'Add unit tests, integration tests, and linting',
        completed: false
      },
      {
        id: 'configure-deployment-stages',
        title: 'Configure deployment stages',
        description: 'Set up staging and production deployment stages',
        completed: false
      },
      {
        id: 'setup-environment-promotion',
        title: 'Set up environment promotion',
        description: 'Configure promotion from staging to production',
        completed: false
      },
      {
        id: 'implement-rollback-strategy',
        title: 'Implement rollback strategy',
        description: 'Set up automated rollback on deployment failures',
        completed: false
      }
    ]
  };

  const deploymentPaths: { [key: string]: DeploymentPath } = {
    netlify: {
      id: 'netlify',
      title: 'Step-by-Step Netlify Deployment',
      icon: <Globe className="h-5 w-5" />,
      description: 'Deploy your static sites and SPAs to Netlify',
      sections: [
        {
          id: 'preparation',
          title: '🏗️ Preparation',
          description: 'Prepare your project for deployment',
          steps: [
            {
              id: 'webdev-deploy-netlify-step-1',
              title: 'Project Setup',
              description: 'Configure your project for optimal deployment',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Project Configuration</h2>
                    <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      Ensure your project is properly configured with build scripts and optimization settings.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400`}>Build Configuration</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Configure package.json scripts</li>
                        <li>• Set up build environment</li>
                        <li>• Optimize assets and dependencies</li>
                        <li>• Configure environment variables</li>
                      </ul>
                    </div>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <div className="flex items-center mb-4">
                        <Settings className="h-6 w-6 text-blue-500 mr-3" />
                        <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400`}>Project Structure</h3>
                      </div>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Organize source files</li>
                        <li>• Set up public directory</li>
                        <li>• Configure build output</li>
                        <li>• Prepare deployment assets</li>
                      </ul>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30'} border rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg mb-3 ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700 dark:text-blue-300'}`}>🎯 Learning Objectives</h3>
                    <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>By the end of this step, you'll understand:</p>
                    <ul className={`space-y-1 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                      <li>• How to structure your project for deployment</li>
                      <li>• Build configuration best practices</li>
                      <li>• Environment setup requirements</li>
                    </ul>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-deploy-netlify-step-2',
              title: 'Netlify Account Setup',
              description: 'Create and configure your Netlify account',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Setting Up Netlify</h2>
                  <div className="space-y-4">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg mb-4 flex items-center ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Create Netlify Account
                      </h3>
                      <p className={`mb-4 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Sign up for a free Netlify account to get started with deployment.</p>
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Netlify
                      </button>
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
          description: 'Deploy your application to Netlify',
          steps: [
            {
              id: 'deploy-step-3',
              title: 'Connect Repository',
              description: 'Link your GitHub repository to Netlify',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Repository Connection</h2>
                  <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
                    theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    <Globe className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                      Connect your GitHub repository to enable automatic deployments
                    </p>
                  </div>
                </div>
              )
            },
            {
              id: 'deploy-step-4',
              title: 'Configure Build Settings',
              description: 'Set up build commands and publish directory',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Build Configuration</h2>
                  <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
                    theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    <Terminal className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                      Configure build commands and deployment settings
                    </p>
                  </div>
                </div>
              )
            },
            {
              id: 'deploy-step-5',
              title: 'Environment Variables',
              description: 'Configure environment variables for your deployment',
              estimated_time: '10 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Environment Variables</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up secure environment variables for your Netlify deployment.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Optimize your Netlify deployment',
          steps: [
            {
              id: 'deploy-step-6',
              title: 'Performance Optimization',
              description: 'Optimize your site for better performance',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Performance Optimization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure performance optimizations for your Netlify site.
                  </p>
                </div>
              )
            },
            {
              id: 'deploy-step-7',
              title: 'Custom Domain Setup',
              description: 'Configure custom domain and SSL',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Custom Domain</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up a custom domain with automatic SSL certificates.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    vercel: {
      id: 'vercel',
      title: 'Step-by-Step Vercel Deployment',
      icon: <Rocket className="h-5 w-5" />,
      description: 'Deploy your applications to Vercel platform',
      sections: [
        {
          id: 'vercel-setup',
          title: '⚡ Vercel Setup',
          description: 'Get started with Vercel deployment',
          steps: [
            {
              id: 'vercel-step-1',
              title: 'Vercel Account Setup',
              description: 'Create and configure your Vercel account',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Vercel Platform Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up your Vercel account for seamless deployment experience.
                  </p>
                </div>
              )
            },
            {
              id: 'vercel-step-2',
              title: 'Project Configuration',
              description: 'Configure your project for Vercel deployment',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Project Configuration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure your project settings for optimal Vercel deployment.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    aws: {
      id: 'aws',
      title: 'Step-by-Step AWS Deployment',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Deploy to Amazon Web Services using S3, CloudFront, and more',
      sections: [
        {
          id: 'aws-setup',
          title: '☁️ AWS Account Setup',
          description: 'Set up your AWS account and IAM permissions',
          steps: [
            {
              id: 'aws-step-1',
              title: 'AWS Account Creation',
              description: 'Create and configure your AWS account',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AWS Account Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up your Amazon Web Services account to access cloud deployment services.
                  </p>
                </div>
              )
            },
            {
              id: 'aws-step-2',
              title: 'IAM Configuration',
              description: 'Set up Identity and Access Management',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>IAM Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure secure access permissions for your AWS resources.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'aws-s3-deployment',
          title: '📦 S3 Static Hosting',
          description: 'Deploy static sites using Amazon S3',
          steps: [
            {
              id: 'aws-step-3',
              title: 'S3 Bucket Creation',
              description: 'Create and configure S3 bucket for hosting',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>S3 Bucket Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create an S3 bucket configured for static website hosting.
                  </p>
                </div>
              )
            },
            {
              id: 'aws-step-4',
              title: 'CloudFront Distribution',
              description: 'Set up CDN for global content delivery',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>CloudFront CDN</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure CloudFront for fast global content delivery.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    gcp: {
      id: 'gcp',
      title: 'Step-by-Step Google Cloud Deployment',
      icon: <Server className="h-5 w-5" />,
      description: 'Deploy to Google Cloud Platform using App Engine, Cloud Run, and more',
      sections: [
        {
          id: 'gcp-setup',
          title: '☁️ GCP Account Setup',
          description: 'Set up Google Cloud Platform account and project',
          steps: [
            {
              id: 'gcp-step-1',
              title: 'GCP Project Creation',
              description: 'Create and configure your Google Cloud project',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Google Cloud Project</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up your Google Cloud Platform project and enable necessary APIs.
                  </p>
                </div>
              )
            },
            {
              id: 'gcp-step-2',
              title: 'Cloud SDK Installation',
              description: 'Install and configure Google Cloud SDK',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Cloud SDK Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Install the Google Cloud SDK for command-line deployment tools.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'gcp-deployment',
          title: '🚀 App Engine Deployment',
          description: 'Deploy using Google App Engine',
          steps: [
            {
              id: 'gcp-step-3',
              title: 'App Engine Configuration',
              description: 'Configure your app for App Engine deployment',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>App Engine Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure your application for Google App Engine deployment.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    azure: {
      id: 'azure',
      title: 'Step-by-Step Azure Deployment',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Deploy to Microsoft Azure using App Service and Static Web Apps',
      sections: [
        {
          id: 'azure-setup',
          title: '☁️ Azure Account Setup',
          description: 'Set up Microsoft Azure account and resources',
          steps: [
            {
              id: 'azure-step-1',
              title: 'Azure Account Creation',
              description: 'Create and configure your Azure account',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Azure Account Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up your Microsoft Azure account and subscription.
                  </p>
                </div>
              )
            },
            {
              id: 'azure-step-2',
              title: 'Resource Group Creation',
              description: 'Create Azure resource group for your application',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Resource Group</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create a resource group to organize your Azure resources.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'azure-deployment',
          title: '🌐 Static Web Apps',
          description: 'Deploy using Azure Static Web Apps',
          steps: [
            {
              id: 'azure-step-3',
              title: 'Static Web App Creation',
              description: 'Create and configure Azure Static Web App',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Static Web App</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Deploy your static application using Azure Static Web Apps.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    docker: {
      id: 'docker',
      title: 'Step-by-Step Docker Deployment',
      icon: <Terminal className="h-5 w-5" />,
      description: 'Containerize and deploy your applications using Docker',
      sections: [
        {
          id: 'docker-setup',
          title: '🐳 Docker Setup',
          description: 'Install and configure Docker',
          steps: [
            {
              id: 'docker-step-1',
              title: 'Docker Installation',
              description: 'Install Docker on your development machine',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Docker Installation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Install Docker Desktop and set up your containerization environment.
                  </p>
                </div>
              )
            },
            {
              id: 'docker-step-2',
              title: 'Dockerfile Creation',
              description: 'Create Dockerfile for your application',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Dockerfile Configuration</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Write a Dockerfile to containerize your application.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'docker-deployment',
          title: '🚢 Container Deployment',
          description: 'Build and deploy Docker containers',
          steps: [
            {
              id: 'docker-step-3',
              title: 'Image Building',
              description: 'Build Docker image from Dockerfile',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Docker Image Build</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Build a Docker image from your Dockerfile configuration.
                  </p>
                </div>
              )
            },
            {
              id: 'docker-step-4',
              title: 'Container Registry',
              description: 'Push image to container registry',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Container Registry</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Push your Docker image to a container registry for deployment.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    'ci-cd': {
      id: 'ci-cd',
      title: 'Step-by-Step CI/CD Pipeline',
      icon: <Settings className="h-5 w-5" />,
      description: 'Set up continuous integration and deployment pipelines',
      sections: [
        {
          id: 'cicd-setup',
          title: '⚙️ CI/CD Setup',
          description: 'Configure continuous integration and deployment',
          steps: [
            {
              id: 'cicd-step-1',
              title: 'GitHub Actions Setup',
              description: 'Configure GitHub Actions workflows',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub Actions</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up automated workflows using GitHub Actions for CI/CD.
                  </p>
                </div>
              )
            },
            {
              id: 'cicd-step-2',
              title: 'Build Pipeline',
              description: 'Create automated build and test pipeline',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Build Pipeline</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure automated build and testing processes.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'cicd-deployment',
          title: '🚀 Deployment Automation',
          description: 'Automate deployment processes',
          steps: [
            {
              id: 'cicd-step-3',
              title: 'Deployment Pipeline',
              description: 'Set up automated deployment pipeline',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Deployment Pipeline</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create an automated pipeline for continuous deployment.
                  </p>
                </div>
              )
            },
            {
              id: 'cicd-step-4',
              title: 'Environment Management',
              description: 'Configure staging and production environments',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Environment Management</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up proper environment management for different deployment stages.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    }
  };

  const currentDeploymentPath = deploymentPaths[activeApp] || deploymentPaths.netlify;
  const totalSteps = currentDeploymentPath.sections.reduce((acc, section) => acc + section.steps.length, 0);

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
      
      Object.keys(deploymentPaths).forEach(appId => {
        const path = deploymentPaths[appId];
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

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
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
            Deploy Applications
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Build, deploy, and host your web applications with modern platforms
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
          <Rocket className={`h-8 w-8 ${theme === 'gradient' ? 'text-green-400' : 'text-green-600'}`} />
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

        {/* Right Column - FAQ-Style Deployment Guide and Tabs */}
        <div className={checklistCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
          <div className="space-y-6">
            {/* FAQ-Style Deployment Guide Section */}
            <div className={`${theme === 'gradient' ? 'bg-gray-800/30 border-gray-700' : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                {currentDeploymentPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentDeploymentPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentDeploymentPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                  {currentDeploymentPath.sections.map((section, sectionIndex) => {
                    let stepCounter = 0;
                    // Calculate step number offset for this section
                    for (let i = 0; i < sectionIndex; i++) {
                      stepCounter += currentDeploymentPath.sections[i].steps.length;
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

export default WebDevDeploy;