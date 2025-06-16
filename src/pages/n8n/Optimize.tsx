import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Settings, 
  BarChart2, 
  Zap, 
  GitBranch, 
  Clock,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  TrendingUp,
  Shield,
  Cpu,
  Database,
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

const N8nOptimize: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('performance');
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
    { id: 'performance', name: 'Performance', icon: '⚡' },
    { id: 'errors', name: 'Error Handling', icon: '🛡️' },
    { id: 'resources', name: 'Resources', icon: '🖥️' },
    { id: 'logic', name: 'Workflow Logic', icon: '🧩' },
    { id: 'caching', name: 'Caching', icon: '📦' },
    { id: 'scheduling', name: 'Scheduling', icon: '⏰' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ];

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    performance: [
      {
        id: 'analyze-execution-times',
        title: 'Analyze execution times',
        description: 'Review workflow execution logs and identify slow nodes',
        completed: false
      },
      {
        id: 'identify-bottlenecks',
        title: 'Identify bottlenecks',
        description: 'Find nodes that consistently take longer to execute',
        completed: false
      },
      {
        id: 'optimize-data-flow',
        title: 'Optimize data flow',
        description: 'Minimize data transformations and unnecessary operations',
        completed: false
      },
      {
        id: 'implement-parallel-execution',
        title: 'Implement parallel execution',
        description: 'Configure nodes to run in parallel where possible',
        completed: false
      },
      {
        id: 'setup-performance-monitoring',
        title: 'Set up performance monitoring',
        description: 'Implement alerts and metrics for performance tracking',
        completed: false
      },
      {
        id: 'test-performance-improvements',
        title: 'Test performance improvements',
        description: 'Validate that optimizations actually improve performance',
        completed: false
      }
    ],
    errors: [
      {
        id: 'audit-error-prone-nodes',
        title: 'Audit error-prone nodes',
        description: 'Identify nodes most likely to fail or cause errors',
        completed: false
      },
      {
        id: 'implement-try-catch-blocks',
        title: 'Implement try-catch blocks',
        description: 'Add error handling around critical operations',
        completed: false
      },
      {
        id: 'configure-retry-logic',
        title: 'Configure retry logic',
        description: 'Set up automatic retries for transient failures',
        completed: false
      },
      {
        id: 'create-fallback-workflows',
        title: 'Create fallback workflows',
        description: 'Design alternative paths for when primary operations fail',
        completed: false
      },
      {
        id: 'setup-error-alerts',
        title: 'Set up error alerts',
        description: 'Configure notifications for critical workflow failures',
        completed: false
      },
      {
        id: 'document-error-scenarios',
        title: 'Document error scenarios',
        description: 'Create documentation for known error cases and solutions',
        completed: false
      }
    ],
    resources: [
      {
        id: 'monitor-memory-usage',
        title: 'Monitor memory usage',
        description: 'Track memory consumption during workflow execution',
        completed: false
      },
      {
        id: 'optimize-data-processing',
        title: 'Optimize data processing',
        description: 'Reduce memory footprint of data operations',
        completed: false
      },
      {
        id: 'implement-resource-limits',
        title: 'Implement resource limits',
        description: 'Set appropriate CPU and memory limits for workflows',
        completed: false
      },
      {
        id: 'schedule-resource-intensive-workflows',
        title: 'Schedule resource-intensive workflows',
        description: 'Run heavy workflows during off-peak hours',
        completed: false
      },
      {
        id: 'cleanup-temporary-data',
        title: 'Clean up temporary data',
        description: 'Remove temporary files and data after processing',
        completed: false
      }
    ],
    logic: [
      {
        id: 'review-conditional-logic',
        title: 'Review conditional logic',
        description: 'Analyze if/else conditions and switch statements',
        completed: false
      },
      {
        id: 'simplify-complex-conditions',
        title: 'Simplify complex conditions',
        description: 'Break down complex conditional expressions',
        completed: false
      },
      {
        id: 'optimize-data-transformations',
        title: 'Optimize data transformations',
        description: 'Streamline data mapping and transformation logic',
        completed: false
      },
      {
        id: 'eliminate-redundant-operations',
        title: 'Eliminate redundant operations',
        description: 'Remove unnecessary duplicate processing steps',
        completed: false
      },
      {
        id: 'implement-efficient-loops',
        title: 'Implement efficient loops',
        description: 'Optimize iteration patterns and data processing loops',
        completed: false
      }
    ],
    caching: [
      {
        id: 'identify-cacheable-data',
        title: 'Identify cacheable data',
        description: 'Find data that can be cached to improve performance',
        completed: false
      },
      {
        id: 'implement-cache-strategy',
        title: 'Implement cache strategy',
        description: 'Choose appropriate caching mechanisms and TTL values',
        completed: false
      },
      {
        id: 'setup-cache-invalidation',
        title: 'Set up cache invalidation',
        description: 'Configure when and how cached data should be refreshed',
        completed: false
      },
      {
        id: 'monitor-cache-hit-rates',
        title: 'Monitor cache hit rates',
        description: 'Track cache effectiveness and optimization opportunities',
        completed: false
      },
      {
        id: 'optimize-cache-size',
        title: 'Optimize cache size',
        description: 'Balance cache size with available memory resources',
        completed: false
      }
    ],
    scheduling: [
      {
        id: 'analyze-execution-patterns',
        title: 'Analyze execution patterns',
        description: 'Review when workflows run and their frequency',
        completed: false
      },
      {
        id: 'optimize-trigger-timing',
        title: 'Optimize trigger timing',
        description: 'Adjust cron schedules and trigger frequencies',
        completed: false
      },
      {
        id: 'implement-smart-queuing',
        title: 'Implement smart queuing',
        description: 'Set up intelligent workflow queuing and prioritization',
        completed: false
      },
      {
        id: 'setup-load-balancing',
        title: 'Set up load balancing',
        description: 'Distribute workflow execution across available resources',
        completed: false
      },
      {
        id: 'configure-execution-windows',
        title: 'Configure execution windows',
        description: 'Define optimal time windows for workflow execution',
        completed: false
      }
    ],
    analytics: [
      {
        id: 'setup-execution-tracking',
        title: 'Set up execution tracking',
        description: 'Implement comprehensive workflow execution logging',
        completed: false
      },
      {
        id: 'create-performance-dashboards',
        title: 'Create performance dashboards',
        description: 'Build dashboards to visualize workflow metrics',
        completed: false
      },
      {
        id: 'implement-success-rate-monitoring',
        title: 'Implement success rate monitoring',
        description: 'Track workflow success and failure rates over time',
        completed: false
      },
      {
        id: 'setup-trend-analysis',
        title: 'Set up trend analysis',
        description: 'Analyze performance trends and identify patterns',
        completed: false
      },
      {
        id: 'configure-alerting-thresholds',
        title: 'Configure alerting thresholds',
        description: 'Set up alerts for performance degradation',
        completed: false
      }
    ]
  };

  const learningPaths: { [key: string]: LearningPath } = {
    performance: {
      id: 'performance',
      title: 'Performance Optimization',
      icon: <Zap className="h-5 w-5" />,
      description: 'Optimize n8n workflow performance and execution speed',
      sections: [
        {
          id: 'foundation',
          title: '⚡ Foundation',
          description: 'Performance optimization basics',
          steps: [
            {
              id: 'performance-step-1',
              title: 'Performance Analysis',
              description: 'Analyze workflow execution times and bottlenecks',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance analysis content</div>
            },
            {
              id: 'performance-step-2',
              title: 'Bottleneck Identification',
              description: 'Identify and understand performance bottlenecks',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Bottleneck identification content</div>
            }
          ]
        },
        {
          id: 'optimization',
          title: '🚀 Optimization',
          description: 'Apply performance optimizations',
          steps: [
            {
              id: 'performance-step-3',
              title: 'Parallel Processing',
              description: 'Configure nodes for parallel execution',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Parallel processing content</div>
            },
            {
              id: 'performance-step-4',
              title: 'Memory Optimization',
              description: 'Optimize memory usage and data handling',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Memory optimization content</div>
            },
            {
              id: 'performance-step-5',
              title: 'Data Flow Optimization',
              description: 'Streamline data processing and reduce overhead',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data flow optimization content</div>
            },
            {
              id: 'performance-step-6',
              title: 'Node Configuration Tuning',
              description: 'Optimize individual node settings for performance',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Node configuration content</div>
            }
          ]
        },
        {
          id: 'monitoring',
          title: '📊 Monitoring',
          description: 'Monitor and maintain performance',
          steps: [
            {
              id: 'performance-step-7',
              title: 'Performance Metrics',
              description: 'Set up performance monitoring and alerts',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance metrics content</div>
            },
            {
              id: 'performance-step-8',
              title: 'Optimization Patterns',
              description: 'Learn common optimization patterns',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Optimization patterns content</div>
            },
            {
              id: 'performance-step-9',
              title: 'Performance Testing',
              description: 'Implement performance testing strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance testing content</div>
            }
          ]
        },
        {
          id: 'advanced',
          title: '🎯 Advanced',
          description: 'Advanced performance techniques',
          steps: [
            {
              id: 'performance-step-10',
              title: 'Load Testing',
              description: 'Perform comprehensive load testing',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Load testing content</div>
            },
            {
              id: 'performance-step-11',
              title: 'Scalability Planning',
              description: 'Plan for workflow scalability and growth',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Scalability planning content</div>
            },
            {
              id: 'performance-step-12',
              title: 'Performance Troubleshooting',
              description: 'Advanced troubleshooting techniques',
              estimated_time: '50 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance troubleshooting content</div>
            }
          ]
        }
      ]
    },
    errors: {
      id: 'errors',
      title: 'Error Handling Optimization',
      icon: <Shield className="h-5 w-5" />,
      description: 'Implement robust error handling and recovery',
      sections: [
        {
          id: 'foundation',
          title: '🛡️ Foundation',
          description: 'Error handling basics',
          steps: [
            {
              id: 'error-step-1',
              title: 'Error Detection',
              description: 'Identify and categorize workflow errors',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error detection content</div>
            },
            {
              id: 'error-step-2',
              title: 'Error Classification',
              description: 'Categorize errors by type and severity',
              estimated_time: '15 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error classification content</div>
            },
            {
              id: 'error-step-3',
              title: 'Try-Catch Implementation',
              description: 'Add try-catch blocks to critical operations',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Try-catch implementation content</div>
            }
          ]
        },
        {
          id: 'recovery',
          title: '🔄 Recovery',
          description: 'Implement recovery mechanisms',
          steps: [
            {
              id: 'error-step-4',
              title: 'Retry Strategies',
              description: 'Configure intelligent retry mechanisms',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Retry strategies content</div>
            },
            {
              id: 'error-step-5',
              title: 'Fallback Workflows',
              description: 'Create alternative execution paths',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Fallback workflows content</div>
            },
            {
              id: 'error-step-6',
              title: 'Circuit Breakers',
              description: 'Implement circuit breaker patterns',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Circuit breakers content</div>
            }
          ]
        },
        {
          id: 'monitoring',
          title: '📊 Monitoring',
          description: 'Monitor and alert on errors',
          steps: [
            {
              id: 'error-step-7',
              title: 'Error Logging',
              description: 'Implement comprehensive error logging',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error logging content</div>
            },
            {
              id: 'error-step-8',
              title: 'Alert Configuration',
              description: 'Set up error alerts and notifications',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert configuration content</div>
            },
            {
              id: 'error-step-9',
              title: 'Error Analytics',
              description: 'Analyze error patterns and trends',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Error analytics content</div>
            }
          ]
        }
      ]
    },
    resources: {
      id: 'resources',
      title: 'Resource Optimization',
      icon: <Cpu className="h-5 w-5" />,
      description: 'Optimize CPU and memory resource usage',
      sections: [
        {
          id: 'foundation',
          title: '🖥️ Foundation',
          description: 'Resource optimization basics',
          steps: [
            {
              id: 'resource-step-1',
              title: 'Resource Monitoring',
              description: 'Monitor CPU and memory usage patterns',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Resource monitoring content</div>
            },
            {
              id: 'resource-step-2',
              title: 'Resource Profiling',
              description: 'Profile workflow resource consumption',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Resource profiling content</div>
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Apply resource optimizations',
          steps: [
            {
              id: 'resource-step-3',
              title: 'Memory Management',
              description: 'Optimize memory usage and garbage collection',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Memory management content</div>
            },
            {
              id: 'resource-step-4',
              title: 'CPU Optimization',
              description: 'Optimize CPU-intensive operations',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>CPU optimization content</div>
            },
            {
              id: 'resource-step-5',
              title: 'Resource Limits',
              description: 'Set appropriate resource limits and quotas',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Resource limits content</div>
            }
          ]
        },
        {
          id: 'scaling',
          title: '📈 Scaling',
          description: 'Scale resources efficiently',
          steps: [
            {
              id: 'resource-step-6',
              title: 'Horizontal Scaling',
              description: 'Scale workflows across multiple instances',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Horizontal scaling content</div>
            },
            {
              id: 'resource-step-7',
              title: 'Resource Pooling',
              description: 'Implement resource pooling strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Resource pooling content</div>
            }
          ]
        }
      ]
    },
    logic: {
      id: 'logic',
      title: 'Workflow Logic Optimization',
      icon: <GitBranch className="h-5 w-5" />,
      description: 'Optimize conditional logic and workflow branching',
      sections: [
        {
          id: 'foundation',
          title: '🧩 Foundation',
          description: 'Logic optimization basics',
          steps: [
            {
              id: 'logic-step-1',
              title: 'Logic Analysis',
              description: 'Analyze current workflow logic and branching',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Logic analysis content</div>
            },
            {
              id: 'logic-step-2',
              title: 'Conditional Optimization',
              description: 'Optimize if/else conditions and switches',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Conditional optimization content</div>
            },
            {
              id: 'logic-step-3',
              title: 'Decision Tree Simplification',
              description: 'Simplify complex decision trees and logic paths',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Decision tree content</div>
            }
          ]
        },
        {
          id: 'transformation',
          title: '🔄 Transformation',
          description: 'Optimize data transformations',
          steps: [
            {
              id: 'logic-step-4',
              title: 'Data Mapping Optimization',
              description: 'Streamline data mapping and transformation logic',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data mapping content</div>
            },
            {
              id: 'logic-step-5',
              title: 'Expression Optimization',
              description: 'Optimize complex expressions and calculations',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Expression optimization content</div>
            },
            {
              id: 'logic-step-6',
              title: 'Loop Optimization',
              description: 'Optimize iteration patterns and data processing loops',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Loop optimization content</div>
            }
          ]
        },
        {
          id: 'flow-control',
          title: '🎯 Flow Control',
          description: 'Advanced flow control optimization',
          steps: [
            {
              id: 'logic-step-7',
              title: 'Branching Strategies',
              description: 'Implement efficient branching strategies',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Branching strategies content</div>
            },
            {
              id: 'logic-step-8',
              title: 'Redundancy Elimination',
              description: 'Remove unnecessary duplicate processing steps',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Redundancy elimination content</div>
            },
            {
              id: 'logic-step-9',
              title: 'Logic Testing',
              description: 'Test and validate optimized logic flows',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Logic testing content</div>
            }
          ]
        }
      ]
    },
    caching: {
      id: 'caching',
      title: 'Caching Optimization',
      icon: <Database className="h-5 w-5" />,
      description: 'Implement intelligent caching strategies',
      sections: [
        {
          id: 'foundation',
          title: '📦 Foundation',
          description: 'Caching optimization basics',
          steps: [
            {
              id: 'cache-step-1',
              title: 'Cache Analysis',
              description: 'Identify cacheable data and operations',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache analysis content</div>
            },
            {
              id: 'cache-step-2',
              title: 'Cache Strategy Design',
              description: 'Design effective caching strategies and patterns',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache strategy content</div>
            },
            {
              id: 'cache-step-3',
              title: 'Cache Key Design',
              description: 'Design optimal cache key structures',
              estimated_time: '20 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache key design content</div>
            }
          ]
        },
        {
          id: 'implementation',
          title: '🔧 Implementation',
          description: 'Implement caching mechanisms',
          steps: [
            {
              id: 'cache-step-4',
              title: 'In-Memory Caching',
              description: 'Implement in-memory caching solutions',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>In-memory caching content</div>
            },
            {
              id: 'cache-step-5',
              title: 'Distributed Caching',
              description: 'Set up distributed caching systems',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Distributed caching content</div>
            },
            {
              id: 'cache-step-6',
              title: 'Cache Invalidation',
              description: 'Implement intelligent cache invalidation strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache invalidation content</div>
            }
          ]
        },
        {
          id: 'optimization',
          title: '🚀 Optimization',
          description: 'Optimize caching performance',
          steps: [
            {
              id: 'cache-step-7',
              title: 'Cache Hit Optimization',
              description: 'Optimize cache hit rates and performance',
              estimated_time: '25 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache hit optimization content</div>
            },
            {
              id: 'cache-step-8',
              title: 'Memory Management',
              description: 'Optimize cache memory usage and eviction',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache memory management content</div>
            },
            {
              id: 'cache-step-9',
              title: 'Cache Monitoring',
              description: 'Monitor cache performance and effectiveness',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Cache monitoring content</div>
            }
          ]
        }
      ]
    },
    scheduling: {
      id: 'scheduling',
      title: 'Scheduling Optimization',
      icon: <Clock className="h-5 w-5" />,
      description: 'Optimize workflow scheduling and timing',
      sections: [
        {
          id: 'foundation',
          title: '⏰ Foundation',
          description: 'Scheduling optimization basics',
          steps: [
            {
              id: 'schedule-step-1',
              title: 'Schedule Analysis',
              description: 'Analyze current scheduling patterns and bottlenecks',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Schedule analysis content</div>
            },
            {
              id: 'schedule-step-2',
              title: 'Trigger Optimization',
              description: 'Optimize workflow triggers and scheduling frequency',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Trigger optimization content</div>
            },
            {
              id: 'schedule-step-3',
              title: 'Queue Management',
              description: 'Implement efficient queue management strategies',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Queue management content</div>
            }
          ]
        },
        {
          id: 'execution',
          title: '🎯 Execution',
          description: 'Optimize execution timing',
          steps: [
            {
              id: 'schedule-step-4',
              title: 'Parallel Processing',
              description: 'Implement parallel workflow execution strategies',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Parallel processing content</div>
            },
            {
              id: 'schedule-step-5',
              title: 'Load Balancing',
              description: 'Balance workload across execution windows',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Load balancing content</div>
            },
            {
              id: 'schedule-step-6',
              title: 'Priority Management',
              description: 'Implement workflow priority systems',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Priority management content</div>
            }
          ]
        },
        {
          id: 'automation',
          title: '🤖 Automation',
          description: 'Advanced scheduling automation',
          steps: [
            {
              id: 'schedule-step-7',
              title: 'Dynamic Scheduling',
              description: 'Implement dynamic scheduling based on conditions',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Dynamic scheduling content</div>
            },
            {
              id: 'schedule-step-8',
              title: 'Resource-Aware Scheduling',
              description: 'Schedule workflows based on resource availability',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Resource-aware scheduling content</div>
            },
            {
              id: 'schedule-step-9',
              title: 'Schedule Monitoring',
              description: 'Monitor and analyze scheduling performance',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Schedule monitoring content</div>
            },
            {
              id: 'schedule-step-10',
              title: 'Auto-Scaling Schedules',
              description: 'Implement auto-scaling scheduling patterns',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Auto-scaling schedules content</div>
            }
          ]
        }
      ]
    },
    analytics: {
      id: 'analytics',
      title: 'Analytics Optimization',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Optimize workflow analytics and reporting',
      sections: [
        {
          id: 'foundation',
          title: '📊 Foundation',
          description: 'Analytics optimization basics',
          steps: [
            {
              id: 'analytics-step-1',
              title: 'Analytics Setup',
              description: 'Set up comprehensive analytics infrastructure',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Analytics setup content</div>
            },
            {
              id: 'analytics-step-2',
              title: 'Metrics Collection',
              description: 'Implement comprehensive metrics collection',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Metrics collection content</div>
            },
            {
              id: 'analytics-step-3',
              title: 'Data Pipeline Design',
              description: 'Design efficient data pipelines for analytics',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data pipeline content</div>
            }
          ]
        },
        {
          id: 'visualization',
          title: '📈 Visualization',
          description: 'Create effective visualizations',
          steps: [
            {
              id: 'analytics-step-4',
              title: 'Dashboard Creation',
              description: 'Create comprehensive analytics dashboards',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Dashboard creation content</div>
            },
            {
              id: 'analytics-step-5',
              title: 'Real-time Monitoring',
              description: 'Implement real-time monitoring solutions',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Real-time monitoring content</div>
            },
            {
              id: 'analytics-step-6',
              title: 'Alert Systems',
              description: 'Set up intelligent alerting systems',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Alert systems content</div>
            }
          ]
        },
        {
          id: 'analysis',
          title: '🔍 Analysis',
          description: 'Advanced data analysis',
          steps: [
            {
              id: 'analytics-step-7',
              title: 'Trend Analysis',
              description: 'Implement trend analysis and forecasting',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Trend analysis content</div>
            },
            {
              id: 'analytics-step-8',
              title: 'Performance Benchmarking',
              description: 'Establish performance benchmarks and KPIs',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Performance benchmarking content</div>
            },
            {
              id: 'analytics-step-9',
              title: 'Anomaly Detection',
              description: 'Implement automated anomaly detection',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Anomaly detection content</div>
            }
          ]
        },
        {
          id: 'reporting',
          title: '📋 Reporting',
          description: 'Automated reporting systems',
          steps: [
            {
              id: 'analytics-step-10',
              title: 'Automated Reports',
              description: 'Create automated reporting workflows',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Automated reports content</div>
            },
            {
              id: 'analytics-step-11',
              title: 'Custom Metrics',
              description: 'Develop custom business metrics and KPIs',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Custom metrics content</div>
            },
            {
              id: 'analytics-step-12',
              title: 'Data Export & Integration',
              description: 'Set up data export and third-party integrations',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Data export content</div>
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
            Optimize Workflows
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Fine-tune your n8n workflows for maximum performance and reliability
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
          <Settings className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
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
                  Optimization Checklist
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

export default N8nOptimize;