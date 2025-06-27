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
  const [activeApp, setActiveApp] = useState('bolt');
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
    { id: 'bolt', name: 'Bolt.new', icon: '⚡' },
    { id: 'cursor', name: 'Cursor', icon: '💫' },
    { id: 'github', name: 'GitHub', icon: '🐙' },
    { id: 'vscode', name: 'VS Code', icon: '💻' },
    { id: 'lovable', name: 'Lovable', icon: '💖' },
    { id: 'supabase', name: 'Supabase', icon: '🗄️' },
    { id: 'api-tester', name: 'API Tester', icon: '🔧' },
    { id: 'build-monitor', name: 'Build Monitor', icon: '📊' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    bolt: [
      {
        id: 'setup-bolt-account',
        title: 'Set up Bolt.new account',
        description: 'Create and configure your Bolt.new account for AI-powered development',
        completed: false
      },
      {
        id: 'explore-bolt-interface',
        title: 'Explore Bolt interface',
        description: 'Familiarize yourself with the Bolt.new development environment',
        completed: false
      },
      {
        id: 'create-first-project',
        title: 'Create your first project',
        description: 'Build a sample application using Bolt.new AI assistance',
        completed: false
      },
      {
        id: 'use-ai-prompting',
        title: 'Master AI prompting',
        description: 'Learn effective prompting techniques for code generation',
        completed: false
      },
      {
        id: 'deploy-bolt-app',
        title: 'Deploy your Bolt app',
        description: 'Deploy your application directly from Bolt.new',
        completed: false
      },
      {
        id: 'integrate-with-github',
        title: 'Integrate with GitHub',
        description: 'Connect Bolt.new projects with GitHub repositories',
        completed: false
      }
    ],
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>💫 What Makes Cursor Revolutionary?</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 The AI-First Code Editor</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Cursor isn't just another code editor—it's the future of programming. Built from the ground up with AI integration, 
                      it transforms how you write, understand, and improve code. Imagine having an expert programming partner who understands 
                      your entire codebase and can help you code at the speed of thought.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔥 Why Cursor Changes Everything:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🧠 AI Chat:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Talk to your codebase like ChatGPT</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>⚡ Instant Code:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Generate functions, components, and entire features</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🔍 Smart Understanding:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> AI reads your entire project context</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Core AI Features That Will Transform Your Coding</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💬 AI Chat (Cmd+L)</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Have natural conversations about your code. Ask questions like "How does this authentication system work?" 
                              or "Add error handling to this function" and get intelligent, context-aware responses.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Understands your entire codebase context</li>
                              <li>• Explains complex code patterns and architectures</li>
                              <li>• Suggests improvements and optimizations</li>
                              <li>• Helps debug issues with intelligent analysis</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Inline Generation (Cmd+K)</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Generate code directly in your editor. Type a comment describing what you want, hit Cmd+K, 
                              and watch AI write the implementation that matches your project's style and patterns.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Creates functions, components, and entire features</li>
                              <li>• Follows your existing code patterns and style</li>
                              <li>• Integrates seamlessly with your project structure</li>
                              <li>• Supports all programming languages and frameworks</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Smart Autocomplete</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Next-level code completion that predicts not just the next word, but entire code blocks. 
                              It understands your intent and suggests complete implementations.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Predicts multi-line code completions</li>
                              <li>• Learns from your coding patterns</li>
                              <li>• Suggests variable names and function signatures</li>
                              <li>• Completes complex logic flows intelligently</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🌟 Real Developer Success Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ 10x Faster Development</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          "I built a complete React component in 5 minutes that would have taken me 2 hours. 
                          Cursor understood my design system and generated perfect TypeScript code with proper types."
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🧠 Learning Accelerator</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          "As a beginner, Cursor is like having a senior developer pair programming with me 24/7. 
                          It explains concepts and helps me write production-quality code."
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚡ Get Cursor Up & Running</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🚀 Quick Installation Guide</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Get Cursor installed and configured in minutes. We'll walk through the complete setup process 
                      to get you coding with AI superpowers immediately.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📥 Step 1: Download Cursor</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Visit cursor.sh</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Go to the official Cursor website and download the installer for your operating system:
                            </p>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} ml-4`}>
                              <li>• 🍎 <strong>macOS</strong>: Universal binary for Intel & Apple Silicon</li>
                              <li>• 🪟 <strong>Windows</strong>: .exe installer with automatic updates</li>
                              <li>• 🐧 <strong>Linux</strong>: AppImage or .deb package</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>💡 Pro Tip</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              Cursor is free to use with generous limits. No credit card required to get started!
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚙️ Step 2: First Launch Configuration</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔐 Account Setup</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Sign up with email or GitHub/Google account</li>
                              <li>• Verify your email for full access</li>
                              <li>• Choose your subscription plan (start with free)</li>
                              <li>• Complete the welcome tour for key features</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎨 Theme & Appearance</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Choose your preferred color theme (dark/light)</li>
                              <li>• Set font family and size for optimal readability</li>
                              <li>• Configure icon theme and file associations</li>
                              <li>• Customize the sidebar and panel layout</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🧠 Step 3: AI Model Configuration</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🤖 Choose Your AI Model</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Cursor offers different AI models for different needs:
                            </p>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• <strong>GPT-4</strong>: Most capable, best for complex tasks</li>
                              <li>• <strong>Claude-3</strong>: Excellent for code analysis and debugging</li>
                              <li>• <strong>Cursor Small</strong>: Fast responses for simple completions</li>
                              <li>• <strong>Custom Models</strong>: Bring your own API keys</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>⚡ Performance Settings</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                              <li>• Enable "Auto-Complete" for inline suggestions</li>
                              <li>• Set response speed vs quality preferences</li>
                              <li>• Configure context window size for your projects</li>
                              <li>• Enable/disable specific AI features per workspace</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔧 Essential Settings & Extensions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Recommended Settings</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-3`}>
                          {`{
  "cursor.chat.model": "gpt-4",
  "cursor.autocomplete.enabled": true,
  "cursor.autocomplete.showInline": true,
  "editor.fontSize": 14,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.wordWrap": "on"
}`}
                        </div>
                        <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Copy these settings to Cursor's settings.json for optimal experience
                        </p>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔌 Must-Have Extensions</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <strong>Prettier</strong>: Code formatting</li>
                          <li>• <strong>ESLint</strong>: JavaScript/TypeScript linting</li>
                          <li>• <strong>Auto Rename Tag</strong>: HTML/JSX editing</li>
                          <li>• <strong>Bracket Pair Colorizer</strong>: Visual clarity</li>
                          <li>• <strong>GitLens</strong>: Enhanced Git integration</li>
                          <li>• <strong>Material Icon Theme</strong>: Better file icons</li>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🧠 Master AI Commands for Lightning-Fast Coding</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>⚡ The Three Pillars of Cursor AI</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Cursor gives you three revolutionary AI commands that will transform how you code. Each serves a different purpose 
                      and together they form the most powerful coding experience available today.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💬 Cmd+L: AI Chat - Your Coding Partner</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          Open a conversation with AI that understands your entire codebase. Perfect for planning, debugging, and learning.
                        </p>
                        
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Perfect For:</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• "How does this authentication system work?"</li>
                              <li>• "Find all the places where we handle user payments"</li>
                              <li>• "What's the best way to add error handling here?"</li>
                              <li>• "Explain this complex algorithm step by step"</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>💡 Pro Tips</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              <li>• Reference specific files with @filename.js</li>
                              <li>• Ask for multiple alternatives and compare them</li>
                              <li>• Use it to rubber duck your ideas and get feedback</li>
                              <li>• Request explanations for complex code patterns</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Cmd+K: Inline Generation - Write Code at the Speed of Thought</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          Generate code directly in your editor. Perfect for implementing specific functions, components, or features.
                        </p>
                        
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Example Prompts</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono mb-2`}>
                              {`// Create a React component for a user profile card with avatar, name, and bio
// Add error handling for this API call with retry logic
// Generate a TypeScript interface for a shopping cart item
// Create a function to validate email addresses with regex`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🎯 Best Practices</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                              <li>• Be specific about requirements and constraints</li>
                              <li>• Include context about your project structure</li>
                              <li>• Mention the coding style or framework you're using</li>
                              <li>• Ask for comments and documentation too</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>✨ Tab: Smart Autocomplete - AI-Powered Completions</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          Intelligent code completion that predicts what you want to write next. Works seamlessly as you type.
                        </p>
                        
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔮 What It Predicts</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Complete function implementations</li>
                              <li>• Variable names that make sense</li>
                              <li>• Import statements and dependencies</li>
                              <li>• Complete JSX components and props</li>
                              <li>• CSS properties and values</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>⚙️ Customization</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                              <li>• Adjust suggestion frequency in settings</li>
                              <li>• Enable/disable for specific file types</li>
                              <li>• Configure delay before suggestions appear</li>
                              <li>• Toggle between different AI models</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Advanced Code Generation Techniques</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>✨ From Idea to Implementation in Seconds</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Learn to write professional-quality code faster than ever before. Master the art of prompting AI 
                      to generate exactly what you need, when you need it.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ React Component Generation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          Generate complete React components with props, state, and styling:
                        </p>
                        
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Example Prompts</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono space-y-1`}>
                              <div>// Create a ProductCard component with image, title, price, and add to cart button</div>
                              <div>// Generate a modal component with backdrop, close button, and children props</div>
                              <div>// Build a form component with validation for user registration</div>
                              <div>// Create a responsive navigation component with mobile hamburger menu</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🎨 What Gets Generated</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              <li>• Complete TypeScript interfaces for props</li>
                              <li>• Responsive CSS classes with Tailwind</li>
                              <li>• State management with hooks</li>
                              <li>• Event handlers and logic</li>
                              <li>• Accessibility attributes (ARIA)</li>
                              <li>• Error handling and loading states</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 API Integration & Data Handling</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          Generate complete API integration code with error handling:
                        </p>
                        
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 API Generation Examples</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono space-y-1`}>
                              <div>// Create a custom hook for fetching user data with loading and error states</div>
                              <div>// Generate a service class for handling authentication API calls</div>
                              <div>// Build a data fetching function with retry logic and caching</div>
                              <div>// Create CRUD operations for a blog post API</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>⚡ Advanced Features</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                              <li>• Automatic TypeScript types from API responses</li>
                              <li>• React Query or SWR integration</li>
                              <li>• Error boundaries and fallback UI</li>
                              <li>• Optimistic updates for better UX</li>
                              <li>• Request/response interceptors</li>
                              <li>• Rate limiting and retry logic</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 CSS & Styling Generation</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          Generate beautiful, responsive styling with modern CSS techniques:
                        </p>
                        
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎭 Styling Prompts</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono space-y-1`}>
                              <div>// Create a glassmorphism card design with Tailwind classes</div>
                              <div>// Generate a responsive grid layout for a photo gallery</div>
                              <div>// Build an animated loading skeleton with CSS keyframes</div>
                              <div>// Create a dark mode toggle with smooth transitions</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>💅 Modern CSS Features</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                              <li>• CSS Grid and Flexbox layouts</li>
                              <li>• CSS custom properties (variables)</li>
                              <li>• Smooth animations and transitions</li>
                              <li>• Mobile-first responsive design</li>
                              <li>• Modern pseudo-selectors</li>
                              <li>• Container queries for component-based styling</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🎯 Pro Code Generation Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Effective Prompting</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Be specific about requirements</li>
                          <li>• Mention your tech stack and conventions</li>
                          <li>• Ask for comments and documentation</li>
                          <li>• Request error handling and edge cases</li>
                          <li>• Specify performance requirements</li>
                          <li>• Include accessibility considerations</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔄 Iterative Improvement</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Generate MVP version first</li>
                          <li>• Ask for specific improvements</li>
                          <li>• Request different approaches</li>
                          <li>• Add features incrementally</li>
                          <li>• Optimize for performance later</li>
                          <li>• Test edge cases and refine</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cursor-step-5',
              title: 'Project Workflow',
              description: 'Optimize your development workflow with Cursor',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔄 Streamlined Development Workflows</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-4`}>⚡ From Idea to Deployment in Record Time</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Learn professional workflows that combine Cursor's AI with modern development practices. 
                      Build production-ready applications faster than ever before.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🚀 Rapid Prototyping Workflow</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ 30-Minute MVP Process</h5>
                            <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                              <li>Start with Cmd+L: "Create a project structure for [your idea]"</li>
                              <li>Generate core components with Cmd+K</li>
                              <li>Add routing and navigation structure</li>
                              <li>Implement basic CRUD operations</li>
                              <li>Style with generated Tailwind classes</li>
                              <li>Add responsive design and mobile optimization</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 Debugging & Optimization</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🐛 AI-Powered Debugging</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Paste error messages into Cmd+L for instant solutions</li>
                              <li>• Ask "Why isn't this component rendering?"</li>
                              <li>• Request performance optimizations</li>
                              <li>• Generate comprehensive error handling</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cursor-step-6',
              title: 'Advanced Features',
              description: 'Master Cursor\'s advanced AI capabilities',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🧠 Advanced AI Features & Custom Workflows</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🔬 Cutting-Edge AI Capabilities</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Unlock the full potential of Cursor with advanced features that push the boundaries of AI-assisted development.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎭 Multi-File Context & Codebase Understanding</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔍 Advanced Context Commands</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• @folder: Reference entire directories</li>
                              <li>• @file: Include specific files in context</li>
                              <li>• @git: Reference git history and changes</li>
                              <li>• @docs: Include documentation and README files</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🤖 Custom AI Models & API Integration</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚙️ Model Configuration</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Bring your own OpenAI API key</li>
                              <li>• Configure Claude-3 for code analysis</li>
                              <li>• Set up custom model endpoints</li>
                              <li>• Fine-tune model behavior per project</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'cursor-step-7',
              title: 'Real Projects',
              description: 'Build complete applications with Cursor',
              estimated_time: '60 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🏗️ Building Real-World Applications</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-emerald-200 dark:border-emerald-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-emerald-600 dark:text-emerald-400 mb-4`}>🚀 From Zero to Production</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Build complete, production-ready applications using Cursor's AI capabilities. 
                      Learn by creating real projects that solve actual problems.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💼 Project 1: Task Management SaaS</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 What You'll Build</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• User authentication & authorization</li>
                              <li>• Project & task management interface</li>
                              <li>• Real-time collaboration features</li>
                              <li>• File upload & sharing system</li>
                              <li>• Analytics dashboard</li>
                              <li>• Responsive design & mobile app</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛒 Project 2: E-commerce Platform</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Revenue-Ready Features</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Product catalog with search & filters</li>
                              <li>• Shopping cart & checkout flow</li>
                              <li>• Stripe payment integration</li>
                              <li>• Inventory management system</li>
                              <li>• Order tracking & fulfillment</li>
                              <li>• Admin dashboard with analytics</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🎯 Professional Development Practices</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 Development Setup</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Git workflow with feature branches</li>
                          <li>• Automated testing with Jest & Cypress</li>
                          <li>• CI/CD pipeline setup</li>
                          <li>• Environment configuration</li>
                          <li>• Code quality tools (ESLint, Prettier)</li>
                          <li>• Documentation generation</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🚀 Production Deployment</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Vercel/Netlify deployment strategy</li>
                          <li>• Database setup (Supabase/PlanetScale)</li>
                          <li>• CDN configuration for assets</li>
                          <li>• Security best practices</li>
                          <li>• Performance monitoring</li>
                          <li>• Error tracking & analytics</li>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔄 Git Fundamentals - Version Control Made Simple</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 Why Git is Essential for Every Developer</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Git is the most popular version control system used by developers worldwide. Think of it as a time machine 
                      for your code - allowing you to track changes, collaborate with others, and never lose your work again.
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 What Git Solves</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>❌ Before Git</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Lost code due to crashes or mistakes</li>
                              <li>• Files named "final_v2_really_final.js"</li>
                              <li>• Impossible team collaboration</li>
                              <li>• No way to undo changes safely</li>
                              <li>• Fear of breaking working code</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>✅ With Git</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                              <li>• Complete history of every change</li>
                              <li>• Easy branching for new features</li>
                              <li>• Seamless team collaboration</li>
                              <li>• Safe experimentation</li>
                              <li>• Professional development workflow</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🧠 Core Git Concepts</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📁 Repository (Repo)</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              A folder that contains your project and its complete history. Think of it as a project folder 
                              with superpowers - it remembers every change you've ever made.
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📸 Commit</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              A snapshot of your code at a specific point in time. Like taking a photo of your project 
                              that you can return to later. Each commit has a message describing what changed.
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌿 Branch</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              A parallel version of your code where you can experiment safely. Think of it as creating 
                              a copy of your project to try new features without breaking the original.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📚 Learn More Resources</h3>
                    <div className="space-y-3">
                      <a href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer" 
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">📖</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Official Git Documentation</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Comprehensive guide from the Git team</p>
                        </div>
                      </a>
                      
                      <a href="https://learngitbranching.js.org/" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🎮</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Learn Git Branching (Interactive)</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Visual, interactive Git tutorial game</p>
                        </div>
                      </a>
                      
                      <a href="https://www.atlassian.com/git/tutorials" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🎓</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Atlassian Git Tutorials</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Beginner-friendly tutorials with examples</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'github-step-2',
              title: 'GitHub Setup & Installation',
              description: 'Install Git, create GitHub account, and set up tools',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🛠️ Complete GitHub Setup Guide</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🚀 Get Started in 3 Steps</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Set up your complete GitHub development environment. We'll get you from zero to pushing code in minutes!
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📥 Step 1: Install Git</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🖥️ Choose Your Platform</h5>
                            <div className="space-y-2">
                              <a href="https://git-scm.com/download/win" target="_blank" rel="noopener noreferrer"
                                 className={`flex items-center p-2 rounded border transition-colors ${theme === 'gradient' ? 'bg-gray-500/30 border-gray-500 hover:bg-gray-400/30' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/30'}`}>
                                <span className="text-lg mr-2">🪟</span>
                                <span className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'}`}>Windows: Download Git for Windows</span>
                              </a>
                              <a href="https://git-scm.com/download/mac" target="_blank" rel="noopener noreferrer"
                                 className={`flex items-center p-2 rounded border transition-colors ${theme === 'gradient' ? 'bg-gray-500/30 border-gray-500 hover:bg-gray-400/30' : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/30'}`}>
                                <span className="text-lg mr-2">🍎</span>
                                <span className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'}`}>macOS: Download Git for Mac (or use Homebrew)</span>
                              </a>
                              <div className={`flex items-center p-2 rounded border ${theme === 'gradient' ? 'bg-gray-500/30 border-gray-500' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                                <span className="text-lg mr-2">🐧</span>
                                <span className={`text-sm font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>Linux: sudo apt install git (Ubuntu/Debian)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>✅ Verify Installation</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono`}>
                              git --version
                            </div>
                            <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                              Run this in your terminal to confirm Git is installed
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🐙 Step 2: Create GitHub Account</h4>
                        <div className="space-y-3">
                          <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer"
                             className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-600/30 border-gray-600 hover:bg-gray-500/30' : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/30'}`}>
                            <span className="text-2xl mr-3">🆓</span>
                            <div>
                              <h5 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'}`}>Sign up for GitHub (Free)</h5>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-green-600 dark:text-green-300'}`}>
                                Get unlimited public repositories and 3 private repos
                              </p>
                            </div>
                          </a>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💡 Pro Tips for Username</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Use your real name or professional handle</li>
                              <li>• Keep it short and memorable</li>
                              <li>• This will be part of your portfolio URL</li>
                              <li>• Consider your future career goals</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚙️ Step 3: Configure Git</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Essential Configuration</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono space-y-1`}>
                              <div>git config --global user.name "Your Name"</div>
                              <div>git config --global user.email "your.email@example.com"</div>
                              <div>git config --global init.defaultBranch main</div>
                            </div>
                            <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Replace with your actual name and email (use your GitHub email)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🛠️ Essential Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="https://desktop.github.com/" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-4 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-2xl mr-3">🖥️</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub Desktop</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Visual Git client for beginners</p>
                        </div>
                      </a>
                      
                      <a href="https://cli.github.com/" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-4 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-2xl mr-3">⌨️</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub CLI</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Command-line power user tool</p>
                        </div>
                      </a>
                    </div>
                  </div>
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
              title: 'Your First Repository',
              description: 'Create your first GitHub repository and make commits',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🎉 Create Your First Repository</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-4`}>🚀 Your Git Journey Begins</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Let's create your first repository and make your first commit. This is where your coding journey becomes official!
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📁 Option 1: Create on GitHub First (Recommended)</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Web Interface Steps</h5>
                            <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                              <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">github.com/new</a></li>
                              <li>Enter repository name (e.g., "my-first-project")</li>
                              <li>Add description: "My first GitHub repository"</li>
                              <li>✅ Check "Add a README file"</li>
                              <li>Choose "Add .gitignore" &gt; Node (or your language)</li>
                              <li>Click "Create repository"</li>
                            </ol>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>⬇️ Clone to Your Computer</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono mb-2`}>
                              git clone https://github.com/yourusername/my-first-project.git
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              Replace "yourusername" with your actual GitHub username
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💻 Option 2: Start Locally</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⌨️ Command Line Steps</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono space-y-1`}>
                              <div>mkdir my-first-project</div>
                              <div>cd my-first-project</div>
                              <div>git init</div>
                              <div>echo "# My First Project" &gt; README.md</div>
                              <div>git add README.md</div>
                              <div>git commit -m "Initial commit"</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>✨ Make Your First Changes</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📝 Edit README.md</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm`}>
                              {`# My First Project

## About
This is my first GitHub repository! 🎉

## What I'm Learning
- Git version control
- GitHub collaboration
- Markdown formatting

## Next Steps
- Add more projects
- Learn branching
- Contribute to open source`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🚀 Commit and Push</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono space-y-1`}>
                              <div>git add .</div>
                              <div>git commit -m "Update README with project info"</div>
                              <div>git push origin main</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🎯 Understanding Git Commands</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Essential Commands</h4>
                        <div className="space-y-2 text-sm">
                          <div><code className="text-blue-600">git add</code> - Stage changes for commit</div>
                          <div><code className="text-blue-600">git commit</code> - Save changes with message</div>
                          <div><code className="text-blue-600">git push</code> - Upload to GitHub</div>
                          <div><code className="text-blue-600">git pull</code> - Download latest changes</div>
                          <div><code className="text-blue-600">git status</code> - Check repository status</div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💡 Best Practices</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Write clear commit messages</li>
                          <li>• Commit small, logical changes</li>
                          <li>• Always pull before pushing</li>
                          <li>• Use present tense ("Add feature")</li>
                          <li>• Keep commits under 50 characters</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'github-step-4',
              title: 'Branching & Basic Workflow',
              description: 'Learn Git branching and essential commands',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🌿 Branching - Git's Superpower</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-emerald-200 dark:border-emerald-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-emerald-600 dark:text-emerald-400 mb-4`}>🚀 Why Branching Changes Everything</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Branching allows you to work on features safely without breaking your main code. 
                      Think of it as creating parallel universes of your project!
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Branch Workflow</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌱 Create and Switch to New Branch</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono space-y-1`}>
                              <div>git checkout -b feature/add-contact-form</div>
                              <div># or the newer syntax:</div>
                              <div>git switch -c feature/add-contact-form</div>
                            </div>
                            <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Use descriptive names: feature/, bugfix/, hotfix/
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💻 Work on Your Feature</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono space-y-1`}>
                              <div># Make changes to your files</div>
                              <div>git add .</div>
                              <div>git commit -m "Add contact form component"</div>
                              <div>git push origin feature/add-contact-form</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🔄 Switch Between Branches</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono space-y-1`}>
                              <div>git switch main          # Go back to main</div>
                              <div>git branch              # List all branches</div>
                              <div>git branch -a           # Include remote branches</div>
                              <div>git switch feature/add-contact-form  # Back to feature</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 Essential Git Commands</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📋 Status & Info Commands</h5>
                            <div className="space-y-1 text-xs font-mono">
                              <div><code>git status</code> - See what's changed</div>
                              <div><code>git log --oneline</code> - View commit history</div>
                              <div><code>git diff</code> - See exact changes</div>
                              <div><code>git branch -v</code> - List branches with info</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚨 Undo Commands (Use Carefully!)</h5>
                            <div className="space-y-1 text-xs font-mono">
                              <div><code>git checkout -- file.js</code> - Undo file changes</div>
                              <div><code>git reset HEAD~1</code> - Undo last commit</div>
                              <div><code>git stash</code> - Temporarily save changes</div>
                              <div><code>git stash pop</code> - Restore stashed changes</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📚 Learn More About Git</h3>
                    <div className="space-y-3">
                      <a href="https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">📖</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Pro Git Book - Branching</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Deep dive into Git branching concepts</p>
                        </div>
                      </a>
                      
                      <a href="https://www.atlassian.com/git/tutorials/using-branches" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🌿</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Atlassian - Using Branches</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Practical branching strategies and workflows</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'github-step-5',
              title: 'Pull Requests & Code Review',
              description: 'Master GitHub\'s collaboration workflow',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🤝 Pull Requests - The Heart of Collaboration</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🚀 What Are Pull Requests?</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Pull Requests (PRs) are how you propose changes to a codebase. They're your way of saying 
                      "Hey, I made some improvements - want to merge them into the main project?"
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Creating Your First Pull Request</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Using GitHub Web Interface</h5>
                            <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} list-decimal list-inside`}>
                              <li>Push your feature branch to GitHub</li>
                              <li>Go to your repository on GitHub</li>
                              <li>Click "Compare & pull request" button</li>
                              <li>Fill out the PR template with clear description</li>
                              <li>Select reviewers and assignees</li>
                              <li>Click "Create pull request"</li>
                            </ol>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>⌨️ Using GitHub CLI</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm font-mono`}>
                              gh pr create --title "Add contact form" --body "Added responsive contact form with validation"
                            </div>
                            <p className={`text-xs mt-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              Install GitHub CLI: <a href="https://cli.github.com/" target="_blank" rel="noopener noreferrer" className="underline">cli.github.com</a>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>✍️ Writing Great PR Descriptions</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                          <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📋 PR Template Example</h5>
                          <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-sm whitespace-pre-line`}>
{`## What Changed
- Added responsive contact form to homepage
- Implemented form validation with error messages
- Added success/failure notifications

