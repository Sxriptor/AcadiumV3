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
              id: 'webdev-deploy-netlify-step-3',
              title: 'Connect Repository',
              description: 'Link your GitHub repository to Netlify',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔗 Git Repository Integration
                      </h4>
                      <p className="mb-4">
                        Connect your GitHub, GitLab, or Bitbucket repository to enable automatic deployments 
                        with continuous integration and seamless version control workflows.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Repository Setup</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>GitHub Integration:</strong> Seamless OAuth connection</div>
                            <div><strong>Branch Configuration:</strong> Production and preview branches</div>
                            <div><strong>Build Commands:</strong> Automated build process setup</div>
                            <div><strong>Deploy Settings:</strong> Output directory configuration</div>
                            <div><strong>Environment Variables:</strong> Secure config management</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">💡 Advanced Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Auto-Deploy:</strong> Push-to-deploy automation</div>
                            <div><strong>Preview Deploys:</strong> Branch and PR previews</div>
                            <div><strong>Deploy Contexts:</strong> Different configs per environment</div>
                            <div><strong>Build Hooks:</strong> Webhook-triggered deployments</div>
                            <div><strong>Split Testing:</strong> A/B testing capabilities</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: Marketing Agency</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Marketing agency needed fast deployment pipeline for client websites 
                            with automatic preview environments for stakeholder feedback.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Netlify Integration Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>90% faster deployments:</strong> Automated Git workflows</div>
                            <div>• <strong>50+ preview environments:</strong> Client feedback acceleration</div>
                            <div>• <strong>Zero downtime:</strong> Atomic deployments and rollbacks</div>
                            <div>• <strong>Team collaboration boost:</strong> Seamless developer experience</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-deploy-netlify-step-4',
              title: 'Build Configuration',
              description: 'Configure build settings and environment variables',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        ⚙️ Advanced Build Configuration
                      </h4>
                      <p className="mb-4">
                        Configure comprehensive build settings with environment management, 
                        optimization strategies, and deployment automation for production-ready applications.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Build Settings</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Build Command:</strong> Custom build script execution</div>
                            <div><strong>Publish Directory:</strong> Output folder specification</div>
                            <div><strong>Base Directory:</strong> Monorepo support configuration</div>
                            <div><strong>Runtime Version:</strong> Node.js and dependency management</div>
                            <div><strong>Build Timeout:</strong> Performance optimization settings</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">💡 Environment Management</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Environment Variables:</strong> Secure config storage</div>
                            <div><strong>Context Variables:</strong> Branch-specific configurations</div>
                            <div><strong>File-based Config:</strong> .env file management</div>
                            <div><strong>Secret Management:</strong> API keys and tokens</div>
                            <div><strong>Build Context:</strong> Deploy-time environment control</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 E-commerce Success: Online Store</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            E-commerce platform needed environment-specific configurations 
                            for development, staging, and production with secure API key management.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Build Configuration Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>3-environment setup:</strong> Dev, staging, production isolation</div>
                            <div>• <strong>Secure API management:</strong> Environment-specific configurations</div>
                            <div>• <strong>5-minute build times:</strong> Optimized dependency caching</div>
                            <div>• <strong>Zero configuration errors:</strong> Automated environment validation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-deploy-netlify-step-5',
              title: 'Deploy & Test',
              description: 'Deploy your site and verify everything works',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🚀 Deploy Your Website (The Fun Part!)
                      </h4>
                      <p className="mb-4 text-base">
                        This is where your website goes from being just code on your computer to being 
                        a real website that anyone in the world can visit! Think of it like moving 
                        from your house to a new neighborhood where everyone can find you.
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Step-by-Step Deployment Guide</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Click "Deploy site" button</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Look for the big blue button that says "Deploy site" in your Netlify dashboard. 
                                This tells Netlify to start building your website.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Watch the build process</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Netlify will show you a progress bar. It's like watching a cake bake in the oven - 
                                you can see it happening but you have to wait for it to finish!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Get your website URL</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                When it's done, Netlify gives you a web address (URL) that looks like 
                                "funny-name-123456.netlify.app" - this is your website's new home on the internet!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Test your website</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click on your new URL and check if everything works! 
                                It's like doing a walk-through of your new house to make sure everything is working.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💡 What's happening behind the scenes?</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          When you click deploy, Netlify takes your code, follows your build instructions 
                          (like a recipe), creates your website files, and puts them on special computers 
                          called servers so people can visit your site 24/7 from anywhere in the world!
                        </p>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ How to know if it worked:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• You see a green checkmark next to your deployment</li>
                          <li>• Your website loads when you click the URL</li>
                          <li>• All your pages and links work correctly</li>
                          <li>• Images and styles show up properly</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real Example: Student Portfolio</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Sarah's Story:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Sarah built her first portfolio website and was nervous about deploying it. 
                            She thought it would be complicated and scary, but Netlify made it super easy!
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">What happened:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>30 seconds:</strong> Time it took to deploy her first website</div>
                            <div>• <strong>Zero errors:</strong> Everything worked on the first try</div>
                            <div>• <strong>Worldwide access:</strong> Her friends from other countries could see it</div>
                            <div>• <strong>Free hosting:</strong> Didn't cost her anything to get started</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-deploy-netlify-step-6',
              title: 'Troubleshooting & Common Issues',
              description: 'Fix common deployment problems',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🔧 Fixing Common Problems (Don't Panic!)
                      </h4>
                      <p className="mb-4 text-base">
                        Sometimes things don't work perfectly the first time, and that's totally normal! 
                        It's like learning to ride a bike - you might fall a few times, but once you know 
                        how to fix these common issues, you'll be a deployment expert!
                      </p>

                      <div className="space-y-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-lg">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">❌ Problem #1: "Build failed" error</h5>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <strong>What it means:</strong> Netlify couldn't turn your code into a website. 
                              It's like having a recipe but missing some ingredients.
                            </p>
                            <div className="bg-white dark:bg-gray-600 p-3 rounded">
                              <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">How to fix it:</h6>
                              <ul className="text-sm space-y-1">
                                <li>• Check your build command (like "npm run build")</li>
                                <li>• Make sure your package.json has all dependencies</li>
                                <li>• Look at the build log for error messages</li>
                                <li>• Test your build locally first (run the build command on your computer)</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">⚠️ Problem #2: "Page Not Found" (404 error)</h5>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <strong>What it means:</strong> The website deployed but some pages can't be found. 
                              It's like having a house but some rooms are locked.
                            </p>
                            <div className="bg-white dark:bg-gray-600 p-3 rounded">
                              <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">How to fix it:</h6>
                              <ul className="text-sm space-y-1">
                                <li>• Check your publish directory (usually "build" or "dist")</li>
                                <li>• For single-page apps, add a "_redirects" file</li>
                                <li>• Make sure your file names and paths are correct</li>
                                <li>• Check that your index.html file exists</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔍 Problem #3: Environment variables not working</h5>
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <strong>What it means:</strong> Your secret keys or settings aren't working. 
                              It's like having a password-protected app but forgetting the password.
                            </p>
                            <div className="bg-white dark:bg-gray-600 p-3 rounded">
                              <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">How to fix it:</h6>
                              <ul className="text-sm space-y-1">
                                <li>• Go to Site Settings → Environment Variables in Netlify</li>
                                <li>• Add your variables exactly as they appear in your code</li>
                                <li>• Redeploy your site after adding variables</li>
                                <li>• Check that variable names match exactly (case-sensitive!)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-6">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🆘 When all else fails:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Check Netlify's status page (status.netlify.com) for outages</li>
                          <li>• Look at the deploy logs for specific error messages</li>
                          <li>• Try deploying a simple HTML file first to test</li>
                          <li>• Ask for help in Netlify's community forum</li>
                          <li>• Compare with a working project setup</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Debugging Success: Learning Journey</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Mike's Experience:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Mike spent 3 hours trying to deploy his React app. It kept failing with build errors. 
                            He was frustrated and thought he wasn't good enough at coding.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">The Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Found the issue:</strong> Missing environment variable for API</div>
                            <div>• <strong>5-minute fix:</strong> Added one variable in Netlify settings</div>
                            <div>• <strong>Lesson learned:</strong> Always check the deploy logs first</div>
                            <div>• <strong>Confidence boost:</strong> Now helps other students debug their sites</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-deploy-netlify-step-7',
              title: 'Environment Variables (Secret Settings)',
              description: 'Configure secure settings for your website',
              estimated_time: '10 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🔒 Environment Variables (Your Website's Secrets)
                      </h4>
                      <p className="mb-4 text-base">
                        Environment variables are like secret passwords and settings for your website. 
                        Think of them as your website's private diary - you don't want to share API keys 
                        or database passwords with everyone, so you keep them hidden and secure!
                      </p>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">🤔 What are Environment Variables?</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          They're special settings that your website needs to work but shouldn't be visible 
                          in your code. Like your API keys for Google Maps, database passwords, or payment 
                          processor secrets. It's like having a safe where you keep important documents!
                        </p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 How to Add Environment Variables</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Go to Site Settings</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In your Netlify dashboard, click on your site, then click "Site settings" button.
                                It's like going to your website's control panel.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Find Environment Variables</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Look for "Environment variables" in the left sidebar menu. 
                                Click on it to open your secret settings area.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Add Your Variables</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click "Add variable" and enter the name and value. 
                                For example: Name = "API_KEY", Value = "your-secret-key-here"
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Redeploy Your Site</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                After adding variables, trigger a new deploy so your site can use the new settings.
                                It's like restarting your website with the new secrets.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ Common Environment Variables</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• <strong>API_KEY:</strong> For connecting to external services</li>
                            <li>• <strong>DATABASE_URL:</strong> Database connection string</li>
                            <li>• <strong>STRIPE_KEY:</strong> Payment processing</li>
                            <li>• <strong>GOOGLE_MAPS_KEY:</strong> Map integration</li>
                            <li>• <strong>EMAIL_SERVICE_KEY:</strong> Sending emails</li>
                          </ul>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold mb-2 text-red-700 dark:text-red-300">❌ Don't Put These in Code</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• API keys and passwords</li>
                            <li>• Database connection strings</li>
                            <li>• Payment processor secrets</li>
                            <li>• Email service credentials</li>
                            <li>• Any personal/private information</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">🔍 How Your Code Uses Them</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          In your code, you access these secrets using <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">process.env.VARIABLE_NAME</code>
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                          <code>
                            // Instead of: const apiKey = "abc123secret"<br/>
                            // Use this: const apiKey = process.env.API_KEY
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Security Success: Blog Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Jessica's Mistake:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Jessica accidentally pushed her API keys to GitHub in her code. 
                            Within hours, someone found them and used up her $200 API quota!
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">The Fix:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Moved to environment variables:</strong> Kept secrets safe in Netlify</div>
                            <div>• <strong>Reset all API keys:</strong> Generated new ones for security</div>
                            <div>• <strong>Added usage alerts:</strong> Gets notified if someone tries to abuse her keys</div>
                            <div>• <strong>Never again:</strong> Now all her projects use proper environment variables</div>
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
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        ⚡ Performance Optimization &amp; Edge Computing
                      </h4>
                      <p className="mb-4">
                        Implement advanced performance optimizations using Netlify's Edge Network, 
                        asset optimization, and caching strategies for lightning-fast global delivery.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Edge Optimization</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Edge Functions:</strong> Server-side logic at the edge</div>
                            <div><strong>CDN Caching:</strong> Global content distribution</div>
                            <div><strong>Asset Optimization:</strong> Automatic image and code compression</div>
                            <div><strong>Bundle Splitting:</strong> Code splitting and lazy loading</div>
                            <div><strong>Preloading:</strong> Critical resource prioritization</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">💡 Advanced Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Large Media:</strong> Git LFS integration</div>
                            <div><strong>Image Transformation:</strong> On-demand image optimization</div>
                            <div><strong>Form Handling:</strong> Serverless form processing</div>
                            <div><strong>Analytics:</strong> Core Web Vitals monitoring</div>
                            <div><strong>Security Headers:</strong> Automatic security hardening</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Media Success: News Website</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            News website needed ultra-fast loading times globally 
                            with heavy image content and real-time article updates.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Performance Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>95+ Lighthouse score:</strong> Core Web Vitals optimization</div>
                            <div>• <strong>50% faster load times:</strong> Edge function implementation</div>
                            <div>• <strong>80% bandwidth savings:</strong> Automatic image optimization</div>
                            <div>• <strong>Global sub-200ms:</strong> CDN edge distribution</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🌐 Custom Domain &amp; SSL Configuration
                      </h4>
                      <p className="mb-4">
                        Configure professional custom domains with automatic SSL certificates, 
                        DNS management, and advanced security features for production-ready websites.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Domain Setup</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Domain Registration:</strong> External registrar integration</div>
                            <div><strong>DNS Configuration:</strong> A/CNAME record setup</div>
                            <div><strong>Subdomain Support:</strong> www and custom subdomains</div>
                            <div><strong>Domain Aliases:</strong> Multiple domain pointing</div>
                            <div><strong>Branch Domains:</strong> Deploy preview domains</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">💡 Security Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Automatic SSL:</strong> Let's Encrypt certificate management</div>
                            <div><strong>HTTPS Redirect:</strong> Forced secure connections</div>
                            <div><strong>HSTS Headers:</strong> HTTP Strict Transport Security</div>
                            <div><strong>Domain Protection:</strong> Certificate transparency monitoring</div>
                            <div><strong>Custom Certificates:</strong> Enterprise SSL support</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 Domain Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Setup Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://docs.netlify.com/domains-https/custom-domains/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Custom Domain Setup</a></div>
                            <div>• <a href="https://docs.netlify.com/domains-https/https-ssl/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">SSL Certificate Guide</a></div>
                            <div>• <a href="https://docs.netlify.com/routing/redirects/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">URL Redirects</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ DNS Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://www.whatsmydns.net/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">DNS Propagation Checker</a></div>
                            <div>• <a href="https://mxtoolbox.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">DNS Lookup Tools</a></div>
                            <div>• <a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">SSL Certificate Tester</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Corporate Success: Enterprise Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Enterprise company needed professional domain setup 
                            with multi-region SSL and compliance-grade security for public-facing applications.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Domain Configuration Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>99.99% SSL uptime:</strong> Automatic certificate renewal</div>
                            <div>• <strong>Global DNS propagation:</strong> Sub-60-second updates</div>
                            <div>• <strong>Security compliance:</strong> HSTS and security headers</div>
                            <div>• <strong>Multi-domain support:</strong> 20+ branded domains</div>
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
              title: 'Create Your Vercel Account',
              description: 'Set up your free Vercel account in minutes',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        ⚡ Welcome to Vercel - The Fastest Way to Deploy!
                      </h4>
                      <p className="mb-4 text-base">
                        Vercel is like the sports car of website deployment - it's super fast, easy to use, 
                        and makes your websites lightning quick! Think of it as your website's best friend 
                        that helps it run faster than any other hosting platform.
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">🚀 Why People Love Vercel</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Super Fast:</strong> Your website loads in milliseconds</li>
                            <li>• <strong>Easy Setup:</strong> Deploy in just 3 clicks</li>
                            <li>• <strong>Always Free:</strong> Great free tier for learning</li>
                            <li>• <strong>Global Speed:</strong> Fast everywhere in the world</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>GitHub Magic:</strong> Connects to your code automatically</li>
                            <li>• <strong>Preview Links:</strong> Share your work before going live</li>
                            <li>• <strong>Zero Config:</strong> Knows how to build your project</li>
                            <li>• <strong>Professional URLs:</strong> Get custom domains easily</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">📋 Step-by-Step Account Creation</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Visit Vercel.com</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Go to <a href="https://vercel.com" target="_blank" rel="noopener" className="text-blue-500 hover:underline">vercel.com</a> in your web browser. 
                                You'll see a clean, modern website that looks super professional.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Click "Sign Up"</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Look for the "Sign Up" button (usually in the top right corner). 
                                It's like knocking on the door to join the cool kids' club!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Choose GitHub Login</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click "Continue with GitHub" - this is the easiest way! 
                                It connects your code repository directly to Vercel automatically.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Authorize Vercel</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                GitHub will ask if you want to give Vercel permission to see your repositories. 
                                Click "Authorize" - it's like giving your friend the key to your house.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💡 Pro Tip for Beginners</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Don't worry about the different plan options when signing up. The free "Hobby" plan 
                          is perfect for learning and personal projects. You can always upgrade later when you're 
                          building the next big thing!
                        </p>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">✅ You'll Know It Worked When:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• You see the Vercel dashboard with a "New Project" button</li>
                          <li>• Your GitHub repositories are visible in the import list</li>
                          <li>• You get a welcome email from Vercel</li>
                          <li>• You feel excited about deploying your first project!</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: Tom's First Deploy</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Tom's Journey:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Tom was intimidated by deployment and avoided it for months. He heard about Vercel 
                            from a friend and decided to try it. He couldn't believe how simple it was!
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Amazing Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>5 minutes:</strong> Total time from signup to first deployment</div>
                            <div>• <strong>Zero configuration:</strong> Vercel figured everything out automatically</div>
                            <div>• <strong>Lightning fast:</strong> His React app loaded in under 1 second</div>
                            <div>• <strong>Confidence boost:</strong> Now deploys every project to share with friends</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vercel-step-2',
              title: 'Import Your Project',
              description: 'Connect your GitHub repository to Vercel',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        📂 Import Your Project (The Magic Moment!)
                      </h4>
                      <p className="mb-4 text-base">
                        This is where the magic happens! You're going to connect your code from GitHub 
                        to Vercel. It's like introducing your two best friends to each other - they're 
                        going to work together perfectly!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Import Steps (Super Easy!)</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Click "New Project"</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In your Vercel dashboard, look for the big "New Project" button. 
                                It's usually right in the center - you can't miss it!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Choose Your Repository</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                You'll see a list of all your GitHub repositories. Find your project 
                                and click "Import" next to it. It's like picking your favorite book from a library!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Vercel Auto-Detects Everything</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Here's the amazing part - Vercel is so smart it figures out what type of 
                                project you have and sets up everything automatically!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ What Vercel Detects</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• <strong>React Apps:</strong> Automatically configures build</li>
                            <li>• <strong>Next.js:</strong> Perfect optimization</li>
                            <li>• <strong>Vue.js:</strong> Instant deployment</li>
                            <li>• <strong>Static Sites:</strong> HTML/CSS/JS</li>
                            <li>• <strong>Build Commands:</strong> Knows what to run</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">⚡ Deploy Settings</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• <strong>Build Command:</strong> Usually auto-detected</li>
                            <li>• <strong>Output Directory:</strong> Where your files go</li>
                            <li>• <strong>Install Command:</strong> How to install dependencies</li>
                            <li>• <strong>Environment:</strong> Development settings</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">🎯 Click "Deploy" and Watch the Magic!</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          After Vercel detects your project type, just click the "Deploy" button and 
                          watch as your website comes to life on the internet in about 30 seconds!
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Lightning Deploy: React Portfolio</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Maria's Experience:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Maria spent weeks trying to deploy her React portfolio on other platforms 
                            with confusing build settings. Then she tried Vercel...
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Mind-Blowing Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>3 clicks:</strong> Import, detect, deploy - that's it!</div>
                            <div>• <strong>30 seconds:</strong> From code to live website</div>
                            <div>• <strong>Perfect build:</strong> Vercel configured everything correctly</div>
                            <div>• <strong>Professional URL:</strong> Got a clean .vercel.app domain</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vercel-step-3',
              title: 'Configure Build Settings',
              description: 'Customize build and deployment settings',
              estimated_time: '10 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🔧 Build Settings (Fine-Tuning Your Deploy)
                      </h4>
                      <p className="mb-4 text-base">
                        Sometimes you need to tell Vercel exactly how to build your project. 
                        It's like giving someone directions to your house - most of the time 
                        GPS works perfectly, but sometimes you need to be more specific!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 When to Customize Settings</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Usually Auto-Works:</h6>
                            <ul className="text-sm space-y-1">
                              <li>• Create React App projects</li>
                              <li>• Next.js applications</li>
                              <li>• Vue.js projects</li>
                              <li>• Static HTML/CSS sites</li>
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Might Need Tweaking:</h6>
                            <ul className="text-sm space-y-1">
                              <li>• Custom webpack configs</li>
                              <li>• Monorepo projects</li>
                              <li>• Special build scripts</li>
                              <li>• Environment variables needed</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">⚙️ Common Build Settings</h6>
                        <div className="text-sm space-y-2">
                          <div><strong>Build Command:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm run build</code></div>
                          <div><strong>Output Directory:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">build</code> or <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">dist</code></div>
                          <div><strong>Install Command:</strong> <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npm install</code></div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💡 Pro Tip</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          If your first deploy fails, don't panic! Check the build logs in Vercel - 
                          they'll tell you exactly what went wrong and how to fix it.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vercel-step-4',
              title: 'Environment Variables',
              description: 'Set up secure environment variables',
              estimated_time: '8 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🔒 Environment Variables (Your App's Secrets)
                      </h4>
                      <p className="mb-4 text-base">
                        Environment variables are like secret codes your app needs to work properly. 
                        Think of them as your app's private diary - API keys, database passwords, 
                        and other sensitive information that shouldn't be visible in your code!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">🔧 How to Add Environment Variables</h5>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <p className="text-sm">Go to your project in Vercel dashboard → Settings → Environment Variables</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <p className="text-sm">Click "Add" and enter your variable name and value</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <p className="text-sm">Choose which environments need this variable (Production, Preview, Development)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ Common Environment Variables</h6>
                        <div className="text-sm space-y-1">
                          <div>• <strong>NEXT_PUBLIC_API_URL:</strong> Your API endpoint</div>
                          <div>• <strong>DATABASE_URL:</strong> Database connection</div>
                          <div>• <strong>STRIPE_SECRET_KEY:</strong> Payment processing</div>
                          <div>• <strong>GOOGLE_ANALYTICS_ID:</strong> Analytics tracking</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vercel-step-5',
              title: 'Custom Domain Setup',
              description: 'Configure your custom domain',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🌐 Custom Domain (Your Professional Address)
                      </h4>
                      <p className="mb-4 text-base">
                        Instead of yoursite.vercel.app, you can use your own custom domain like yoursite.com! 
                        It's like moving from a shared apartment to your own house with your name on the mailbox.
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Domain Setup Steps</h5>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <p className="text-sm">Buy a domain from registrars like Namecheap, GoDaddy, or Google Domains</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <p className="text-sm">In Vercel: Project Settings → Domains → Add your domain</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <p className="text-sm">Update your domain's DNS settings to point to Vercel</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🚀 Automatic HTTPS</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Vercel automatically provides SSL certificates for all domains, 
                          making your site secure with HTTPS - no extra work needed!
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
          id: 'vercel-advanced',
          title: '🚀 Advanced Features',
          description: 'Master Vercel\'s powerful features',
          steps: [
            {
              id: 'vercel-step-6',
              title: 'Preview Deployments',
              description: 'Share your work before going live',
              estimated_time: '12 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        👀 Preview Deployments (Show Your Work!)
                      </h4>
                      <p className="mb-4 text-base">
                        Preview deployments are like having a secret backstage area where you can show 
                        your changes to friends before the main show. Every time you push to a branch, 
                        Vercel creates a unique URL so people can see your work in progress!
                      </p>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">✨ How Preview Magic Works</h5>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create a new branch</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Make changes in a new branch like "feature/new-homepage"
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Push your changes</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Push to GitHub - Vercel automatically detects the new branch
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Get your preview URL</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Vercel creates a unique URL like "yourproject-git-feature-username.vercel.app"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🎯 Perfect for:</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Getting feedback from friends</li>
                            <li>• Testing new features</li>
                            <li>• Client reviews</li>
                            <li>• Bug testing</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">💡 Pro Tips:</h6>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <li>• Every branch gets its own URL</li>
                            <li>• URLs stay live until branch is deleted</li>
                            <li>• Share links in pull requests</li>
                            <li>• Password protect sensitive previews</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Team Success: Design Review</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">The Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Alex's team needed to review design changes before going live, 
                            but setting up staging environments was complicated and slow.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">The Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Instant previews:</strong> Every design change got its own URL</div>
                            <div>• <strong>Easy sharing:</strong> Designers could share links immediately</div>
                            <div>• <strong>Fast feedback:</strong> Team could comment and approve quickly</div>
                            <div>• <strong>Risk-free testing:</strong> Never broke the live site</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vercel-step-7',
              title: 'Performance & Analytics',
              description: 'Monitor and optimize your site',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        📊 Performance & Analytics (Make It Lightning Fast!)
                      </h4>
                      <p className="mb-4 text-base">
                        Vercel doesn't just deploy your site - it makes it super fast and shows you 
                        exactly how well it's performing. It's like having a personal trainer for 
                        your website that helps it run faster and better!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">⚡ Built-in Performance Features</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">Automatic Optimizations:</h6>
                            <ul className="text-sm space-y-1">
                              <li>• <strong>Image optimization:</strong> Compresses images automatically</li>
                              <li>• <strong>Global CDN:</strong> Serves content from closest location</li>
                              <li>• <strong>Smart caching:</strong> Remembers frequently accessed files</li>
                              <li>• <strong>Code splitting:</strong> Only loads what's needed</li>
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">Analytics Dashboard:</h6>
                            <ul className="text-sm space-y-1">
                              <li>• <strong>Page views:</strong> See which pages are popular</li>
                              <li>• <strong>Load times:</strong> Monitor site speed</li>
                              <li>• <strong>Geographic data:</strong> Where visitors come from</li>
                              <li>• <strong>Core Web Vitals:</strong> Google's performance metrics</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg mb-4">
                        <h6 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 How to Access Analytics</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                            <span>Go to your project in Vercel dashboard</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                            <span>Click on the "Analytics" tab</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                            <span>Explore real-time and historical data</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💡 Performance Tips</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Use Vercel's Image component for automatic optimization</li>
                          <li>• Enable compression in your build settings</li>
                          <li>• Monitor Core Web Vitals regularly</li>
                          <li>• Set up alerts for performance regressions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Speed Success: E-commerce Store</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Before Vercel:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Jenny's online store was slow, taking 4-5 seconds to load. 
                            Customers were leaving before seeing her products, hurting sales.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">After Vercel:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>0.8 second load time:</strong> 5x faster than before</div>
                            <div>• <strong>40% more sales:</strong> Customers stayed and bought more</div>
                            <div>• <strong>Global reach:</strong> Fast loading worldwide</div>
                            <div>• <strong>Happy customers:</strong> No more frustrated shoppers</div>
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
              title: 'Create Your AWS Account',
              description: 'Set up your Amazon Web Services account',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        ☁️ Welcome to AWS - The Giant of Cloud Computing!
                      </h4>
                      <p className="mb-4 text-base">
                        AWS (Amazon Web Services) is like the biggest, most powerful toolbox in the world! 
                        It's what Netflix, Instagram, and millions of websites use. Think of it as renting 
                        space in Amazon's super-computers around the world to run your website.
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">🚀 Why AWS is Amazing</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Globally Trusted:</strong> Used by Netflix, NASA, and millions more</li>
                            <li>• <strong>Super Reliable:</strong> 99.9% uptime guarantee</li>
                            <li>• <strong>Free Tier:</strong> 12 months of free hosting to learn</li>
                            <li>• <strong>Scales Automatically:</strong> Handles millions of visitors</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Lightning Fast:</strong> Servers in 190+ countries</li>
                            <li>• <strong>Enterprise Level:</strong> Bank-grade security</li>
                            <li>• <strong>Pay-as-you-go:</strong> Only pay for what you use</li>
                            <li>• <strong>Learn Anywhere:</strong> Skills wanted by every company</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">📋 Account Setup Steps</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Visit aws.amazon.com</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Go to the AWS website and click "Create an AWS Account". 
                                It's like signing up for the most powerful website hosting in the world!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Choose "Personal" Account</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Select "Personal" unless you're setting up for a company. 
                                Enter your email, password, and account name.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Add Credit Card (Don't Worry!)</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                AWS needs a card for verification, but you won't be charged with the free tier. 
                                It's like a library card - they just need to know you're real!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Phone Verification</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                They'll call or text you a code to verify your identity. 
                                This keeps your account super secure!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💰 Free Tier Benefits (12 Months!)</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>S3 Storage:</strong> 5GB of free website storage</li>
                          <li>• <strong>CloudFront:</strong> 50GB of free global delivery</li>
                          <li>• <strong>Lambda:</strong> 1 million free function requests</li>
                          <li>• <strong>EC2:</strong> 750 hours of free server time monthly</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">✅ You'll Know It Worked When:</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• You see the AWS Management Console dashboard</li>
                          <li>• You can click on different services like S3, CloudFront</li>
                          <li>• You get a welcome email from AWS</li>
                          <li>• You feel ready to host websites like the big companies!</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Career Success: Cloud Journey</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Lisa's Story:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Lisa learned AWS to host her portfolio. Companies were so impressed 
                            that she landed a cloud developer job with a 40% salary increase!
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Career Impact:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>High-demand skill:</strong> AWS certified professionals earn $130k+ average</div>
                            <div>• <strong>Industry standard:</strong> Used by 90% of Fortune 500 companies</div>
                            <div>• <strong>Future-proof:</strong> Cloud computing growing 20% yearly</div>
                            <div>• <strong>Global opportunities:</strong> AWS skills valued worldwide</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-2',
              title: 'IAM Security Setup',
              description: 'Configure secure access permissions',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🔐 IAM - Your AWS Security Guard
                      </h4>
                      <p className="mb-4 text-base">
                        IAM (Identity and Access Management) is like having a security guard for your AWS account. 
                        It controls who can access what, keeping your website and data safe from bad actors. 
                        Think of it as the key system for your digital house!
                      </p>

                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-red-700 dark:text-red-300">🚨 Why IAM is Critical</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Prevent Hackers:</strong> Stop unauthorized access</li>
                            <li>• <strong>Control Permissions:</strong> Only give needed access</li>
                            <li>• <strong>Multiple Users:</strong> Let team members help safely</li>
                            <li>• <strong>Audit Trail:</strong> See who did what and when</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>API Security:</strong> Secure programmatic access</li>
                            <li>• <strong>Cost Control:</strong> Prevent accidental expensive operations</li>
                            <li>• <strong>Compliance:</strong> Meet security requirements</li>
                            <li>• <strong>Best Practice:</strong> Industry standard security</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Essential IAM Setup</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Enable MFA (Multi-Factor Authentication)</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Go to IAM → Your Security Credentials → Assign MFA device. 
                                Use your phone app like Google Authenticator - it's like a second lock on your door!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create IAM User for Development</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Never use your root account for daily work! Create a new user with only 
                                the permissions you need - like giving someone a house key instead of ownership papers.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Set Up Access Keys</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Create access keys for your development user. These are like special passwords 
                                that let your code talk to AWS services securely.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">⚠️ Security Best Practices</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Principle of Least Privilege:</strong> Only give minimum needed permissions</li>
                          <li>• <strong>Regular Review:</strong> Check permissions monthly</li>
                          <li>• <strong>Strong Passwords:</strong> Use unique, complex passwords</li>
                          <li>• <strong>Monitor Activity:</strong> Review AWS CloudTrail logs</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">✅ Quick Security Checklist</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• ✓ Root account has MFA enabled</li>
                          <li>• ✓ IAM user created for daily use</li>
                          <li>• ✓ Access keys generated and stored securely</li>
                          <li>• ✓ Unnecessary permissions removed</li>
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
          id: 'aws-s3-deployment',
          title: '📦 S3 Static Hosting',
          description: 'Deploy static sites using Amazon S3',
          steps: [
            {
              id: 'aws-step-3',
              title: 'S3 Bucket - Your Website Home',
              description: 'Create your website storage space',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🪣 S3 - Your Website's Storage Container
                      </h4>
                      <p className="mb-4 text-base">
                        S3 (Simple Storage Service) is like a magical storage container for your website files. 
                        It can hold your HTML, CSS, JavaScript, images, and serve them to visitors worldwide. 
                        Think of it as renting a super-reliable storage unit that never goes offline!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Create Your S3 Bucket</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Go to S3 Service</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In AWS Console, search for "S3" and click on it. 
                                You'll see the storage dashboard - like opening your digital warehouse!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create Bucket</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click "Create bucket". Choose a unique name like "my-awesome-website-2024". 
                                Names must be unique worldwide - like domain names!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Enable Static Website Hosting</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In bucket Properties → Static website hosting → Enable. 
                                Set index.html as your homepage - this tells S3 what file to show first!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Upload Your Website Files</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Drag and drop your website files into the bucket. 
                                S3 stores them safely and makes them available to the world!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🎯 S3 Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>99.999999999% Durability:</strong> Your files are safer than bank vaults</li>
                          <li>• <strong>Unlimited Storage:</strong> No space limits, pay for what you use</li>
                          <li>• <strong>Instant Scaling:</strong> Handles millions of visitors automatically</li>
                          <li>• <strong>Cost Effective:</strong> Pennies per GB, even cheaper for static sites</li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">⚡ Pro Tips</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Use versioning to keep backup copies of your files</li>
                          <li>• Enable server access logging to see who visits your site</li>
                          <li>• Set up lifecycle rules to optimize costs automatically</li>
                          <li>• Use CloudWatch to monitor your bucket usage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'aws-step-4',
              title: 'CloudFront - Global Speed Boost',
              description: 'Make your site lightning fast worldwide',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🌍 CloudFront - Your Global Speed Network
                      </h4>
                      <p className="mb-4 text-base">
                        CloudFront is like having copies of your website in 200+ locations worldwide! 
                        When someone visits your site, they get it from the closest location, making it 
                        load super fast. It's like having a pizza shop on every corner instead of just one!
                      </p>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-orange-700 dark:text-orange-300">🚀 Why CloudFront is Amazing</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Lightning Speed:</strong> 50ms response times globally</li>
                            <li>• <strong>200+ Locations:</strong> Edge servers worldwide</li>
                            <li>• <strong>DDoS Protection:</strong> Built-in security shield</li>
                            <li>• <strong>SSL/HTTPS:</strong> Free security certificates</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Smart Caching:</strong> Remembers popular content</li>
                            <li>• <strong>Compression:</strong> Makes files smaller automatically</li>
                            <li>• <strong>Custom Domains:</strong> Use your own domain name</li>
                            <li>• <strong>Real-time Metrics:</strong> See performance data</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 CloudFront Setup</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Open CloudFront Console</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Search for "CloudFront" in AWS Console. 
                                This is your control center for global content delivery!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create Distribution</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click "Create Distribution" and select your S3 bucket as the origin. 
                                This connects CloudFront to your website storage.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Configure Settings</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Enable compression, set default root object to index.html, 
                                and choose "Redirect HTTP to HTTPS" for security.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Deploy & Test</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Wait 15-20 minutes for deployment, then test your CloudFront URL. 
                                Your site is now globally optimized!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🎯 Performance Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>90% faster loading:</strong> Compared to single-server hosting</li>
                          <li>• <strong>Global reach:</strong> Fast everywhere in the world</li>
                          <li>• <strong>Bandwidth savings:</strong> Up to 60% less data transfer</li>
                          <li>• <strong>Better SEO:</strong> Google loves fast websites</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Global Success: Travel Blog</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">The Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Marcus's travel blog was slow for international visitors. 
                            People in Asia waited 8+ seconds for his photos to load, hurting engagement.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">CloudFront Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>2-second loading:</strong> Worldwide, regardless of location</div>
                            <div>• <strong>300% more engagement:</strong> Visitors stayed and explored</div>
                            <div>• <strong>50% lower costs:</strong> Reduced bandwidth usage</div>
                            <div>• <strong>Global audience:</strong> Followers from 50+ countries</div>
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
              title: 'Create Google Cloud Project',
              description: 'Set up your Google Cloud Platform account',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🏗️ Google Cloud - Build Like Google!
                      </h4>
                      <p className="mb-4 text-base">
                        Google Cloud Platform (GCP) is the same infrastructure that powers Google Search, 
                        YouTube, and Gmail! It's like getting access to Google's super-computers to host 
                        your website. Think of it as borrowing Google's massive, lightning-fast servers!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">🚀 Why Choose Google Cloud</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Google's Network:</strong> Same speed as Google Search</li>
                            <li>• <strong>$300 Free Credit:</strong> 3 months of free everything</li>
                            <li>• <strong>AI-Powered:</strong> Built-in machine learning tools</li>
                            <li>• <strong>Green Computing:</strong> 100% renewable energy</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Always Free Tier:</strong> Never expires for basic usage</li>
                            <li>• <strong>Security First:</strong> Google-grade protection</li>
                            <li>• <strong>Global Reach:</strong> Servers in 35+ regions</li>
                            <li>• <strong>Developer Friendly:</strong> Easy-to-use tools</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">📋 Project Setup Steps</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Visit cloud.google.com</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Go to Google Cloud Console and click "Get started for free". 
                                You'll get $300 in free credits to experiment with!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create New Project</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click "Create Project" and give it a name like "my-website-project". 
                                Projects help organize all your Google Cloud resources together.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Enable Billing (Free Credits)</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Add a payment method to activate your $300 free credits. 
                                Don't worry - you won't be charged until you use up the free amount!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Enable APIs</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Go to "APIs & Services" and enable App Engine API and Cloud Storage API. 
                                These give your project superpowers for hosting websites!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💰 Free Tier Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>App Engine:</strong> 28 hours/day of free server time</li>
                          <li>• <strong>Cloud Storage:</strong> 5GB free storage monthly</li>
                          <li>• <strong>Cloud Functions:</strong> 2 million free executions/month</li>
                          <li>• <strong>Firestore:</strong> 1GB free database storage</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">✅ Success Indicators</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• You see the Cloud Console dashboard</li>
                          <li>• Your project appears in the project selector</li>
                          <li>• Billing is active with $300 credits</li>
                          <li>• Required APIs are enabled and ready</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'gcp-step-2',
              title: 'Install Cloud SDK',
              description: 'Set up command-line tools',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🛠️ Cloud SDK - Your Command Center
                      </h4>
                      <p className="mb-4 text-base">
                        The Google Cloud SDK is like having a remote control for Google's servers! 
                        It lets you deploy websites, manage databases, and control everything from your 
                        computer's command line. Think of it as your direct hotline to Google Cloud!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 SDK Installation</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Download Cloud SDK</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Visit cloud.google.com/sdk and download for your operating system. 
                                It's like installing Google Cloud's control panel on your computer!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Run Installation</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Follow the installer steps. It will add 'gcloud' command to your terminal - 
                                your new superpower for cloud deployment!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Login to Your Account</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Run <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">gcloud auth login</code> and select your project. 
                                This connects your computer to your Google Cloud account securely.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">⚡ Essential Commands</h6>
                        <div className="text-sm space-y-2">
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">gcloud app deploy</code> - Deploy your website</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">gcloud app browse</code> - Open your live site</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">gcloud projects list</code> - See all your projects</div>
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
          id: 'gcp-deployment',
          title: '🚀 App Engine Deployment',
          description: 'Deploy using Google App Engine',
          steps: [
            {
              id: 'gcp-step-3',
              title: 'Deploy with App Engine',
              description: 'Launch your website on Google\'s infrastructure',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🚀 App Engine - Google's Magic Hosting
                      </h4>
                      <p className="mb-4 text-base">
                        App Engine is Google's "just upload and go" hosting service! You don't need to 
                        manage servers, security, or scaling - Google handles everything automatically. 
                        It's like having Google's entire engineering team maintaining your website!
                      </p>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Simple Deployment Process</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create app.yaml</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Create a simple config file in your project root. For static sites, just add: 
                                <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">runtime: python39</code>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Run gcloud app deploy</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In your project folder, run this command. Google will automatically 
                                detect your project type and deploy it perfectly!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Get Your Live URL</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Your site gets a URL like yourproject.appspot.com - and it's instantly 
                                available worldwide on Google's network!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🌟 App Engine Superpowers</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Auto-scaling:</strong> Handles traffic spikes automatically</li>
                          <li>• <strong>Zero maintenance:</strong> Google manages all infrastructure</li>
                          <li>• <strong>Global CDN:</strong> Fast loading worldwide</li>
                          <li>• <strong>SSL/HTTPS:</strong> Automatic security certificates</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">💡 Perfect For</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Beginners who want simplicity</li>
                          <li>• Apps that need automatic scaling</li>
                          <li>• Projects requiring high reliability</li>
                          <li>• Developers who prefer zero server management</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Startup Success: Food Delivery App</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">The Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Sarah's food delivery startup went viral overnight. Her server crashed 
                            under the traffic load, losing thousands of potential customers.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">App Engine Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Auto-scaled to 10,000+ users:</strong> No downtime during viral growth</div>
                            <div>• <strong>Zero server management:</strong> Focused on business, not infrastructure</div>
                            <div>• <strong>Global availability:</strong> Fast ordering from any location</div>
                            <div>• <strong>$50M funding round:</strong> Investors loved the scalable architecture</div>
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
              title: 'Create Azure Account',
              description: 'Set up Microsoft Azure for deployment',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        ☁️ Azure - Microsoft's Cloud Empire!
                      </h4>
                      <p className="mb-4 text-base">
                        Microsoft Azure is the cloud platform that powers Xbox Live, Office 365, and 
                        millions of enterprise applications! It's like renting space in Microsoft's 
                        data centers around the world - incredibly powerful and enterprise-ready!
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">🚀 Why Azure is Amazing</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Enterprise Grade:</strong> Used by 95% of Fortune 500</li>
                            <li>• <strong>$200 Free Credit:</strong> 30 days of free exploration</li>
                            <li>• <strong>GitHub Integration:</strong> Perfect for developers</li>
                            <li>• <strong>Global Network:</strong> 60+ regions worldwide</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Always Free Services:</strong> Never expires</li>
                            <li>• <strong>AI & ML Built-in:</strong> Cognitive services included</li>
                            <li>• <strong>Hybrid Cloud:</strong> Seamless on-premise integration</li>
                            <li>• <strong>Developer Tools:</strong> Visual Studio integration</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">📋 Quick Account Setup</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Visit azure.microsoft.com</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Click "Start free" to begin your Azure journey. You'll get $200 in credits 
                                and access to free services for 12 months!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Sign Up with Microsoft Account</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Use your existing Microsoft account or create a new one. 
                                This gives you access to the entire Microsoft ecosystem!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Complete Verification</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Add phone number and credit card for verification. 
                                No charges until you exceed free tier limits!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💰 Free Tier Highlights</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Static Web Apps:</strong> Free hosting with custom domains</li>
                          <li>• <strong>App Service:</strong> 10 web apps with custom SSL</li>
                          <li>• <strong>Storage:</strong> 5GB blob storage</li>
                          <li>• <strong>Database:</strong> 250GB SQL database</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">✅ You're Ready When</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Azure Portal dashboard is accessible</li>
                          <li>• Subscription shows $200 credit balance</li>
                          <li>• Resource groups can be created</li>
                          <li>• Ready to deploy professional applications!</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'azure-step-2',
              title: 'Create Resource Group',
              description: 'Organize your Azure resources',
              estimated_time: '10 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        📁 Resource Groups - Your Azure Organizer
                      </h4>
                      <p className="mb-4 text-base">
                        Resource Groups are like folders that keep all your website stuff organized! 
                        They group related resources together so you can manage, monitor, and 
                        bill them as one unit. Think of it as your project's storage box!
                      </p>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">📋 Quick Creation Steps</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Go to Resource Groups</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In Azure Portal, click "Resource groups" from the left menu or search for it. 
                                This is your organizational command center!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Click "Create"</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Give it a clear name like "my-website-resources" and choose a region 
                                close to your users for best performance.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Review and Create</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Review your settings and click "Create". Your resource group 
                                is ready to hold all your website components!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">💡 Why Resource Groups Rock</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Easy Management:</strong> Control everything in one place</li>
                          <li>• <strong>Cost Tracking:</strong> See exactly what each project costs</li>
                          <li>• <strong>Access Control:</strong> Set permissions for the whole group</li>
                          <li>• <strong>Easy Cleanup:</strong> Delete the group to remove everything</li>
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
          id: 'azure-deployment',
          title: '🌐 Static Web Apps',
          description: 'Deploy using Azure Static Web Apps',
          steps: [
            {
              id: 'azure-step-3',
              title: 'Deploy Static Web App',
              description: 'Launch your site with Azure Static Web Apps',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🌐 Static Web Apps - Azure's Modern Hosting
                      </h4>
                      <p className="mb-4 text-base">
                        Azure Static Web Apps is Microsoft's answer to modern web hosting! 
                        It automatically builds from GitHub, gives you a global CDN, custom domains, 
                        and even serverless APIs. It's like having a full web development team!
                      </p>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">🚀 Simple Deployment Process</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create Static Web App</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In Azure Portal, search for "Static Web Apps" and click "Create". 
                                Choose your resource group and give your app a name.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Connect GitHub Repository</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Link your GitHub repository. Azure will automatically detect your 
                                framework (React, Vue, Angular) and configure everything!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Automatic Deployment</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Azure creates a GitHub Action workflow automatically. 
                                Every commit triggers a new deployment - it's magic!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🌟 Amazing Features</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Global CDN:</strong> Lightning-fast loading worldwide</li>
                          <li>• <strong>Custom Domains:</strong> Free SSL certificates included</li>
                          <li>• <strong>Serverless APIs:</strong> Backend functions built-in</li>
                          <li>• <strong>Authentication:</strong> Social login ready</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🎯 Perfect For</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• React, Vue, Angular, and Svelte apps</li>
                          <li>• Jamstack sites with APIs</li>
                          <li>• Portfolio and business websites</li>
                          <li>• E-commerce with serverless checkout</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: SaaS Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">The Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Jake's SaaS startup needed reliable hosting with automatic deployments, 
                            but traditional servers were complex and expensive to scale.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Static Web Apps Result:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Zero-config deployment:</strong> Connected GitHub in 5 minutes</div>
                            <div>• <strong>Global performance:</strong> 90% faster loading worldwide</div>
                            <div>• <strong>95% cost reduction:</strong> From $500/month to $25/month</div>
                            <div>• <strong>$2M Series A:</strong> Investors loved the scalable architecture</div>
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
              title: 'Install Docker Desktop',
              description: 'Set up containerization on your machine',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🐳 Docker - Ship Your Apps Anywhere!
                      </h4>
                      <p className="mb-4 text-base">
                        Docker is like a magic shipping container for your applications! It packages 
                        your app with everything it needs to run, so it works exactly the same on 
                        your laptop, your server, or anywhere in the cloud. No more "it works on my machine!"
                      </p>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">🚀 Why Docker is Revolutionary</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Consistency:</strong> Same environment everywhere</li>
                            <li>• <strong>Isolation:</strong> Apps don't interfere with each other</li>
                            <li>• <strong>Portability:</strong> Run anywhere Docker is installed</li>
                            <li>• <strong>Efficiency:</strong> Lighter than virtual machines</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Scalability:</strong> Easy to replicate and scale</li>
                            <li>• <strong>Version Control:</strong> Track changes to your environment</li>
                            <li>• <strong>Microservices:</strong> Perfect for modern architectures</li>
                            <li>• <strong>DevOps Ready:</strong> Integrates with all CI/CD tools</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">📋 Simple Installation</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Download Docker Desktop</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Visit docker.com and download Docker Desktop for your operating system. 
                                It includes everything you need to start containerizing!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Install and Start</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Run the installer and start Docker Desktop. You'll see the Docker whale 
                                icon in your system tray when it's ready!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Test Installation</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Open terminal and run <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker --version</code>. 
                                If you see a version number, you're ready to containerize!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">💡 Pro Tip</h6>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Docker Desktop includes Docker Compose, which lets you run multi-container 
                          applications with a single command. Perfect for full-stack development!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'docker-step-2',
              title: 'Create Your Dockerfile',
              description: 'Package your app in a container',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📝 Dockerfile - Your App's Recipe
                      </h4>
                      <p className="mb-4 text-base">
                        A Dockerfile is like a recipe that tells Docker how to build your app container! 
                        It lists all the ingredients (dependencies) and steps (commands) needed to 
                        recreate your app environment perfectly every time.
                      </p>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Basic Dockerfile Structure</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Choose Base Image</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Start with <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">FROM node:18-alpine</code> for Node.js apps. 
                                Alpine images are super small and secure!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Set Working Directory</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Use <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">WORKDIR /app</code> to set where your app lives inside the container. 
                                This keeps everything organized!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Install Dependencies</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Copy package.json first, then run <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">RUN npm install</code>. 
                                This uses Docker's layer caching for faster builds!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Copy App & Expose Port</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Copy your source code and use <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">EXPOSE 3000</code> to tell Docker 
                                which port your app uses.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">💡 Best Practices</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Use .dockerignore:</strong> Exclude node_modules and .git</li>
                          <li>• <strong>Multi-stage builds:</strong> Smaller production images</li>
                          <li>• <strong>Non-root user:</strong> Run apps as non-privileged user</li>
                          <li>• <strong>Health checks:</strong> Monitor container health</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🔥 Quick Commands</h6>
                        <div className="text-sm space-y-2">
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker build -t myapp .</code> - Build your image</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker run -p 3000:3000 myapp</code> - Run your container</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker images</code> - List all images</div>
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
          id: 'docker-deployment',
          title: '🚢 Container Deployment',
          description: 'Build and deploy Docker containers',
          steps: [
            {
              id: 'docker-step-3',
              title: 'Build & Test Your Image',
              description: 'Create and test your Docker container',
              estimated_time: '15 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🔨 Build Your Container
                      </h4>
                      <p className="mb-4 text-base">
                        Building a Docker image is like baking a cake from your recipe! Docker reads 
                        your Dockerfile and creates a ready-to-run container with everything your app needs. 
                        Once built, you can run it anywhere Docker is installed!
                      </p>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">🚀 Build Process</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Build Your Image</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Run <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker build -t my-awesome-app .</code> 
                                Watch Docker follow your recipe step by step!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Test Locally</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Run <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker run -p 3000:3000 my-awesome-app</code> 
                                Visit localhost:3000 to see your containerized app!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Debug Issues</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Use <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker logs container-name</code> to see what's happening. 
                                Docker shows you exactly what went wrong!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">⚡ Useful Commands</h6>
                        <div className="text-sm space-y-2">
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker ps</code> - See running containers</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker stop container-id</code> - Stop a container</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker exec -it container-id bash</code> - Enter container shell</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'docker-step-4',
              title: 'Push to Registry',
              description: 'Share your container with the world',
              estimated_time: '20 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        📦 Container Registry - Your App Store
                      </h4>
                      <p className="mb-4 text-base">
                        Container registries are like app stores for Docker images! You upload your 
                        container once, and then deploy it anywhere - your server, the cloud, or 
                        your team's machines. It's version control for entire applications!
                      </p>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-orange-700 dark:text-orange-300">🌟 Popular Registries</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Docker Hub:</strong> Free public images</li>
                            <li>• <strong>GitHub Registry:</strong> Integrated with GitHub</li>
                            <li>• <strong>AWS ECR:</strong> Amazon's container registry</li>
                            <li>• <strong>Google GCR:</strong> Google Cloud registry</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Azure ACR:</strong> Microsoft's registry</li>
                            <li>• <strong>Red Hat Quay:</strong> Enterprise security</li>
                            <li>• <strong>GitLab Registry:</strong> Built into GitLab</li>
                            <li>• <strong>Private Registries:</strong> Your own server</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-4">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📤 Push Process</h5>
                        <div className="space-y-3">
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker login</code> - Login to your registry</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker tag my-app username/my-app:v1.0</code> - Tag your image</div>
                          <div><code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">docker push username/my-app:v1.0</code> - Upload to registry</div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🎯 Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Team Collaboration:</strong> Share exact environments</li>
                          <li>• <strong>CI/CD Integration:</strong> Automated deployments</li>
                          <li>• <strong>Version Control:</strong> Track all image versions</li>
                          <li>• <strong>Global Distribution:</strong> Deploy anywhere instantly</li>
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
              description: 'Automate your entire workflow',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        ⚡ GitHub Actions - Your Automation Robot
                      </h4>
                      <p className="mb-4 text-base">
                        GitHub Actions is like having a robot that automatically tests, builds, and 
                        deploys your code every time you make changes! It's free for public repos 
                        and turns your GitHub into a complete DevOps platform.
                      </p>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">🚀 Setup Process</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Create .github/workflows folder</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                In your project root, create this folder structure. 
                                This is where your automation magic lives!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Add workflow YAML file</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Create deploy.yml with your automation steps. 
                                GitHub provides templates for every major platform!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Commit and Watch Magic</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Push your changes and watch GitHub automatically 
                                run your workflow in the Actions tab!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🌟 Amazing Features</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Free for Public Repos:</strong> 2000 minutes/month for private</li>
                          <li>• <strong>Matrix Builds:</strong> Test on multiple OS/versions</li>
                          <li>• <strong>Marketplace:</strong> Thousands of pre-built actions</li>
                          <li>• <strong>Secrets Management:</strong> Secure environment variables</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🔥 Common Triggers</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>push:</strong> Run on every commit</li>
                          <li>• <strong>pull_request:</strong> Test before merging</li>
                          <li>• <strong>schedule:</strong> Run on timer (daily builds)</li>
                          <li>• <strong>release:</strong> Deploy when you tag a release</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cicd-step-2',
              title: 'Build & Test Pipeline',
              description: 'Automated quality assurance',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🔧 Build Pipeline - Your Quality Guardian
                      </h4>
                      <p className="mb-4 text-base">
                        A build pipeline automatically tests your code, builds your app, and catches 
                        bugs before they reach users! It's like having a team of expert testers 
                        working 24/7 to keep your code perfect.
                      </p>

                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Essential Pipeline Steps</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Checkout Code</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                uses: actions/checkout@v3 - Downloads your latest code to the runner
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Setup Environment</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Install Node.js, Python, or whatever your app needs - 
                                creates the perfect environment every time!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Install Dependencies</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                npm install, pip install - gets all your project's requirements ready
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Run Tests & Build</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Execute your test suite and build process - 
                                only deploys if everything passes!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">⚡ Pro Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Catch Bugs Early:</strong> Problems found before users see them</li>
                          <li>• <strong>Consistent Builds:</strong> Same result every time</li>
                          <li>• <strong>Team Confidence:</strong> Deploy without fear</li>
                          <li>• <strong>Quality Gates:</strong> Bad code can't get through</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">🎯 Testing Types</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Unit Tests:</strong> Test individual functions</li>
                          <li>• <strong>Integration Tests:</strong> Test component interactions</li>
                          <li>• <strong>E2E Tests:</strong> Test full user workflows</li>
                          <li>• <strong>Linting:</strong> Check code style and quality</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: FinTech Startup</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Before CI/CD:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Manual deployments took 4 hours, bugs reached production, 
                            and the team was afraid to release new features.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">After CI/CD:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>5-minute deployments:</strong> From commit to production</div>
                            <div>• <strong>99.9% uptime:</strong> Automated testing caught all issues</div>
                            <div>• <strong>10x faster releases:</strong> Daily deployments vs monthly</div>
                            <div>• <strong>$5M Series B:</strong> Investors loved the velocity</div>
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
          id: 'cicd-deployment',
          title: '🚀 Deployment Automation',
          description: 'Automate deployment processes',
          steps: [
            {
              id: 'cicd-step-3',
              title: 'Deployment Pipeline',
              description: 'Automate your releases to production',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🚀 Deployment Pipeline - Your Release Highway
                      </h4>
                      <p className="mb-4 text-base">
                        A deployment pipeline is like an assembly line that automatically takes your 
                        tested code and puts it live for users! Once you push code, it gets tested, 
                        built, and deployed to your website automatically. No more manual uploads!
                      </p>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Deployment Strategies</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Direct Deploy:</strong> Push straight to production</li>
                            <li>• <strong>Blue-Green:</strong> Switch between two environments</li>
                            <li>• <strong>Rolling Deploy:</strong> Update servers one by one</li>
                            <li>• <strong>Canary Deploy:</strong> Release to small user group first</li>
                          </ul>
                          <ul className="text-sm space-y-2">
                            <li>• <strong>Feature Flags:</strong> Turn features on/off remotely</li>
                            <li>• <strong>A/B Testing:</strong> Compare different versions</li>
                            <li>• <strong>Staged Rollout:</strong> Gradual release to all users</li>
                            <li>• <strong>Rollback Ready:</strong> Instant revert if problems</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Pipeline Setup Process</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Choose Deployment Target</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Decide where to deploy: Netlify, Vercel, AWS, or your own server. 
                                Each platform has GitHub Actions templates ready to use!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Configure Deployment Secrets</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Add API keys and deployment credentials to GitHub Secrets. 
                                This keeps your passwords safe while allowing automatic deployments!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Add Deploy Step to Workflow</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                After your build step passes, add deployment commands. 
                                Only successful builds get deployed to protect your users!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Setup Monitoring & Alerts</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Monitor deployment health and get notified if something goes wrong. 
                                Know immediately if your site is down or having issues!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🌟 Deployment Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Lightning Fast:</strong> From commit to live in minutes</li>
                          <li>• <strong>Zero Downtime:</strong> Users never see broken deployments</li>
                          <li>• <strong>Automatic Rollback:</strong> Instant revert if problems detected</li>
                          <li>• <strong>Confidence:</strong> Deploy any time without fear</li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">⚡ Pro Tips</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Deploy small changes frequently instead of big updates</li>
                          <li>• Always test deployments in staging environment first</li>
                          <li>• Use deployment approvals for production releases</li>
                          <li>• Keep deployment scripts simple and well-documented</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: E-commerce Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Before Automation:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Emma's online store deployments took 3 hours and required staying up late. 
                            She was afraid to push updates during business hours, slowing feature releases.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">After Deployment Pipeline:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>5-minute deployments:</strong> Multiple releases per day</div>
                            <div>• <strong>Zero failed deployments:</strong> Automated testing caught all issues</div>
                            <div>• <strong>300% faster feature delivery:</strong> Customer satisfaction soared</div>
                            <div>• <strong>200% revenue growth:</strong> Rapid iteration enabled new features</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cicd-step-4',
              title: 'Environment Management',
              description: 'Master staging, testing, and production environments',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🌍 Environment Management - Your Safety Net
                      </h4>
                      <p className="mb-4 text-base">
                        Environment management is like having different practice stages before your 
                        main performance! You test in development, rehearse in staging, and only 
                        then go live in production. This prevents bugs from reaching real users!
                      </p>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">🎭 The Three-Stage Theater</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">DEV</div>
                            <div>
                              <h6 className="font-semibold mb-1 text-green-600 dark:text-green-400">Development Environment</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Your coding playground! Break things, experiment, and build new features. 
                                Connected to test databases and services. Anything goes here!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">STG</div>
                            <div>
                              <h6 className="font-semibold mb-1 text-yellow-600 dark:text-yellow-400">Staging Environment</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Production's twin! Identical setup with real-like data for final testing. 
                                Your last chance to catch bugs before they meet real users.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">PROD</div>
                            <div>
                              <h6 className="font-semibold mb-1 text-red-600 dark:text-red-400">Production Environment</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                The main stage! Where real users interact with your app. 
                                Maximum security, monitoring, and only thoroughly tested code allowed!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <h5 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">⚙️ Environment Configuration</h5>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                              <h6 className="font-semibold mb-1">Environment Variables</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Different API keys, database URLs, and settings for each environment. 
                                Dev uses test data, production uses real customer data!
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                              <h6 className="font-semibold mb-1">Branch Protection Rules</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Require code reviews and passing tests before merging to main branch. 
                                No untested code can reach staging or production!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                            <div>
                              <h6 className="font-semibold mb-1">Deployment Gates</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Automatic promotion from dev → staging → production only after 
                                all tests pass and approvals are granted. Safety first!
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3">
                            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                            <div>
                              <h6 className="font-semibold mb-1">Environment Monitoring</h6>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Different levels of monitoring and alerting. Production gets 24/7 
                                monitoring, while dev environments can be more relaxed.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-green-700 dark:text-green-300">🛡️ Environment Benefits</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Risk Reduction:</strong> Catch bugs before users see them</li>
                          <li>• <strong>Parallel Development:</strong> Multiple features in progress</li>
                          <li>• <strong>Safe Experimentation:</strong> Try new ideas without fear</li>
                          <li>• <strong>Production Confidence:</strong> Know releases will work</li>
                        </ul>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                        <h6 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">🎯 Best Practices</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• Keep environments as similar as possible to production</li>
                          <li>• Use infrastructure as code for consistent setups</li>
                          <li>• Automate environment provisioning and teardown</li>
                          <li>• Regular data refreshes from production to staging</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h6 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">⚡ Advanced Patterns</h6>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          <li>• <strong>Feature Branches:</strong> Temporary environments for each feature</li>
                          <li>• <strong>Preview Deployments:</strong> See changes before merging</li>
                          <li>• <strong>Environment Templates:</strong> Spin up environments on demand</li>
                          <li>• <strong>Environment Versioning:</strong> Track environment changes</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: Banking Application</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Before Environment Management:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            A major bank was pushing changes directly to production, causing 
                            frequent outages and customer complaints. Testing was minimal and risky.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">After Proper Environments:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Zero production outages:</strong> All bugs caught in staging</div>
                            <div>• <strong>50% faster development:</strong> Parallel feature development</div>
                            <div>• <strong>99.99% uptime:</strong> Highest reliability in industry</div>
                            <div>• <strong>Regulatory compliance:</strong> Met all banking standards</div>
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