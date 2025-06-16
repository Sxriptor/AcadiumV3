import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../components/shared/MainContentTabs';
import { 
  Code, 
  Github, 
  Database, 
  Monitor,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
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

interface DevToolPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const VibeCodingLab: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('cursor');
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
    { id: 'cursor', name: 'Cursor', icon: '⚡' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'vscode', name: 'VS Code', icon: '💻' },
    { id: 'lovable', name: 'Lovable', icon: '💖' },
    { id: 'supabase', name: 'Supabase', icon: '🗄️' },
    { id: 'api-tester', name: 'API Tester', icon: '🔧' },
    { id: 'build-monitor', name: 'Build Monitor', icon: '📊' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    cursor: [
      {
        id: 'setup-cursor',
        title: 'Set up Cursor IDE',
        description: 'Download and install the Cursor AI-powered code editor',
        completed: false
      },
      {
        id: 'configure-cursor',
        title: 'Configure Cursor settings',
        description: 'Set up your preferences and AI settings',
        completed: false
      },
      {
        id: 'learn-shortcuts',
        title: 'Learn key shortcuts',
        description: 'Master essential keyboard shortcuts for productivity',
        completed: false
      },
      {
        id: 'use-ai-features',
        title: 'Use AI code features',
        description: 'Learn to use AI code generation and assistance',
        completed: false
      },
      {
        id: 'build-sample-project',
        title: 'Build a sample project',
        description: 'Create a small project to practice Cursor skills',
        completed: false
      },
      {
        id: 'optimize-workflow',
        title: 'Optimize your workflow',
        description: 'Fine-tune your development process with Cursor',
        completed: false
      }
    ],
    github: [
      {
        id: 'setup-github-account',
        title: 'Set up GitHub account',
        description: 'Create and configure your GitHub profile',
        completed: false
      },
      {
        id: 'install-git',
        title: 'Install Git',
        description: 'Set up Git version control on your computer',
        completed: false
      },
      {
        id: 'create-repository',
        title: 'Create a repository',
        description: 'Set up your first GitHub repository',
        completed: false
      },
      {
        id: 'learn-git-commands',
        title: 'Learn Git commands',
        description: 'Master essential Git commands for version control',
        completed: false
      },
      {
        id: 'make-first-commit',
        title: 'Make your first commit',
        description: 'Create and push your first code changes',
        completed: false
      },
      {
        id: 'collaborate-with-others',
        title: 'Collaborate with others',
        description: 'Learn pull requests and code reviews',
        completed: false
      }
    ],
    vscode: [
      {
        id: 'install-vscode',
        title: 'Install VS Code',
        description: 'Download and install Visual Studio Code',
        completed: false
      },
      {
        id: 'setup-extensions',
        title: 'Set up essential extensions',
        description: 'Install and configure useful VS Code extensions',
        completed: false
      },
      {
        id: 'customize-settings',
        title: 'Customize settings',
        description: 'Configure VS Code settings for your workflow',
        completed: false
      },
      {
        id: 'learn-vscode-shortcuts',
        title: 'Learn VS Code shortcuts',
        description: 'Master keyboard shortcuts for productivity',
        completed: false
      },
      {
        id: 'setup-debugging',
        title: 'Set up debugging',
        description: 'Configure debugging for your programming languages',
        completed: false
      },
      {
        id: 'use-integrated-terminal',
        title: 'Use integrated terminal',
        description: 'Learn to use the built-in terminal effectively',
        completed: false
      }
    ],
    supabase: [
      {
        id: 'create-supabase-project',
        title: 'Create Supabase project',
        description: 'Set up your first Supabase project',
        completed: false
      },
      {
        id: 'design-database-schema',
        title: 'Design database schema',
        description: 'Create tables and relationships',
        completed: false
      },
      {
        id: 'setup-authentication',
        title: 'Set up authentication',
        description: 'Configure user authentication and authorization',
        completed: false
      },
      {
        id: 'implement-row-level-security',
        title: 'Implement Row Level Security',
        description: 'Set up RLS policies for data protection',
        completed: false
      },
      {
        id: 'connect-to-frontend',
        title: 'Connect to frontend',
        description: 'Integrate Supabase with your frontend application',
        completed: false
      },
      {
        id: 'deploy-database',
        title: 'Deploy database',
        description: 'Prepare and deploy your database to production',
        completed: false
      }
    ],
    lovable: [
      {
        id: 'setup-lovable-account',
        title: 'Set up Lovable account',
        description: 'Create and configure your Lovable account',
        completed: false
      },
      {
        id: 'create-first-prototype',
        title: 'Create first prototype',
        description: 'Build your first interactive prototype',
        completed: false
      },
      {
        id: 'share-for-feedback',
        title: 'Share for feedback',
        description: 'Get feedback on your prototype design',
        completed: false
      },
      {
        id: 'iterate-on-design',
        title: 'Iterate on design',
        description: 'Improve your prototype based on feedback',
        completed: false
      },
      {
        id: 'export-design-assets',
        title: 'Export design assets',
        description: 'Export assets for development implementation',
        completed: false
      },
      {
        id: 'integrate-with-development',
        title: 'Integrate with development',
        description: 'Connect design workflow with development process',
        completed: false
      }
    ],
    'api-tester': [
      {
        id: 'choose-api-testing-tool',
        title: 'Choose API testing tool',
        description: 'Select an API testing tool (Postman, Insomnia, etc.)',
        completed: false
      },
      {
        id: 'setup-test-environment',
        title: 'Set up test environment',
        description: 'Configure environment variables and settings',
        completed: false
      },
      {
        id: 'create-api-requests',
        title: 'Create API requests',
        description: 'Build your first API requests and collections',
        completed: false
      },
      {
        id: 'write-api-tests',
        title: 'Write API tests',
        description: 'Create automated tests for API endpoints',
        completed: false
      },
      {
        id: 'setup-ci-integration',
        title: 'Set up CI integration',
        description: 'Integrate API tests with CI/CD pipeline',
        completed: false
      },
      {
        id: 'monitor-api-performance',
        title: 'Monitor API performance',
        description: 'Track API performance and response times',
        completed: false
      }
    ],
    'build-monitor': [
      {
        id: 'choose-monitoring-tool',
        title: 'Choose monitoring tool',
        description: 'Select a build and performance monitoring tool',
        completed: false
      },
      {
        id: 'setup-monitoring-account',
        title: 'Set up monitoring account',
        description: 'Create and configure your monitoring account',
        completed: false
      },
      {
        id: 'integrate-with-project',
        title: 'Integrate with project',
        description: 'Add monitoring to your development project',
        completed: false
      },
      {
        id: 'configure-alerts',
        title: 'Configure alerts',
        description: 'Set up notifications for build failures',
        completed: false
      },
      {
        id: 'analyze-performance',
        title: 'Analyze performance',
        description: 'Review and interpret performance metrics',
        completed: false
      },
      {
        id: 'optimize-build-process',
        title: 'Optimize build process',
        description: 'Improve build times and efficiency',
        completed: false
      }
    ]
  };

  const devToolPaths: { [key: string]: DevToolPath } = {
    cursor: {
      id: 'cursor',
      title: 'Step-by-Step Cursor Guide',
      icon: <Code className="h-5 w-5" />,
      description: 'Master AI-powered coding with Cursor IDE',
      sections: [
        {
          id: 'cursor-setup',
          title: '⚡ Getting Started',
          description: 'Set up and configure Cursor IDE',
          steps: [
            {
              id: 'cursor-step-1',
              title: 'Understanding Cursor',
              description: 'Learn about Cursor\'s AI-powered features',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>What is Cursor?</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Cursor is an AI-first code editor designed to help developers write, understand, and improve code faster.
                  </p>
                </div>
              )
            },
            {
              id: 'cursor-step-2',
              title: 'Installation & Setup',
              description: 'Install and configure Cursor on your system',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Installing Cursor</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Follow these steps to install and set up Cursor on your system.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'cursor-usage',
          title: '💻 Using Cursor',
          description: 'Learn to use Cursor effectively',
          steps: [
            {
              id: 'cursor-step-3',
              title: 'AI Commands',
              description: 'Master Cursor\'s AI command system',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Commands</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn how to use Cursor's powerful AI commands to accelerate your coding.
                  </p>
                </div>
              )
            },
            {
              id: 'cursor-step-4',
              title: 'Code Generation',
              description: 'Generate code with AI assistance',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Code Generation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of generating code with Cursor's AI capabilities.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    github: {
      id: 'github',
      title: 'Step-by-Step GitHub Guide',
      icon: <Github className="h-5 w-5" />,
      description: 'Master version control and collaboration with GitHub',
      sections: [
        {
          id: 'github-basics',
          title: '🐙 GitHub Basics',
          description: 'Learn the fundamentals of Git and GitHub',
          steps: [
            {
              id: 'github-step-1',
              title: 'What is Git?',
              description: 'Understand Git version control concepts',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Git Fundamentals</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn the core concepts of Git version control system.
                  </p>
                </div>
              )
            },
            {
              id: 'github-step-2',
              title: 'GitHub CLI + GUI',
              description: 'Set up GitHub command line and desktop tools',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub Tools</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Explore GitHub's command line interface and desktop application.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'github-advanced',
          title: '🚀 Advanced GitHub',
          description: 'Master advanced GitHub features',
          steps: [
            {
              id: 'github-step-3',
              title: 'Branching & Merging',
              description: 'Learn effective branching strategies',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Branching Strategies</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master Git branching and merging workflows.
                  </p>
                </div>
              )
            },
            {
              id: 'github-step-4',
              title: 'Pull Requests',
              description: 'Create and review pull requests',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pull Requests</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn the complete pull request workflow for code reviews and collaboration.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    vscode: {
      id: 'vscode',
      title: 'Step-by-Step VS Code Guide',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Master the Visual Studio Code editor',
      sections: [
        {
          id: 'vscode-setup',
          title: '💻 VS Code Setup',
          description: 'Set up and configure VS Code',
          steps: [
            {
              id: 'vscode-step-1',
              title: 'Install + Themes',
              description: 'Install VS Code and customize appearance',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>VS Code Installation</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Install and customize Visual Studio Code for your development needs.
                  </p>
                </div>
              )
            },
            {
              id: 'vscode-step-2',
              title: 'Extensions to Use',
              description: 'Install essential VS Code extensions',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Essential Extensions</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Discover and install the most useful VS Code extensions for development.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'vscode-usage',
          title: '⚙️ VS Code Usage',
          description: 'Learn to use VS Code effectively',
          steps: [
            {
              id: 'vscode-step-3',
              title: 'VS Code Shortcuts',
              description: 'Master keyboard shortcuts for productivity',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Keyboard Shortcuts</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn essential keyboard shortcuts to boost your productivity in VS Code.
                  </p>
                </div>
              )
            },
            {
              id: 'vscode-step-4',
              title: 'Split View & Panels',
              description: 'Organize your workspace efficiently',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Workspace Organization</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master VS Code's layout features for efficient coding.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    supabase: {
      id: 'supabase',
      title: 'Step-by-Step Supabase Guide',
      icon: <Database className="h-5 w-5" />,
      description: 'Master database operations with Supabase',
      sections: [
        {
          id: 'supabase-setup',
          title: '🗄️ Supabase Setup',
          description: 'Set up and configure Supabase',
          steps: [
            {
              id: 'supabase-step-1',
              title: 'Project Creation',
              description: 'Create your first Supabase project',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Supabase Project Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create and configure your first Supabase project.
                  </p>
                </div>
              )
            },
            {
              id: 'supabase-step-2',
              title: 'Database Schema',
              description: 'Design your database structure',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Schema Design</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to design efficient database schemas in Supabase.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'supabase-features',
          title: '🔧 Supabase Features',
          description: 'Explore Supabase capabilities',
          steps: [
            {
              id: 'supabase-step-3',
              title: 'Authentication',
              description: 'Implement user authentication',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Supabase Auth</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Implement user authentication with Supabase Auth.
                  </p>
                </div>
              )
            },
            {
              id: 'supabase-step-4',
              title: 'Storage',
              description: 'Manage file uploads and storage',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Supabase Storage</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to manage file uploads and storage with Supabase.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    lovable: {
      id: 'lovable',
      title: 'Step-by-Step Lovable Guide',
      icon: <Code className="h-5 w-5" />,
      description: 'Master AI-powered app development with Lovable',
      sections: [
        {
          id: 'lovable-setup',
          title: '💖 Getting Started',
          description: 'Set up and explore Lovable platform',
          steps: [
            {
              id: 'lovable-step-1',
              title: 'Understanding Lovable',
              description: 'Learn about Lovable\'s AI-powered development features',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>What is Lovable?</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Lovable is an AI-powered platform for rapid app development and prototyping.
                  </p>
                </div>
              )
            },
            {
              id: 'lovable-step-2',
              title: 'Create Your First Project',
              description: 'Set up your first Lovable project',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Project Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Create and configure your first Lovable application.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'lovable-development',
          title: '🚀 Development',
          description: 'Build apps with Lovable',
          steps: [
            {
              id: 'lovable-step-3',
              title: 'AI-Assisted Coding',
              description: 'Use AI features for rapid development',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Development Features</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to leverage Lovable's AI capabilities for faster development.
                  </p>
                </div>
              )
            },
            {
              id: 'lovable-step-4',
              title: 'Deploy Your App',
              description: 'Deploy and share your Lovable application',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>App Deployment</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Deploy your application and share it with others.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    'api-tester': {
      id: 'api-tester',
      title: 'Step-by-Step API Testing Guide',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Master API testing and debugging',
      sections: [
        {
          id: 'api-basics',
          title: '🔧 API Testing Basics',
          description: 'Learn API testing fundamentals',
          steps: [
            {
              id: 'api-tester-step-1',
              title: 'Understanding APIs',
              description: 'Learn about REST APIs and HTTP methods',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>API Fundamentals</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Understanding REST APIs, HTTP methods, and status codes.
                  </p>
                </div>
              )
            },
            {
              id: 'api-tester-step-2',
              title: 'Using Testing Tools',
              description: 'Learn to use Postman, Insomnia, and other tools',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>API Testing Tools</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master popular API testing tools and their features.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'api-advanced',
          title: '⚡ Advanced Testing',
          description: 'Advanced API testing techniques',
          steps: [
            {
              id: 'api-tester-step-3',
              title: 'Authentication Testing',
              description: 'Test APIs with various authentication methods',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>API Authentication</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Test APIs with JWT, OAuth, API keys, and other auth methods.
                  </p>
                </div>
              )
            },
            {
              id: 'api-tester-step-4',
              title: 'Automated Testing',
              description: 'Create automated API test suites',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Automated API Testing</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Build comprehensive automated test suites for your APIs.
                  </p>
                </div>
              )
            }
          ]
        }
      ]
    },
    'build-monitor': {
      id: 'build-monitor',
      title: 'Step-by-Step Build Monitoring Guide',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Master build monitoring and CI/CD observability',
      sections: [
        {
          id: 'monitoring-basics',
          title: '📊 Monitoring Basics',
          description: 'Learn build monitoring fundamentals',
          steps: [
            {
              id: 'build-monitor-step-1',
              title: 'Understanding Build Monitoring',
              description: 'Learn about CI/CD pipeline monitoring',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Build Monitoring Basics</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Understanding CI/CD pipeline monitoring and observability.
                  </p>
                </div>
              )
            },
            {
              id: 'build-monitor-step-2',
              title: 'Set Up Monitoring Tools',
              description: 'Configure monitoring dashboards and alerts',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Monitoring Setup</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Set up dashboards and alerts for your build processes.
                  </p>
                </div>
              )
            }
          ]
        },
        {
          id: 'monitoring-advanced',
          title: '📈 Advanced Monitoring',
          description: 'Advanced monitoring and analytics',
          steps: [
            {
              id: 'build-monitor-step-3',
              title: 'Performance Analytics',
              description: 'Analyze build performance and optimization',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Build Performance</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Analyze and optimize your build pipeline performance.
                  </p>
                </div>
              )
            },
            {
              id: 'build-monitor-step-4',
              title: 'Failure Analysis',
              description: 'Debug and analyze build failures',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Build Failure Analysis</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Learn to debug and analyze build failures effectively.
                  </p>
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

  const currentDevToolPath = devToolPaths[activeApp] || devToolPaths.cursor;
  const totalSteps = currentDevToolPath.sections.reduce((acc, section) => acc + section.steps.length, 0);

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
      
      Object.keys(devToolPaths).forEach(appId => {
        const path = devToolPaths[appId];
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
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
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
            Vibe Coding Lab
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Your complete development workspace for building amazing applications
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
          <Code className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
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
                  Development Checklist
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
                {currentDevToolPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentDevToolPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentDevToolPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                  {currentDevToolPath.sections.map((section, sectionIndex) => {
                    let stepCounter = 0;
                    // Calculate step number offset for this section
                    for (let i = 0; i < sectionIndex; i++) {
                      stepCounter += currentDevToolPath.sections[i].steps.length;
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

export default VibeCodingLab;