## Why
Users requested an easier way to get in touch

## Screenshots
[Attach before/after images]

## Testing
- ✅ Form validates required fields
- ✅ Success message shows on submit
- ✅ Mobile responsive design
- ✅ Accessibility tested with screen reader

## Checklist
- [x] Code follows project style guide
- [x] Tests added/updated
- [x] Documentation updated
- [x] Self-reviewed the changes`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🔍 Code Review Best Practices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>👀 Reviewing Code</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Be constructive and kind</li>
                          <li>• Focus on the code, not the person</li>
                          <li>• Suggest improvements with examples</li>
                          <li>• Appreciate good solutions</li>
                          <li>• Ask questions to understand</li>
                        </ul>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Receiving Reviews</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Don't take feedback personally</li>
                          <li>• Ask for clarification if needed</li>
                          <li>• Make requested changes promptly</li>
                          <li>• Thank reviewers for their time</li>
                          <li>• Learn from every review</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'github-step-6',
              title: 'GitHub Actions & Automation',
              description: 'Automate your workflow with CI/CD',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚡ GitHub Actions - Automation Magic</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🤖 What Are GitHub Actions?</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      GitHub Actions automatically run tasks when specific events happen in your repository. 
                      Think of them as robots that test, build, and deploy your code!
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Common Use Cases</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Continuous Integration</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Run tests on every PR</li>
                              <li>• Check code quality/linting</li>
                              <li>• Build and validate code</li>
                              <li>• Security vulnerability scans</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚀 Continuous Deployment</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Deploy to staging/production</li>
                              <li>• Update documentation sites</li>
                              <li>• Publish to npm/package registries</li>
                              <li>• Create releases automatically</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📚 Learn GitHub Actions</h3>
                    <div className="space-y-3">
                      <a href="https://docs.github.com/en/actions" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">📖</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub Actions Documentation</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Official guide and reference</p>
                        </div>
                      </a>
                      
                      <a href="https://github.com/marketplace?type=actions" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🛒</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>GitHub Actions Marketplace</h4>
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Pre-built actions you can use</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'github-step-7',
              title: 'Open Source Contribution',
              description: 'Contribute to open source projects on GitHub',
              estimated_time: '50 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🌟 Contributing to Open Source</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🚀 Why Contribute to Open Source?</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Contributing to open source is one of the best ways to improve your skills, build your portfolio, 
                      and give back to the developer community. Plus, many companies love to see open source contributions!
                    </p>
                    
                    <div className="space-y-6">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Getting Started</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔍 Finding Beginner-Friendly Projects</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Look for "good first issue" labels</li>
                              <li>• Check "help wanted" tags</li>
                              <li>• Start with documentation improvements</li>
                              <li>• Fix typos and small bugs first</li>
                              <li>• Use tools like <a href="https://up-for-grabs.net/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">up-for-grabs.net</a></li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>📝 Contribution Workflow</h5>
                            <ol className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'} list-decimal list-inside`}>
                              <li>Fork the repository to your account</li>
                              <li>Clone your fork locally</li>
                              <li>Create a new branch for your changes</li>
                              <li>Make your changes and test them</li>
                              <li>Commit with clear messages</li>
                              <li>Push to your fork and create a PR</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🌍 Open Source Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a href="https://github.com/explore" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🔍</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} text-sm`}>GitHub Explore</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Discover trending repositories</p>
                        </div>
                      </a>
                      
                      <a href="https://firstcontributions.github.io/" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🎯</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} text-sm`}>First Contributions</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Practice making your first PR</p>
                        </div>
                      </a>
                      
                      <a href="https://hacktoberfest.com/" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">🎃</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} text-sm`}>Hacktoberfest</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Annual open source event</p>
                        </div>
                      </a>
                      
                      <a href="https://goodfirstissue.dev/" target="_blank" rel="noopener noreferrer"
                         className={`flex items-center p-3 rounded-lg border transition-colors ${theme === 'gradient' ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-600/50' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <span className="text-xl mr-3">✨</span>
                        <div>
                          <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} text-sm`}>Good First Issue</h4>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Curated beginner issues</p>
                        </div>
                      </a>
                    </div>
                  </div>
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
              title: 'Understanding VS Code',
              description: 'Learn what makes VS Code the world\'s most popular code editor',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>💻 Why VS Code Rules the Development World</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 The Developer's Best Friend</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Visual Studio Code isn't just a text editor—it's a complete development ecosystem that has revolutionized how developers work. 
                      Built by Microsoft but loved by everyone, VS Code combines the simplicity of a text editor with the power of a full IDE, 
                      and it's completely free and open source.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Mind-Blowing Stats:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🥇 #1 Editor:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Used by 70% of developers worldwide</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>⚡ Lightning Fast:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Opens in under 2 seconds</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🔌 Extensions:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> 40,000+ available extensions</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌟 What Makes VS Code Special</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💡 IntelliSense</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Smart code completion that understands your code context. It suggests variable names, functions, 
                              and even imports as you type, making coding faster and reducing errors.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Auto-completes based on variable types and function definitions</li>
                              <li>• Shows parameter hints and documentation</li>
                              <li>• Supports 30+ programming languages out of the box</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔍 Built-in Debugging</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Debug your code without leaving the editor. Set breakpoints, inspect variables, 
                              and step through your code line by line to find and fix issues quickly.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Visual debugging with breakpoints and call stacks</li>
                              <li>• Supports Node.js, Python, PHP, Go, C++, and more</li>
                              <li>• Debug directly in the browser for web applications</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔗 Git Integration</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Manage your Git repositories without leaving the editor. See changes, create commits, 
                              manage branches, and resolve merge conflicts all within VS Code.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Visual diff viewer for file changes</li>
                              <li>• One-click staging and committing</li>
                              <li>• Branch management and merging tools</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🌍 Learn More Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Official Resources</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code Documentation</a></li>
                          <li>• <a href="https://code.visualstudio.com/learn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Interactive Learning</a></li>
                          <li>• <a href="https://marketplace.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Extension Marketplace</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Video Tutorials</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/watch?v=VqCgcpAypFQ" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code in 100 Seconds</a></li>
                          <li>• <a href="https://www.youtube.com/playlist?list=PLj6YeMhvp2S5UgiQnBfvD7XgOMKs3O_G6" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete VS Code Course</a></li>
                          <li>• <a href="https://channel9.msdn.com/Shows/Visual-Studio-Code" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Microsoft's VS Code Show</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vscode-step-2',
              title: 'Installation & Setup',
              description: 'Download, install, and configure VS Code on your system',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚡ Get VS Code Running in Minutes</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📥 Download &amp; Installation</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Getting VS Code installed is straightforward and free. We'll walk through the complete setup process 
                      for all major operating systems and get you ready to code immediately.
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌐 Download VS Code</h4>
                        <div className="space-y-3">
                          <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                            Visit <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">code.visualstudio.com</a> and choose your platform:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🪟 Windows</h5>
                              <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Download .exe installer</li>
                                <li>• Run as administrator</li>
                                <li>• Choose "Add to PATH" option</li>
                                <li>• Install for all users (recommended)</li>
                              </ul>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🍎 macOS</h5>
                              <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• Download .dmg file</li>
                                <li>• Drag to Applications folder</li>
                                <li>• Install Shell Command (Cmd+Shift+P)</li>
                                <li>• Works on Intel &amp; Apple Silicon</li>
                              </ul>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🐧 Linux</h5>
                              <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                <li>• .deb for Ubuntu/Debian</li>
                                <li>• .rpm for Red Hat/SUSE</li>
                                <li>• Snap package available</li>
                                <li>• Flatpak version available</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 First Launch Setup</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Welcome Screen Options</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Choose your color theme (Dark+, Light, High Contrast)</li>
                              <li>• Select your preferred language for the interface</li>
                              <li>• Import settings from other editors (optional)</li>
                              <li>• Skip or customize the welcome walkthrough</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Essential Settings</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Set font family and size (File → Preferences → Settings)</li>
                              <li>• Configure auto-save (File → Auto Save)</li>
                              <li>• Enable format on save for cleaner code</li>
                              <li>• Set up telemetry preferences</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>⚙️ Essential Configuration</h3>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 Quick Setup Commands</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`// Open settings (Ctrl+,)
File → Preferences → Settings

// Install Shell Command (macOS)
Cmd+Shift+P → type "shell command"

// Set VS Code as default editor (Git)
git config --global core.editor "code --wait"

// Open current folder in VS Code
code .`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Recommended Settings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Editor Settings:</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Font Size: 14px</li>
                              <li>• Font Family: 'Fira Code' or 'Consolas'</li>
                              <li>• Tab Size: 2 spaces</li>
                              <li>• Word Wrap: On</li>
                              <li>• Auto Save: afterDelay</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Workspace Settings:</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Format On Save: True</li>
                              <li>• Trim Trailing Whitespace: True</li>
                              <li>• Insert Final Newline: True</li>
                              <li>• Detect Indentation: True</li>
                              <li>• Render Whitespace: boundary</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Helpful Setup Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Setup Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs/setup/setup-overview" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Official Setup Guide</a></li>
                          <li>• <a href="https://code.visualstudio.com/docs/getstarted/settings" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Settings Documentation</a></li>
                          <li>• <a href="https://code.visualstudio.com/docs/editor/portable" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Portable Mode Setup</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 Customization</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://vscodethemes.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Theme Gallery</a></li>
                          <li>• <a href="https://www.nerdfonts.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Developer Fonts</a></li>
                          <li>• <a href="https://code.visualstudio.com/docs/getstarted/keybindings" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Keyboard Shortcuts</a></li>
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
          id: 'vscode-usage',
          title: '⚙️ VS Code Usage',
          description: 'Learn to use VS Code effectively',
          steps: [
            {
              id: 'vscode-step-3',
              title: 'Essential Extensions',
              description: 'Install the must-have extensions for development',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔌 Power Up VS Code with Extensions</h2>
                  <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                    Extensions are what make VS Code truly powerful. Think of them as superpowers for your editor - 
                    from intelligent code completion to visual themes and debugging tools.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>⭐ Must-Have Extensions</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🧠 Coding Intelligence</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>GitHub Copilot</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>AI pair programmer that suggests entire lines and functions as you type.</p>
                            <div className="text-xs space-y-1">
                              <div><strong>Install:</strong> Search "GitHub Copilot" in Extensions</div>
                              <div><strong>Price:</strong> $10/month (free for students)</div>
                            </div>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>IntelliCode</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>AI-assisted development features that learn from thousands of open source projects.</p>
                            <div className="text-xs space-y-1">
                              <div><strong>Install:</strong> Search "IntelliCode" in Extensions</div>
                              <div><strong>Price:</strong> Free</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 Language Support</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded text-center`}>
                            <strong className="text-xs">ES7+ React/Redux/React-Native snippets</strong>
                            <p className="text-xs mt-1">JavaScript/React development</p>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded text-center`}>
                            <strong className="text-xs">Python</strong>
                            <p className="text-xs mt-1">Complete Python support</p>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded text-center`}>
                            <strong className="text-xs">Prettier</strong>
                            <p className="text-xs mt-1">Code formatter</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Extension Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Extension Lists</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://marketplace.visualstudio.com/VSCode" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code Marketplace</a></li>
                          <li>• <a href="https://www.vsixhub.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VSIXHub - Extension Discovery</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Extension Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs/editor/extension-marketplace" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Extension Management</a></li>
                          <li>• <a href="https://dev.to/thegeoffstevens/50-vs-code-extensions-for-web-developers-2021-41ok" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Top Extensions List</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vscode-step-4',
              title: 'Keyboard Shortcuts Mastery',
              description: 'Learn the essential shortcuts to code at lightning speed',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>⚡ Code at the Speed of Thought</h2>
                  <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                    Mastering keyboard shortcuts is what separates casual coders from productivity ninjas. 
                    These shortcuts will make you code faster and look like a wizard to your colleagues.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🎯 Essential Shortcuts</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🚀 Productivity Boosters</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Command Palette</span>
                                <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Ctrl+Shift+P</code>
                              </div>
                              <p className="text-xs mt-1 opacity-75">Access any VS Code command</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Quick Open</span>
                                <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Ctrl+P</code>
                              </div>
                              <p className="text-xs mt-1 opacity-75">Quickly open any file</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Multi-cursor</span>
                                <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Alt+Click</code>
                              </div>
                              <p className="text-xs mt-1 opacity-75">Edit multiple lines at once</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Toggle Terminal</span>
                                <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Ctrl+`</code>
                              </div>
                              <p className="text-xs mt-1 opacity-75">Show/hide integrated terminal</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Go to Line</span>
                                <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Ctrl+G</code>
                              </div>
                              <p className="text-xs mt-1 opacity-75">Jump to specific line number</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Split Editor</span>
                                <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">Ctrl+\\</code>
                              </div>
                              <p className="text-xs mt-1 opacity-75">Work with multiple files side by side</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Shortcut Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📄 Cheat Sheets</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Windows Shortcuts PDF</a></li>
                          <li>• <a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">macOS Shortcuts PDF</a></li>
                          <li>• <a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Linux Shortcuts PDF</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎮 Practice Tools</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.keybr.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Keyboard Training</a></li>
                          <li>• <a href="https://shortcutfoo.com/app/dojos/vscode-win" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code Shortcut Trainer</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vscode-step-5',
              title: 'Debugging Like a Pro',
              description: 'Master VS Code\'s powerful debugging capabilities',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🐛 Debug Like a Detective</h2>
                  <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                    Debugging is where good developers become great developers. VS Code's integrated debugger 
                    lets you step through your code, inspect variables, and solve problems with surgical precision.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🎯 Debugging Essentials</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔍 Core Debugging Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔴 Breakpoints</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Click in the gutter next to line numbers to pause execution at specific points.
                              </p>
                              <div className="text-xs">
                                <strong>Tip:</strong> Use conditional breakpoints for complex debugging scenarios
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>👀 Variable Inspection</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Hover over variables to see their current values, or use the Variables panel.
                              </p>
                              <div className="text-xs">
                                <strong>Tip:</strong> Add variables to Watch for continuous monitoring
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⏯️ Step Controls</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Step over, into, and out of functions to trace execution flow precisely.
                              </p>
                              <div className="text-xs">
                                <strong>Shortcuts:</strong> F10 (over), F11 (into), Shift+F11 (out)
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📞 Call Stack</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                See the chain of function calls that led to the current execution point.
                              </p>
                              <div className="text-xs">
                                <strong>Tip:</strong> Click on stack frames to jump between function contexts
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Debugging Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Learning Materials</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs/editor/debugging" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Official Debugging Guide</a></li>
                          <li>• <a href="https://www.youtube.com/watch?v=6cOsxaNC06c" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code Debugging Tutorial</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛠️ Language-Specific</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs/nodejs/nodejs-debugging" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Node.js Debugging</a></li>
                          <li>• <a href="https://code.visualstudio.com/docs/python/debugging" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Python Debugging</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vscode-step-6',
              title: 'Git Integration Mastery',
              description: 'Use VS Code\'s built-in Git features for version control',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔗 Git Like a Pro</h2>
                  <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                    VS Code's Git integration is so good, you might never need a separate Git client again. 
                    Manage repositories, track changes, and collaborate with teams directly from your editor.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>⚡ Git Workflow in VS Code</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Essential Git Features</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">📊 Source Control Panel</strong>
                              <p className="text-xs mt-1">View all changes, stage files, and create commits with one click</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🔍 Diff Viewer</strong>
                              <p className="text-xs mt-1">Side-by-side comparison of file changes with inline editing</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🌿 Branch Management</strong>
                              <p className="text-xs mt-1">Create, switch, and merge branches from the status bar</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">📝 Commit History</strong>
                              <p className="text-xs mt-1">Browse commit history and view detailed change information</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🔄 Merge Conflicts</strong>
                              <p className="text-xs mt-1">Visual merge conflict resolution with accept/reject controls</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🚀 Remote Sync</strong>
                              <p className="text-xs mt-1">Push, pull, and sync with remote repositories seamlessly</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Git Learning Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📖 Documentation</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs/editor/versioncontrol" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code Git Guide</a></li>
                          <li>• <a href="https://git-scm.com/book" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Pro Git Book (Free)</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Tutorials</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/watch?v=i_23KUAEtUM" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Git in VS Code Tutorial</a></li>
                          <li>• <a href="https://learngitbranching.js.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Interactive Git Learning</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'vscode-step-7',
              title: 'Advanced Productivity Features',
              description: 'Master advanced VS Code features for maximum productivity',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Unlock VS Code's Hidden Powers</h2>
                  <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                    Ready to become a VS Code ninja? These advanced features will transform how you work and 
                    make you incredibly productive. From workspace automation to remote development, 
                    these are the secrets that separate experts from beginners.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>⚡ Power User Features</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Advanced Editing</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">✂️ Multi-cursor Editing</strong>
                              <p className="text-xs mt-1">Select multiple occurrences (Ctrl+D) and edit them simultaneously</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">📋 Snippets</strong>
                              <p className="text-xs mt-1">Create custom code templates for repetitive patterns</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🔄 Refactoring</strong>
                              <p className="text-xs mt-1">Rename symbols, extract functions, and reorganize code safely</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">📁 Workspace Management</strong>
                              <p className="text-xs mt-1">Multi-root workspaces and project-specific settings</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🔧 Tasks &amp; Build</strong>
                              <p className="text-xs mt-1">Automate builds, tests, and deployment from VS Code</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🌐 Remote Development</strong>
                              <p className="text-xs mt-1">Code on remote servers, containers, and WSL seamlessly</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🛠️ Professional Workflow Setup</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚙️ settings.json Configuration</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "workbench.startupEditor": "none",
  "git.autofetch": true,
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Advanced Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Deep Dive</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://code.visualstudio.com/docs/remote/remote-overview" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Remote Development</a></li>
                          <li>• <a href="https://code.visualstudio.com/docs/editor/tasks" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Tasks and Build Systems</a></li>
                          <li>• <a href="https://code.visualstudio.com/docs/editor/userdefinedsnippets" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Custom Snippets</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎓 Advanced Courses</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.pluralsight.com/courses/visual-studio-code-power-user" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code Power User Course</a></li>
                          <li>• <a href="https://www.udemy.com/course/visual-studio-code-for-web-developers/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">VS Code for Web Developers</a></li>
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
              title: 'Understanding Supabase',
              description: 'Discover why Supabase is the open-source Firebase alternative developers love',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🗄️ Why Supabase is a Game Changer</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-emerald-200 dark:border-emerald-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-emerald-600 dark:text-emerald-400 mb-4`}>🚀 The Open Source Firebase Alternative</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Supabase gives you a complete backend-as-a-service platform built on PostgreSQL—the world's most advanced open-source database. 
                      Unlike Firebase, you're not locked into a proprietary system. You get real SQL, full database control, and can export 
                      your data anytime. It's like having a senior backend developer on your team who never sleeps.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 What Makes Supabase Special:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-600'}`}>🐘 Real PostgreSQL:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Not a NoSQL workaround</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-600'}`}>⚡ Real-time:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Live database changes instantly</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-600'}`}>🔓 Open Source:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> No vendor lock-in ever</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌟 Complete Backend Platform</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🗃️ Database</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Full PostgreSQL database with all advanced features: complex queries, JSON support, full-text search, 
                              and extensions. Create tables, relationships, and complex data structures with ease.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Visual table editor with relationship mapping</li>
                              <li>• SQL editor for complex queries and migrations</li>
                              <li>• Built-in backup and point-in-time recovery</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔐 Authentication</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Complete user management system that just works. Email/password, magic links, social auth (Google, GitHub, etc.), 
                              and enterprise SSO. Row Level Security keeps your data safe automatically.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• 20+ social providers built-in</li>
                              <li>• Email verification and password reset</li>
                              <li>• Automatic JWT token management</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📡 Real-time & API</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Auto-generated REST and GraphQL APIs from your database schema. Real-time subscriptions 
                              let your users see changes instantly—perfect for chat apps, collaborative tools, and dashboards.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• WebSocket-based real-time subscriptions</li>
                              <li>• Auto-generated API documentation</li>
                              <li>• PostgREST for powerful query capabilities</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>⚡ Supabase vs The Competition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>vs Firebase</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Real SQL database (not NoSQL)</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Open source & self-hostable</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Better pricing & generous free tier</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Full database control & migrations</span>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>vs Custom Backend</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>10x faster to set up and deploy</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Built-in auth, storage, and real-time</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Automatic scaling and maintenance</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Focus on features, not infrastructure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🌐 Learn More About Supabase</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Official Resources</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase Official Website</a></li>
                          <li>• <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete Documentation</a></li>
                          <li>• <a href="https://supabase.com/blog" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Engineering Blog</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Video Learning</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/c/supabase" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Official YouTube Channel</a></li>
                          <li>• <a href="https://egghead.io/courses/build-a-saas-product-with-next-js-supabase-and-stripe" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete SaaS Course</a></li>
                          <li>• <a href="https://discord.supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Community Discord</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-2',
              title: 'Project Setup & First Database',
              description: 'Create your Supabase project and build your first database schema',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 From Zero to Live Database</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-teal-50 dark:bg-teal-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-teal-200 dark:border-teal-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-teal-600 dark:text-teal-400 mb-4`}>🎯 Creating Your Supabase Project</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Setting up a Supabase project takes less than 2 minutes, and you'll have a production-ready PostgreSQL database 
                      with authentication, real-time features, and auto-generated APIs. Let's get you from complete beginner to having 
                      a working database that powers real applications.
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Step 1: Account Creation</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Visit Supabase.com</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Head to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">supabase.com</a> and click "Start your project". 
                              Sign up with GitHub (recommended) for the smoothest experience.
                            </p>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• GitHub integration gives you easy deployments later</li>
                              <li>• Free tier includes 2 projects with 500MB database each</li>
                              <li>• No credit card required to get started</li>
                              <li>• Automatic backups and SSL included</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>💡 Pro Tip: Organization Setup</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              Create an organization even for personal projects. This makes it easier to collaborate later 
                              and gives you better project management tools.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🏗️ Step 2: Project Configuration</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚙️ Essential Settings</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li><strong>Project Name:</strong> Choose something descriptive (e.g., "TaskManager" or "EcommerceStore")</li>
                              <li><strong>Database Password:</strong> Use the generated secure password (save it!)</li>
                              <li><strong>Region:</strong> Pick closest to your users for best performance</li>
                              <li><strong>Pricing Plan:</strong> Free tier is perfect for learning and small projects</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>⚡ What You Get Instantly</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="text-sm">
                                <strong>🗄️ Database:</strong> Full PostgreSQL instance
                              </div>
                              <div className="text-sm">
                                <strong>🔐 Auth:</strong> Complete user management system
                              </div>
                              <div className="text-sm">
                                <strong>📡 API:</strong> Auto-generated REST & GraphQL
                              </div>
                              <div className="text-sm">
                                <strong>⚡ Real-time:</strong> Live database subscriptions
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🗃️ Your First Database Schema</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Beginner-Friendly Example: Todo App</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Let's build a simple but complete todo app schema. This will teach you the fundamentals of database design:
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Table Creation (Visual Editor)</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Go to Table Editor → Create New Table → Name it "todos"
                            </p>
                            <div className="text-xs space-y-1">
                              <div><strong>id:</strong> int8, Primary Key, Auto-increment ✓</div>
                              <div><strong>title:</strong> text, Required ✓</div>
                              <div><strong>completed:</strong> bool, Default: false</div>
                              <div><strong>user_id:</strong> uuid, Foreign Key to auth.users</div>
                              <div><strong>created_at:</strong> timestamptz, Default: now()</div>
                              <div><strong>updated_at:</strong> timestamptz, Default: now()</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📝 Or Use SQL (For Learning)</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>🔐 Enable Row Level Security</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                              Always enable RLS! Go to Authentication → Policies → Enable RLS for todos table. 
                              This ensures users can only see their own todos automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Test Your Database</h4>
                        <div className="space-y-2">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                            <strong className="text-sm">1. Insert Test Data</strong>
                            <p className="text-xs mt-1">Use the Table Editor to add a few sample todos manually</p>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                            <strong className="text-sm">2. Try the API</strong>
                            <p className="text-xs mt-1">Visit Settings → API → copy your URL and test with curl or Postman</p>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                            <strong className="text-sm">3. Check Real-time</strong>
                            <p className="text-xs mt-1">Open two browser tabs and watch changes sync instantly</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Database Learning Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Database Design</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://supabase.com/docs/guides/database/tables" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase Table Guide</a></li>
                          <li>• <a href="https://www.postgresql.org/docs/current/tutorial.html" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PostgreSQL Tutorial</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/database/database-design" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Database Design Patterns</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛠️ Tools & Practice</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://sqlzoo.net/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">SQL Zoo (Interactive SQL Practice)</a></li>
                          <li>• <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">W3Schools SQL Tutorial</a></li>
                          <li>• <a href="https://supabase.com/docs/reference/javascript/select" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase JavaScript SDK</a></li>
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
          id: 'supabase-features',
          title: '🔧 Supabase Features',
          description: 'Explore Supabase capabilities',
          steps: [
            {
              id: 'supabase-step-3',
              title: 'Authentication System Mastery',
              description: 'Build a complete user authentication system with multiple login methods',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔐 Build Professional Authentication</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🛡️ Why Supabase Auth is Amazing</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Forget spending weeks building authentication from scratch. Supabase Auth gives you enterprise-grade user management 
                      that handles everything: registration, login, password resets, email verification, social OAuth, and even multi-factor authentication. 
                      It's like having a dedicated auth team working for you 24/7.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 What You Get Out of the Box:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>📧 Email Auth:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Complete email/password system</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>🌐 Social Login:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> 20+ providers (Google, GitHub, etc.)</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>🔒 Security:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> JWT tokens, RLS, MFA ready</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Quick Setup Guide</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Enable Email Authentication</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Go to Authentication → Settings → Enable "Enable email confirmations" 
                              This ensures only verified emails can access your app.
                            </p>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`// Basic signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Add Social Providers</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Authentication → Providers → Enable Google, GitHub, Discord, etc. 
                              Users love one-click social login!
                            </p>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`// Google login
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/dashboard'
  }
})`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3. Handle Auth State</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Listen for auth changes to update your UI automatically when users log in/out.
                            </p>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`// React example
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') setUser(session.user)
      if (event === 'SIGNED_OUT') setUser(null)
    }
  )
  return () => subscription.unsubscribe()
}, [])`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔒 Row Level Security (RLS)</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛡️ Automatic Data Security</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          RLS is like having a bouncer for your database. It automatically ensures users can only access their own data, 
                          even if your frontend code has bugs. This is enterprise-level security made simple.
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📝 Basic User Policy</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`-- Users can only see their own todos
CREATE POLICY "Users can view own todos" ON todos
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own todos  
CREATE POLICY "Users can insert own todos" ON todos
    FOR INSERT WITH CHECK (auth.uid() = user_id);`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>⚡ Policy Templates</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                              Supabase provides policy templates for common patterns: user-owned data, team-based access, 
                              public/private content, and admin-only operations. No security expertise required!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Authentication Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Auth Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://supabase.com/docs/guides/auth" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete Auth Guide</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/auth/social-login" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Social Login Setup</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Row Level Security</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Implementation Examples</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://github.com/supabase/auth-helpers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Auth Helpers (React, Next.js)</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/auth/auth-email" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Email Templates</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/auth/auth-mfa" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Multi-Factor Authentication</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'supabase-step-4',
              title: 'File Storage & Media Management',
              description: 'Master file uploads, image optimization, and media handling with Supabase Storage',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📁 Professional File Storage</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-emerald-50 dark:bg-emerald-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-emerald-200 dark:border-emerald-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-emerald-600 dark:text-emerald-400 mb-4`}>🚀 Why Supabase Storage is a Game-Changer</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Forget the complexity of setting up AWS S3, configuring CDNs, or managing file permissions. Supabase Storage gives you 
                      enterprise-grade file handling with the simplicity of a few lines of code. Upload images, videos, documents, and any 
                      file type with automatic optimization, global CDN distribution, and fine-grained access control.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✨ Enterprise Features Made Simple:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-600'}`}>⚡ Global CDN:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Lightning-fast file delivery worldwide</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-600'}`}>🖼️ Auto Optimization:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Smart image resizing & compression</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-emerald-300' : 'text-emerald-600'}`}>🔒 Smart Security:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Row-level access control</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📤 File Upload Mastery</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. 🪣 Create Storage Buckets</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Think of buckets as organized folders for different file types. Create separate buckets for avatars, 
                              documents, videos, etc. Each bucket can have its own access rules and policies.
                            </p>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`// Create bucket via Dashboard: Storage → New Bucket
// Or via code:
const { data, error } = await supabase
  .storage
  .createBucket('avatars', {
    public: true, // Public access
    fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
  })`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. ⬆️ Smart File Upload</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Upload files with automatic unique naming, progress tracking, and error handling. Supabase handles all the complexity.
                            </p>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`// Simple file upload
const uploadFile = async (file) => {
  const fileName = \`\${Date.now()}-\${file.name}\`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) throw error;
  return data.path; // Returns file path
}`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3. 🖼️ Image Transformation</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Get optimized images for any use case - thumbnails, hero images, mobile versions - all automatically generated.
                            </p>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`// Get public URL with transformations
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-avatar.jpg', {
    transform: {
      width: 200,
      height: 200,
      resize: 'cover',
      quality: 80
    }
  });

console.log(data.publicUrl); // Optimized image URL`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔒 Storage Security & Access Control</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛡️ Row Level Security for Files</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Just like your database, storage buckets can use RLS policies to control who can upload, view, or delete files. 
                          This means users can only access their own files automatically.
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>👤 User-Owned Files Policy</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono`}>
                              {`-- Users can only upload to their own folder
CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text);

-- Users can only view their own files
CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text);`}
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>🌍 Public vs Private Files</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                              Public buckets: Perfect for profile pictures, blog images, marketing assets.
                              Private buckets: Ideal for user documents, private photos, sensitive files. Access controlled by your policies.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🎯 Complete Upload Component Example</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📱 React Upload Component</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-xs font-mono max-h-60 overflow-y-auto`}>
                          {`import { useState } from 'react';
import { supabase } from './supabase';

export const FileUpload = ({ bucket, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      
      if (!file) return;
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = \`\${Math.random()}.\${fileExt}\`;
      const filePath = \`\${user.id}/\${fileName}\`;
      
      // Upload with progress tracking
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setProgress(Math.round(progress.loaded / progress.total * 100));
          }
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
        
      onUpload(data.publicUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="upload-component">
      <input
        type="file"
        accept="image/*"
        onChange={uploadFile}
        disabled={uploading}
      />
      {uploading && (
        <div className="progress-bar">
          <div style={{ width: \`\${progress}%\` }}>
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
};`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Storage Learning Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Official Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://supabase.com/docs/guides/storage" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete Storage Guide</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/storage/uploads" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">File Upload Tutorials</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/storage/image-transformations" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Image Transformations</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Practical Examples</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://supabase.com/docs/guides/storage/cdn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">CDN & Performance</a></li>
                          <li>• <a href="https://github.com/supabase/supabase/tree/master/examples/storage" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Storage Examples</a></li>
                          <li>• <a href="https://supabase.com/docs/guides/storage/security" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Storage Security Patterns</a></li>
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
              description: 'Discover what makes Lovable the future of AI-powered development',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>💖 Why Lovable Changes Everything</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-pink-50 dark:bg-pink-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-pink-200 dark:border-pink-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-pink-600 dark:text-pink-400 mb-4`}>🚀 The AI-First Development Platform</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Lovable isn't just another no-code platform—it's a revolutionary AI-powered development environment that lets you build 
                      full-stack applications through natural conversation. Imagine describing your app idea in plain English and watching 
                      it come to life with modern React, TypeScript, and professional-grade architecture.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 What Makes Lovable Special:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-pink-300' : 'text-pink-600'}`}>🤖 AI Architect:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Designs entire app structures for you</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-pink-300' : 'text-pink-600'}`}>⚡ Real Code:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Generates production-ready React & TypeScript</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-pink-300' : 'text-pink-600'}`}>🎨 Full Stack:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Frontend, backend, database, and deployment</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌟 Core Lovable Features</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💬 Natural Language Development</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Simply describe what you want: "Create a task management app with user authentication and real-time collaboration" 
                              and Lovable builds it with proper architecture, clean code, and best practices.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Understands complex feature requirements</li>
                              <li>• Implements modern design patterns automatically</li>
                              <li>• Handles state management and routing intelligently</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏗️ Intelligent Architecture</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Lovable doesn't just generate random code—it creates well-structured applications with proper component 
                              hierarchy, efficient data flow, and scalable architecture that follows industry standards.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Component-based React architecture</li>
                              <li>• TypeScript for type safety and better code</li>
                              <li>• Modern CSS with Tailwind for responsive design</li>
                              <li>• Optimized performance and SEO considerations</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Iterative Development</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              The real magic happens when you iterate. Ask for changes, add features, or modify existing functionality, 
                              and Lovable understands the context and makes intelligent updates without breaking existing code.
                            </p>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Contextual code modifications</li>
                              <li>• Safe refactoring and feature additions</li>
                              <li>• Maintains code quality during iterations</li>
                              <li>• Preserves custom modifications you make</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 How Lovable Compares</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>vs Traditional No-Code</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Generates real, exportable code</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>No vendor lock-in or platform limitations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Professional-grade architecture</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Unlimited customization potential</span>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>vs Traditional Coding</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>10x faster development speed</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>No need to learn complex frameworks</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Built-in best practices and optimizations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Perfect for both beginners and experts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🌐 Learn More About Lovable</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Official Resources</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://lovable.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lovable Official Website</a></li>
                          <li>• <a href="https://docs.lovable.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lovable Documentation</a></li>
                          <li>• <a href="https://lovable.dev/examples" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Example Applications</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Video Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/watch?v=lovable-intro" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lovable in 5 Minutes</a></li>
                          <li>• <a href="https://www.youtube.com/playlist?list=lovable-tutorials" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete Tutorial Series</a></li>
                          <li>• <a href="https://discord.gg/lovable" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Community Discord</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'lovable-step-2',
              title: 'Account Setup & First Project',
              description: 'Get started with Lovable and create your first AI-powered application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 From Zero to Your First App</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-4`}>📝 Getting Your Lovable Account</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Setting up Lovable is incredibly simple and you can start building immediately. Let's get you from complete beginner 
                      to having your first AI-generated application running in under 30 minutes.
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Step 1: Account Creation</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌐 Visit Lovable.dev</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Head to <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">lovable.dev</a> and click the "Get Started" button. 
                              You'll be amazed at how intuitive the onboarding process is.
                            </p>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Sign up with Google, GitHub, or email (takes 30 seconds)</li>
                              <li>• Choose your subscription plan (free tier available)</li>
                              <li>• Complete the quick welcome survey about your goals</li>
                              <li>• Explore the interactive dashboard tutorial</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>💡 Pro Tip: Free Tier Benefits</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              The free tier is surprisingly generous! You get enough credits to build 2-3 complete applications, 
                              perfect for learning and experimenting with different ideas.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🏗️ Step 2: Your First Project</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎨 Project Creation Made Simple</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                              Click "New Project" and you'll see the magic happen. Instead of complex setup wizards, 
                              you simply describe what you want to build in natural language.
                            </p>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• Choose a descriptive project name</li>
                              <li>• Select your preferred tech stack (React + TypeScript recommended)</li>
                              <li>• Describe your app idea in the chat interface</li>
                              <li>• Watch as Lovable generates your initial application structure</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>✨ Perfect Beginner Projects</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <strong className="text-xs">📝 Personal Blog</strong>
                                <p className="text-xs mt-1">Simple, clean, great for learning</p>
                              </div>
                              <div>
                                <strong className="text-xs">📋 Todo App</strong>
                                <p className="text-xs mt-1">Classic project with CRUD operations</p>
                              </div>
                              <div>
                                <strong className="text-xs">🍕 Restaurant Menu</strong>
                                <p className="text-xs mt-1">Interactive menu with ordering</p>
                              </div>
                              <div>
                                <strong className="text-xs">💼 Portfolio Site</strong>
                                <p className="text-xs mt-1">Showcase your work professionally</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🎯 Your First AI Conversation</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💬 Example: Building a Task Manager</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm`}>
                            <div className="mb-2"><strong className="text-blue-500">You:</strong> "I want to create a task management app for teams"</div>
                            <div className="mb-2"><strong className="text-green-500">Lovable:</strong> "Great idea! I'll create a collaborative task manager with user authentication, team workspaces, and real-time updates. Let me build this for you..."</div>
                            <div className="text-xs opacity-75 mt-2">⚡ In 2-3 minutes, you'll have a fully functional app with:</div>
                            <ul className="text-xs mt-1 space-y-1 opacity-75">
                              <li>• User registration and login system</li>
                              <li>• Team creation and member management</li>
                              <li>• Task creation, assignment, and status tracking</li>
                              <li>• Real-time collaboration features</li>
                              <li>• Professional UI with responsive design</li>
                            </ul>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🎨 Then You Can Iterate</h5>
                            <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              "Add a calendar view for due dates" → "Include file attachments for tasks" → "Add time tracking features"<br/>
                              Each request builds upon your existing app intelligently!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Getting Started Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Setup Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://docs.lovable.dev/getting-started" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Official Getting Started Guide</a></li>
                          <li>• <a href="https://lovable.dev/tutorials/first-project" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Your First Project Tutorial</a></li>
                          <li>• <a href="https://lovable.dev/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Pricing &amp; Plan Comparison</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>👥 Community &amp; Support</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://discord.gg/lovable" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Join the Discord Community</a></li>
                          <li>• <a href="https://www.reddit.com/r/lovable" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Reddit Community</a></li>
                          <li>• <a href="https://lovable.dev/support" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Help Center &amp; Support</a></li>
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
          id: 'lovable-development',
          title: '🚀 Development',
          description: 'Build apps with Lovable',
          steps: [
            {
              id: 'lovable-step-3',
              title: 'AI-Powered Development Mastery',
              description: 'Master the art of communicating with AI to build amazing applications',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🧠 Become an AI Development Wizard</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>💬 The Art of AI Communication</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Talking to Lovable's AI isn't like coding—it's like having a conversation with an incredibly smart developer who 
                      understands your vision and can build it instantly. The secret is knowing how to communicate your ideas clearly 
                      and iteratively to get exactly what you want.
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 The CLEAR Prompting Framework</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Use this proven framework to get better results from Lovable's AI:
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500 text-lg">C</span>
                            <div>
                              <strong className={`${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Context:</strong>
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Explain what type of app you're building and who it's for</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500 text-lg">L</span>
                            <div>
                              <strong className={`${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Layout:</strong>
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Describe the visual structure and user interface</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500 text-lg">E</span>
                            <div>
                              <strong className={`${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Examples:</strong>
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Reference similar apps or specific features you want</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500 text-lg">A</span>
                            <div>
                              <strong className={`${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Actions:</strong>
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Detail what users should be able to do</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500 text-lg">R</span>
                            <div>
                              <strong className={`${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Requirements:</strong>
                              <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Specify technical needs or constraints</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>✨ Real Prompting Examples</h4>
                        <div className="space-y-4">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚫 Vague Prompt (Don't do this)</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-red-50 dark:bg-red-900/20'} p-2 rounded text-sm`}>
                              "Make me a website for my business"
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mt-2`}>
                              Too vague - the AI doesn't know what kind of business, what features you need, or how it should look.
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Perfect Prompt (Do this)</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-green-50 dark:bg-green-900/20'} p-2 rounded text-sm`}>
                              "Create a modern fitness coaching website where personal trainers can showcase their services, clients can book sessions, and both can track workout progress. Include a hero section with testimonials, service packages with pricing, an online booking calendar, and a client dashboard for tracking workouts. Make it look professional like Nike Training Club but focused on personal training services."
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mt-2`}>
                              Perfect! Clear context, specific features, visual reference, and defined user actions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔄 Iterative Development Process</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 The Build-Test-Improve Cycle</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-center`}>
                              <div className="text-2xl mb-2">🏗️</div>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>1. Build Foundation</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Start with core functionality and basic layout</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-center`}>
                              <div className="text-2xl mb-2">🧪</div>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>2. Test & Explore</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Try the app, find what's missing or could be better</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-center`}>
                              <div className="text-2xl mb-2">⬆️</div>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-1`}>3. Improve & Add</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>Request specific improvements and new features</p>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>💡 Pro Development Tips</h5>
                            <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                              <li>• Start simple, then add complexity gradually</li>
                              <li>• Test each major feature before adding the next</li>
                              <li>• Be specific about improvements: "Make the login button bigger and blue"</li>
                              <li>• Ask for explanations: "Why did you choose this approach?"</li>
                              <li>• Request alternatives: "Show me 3 different ways to display this data"</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 AI Development Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Prompting Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://docs.lovable.dev/prompting-guide" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Official Prompting Guide</a></li>
                          <li>• <a href="https://www.promptingguide.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Prompt Engineering Guide</a></li>
                          <li>• <a href="https://lovable.dev/examples/prompts" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Example Prompts Library</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Best Practices</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.anthropic.com/claude/prompt-engineering" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">AI Communication Best Practices</a></li>
                          <li>• <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Advanced Prompting Techniques</a></li>
                          <li>• <a href="https://lovable.dev/blog/development-tips" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lovable Development Tips</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'lovable-step-4',
              title: 'Design & UI Customization',
              description: 'Create beautiful, professional interfaces with Lovable\'s design system',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🎨 Design Like a Pro</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🖌️ Making Your App Look Amazing</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      One of Lovable's superpowers is creating beautiful, professional-looking applications automatically. But you're not 
                      stuck with the defaults! Learn how to customize colors, layouts, fonts, and entire design systems to match your 
                      vision perfectly. No design experience required—just clear communication about what you want.
                    </p>
                    
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Design Request Framework</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                          Use these proven patterns to get the exact design you want:
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎨 Color & Branding</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-orange-50 dark:bg-orange-900/20'} p-2 rounded text-sm mb-2`}>
                              "Change the color scheme to a modern tech company feel - use deep blues (#1E40AF) as primary, light grays for backgrounds, and bright green (#10B981) for call-to-action buttons. Make it look like Stripe's design system."
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              ✅ Specific colors, reference point, clear use cases
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📱 Layout & Structure</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-orange-50 dark:bg-orange-900/20'} p-2 rounded text-sm mb-2`}>
                              "Redesign the homepage with a hero section featuring a large heading, subtext, and two buttons side-by-side. Below that, add a three-column feature section with icons, then testimonials in a carousel format."
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              ✅ Clear section breakdown, specific layout requirements
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✨ Style References</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-orange-50 dark:bg-orange-900/20'} p-2 rounded text-sm mb-2`}>
                              "Make the design minimalist and clean like Notion's interface - lots of white space, subtle shadows, rounded corners, and simple typography. Use icons from Lucide React."
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              ✅ Style direction, specific reference, icon library preference
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 Advanced Customization Techniques</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🌈 Custom Color Palettes</strong>
                              <p className="text-xs mt-1">Request specific hex codes, gradients, or color psychology-based schemes</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">📐 Responsive Design</strong>
                              <p className="text-xs mt-1">Specify mobile, tablet, and desktop layouts separately</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🎭 Animation & Interactions</strong>
                              <p className="text-xs mt-1">Add hover effects, loading states, and smooth transitions</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🔤 Typography Systems</strong>
                              <p className="text-xs mt-1">Choose fonts, sizes, and hierarchy for different content types</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🖼️ Image & Media</strong>
                              <p className="text-xs mt-1">Specify placeholder styles, aspect ratios, and gallery layouts</p>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-2 rounded`}>
                              <strong className="text-sm">🔘 Form Styling</strong>
                              <p className="text-xs mt-1">Customize inputs, buttons, and validation states</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-4`}>🎨 Design Inspiration & Trends</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌟 Popular Design Styles to Request</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏢 Modern SaaS</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Clean, professional, trust-building design like Stripe, Linear, or Figma
                              </p>
                              <div className="text-xs">
                                <strong>Keywords:</strong> minimal, professional, trustworthy, enterprise
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌈 Vibrant Consumer</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Colorful, engaging, fun design like Spotify, Discord, or TikTok
                              </p>
                              <div className="text-xs">
                                <strong>Keywords:</strong> colorful, playful, engaging, youthful
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏛️ Classic Elegant</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Sophisticated, timeless design like Apple, Tesla, or luxury brands
                              </p>
                              <div className="text-xs">
                                <strong>Keywords:</strong> elegant, sophisticated, premium, timeless
                              </div>
                            </div>
                            <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                              <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌿 Organic Modern</h5>
                              <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                                Natural, calming design with earth tones and organic shapes
                              </p>
                              <div className="text-xs">
                                <strong>Keywords:</strong> natural, organic, calming, sustainable
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 Design Resources & Inspiration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 Design Inspiration</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://dribbble.com/shots/popular/web-design" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Dribbble Web Design</a></li>
                          <li>• <a href="https://www.awwwards.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Awwwards (Award-winning sites)</a></li>
                          <li>• <a href="https://mobbin.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mobbin (App UI Patterns)</a></li>
                          <li>• <a href="https://www.behance.net/search/projects?field=ui%2Fux" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Behance UI/UX Gallery</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛠️ Design Tools & Resources</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://coolors.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Coolors (Color Palette Generator)</a></li>
                          <li>• <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Fonts</a></li>
                          <li>• <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lucide Icons</a></li>
                          <li>• <a href="https://tailwindcss.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Tailwind CSS Documentation</a></li>
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
              title: 'Understanding APIs & HTTP Fundamentals',
              description: 'Master the core concepts of APIs, REST architecture, and HTTP protocols',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🌐 API Fundamentals - Your Gateway to Connected Apps</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🤔 What Are APIs & Why Should You Care?</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      APIs (Application Programming Interfaces) are like waiters in a restaurant. You don't need to know how the kitchen works, 
                      you just tell the waiter what you want and they bring it to you. APIs let different apps talk to each other - 
                      like how your weather app gets data from a weather service, or how you can log into websites using your Google account.
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌟 APIs You Use Every Day:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>📱 Social Media:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Posting to Twitter, Facebook</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>💳 Payments:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Stripe, PayPal, Apple Pay</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🗺️ Maps:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Google Maps, GPS navigation</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🌤️ Weather:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Weather forecasts in apps</span>
                        </div>
                      </div>
                    </div>

                    <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                      <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔧 HTTP Methods - The API Verbs</h4>
                      <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                        Think of HTTP methods as different actions you can perform. Like different buttons on a remote control - each does something specific.
                      </p>
                      <div className="space-y-3">
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${theme === 'gradient' ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-800'}`}>GET</span>
                            <span className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📖 Read Data</span>
                          </div>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Like asking "What's in the fridge?" - Gets information without changing anything.
                            Example: Getting a list of your tweets, fetching user profiles, loading product details.
                          </p>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${theme === 'gradient' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>POST</span>
                            <span className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>➕ Create New</span>
                          </div>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Like adding new food to the fridge - Creates something new.
                            Example: Posting a new tweet, creating a user account, uploading a photo.
                          </p>
                        </div>
                        
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${theme === 'gradient' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'}`}>DELETE</span>
                            <span className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🗑️ Remove</span>
                          </div>
                          <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                            Like throwing away expired food - Removes something completely.
                            Example: Deleting a tweet, removing a photo, canceling an account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🌐 Learn More About APIs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Beginner Resources</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://restfulapi.net/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">REST API Tutorial</a></li>
                          <li>• <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HTTP Status Codes Guide</a></li>
                          <li>• <a href="https://httpstatuses.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HTTP Status Reference</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Video Learning</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/watch?v=GZvSYJDk-us" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">What is a REST API?</a></li>
                          <li>• <a href="https://www.youtube.com/watch?v=iYM2zFP3Zn0" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HTTP Crash Course</a></li>
                          <li>• <a href="https://www.freecodecamp.org/news/http-and-everything-you-need-to-know-about-it/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete HTTP Guide</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'api-tester-step-2',
              title: 'API Testing Tools Mastery',
              description: 'Master Postman, Insomnia, Thunder Client, and browser-based testing',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🛠️ API Testing Arsenal - Your Developer Superpowers</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🚀 Why You Need API Testing Tools</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      API testing tools are like a Swiss Army knife for developers. Instead of writing code just to test if an API works, 
                      these tools let you send requests, check responses, and debug issues with a simple interface. Think of them as your 
                      API playground where you can experiment and learn without any coding required!
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✨ What These Tools Do For You:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>🎯 Easy Testing:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Point, click, send requests</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>📊 Beautiful Results:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Formatted JSON responses</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>💾 Save Everything:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Organize requests in collections</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>🔄 Automation:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Run tests automatically</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🥇 Top API Testing Tools Compared</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>1. 📮 Postman - The Industry Standard</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💪 Why Choose Postman?</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• <strong>Beginner-Friendly:</strong> Intuitive interface, easy to start</li>
                              <li>• <strong>Powerful Features:</strong> Collections, environments, pre/post scripts</li>
                              <li>• <strong>Team Collaboration:</strong> Share collections with teammates</li>
                              <li>• <strong>Documentation:</strong> Auto-generate API documentation</li>
                              <li>• <strong>Free Version:</strong> Plenty of features without paying</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🚀 Quick Start Guide</h5>
                            <ol className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>1. Download from <a href="https://www.postman.com/downloads/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">postman.com</a></li>
                              <li>2. Create free account (optional but recommended)</li>
                              <li>3. Click "New" → "HTTP Request"</li>
                              <li>4. Enter URL (try: https://jsonplaceholder.typicode.com/posts)</li>
                              <li>5. Click "Send" and see the magic! ✨</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>2. 😴 Insomnia - The Sleek Alternative</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎨 Why Developers Love Insomnia?</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• <strong>Clean Interface:</strong> Minimal, distraction-free design</li>
                              <li>• <strong>Fast Performance:</strong> Lightweight and quick to load</li>
                              <li>• <strong>GraphQL Support:</strong> Great for modern APIs</li>
                              <li>• <strong>Themes:</strong> Dark mode that actually looks good</li>
                              <li>• <strong>Free Forever:</strong> Core features always free</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-orange-50 dark:bg-orange-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-orange-800 dark:text-orange-200'} mb-2`}>⚡ Get Started</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Download from <a href="https://insomnia.rest/download" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">insomnia.rest</a> - 
                              Perfect if you want something simpler than Postman but still powerful.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>3. ⚡ Thunder Client - VS Code Extension</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Perfect for VS Code Users</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• <strong>No App Switching:</strong> Test APIs without leaving VS Code</li>
                              <li>• <strong>Lightweight:</strong> Just an extension, not a separate app</li>
                              <li>• <strong>Quick Setup:</strong> Install and start testing immediately</li>
                              <li>• <strong>Perfect for Coding:</strong> Test while you develop</li>
                            </ul>
                          </div>
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🔌 Install in 30 Seconds</h5>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Open VS Code → Extensions → Search "Thunder Client" → Install → Look for the thunder icon in sidebar!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🎯 Your First API Test - Let's Get Hands-On!</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🧪 Test These Free APIs (No Signup Required!)</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📝 JSONPlaceholder - Perfect for Learning</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono mb-2`}>
                              GET https://jsonplaceholder.typicode.com/posts
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Returns 100 fake blog posts - perfect for testing! Try changing "posts" to "users" or "comments".
                            </p>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🐱 Cat Facts API - Fun Data!</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono mb-2`}>
                              GET https://catfact.ninja/fact
                            </div>
                            <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              Get random cat facts! Hit this endpoint multiple times to see different responses.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🔗 Learning Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Tool Documentation</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://learning.postman.com/docs/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Postman Learning Center</a></li>
                          <li>• <a href="https://docs.insomnia.rest/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Insomnia Documentation</a></li>
                          <li>• <a href="https://github.com/rangav/thunder-client-support" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Thunder Client Guide</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Video Tutorials</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/watch?v=VywxIQ2ZXw4" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Postman Beginner Tutorial</a></li>
                          <li>• <a href="https://www.youtube.com/watch?v=fzLPHpOP3Wc" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">API Testing Crash Course</a></li>
                          <li>• <a href="https://www.youtube.com/watch?v=CLG0ha_a0q8" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Thunder Client Tutorial</a></li>
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
          id: 'api-advanced',
          title: '⚡ Advanced Testing',
          description: 'Advanced API testing techniques',
          steps: [
            {
              id: 'api-tester-step-3',
              title: 'Authentication & Security Testing',
              description: 'Master API authentication with JWT, OAuth, API keys, and advanced security testing',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔐 API Authentication Mastery</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🛡️ Why API Authentication Matters</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      API authentication is like having a bouncer at a VIP club - it ensures only authorized users can access protected resources. 
                      Different APIs use different "ID cards" (authentication methods), and as an API tester, you need to know how to present 
                      the right credentials for each situation. This isn't just about making requests work - it's about understanding security!
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Common Authentication Types You'll Encounter:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>🔑 API Keys:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Simple, permanent tokens</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>🎫 JWT Tokens:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Self-contained, secure tokens</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>🌐 OAuth 2.0:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Social login & third-party apps</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>👤 Basic Auth:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Username & password (legacy)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔑 API Key Authentication - The Simplest Method</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💡 How API Keys Work</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          API keys are like permanent membership cards. You get one from the service, and you include it with every request. 
                          They're simple but powerful - perfect for server-to-server communication or when you need consistent access.
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📍 Three Common Ways to Send API Keys</h5>
                            <div className="space-y-2 text-xs">
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-700'}`}>1. In Headers (Most Common):</strong>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded mt-1 font-mono`}>
                                  {`Authorization: Bearer sk-1234567890abcdef
X-API-Key: your-api-key-here
Api-Key: your-secret-key`}
                                </div>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-green-50 dark:bg-green-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-green-300' : 'text-green-700'}`}>2. As Query Parameter:</strong>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded mt-1 font-mono`}>
                                  {`GET /api/users?api_key=your-key-here
GET /weather?appid=your-openweather-key`}
                                </div>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-purple-300' : 'text-purple-700'}`}>3. In Request Body (Less Common):</strong>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded mt-1 font-mono`}>
                                  {`{
  "api_key": "your-key-here",
  "data": { ... }
}`}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>🧪 Try These Free APIs with API Keys</h5>
                            <div className="space-y-2 text-xs">
                              <div>
                                <strong>OpenWeatherMap:</strong> <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Get free API key</a>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-1 rounded mt-1 font-mono`}>
                                  GET https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY
                                </div>
                              </div>
                              <div>
                                <strong>NewsAPI:</strong> <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Get free API key</a>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-1 rounded mt-1 font-mono`}>
                                  Header: X-API-Key: YOUR_KEY
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🎫 JWT (JSON Web Tokens) - Modern & Secure</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Understanding JWT Authentication</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-4`}>
                          JWT is like a temporary VIP pass that contains your identity and permissions. Unlike API keys, JWTs expire and 
                          contain information about who you are and what you can do. They're perfect for user authentication in web apps.
                        </p>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 JWT Authentication Flow</h5>
                            <ol className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>1. **Login**: Send username/password to /login endpoint</li>
                              <li>2. **Receive Token**: Server returns JWT token if credentials are valid</li>
                              <li>3. **Store Token**: Save JWT in your testing tool or app</li>
                              <li>4. **Use Token**: Include JWT in Authorization header for protected requests</li>
                              <li>5. **Token Expires**: Get new token when current one expires</li>
                            </ol>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>📝 JWT Testing Example</h5>
                            <div className="space-y-2 text-xs">
                              <div>
                                <strong>Step 1 - Login Request:</strong>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded mt-1 font-mono`}>
                                  {`POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}`}
                                </div>
                              </div>
                              <div>
                                <strong>Step 2 - Use Token:</strong>
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded mt-1 font-mono`}>
                                  {`GET /api/protected-resource
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-orange-50 dark:bg-orange-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-orange-800 dark:text-orange-200'} mb-2`}>🔍 JWT Debugging Tips</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• **Decode JWTs**: Use <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">jwt.io</a> to see what's inside your token</li>
                              <li>• **Check Expiration**: Look for 'exp' field in decoded token</li>
                              <li>• **Verify Format**: JWT has 3 parts separated by dots (header.payload.signature)</li>
                              <li>• **401 Errors**: Usually means token is expired or invalid</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🔧 Advanced Authentication Testing</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>✅ Authentication Testing Checklist</h4>
                        <div className="space-y-3">
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1 rounded" />
                            <div>
                              <span className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Test Valid Credentials</span>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                Verify that correct API keys/tokens work as expected
                              </p>
                            </div>
                          </label>
                          
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1 rounded" />
                            <div>
                              <span className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Test Invalid Credentials</span>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                Ensure wrong keys return proper 401/403 error responses
                              </p>
                            </div>
                          </label>
                          
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1 rounded" />
                            <div>
                              <span className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Test Missing Authentication</span>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                Try protected endpoints without any auth headers
                              </p>
                            </div>
                          </label>
                          
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1 rounded" />
                            <div>
                              <span className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Test Token Expiration</span>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                For JWTs, test with expired tokens to verify proper handling
                              </p>
                            </div>
                          </label>
                          
                          <label className="flex items-start space-x-3">
                            <input type="checkbox" className="mt-1 rounded" />
                            <div>
                              <span className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Test Permission Levels</span>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                                Verify that different user roles have appropriate access
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🔗 Authentication Learning Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Deep Dive Guides</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://jwt.io/introduction/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">JWT Introduction & Decoder</a></li>
                          <li>• <a href="https://auth0.com/learn/json-web-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete JWT Guide</a></li>
                          <li>• <a href="https://oauth.net/2/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OAuth 2.0 Specification</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎥 Practical Tutorials</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://www.youtube.com/watch?v=7Q17ubqLfaM" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">JWT Explained Simply</a></li>
                          <li>• <a href="https://www.youtube.com/watch?v=996OiexHze0" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OAuth 2.0 Explained</a></li>
                          <li>• <a href="https://learning.postman.com/docs/sending-requests/authorization/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Postman Auth Guide</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'api-tester-step-4',
              title: 'Request Building & Response Analysis',
              description: 'Master crafting perfect API requests and analyzing responses like a pro',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔧 Perfect Request Building & Response Analysis</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 The Art of API Request Building</h3>
                    <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Building API requests is like crafting the perfect message. You need the right address (URL), proper identification (headers), 
                      the correct format (Content-Type), and your actual message (body). Get any piece wrong, and your request might fail or 
                      return unexpected results. Let's master each component!
                    </p>
                    
                    <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                      <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🏗️ Anatomy of a Perfect API Request:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🌐 URL Structure:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Protocol + Domain + Path + Parameters</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>📋 Headers:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Authentication, Content-Type, Accept</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>📦 Request Body:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> JSON, XML, Form data, Files</span>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🔧 Query Params:</span>
                          <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Filters, pagination, sorting</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔗 URL Building Mastery</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🏗️ URL Structure Breakdown</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📍 Complete URL Example</h5>
                            <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-gray-200 dark:bg-gray-600'} p-2 rounded text-xs font-mono mb-2`}>
                              https://api.example.com/v1/users/123/posts?page=2&limit=10&sort=date
                            </div>
                            <div className="space-y-1 text-xs">
                              <div><span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>Protocol:</span> <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>https://</span></div>
                              <div><span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>Domain:</span> <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>api.example.com</span></div>
                              <div><span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>Version:</span> <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>/v1</span></div>
                              <div><span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>Resource Path:</span> <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>/users/123/posts</span></div>
                              <div><span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>Query Params:</span> <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>?page=2&limit=10&sort=date</span></div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🎯 Common Query Parameter Patterns</h5>
                            <div className="space-y-2 text-xs">
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-white/50'} p-2 rounded`}>
                                <strong>Pagination:</strong> <code className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>?page=1&limit=20&offset=0</code>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-white/50'} p-2 rounded`}>
                                <strong>Filtering:</strong> <code className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>?status=active&category=tech&min_price=100</code>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-white/50'} p-2 rounded`}>
                                <strong>Sorting:</strong> <code className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>?sort=created_at&order=desc</code>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-white/50'} p-2 rounded`}>
                                <strong>Fields:</strong> <code className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>?fields=id,name,email&include=profile</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>📋 Headers & Content Types</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎭 Essential Headers You Must Know</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔧 Request Headers</h5>
                            <div className="space-y-2 text-xs">
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-purple-50 dark:bg-purple-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>Content-Type:</strong> Tells the server what format your data is in
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-1 rounded mt-1 font-mono`}>
                                  application/json | application/xml | multipart/form-data
                                </div>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-blue-50 dark:bg-blue-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>Accept:</strong> Tells the server what format you want back
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-1 rounded mt-1 font-mono`}>
                                  application/json | application/xml | text/html
                                </div>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-gray-500/20' : 'bg-green-50 dark:bg-green-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>User-Agent:</strong> Identifies your application
                                <div className={`${theme === 'gradient' ? 'bg-gray-400/20' : 'bg-gray-200 dark:bg-gray-600'} p-1 rounded mt-1 font-mono`}>
                                  MyApp/1.0 | PostmanRuntime/7.29.0
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>💡 Pro Header Tips</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• **Case Insensitive**: "Content-Type" = "content-type" = "CONTENT-TYPE"</li>
                              <li>• **Custom Headers**: Many APIs use X-Custom-Header for special features</li>
                              <li>• **Required vs Optional**: Read API docs to know which headers are mandatory</li>
                              <li>• **Multiple Values**: Some headers can have multiple values separated by commas</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>📊 Response Analysis Like a Pro</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔍 What to Look For in API Responses</h4>
                        <div className="space-y-3">
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚦 Status Code Analysis</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className={`${theme === 'gradient' ? 'bg-green-500/20' : 'bg-green-50 dark:bg-green-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>2xx Success</strong>
                                <div>200 OK - Perfect! 🎉</div>
                                <div>201 Created - New resource made ✨</div>
                                <div>204 No Content - Success, no data 📭</div>
                              </div>
                              <div className={`${theme === 'gradient' ? 'bg-red-500/20' : 'bg-red-50 dark:bg-red-900/30'} p-2 rounded`}>
                                <strong className={`${theme === 'gradient' ? 'text-red-300' : 'text-red-600'}`}>4xx Client Errors</strong>
                                <div>400 Bad Request - Fix your data 🔧</div>
                                <div>401 Unauthorized - Need login 🔐</div>
                                <div>404 Not Found - Wrong URL 🤷</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>📈 Performance Metrics to Check</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><strong>Response Time:</strong> Under 200ms = Excellent ⚡</div>
                              <div><strong>Response Size:</strong> Smaller = Better 📦</div>
                              <div><strong>Headers Count:</strong> Watch for bloat 📋</div>
                              <div><strong>Cache Headers:</strong> Check expiration ⏱️</div>
                            </div>
                          </div>
                          
                          <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                            <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>🔬 JSON Response Analysis Tips</h5>
                            <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                              <li>• **Data Structure**: Is it an object, array, or nested structure?</li>
                              <li>• **Required Fields**: Are all expected fields present?</li>
                              <li>• **Data Types**: Numbers as numbers, not strings?</li>
                              <li>• **Null Handling**: How are missing values represented?</li>
                              <li>• **Pagination Info**: Look for total, page, hasMore fields</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-indigo-50 dark:bg-indigo-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-indigo-200 dark:border-indigo-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-4`}>🔗 Testing Resources & Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛠️ Testing Tools</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://httpbin.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HTTPBin - Test Different Request Types</a></li>
                          <li>• <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">JSONPlaceholder - Mock API</a></li>
                          <li>• <a href="https://postman-echo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Postman Echo - Request Testing</a></li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📚 Learning Materials</h4>
                        <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Complete HTTP Headers Reference</a></li>
                          <li>• <a href="https://restfulapi.net/http-methods/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HTTP Methods Deep Dive</a></li>
                          <li>• <a href="https://www.youtube.com/watch?v=iYM2zFP3Zn0" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HTTP Protocol Explained</a></li>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🛠️ Setting Up Your Build Monitoring Dashboard</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Configure monitoring dashboards and alerts to track your build health effectively.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🎯 Platform Selection Guide</h3>
                    <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Choose the right monitoring platform for your needs:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🆓 GitHub Actions (Free)</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Perfect for GitHub-hosted projects with built-in insights and workflow monitoring.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 CircleCI Insights</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Advanced analytics with detailed performance breakdowns and optimization tips.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>📊 Dashboard Configuration</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Essential Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Build success rate tracking</li>
                          <li>• Average build duration monitoring</li>
                          <li>• Failure frequency analysis</li>
                          <li>• Resource usage optimization</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔔 Alert Configuration</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Immediate build failure notifications</li>
                          <li>• Performance threshold alerts</li>
                          <li>• Dependency update warnings</li>
                          <li>• Custom webhook integrations</li>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📈 Build Performance Analytics</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Master the art of analyzing and optimizing your build pipeline performance.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 Key Performance Metrics</h3>
                    <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Track these essential metrics to identify bottlenecks and optimization opportunities:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⏱️ Build Time Metrics</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Total build duration</li>
                          <li>• Individual step timing</li>
                          <li>• Queue wait times</li>
                          <li>• Deploy time analysis</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Success Rate Tracking</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Build success percentage</li>
                          <li>• Failure frequency analysis</li>
                          <li>• Recovery time metrics</li>
                          <li>• Stability trends</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🚀 Optimization Strategies</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚡ Caching Strategies</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Implement dependency caching and artifact caching to reduce build times by 50-80%.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Parallel Processing</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Configure parallel test execution and concurrent build steps to maximize resource utilization.
                        </p>
                      </div>
                    </div>
                  </div>
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
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔍 Build Failure Analysis & Debugging</h2>
                  <p className={`text-lg mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                    Become an expert at diagnosing build failures quickly and systematically.
                  </p>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-red-50 dark:bg-red-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-red-200 dark:border-red-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-red-600 dark:text-red-400 mb-4`}>🚨 Common Failure Categories</h3>
                    <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                      Understanding these failure types helps you quickly identify and resolve issues:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💔 Dependency Issues</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Package version conflicts</li>
                          <li>• Missing dependencies</li>
                          <li>• Network connectivity problems</li>
                          <li>• Registry access issues</li>
                        </ul>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⚠️ Code Quality Failures</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Compilation errors</li>
                          <li>• Linting violations</li>
                          <li>• Test failures</li>
                          <li>• Type checking errors</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🛠️ Systematic Debugging Approach</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>1. Isolate the Problem</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Identify the exact step where the build fails and examine logs carefully.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>2. Reproduce Locally</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Set up identical conditions on your local machine to reproduce and test fixes.
                        </p>
                      </div>
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>3. Implement Prevention</h4>
                        <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          Add proper error handling and improve test coverage to prevent similar failures.
                        </p>
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
    bolt: {
      id: 'bolt',
      title: 'Step-by-Step Bolt.new Guide',
      icon: <Code className="h-5 w-5" />,
      description: 'Master AI-powered development with Bolt.new platform',
      sections: [
        {
          id: 'bolt-foundations',
          title: '⚡ Bolt.new Foundations',
          description: 'Master the fundamentals of Bolt.new AI development',
          steps: [
            {
              id: 'bolt-step-1',
              title: 'Understanding Bolt.new',
              description: 'Learn about Bolt.new\'s AI-powered development features',
              estimated_time: '20 min',
              difficulty: 'Beginner',
                             content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Welcome to Bolt.new - Your AI Development Partner! 🚀</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🤔 What Exactly is Bolt.new?</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Think of Bolt.new as your personal coding assistant that actually writes the code for you! Instead of spending hours 
                       learning complex programming languages, you simply tell Bolt.new what you want to build in plain English, and it 
                       creates a real, working application for you.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-4`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💡 Real Example:</h4>
                       <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                         You type: "I want a todo list app with the ability to add tasks, mark them complete, and delete them"<br/>
                         Bolt.new responds: Creates a fully functional todo app with buttons, styling, and all the features you asked for!
                       </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 What Makes It Special?</h4>
                         <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                           <li><strong>✨ No coding required:</strong> Just describe what you want</li>
                           <li><strong>⚡ Instant results:</strong> See your app come to life immediately</li>
                           <li><strong>🔄 Easy changes:</strong> Simply ask for modifications</li>
                           <li><strong>🚀 Ready to share:</strong> Deploy your app with one click</li>
                         </ul>
                       </div>
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛠️ What Can You Build?</h4>
                         <ul className={`text-sm space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                           <li><strong>📱 Web apps:</strong> Todo lists, calculators, games</li>
                           <li><strong>💼 Business tools:</strong> Dashboards, forms, trackers</li>
                           <li><strong>🎨 Creative projects:</strong> Portfolios, galleries, blogs</li>
                           <li><strong>🛒 E-commerce:</strong> Online stores, product catalogs</li>
                         </ul>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔮 How the Magic Happens</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Bolt.new uses advanced AI technology to understand your requests and translate them into professional-quality code. 
                       Here's the simple process:
                     </p>
                     
                     <div className="space-y-4">
                       <div className="flex items-start space-x-4">
                         <div className="text-3xl">1️⃣</div>
                         <div className="flex-1">
                           <h4 className={`font-medium text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Tell Bolt.new Your Idea</h4>
                           <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                             Just type what you want to build in normal, everyday language. Don't worry about technical terms!
                           </p>
                           <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-3 rounded text-sm italic`}>
                             "Make me a weather app that shows the temperature for my city"
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex items-start space-x-4">
                         <div className="text-3xl">2️⃣</div>
                         <div className="flex-1">
                           <h4 className={`font-medium text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Watch AI Create Your App</h4>
                           <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                             Bolt.new's AI understands your request and writes all the necessary code, creates the design, and builds a working application.
                           </p>
                           <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-3 rounded text-sm`}>
                             ⚡ Creating components... ✅<br/>
                             🎨 Applying styling... ✅<br/>
                             🔧 Adding functionality... ✅
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex items-start space-x-4">
                         <div className="text-3xl">3️⃣</div>
                         <div className="flex-1">
                           <h4 className={`font-medium text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Use &amp; Improve Your Creation</h4>
                           <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-2`}>
                             Test your app instantly! If you want changes, just ask Bolt.new to modify it. Want different colors? Ask! Need more features? Just describe them!
                           </p>
                           <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-3 rounded text-sm italic`}>
                             "Make the background blue and add a 5-day forecast"
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🎉 Why This is Revolutionary</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🚫 Traditional Way (Hard):</h4>
                         <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                           <li>• Learn HTML, CSS, JavaScript</li>
                           <li>• Study frameworks &amp; libraries</li>
                           <li>• Debug errors for hours</li>
                           <li>• Takes months to build anything useful</li>
                         </ul>
                       </div>
                       <div>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✅ Bolt.new Way (Easy):</h4>
                         <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                           <li>• Describe your idea in plain English</li>
                           <li>• Get a working app in minutes</li>
                           <li>• No technical knowledge required</li>
                           <li>• Focus on creativity, not code</li>
                         </ul>
                       </div>
                     </div>
                   </div>
                 </div>
               )
            },
            {
              id: 'bolt-step-2',
              title: 'Account Setup &amp; Interface',
              description: 'Set up your Bolt.new account and explore the interface',
              estimated_time: '15 min',
              difficulty: 'Beginner',
                             content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Let's Get You Started! 🎯</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🚀 Step-by-Step Account Setup</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Don't worry - setting up Bolt.new is super easy! Just follow these simple steps and you'll be building apps in no time.
                     </p>
                     
                     <div className="space-y-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                         <div className="flex items-center mb-3">
                           <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
                           <h4 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Create Your Account</h4>
                         </div>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Head over to <strong>bolt.new</strong> and create your free account. You have two easy options:
                         </p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">🔗 Sign up with GitHub</h5>
                             <p className="text-xs text-gray-500">Recommended! Connects easily with your coding projects</p>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">📧 Sign up with Email</h5>
                             <p className="text-xs text-gray-500">Quick and simple, just need to verify your email</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                         <div className="flex items-center mb-3">
                           <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
                           <h4 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Explore the Interface</h4>
                         </div>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Once you're in, take a moment to familiarize yourself with Bolt.new's clean, user-friendly interface:
                         </p>
                         <div className="space-y-3">
                           <div className="flex items-start space-x-3">
                             <div className="text-xl">💬</div>
                             <div>
                               <h5 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Chat Panel (Left Side)</h5>
                               <p className="text-sm text-gray-500">This is where the magic happens! Type your app ideas here and watch Bolt.new understand and respond.</p>
                             </div>
                           </div>
                           <div className="flex items-start space-x-3">
                             <div className="text-xl">👁️</div>
                             <div>
                               <h5 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Live Preview (Right Side)</h5>
                               <p className="text-sm text-gray-500">See your app come to life instantly! Every change appears here in real-time.</p>
                             </div>
                           </div>
                           <div className="flex items-start space-x-3">
                             <div className="text-xl">📁</div>
                             <div>
                               <h5 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>File Explorer (Bottom)</h5>
                               <p className="text-sm text-gray-500">See all the files Bolt.new creates for your app. Don't worry - you don't need to understand these!</p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎯 Your First 5 Minutes Checklist</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Follow this simple checklist to make sure you're ready to start building amazing apps:
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg`}>
                         <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                           <span className="mr-2">🔧</span> Account Setup
                         </h4>
                         <div className="space-y-2">
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Create your Bolt.new account</span>
                           </label>
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Verify your email address</span>
                           </label>
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Take a screenshot of the interface</span>
                           </label>
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Bookmark bolt.new for easy access</span>
                           </label>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg`}>
                         <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                           <span className="mr-2">🚀</span> Get Comfortable
                         </h4>
                         <div className="space-y-2">
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Try typing "Hello" in the chat</span>
                           </label>
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Look at the example projects</span>
                           </label>
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Click around the interface</span>
                           </label>
                           <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                             <span className="text-sm">Read the welcome tutorial (if available)</span>
                           </label>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>💡 Pro Tips for Beginners</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="text-center">
                         <div className="text-3xl mb-2">🤝</div>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Be Friendly</h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400">Talk to Bolt.new like you would a helpful friend. Say "please" and "thank you" - it helps!</p>
                       </div>
                       <div className="text-center">
                         <div className="text-3xl mb-2">🔄</div>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Start Simple</h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400">Begin with basic apps like calculators or todo lists before attempting complex projects.</p>
                       </div>
                       <div className="text-center">
                         <div className="text-3xl mb-2">📱</div>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Test Everything</h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400">Always test your app in the preview panel. Click buttons, fill out forms, try everything!</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )
            }
          ]
        },
        {
          id: 'bolt-building',
          title: '🏗️ Building with Bolt.new',
          description: 'Learn to build complete applications using AI assistance',
          steps: [
            {
              id: 'bolt-step-3',
              title: 'Your First Bolt Project',
              description: 'Create your first application with Bolt.new',
              estimated_time: '30 min',
              difficulty: 'Beginner',
              content: (
                                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Time to Build Your First App! 🏗️</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🌟 The Exciting Moment!</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       This is it - your first real app! Don't worry if you feel nervous, that's completely normal. 
                       Remember, with Bolt.new, you can't really "break" anything. If something doesn't work out, 
                       just ask for changes or start over. Think of this as playing with the world's smartest coding toy!
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/70'} p-4 rounded-lg`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>✨ What You'll Learn:</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                         <div>🎯 How to explain your ideas clearly</div>
                         <div>🔄 How to test and refine your app</div>
                         <div>🚀 How to go from idea to working app</div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🎯 Perfect Beginner Projects</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Choose one of these proven beginner-friendly projects. Each one teaches you important concepts while being fun to build!
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                         <div className="flex items-center mb-3">
                           <span className="text-2xl mr-3">🎮</span>
                           <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Super Simple Starters</h4>
                         </div>
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">📝 To-Do List</h5>
                             <p className="text-xs text-gray-500 mb-2">Perfect first project! Add tasks, check them off, delete them.</p>
                             <p className="text-xs font-medium text-green-600">⏱️ 10-15 minutes | 🎯 Difficulty: Super Easy</p>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">🔢 Simple Calculator</h5>
                             <p className="text-xs text-gray-500 mb-2">Add, subtract, multiply, divide - see math in action!</p>
                             <p className="text-xs font-medium text-green-600">⏱️ 10-15 minutes | 🎯 Difficulty: Super Easy</p>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">🎲 Random Quote Generator</h5>
                             <p className="text-xs text-gray-500 mb-2">Click a button to get inspiring quotes!</p>
                             <p className="text-xs font-medium text-green-600">⏱️ 5-10 minutes | 🎯 Difficulty: Super Easy</p>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-5 rounded-lg border`}>
                         <div className="flex items-center mb-3">
                           <span className="text-2xl mr-3">🚀</span>
                           <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Fun &amp; Interactive</h4>
                         </div>
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">🌤️ Weather App</h5>
                             <p className="text-xs text-gray-500 mb-2">See the weather for any city around the world!</p>
                             <p className="text-xs font-medium text-blue-600">⏱️ 15-20 minutes | 🎯 Difficulty: Easy</p>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">🧠 Simple Quiz Game</h5>
                             <p className="text-xs text-gray-500 mb-2">Ask questions, track scores, make learning fun!</p>
                             <p className="text-xs font-medium text-blue-600">⏱️ 20-25 minutes | 🎯 Difficulty: Easy</p>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className="font-medium mb-1">💰 Expense Tracker</h5>
                             <p className="text-xs text-gray-500 mb-2">Track your spending and see where your money goes!</p>
                             <p className="text-xs font-medium text-blue-600">⏱️ 25-30 minutes | 🎯 Difficulty: Easy</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>📝 Step-by-Step Project Creation</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>Example: Building a To-Do List</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`Sample Prompt for Bolt.new:

"Create a modern to-do list application with the following features:
- Add new tasks with a text input
- Mark tasks as completed with checkboxes  
- Delete tasks with a delete button
- Filter tasks by: All, Active, Completed
- Clean, responsive design with good UX
- Use React with modern hooks
- Add some nice animations for interactions
- Include a task counter showing remaining items"

Follow-up prompts:
- "Add local storage to persist tasks"
- "Make it more visually appealing with better colors"
- "Add due dates to tasks"
- "Include drag and drop to reorder tasks"`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>💡 Pro Tips for Success</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Best Practices:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Start with a clear project description</li>
                          <li>• Be specific about features you want</li>
                          <li>• Mention the tech stack preference</li>
                          <li>• Describe the visual style you prefer</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>Iteration Strategy:</h4>
                        <ul className={`text-sm space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                          <li>• Build core functionality first</li>
                          <li>• Add features incrementally</li>
                          <li>• Test each addition thoroughly</li>
                          <li>• Refine based on preview feedback</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'bolt-step-4',
              title: 'AI Prompting Mastery',
              description: 'Learn effective prompting techniques for better AI results',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Mastering AI Prompts</h2>
                  
                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🎯 Effective Prompting Framework</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 The CLEAR Framework</h4>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500">C</span>
                            <div>
                              <strong>Context:</strong> Explain what you're building and why
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500">L</span>
                            <div>
                              <strong>Layout:</strong> Describe the visual structure and UI
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500">E</span>
                            <div>
                              <strong>Examples:</strong> Provide specific examples or references
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500">A</span>
                            <div>
                              <strong>Actions:</strong> Detail the functionality and interactions
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="font-bold text-purple-500">R</span>
                            <div>
                              <strong>Requirements:</strong> Specify technical constraints and preferences
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                    <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>💡 Prompt Examples &amp; Templates</h3>
                    <div className="space-y-4">
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 Design-Focused Prompt</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`"Create a modern e-commerce product page with:

LAYOUT:
- Hero image gallery on the left (60% width)
- Product details on the right (40% width)
- Breadcrumb navigation at the top
- Related products section at the bottom

DESIGN:
- Clean, minimalist aesthetic similar to Apple
- White background with subtle shadows
- Primary color: #3B82F6 (blue)
- Typography: Inter font family

FUNCTIONALITY:
- Image zoom on hover
- Color/size variant selection
- Quantity selector with + / - buttons
- Add to cart with loading state
- Reviews section with star ratings

TECH: React with Tailwind CSS, responsive design"`}
                        </div>
                      </div>
                      
                      <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                        <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚙️ Functionality-Focused Prompt</h4>
                        <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono`}>
                          {`"Build a task management dashboard with these features:

CORE FUNCTIONS:
1. Create/edit/delete tasks with due dates
2. Drag-and-drop between columns (Todo, In Progress, Done)
3. Filter tasks by: priority, assignee, due date
4. Search functionality across all tasks
5. Export tasks to CSV

USER EXPERIENCE:
- Keyboard shortcuts (Ctrl+N for new task)
- Bulk actions (select multiple tasks)
- Undo/redo functionality
- Auto-save as user types
- Confirmation dialogs for destructive actions

DATA PERSISTENCE:
- Local storage for offline use
- Export/import backup functionality

Make it feel snappy and professional like Notion or Linear."`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
                         },
             {
               id: 'bolt-step-5',
               title: 'Advanced Code Iteration',
               description: 'Master the art of refining and enhancing your Bolt.new projects',
               estimated_time: '35 min',
               difficulty: 'Intermediate',
               content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔄 Master Advanced Code Iteration Techniques</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-orange-50 dark:bg-orange-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-orange-200 dark:border-orange-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-orange-600 dark:text-orange-400 mb-4`}>🎯 The Art of Effective Iteration</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       The real power of Bolt.new comes after your initial app is created. This is where you transform a basic application 
                       into something truly remarkable. Think of it like sculpting - you start with a rough shape and gradually refine it 
                       into a masterpiece.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-4`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💡 Why Iteration Matters:</h4>
                       <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                         Your first version will be good, but your tenth iteration will be extraordinary. Each refinement cycle adds polish, 
                         improves usability, and brings you closer to a professional-quality application that users will love.
                       </p>
                     </div>

                     <div className="space-y-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📝 Strategic Feedback Framework</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           The key to successful iteration is providing specific, actionable feedback. Here's how to structure your improvement requests:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`THE PERFECT ITERATION PROMPT:

"I want to refine this app to improve the user experience. Here's my specific feedback:

🎯 PRIORITY IMPROVEMENTS:
1. Visual Polish: The buttons need more visual weight - add shadows, better colors, and hover effects
2. User Feedback: Add loading spinners when data is fetching, success messages for actions
3. Mobile Experience: The layout breaks on smaller screens - make it fully responsive
4. Performance: Add smooth transitions between pages and micro-animations for interactions
5. Accessibility: Ensure proper contrast ratios and keyboard navigation support

✅ WHAT'S WORKING WELL:
- The overall information architecture is solid
- The navigation makes logical sense
- The core functionality works perfectly
- The color scheme foundation is good

🚀 BONUS ENHANCEMENTS:
- Add a dark mode toggle in the header
- Include subtle sound effects for button clicks
- Add keyboard shortcuts for power users
- Implement undo/redo functionality where applicable

Please maintain all existing functionality while implementing these improvements."`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-orange-50 dark:bg-orange-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-orange-800 dark:text-orange-200'} mb-2`}>✅ DO This</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-orange-700 dark:text-orange-300'}`}>
                               <li>• Be specific about exactly what needs changing</li>
                               <li>• Explain WHY you want the change (better UX, etc.)</li>
                               <li>• Mention what's currently working well</li>
                               <li>• Prioritize your requests (most important first)</li>
                               <li>• Give examples or reference other apps when helpful</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/50' : 'bg-red-50 dark:bg-red-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-red-800 dark:text-red-200'} mb-2`}>❌ Avoid This</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-red-700 dark:text-red-300'}`}>
                               <li>• Vague requests like "make it better"</li>
                               <li>• Asking for too many changes at once</li>
                               <li>• Forgetting to mention what should stay the same</li>
                               <li>• Not explaining the reasoning behind changes</li>
                               <li>• Contradicting previous requests</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎨 Design Evolution Mastery</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Transform your functional app into a visually stunning experience that rivals professional applications:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`PREMIUM DESIGN TRANSFORMATION:

"Elevate this app to have a premium, professional appearance that competitors would envy:

🎨 VISUAL HIERARCHY:
- Create depth with subtle shadows, gradients, and layering
- Implement a sophisticated color palette (study Notion, Linear, or Stripe)
- Add proper typography hierarchy with varied font weights and sizes
- Use whitespace strategically to create breathing room
- Ensure consistent spacing throughout (8px grid system)

✨ MICRO-INTERACTIONS:
- Smooth hover effects on all interactive elements
- Button press animations with subtle scale transforms
- Loading states with skeleton screens or elegant spinners
- Page transitions with fade or slide effects
- Form field focus states with smooth color transitions
- Success/error feedback with gentle animations

🌟 MODERN TOUCHES:
- Glassmorphism effects for modals and overlays
- Subtle particle effects or animated backgrounds
- Custom icons that match the brand personality
- Progress indicators for multi-step processes
- Empty states with friendly illustrations
- Contextual tooltips for enhanced usability

📱 RESPONSIVE EXCELLENCE:
- Mobile-first design that works perfectly on all devices
- Touch-friendly interface elements (44px minimum touch targets)
- Adaptive navigation that collapses gracefully
- Optimized layouts for tablet and desktop viewing"`}
                         </div>
                         
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🎯 Pro Tip: Reference Existing Apps</h5>
                             <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                               "Make the dashboard look like Notion's clean design with Linear's modern color palette and Stripe's professional typography."
                               This gives Bolt.new clear visual references to work from.
                             </p>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>⚡ Quick Wins for Instant Polish</h5>
                             <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               Add box-shadows to cards, round corners on buttons, implement a consistent color scheme, 
                               and add hover effects. These small changes create an immediate professional appearance.
                             </p>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 Performance &amp; Feature Enhancement Strategies</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Once your app looks great, focus on making it feel fast and adding features that will wow your users:
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Performance Optimization Checklist</h4>
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🖼️ Image &amp; Media Optimization</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Implement lazy loading for images and videos</li>
                               <li>• Add image compression and modern formats (WebP)</li>
                               <li>• Create loading placeholder skeletons</li>
                               <li>• Optimize for different screen densities</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💾 Smart Caching &amp; Storage</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Local storage for user preferences</li>
                               <li>• Session storage for temporary data</li>
                               <li>• Service worker for offline functionality</li>
                               <li>• Intelligent cache invalidation strategies</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔄 Smooth Interactions</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Debounced search and input handling</li>
                               <li>• Virtual scrolling for large datasets</li>
                               <li>• Optimistic UI updates</li>
                               <li>• Smooth page transitions and animations</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🎯 Power User Features</h4>
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>⌨️ Keyboard Shortcuts</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Ctrl+N for new items, Ctrl+S for save</li>
                               <li>• Arrow keys for navigation</li>
                               <li>• Escape to close modals</li>
                               <li>• Tab for logical focus flow</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🔍 Advanced Search &amp; Filtering</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Real-time search with autocomplete</li>
                               <li>• Multiple filter combinations</li>
                               <li>• Search history and saved searches</li>
                               <li>• Advanced filter operators (contains, equals, etc.)</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>📊 Data Management</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Export data in multiple formats (CSV, JSON, PDF)</li>
                               <li>• Bulk operations for multiple items</li>
                               <li>• Undo/redo functionality</li>
                               <li>• Data backup and restore capabilities</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-4 rounded-lg mt-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>🎯 Iteration Success Framework</h4>
                       <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'} mb-3`}>
                         Follow this proven cycle for continuous improvement:
                       </p>
                       <div className="flex items-center space-x-4 text-xs overflow-x-auto">
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
                           <span>Test &amp; Identify Issues</span>
                         </div>
                         <span>→</span>
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                           <span>Prioritize Improvements</span>
                         </div>
                         <span>→</span>
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
                           <span>Implement Changes</span>
                         </div>
                         <span>→</span>
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">4</span>
                           <span>Test &amp; Validate</span>
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
           id: 'bolt-advanced',
           title: '🎯 Advanced Bolt.new Mastery',
           description: 'Master advanced features and complex project development',
           steps: [
             {
               id: 'bolt-step-6',
               title: 'Complex App Architecture',
               description: 'Build sophisticated multi-page applications with Bolt.new',
               estimated_time: '45 min',
               difficulty: 'Advanced',
               content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🏗️ Mastering Complex Application Architecture</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🎯 From Simple to Sophisticated</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Ready to build enterprise-level applications? This is where Bolt.new truly shines. You'll learn to create 
                       complex, multi-page applications that rival those built by professional development teams. Think of apps like 
                       Notion, Linear, or Stripe's dashboard - sophisticated, polished, and feature-rich.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🌟 What Makes an App "Complex"?</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>📱 Multiple Pages:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> 5+ interconnected pages with smooth navigation</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>🔄 Data Flow:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Complex state management across components</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>🎨 Rich UI:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Advanced components and interactions</span>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🚀 Complete SaaS Platform Blueprint</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Here's a comprehensive prompt for building a professional-grade SaaS analytics platform:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-4 rounded text-sm font-mono mb-4`}>
                           {`"Build a comprehensive SaaS analytics platform with enterprise-level features:

🏗️ APPLICATION ARCHITECTURE:
├── 🌐 Public Landing Page (/)
│   ├── Hero section with animated metrics
│   ├── Feature showcase with interactive demos
│   ├── Pricing table with plan comparisons
│   └── Customer testimonials carousel
├── 🔐 Authentication System (/auth)
│   ├── Login with email/password & social OAuth
│   ├── Registration with email verification
│   ├── Password reset with secure tokens
│   └── Two-factor authentication setup
├── 📊 Main Dashboard (/dashboard)
│   ├── Customizable widget grid (drag & drop)
│   ├── Real-time metrics with live charts
│   ├── Quick action buttons and shortcuts
│   └── Recent activity feed
├── 📈 Analytics Hub (/analytics)
│   ├── Advanced charting with multiple visualizations
│   ├── Custom date range selection
│   ├── Data filtering and segmentation
│   ├── Export capabilities (PDF, CSV, Excel)
│   └── Comparative analysis tools
├── 👥 Team Management (/team)
│   ├── User role management and permissions
│   ├── Team member invitation system
│   ├── Activity logs and audit trails
│   └── Collaboration features
├── ⚙️ Settings Center (/settings)
│   ├── Profile management with avatar upload
│   ├── Notification preferences
│   ├── API key management
│   ├── Integration configurations
│   └── Data export/import tools
├── 💳 Billing Portal (/billing)
│   ├── Subscription management
│   ├── Payment method handling
│   ├── Invoice history and downloads
│   ├── Usage tracking and limits
│   └── Plan upgrade/downgrade flows
└── 📱 Mobile-Optimized Views
    ├── Responsive design for all pages
    ├── Touch-optimized interactions
    ├── Progressive Web App features
    └── Offline mode for critical functions

🎨 DESIGN SYSTEM REQUIREMENTS:
- Modern, clean interface inspired by Linear/Notion
- Consistent 8px spacing grid throughout
- Professional color palette with semantic meanings
- Typography hierarchy with proper contrast ratios
- Dark/light theme toggle with system preference detection
- Smooth animations and micro-interactions
- Loading states, empty states, and error handling
- Accessibility compliance (WCAG 2.1 AA)

🔧 TECHNICAL FEATURES:
- Client-side routing with protected routes
- Global state management for user session
- Local storage for user preferences
- Mock API integration with realistic data
- Form validation with real-time feedback
- Search functionality with autocomplete
- Keyboard shortcuts for power users
- Toast notifications for user actions
- Progressive loading and optimization

Make this feel like a $100/month SaaS product that companies would actually pay for."`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>💡 Pro Architecture Tips</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                               <li>• Start with user flow diagrams before coding</li>
                               <li>• Plan your component hierarchy in advance</li>
                               <li>• Design the data structure before the UI</li>
                               <li>• Consider mobile experience from day one</li>
                               <li>• Plan for different user roles and permissions</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🎯 Success Metrics</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                               <li>• Pages load smoothly without jarring jumps</li>
                               <li>• Navigation feels intuitive and logical</li>
                               <li>• Users can complete tasks without confusion</li>
                               <li>• App works perfectly on mobile devices</li>
                               <li>• Performance feels snappy and responsive</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📋 Project Management Platform Example</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Want to build something like Notion or Linear? Here's your blueprint:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Create a comprehensive project management platform like Linear or Notion:

🎯 CORE FUNCTIONALITY:
- Workspace creation and management
- Project organization with nested structure
- Task creation with rich text editing
- Assignment system with user mentions
- Status tracking with custom workflows
- Due date management with calendar views
- File attachment and media embedding
- Real-time collaboration features

📊 ADVANCED FEATURES:
- Kanban board with drag & drop
- Gantt chart timeline views
- Sprint planning and velocity tracking
- Custom fields and properties
- Advanced filtering and search
- Automation rules and triggers
- Time tracking integration
- Reporting and analytics dashboard

🎨 USER EXPERIENCE:
- Slash commands for quick actions (/task, /project)
- Keyboard shortcuts for everything (j/k navigation)
- Contextual menus and smart suggestions
- Inline editing with autosave
- Command palette for universal search
- Smooth animations and transitions
- Empty states with helpful onboarding

Make it feel as polished as Linear with the flexibility of Notion."`}
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔧 Advanced State Management Mastery</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Complex apps need sophisticated state management. Here's how to handle data flow like a pro:
                     </p>
                     
                     <div className="space-y-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📊 Enterprise-Grade State Architecture</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Implement a robust, scalable state management system:

🏗️ STATE ARCHITECTURE:
├── 👤 Authentication State
│   ├── User profile data (name, email, avatar, preferences)
│   ├── Authentication status and session management
│   ├── User permissions and role-based access
│   └── Login/logout flow with token handling
├── 📊 Application Data
│   ├── Projects, tasks, and workspace information
│   ├── Team members and collaboration data
│   ├── Settings and configuration preferences
│   └── File uploads and media management
├── 🎨 UI State Management
│   ├── Theme selection (dark/light mode)
│   ├── Sidebar collapsed/expanded state
│   ├── Active filters and search queries
│   ├── Modal and popup visibility
│   └── Loading states for async operations
└── 💾 Cache & Performance
    ├── API response caching with TTL
    ├── Optimistic updates for better UX
    ├── Background data synchronization
    └── Offline mode with local storage fallback

🔄 ADVANCED PATTERNS:
- Implement undo/redo functionality for critical actions
- Use optimistic updates to make the UI feel instant
- Add real-time synchronization simulation
- Include conflict resolution for concurrent edits
- Implement smart caching with invalidation strategies
- Add background sync for offline-to-online transitions

⚡ PERFORMANCE OPTIMIZATIONS:
- Memoize expensive calculations and computations
- Use virtual scrolling for large data sets (1000+ items)
- Implement debounced search and filtering
- Add lazy loading for route-based code splitting
- Optimize re-renders with React.memo and useMemo
- Use Web Workers for heavy computational tasks

Use React Context + useReducer for complex state, or integrate Zustand for cleaner code."`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>✅ State Management Best Practices</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               <li>• Keep state as flat and normalized as possible</li>
                               <li>• Separate UI state from business logic state</li>
                               <li>• Use TypeScript for type-safe state management</li>
                               <li>• Implement proper error boundaries</li>
                               <li>• Add state persistence for critical user data</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>⚠️ Common Pitfalls to Avoid</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                               <li>• Don't put everything in global state</li>
                               <li>• Avoid deeply nested state structures</li>
                               <li>• Don't forget to handle loading states</li>
                               <li>• Avoid state mutations (always return new objects)</li>
                               <li>• Don't ignore error handling and edge cases</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🎨 Advanced Component Library</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Build a comprehensive component system that scales with your application:
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🧩 Essential Component Library</h4>
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>📊 Data Display</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                               <li>• Advanced data tables with sorting, filtering, pagination</li>
                               <li>• Interactive charts (line, bar, pie, scatter, heatmap)</li>
                               <li>• Statistical cards with trend indicators</li>
                               <li>• Progress indicators and metric displays</li>
                               <li>• Timeline and activity feed components</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🎛️ Interactive Elements</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               <li>• Modal system with multiple sizes and variants</li>
                               <li>• Dropdown menus with search and multi-select</li>
                               <li>• Drag & drop file uploader with progress</li>
                               <li>• Form builder with real-time validation</li>
                               <li>• Rich text editor with formatting options</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>🔍 Navigation & Search</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                               <li>• Command palette with fuzzy search</li>
                               <li>• Breadcrumb navigation with dynamic paths</li>
                               <li>• Sidebar with collapsible sections</li>
                               <li>• Advanced search with filters and operators</li>
                               <li>• Autocomplete with keyboard navigation</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Advanced Features</h4>
                         <div className="space-y-3">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-orange-50 dark:bg-orange-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-orange-800 dark:text-orange-200'} mb-2`}>🎭 Micro-Interactions</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-orange-700 dark:text-orange-300'}`}>
                               <li>• Smooth hover effects with scale transforms</li>
                               <li>• Loading states with skeleton screens</li>
                               <li>• Success/error animations for user feedback</li>
                               <li>• Page transitions with fade/slide effects</li>
                               <li>• Button press animations and haptic feedback</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-red-50 dark:bg-red-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-red-800 dark:text-red-200'} mb-2`}>🔧 Power User Tools</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-red-700 dark:text-red-300'}`}>
                               <li>• Keyboard shortcuts with visual hints</li>
                               <li>• Bulk operations for multiple items</li>
                               <li>• Context menus with right-click actions</li>
                               <li>• Infinite scroll with virtual scrolling</li>
                               <li>• Undo/redo with command history</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-50 dark:bg-gray-700'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-gray-800 dark:text-gray-200'} mb-2`}>📱 Mobile Optimization</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                               <li>• Touch-optimized interactions (44px targets)</li>
                               <li>• Swipe gestures for mobile navigation</li>
                               <li>• Responsive breakpoints for all screen sizes</li>
                               <li>• Pull-to-refresh functionality</li>
                               <li>• Mobile-first responsive design patterns</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                     </div>

                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-indigo-50 dark:bg-indigo-900/30'} p-4 rounded-lg mt-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-indigo-800 dark:text-indigo-200'} mb-2`}>🎯 Component Development Strategy</h4>
                       <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-indigo-700 dark:text-indigo-300'} mb-3`}>
                         Build your component library incrementally: Start with basic components, then add complexity as needed.
                       </p>
                       <div className="flex items-center space-x-4 text-xs overflow-x-auto">
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center">1</span>
                           <span>Basic UI Elements</span>
                         </div>
                         <span>→</span>
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center">2</span>
                           <span>Interactive Components</span>
                         </div>
                         <span>→</span>
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">3</span>
                           <span>Complex Features</span>
                         </div>
                         <span>→</span>
                         <div className="flex items-center space-x-2 whitespace-nowrap">
                           <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">4</span>
                           <span>Polish & Optimize</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )
             },
             {
               id: 'bolt-step-7',
               title: 'API Integration & External Services',
               description: 'Connect your Bolt.new apps with real APIs and services',
               estimated_time: '40 min',
               difficulty: 'Advanced',
               content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🔌 API Integration & External Services Mastery</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 Transform Your Apps with Real Data</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Ready to make your apps come alive with real data? API integration is what separates hobby projects from 
                       professional applications. You'll learn to connect with external services, handle real-time data, and 
                       create apps that users will actually want to use every day.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💡 Why API Integration Changes Everything:</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🌐 Real Data:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Live, dynamic content that updates automatically</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>⚡ Professional Features:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Authentication, payments, notifications, and more</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-blue-300' : 'text-blue-600'}`}>🎯 User Value:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Apps that solve real problems with real solutions</span>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌤️ Complete Weather Application</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Build a professional weather app that rivals commercial applications:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Create a comprehensive weather application using OpenWeather API:

🌟 CORE WEATHER FEATURES:
- Current conditions with animated weather icons and backgrounds
- Detailed 7-day forecast with hourly breakdowns
- Interactive weather maps (radar, satellite, temperature layers)
- Location-based weather with automatic GPS detection
- Multi-city search with autocomplete suggestions
- Weather alerts and severe weather warnings
- Air quality index and UV radiation levels
- Sunrise/sunset times with golden hour calculations

📊 ADVANCED ANALYTICS:
- Historical weather data comparison and trends
- Weather pattern analysis and predictions
- Temperature trend charts with interactive tooltips
- Precipitation probability graphs
- Wind speed and direction with compass visualization
- Humidity and pressure tracking with trend indicators

🎨 USER EXPERIENCE EXCELLENCE:
- Beautiful animated weather backgrounds that change with conditions
- Smooth transitions between different weather states
- Customizable widgets for dashboard-style layout
- Voice weather updates with speech synthesis
- Apple Weather-style smooth animations
- Dark/light themes that adapt to time of day

⚡ TECHNICAL IMPLEMENTATION:
- Robust API key management with environment variables
- Intelligent caching system to minimize API calls
- Progressive Web App features for mobile installation
- Offline mode with last known weather data
- Push notifications for weather alerts
- Geolocation with fallback to IP-based location
- Rate limiting handling with exponential backoff
- Error boundaries for graceful failure handling

🔧 PERFORMANCE OPTIMIZATIONS:
- Background sync for updated weather data
- Lazy loading for weather maps and detailed views
- Image optimization for weather icons and backgrounds
- Service worker for offline functionality
- Local storage for user preferences and cached data"`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>🎯 Pro Implementation Tips</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                               <li>• Cache weather data for 10-15 minutes to reduce API calls</li>
                               <li>• Use weather condition codes to trigger appropriate animations</li>
                               <li>• Implement background sync for seamless updates</li>
                               <li>• Add haptic feedback for mobile interactions</li>
                               <li>• Use skeleton screens while loading weather data</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>💡 User Experience Enhancements</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               <li>• Show "feels like" temperature for better accuracy</li>
                               <li>• Add clothing recommendations based on weather</li>
                               <li>• Include activity suggestions (indoor vs outdoor)</li>
                               <li>• Provide commute weather alerts</li>
                               <li>• Add pollen count for allergy sufferers</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>💰 Advanced Cryptocurrency Portfolio</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Create a sophisticated crypto tracking app that professional traders would use:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Build an advanced cryptocurrency portfolio tracker using CoinGecko & CoinMarketCap APIs:

💼 PORTFOLIO MANAGEMENT:
- Multi-portfolio support for different investment strategies
- Add transactions with buy/sell history and tax implications
- Real-time portfolio valuation with profit/loss calculations
- Portfolio performance analytics with Sharpe ratio and volatility metrics
- Asset allocation visualization with interactive pie charts
- Rebalancing suggestions based on target allocations
- Portfolio diversification analysis across sectors and market caps

📈 MARKET DATA & ANALYTICS:
- Real-time prices for 10,000+ cryptocurrencies
- Advanced charting with technical indicators (RSI, MACD, Bollinger Bands)
- Market sentiment analysis and fear/greed index
- Social media sentiment tracking from Twitter and Reddit
- Whale transaction alerts and unusual volume detection
- Cross-exchange price comparison and arbitrage opportunities
- DeFi yield farming and staking rewards tracking

🔔 SMART ALERTS & NOTIFICATIONS:
- Price alerts with percentage and absolute thresholds
- Portfolio value alerts (all-time high/low notifications)
- News alerts for specific cryptocurrencies
- Technical indicator alerts (RSI overbought/oversold)
- Whale movement alerts for large transactions
- Market crash/pump detection with severity levels

🎨 PROFESSIONAL UI/UX:
- TradingView-style advanced charts with drawing tools
- Dark theme optimized for extended use
- Customizable dashboard with drag-and-drop widgets
- Watchlists with custom categories and notes
- Quick trade simulation and what-if scenarios
- Export capabilities for tax reporting (CSV, PDF)
- Mobile-optimized responsive design

⚡ TECHNICAL EXCELLENCE:
- WebSocket connections for real-time price feeds
- Intelligent data caching with Redis-like optimization
- Background sync for updated market data
- Offline mode with last-known prices
- PWA features for mobile app-like experience
- Price prediction models using historical data
- Advanced filtering and search with fuzzy matching"`}
                         </div>
                         
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-3 rounded`}>
                           <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-2`}>🚀 Next-Level Features</h5>
                           <p className={`text-xs ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                             Add NFT portfolio tracking, DeFi protocol integration, automated trading signals, and 
                             social features for sharing portfolio performance anonymously.
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🔐 Database & Authentication Integration</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Add user accounts, data persistence, and secure authentication to make your apps truly professional:
                     </p>
                     
                     <div className="space-y-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🔥 Firebase Integration Blueprint</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Integrate Firebase for a complete backend solution:

🔐 AUTHENTICATION SYSTEM:
- Multi-provider authentication (Email, Google, GitHub, Twitter)
- Two-factor authentication with SMS and authenticator apps
- Custom user profiles with avatar uploads and bio
- Role-based access control (admin, user, premium)
- Session management with automatic token refresh
- Password strength validation and secure reset flows

💾 FIRESTORE DATABASE:
- Real-time data synchronization across devices
- Offline support with automatic sync when online
- Complex queries with compound indexes
- Data validation rules and security policies
- Batch operations for better performance
- Subcollections for hierarchical data structures

📁 CLOUD STORAGE:
- Secure file uploads with progress indicators
- Image compression and optimization
- File type validation and virus scanning
- CDN integration for fast global delivery
- Automatic backup and versioning
- Storage quota management and usage analytics

⚡ CLOUD FUNCTIONS:
- Serverless backend logic for complex operations
- Email notifications and automated workflows
- Payment processing with Stripe integration
- Data aggregation and analytics processing
- Scheduled tasks and background jobs
- Third-party API integrations and webhooks"`}
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Supabase Integration Mastery</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Implement Supabase for a PostgreSQL-powered backend:

🗄️ POSTGRESQL DATABASE:
- Powerful SQL queries with joins and aggregations
- Row Level Security (RLS) for data isolation
- Real-time subscriptions for live data updates
- Database functions and triggers for complex logic
- Full-text search with ranking and highlighting
- JSON columns for flexible schema design

🔑 BUILT-IN AUTHENTICATION:
- Social OAuth providers (Google, GitHub, Discord)
- Magic link authentication (passwordless login)
- Custom SMTP for branded emails
- JWT tokens with automatic refresh
- Multi-factor authentication support
- User metadata and custom claims

📦 EDGE FUNCTIONS:
- TypeScript-based serverless functions
- Global edge deployment for low latency
- Environment variable management
- Custom middleware and request handling
- Integration with external APIs
- Cron jobs and scheduled tasks

🗃️ STORAGE & CDN:
- S3-compatible object storage
- Automatic image resizing and optimization
- Global CDN for fast content delivery
- File versioning and backup
- Secure upload policies and validation
- Direct browser uploads with presigned URLs"`}
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-3`}>🔥 Firebase Strengths</h4>
                         <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                           <li>• Excellent real-time capabilities</li>
                           <li>• Simple setup and configuration</li>
                           <li>• Great mobile SDK support</li>
                           <li>• Generous free tier</li>
                           <li>• Integrated analytics and crashlytics</li>
                           <li>• Strong Google ecosystem integration</li>
                         </ul>
                       </div>
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-3`}>⚡ Supabase Advantages</h4>
                         <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                           <li>• Full PostgreSQL power and flexibility</li>
                           <li>• Open source and self-hostable</li>
                           <li>• Better pricing for larger applications</li>
                           <li>• SQL expertise transfers directly</li>
                           <li>• Built-in admin dashboard</li>
                           <li>• Edge functions with global deployment</li>
                         </ul>
                       </div>
                     </div>
                   </div>
                 </div>
               )
             },
             {
               id: 'bolt-step-8',
               title: 'Deployment & Production Optimization',
               description: 'Deploy your Bolt.new apps and optimize for production',
               estimated_time: '35 min',
               difficulty: 'Advanced',
               content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🚀 Production Deployment & Optimization Mastery</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🌟 From Development to Production Excellence</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Your app works perfectly in development, but now it's time to share it with the world! Learn to deploy like a 
                       professional, optimize for real-world performance, and ensure your application can handle actual users. 
                       This is where your app transforms from a prototype to a production-ready service.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Production Deployment Checklist:</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>🔒 Security:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> HTTPS, environment variables, input validation</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>⚡ Performance:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Optimization, caching, CDN integration</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>📊 Monitoring:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Analytics, error tracking, uptime monitoring</span>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌐 Multi-Platform Deployment Strategy</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Deploy your application across multiple platforms for maximum reach and reliability:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Prepare this application for enterprise-grade production deployment:

🚀 DEPLOYMENT PLATFORMS:
├── 🔵 Vercel (Recommended for React/Next.js)
│   ├── Zero-config deployments with Git integration
│   ├── Global edge network for ultra-fast loading
│   ├── Automatic HTTPS and custom domain support
│   ├── Built-in analytics and Web Vitals monitoring
│   └── Serverless functions for API endpoints
├── 🟢 Netlify (Great for static sites + JAMstack)
│   ├── Continuous deployment from Git repositories
│   ├── Form handling and serverless functions
│   ├── Split testing and branch previews
│   ├── Identity and authentication services
│   └── Advanced redirects and edge processing
├── 🔶 AWS Amplify (Full-stack cloud deployment)
│   ├── Complete CI/CD pipeline integration
│   ├── Backend services (auth, storage, APIs)
│   ├── Global CDN with CloudFront
│   ├── Custom domain with Route 53
│   └── Monitoring with CloudWatch
└── 🔴 Firebase Hosting (Google ecosystem)
    ├── Fast SSD-backed hosting with global CDN
    ├── Integration with Firebase services
    ├── Automatic SSL certificate provisioning
    ├── One-command deployments
    └── Rollback and version management

⚡ PERFORMANCE OPTIMIZATIONS:
- Code splitting: Split bundles by route for faster initial loads
- Image optimization: WebP/AVIF formats with responsive sizing
- Bundle analysis: Identify and eliminate large dependencies
- Tree shaking: Remove unused code automatically
- Compression: Gzip/Brotli compression for all assets
- Lazy loading: Load components and images on demand
- Service worker: Cache assets for offline functionality
- Preloading: Critical resources for perceived performance

🔧 PRODUCTION CONFIGURATION:
- Environment variables for API keys and secrets
- Error boundaries for graceful error handling
- Logging integration (LogRocket, Sentry, DataDog)
- Analytics setup (Google Analytics 4, Mixpanel, Amplitude)
- SEO optimization (meta tags, Open Graph, structured data)
- Security headers (CSP, HSTS, X-Frame-Options)
- Performance monitoring (Core Web Vitals, lighthouse CI)
- Automated testing in deployment pipeline

📋 DEPLOYMENT CHECKLIST:
□ Remove console.logs and debug code
□ Configure production environment variables
□ Set up custom domain with SSL
□ Configure redirects (www to non-www)
□ Set up monitoring and alerting
□ Test on multiple devices and browsers
□ Verify all forms and interactive elements
□ Check mobile responsiveness and performance
□ Set up backup and disaster recovery
□ Configure automated deployments from main branch"`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>🎯 Vercel Deployment Tips</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                               <li>• Connect GitHub repo for automatic deployments</li>
                               <li>• Use environment variables for API keys</li>
                               <li>• Set up custom domain in project settings</li>
                               <li>• Enable Web Analytics for user insights</li>
                               <li>• Use preview deployments for testing</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🌿 Netlify Optimization</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               <li>• Configure _redirects file for SPA routing</li>
                               <li>• Use Netlify Functions for API endpoints</li>
                               <li>• Set up form handling for contact forms</li>
                               <li>• Enable branch deploy previews</li>
                               <li>• Configure build plugins for optimization</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Advanced Performance Optimization</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Make your application lightning-fast with these professional optimization techniques:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Implement enterprise-level performance optimizations:

🚀 LOADING PERFORMANCE:
- Critical resource preloading for above-the-fold content
- DNS prefetching for external domains
- Resource hints (preconnect, prefetch, preload)
- Code splitting by route and component level
- Dynamic imports for heavy libraries
- Bundle size analysis and optimization
- Remove unused CSS with PurgeCSS
- Optimize JavaScript with Terser

🖼️ IMAGE & MEDIA OPTIMIZATION:
- Modern image formats (WebP, AVIF) with fallbacks
- Responsive images with srcset and sizes
- Lazy loading with Intersection Observer
- Image compression and optimization pipelines
- Video optimization with multiple formats
- Progressive JPEG for better perceived performance
- Placeholder images and blur-up technique
- CDN integration for global asset delivery

💾 CACHING STRATEGIES:
- Service worker for offline-first experience
- HTTP caching headers for static assets
- Browser caching for API responses
- Local storage for user preferences
- Session storage for temporary data
- Cache invalidation strategies
- Stale-while-revalidate patterns
- Cache-first vs network-first strategies

🔄 RUNTIME PERFORMANCE:
- Virtual scrolling for large lists
- Debounced search and input handling
- Memoization for expensive calculations
- Lazy loading of non-critical components
- Efficient re-rendering with React.memo
- Optimize bundle splits for better caching
- Reduce main thread blocking
- Web Workers for heavy computations

📊 CORE WEB VITALS OPTIMIZATION:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to First Byte (TTFB) optimization
- First Contentful Paint improvements
- Speed Index optimization
- Total Blocking Time reduction"`}
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🔧 Production-Ready Feature Implementation</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Transform your application with enterprise-grade features that professional applications require:
                     </p>
                     
                     <div className="space-y-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛡️ Security & Compliance</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Implement enterprise-grade security measures:

🔒 SECURITY HEADERS:
- Content Security Policy (CSP) to prevent XSS attacks
- HTTP Strict Transport Security (HSTS) for HTTPS enforcement
- X-Frame-Options to prevent clickjacking
- X-Content-Type-Options to prevent MIME sniffing
- Referrer-Policy for privacy protection
- Permissions-Policy for feature access control

🛡️ INPUT VALIDATION & SANITIZATION:
- Client-side and server-side validation
- SQL injection prevention
- XSS protection with input sanitization
- CSRF token implementation
- Rate limiting for API endpoints
- Request size limits and timeouts

🔐 AUTHENTICATION & AUTHORIZATION:
- Secure password requirements and hashing
- JWT token management with refresh tokens
- Session timeout and management
- Multi-factor authentication (MFA)
- OAuth integration with secure flows
- Role-based access control (RBAC)

📊 PRIVACY & COMPLIANCE:
- GDPR compliance with cookie consent
- Privacy policy and terms of service
- Data encryption at rest and in transit
- Audit logging for sensitive operations
- Right to data portability and deletion
- Anonymous analytics and tracking"`}
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📊 Analytics & Monitoring Excellence</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Set up comprehensive monitoring and analytics:

📈 USER ANALYTICS:
- Google Analytics 4 with enhanced ecommerce
- User behavior tracking with heatmaps
- Conversion funnel analysis
- A/B testing framework integration
- Custom event tracking for key actions
- User journey mapping and analysis
- Cohort analysis for retention metrics
- Real-time user monitoring

🚨 ERROR TRACKING & MONITORING:
- Sentry integration for error reporting
- Real-time error alerts and notifications
- Source map upload for detailed stack traces
- Performance monitoring and profiling
- Database query optimization tracking
- API response time monitoring
- Uptime monitoring with status pages
- Automated incident response workflows

⚡ PERFORMANCE MONITORING:
- Core Web Vitals tracking and reporting
- Lighthouse CI integration in deployment
- Bundle size monitoring and alerts
- API performance and response time tracking
- Database performance monitoring
- CDN performance and cache hit rates
- Third-party service dependency monitoring
- Mobile performance optimization tracking

📋 BUSINESS INTELLIGENCE:
- Custom dashboard creation
- Revenue and conversion tracking
- User acquisition cost analysis
- Customer lifetime value calculations
- Feature adoption and usage metrics
- Geographic user distribution analysis
- Device and browser usage statistics
- Performance impact on business metrics"`}
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-3`}>🎯 Production Deployment Checklist</h4>
                         <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                           <li>✅ Environment variables configured</li>
                           <li>✅ Custom domain with SSL certificate</li>
                           <li>✅ Analytics and monitoring setup</li>
                           <li>✅ Error tracking and alerting enabled</li>
                           <li>✅ Performance optimization implemented</li>
                           <li>✅ Security headers and CSP configured</li>
                           <li>✅ Backup and disaster recovery planned</li>
                           <li>✅ CI/CD pipeline configured</li>
                         </ul>
                       </div>
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-3`}>🚀 Post-Launch Optimization</h4>
                         <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                           <li>• Monitor Core Web Vitals daily</li>
                           <li>• Review error rates and fix issues</li>
                           <li>• Analyze user behavior patterns</li>
                           <li>• Optimize conversion funnels</li>
                           <li>• Update dependencies regularly</li>
                           <li>• Run security audits monthly</li>
                           <li>• Test performance on various devices</li>
                           <li>• Plan feature rollouts with A/B tests</li>
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
           id: 'bolt-realworld',
           title: '🌟 Real-World Project Builds',
           description: 'Build complete, production-ready applications with Bolt.new',
           steps: [
             {
               id: 'bolt-step-9',
               title: 'E-commerce Platform Build',
               description: 'Create a full-featured e-commerce application',
               estimated_time: '60 min',
               difficulty: 'Advanced',
               content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>🛍️ Build Professional E-commerce Applications</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-green-50 dark:bg-green-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-green-200 dark:border-green-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>🚀 Create Revenue-Generating Applications</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Ready to build applications that can actually make money? E-commerce platforms are among the most valuable 
                       types of applications you can create. Learn to build sophisticated online stores, project management tools, 
                       and business applications that solve real problems and generate real revenue.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>💰 Why E-commerce & Business Apps Matter:</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>💵 Revenue Potential:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Applications that can generate income from day one</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>🎯 Business Value:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Solve real business problems with tangible benefits</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-green-300' : 'text-green-600'}`}>📈 Portfolio Impact:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Impressive projects that showcase commercial viability</span>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🛒 Complete E-commerce Platform</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Build a full-featured online store that rivals major e-commerce platforms:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Create a modern, full-featured e-commerce platform that can handle real transactions:

🛍️ ADVANCED PRODUCT CATALOG:
- Product listings with multiple view options (grid, list, card)
- Sophisticated filtering system (price range, category, brand, ratings, availability)
- Smart search with autocomplete, suggestions, and typo tolerance
- Product detail pages with zoom-enabled image galleries
- Related products with AI-powered recommendations
- Wishlist and favorites with heart animations
- Product comparison functionality
- Reviews and ratings system with verified purchases
- Stock status indicators and low-stock alerts
- Product variants (size, color, material) with separate pricing

🛒 SEAMLESS SHOPPING EXPERIENCE:
- Shopping cart with persistent storage across sessions
- Guest checkout and expedited user account checkout
- Multiple payment gateways (Stripe, PayPal, Apple Pay, Google Pay)
- Shipping calculator with real-time rates from multiple carriers
- Order tracking with detailed status updates and notifications
- Email confirmations with invoice generation
- Save for later functionality in cart
- Recently viewed products tracking
- Cart abandonment recovery system
- One-click reorder for returning customers

👤 COMPREHENSIVE USER MANAGEMENT:
- User registration with email verification
- Social login integration (Google, Facebook, Apple, GitHub)
- User profiles with order history and preferences
- Address book with multiple shipping/billing addresses
- Password reset with secure token-based system
- Account dashboard with order tracking
- Loyalty points and rewards program
- User preferences for communication and recommendations
- GDPR-compliant data management and export

🔧 POWERFUL ADMIN FEATURES:
- Comprehensive product management (bulk upload via CSV)
- Order management with fulfillment tracking
- Customer relationship management (CRM) integration
- Advanced sales analytics with charts and insights
- Real-time inventory tracking with automatic alerts
- Discount system (percentage, fixed amount, BOGO, free shipping)
- Coupon management with usage tracking and limits
- Tax calculation for multiple jurisdictions
- Multi-currency support with real-time exchange rates
- Shipping zone management and rate configuration

🎨 PROFESSIONAL DESIGN & UX:
- Mobile-first responsive design with touch optimization
- Fast loading with progressive image loading
- Smooth animations and micro-interactions
- Accessibility compliance (WCAG 2.1 AA)
- SEO-optimized with structured data for rich snippets
- Progressive Web App with offline browsing
- Dark/light theme toggle with user preference memory
- Professional photography guidelines and placeholders
- Consistent brand colors and typography system

🔒 SECURITY & COMPLIANCE:
- PCI DSS compliance for payment processing
- SSL encryption for all transactions
- GDPR compliance with cookie consent
- Fraud detection and prevention
- Secure checkout with encryption
- Data backup and disaster recovery
- Regular security audits and updates"`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>🎯 E-commerce Success Tips</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               <li>• Focus on mobile experience - 70% of shopping is mobile</li>
                               <li>• Implement one-click checkout to reduce cart abandonment</li>
                               <li>• Add social proof with reviews and testimonials</li>
                               <li>• Use high-quality product images with zoom functionality</li>
                               <li>• Optimize page speed - slow sites lose 50% of users</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-2`}>💰 Monetization Strategies</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                               <li>• Start with dropshipping to test market demand</li>
                               <li>• Add subscription boxes for recurring revenue</li>
                               <li>• Implement affiliate marketing programs</li>
                               <li>• Offer premium memberships with exclusive benefits</li>
                               <li>• Create digital products alongside physical ones</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📊 SaaS Application Examples</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Build Software-as-a-Service applications that generate recurring revenue:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Create professional SaaS applications with subscription models:

📋 PROJECT MANAGEMENT PLATFORM:
- Multi-workspace support for agencies and teams
- Kanban boards with customizable workflows
- Gantt charts with critical path analysis
- Time tracking with automatic screenshots (optional)
- Resource allocation and capacity planning
- Client portal for project visibility
- Invoice generation and time billing
- Integration with popular tools (Slack, GitHub, Figma, Google Drive)
- White-label options for agencies
- Advanced reporting and analytics

💼 BUSINESS MANAGEMENT SUITE:
- CRM with lead scoring and pipeline management
- Email marketing with automation sequences
- Invoice and payment processing
- Inventory management with barcode scanning
- Employee time tracking and payroll integration
- Customer support ticketing system
- Knowledge base and documentation
- Multi-location business support
- Custom reporting and dashboard creation
- API access for third-party integrations

🎨 CREATIVE AGENCY PLATFORM:
- Client project galleries with approval workflows
- Brand asset management and style guides
- Proposal and contract generation
- Creative brief collaboration tools
- Version control for design files
- Client feedback and revision tracking
- Resource library with stock assets
- Team collaboration and file sharing
- Billing based on project milestones
- Portfolio showcase with case studies

🏥 HEALTHCARE MANAGEMENT:
- Patient scheduling and appointment management
- Electronic health records (EHR) system
- Telehealth video consultation platform
- Prescription management and pharmacy integration
- Insurance claim processing
- Patient portal with lab results
- HIPAA-compliant messaging system
- Medical billing and coding assistance
- Provider network management
- Analytics and population health insights

💡 SUBSCRIPTION MODEL FEATURES:
- Tiered pricing with feature limitations
- Free trial periods with automatic conversion
- Usage-based billing for API calls or storage
- Annual discount incentives
- Team and enterprise pricing
- Add-on features and integrations
- Usage analytics and optimization suggestions
- Customer success and onboarding flows"`}
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-blue-50 dark:bg-blue-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-blue-200 dark:border-blue-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>🚀 Implementation Strategy & Best Practices</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Master the art of building scalable, profitable applications with proven strategies:
                     </p>
                     
                     <div className="space-y-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📈 Business-First Development Approach</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Build applications with business success as the primary focus:

🎯 MARKET VALIDATION FIRST:
- Start with MVP (Minimum Viable Product) to test demand
- Implement analytics from day one to track user behavior
- A/B testing for critical user flows (signup, checkout, onboarding)
- Customer feedback collection with in-app surveys
- Competitive analysis and feature gap identification
- Pricing strategy testing with different tiers
- User interview integration for qualitative insights

💰 REVENUE OPTIMIZATION:
- Payment gateway optimization for highest conversion rates
- Abandoned cart recovery with email sequences
- Upselling and cross-selling recommendations
- Subscription model optimization with churn reduction
- Customer lifetime value (CLV) tracking and improvement
- Pricing psychology implementation (anchoring, scarcity)
- Referral programs with incentives
- Loyalty programs with gamification elements

📊 DATA-DRIVEN DECISION MAKING:
- Comprehensive analytics dashboard for business metrics
- Cohort analysis for user retention understanding
- Funnel analysis for conversion optimization
- Heat mapping for user interaction insights
- Performance monitoring for technical optimization
- Financial reporting with profit/loss tracking
- Customer segmentation for targeted marketing
- Predictive analytics for demand forecasting

🔄 CONTINUOUS IMPROVEMENT CYCLE:
- Regular feature releases based on user feedback
- Performance optimization monitoring and alerts
- Security updates and vulnerability assessments
- User experience testing and optimization
- Mobile app store optimization (ASO)
- SEO optimization for organic growth
- Social media integration for viral growth
- Content marketing strategy integration"`}
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🏗️ Technical Excellence Framework</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Implement enterprise-grade technical practices for scalability:

⚡ PERFORMANCE OPTIMIZATION:
- Database query optimization with indexing strategies
- CDN implementation for global content delivery
- Caching layers (Redis, Memcached) for frequently accessed data
- Image optimization with multiple format support
- Lazy loading and code splitting for faster page loads
- Service worker implementation for offline capabilities
- Progressive Web App features for mobile-like experience
- Performance monitoring with alerts for degradation

🔒 SECURITY & COMPLIANCE:
- Multi-factor authentication for admin accounts
- Role-based access control (RBAC) implementation
- Data encryption at rest and in transit
- Regular security audits and penetration testing
- OWASP compliance for web application security
- GDPR/CCPA compliance for data privacy
- PCI DSS compliance for payment processing
- Backup and disaster recovery procedures

📱 SCALABILITY ARCHITECTURE:
- Microservices architecture for independent scaling
- Container deployment with Docker and Kubernetes
- Auto-scaling based on traffic patterns
- Load balancing for high availability
- Database sharding for large datasets
- API rate limiting and quota management
- Monitoring and alerting for system health
- Graceful degradation for service failures

🚀 DEPLOYMENT & OPERATIONS:
- CI/CD pipeline with automated testing
- Blue-green deployment for zero-downtime updates
- Feature flags for gradual rollout
- Environment management (dev, staging, production)
- Log aggregation and analysis
- Error tracking and resolution workflows
- Performance profiling and optimization
- Documentation and runbook maintenance"`}
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-green-50 dark:bg-green-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-3`}>💡 Business Application Ideas</h4>
                         <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                           <li>• Restaurant ordering and delivery platform</li>
                           <li>• Real estate property management system</li>
                           <li>• Event planning and ticketing platform</li>
                           <li>• Fitness coaching and meal planning app</li>
                           <li>• Educational course marketplace</li>
                           <li>• Freelancer project management tool</li>
                           <li>• Local service provider directory</li>
                           <li>• Subscription box management platform</li>
                         </ul>
                       </div>
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-blue-50 dark:bg-blue-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-blue-800 dark:text-blue-200'} mb-3`}>🎯 Success Metrics to Track</h4>
                         <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-blue-700 dark:text-blue-300'}`}>
                           <li>• Monthly Recurring Revenue (MRR) growth</li>
                           <li>• Customer Acquisition Cost (CAC)</li>
                           <li>• Customer Lifetime Value (CLV)</li>
                           <li>• Churn rate and retention metrics</li>
                           <li>• Daily/Monthly Active Users (DAU/MAU)</li>
                           <li>• Conversion rates through funnel</li>
                           <li>• Net Promoter Score (NPS)</li>
                           <li>• Time to value for new users</li>
                         </ul>
                       </div>
                     </div>
                   </div>
                 </div>
               )
             },
             {
               id: 'bolt-step-10',
               title: 'Social Media Platform',
               description: 'Build a complete social networking application',
               estimated_time: '55 min',
               difficulty: 'Advanced',
               content: (
                 <div className="space-y-6">
                   <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>📱 Build Next-Generation Social Platforms</h2>
                   
                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-purple-50 dark:bg-purple-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-purple-200 dark:border-purple-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-purple-600 dark:text-purple-400 mb-4`}>🌟 Create Engaging Social Experiences</h3>
                     <p className={`text-base leading-relaxed ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Social media platforms are some of the most complex and engaging applications you can build. From simple 
                       community forums to full-scale social networks, learn to create applications that bring people together, 
                       foster communities, and provide meaningful social interactions in the digital age.
                     </p>
                     
                     <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-white/50'} p-4 rounded-lg mb-6`}>
                       <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-2`}>🎯 Why Social Platforms Are Game-Changers:</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>👥 Community Building:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Connect people with shared interests and goals</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>🚀 Viral Potential:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Network effects can lead to exponential growth</span>
                         </div>
                         <div>
                           <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>📊 Rich Data:</span>
                           <span className={`${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}> Deep insights into user behavior and preferences</span>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🌐 Complete Social Media Platform</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Build a comprehensive social networking platform with modern features:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Create a next-generation social media platform with these advanced features:

👤 ADVANCED USER PROFILES & IDENTITY:
- Customizable profiles with multimedia bios, photo galleries, and links
- Professional vs personal profile modes with different layouts
- Achievement badges and verification systems (blue checkmarks)
- User interests and skill tags for better discovery
- Profile analytics showing views, engagement, and follower growth
- Custom profile themes and color schemes
- Portfolio integration for creators and professionals
- Social proof indicators (mutual connections, endorsements)
- Privacy controls with granular permission settings
- Profile completion gamification with progress indicators

🤝 SOPHISTICATED SOCIAL FEATURES:
- Multi-tier connection system (follow, friends, close friends, professional)
- Smart friend suggestions based on mutual connections and interests
- Group creation with different privacy levels and admin controls
- Event planning with RSVP tracking and reminder systems
- Collaborative playlists, photo albums, and shared content
- Social circles for organizing different friend groups
- Relationship status and family connections
- Social media integrations for cross-platform sharing
- Mentorship and networking features for professional growth
- Community forums with threaded discussions and voting

📝 RICH CONTENT CREATION & SHARING:
- Multi-media posts with text, images, videos, polls, and links
- Story features with 24-hour expiration and highlight reels
- Live streaming with real-time comments and reactions
- Collaborative content creation (co-authored posts, shared stories)
- Content scheduling and draft management
- Rich text editor with formatting, mentions, and hashtags
- Template-based content for consistent branding
- Content series and episodic publishing
- Interactive content (quizzes, surveys, Q&A sessions)
- Voice notes and audio posts for accessibility

🎯 ENGAGEMENT & INTERACTION SYSTEMS:
- Advanced reaction system beyond likes (love, support, celebrate, insightful)
- Nested comment threads with reply notifications
- Real-time typing indicators and read receipts
- Bookmark and save functionality with organized collections
- Share system with custom messages and audience selection
- Mention system with notification preferences
- Tag friends in posts and photos with face recognition
- Emoji reactions to comments and messages
- Social gaming features (challenges, leaderboards)
- Gift and tip system for content creators

🔍 DISCOVERY & CONTENT ALGORITHMS:
- AI-powered personalized feed with engagement prediction
- Trending topics with real-time analysis and location awareness
- Interest-based content recommendations using machine learning
- Explore page with curated content across different categories
- Advanced search with filters, sorting, and saved searches
- Content categorization and topic following
- Location-based discovery for local events and connections
- Hashtag analytics and trending prediction
- Creator spotlight and featured content programs
- Content freshness algorithms to surface new voices

💬 ADVANCED MESSAGING & COMMUNICATION:
- End-to-end encrypted direct messaging with disappearing messages
- Group chats with admin controls, file sharing, and integrations
- Voice and video calling with screen sharing capabilities
- Message reactions, threading, and search functionality
- File and media sharing with cloud storage integration
- Chatbot integration for customer service and automation
- Message translation for international communication
- Voice-to-text and text-to-voice accessibility features
- Message scheduling and reminder systems
- Integration with calendar and task management tools"`}
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-2`}>🎯 Social Platform Success Tips</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                               <li>• Focus on one core feature first (messaging, posting, or sharing)</li>
                               <li>• Implement real-time features for immediate gratification</li>
                               <li>• Add gamification elements to increase engagement</li>
                               <li>• Prioritize mobile experience - social is mobile-first</li>
                               <li>• Create viral loops and sharing incentives</li>
                             </ul>
                           </div>
                           <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-green-50 dark:bg-green-900/30'} p-3 rounded`}>
                             <h5 className={`font-medium text-sm ${theme === 'gradient' ? 'text-white' : 'text-green-800 dark:text-green-200'} mb-2`}>💡 Monetization Ideas</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-green-700 dark:text-green-300'}`}>
                               <li>• Premium subscriptions with exclusive features</li>
                               <li>• Creator monetization with tips and sponsorships</li>
                               <li>• Targeted advertising with user consent</li>
                               <li>• Virtual gifts and digital merchandise</li>
                               <li>• Professional tools for businesses and influencers</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>🏘️ Niche Community Platform Examples</h4>
                         <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} mb-3`}>
                           Create specialized platforms for specific communities and interests:
                         </p>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Build niche social platforms that serve specific communities:

🎨 CREATIVE COMMUNITY PLATFORM:
- Artist portfolio galleries with categorization by medium
- Collaborative art projects and challenges
- Skill-sharing workshops and masterclasses
- Commission marketplace for custom artwork
- Critique and feedback systems with structured reviews
- Art technique tutorials with step-by-step guides
- Exhibition planning and virtual gallery spaces
- Art supply recommendations and affiliate programs
- Mentorship matching between experienced and emerging artists
- Integration with print-on-demand services for merchandise

👨‍💻 DEVELOPER COMMUNITY HUB:
- Code snippet sharing with syntax highlighting
- Project collaboration with version control integration
- Technical Q&A with voting and reputation systems
- Job board with skill-based matching
- Open source project discovery and contribution tracking
- Code review and pair programming features
- Technical blog platform with comment systems
- Hackathon organization and team formation
- Learning path recommendations based on skill gaps
- API documentation and testing playground

🏋️ FITNESS & WELLNESS COMMUNITY:
- Workout sharing with video demonstrations
- Nutrition tracking with meal photo sharing
- Progress photo timelines with privacy controls
- Virtual training sessions and group challenges
- Fitness goal setting with accountability partners
- Expert advice from certified trainers and nutritionists
- Equipment reviews and recommendation engine
- Local gym and class discovery with check-ins
- Achievement tracking with social celebration
- Integration with fitness wearables and health apps

🎓 EDUCATIONAL LEARNING NETWORK:
- Study group formation with collaborative tools
- Note sharing and collaborative study materials
- Peer tutoring marketplace with rating systems
- Academic project collaboration spaces
- Research paper discussion and peer review
- Course recommendation based on learning goals
- Academic event planning and conference networking
- Scholarship and opportunity sharing
- Academic achievement tracking and recognition
- Integration with educational platforms and LMS systems

🌱 SUSTAINABILITY & ENVIRONMENTAL COMMUNITY:
- Eco-friendly lifestyle tips and challenges
- Local environmental project coordination
- Sustainable product reviews and recommendations
- Carbon footprint tracking with reduction goals
- Environmental education and awareness campaigns
- Green business directory and reviews
- Community garden planning and coordination
- Waste reduction tracking and competition
- Environmental news discussion and fact-checking
- Integration with environmental impact measurement tools"`}
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-yellow-50 dark:bg-yellow-900/20'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-yellow-200 dark:border-yellow-800'} rounded-lg p-6`}>
                     <h3 className={`font-semibold text-lg text-yellow-600 dark:text-yellow-400 mb-4`}>🚀 Technical Implementation Strategy</h3>
                     <p className={`text-base ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'} mb-4`}>
                       Master the technical challenges of building scalable social platforms that can handle millions of users:
                     </p>
                     
                     <div className="space-y-4">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>⚡ Real-Time Architecture & Performance</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Implement enterprise-grade real-time social features:

🔄 REAL-TIME DATA SYNCHRONIZATION:
- WebSocket connections for instant message delivery
- Server-sent events for live feed updates
- Real-time notification system with push capabilities
- Live typing indicators and online presence status
- Collaborative editing with operational transformation
- Real-time activity feeds with instant updates
- Live comment threads with immediate visibility
- Real-time reaction aggregation and display
- Instant friend request and connection notifications
- Live streaming with low-latency video delivery

📊 SCALABLE FEED ALGORITHMS:
- Timeline generation with personalization algorithms
- Content ranking based on engagement prediction
- Real-time trending topic detection and analysis
- Interest graph building for content recommendations
- Social graph analysis for friend suggestions
- Content freshness scoring with decay algorithms
- Engagement prediction using machine learning models
- A/B testing framework for algorithm optimization
- Content diversity algorithms to avoid echo chambers
- Spam and low-quality content detection systems

💾 DATA MANAGEMENT & CACHING:
- Distributed caching for frequently accessed content
- Database sharding strategies for user data
- Content delivery network optimization for media
- Edge caching for global content distribution
- Session management with distributed storage
- Real-time analytics data pipeline
- Event sourcing for audit trails and rollbacks
- Data archiving strategies for inactive content
- Search index optimization for content discovery
- Backup and disaster recovery for critical data

🔒 PRIVACY & SECURITY ARCHITECTURE:
- End-to-end encryption for private communications
- Content moderation with AI and human review
- Privacy-preserving analytics and data collection
- Secure authentication with multi-factor options
- Account security monitoring and threat detection
- Content ownership and intellectual property protection
- GDPR compliance with data portability and deletion
- Age verification and parental controls
- Harassment detection and automatic intervention
- Security audits and vulnerability assessment programs"`}
                         </div>
                       </div>
                       
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-white dark:bg-gray-800'} p-4 rounded-lg border`}>
                         <h4 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'} mb-3`}>📈 Growth & Engagement Optimization</h4>
                         <div className={`${theme === 'gradient' ? 'bg-gray-600/30' : 'bg-gray-100 dark:bg-gray-700'} p-3 rounded text-sm font-mono mb-4`}>
                           {`"Build viral growth mechanisms and engagement systems:

🎯 USER ACQUISITION & ONBOARDING:
- Social proof integration with friend import and suggestions
- Viral invitation systems with incentives and tracking
- Progressive onboarding with guided tutorials
- Interest-based onboarding for personalized experience
- Social login integration with profile pre-population
- Referral programs with rewards and tracking
- Content seeding strategies for early user engagement
- Influencer and creator recruitment programs
- Cross-platform sharing and viral loop optimization
- Landing page optimization for conversion

🔥 ENGAGEMENT & RETENTION STRATEGIES:
- Gamification with points, badges, and leaderboards
- Daily challenges and streaks to build habits
- Push notification optimization for re-engagement
- Email campaigns for inactive user re-activation
- Personalized content recommendations and curation
- Social proof notifications (friend activity, trending content)
- FOMO (fear of missing out) mechanics with limited-time content
- Community events and virtual meetups
- User-generated content campaigns and contests
- Achievement systems with social sharing capabilities

📊 ANALYTICS & OPTIMIZATION FRAMEWORK:
- User behavior tracking with privacy-compliant analytics
- Cohort analysis for understanding user lifecycle
- A/B testing platform for feature and design optimization
- Funnel analysis for conversion rate optimization
- Engagement metrics tracking and alerting
- Content performance analytics for creators
- Social graph analysis for network health
- Churn prediction and prevention strategies
- Revenue analytics for monetization optimization
- Real-time dashboard for platform health monitoring"`}
                         </div>
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-yellow-50 dark:bg-yellow-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-yellow-800 dark:text-yellow-200'} mb-3`}>🏗️ Development Phases</h4>
                         <div className="space-y-3">
                           <div>
                             <h5 className={`text-xs font-medium ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700'} mb-1`}>Phase 1: Foundation (Week 1-2)</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-600 dark:text-yellow-300'}`}>
                               <li>• User authentication & basic profiles</li>
                               <li>• Simple posting & timeline</li>
                               <li>• Like & comment system</li>
                               <li>• Follow/unfollow functionality</li>
                             </ul>
                           </div>
                           <div>
                             <h5 className={`text-xs font-medium ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700'} mb-1`}>Phase 2: Core Features (Week 3-4)</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-600 dark:text-yellow-300'}`}>
                               <li>• Real-time messaging & notifications</li>
                               <li>• Media uploads & processing</li>
                               <li>• Advanced search & discovery</li>
                               <li>• Groups & communities</li>
                             </ul>
                           </div>
                           <div>
                             <h5 className={`text-xs font-medium ${theme === 'gradient' ? 'text-yellow-300' : 'text-yellow-700'} mb-1`}>Phase 3: Advanced (Week 5-6)</h5>
                             <ul className={`text-xs space-y-1 ${theme === 'gradient' ? 'text-gray-300' : 'text-yellow-600 dark:text-yellow-300'}`}>
                               <li>• Feed algorithms & personalization</li>
                               <li>• Analytics & insights</li>
                               <li>• Monetization features</li>
                               <li>• Advanced moderation</li>
                             </ul>
                           </div>
                         </div>
                       </div>
                       <div className={`${theme === 'gradient' ? 'bg-gray-700/30' : 'bg-purple-50 dark:bg-purple-900/30'} p-4 rounded-lg`}>
                         <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-purple-800 dark:text-purple-200'} mb-3`}>💰 Revenue Strategies</h4>
                         <ul className={`text-xs space-y-2 ${theme === 'gradient' ? 'text-gray-300' : 'text-purple-700 dark:text-purple-300'}`}>
                           <li>
                             <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>Premium Subscriptions:</span>
                             <span className="text-xs"> Advanced features, larger storage, priority support</span>
                           </li>
                           <li>
                             <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>Creator Economy:</span>
                             <span className="text-xs"> Revenue sharing, tips, sponsorship matching</span>
                           </li>
                           <li>
                             <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>Business Tools:</span>
                             <span className="text-xs"> Analytics, advertising, customer management</span>
                           </li>
                           <li>
                             <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>Virtual Goods:</span>
                             <span className="text-xs"> Stickers, themes, badges, profile upgrades</span>
                           </li>
                           <li>
                             <span className={`font-medium ${theme === 'gradient' ? 'text-purple-300' : 'text-purple-600'}`}>Events & Courses:</span>
                             <span className="text-xs"> Paid workshops, networking events, education</span>
                           </li>
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